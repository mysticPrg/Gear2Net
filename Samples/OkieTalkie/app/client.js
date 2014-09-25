define([ 'G2NNetwork', 'app/player' ], function(G2NNetwork, Player) {
	var Client = function Client(id, ip, port, callback) {
		this.id = id;
		this.ip = ip;
		this.port = port;
		
		this.player = new Player();

		this.addr = null;
		this.socket = null;
		this.onMessageListenerKey = null;
		
		this.onMessage = onMessage;

		this.callback = {};

		this.callback.connect = null;
		this.callback.close = null;
		
		this.callback.requestMic = null;

		this.callback.start = onStartMsg;
		this.callback.data = onDataMsg;
		this.callback.end = onEndMsg;

		if (callback) {
			for ( var key in callback ) {
				this.callback[key] = callback[key];
			}
		}
		
		var self = this;
		tizen.filesystem.resolve(
			'documents', 
			function(dir) {
				self.documentsDir = dir;
			}, function(e) {
				console.log("Error" + e.message);
			}, "rw"
		);
	};
	
	Client.prototype.send = function send(msg, callback) {
		this.socket.sendMessage(JSON.stringify(msg), callback);
	};

	Client.prototype.connect = function connect() {
		var self = this;

		self.addr = new G2NNetwork.Socket.Address(self.ip, self.port,
			function() {
				self.socket = new G2NNetwork.Socket(self.addr,
					G2NNetwork.Socket.Protocol.UDP, function() {
						self.socket.addReceiveMessageListener(function(msg) {
							self.onMessage(self, msg);
						}, function(key) {
								self.onMessageListenerKey = key;
								self.socket.openAndListen();
								
								self.send({
									type: 'connect',
									id: self.id
								});
							});
					});
			});
	};
	
	Client.prototype.sendRequestMic = function sendRequestMic() {
		this.send({
			type: 'requestMic',
			id: this.id
		});
	};
	
	Client.prototype.sendRadio = function sendRadio() {
		
		var self = this;
		
		tizen.filesystem.resolve(
			'file:///opt/usr/media/Sounds/rec.mp4',
			function (file) {
				file.openStream('r', function(fs) {
					
					var bytes;
					function sendBytes() {
						if ( fs.eof ) {
							self.send({
								id: self.id,
								type: 'end'
							});
							
							fs.close();
							return;
						}

						bytes = fs.readBytes(1024);
						self.send({
							id: self.id,
							type: 'data',
							data: bytes,
							lenfth: bytes.length
						}, sendBytes);
					}
					
					self.send({
						id: self.id,
						type: 'start'
					}, sendBytes);
				});
			}, function (err) {
				if ( err ) {
					console.log('Error: ' + err.message);
				}
			},
			'r'
		);	
	};
	
	function onMessage(client, msg) {
		var json = JSON.parse(msg);
		console.log(msg);
		
		var callback = client.callback[json.type];
		if ( callback && typeof(callback) === 'function' ) {
			callback(client, json);
		}
	}
	
	function onStartMsg(client, msg) {
		console.log('onStartMsg :' + JSON.stringify(msg));
		
		if ( msg.id == client.id ) {
			return;
		}
		
		client.documentsDir.deleteFile('file:///opt/usr/media/Documents/receive.mp4');
		client.receiveFile = client.documentsDir.createFile("receive.mp4");
		client.receiveFileStream = null;
		
		client.receiveFile.openStream('w', function(fs) {
			client.receiveFileStream = fs;
		});
	}
	
	function onDataMsg(client, msg) {
		console.log('onDataMsg :' + JSON.stringify(msg));
		
		if ( msg.id == client.id ) {
			return;
		}
		
		if ( client.receiveFileStream ) {
			client.receiveFileStream.writeBytes(msg.data);
		}
	}

	function onEndMsg(client, msg) {
		console.log('onEndMsg :' + JSON.stringify(msg));
		
		if ( msg.id == client.id ) {
			return;
		}
		
		if ( client.receiveFileStream ) {
			client.receiveFileStream.close();
		}
		
		client.player.play();
	}

	return Client;
});
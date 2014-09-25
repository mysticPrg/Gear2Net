define(['jquery', 'G2NNetwork'], function($, G2NNetwork) {
	var addr = null;
	var socket = null;
	
	var RobbyClient = function Client(ip, port, callback) {
		this.ip = ip;
		this.port = port;
		
		this.id = null;

		this.addr = null;
		this.socket = null;
		this.onMessageListenerKey = null;
		
		this.onMessage = onMessage;

		this.callback = {};

//		this.callback.init = onInitMsg;
//		this.callback.join = onJoinMsg;
//		this.callback.close = onCloseMsg;
//		this.callback.exit = onExitMsg;

		if (callback) {
			for ( var key in callback ) {
				this.callback[key] = callback[key];
			}
		}
		
		var self = this;
	};
	
	RobbyClient.prototype.send = function send(msg, callback) {
		this.socket.sendMessage(JSON.stringify(msg), callback);
	};

	RobbyClient.prototype.connect = function connect() {
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
								
								self.sendInit();
							});
					});
			});
	};
	
	RobbyClient.prototype.sendInit = function sendInit() {
		this.send({
			type: 'init'
		});
	};
	
	RobbyClient.prototype.sendJoin = function sendJoin(channel) {
		var self = this;
		
		this.send({
			type: 'join',
			id: self.id,
			channel: channel
		});
	};

	RobbyClient.prototype.sendExit = function sendExit(channel) {
		var self = this;
		
		this.send({
			type: 'exit',
			id: self.id,
			channel: channel
		});
	};

	RobbyClient.prototype.sendClose = function sendClose() {
		this.send({
			type: 'close'
		});
	};
	
	function onMessage(client, msg) {
		var json = JSON.parse(msg);
		console.log(msg);
		
		switch ( json.type ) {
		case 'init':
			client.id = json.id;
			break;
		}
		
		var callback = client.callback[json.type];
		if ( callback && typeof(callback) === 'function' ) {
			callback(client, json);
		}
	}
	
	return RobbyClient;
	
});
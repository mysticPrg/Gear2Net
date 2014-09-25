/**
 * Created by mysticPrg on 2014-09-23.
 */

var dgram = require('dgram');

var RoomServer = function RoomServer(room) {
	var self = this;

	this.socket = dgram.createSocket('udp4');
	this.port = room.port;
	this.room = room;

	this.socket.on('message', function (msg, rinfo) {
		console.log('OnMessage: ' + msg.toString() + ' from ' + rinfo.address + ':' + rinfo.port);
		parseAndExecute(self, msg, rinfo);
	});
};

RoomServer.prototype.start = function start() {
	this.socket.bind(this.port);

	console.log('Start roomServer at ' + this.port);
};

function parseAndExecute(server, msg, rinfo) {
	var strMsg = msg.toString();
	var json = JSON.parse(strMsg);

	switch (json.type) {

		case 'connect':
			onConnect(server, json, rinfo);
			break;

		case 'requestMic':
			onRequestMic(server, json, rinfo);
			break;

		case 'start':
			onStart(server, json, rinfo);
			break;

		case 'data':
			onData(server, json, rinfo);
			break;

		case 'end':
			onEnd(server, json, rinfo);
			break;
	}
}

function onConnect(server, msg, rinfo) {
	server.room.users[msg.id].room_port = rinfo.port;

	var sendMsg = {
		type: 'connect'
	};
	server.send(sendMsg);
}

function onRequestMic(server, msg, rinfo) {
	if ( server.room.mic ) {
		server.send({
			type: 'requestMic',
			id: null
		});
	} else {
		server.room.mic = msg.id;
		server.send({
			type: 'requestMic',
			id: msg.id
		});
	}
}

function onStart(server, msg, rinfo) {
	server.send(msg);
}

function onData(server, msg, rinfo) {
	server.send(msg);
}

function onEnd(server, msg, rinfo) {

	server.room.mic = null;
	server.send(msg);
}

RoomServer.prototype.send = function send(msg) {
	var strMsg = JSON.stringify(msg);
	var buf = new Buffer(strMsg);

	for (var key in this.room.users) {
		this.socket.send(buf, 0, buf.length, this.room.users[key].room_port, this.room.users[key].ip, onErr);
	}
};

function onErr(err, bytes) {
	if (err)
		console.log('Error: ' + err.message);
}

module.exports = RoomServer;
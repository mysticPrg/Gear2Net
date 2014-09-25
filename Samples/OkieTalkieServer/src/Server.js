/**
 * Created by mysticPrg on 2014-09-16.
 */

var dgram = require('dgram');
var UserTable = require('./UserTable');
var User = require('./User');
var ChannelManager = require('./ChannelManager');

var Server = function Server(port) {
	var self = this;
	this.socket = dgram.createSocket('udp4');
	this.port = port;
	this.userTable = new UserTable();
	this.channelManager = new ChannelManager();

	this.socket.on('message', function (msg, rinfo) {
		console.log('OnMessage: ' + msg.toString() + ' from ' + rinfo.address + ':' + rinfo.port);
		parseAndExecute(self, msg, rinfo);
	});
};

Server.prototype.start = function () {
	this.socket.bind(this.port);

	console.log('Start server at ' + this.port);
};

function parseAndExecute(server, msg, rinfo) {
	var strMsg = msg.toString();
	var json = JSON.parse(strMsg);

	switch (json.type) {
		case 'init':
			onInit(server, json, rinfo);
			break;

		case 'join':
			onJoin(server, json, rinfo);
			break;

		case 'exit':
			onExit(server, json, rinfo);
			break;

		case 'close':
			onClose(server, json, rinfo);
			break;
	}
}

function onInit(server, msg, rinfo) {

	var newUser = new User(rinfo.address, rinfo.port);
	server.userTable.add(newUser);

	var sendMsg = {
		type: 'init',
		id: newUser.id,
		channels: server.channelManager.getCntList(),
		totalCnt: server.userTable.length
	};

	send(server.socket, sendMsg, rinfo.address, rinfo.port);
}

function onJoin(server, msg, rinfo) {
	var user = server.userTable.get(msg.id);
	if (!user) {
		console.log('Unvalid user id');
		return;
	}

	server.channelManager.join(msg.channel, user);

	var sendMsg = {
		type: 'join',
		roomCnt: server.channelManager.rooms[msg.channel].length(),
		port: server.channelManager.rooms[msg.channel].port
	};
	send(server.socket, sendMsg, rinfo.address, rinfo.port);
}

function onExit(server, msg, rinfo) {
	var user = server.userTable.get(msg.id);
	if (!user) {
		console.log('Invalid user id');
		var sendMsg = {
			type: 'close'
		};
		send(server.socket, sendMsg, rinfo.address, rinfo.port);
		return;
	}

	server.channelManager.exit(msg.channel, user);

	var sendMsg = {
		type: 'exit',
		channels: server.channelManager.getCntList(),
		totalCnt: server.userTable.length
	};
	send(server.socket, sendMsg, rinfo.address, rinfo.port);
}

function onClose(server, msg, rinfo) {

	var sendMsg = {
		type: 'close'
	};
	server.userTable.remove(msg.id);
	send(server.socket, sendMsg, rinfo.address, rinfo.port);
}

function send(socket, msg, ip, port) {
	var sendMsg = JSON.stringify(msg);
	sendMsg = new Buffer(sendMsg);

	socket.send(sendMsg, 0, sendMsg.length, port, ip, onErr);
}

function onErr(err, bytes) {
	if (err)
		console.log(err);
}

module.exports = Server;
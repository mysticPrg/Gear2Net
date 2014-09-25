/**
 * Created by mysticPrg on 2014-09-16.
 */

var RoomServer = require('./RoomServer');

function onErr(err, bytes) {
	if (err)
		console.log(err);
}

var Room = function Room(channel) {
	this.channel = channel;
	this.users = {};
	this.mic = null;
	this.port = 31000 + Number(channel);
	this.server = new RoomServer(this);

	this.server.start();

	var self = this;
};

Room.prototype.join = function (user) {
	if (!this.users[user.id]) {
		this.users[user.id] = user;
	}
};

Room.prototype.exit = function (user) {
	if (this.users[user.id]) {
		delete this.users[user.id];

		if (this.mic === user.id) {
			this.releaseMic(user.id);
		}
	}
}

Room.prototype.getMic = function (id) {
	if (this.mic !== null) {
		return false;
	}

	this.mic = id;
	return true;
};

Room.prototype.releaseMic = function (id) {
	if (this.mic === id) {
		this.mic = null;
		return true;
	}

	return false;
};

Room.prototype.length = function () {
	var cnt = 0;
	for (keys in this.users) {
		cnt++;
	}
	return cnt;
};

Room.prototype.isEmpty = function () {
	if (this.length() === 0) {
		return true;
	}
	return false;
};

module.exports = Room;
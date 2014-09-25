/**
 * Created by mysticPrg on 2014-09-16.
 */

var CHANNEL_MAX = 999;
var CHANNEL_MIN = 0;

var Room = require('./Room');

var ChannelManager = function ChannelManager() {
	this.rooms = {};
};

ChannelManager.prototype.isExist = function (channel) {
	if (this.rooms[channel]) {
		return true;
	}
	return false;
};

ChannelManager.prototype.createRoom = function (channel) {
	this.rooms[channel] = new Room(channel);
};

ChannelManager.prototype.join = function (channel, user) {
	if (!this.isExist(channel)) {
		this.createRoom(channel);
	}

	this.rooms[channel].join(user);
};

ChannelManager.prototype.exit = function (channel, user) {
	if ( this.rooms[channel] ) {
		this.rooms[channel].exit(user);
	}

	if (this.rooms[channel].isEmpty()) {
		delete (this.rooms[channel]);
//		this.rooms[channel] = null;
	}
};

ChannelManager.prototype.getCntList = function () {
	var result = {};//new Array();
	var self = this;
	for ( var key in this.rooms ) {
		var room = {
			channel: new Number(key),
			cnt: self.rooms[key].length()
		};
		result[key] = room;
	}

	return result;
};
module.exports = ChannelManager;
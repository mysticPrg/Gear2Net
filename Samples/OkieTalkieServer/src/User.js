/**
 * Created by mysticPrg on 2014-09-16.
 */

var User = function User(ip, port) {
	this.ip = ip;
	this.port = port;
	this.id = null;
	this.room_port = null;
};

module.exports = User;
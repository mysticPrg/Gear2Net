/**
 * Created by mysticPrg on 2014-09-16.
 */

var uuid = require('node-uuid');

var UserTable = function () {
	this.data = {};
	this.length = null;
};

UserTable.prototype.add = function (user) {
	var newId = uuid.v1().substr(0, 8);
	while (this.isExistId(newId)) {
		newId = uuid.v1().substr(0, 8);
	}
	user.id = newId;

	this.data[newId] = user;
	this.length++;
};

UserTable.prototype.get = function (id) {
	if (this.data[id]) {
		return this.data[id];
	}
	return null;
};

UserTable.prototype.isExistId = function (id) {
	if (this.data[id]) {
		return true;
	}
	return false;
};

UserTable.prototype.remove = function (id) {
	delete this.data[id];
	this.length--;
};

module.exports = UserTable;
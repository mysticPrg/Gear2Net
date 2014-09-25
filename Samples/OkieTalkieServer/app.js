/**
 * Created by mysticPrg on 2014-09-23.
 */

//var RoomServer = require('./src/RoomServer');
//var roomServer = new RoomServer(33337);
//roomServer.start();

var Server = require('./src/Server');
var robbyServer = new Server(33337);

robbyServer.start();
var ffi = require('ffi');

function TEXT(text) {
    return new Buffer(text, 'ucs2').toString('binary');
}

var user32 = new ffi.Library('user32', {
    'MessageBoxW' : [ 'int32', [ 'int32', 'string', 'string', 'int32' ] ],
    'FindWindowW': [ 'int32', ['string', 'string'] ],
    'SendMessageW': [ 'int32', ['int32', 'int32', 'int32', 'int32'] ],
    'PostMessageW': [ 'int32', ['int32', 'int32', 'int32', 'int64'] ],
    'SetWindowTextW': ['bool', ['int32', 'string'] ],
    'ShowWindow': ['bool', ['int32', 'int32'] ],
});

var hwnd = 0;

var SW_HIDE = 0;
var SW_SHOW = 5;
var SW_SHOWMAXIMIZED = 3;
var SW_SHOWNORMAL = 1;
//console.log( user32.ShowWindow(hwnd, SW_SHOWNORMAL | SW_SHOWMAXIMIZED) );


var CMD_PLAY_PAUSE =	0x0001271E;
var CMD_SYNC_RESTORE =	0x0001279E;
var CMD_SYNC_LEFT =		0x0001279D;
var CMD_SYNC_RIGHT =	0x0001279C;
var CMD_VOLUME_UP =		0x00012733;
var CMD_VOLUME_DOWN =	0x00012734;
var CMD_MUTE_TOGGLE =	0x00012735;
var CMD_SEEK_LEFT =		0x0001274B;
var CMD_SEEK_RIGHT =	0x0001274C;
var CMD_SCREEN_SHOT =	0x000128C1;

function findHandle() {
	for (var i = 0; i < 10; i++) {
		hwnd = user32.FindWindowW(TEXT('PotPlayer'), null);

		if (hwnd !== 0) {
			break;
		}
	}
	console.log('hwnd: ' + hwnd);
}

function postCmd(cmd) {
	console.log('postCmd: ' + cmd);
    user32.PostMessageW(hwnd, 0x0111, cmd, 0x00);
}

function controlPlayer(msg) {
	var cmd = 0;

	msg = String(msg).trim();
	
	switch ( msg ) {
		case 'pp':
			cmd = CMD_PLAY_PAUSE;
			break;
	
		case 'sz':
			cmd = CMD_SYNC_RESTORE;
			break;
	
		case 'sl':
			cmd = CMD_SYNC_LEFT;
			break;
	
		case 'sr':
			cmd = CMD_SYNC_RIGHT;
			break;
	
		case 'vu':
			cmd = CMD_VOLUME_UP;
			break;
	
		case 'vd':
			cmd = CMD_VOLUME_DOWN;
			break;
	
		case 'mt':
			cmd = CMD_MUTE_TOGGLE;
			break;
	
		case 'll':
			cmd = CMD_SEEK_LEFT;
			break;
	
		case 'rr':
			cmd = CMD_SEEK_RIGHT;
			break;
		
		case 'ss':
			cmd = CMD_SCREEN_SHOT;
			break;
		
		default:
			cmd = 0;
			break;
	}
    
	if ( cmd === 0 ) {
		return;
	}
	
	postCmd(cmd);
}

function onErr(err) {
	console.log('Err: ' + err);
	return 1;
}

var server_tcp = require('net').createServer();
var port_tcp = 33333;
server_tcp.on('listening', function() {
	console.log('MediaController Server is listening on port ', port_tcp);
});

server_tcp.on('connection', function(socket) {
	console.log('Server has a new connection');
//	socket.setEncoding('UTF-8');
	
	socket.setNoDelay(true);
	
	socket.on('end', function()
	{
		console.log('Client connection closed.');
	});
	
	socket.on('data', function(data)
	{
		console.log('Received data : ' + data);
		controlPlayer(data);
	});
});

server_tcp.on('close', function(data) {
	console.log('TCP Server closed: ' + data);
});

server_tcp.on('error', function(err)
{
	console.log('Error occured:', err.message);
});

//=========================================================

findHandle();
if ( hwnd === 0 ) {
	user32.MessageBoxW(0, TEXT('Can\'t find PotPlyer!\0'), TEXT('Gear2Net Sample\0'), 1);
	return;
}

server_tcp.listen(port_tcp);

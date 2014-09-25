var CMD_PLAY_PAUSE =	'pp';
var CMD_SYNC_RESTORE =	'sz';
var CMD_SYNC_LEFT =		'sl';
var CMD_SYNC_RIGHT =	'sr';
var CMD_VOLUME_UP =		'vu';
var CMD_VOLUME_DOWN =	'vd';
var CMD_MUTE_TOGGLE =	'mt';
var CMD_SEEK_LEFT =		'll';
var CMD_SEEK_RIGHT =	'rr';
var CMD_SCREEN_SHOT =	'ss';


require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'G2NNetwork',
		'tau'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle,
		G2NNetwork
	) {

	G2NSystem.setDebugMode(true);
	
	$(document).ready(function() {
		
		var isConnected = false;
		
		/*
		 * resume -> connected to bridge app 
		 */
		function onResume() {
			isConnected = true;				
			
			if ( isSocketConnected === true ) {
				tau.changePage('#page_main');
			} else {
				tau.changePage('#page_connect_to_server');				
			}
		}
		
		/*
		 * pause -> disconnect to bridge app
		 */
		function onPause() {
			isConnected = false;
		}
		
		function disconnectOrExit() {
			if ( isSocketConnected ) {
				disconnect();
			} else {
				G2NLifeCycle.exit();
			}
		}
		
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
		window.addEventListener('tizenhwkey', disconnectOrExit);
		
		var address = null,
			socket = null,
			socket_ip = '210.118.74.40',
			socket_port = 33333,
			connectedListenerKey = null,
			disconnectedListenerKey = null,
			isSocketConnected = false;
		
		/*
		 * connected to socket server
		 */
		function onConnected() {
			tau.changePage('#page_main');
			isSocketConnected = true;
		}
		
		/*
		 * disconnected to socket server
		 */
		function onDisconnected() {
			tau.changePage('#page_connect_to_server');
			isSocketConnected = false;
			console.log('onDisconnected!');
		}
		
		function createAddress() {
			address = new G2NNetwork.Socket.Address(socket_ip, socket_port, createSocket);
		}
		
		function createSocket() {
			socket = new G2NNetwork.Socket(address, G2NNetwork.Socket.Protocol.TCP, setConntectedListener);
		}
		
		function setConntectedListener() {
			socket.addConnectedListener(onConnected, function(key) {
				connectedListenerKey = key;
				setDisconnectedListener();
			});
		}
		
		function setDisconnectedListener() {
			socket.addDisconnectedListener(onDisconnected, function(key) {
				disconnectedListenerKey = key;
				connect();
			});
		}
		
		function connect() {
			socket.openAndListen();
		}
		
		function disconnect() {
			if ( address !== null ) {
				address.destruct(function() {
					address = null;
				});
			}
			
			if ( socket !== null ) {
				socket.close();
				socket.destruct(function() {
					socket = null;
					onDisconnected();
				});
			}
		}
		
		$('#btn_connect').click(function() {
			createAddress();
		});
		
		$('#btn_play').click(function() {
			socket.sendMessage(CMD_PLAY_PAUSE);
		});
		
		$('#btn_capture').click(function() {
			socket.sendMessage(CMD_SCREEN_SHOT);
		});
		
		$('#btn_mute').click(function() {
			socket.sendMessage(CMD_MUTE_TOGGLE);
		});
		
		$('#btn_volDown').click(function() {
			socket.sendMessage(CMD_VOLUME_DOWN);
		});
		
		$('#btn_volUp').click(function() {
			socket.sendMessage(CMD_VOLUME_UP);
		});
		
		$('#btn_backward').click(function() {
			socket.sendMessage(CMD_SEEK_LEFT);
		});
		
		$('#btn_forward').click(function() {
			socket.sendMessage(CMD_SEEK_RIGHT);
		});
		
		$('#btn_syncDown').click(function() {
			socket.sendMessage(CMD_SYNC_LEFT);
		});
		
		$('#btn_normalSync').click(function() {
			socket.sendMessage(CMD_SYNC_RESTORE);
		});
		
		$('#btn_syncUp').click(function() {
			socket.sendMessage(CMD_SYNC_RIGHT);
		});
		
	});
	
});
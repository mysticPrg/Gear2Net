define([
		'jquery',
		'G2NLifeCycle',
		'app/robbyClient',
		'app/client',
		'app/record',
		'app/ui',
		'tau'
	],
	function(
		$,
		G2NLifeCycle,
		RobbyClient,
		Client,
		Record,
		UI
	) {
	
	var robbyClient = null,
		client = null,
		record = null,
		ui = null,
		micRequested = false;
	
	$('#page_main').on('pageshow', function() {
		if ( !ui ) {
			ui = new UI();
		}
		
		if ( !robbyClient ) {
			robbyClient = new RobbyClient('210.118.74.165', 33337, {
				init: onInit,
				join: onJoin,
				close: onClose,
				exit: onExit
			});
			
			robbyClient.connect();
		}
		
		if ( !record ) {
			record = new Record({
				start: onRecordStart,
				stop: onRecordStop
			});
			$('body').append('<div id="record_div" class="hidden"></div>');
		}
		
	});
	
	function onInit(rc, msg) {
		ui.totalCnt = msg.totalCnt;
		ui.channels = msg.channels;
		
		ui.updateTotalCnt();
		ui.updateRoomCnt();
	}
	
	function onJoin(rc, msg) {
		ui.roomCnt = msg.roomCnt;
		ui.updatePage2RoomCnt();
		
		client = new Client(robbyClient.id, '210.118.74.165', msg.port, {
			connect: onConnect,
			requestMic: onRequestMic
		});
		
		client.connect();
	}
	
	function onConnect(client, msg) {
		console.log('room Connect :' + JSON.stringify(msg));
		ui.updateHz();
		tau.changePage('#page_room');
	}
	
	function onRequestMic(client, msg) {
		console.log('room onRequestMic :' + JSON.stringify(msg));
		micRequested = false;
		if ( msg.id === null ) {
			return;
		} else if ( msg.id === client.id ) {
			record.start();
		}
	}
	
	function onExit(rc, msg) {
		ui.totalCnt = msg.totalCnt;
		ui.channels = msg.channels;
		
		ui.updateTotalCnt();
		ui.updateRoomCnt();
		
		tau.back();
	}
	
	function onClose(rc, msg) {
		G2NLifeCycle.exit();
	}
	
	$('#main_btn_connect').click(function() {
		console.log('Connecting to ' + ui.getNumber());
		robbyClient.sendJoin(ui.getNumber());
	});
	
	$('#room_mic_btn').on('touchstart', function() {
		micRequested = true;
		client.sendRequestMic();
	});
	
	$('#room_mic_btn').on('touchend', function() {
		record.stop();
	});
	
	function onRecordStart() {
		console.log('Record Started');
		$('#record_div').html('');
		$('#record_div').html('<audio id="record_audio" preload="auto" autoplay><source src="res/bell.wav" type="audio/wav"></audio>');
		
//		var audio = $('#record_audio')[0];
//		audio.load();
//		audio.play();
	}
	
	function onRecordStop() {
		console.log('Record Stopped');
		client.sendRadio();
	}
	
	function exit() {
		robbyClient.sendExit(ui.getNumber());
	}
	
	function close() {
		robbyClient.sendClose();
	}
	
	return {
		exit: exit,
		close: close
	};
});
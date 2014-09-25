define(['jquery', 'tau'], function($) {
	
	var UI = function UI() {
		this.channel = new Array();
		this.totalCnt = 0;
		this.roomCnt = 0;
		this.channels = null;
		
		init(this);
	};
	
	var channel = new Array();
	var totalCnt = 0;
	var roomCnt = 0;
	
	function increaseNumber(num) {
		if ( num === 9 )
			return 0;
		else
			return ++num;
	}
	
	function decreaseNumber(num) {
		if ( num === 0 )
			return 9;
		else
			return --num;
	}
	
	UI.prototype.updateNumber = function updateNumber() {
		$('#main_hz_first > p').text(this.channel[0].toString());
		$('#main_hz_second > p').text(this.channel[1].toString());
		$('#main_hz_third > p').text(this.channel[2].toString());
		
		this.updateRoomCnt();
	};
	
	UI.prototype.getNumber = function getNumber() {
		var str = this.channel.join('');
		return Number(str);
	};
	
	UI.prototype.updateTotalCnt = function updateTotalCnt() {
		$('#main_cnt_total > p').text(this.totalCnt + ' 명');
	};
	
	UI.prototype.updateRoomCnt = function updateRoomCnt() {
		var roomNo = this.getNumber();
		if ( this.channels[roomNo] )
			this.roomCnt = this.channels[roomNo].cnt;
		else
			this.roomCnt = 0;
		
		$('#main_cnt_room > p').text(this.roomCnt + ' 명');
	};
	
	UI.prototype.updatePage2RoomCnt = function updatePage2RoomCnt() {
		$('#room_cnt > p').text(this.roomCnt + ' 명');
	};
	
	UI.prototype.updateHz = function updateHz() {
		$('#room_hz > p').html('' +
				this.channel[0] +
				this.channel[1] +
				'.' +
				this.channel[2] +
				'<span>MHz</span>'
			);
	};
	
	function init(ui) {
		
		ui.channel.push(9);
		ui.channel.push(3);
		ui.channel.push(7);
		
		$('#main_hz_up_first').click(function() {
			ui.channel[0] = increaseNumber(ui.channel[0]);
			ui.updateNumber();
		});
		
		$('#main_hz_down_first').click(function() {
			ui.channel[0] = decreaseNumber(ui.channel[0]);
			ui.updateNumber();
		});
		
		$('#main_hz_up_second').click(function() {
			ui.channel[1] = increaseNumber(ui.channel[1]);
			ui.updateNumber();
		});
		
		$('#main_hz_down_second').click(function() {
			ui.channel[1] = decreaseNumber(ui.channel[1]);
			ui.updateNumber();
		});
		
		$('#main_hz_up_third').click(function() {
			ui.channel[2] = increaseNumber(ui.channel[2]);
			ui.updateNumber();
		});
		
		$('#main_hz_down_third').click(function() {
			ui.channel[2] = decreaseNumber(ui.channel[2]);
			ui.updateNumber();
		});
		
		
		$('#room_mic_btn').on('touchstart', function() {
			$('#room_mic_btn').addClass('btn_pressed');
		});
		
		$('#room_mic_btn').on('touchend', function() {
			$('#room_mic_btn').removeClass('btn_pressed');
		});
	}
	
	return UI;
});
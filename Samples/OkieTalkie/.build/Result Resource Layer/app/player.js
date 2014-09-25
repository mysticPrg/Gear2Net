define(['jquery'], function($) {
	var Player = function player(filename) {
		if ( !filename ) {
			filename = 'file:///opt/usr/media/Documents/receive.mp4';
		}
		
		this.filename = filename;
		
		$('body').append('<div id="player_div" class="hidden"></div>');
	};
	
	Player.prototype.play = function() {
		console.log('Player is now Playing');
		
		$('#player_div').html('');
		$('#player_div').html('<video id="player_video"><source src="' + this.filename + '" type="video/mp4" /></video>');
		
		var video = $('#player_video')[0];
		video.load();
		video.play();
	};
	
	Player.prototype.stop = function() {
		
	};
	
	return Player;
});
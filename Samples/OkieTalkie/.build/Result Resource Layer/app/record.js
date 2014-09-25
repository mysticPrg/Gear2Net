define([], function() {
	var Record = function Record(callback, options) {

		var self = this;
		
		this.nowRecording = false;
		
		this.callback = {
			start: null,
			stop: null
		};
		if ( callback ) {
			for ( var key in callback ) {
				this.callback[key] = callback[key];
			}
		}
		
		this.options = {
			filename: 'rec.mp4',
			maxRecordingTime: 10000,
			recordingInterval: null,
		};
		
		if ( options ) {
			for ( var key in options ) {
				this.options[key] = options[key];
			}
		}
		
		this.documentDir = null;
		this.audioControl = null;
		
		tizen.filesystem.resolve('documents', function(dir) {
			self.documentsDir = dir;
		}, onError, "rw");

		navigator.webkitGetUserMedia({
			video : false,
			audio : true
		}, function(stream) {
			navigator.tizCamera.createCameraControl(stream, function(control) {
				self.audioControl = control;
				
				var settings = {};
				settings.fileName = self.options.filename;
				self.audioControl.recorder.applySettings(settings, function() {
					console.log('Audio Setting Success!');
				}, onError);
			}, onError);
		}, onError);
	};
	
	function onError(err) {
		if ( err )
			console.log('Error: ' + err.message);
	}
	
	Record.prototype.checkVideoLength = function checkVideoLength() {
	   var currentTime = new Date();
	   var self = this;

	   if (currentTime - this.videoRecordingStartTime > this.maxRecordingTime) {
	      window.clearInterval(this.videoLengthCheckInterval);
	      this.stop();
	   } else {
		   this.videoLengthCheckInterval = window.setTimeout (function(){
			   self.checkVideoLength();
		   }, 1000);
	   }
	};
	
	Record.prototype.start = function start() {
		var self = this;
		
		this.documentsDir.deleteFile('file:///opt/usr/media/Sounds/' + this.options.filename);
		this.audioControl.recorder.start(function() {
			self.nowRecording = true;
			if ( self.callback.start && typeof(self.callback.start) === 'function' ) {
				self.callback.start();
			}
				
			self.videoRecordingStartTime = new Date();
			self.videoLengthCheckInterval = window.setTimeout(function() {
				self.checkVideoLength();
			}, 1000);			
		}, onError);
	};
	
	Record.prototype.stop = function stop() {
		var self = this;
		
		if ( self.nowRecording !== true ) {
			return;
		}
		this.audioControl.recorder.stop(function() {
			self.nowRecording = false;
			
			if ( self.callback.stop && typeof(self.callback.stop) === 'function' ) {
				self.callback.stop();
			}
		}, onError);
	};
	
	return Record;
});
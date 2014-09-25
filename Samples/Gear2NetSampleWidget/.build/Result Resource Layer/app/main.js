
require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'tau',
		'app/mobile',
		'app/util',
		'app/network'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle
	) {

	var isConnected = false;
	var isIndex = false;
	
	function backOrExit(e) {
		if(e.keyName === "back") {
			if ( isIndex || (isConnected === false) || $('.ui-page-active').attr('id')==='page_feed_list') {
				G2NLifeCycle.exit();
			}  else {
				tau.back();
			}
        }
	}
	
	$(document).ready(function() {
		
		G2NSystem.setDebugMode(true);
		
		G2NLifeCycle.setOnResumeCallback(function() {
			tau.changePage('#page_index');
			isConnected = true;
		});
		
		G2NLifeCycle.setOnPauseCallback(function() {
			tau.changePage('#page_disconnect');
			isConnected = false;
		});
		
		window.addEventListener('tizenhwkey', backOrExit);
		
		$('#page_index').on('pageshow', function() {
			isIndex = true;
		});
		
		$('#page_index').on('pagehide', function() {
			isIndex = false;
		});
		 
	});
});
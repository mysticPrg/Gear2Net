require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'app/system',
		'tau'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle,
		system
	) {
	
	$(document).ready(function() {
		
		G2NSystem.setDebugMode(false);
		
		var isConnected = false,
			isMain = false;
		
		/*
		 * resume -> connected to bridge app 
		 */
		function onResume() {
			isConnected = true;				
			tau.changePage('#page_main');
		}
		
		/*
		 * pause -> disconnect to bridge app
		 */
		function onPause() {
			tau.changePage('#page_disconnect');
			isConnected = false;
		}
		
		function backOrExit() {
			if ( isConnected === false ) {
				G2NLifeCycle.exit();
			} else if ( isMain ) {
				system.close();			
			} else {
				system.exit();
			}
		}
		
		$('#page_main').on('pageshow', function() {
			isMain = true;
		});
		
		$('#page_main').on('pagehide', function() {
			isMain = false;
		});
		
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
		window.addEventListener('tizenhwkey', backOrExit);
		
	});
	
});
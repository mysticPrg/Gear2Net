require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'tau'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle
	) {
	
	$(document).ready(function() {
		
		var isConnected = false;
		
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
			if ( isConnected ) {
				tau.back();
			} else {
				G2NLifeCycle.exit();
			}
		}
		
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
		window.addEventListener('tizenhwkey', backOrExit);
		
	});
	
});
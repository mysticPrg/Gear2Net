
require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'tau',
		'app/rss_main',
		'app/feedlist',
		'app/detail_feed',
		'app/add_page',
		'app/getRSS',
		'app/setting'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle
	) {

	var isIndex = false;
	
	function backOrExit(e) {
		if(e.keyName === "back") {			
			if ( isIndex ) {
				G2NLifeCycle.exit();
			} else {
				tau.back();
				if($('.ui-page-active').attr('id')==='page_feed_list') tau.changePage('#page_rss_main');
			}
        }
	}	
	
	$(document).ready(function() {
		
		var isPause = false;
		
		/*
		 * resume -> connected to bridge app 
		 */
		function onResume() {
			if ( isPause === true ) {
				isConnected = false;
				return;
			}
			tau.changePage('#page_rss_main');
		}
		
		/*
		 * pause -> disconnect to bridge app
		 */
		function onPause() {
			isPause = true;
		}
		
		G2NSystem.setDebugMode(true);
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
		
		tau.defaults.pageTransition = "slideup";
		window.addEventListener('tizenhwkey', backOrExit);
		
		// 프로그램 시작
		$('#page_rss_main').on('pageshow', function() {
			isIndex = true;
		});
		
		$('#page_rss_main').on('pagehide', function() {
			isIndex = false;
		});
		 
	});
});
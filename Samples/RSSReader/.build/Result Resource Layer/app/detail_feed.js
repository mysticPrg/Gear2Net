require(['jquery', 'G2NMobile', 'tau'], function ($, G2NMobile) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		$('#btn_feed1').click(function() {
			
			tau.changePage('#page_feed_list');
		});
		
		$('#btn_phone').click(function() {
			//web 띄우기
		});
	});
});
		
		
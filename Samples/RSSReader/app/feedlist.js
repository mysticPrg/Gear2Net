require(['jquery', 'G2NMobile', 'tau'], function ($, G2NMobile) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		
		$('#btn_feed1').click(function() {
			tau.changePage('#page_detail_feed');
		});
		
		$('#btn_feed2').click(function() {
			tau.changePage('#page_detail_feed');
		});
		
		
	});
});
		
		
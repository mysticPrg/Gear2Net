require(['jquery', 'G2NMobile', 'tau'], function ($, G2NMobile) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		$('#btn_setting').click(function() {
			tau.changePage('#page_setting');
		});
		
		$('#Setting_btn_help').click(function() {
			tau.changePage('#page_setting_help');
		});
		
	});
});
		
		
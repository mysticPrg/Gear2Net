
require(['jquery', 'G2NUtil', 'tau'], function ($, G2NUtil) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		
		$('#btn_to_util').click(function() {
			tau.changePage('#page_util');
		});
		$('#btn_to_util_keyboard').click(function() {
			tau.changePage('#page_util_keyboard');
		});
		$('#btn_to_util_log').click(function() {
			tau.changePage('#page_util_log');
		});
		$('#btn_to_util_webviewer').click(function() {
			tau.changePage('#page_util_webviewer');
		});

		
		/*
		 * Webviewer Test
		 * =======================================================================
		 */
		$('#btn_util_webviewer_showPage_naver').click(function() {
			G2NUtil.WebViewer.showPage('HtTp://www.naver.com/');
		});
		
		$('#btn_util_webviewer_showPage_secsm').click(function() {
			G2NUtil.WebViewer.showPage('secsm.org');
		});
		
		$('#btn_util_webviewer_showPage_ruliweb').click(function() {
			G2NUtil.WebViewer.showPage('www.ruliweb.com');
		});
		
		
		/*
		 * Log Test 
		 * =======================================================================
		 */
		var LOG_TAG = 'Gear 2 Net Tag'; 
		$('#btn_util_log_info').click(function() {
			G2NUtil.Log.info(LOG_TAG, 'info log');
		});
		
		$('#btn_util_log_debug').click(function() {
			G2NUtil.Log.debug(LOG_TAG, 'debug log');
		});
		
		$('#btn_util_log_warning').click(function() {
			G2NUtil.Log.warning(LOG_TAG, 'warning log');
		});
		
		$('#btn_util_log_error').click(function() {
			G2NUtil.Log.error(LOG_TAG, 'error log');
		});
		
		
		/*
		 * Keyboard Test 
		 * =======================================================================
		 */
		function showKeyboardResult(returnValue) {
			$('#result_util_keyboard').text('Result: ' + returnValue);
		}
		
		$('#btn_util_keyboard_getText').click(function() {
			G2NUtil.Keyboard.getText(showKeyboardResult);
		});
	});
	
});
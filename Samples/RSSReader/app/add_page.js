require(['jquery', 'G2NUtil', 'tau'], function ($, G2NUtil) {
	function reset(){
		$('#btn_title').attr('value','');
		$('#btn_url').attr('value','');
	}
	$(document).ready(function() {
	
		var istitle = true;
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		$('#btn_plus').click(function() {
			tau.changePage('#page_add_url_page');
		});

		$('#addPage_btn_cancel').click(function() {
			reset();
			tau.changePage('#page_rss_main');
		});
		
		
		//URL 입력
		function showKeyboardResult(returnValue) {
			if(istitle)
				$('#btn_title').attr('value',''+returnValue);
			else
				$('#btn_url').attr('value',''+returnValue);
		}
		
		$('#btn_title').click(function() {
			istitle = true;
			G2NUtil.Keyboard.getText(showKeyboardResult);
		});
		
		$('#btn_url').click(function() {
			istitle = false;
			G2NUtil.Keyboard.getText(showKeyboardResult);
		});

		
		
	});
});
		
		
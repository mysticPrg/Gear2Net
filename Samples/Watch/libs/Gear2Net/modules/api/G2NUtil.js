/**
 * Util module was made to improvement about inconvenient as you develop Gear2.
 * 
 * @module G2NUtil
 */

define(['G2NSystem', 'G2NConnect', 'G2NMsg', 'G2NObject'], function(G2NSystem, G2NConnect, G2NMsg, G2NObject) {
	
	var Keyboard = {},
		Log = {},
		WebViewer = {},
		publicMember = {},
		isInit = false;
	

	if ( isInit === false ) {

		G2NSystem.debugLog('G2NUtil Init!');
		
		/*
		 * Object Keys
		 */
		Keyboard.objKey				= 'net.gear2net.api.util.keyboard.G2NKeyboard';
		Log.objKey					= 'net.gear2net.api.util.log.G2NLog';
		WebViewer.objKey			= 'net.gear2net.api.util.webviewer.G2NWebViewer';
		
		
		//============================================================================================================================

		
		/**
		 * Input the keyboard from Android device because it does not provide a keyboard in Gear2. 
		 *
		 * @namespace G2NUtil
		 * @class Keyboard
		 */
		Keyboard.member = {
				
				
			/**
			 * Pop up the dialog for input the keyboard in the Android device window.
			 * Receive the input message after input the keyboard and click the 'Enter'.  
			 * Gear2 is no knowing when click the 'Enter' from Android device.   
			 * 
			 * @method getText
			 * @param {function} callback
			 * 
			 * @example
			 *     function showKeyboardResult(returnValue) {
			 *         $('#result_util_keyboard').text('Result: ' + returnValue);
		     *     }
		     *     
		     *     $('#btn_util_keyboard_getText').click(function() {
			 *         G2NUtil.Keyboard.getText(showKeyboardResult);
		     *     });
			 */
			getText: function (callback) {
				Keyboard.setListener(function(returnValue) {
					if ( callback && typeof(callback) === 'function' ) {
						callback(returnValue);
					}
					
					Keyboard.unsetListener();
				}, function(key) {
					Keyboard.listenerKey = key;
				});
			}
		};
		
		Keyboard.setListener = function getText(listener, callback) {
			var msg = G2NMsg.createRegistrationListenerMsg(Keyboard.objKey, listener, callback);
			G2NConnect.send(JSON.stringify(msg));
		};
		
		Keyboard.unsetListener = function() {
			if ( Keyboard.listenerKey ) {
				G2NSystem.unregisterListenerByKey(Keyboard.listenerKey);				
			}
		};
		
		Keyboard.listenerKey = null;

		
		//============================================================================================================================

		
		/**
		 * During developing widget of Gear2, you leave the Log in the Android development environment when you want it.
		 * And, it is singleton. Whatever you make several object, perceived as one object.
		 * 
		 * @namespace G2NUtil
		 * @class Log
		 */	
		Log.member = {
				
				
			/**
			 * Send a Info log message in android development environment.
			 * <br><br>
			 * See Also : {{#crossLink "G2NUtil.Log/debug:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/warning:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/error:method"}}{{/crossLink}} 
			 * 
			 * @method info
			 * @param {String} tag
			 * @param {String} msg
			 * @param {function} callback
			 * @example
			 *     var LOG_TAG = 'Gear 2 Net Tag'; 
			 *     G2NUtil.Log.info(LOG_TAG, 'info log');
			 */
			info: function info(tag, msg, callback) {
				var sendMsg = G2NMsg.createMethodCallMsg(Log.objKey, callback, ['STRING', 'STRING']);
				G2NConnect.send(JSON.stringify(sendMsg));
			},
			
			
			/**
			 * Send a Debug log message in android development environment.
			 * <br><br>
			 * See Also : {{#crossLink "G2NUtil.Log/info:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/warning:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/error:method"}}{{/crossLink}}  
			 *            
			 * @method debug
			 * @param {String} tag
			 * @param {String} msg
			 * @param {function} callback
			 * @example
			 *     var LOG_TAG = 'Gear 2 Net Tag'; 
			 *     G2NUtil.Log.debug(LOG_TAG, 'debug log');
			 */
			debug: function debug(tag, msg, callback) {
				var sendMsg = G2NMsg.createMethodCallMsg(Log.objKey, callback, ['STRING', 'STRING']);
				G2NConnect.send(JSON.stringify(sendMsg));
			},
			
			
			/**
			 * Send a Warning log message in android development environment.
			 * <br><br>
			 * See Also : {{#crossLink "G2NUtil.Log/info:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/debug:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/error:method"}}{{/crossLink}} 
			 *             
			 * @method warning
			 * @param {String} tag
			 * @param {String} msg
			 * @param {function} callback
			 * @example
			 *     var LOG_TAG = 'Gear 2 Net Tag'; 
			 *     G2NUtil.Log.warning(LOG_TAG, 'warning log');
			 */
			warning: function warning(tag, msg, callback) {
				var sendMsg = G2NMsg.createMethodCallMsg(Log.objKey, callback, ['STRING', 'STRING']);
				G2NConnect.send(JSON.stringify(sendMsg));
			},
			
			
			/**
			 * Send a Error log message in android development environment.
			 * <br><br>
			 * See Also : {{#crossLink "G2NUtil.Log/info:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/debug:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NUtil.Log/warning:method"}}{{/crossLink}}
			 *             
			 * @method error
			 * @param {String} tag
			 * @param {String} msg
			 * @param {function} callback
			 * @example
			 *     var LOG_TAG = 'Gear 2 Net Tag'; 
			 *     G2NUtil.Log.error(LOG_TAG, 'error log');
			 */
			error: function error(tag, msg, callback) {
				var sendMsg = G2NMsg.createMethodCallMsg(Log.objKey, callback, ['STRING', 'STRING']);
				G2NConnect.send(JSON.stringify(sendMsg));
			}	
			
		};

		
		//============================================================================================================================

		
		/**
		 * If the Gear2 transmits URL to Android device, show web page in the receiver window.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 * 
		 * @namespace G2NUtil
		 * @class WebViewer
		 */	
		WebViewer.member = {
				
				
			/**
			 * The pop up a web page on your android device.
			 * If you entered into the first parameter with incorrectly URL, It will pop up a wrong web page and will not occurred Exception.    
			 *  
			 * @method showPage
			 * 
			 * @param {String} url 
			 * If you not attach 'http://' or 'https://' to in front of URL, it will be automatically judge of 'http://'. 
			 * Also, it allows to differing use of uppercase and lowercase letters.
			 * But, After 'http://' or 'https://', It is not allowed.
			 *  
			 * @param {function} callback
			 * @example
			 *     $('#btn_util_webviewer_showPage').click(function() {
			 *         G2NUtil.WebViewer.showPage('http://developer.samsung.com/samsung-gear');
		     *     });
			 */
			showPage: function showPage(url, callback) {
				var sendMsg = G2NMsg.createMethodCallMsg(WebViewer.objKey, callback, ['STRING']);
				G2NConnect.send(JSON.stringify(sendMsg));
			}
		};
		
		publicMember.Keyboard = Keyboard.member;
		publicMember.Log = Log.member;
		publicMember.WebViewer = WebViewer.member;
		
		isInit = true;
	}
	
	return publicMember;	
});
/**
 * G2NMobile module have control of the Android-Phone conditions. 
 * Basically, Providing for this module is the Audio, Battery, Wifi, Vibrate. 
 * 
 * @module G2NMobile
 */

define(['G2NSystem', 'G2NConnect', 'G2NMsg', 'G2NObject'], function(G2NSystem, G2NConnect, G2NMsg, G2NObject) {
	
	var Audio = {},
		Battery = {},
		Sensor = {},
		Vibrate = {},
		Wifi = {},
		publicMember = {},
		isInit = false;
	
	function initMobile() {

		G2NSystem.debugLog('G2NMobile Init!');
		Sensor.SensorManager = {};
		Wifi.WifiInfo = {};
		Wifi.WifiList = {};
		
		/*
		 * Object Keys
		 */
		Battery.objKey				= 'net.gear2net.api.mobile.battery.G2NBattery';
		Audio.objKey				= 'net.gear2net.api.mobile.audio.G2NAudio';
		Sensor.objKey				= 'net.gear2net.api.mobile.sensor.G2NSensor';
		Sensor.SensorManager.objKey	= 'net.gear2net.api.mobile.sensor.G2NSensorManager';
		Vibrate.objKey				= 'net.gear2net.api.mobile.vibrate.G2NVibrate';
		Wifi.objKey					= 'net.gear2net.api.mobile.wifi.G2NWifi';
		Wifi.WifiInfo.objKey		= 'net.gear2net.api.mobile.wifi.G2NWifiInfo';
		Wifi.WifiList.objKey		= 'net.gear2net.api.mobile.wifi.G2NWifiList';
		
		
		//============================================================================================================================
		
		
		/**
		 * This class controls the battery condition of Android-Phone.
		 * For now, it is able controls to just charge in Android-Phone battery.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 * 
		 * @namespace G2NMobile
		 * @class Battery
		 */		
		Battery.member = {

				
			/**
			 * To detect changed event by charge of battery, add the listener.
			 * The cause of an detected event is not always change by charge of battery.
			 * Sometimes, It is able cause to detection by more shorter cycle.
			 * Charge of battery has a percent(%) unit a positive integer value.   
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Battery/removeBatteryChangedListener:method"}}{{/crossLink}}
			 * 
			 * @method addBatteryChangedListener
			 * @param {function} listener
			 * @param {function} callback
			 * @example
			 *		var batteryListenerKey = null;
			 *
			 *		function showBatteryResult(returnValue) {
			 *			$('#result_mobile_battery').text('Result: ' + returnValue[0]);
			 *		}
			 *
			 *		function addListenerCallback(key) {
			 *			batteryListenerKey = key;
			 *		}
			 *
			 *		function removeListenerCallback() {
			 *			batteryListenerKey = null;
			 *		}
			 *
			 *		$('#btn_mobile_battery_addBatteryChangedListener').click(function() {
			 *			G2NMobile.Battery.addBatteryChangedListener(showBatteryResult, addListenerCallback);
			 *		});
			 *
			 *		$('#btn_mobile_battery_removeBatteryChangedListener').click(function() {
			 *			if ( batteryListenerKey !== null ) {
			 *				G2NMobile.Battery.removeBatteryChangedListener(batteryListenerKey, removeListenerCallback);
			 *			}
			 *		}
			 */
			addBatteryChangedListener: function addBatteryChangedListener(listener, callback) {
				var msg = G2NMsg.createRegistrationListenerMsg(Battery.objKey, listener, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Remove the event listener about change by charge of battery.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Battery/addBatteryChangedListener:method"}}{{/crossLink}}
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Battery/addBatteryChangedListener:method"}}{{/crossLink}}
			 * 
			 * @method removeBatteryChangedListener
			 * @param {String} listenerKey
			 * @param {function} callback
			 */
			removeBatteryChangedListener: function removeBatteryChangedListener(listenerKey, callback) {
				var msg = G2NMsg.createUnregistrationListenerMsg(Battery.objKey, listenerKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			}
			
		};
		

		//============================================================================================================================

		
		/**
		 * This class controls for audio of Android-Phone.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 *  
		 * @namespace G2NMobile
		 * @class Audio
		 */
		
		Audio.member = {
				
				
			/**
			 * Returns the current audio mode of Android-Phone.
			 * Audio mode means that sound, vibrate, silent mode of Android-Phone.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/setAudioMode:method"}}{{/crossLink}}
			 * 
			 * @method getAudioMode
			 * 
			 * @param {function} callback
			 * 
			 * @return {G2NMobile.Audio.AudioMode}	
			 * Returned the {{#crossLink "G2NMobile.Audio.AudioMode/NORMAL:attribute"}}{{/crossLink}}(2)
			 * when the current audio mode of Android-Phone has sound mode.
			 * And returned the {{#crossLink "G2NMobile.Audio.AudioMode/VIBRATE:attribute"}}{{/crossLink}}(1) has vibrate mode.
			 * Also, {{#crossLink "G2NMobile.Audio.AudioMode/SILENT:attribute"}}{{/crossLink}}(0) has silent mode.
			 * 
			 * @example
			 *		function showAudioResult(returnValue) {
			 *			$('#result_mobile_audio').text('Result: ' + returnValue);
			 *		}
			 * 
			 *		$('#btn_mobile_audio_getAudioMode').click(function() {
			 *			G2NMobile.Audio.getAudioMode(showAudioResult);
		     *		});
			 */
			getAudioMode: function getAudioMode(callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is sets the audio mode of Android-Phone. 
			 * Silent mode will mute the volume and will not vibrate. 
			 * Vibrate mode will mute the volume and vibrate. 
			 * Normal mode will be audible and may vibrate according to user settings.
			 * <br><br>
			 * Caution!<br>
			 * If wrong with the inputed value in first parameter for audioMode, you receive the 'G2NAudioModeException' message. 
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/getAudioMode:method"}}{{/crossLink}}
			 * 
			 * @method setAudioMode
			 * 
			 * @param {G2NMobile.Audio.AudioMode} audioMode	
			 * When you want to change current audio mode of Android-Phone to sound mode, input the
			 * {{#crossLink "G2NMobile.Audio.AudioMode/NORMAL:attribute"}}{{/crossLink}}(2).
			 * To vibrate mode input the
			 * {{#crossLink "G2NMobile.Audio.AudioMode/VIBRATE:attribute"}}{{/crossLink}}(1).
			 * To silent mode input the
			 * {{#crossLink "G2NMobile.Audio.AudioMode/SILENT:attribute"}}{{/crossLink}}(0).
			 * 
			 * @param {function} callback
			 * 
			 * @example
			 *		G2NMobile.Audio.setAudioMode(G2NMobile.Audio.AudioMode.SILENT);
			 */
			setAudioMode: function setAudioMode(audioMode, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method use when detect event about change of audio mode from Android-Phone.
			 * To detect changed event by audio mode, add the listener.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/removeAudioModeChangedListener:method"}}{{/crossLink}}
			 * 
			 * @method addAudioModeChangedListener
			 * @param {function} listener
			 * @param {function} callback
			 * @example
			 *		var audioModeChangedListenerKey = null;
			 * 
			 *		function showAudioResult(returnValue) {
			 *			$('#result_mobile_audio').text('Result: ' + returnValue[0]);
			 *		}
			 * 
			 *		function addOnAudioModeChangedListenerCallback(key) {
			 *			audioModeChangedListenerKey = key;
			 *		}
			 *
			 *		function removeAudioModeChangedListenerCallback() {
			 *			audioModeChangedListenerKey = null;
			 *		}
			 * 
			 *		$('#btn_mobile_audio_addAudioModeChangedListener').click(function() {
			 *			G2NMobile.Audio.addAudioModeChangedListener(showAudioResult, addOnAudioModeChangedListenerCallback);
			 *		});
			 *
			 *		$('#btn_mobile_audio_removeAudioModeChangedListener').click(function() {
			 *			if ( audioModeChangedListenerKey !== null ) {
			 *				G2NMobile.Audio.removeAudioModeChangedListener(audioModeChangedListenerKey, removeAudioModeChangedListenerCallback);
			 *			}
			 *		});
			 */
			addAudioModeChangedListener: function addAudioModeChangedListener(listener, callback) {
				var msg = G2NMsg.createRegistrationListenerMsg(Audio.objKey, listener, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Remove the event listener about change by audio mode.  
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/addAudioModeChangedListener:method"}}{{/crossLink}}
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Audio/addAudioModeChangedListener:method"}}{{/crossLink}}
			 * 
			 * @method removeAudioModeChangedListener
			 * @param {String} listenerKey
			 * @param {function} callback
			 */
			removeAudioModeChangedListener: function removeAudioModeChangedListener(listenerKey, callback) {
				var msg = G2NMsg.createUnregistrationListenerMsg(Audio.objKey, listenerKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},	
			
			
			/**
			 * Returns the current volume index about the volume type.
			 * <br><br>
			 * Caution!
			 * <br>If wrong with the inputed value in first parameter for volumeType, you receive the 'G2NAudioVolumeTypeException' message.
			 * <br>If audio mode isn't sound mode, you are unobtainable the volume index. It that you receive the 'G2NAudioModeException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/setVolumeValue:method"}}{{/crossLink}}
			 * 
			 * @method getVolumeValue
			 * 
			 * @param {G2NMobile.Audio.VolumeType} volumeType	
			 * {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}(0),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}}(2),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}}(3),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}}(4),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}(5),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}(8)
			 * 
			 * @param {function} callback
			 * @return {Number}
			 * @example
			 *		function showAudioResult(returnValue) {
			 *			$('#result_mobile_audio').text('Result: ' + returnValue[0]);
			 *		}
			 *
			 *		$('#btn_mobile_audio_getVolumeValue').click(function() {
			 *			G2NMobile.Audio.getVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, showAudioResult);
			 *		});
			 */
			getVolumeValue: function getVolumeValue(volumeType, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Set the volume index of the volume type.
			 * <br><br>
			 * Caution!
			 * <br>If wrong with the inputed value in first parameter for volumeType, you receive the 'G2NAudioVolumeTypeException' message.
			 * <br>If not inputed volume value from 0 to max volume value, you receive the 'G2NAudioVolumeValueException'. 
			 * <br>If wrong with the inputed value in third parameter for adjustVolumeOption, you receive the 'G2NAudioAdjustVolumeOptionException'.
			 * <br>If audio mode isn't sound mode, you are unobtainable the volume index. It that you receive the 'G2NAudioModeException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/getVolumeValue:method"}}{{/crossLink}}
			 * 
			 * @method setVolumeValue
			 * 
			 * @param {G2NMobile.Audio.VolumeType} volumeType	
			 * {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}(0),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}}(2),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}}(3),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}}(4),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}(5),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}(8)
			 *  
			 * @param {Number} volumeValue	
			 * The volume value to set.
			 * See {{#crossLink "G2NMobile.Audio/getMaxVolumeValue:method"}}{{/crossLink}} for the largest valid value. 
			 * 
			 * @param {G2NMobile.Audio.AdjustVolumeOption} adjustVolumeOption	
			 * The way Android-Phone window display the changed volume value.
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/SHOW_UI:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/PLAY_SOUND:attribute"}}{{/crossLink}}(4)
			 * 
			 * @param {function} callback
			 * 
			 * @example
			 *		G2NMobile.Audio.setVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, 5, G2NMobile.Audio.AdjustVolumeOption.PLAY_SOUND);
			 */
			setVolumeValue: function setVolumeValue(volumeType, volumeValue, adjustVolumeOption, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT', 'INT', 'INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Returns the maximum volume index about the volume type.
			 * <br><br>
			 * Caution!
			 * <br>If wrong with the inputed value in first parameter for volumeType, you receive the 'G2NAudioVolumeTypeException' message.
			 * <br>If audio mode isn't sound mode, you are unobtainable the volume index. It that you receive the 'G2NAudioModeException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/getVolumeValue:method"}}{{/crossLink}}
			 * 
			 * @method getMaxVolumeValue
			 * 
			 * @param {G2NMobile.Audio.VolumeType} volumeType	
			 * {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}(0),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}}(2),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}}(3),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}}(4),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}(5),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}(8)
			 * 
			 * @param {function} callback
			 * @return {Number}
			 * @example
			 *		G2NMobile.Audio.getMaxVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, showAudioResult);
			 */
			getMaxVolumeValue: function getMaxVolumeValue(volumeType, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * One step up to adjusts the volume of the volume type.
			 * <br><br>
			 * Caution!
			 * <br>If wrong with the inputed value in first parameter for volumeType, you receive the 'G2NAudioVolumeTypeException' message.
			 * <br>If wrong with the inputed value in second parameter for adjustVolumeOption, you receive the 'G2NAudioAdjustVolumeOptionException'.
			 * <br>If audio mode isn't sound mode, you are unobtainable the volume index. It that you receive the 'G2NAudioModeException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/adjustVolumeDown:method"}}{{/crossLink}}
			 * 
			 * @method adjustVolumeUp
			 * 
			 * @param {G2NMobile.Audio.VolumeType} volumeType	
			 * {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}(0),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}}(2),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}}(3),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}}(4),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}(5),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}(8)
			 * 
			 * @param {G2NMobile.Audio.AdjustVolumeOption} adjustVolumeOption	
			 * The way Android-Phone window display the adjusted volume value.
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/SHOW_UI:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/PLAY_SOUND:attribute"}}{{/crossLink}}(4)
			 * 
			 * @param {function} callback		
			 * 
			 * @example
			 *		G2NMobile.Audio.adjustVolumeUp(G2NMobile.Audio.VolumeType.SYSTEM, G2NMobile.Audio.AdjustVolumeOption.SHOW_UI);
			 */
			adjustVolumeUp: function adjustVolumeUp(volumeType, adjustVolumeOption, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT', 'INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * One step down to adjusts the volume of the volume type.
			 * <br><br>
			 * Caution!
			 * <br>If wrong with the inputed value in first parameter for volumeType, you receive the 'G2NAudioVolumeTypeException' message.
			 * <br>If wrong with the inputed value in second parameter for adjustVolumeOption, you receive the 'G2NAudioAdjustVolumeOptionException'.
			 * <br>If audio mode isn't sound mode, you are unobtainable the volume index. It that you receive the 'G2NAudioModeException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio/adjustVolumeUp:method"}}{{/crossLink}}
			 * 
			 * @method adjustVolumeDown
			 * 
			 * @param {G2NMobile.Audio.VolumeType} volumeType	
			 * {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}(0),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}}(2),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}}(3),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}}(4),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}(5),
			 * {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}(8)
			 * 
			 * @param {G2NMobile.Audio.AdjustVolumeOption} adjustVolumeOption	
			 * The way Android-Phone window display the adjusted volume value.
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/SHOW_UI:attribute"}}{{/crossLink}}(1),
			 * {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/PLAY_SOUND:attribute"}}{{/crossLink}}(4)
			 *
			 * @param {function} callback
			 * 
			 * @example
			 *		G2NMobile.Audio.adjustVolumeDown(G2NMobile.Audio.VolumeType.SYSTEM, G2NMobile.Audio.AdjustVolumeOption.SHOW_UI);
			 */
			adjustVolumeDown: function adjustVolumeDown(volumeType, adjustVolumeOption, callback) {
				var msg = G2NMsg.createMethodCallMsg(Audio.objKey, callback, ['INT', 'INT']);
				G2NConnect.send(JSON.stringify(msg));
			}
				
		};

		
		//============================================================================================================================

		
		/**
		 * As AudioMode class is a kind of type, it indicate a value for state of audio mode in Android-Phone.
		 * It is subordinate to the Audio Class. 
		 * And used in Audio class of G2NMobile module. 
		 * 
		 * @namespace G2NMobile
		 * @Class Audio.AudioMode
		 */
		Audio.member.AudioMode = {
				
				
			/**
			 * Audio mode that will be silent sound and will not vibrate.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.AudioMode/VIBRATE:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.AudioMode/NORMAL:attribute"}}{{/crossLink}}
			 * 
			 * @attribute SILENT
			 * @type Number
			 * @default 0
			 * @static
			 * @readOnly
			 */
			SILENT: 0,
			
			
			/**
			 * Audio mode that will vibrate and will be silent.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.AudioMode/SILENT:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.AudioMode/NORMAL:attribute"}}{{/crossLink}}
			 *            
			 * @attribute VIBRATE
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */
			VIBRATE: 1,
			
			
			/**
			 * Audio mode that will be audible and will be vibrate. 
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.AudioMode/SILENT:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.AudioMode/VIBRATE:attribute"}}{{/crossLink}}
			 * 
			 * @attribute NORMAL
			 * @type Number
			 * @default 2
			 * @static
			 * @readOnly
			 */
			NORMAL: 2			
		};
		
		
		//============================================================================================================================

		
		/**
		 * As VolumeType class is a kind of type, it indicate a value for kind of audio stream in Android-Phone.
		 * It is subordinate to the Audio Class. 
		 * And used in Audio class of G2NMobile module. 
		 * 
		 * @namespace G2NMobile
		 * @class Audio.VolumeType 
		 */
		Audio.member.VolumeType = {
			
				
			/**
			 * Audio stream for phone calls.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}
			 *             
			 * @attribute VOICE_CALL
			 * @type Number
			 * @default 0
			 * @static
			 * @readOnly
			 */
			VOICE_CALL: 0,
			
			
			/**
			 * Audio stream for system sounds.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}} 
			 * 
			 * @attribute SYSTEM
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */
			SYSTEM: 1,
			
			
			/**
			 * Audio stream for the phone ring.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}} 
			 *             
			 * @attribute RING
			 * @type Number
			 * @default 2
			 * @static
			 * @readOnly
			 */
			RING: 2,
			
			
			/**
			 * Audio stream for music playback.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}} 
			 * 
			 * @attribute MUSIC
			 * @type Number
			 * @default 3
			 * @static
			 * @readOnly
			 */
			MUSIC: 3,
			
			
			/**
			 * Audio stream for alarms.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}} 
			 *             
			 * @attribute ALARM
			 * @type Number
			 * @default 4
			 * @static
			 * @readOnly
			 */
			ALARM: 4,
			
			
			/**
			 * Audio stream for notifications.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/DTMF:attribute"}}{{/crossLink}}
			 *             
			 * @attribute NOTIFICATION
			 * @type Number
			 * @default 5
			 * @static
			 * @readOnly
			 */
			NOTIFICATION: 5,
			
			
			/**
			 * Audio stream for DTMF Tones.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.VolumeType/VOICE_CALL:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/SYSTEM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/RING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/MUSIC:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/ALARM:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Audio.VolumeType/NOTIFICATION:attribute"}}{{/crossLink}}
			 * 
			 * @attribute DTMF
			 * @type Number
			 * @default 8
			 * @static
			 * @readOnly
			 */
			DTMF: 8
		};
		
		
		//============================================================================================================================

		
		/**
		 * As VolumeType class is a kind of type, to show reacted when you was control volume for many kinds of audio stream in Android-Phone. 
		 * It is subordinate to the Audio Class. 
		 * And used in Audio class of G2NMobile module. 
		 * 
		 * @namespace G2NMobile
		 * @class Audio.AdjustVolumeOption 
		 */
		Audio.member.AdjustVolumeOption = {
			
				
			/**
			 * Show a toast volume value that you adjusted current selected audio stream in the Android-Phone window.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/PLAY_SOUND:attribute"}}{{/crossLink}} 
			 *            
			 * @attribute SHOW_UI
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */
			SHOW_UI: 1,
			
			
			/**
			 * Play sound volume value that you adjusted current selected audio stream in the Android-Phone.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Audio.AdjustVolumeOption/SHOW_UI:attribute"}}{{/crossLink}}
			 * 
			 * @attribute PLAY_SOUND
			 * @type Number
			 * @default 4
			 * @static
			 * @readOnly
			 */
			PLAY_SOUND: 4
		};
		
		
		//============================================================================================================================
		
		
		/**
		 * This Class controls one of Sensors that returned object through the 
		 * {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
		 * It is supported the sensor to the list of
		 * {{#crossLink "G2NMobile.Sensor.SensorType"}}{{/crossLink}}.
		 * <br><br>
		 * See Also : {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}},
		 *            {{#crossLink "G2NMobile.Sensor.SensorType/ACCELEROMETER:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NMobile.Sensor.SensorType/GYROSCOPE:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NMobile.Sensor.SensorType/LIGHT:attribute"}}{{/crossLink}} 
		 * 
		 * @namespace G2NMobile
		 * @class Sensor
		 */
		Sensor.member = G2NObject.G2NClassDefine({
			
			__construct: function(passedObjKey, callback) {
				G2NSystem.debugLog('Sensor __construct called!');

				// unregist exist objKey
				G2NSystem.unregisterObj(this.objKey);
				
				// re-registeration objKey from Bridge App Service
				G2NSystem.registerObjBySelf(passedObjKey, this);
				this.objKey = passedObjKey;
			},
			
			/**
			 * To detect changed event by sensor value, add the listener.
			 * Doing event registration in the beginning.
			 * After that it add the listener.
			 * <br><br>
			 * See Also :	{{#crossLink "G2NMobile.Sensor/removeSensorChangedListener:method"}}{{/crossLink}}, 
			 *				{{#crossLink "G2NMobile.Sensor/startListen:method"}}{{/crossLink}}
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method addSensorChangedListener
			 * @param {function} listener
			 * @param {function} callback
			 */
			addSensorChangedListener: function addSensorChangedListener(listener, callback){
				var msg = G2NMsg.createRegistrationListenerMsg(this.objKey, listener, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Remove the event listener about change by sensor value.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor/addSensorChangedListener:method"}}{{/crossLink}} 
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method removeSensorChangedListener
			 * @param {String} listenerKey
			 * @param {function} callback
			 */
			removeSensorChangedListener: function removeSensorChangedListener(listenerKey, callback) {
				var msg = G2NMsg.createUnregistrationListenerMsg(this.objKey, listenerKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is start the listener that detects the sensor value.
			 * <br><br>
			 * Caution!
			 * <br> If you are not call the {{#crossLink "G2NMobile.Sensor/addSensorChangedListener:method"}}{{/crossLink}},
			 * you will receive the 'G2NSensorAlreadyStartListeningException' message.
			 * <br> If there nothing registered the event listener, 
			 * you will receive the 'G2NSensorEventListenerException' message.  
			 * <br> If wrong entered the {{#crossLink "G2NMobile.Sensor.Delay"}}{{/crossLink}},
			 * you will receive the 'G2NWrongSensorDelayOptionException' message.   
			 * <br><br>
			 * See Also :	{{#crossLink "G2NMobile.Sensor/addSensorChangedListener:method"}}{{/crossLink}}, 
			 *				{{#crossLink "G2NMobile.Sensor/stopListen:method"}}{{/crossLink}}
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method startListen
			 * 
			 * @param {Number} delayOption   
			 * {{#crossLink "G2NMobile.Sensor.Delay/FAST:attribute"}}{{/crossLink}} that bring changed sensor value very quickly. 
			 * {{#crossLink "G2NMobile.Sensor.Delay/NORMAL:attribute"}}{{/crossLink}} that bring changed sensor value on medium speed.
			 * 
			 * @param {function} callback
			 */
			startListen: function startListen(delayOption, callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['INT']);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is stop the listener that detects the sensor value.
			 * <br><br>
			 * Caution!
			 * <br> If you are not call the {{#crossLink "G2NMobile.Sensor/removeSensorChangedListener:method"}}{{/crossLink}},
			 * you will receive the 'G2NSensorAlreadyStopListeningException' message.
			 * <br><br>
			 * See Also :	{{#crossLink "G2NMobile.Sensor/addSensorChangedListener:method"}}{{/crossLink}}, 
			 *				{{#crossLink "G2NMobile.Sensor/startListen:method"}}{{/crossLink}}
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method stopListen
			 * @param {function} callback
			 */
			stopListen: function stopListen(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get maximum range of the sensor in the sensor's unit.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getMaximumRange
			 * @param {function} callback
			 * @return {Number} MaximumRange
			 */
			getMaximumRange: function getMaximumRange(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get name string of the sensor.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getName
			 * @param {function} callback
			 * @return {String} SensorName
			 */
			getName: function getName(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get the power used by this sensor while in use.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getPower
			 * @param {fuction} callback
			 * @return {Number} PowerValue
			 */
			getPower: function getPower(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get resolution of the sensor in the sensor's unit.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getResolution
			 * @param {function} callback
			 * @return {Number} Resolution
			 */
			getResolution: function getResolution(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get the type of this sensor.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getType
			 * @param {function} callback
			 * @return {String} SensorType
			 */
			getType: function getType(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get the vendor string of this sensor.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getVender
			 * @param {function} callback
			 * @return {String} Vender
			 */
			getVendor: function getVendor(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is get a version of the sensor's module.
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getVersion
			 * @param {function} callback
			 * @return {Number} Version
			 */
			getVersion: function getVersion(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method returns a string containing a concise, human-readable description of this object. 
			 * <br><br>
			 * Example: {{#crossLink "G2NMobile.Sensor.SensorManager/getSensor:method"}}{{/crossLink}}
			 * 
			 * @method getDescript
			 * @param {function} callback
			 * @return {String} Description
			 */
			getDescript: function getDescript(callback) {
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			}
			
		});
		
		//============================================================================================================================
		
		
		/**
		 * As SensorType class is a kind of type, this class indicate type of loaded sensor within Android-Phone.
		 * It is subordinate to the Sensor Class. 
		 * And used in SensorManager class of G2NMobile module. 
		 * 
		 * @namespace G2NMobile
		 * @class Sensor.SensorType 
		 */
		Sensor.member.SensorType = {
				
				
			/**
			 * A constant describing an accelerometer sensor type.
			 * Acceleration force along the x, y, z axis. 
			 * Units of measure is 'm/s^2'.  
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor.SensorType/GYROSCOPE:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Sensor.SensorType/LIGHT:attribute"}}{{/crossLink}} 
			 *            
			 * @attribute ACCELEROMETER
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */	
			ACCELEROMETER: 1,
						
			
			/**
			 * A constant describing a gyroscope sensor type.
			 * Rate of rotation around the x, y, z axis.
			 * Units of measure is 'rad/s'.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor.SensorType/ACCELEROMETER:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Sensor.SensorType/LIGHT:attribute"}}{{/crossLink}} 
			 *            
			 * @attribute GYROSCOPE
			 * @type Number
			 * @default 4
			 * @static
			 * @readOnly
			 */	
			GYROSCOPE: 4,
			
			
			/**
			 * A constant describing a light sensor type.
			 * Units of measure is 'lux'.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor.SensorType/ACCELEROMETER:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Sensor.SensorType/GYROSCOPE:attribute"}}{{/crossLink}} 
			 *            
			 * @attribute LIGHT
			 * @type Number
			 * @default 5
			 * @static
			 * @readOnly
			 */
			LIGHT: 5
			
		};
		
		
		//============================================================================================================================

		
		/**
		 * This class is a kind of Delay type which indicate the changed sensor value.   
		 * It is subordinate to the Sensor Class. 
		 * And used in Sensor class of G2NMobile module. 
		 * 
		 * @namespace G2NMobile
		 * @class Sensor.Delay 
		 */		
		Sensor.member.Delay = {

				
			/**
			 * Bring changed sensor value very quickly.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor.Delay/NORMAL:attribute"}}{{/crossLink}}
			 *            
			 * @attribute FAST
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */				
			FAST: 1,
			
			
			/**
			 * Bring changed sensor value on medium speed.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Sensor.Delay/FAST:attribute"}}{{/crossLink}}
			 *            
			 * @attribute NORMAL
			 * @type Number
			 * @default 3
			 * @static
			 * @readOnly
			 */
			NORMAL: 3
			
		};
		
		
		//============================================================================================================================
		
		
		/**
		 * This Class provides several loaded sensor in Android-Phone.
		 * For now, it is provides to just the accelerometer, gyroscope, light sensor.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 *
		 * @namespace G2NMobile
		 * @class Sensor.SensorManager
		 */
		Sensor.SensorManager.member = {				
				
				
				/**
				 * Returns a Sensor class object as inputed the sensor type from first parameter.
				 * <br><br>
				 * Caution!
				 * <br>If wrong with the inputed value in first parameter for sensor Type, you receive the 'G2NWrongSensorTypeException' message.
			     * <br><br>
			     * See Also : {{#crossLink "G2NMobile.Sensor"}}{{/crossLink}}
				 * 
				 * @method getSensor
				 * @param {Number} G2NMobile.Sensor.SensorType	
				 * {{#crossLink "G2NMobile.Sensor.SensorType/ACCELEROMETER:attribute"}}{{/crossLink}}(1),
				 * {{#crossLink "G2NMobile.Sensor.SensorType/GYROSCOPE:attribute"}}{{/crossLink}}(4),
				 * {{#crossLink "G2NMobile.Sensor.SensorType/LIGHT:attribute"}}{{/crossLink}}(5)
				 * 
				 * @param {function} callback
				 * 
				 * @return {G2NMobile.Sensor}
				 * This Sensor class is defined in receive return value from this method.
				 * 
				 * @example
				 *		var sensor = null;
				 *		var sensorListenerKey = null;
				 *		var started = false;
				 *
				 *		function showSensorResult(returnValue) {
				 *			$('#result_mobile_sensor').html(returnValue);
				 *		}
				 *
				 *		$('#btn_mobile_sensor_getSensor').click(function() {
				 *			if ( sensor !== null ) {
				 *				showSensorResult('Sensor is not null');
				 *				return;
				 *			}
				 *			sensor = G2NMobile.Sensor.SensorManager.getSensor(G2NMobile.Sensor.SensorType.LIGHT, function(created) {
				 *				sensor = created;
				 *				showSensorResult('Sensor get: ' + sensor.getObjKey());
				 *			});
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_addSensorChangedListener').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			if ( sensorListenerKey !== null ) {
				 *				showSensorResult('Already Added');
				 *				return;
				 *			}
				 *			
				 *			sensor.addSensorChangedListener(
				 *				function(returnValue) {
				 *					var result = '';
				 *					for ( var i=0 ; i<returnValue.length ; i++ ) {
				 *						result += returnValue[i];
				 *						result += '<br/>';
				 *					}
				 *					
				 *					showSensorResult(result);
				 *				},
				 *				function(key) {
				 *					sensorListenerKey = key;
				 *					showSensorResult('Added Listener');
				 *				}
				 *			);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_startListen').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			if ( sensorListenerKey === null ) {
				 *				showSensorResult('Not added Listener');
				 *				return;
				 *			}
				 *			
				 *			if ( started === true ) {
				 *				showSensorResult('Already Started');
				 *				return;
				 *			}
				 *			
				 *			sensor.startListen(G2NMobile.Sensor.Delay.FAST, function() {
				 *				started = true;
				 *				showSensorResult('Start Listen');
				 *			});
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_stopListen').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			if ( sensorListenerKey === null ) {
				 *				showSensorResult('Not started Listening');
				 *				return;
				 *			}
				 *			
				 *			if ( started === false ) {
				 *				showSensorResult('Already Stoped');
				 *				return;
				 *			}
				 *			
				 *			sensor.stopListen(function() {
				 *				showSensorResult('Stop Listen');
				 *				started = false;
				 *			});
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getMaximumRange').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getMaximumRange(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getName').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getName(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getPower').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getPower(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getResolution').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getResolution(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getType').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getType(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getVendor').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getVendor(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getVersion').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getVersion(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_getDescript').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.getDescript(showSensorResult);
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_removeSensorChangedListener').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}	
				 *			
				 *			if ( sensorListenerKey === null ) {
				 *				showSensorResult('Not added Listening');
				 *				return;
				 *			}
				 *			
				 *			sensor.removeSensorChangedListener(sensorListenerKey, function() {
				 *				showSensorResult('Removed listener');
				 *				sensorListenerKey = null;
				 *			});
				 *		});
				 *		
				 *		$('#btn_mobile_sensor_destructSensor').click(function() {
				 *			if ( sensor === null ) {
				 *				showSensorResult('Sensor is null');
				 *				return;
				 *			}
				 *			
				 *			sensor.destruct(function() {
				 *				sensor = null;
				 *				showSensorResult('Sensor Destructed');
				 *			});
				 *		});
				 */
				getSensor: function getSensor(type, callback){
					var msg = G2NMsg.createMethodCallMsg(Sensor.SensorManager.objKey, callback, ['INT']);
					G2NConnect.send(JSON.stringify(msg));
				}		
		
		};
		
		
		//============================================================================================================================
		
		
		/**
		 * This is the 'Vibrate class' description for the G2NMobile module.
		 * The Vibrate class controls vibrator on board the Android-Phone. 
		 * But if vibrator does not exist, it is not work with Gear2.
		 * Also, Vibrating the Android-Phone doesn't change that its audio mode.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 *
		 * @namespace G2NMobile
		 * @class Vibrate
		 */
		Vibrate.member = {
				
				
				/**
				 * Vibrate constantly for the specified period of millisecond times. 
				 * After all this time, it will simply stop and not to be repeated.
				 * <br><br>
				 * Caution!
				 * <br>If You received the 'G2NVibrateTimeException' message saying that "Currently set time is negative number.",
				 * check that 'playTime' is setting properly with positive number and retry the operation.
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Vibrate/playPatternVibrate:method"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Vibrate/stopVibrate:method"}}{{/crossLink}}
				 * 
				 * @method playVibrate
				 * 
				 * @param {Number} playTime	
				 * It is the number of milliseconds to vibrate on. 
				 * If 'playTime' number is 0 or negative number, it is disabled.  
				 * 
				 * @param {function} callback
				 * 
				 * @example
				 *     $('#btn_mobile_vibrate_playVibrate').click(function() {
				 *         G2NMobile.Vibrate.playVibrate(1000);
				 *     }); 
				 */
				playVibrate: function playVibrate(playTime, callback){
					var msg = G2NMsg.createMethodCallMsg(Vibrate.objKey, callback, ['LONG']);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * You can vibrate with a given pattern and the pattern to repeat. 
				 * This method is the durations for which to turn on or off the vibrator in milliseconds.
				 * The first parameter indicates the number of milliseconds to wait before turning the vibrator on.
				 * And the seconds parameter indicates the number of milliseconds for which to keep the vibrator on before turning it off. 
				 * Parameters alternate between durations in milliseconds to turn the vibrator off or turn the vibrator on.
				 * <br><br>
				 * Caution!
				 * <br>If You received the 'G2NVibrateTimeException' message saying that "Currently set time is negative number.",
				 * check that parameters are setting properly with positive number and retry the operation.
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Vibrate/playVibrate:method"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Vibrate/stopVibrate:method"}}{{/crossLink}}
				 * 
				 * @method playPatternVibrate
				 * 
				 * @param {Number} waitTime	
				 * It is the number of milliseconds to vibrate off.
				 * If 'waitTime' number is 0 or negative number, it is disabled.
				 *   
				 * @param {Number} playTime	
				 * It is the number of milliseconds to vibrate on.
				 * If 'waitTime' number is 0 or negative number, it is disabled.
				 * 
				 * @param {function} callback
				 * 
				 * @example
				 *     $('#btn_mobile_vibrate_playPatternVibrate').click(function() {
				 *         G2NMobile.Vibrate.playPatternVibrate(500, 3000);
		         *     });
				 */
				playPatternVibrate: function playPatternVibrate(waitTime, playTime, callback){
					var msg = G2NMsg.createMethodCallMsg(Vibrate.objKey, callback, ['LONG', 'LONG']);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * This method is turn the vibrator off.
				 * 
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Vibrate/playPatternVibrate:method"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Vibrate/playVibrate:method"}}{{/crossLink}}
				 * 
				 * @method stopVibrate
				 * 
				 * @param {function} callback
				 * 
				 * @example
				 *     $('#btn_mobile_vibrate_stopVibrate').click(function() {
			     *         G2NMobile.Vibrate.stopVibrate();
		         *     });
				 */
				stopVibrate: function stopVibrate(callback){
					var msg = G2NMsg.createMethodCallMsg(Vibrate.objKey, callback);
					G2NConnect.send(JSON.stringify(msg));
				}
				
		};
		
		
		//============================================================================================================================
		
		
		/**
		 * Wifi Class controls Wi-Fi module in Android device.
		 * This class will detects wireless signal and will makes Wi-Fi list of AP that may be accessed by Wi-Fi.
		 * Refer to the {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}} class.
		 * It is singleton. Whatever you make several object, perceived as one object.
		 * <br><br>
		 * See Also : {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}}
		 * 
		 * @namespace G2NMobile
		 * @class Wifi
		 */
		Wifi.member = {
				
				
				/**
				 * This method is add the listener that detects the state of the Wi-Fi.
				 * To detect changed event of wireless signal for Wi-Fi, add the listener.
				 * Doing event registration in the beginning.
				 * After that it add the listener.
				 * <br><br>
				 * Caution!
				 * <br> If Wi-Fi module state was disable, you will receive the 'G2NWifiDisabledException' message.
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Wifi/removeWifiStateChangedListener:method"}}{{/crossLink}}
				 * 
				 * @method addOnWifiStateChangedListener
				 * @param {function} listener
				 * @param {function} callback
				 * 
				 * @example
				 *		var wifiStateListenerKey = null;
				 *		var wifi_on = false;
				 * 
				 *		function showWifiResult(returnValue) {
				 *			$('#result_mobile_wifi').html(returnValue);
				 *		}
				 *
				 *		$('#btn_mobile_wifi_addWifiStateChangedListener').click(function() {
				 *			
				 *			if ( wifiStateListenerKey !== null ) {
				 *				showWifiResult('Listener is not null');
				 *				return;
				 *			}
				 *			
				 *			G2NMobile.Wifi.addWifiStateChangedListener(function(returnValue) {
				 *				switch ( returnValue[0] ) {
				 *					case G2NMobile.Wifi.WifiState.ENABLED:
				 *						showWifiResult('ENABLED');
				 *						break;
				 *					
				 *					case G2NMobile.Wifi.WifiState.DISABLED:
				 *						showWifiResult('DISABLED');
				 *						break;
				 *						
				 *					case G2NMobile.Wifi.WifiState.CONNECTING:
				 *						showWifiResult('CONNECTING');
				 *						break;
				 *					
				 *					case G2NMobile.Wifi.WifiState.CONNECTED:
				 *						showWifiResult('CONNECTED');
				 *						break;
				 *						
				 *					case G2NMobile.Wifi.WifiState.DISCONNECTING:
				 *						showWifiResult('DISCONNECTING');
				 *						break;
				 *						
				 *					case G2NMobile.Wifi.WifiState.DISCONNECTED:
				 *						showWifiResult('DISCONNECTED');
				 *						break;
				 *					}
				 *			}, function(key) {
				 *				wifiStateListenerKey = key;
				 *				showWifiResult('Added Listener');
				 *			});
				 *		});
				 *	
				 *	
				 *		$('#btn_mobile_wifi_removeWifiStateChangedListener').click(function() {
				 *			if ( wifiStateListenerKey === null ) {
				 *				showWifiResult('Listener is null');
				 *				return;
				 *			}
				 *			
				 *			G2NMobile.Wifi.removeWifiStateChangedListener(wifiStateListenerKey, function() {
				 *				showWifiResult('Removed Listener');
				 *				wifiStateListenerKey = null;
				 *			});
				 *		});
				 */
				addWifiStateChangedListener: function addWifiStateChangedListener(listener, callback){
					var msg = G2NMsg.createRegistrationListenerMsg(Wifi.objKey, listener, callback);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * This method is remove the listener that detects the state of the Wi-Fi.
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Wifi/addWifiStateChangedListener:method"}}{{/crossLink}}
				 * <br><br>
				 * Example: {{#crossLink "G2NMobile.Wifi/addWifiStateChangedListener:method"}}{{/crossLink}}
				 *  
				 * @method removeWifiStateChangedListener
				 * @param {String} listenerKey
				 * @param {function} callback
				 */
				removeWifiStateChangedListener: function removeWifiStateChangedListener(listenerKey, callback){
					var msg = G2NMsg.createUnregistrationListenerMsg(Wifi.objKey, listenerKey, callback);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * This method is checked whether Wi-Fi is enabled or disabled.
				 * 
				 * @method getWifiEnabled
				 * @param {function} callback
				 * @return {Boolean} flag	True to enable, False to disable.
				 *  
				 * @example
				 *		function showWifiResult(returnValue) {
				 *			$('#result_mobile_wifi').html(returnValue);
				 *		}
				 *
				 *		$('#btn_mobile_wifi_getWifiEnabled').click(function() {
				 *			G2NMobile.Wifi.getWifiEnabled(function(returnValue) {
				 *				wifi_on = returnValue;
				 *				showWifiResult('' + wifi_on);
				 *			});
				 *		});
				 */
				getWifiEnabled: function getWifiEnabled(callback){
					var msg = G2NMsg.createMethodCallMsg(Wifi.objKey, callback);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * Set enable or disable Wi-Fi.
				 * 
				 * @method setWifiEnabled
				 * @param {Boolean} flag	True to enable, False to disable.
				 * @param {function} callback
				 * 
				 * @example
				 *		function showWifiResult(returnValue) {
				 *			$('#result_mobile_wifi').html(returnValue);
				 *		}
				 *
				 *		$('#btn_mobile_wifi_setWifiEnabled').click(function() {
				 *			if ( wifi_on === true )
				 *				wifi_on = false;
				 *			else
				 *				wifi_on = true;
				 *			
				 *			G2NMobile.Wifi.setWifiEnabled(wifi_on, function() {
				 *				showWifiResult('set wifi');
				 *			});
				 *		});
				 */
				setWifiEnabled: function setWifiEnabled(flag, callback){
					var msg = G2NMsg.createMethodCallMsg(Wifi.objKey, callback, ['BOOLEAN']);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * Makes connectable Wi-Fi list of AP(Access Point), after detect the wireless signal.
				 * Through this method you creates object of {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}} class.
				 * <br><br>
				 * Caution!
				 * <br> If state of Wi-Fi module is not enabled, you will receive 'G2NWifiDisabledException' message. 
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}}
				 * 
				 * @method getWifiList
				 * @param {funciton} callback
				 * @return {G2NMobile.Wifi.WifiList} Object of WifiList class.
				 * 
				 * @example
				 *		function showWifiResult(returnValue) {
				 *			$('#result_mobile_wifi').html(returnValue);
				 *		}
				 *
				 *		$('#btn_mobile_wifi_getWifiList').click(function() {
				 *			
				 *			G2NMobile.Wifi.getWifiList(function(list) {
				 *				wifiList = list;
				 *				list.getWifiListSize(function (length) {
				 *					if ( length > 0 ) {
				 *						list.getInfo(0, function(info) {
				 *							info.getSSID(showWifiResult);
				 *						});
				 *					}
				 *				});
				 *			});
				 *		});
				 */
				getWifiList: function getWifiList(callback){
					var msg = G2NMsg.createMethodCallMsg(Wifi.objKey, callback);
					G2NConnect.send(JSON.stringify(msg));
				},
					
				
				/**
				 * This method will trying to connect an AP in Wi-Fi list.
				 * Entering the password does not permit.
				 * It is allowed to stored the password from Android device already. 
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
				 * 
				 * @method connectWifi
				 * @param {G2NMobile.Wifi.WifiList} wifiList
				 * @param {Number} index 
				 * It indicate a index of Wi-Fi index, and permit from zero(0) to 
				 * {{#crossLink "G2NMobile.Wifi.WifiList/getWifiListSize:method"}}{{/crossLink}}.
				 * 
				 * @param {function} callback
				 * 
				 * @example
				 *		G2NMobile.Wifi.connectWifi(wifiList, 0);
				 */
				connectWifi: function connectWifi(wifiList, index, callback){
					var msg = G2NMsg.createMethodCallMsg(Wifi.objKey, callback, ['G2NOBJECT','INT']);
					G2NConnect.send(JSON.stringify(msg));
				},
				
				
				/**
				 * This method will trying to disconnect an AP in Wi-Fi list.
				 * <br><br>
				 * See Also : {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}},
				 *            {{#crossLink "G2NMobile.Wifi./getWifiList:method"}}{{/crossLink}}
				 *            
				 * @method disconnectWifi
				 * @param {G2NMobile.Wifi.WifiList} wifiList
				 * @param {Number} index 
				 * It indicate a index of Wi-Fi index, and permit from zero(0) to 
				 * {{#crossLink "G2NMobile.Wifi.WifiList/getWifiListSize:method"}}{{/crossLink}}.
				 * 
				 * @param {function} callback
				 * 
				 * @example
				 *		G2NMobile.Wifi.disconnectWifi(wifiList, 0);
				 */
				disconnectWifi: function disconnectWifi(wifiList, index, callback){
					var msg = G2NMsg.createMethodCallMsg(Wifi.objKey, callback, ['G2NOBJECT','INT']);
					G2NConnect.send(JSON.stringify(msg));
				}
				
		};
		
		
		//============================================================================================================================

		
		/**
		 * It indicate a state of Wi-Fi.
		 * When you register the {{#crossLink "G2NMobile.Wifi/addWifiStateChangedListener:method"}}{{/crossLink}} 
		 * method of {{#crossLink "G2NMobile.Wifi"}}{{/crossLink}}, you will obtain a state of Wi-Fi. 
		 * <br><br>
		 * See Also : {{#crossLink "G2NMobile.Wifi/addWifiStateChangedListener:method"}}{{/crossLink}},
		 *            {{#crossLink "G2NMobile.Wifi/removeWifiStateChangedListener:method"}}{{/crossLink}}
		 * 
		 * @namespace G2NMobile
		 * @class Wifi.WifiState
		 */
		Wifi.member.WifiState = {
				
			/**
			 * It indicate enabled state of Wi-Fi module in Android device.   
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/DISABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTED:attribute"}}{{/crossLink}}
			 *                       
			 * @attribute ENABLED
			 * @type Number
			 * @default 0
			 * @static
			 * @readOnly
			 */	
			ENABLED: 0,
			
			
			/**
			 * It indicate disabled state of Wi-Fi module in Android device.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}}, 
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTED:attribute"}}{{/crossLink}}
			 *            
			 *            
			 * @attribute DISABLED
			 * @type Number
			 * @default 1
			 * @static
			 * @readOnly
			 */	
			DISABLED: 1,
			
			
			/**
			 * It indicate connecting state of one of detected Wi-Fi list.  
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTED:attribute"}}{{/crossLink}}
			 *            
			 * @attribute CONNECTING
			 * @type Number
			 * @default 2
			 * @static
			 * @readOnly
			 */	
			CONNECTING: 2,
			
			
			/**
			 * It indicate connected state of one of detected Wi-Fi list.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTED:attribute"}}{{/crossLink}}
			 *            
			 * @attribute CONNECTED
			 * @type Number
			 * @default 3
			 * @static
			 * @readOnly
			 */	
			CONNECTED: 3,
			
			
			/**
			 * It indicate disconnecting state of one of detected Wi-Fi list.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTED:attribute"}}{{/crossLink}}
			 *            
			 * @attribute DISCONNECTING
			 * @type Number
			 * @default 4
			 * @static
			 * @readOnly
			 */	
			DISCONNECTING: 4,
			
			
			/**
			 * It indicate disconnected state of one of detected Wi-Fi list.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiState/ENABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISABLED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTING:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/CONNECTED:attribute"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiState/DISCONNECTING:attribute"}}{{/crossLink}}
			 *  
			 *            
			 * @attribute DISCONNECTED
			 * @type Number
			 * @default 5
			 * @static
			 * @readOnly
			 */	
			DISCONNECTED: 5
		};
		
		
		//============================================================================================================================
		
		
		/**
		 * This class provide a connectable AP of Wi-Fi.
		 * Through {{#crossLink "G2NMobile.Wifi.WifiList/getInfo:method"}}{{/crossLink}} method {{#crossLink "G2NMobile.Wifi.WifiList"}}{{/crossLink}}
		 * you will can create received this.
		 * <br><br>
	     * See Also : {{#crossLink "G2NMobile.Wifi.WifiList/getInfo:method"}}{{/crossLink}}   
		 * 
		 * @namespace G2NMobile
		 * @class Wifi.WifiInfo
		 */
		Wifi.WifiInfo.member = G2NObject.G2NClassDefine({
			
			
			__construct: function(passedObjKey, callback) {
				G2NSystem.debugLog('WifiList __construct called!');

				// unregist exist objKey
				G2NSystem.unregisterObj(this.objKey);
				
				// re-registeration objKey from Bridge App Service
				G2NSystem.registerObjBySelf(passedObjKey, this);
				this.objKey = passedObjKey;
			},
			
			
			/**
			 * Return the network name.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiInfo/getLevel:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiInfo/getBSSID:method"}}{{/crossLink}}
			 * <br><br>
			 * Example : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
			 * 
			 * @method getSSID
			 * @param {function} callback
			 * @return {String} SSID
			 */
			getSSID: function getSSID(callback){
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Return the detected signal level in dBm.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiInfo/getSSID:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiInfo/getBSSID:method"}}{{/crossLink}}
			 * <br><br>
			 * Example : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
			 * 
			 * @method getLevel
			 * @param {function} callback
			 * @return {Number} level
			 */
			getLevel: function getLevel(callback){
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * Return the address of the AP(access point).
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiInfo/getSSID:method"}}{{/crossLink}},
			 *            {{#crossLink "G2NMobile.Wifi.WifiInfo/getLevel:method"}}{{/crossLink}}
			 * <br><br>
			 * Example : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
			 * 
			 * @method getBSSID
			 * @param {function} callback
			 * @return {String} BSSID
			 */
			getBSSID: function getBSSID(callback){
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			}
			
		});
		
		
		//============================================================================================================================
		
		
		/**
		 * WifiList class made of the {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}} method of
		 * {{#crossLink "G2NMobile.Wifi"}}{{/crossLink}} class.
		 * It has connectable Wi-Fi list about AP. 
		 * <br><br>
	     * See Also : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
		 * 
		 * @namespace G2NMobile
		 * @class Wifi.WifiList
		 */
		Wifi.WifiList.member = G2NObject.G2NClassDefine({
	
			__construct: function(passedObjKey, callback) {
				G2NSystem.debugLog('WifiList __construct called!');

				// unregist exist objKey
				G2NSystem.unregisterObj(this.objKey);
				
				// re-registeration objKey from Bridge App Service
				G2NSystem.registerObjBySelf(passedObjKey, this);
				this.objKey = passedObjKey;
			},
			
			/**
			 * This method is returned size of Wi-Fi list.
			 * Through this size it has index from zero(0) to return value.
			 * <br><br>
			 * Caution!
			 * <br> If Wi-Fi list does not exist, you will receive 'G2NWifiListNullException' message. 
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiList/getInfo:method"}}{{/crossLink}}
			 * <br><br>
			 * Example : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
			 * 
			 * @method getWifiListSize
			 * @param {function} callback
			 * @return {Number} wifiListSize
			 */
			getWifiListSize: function getWifiListSize(callback){
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			},
			
			
			/**
			 * This method is used to create {{#crossLink "G2NMobile.Wifi.WifiInfo"}}{{/crossLink}} object.
			 * Input the index in first parameter of Wi-Fi list, for index about a AP of Wi-Fi list.
			 * Just obtain information for AP about{{#crossLink "G2NMobile.Wifi.WifiInfo/SSID:attribute"}}{{/crossLink}},
			 * {{#crossLink "G2NMobile.Wifi.WifiInfo/level:attribute"}}{{/crossLink}}, 
			 * {{#crossLink "G2NMobile.Wifi.WifiInfo/BSSID:attribute"}}{{/crossLink}} by this method.   
			 * <br><br>
			 * Caution!
			 * <br> If Wi-Fi list dose not exist, you will receive 'G2NWifiListNullException',
			 * <br> If range of size of Wi-Fi list were out, you received 'G2NWrongWifiListIndexException' message.
			 * <br><br>
			 * See Also : {{#crossLink "G2NMobile.Wifi.WifiInfo"}}{{/crossLink}}
			 * <br><br>
			 * Example : {{#crossLink "G2NMobile.Wifi/getWifiList:method"}}{{/crossLink}}
			 * 
			 * @method getInfo
			 * @param {Number} index 
			 * It indicate the detected Wi-Fi list, it permit from zero(0) to return value of
			 * {{#crossLink "G2NMobile.Wifi.WifiList/getWIfiLIstSize:method"}}{{/crossLink}}.
			 *  
			 * @param {function} callback
			 * @return {G2NMobile.Wifi.WifiInfo} WifiListInfo
			 */
			getInfo: function getInfo(index, callback){
				var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['INT']);
				G2NConnect.send(JSON.stringify(msg));
			}
			
		});
		
		
		//============================================================================================================================

		
		publicMember.Audio					= Audio.member;
		publicMember.Battery				= Battery.member;
		publicMember.Sensor					= Sensor.member;
		publicMember.Sensor.SensorManager	= Sensor.SensorManager.member;
		publicMember.Vibrate				= Vibrate.member;
		publicMember.Wifi					= Wifi.member;
		publicMember.Wifi.WifiInfo			= Wifi.WifiInfo.member;
		publicMember.Wifi.WifiList			= Wifi.WifiList.member;
		
		// register getBack classes (getBack classes is that created by Bridge App Service)  
		G2NSystem.registerClass(Sensor.objKey, Sensor.member);
		G2NSystem.registerClass(Wifi.WifiInfo.objKey, Wifi.WifiInfo.member);
		G2NSystem.registerClass(Wifi.WifiList.objKey, Wifi.WifiList.member);
		
		isInit = true;		
	}
	

	if ( isInit === false ) {
		initMobile();
	}
	
	return publicMember;	
});
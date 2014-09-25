
require(['jquery', 'G2NMobile', 'tau'], function ($, G2NMobile) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		$('#btn_to_mobile').click(function() {
			tau.changePage('#page_mobile');
		});
		
		$('#btn_to_mobile_audio').click(function() {
			tau.changePage('#page_mobile_audio');
		});
		
		$('#btn_to_mobile_battery').click(function() {
			tau.changePage('#page_mobile_battery');
		});
		
		$('#btn_to_mobile_sensor').click(function() {
			tau.changePage('#page_mobile_sensor');
		});
		
		$('#btn_to_mobile_vibrate').click(function() {
			tau.changePage('#page_mobile_vibrate');
		});
		
		$('#btn_to_mobile_wifi').click(function() {
			tau.changePage('#page_mobile_wifi');
		});
		
		
		/*
		 * Audio Test
		 * =======================================================================
		 */
		var audioModeChangedListenerKey = null;
		
		function showAudioResult(returnValue) {
			$('#result_mobile_audio').text('Result: ' + returnValue);
		}
		
		function addOnAudioModeChangedListenerCallback(key) {
			audioModeChangedListenerKey = key;
		}
		
		function removeAudioModeChangedListenerCallback() {
			audioModeChangedListenerKey = null;
		}
		
		$('#btn_mobile_audio_getAudioMode').click(function() {
			G2NMobile.Audio.getAudioMode(showAudioResult);
		});
		
		$('#btn_mobile_audio_setAudioMode').click(function() {
			G2NMobile.Audio.setAudioMode(G2NMobile.Audio.AudioMode.SILENT);
		});
		
		$('#btn_mobile_audio_addAudioModeChangedListener').click(function() {
			if ( audioModeChangedListenerKey !== null ) {
				alert('Listener is Exist');
				return;
			}
			G2NMobile.Audio.addAudioModeChangedListener(showAudioResult, addOnAudioModeChangedListenerCallback);
		});
		
		$('#btn_mobile_audio_removeAudioModeChangedListener').click(function() {
			if ( audioModeChangedListenerKey !== null ) {
				G2NMobile.Audio.removeAudioModeChangedListener(audioModeChangedListenerKey, removeAudioModeChangedListenerCallback);
			}
		});
		
		$('#btn_mobile_audio_getVolumeValue').click(function() {
			G2NMobile.Audio.getVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, showAudioResult);
		});
		
		$('#btn_mobile_audio_setVolumeValue').click(function() {
			G2NMobile.Audio.setVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, 5, G2NMobile.Audio.AdjustVolumeOption.PLAY_SOUND);
		});
		
		$('#btn_mobile_audio_getMaxVolumeValue').click(function() {
			G2NMobile.Audio.getMaxVolumeValue(G2NMobile.Audio.VolumeType.SYSTEM, showAudioResult);
		});
		
		$('#btn_mobile_audio_adjustVolumeUp').click(function() {
			G2NMobile.Audio.adjustVolumeUp(G2NMobile.Audio.VolumeType.SYSTEM, G2NMobile.Audio.AdjustVolumeOption.SHOW_UI, showAudioResult);
		});
		
		$('#btn_mobile_audio_adjustVolumeDown').click(function() {
			G2NMobile.Audio.adjustVolumeDown(G2NMobile.Audio.VolumeType.SYSTEM, G2NMobile.Audio.AdjustVolumeOption.SHOW_UI, showAudioResult);
		});
		
		
		/*
		 * Battery Test
		 * =======================================================================
		 */
		var batteryListenerKey = null;
		
		function showBatteryResult(returnValue) {
			$('#result_mobile_battery').text('Result: ' + returnValue);
		}
		
		function addListenerCallback(key) {
			batteryListenerKey = key;
		}
		
		function removeListenerCallback() {
			batteryListenerKey = null;
		}
		
		$('#btn_mobile_battery_addBatteryChangedListener').click(function() {
			if ( batteryListenerKey !== null ) {
				alert('Listener is Exist');
				return;
			}
			G2NMobile.Battery.addBatteryChangedListener(showBatteryResult, addListenerCallback);
		});
		
		$('#btn_mobile_battery_removeBatteryChangedListener').click(function() {
			if ( batteryListenerKey !== null ) {
				G2NMobile.Battery.removeBatteryChangedListener(batteryListenerKey, removeListenerCallback);
			}
		});
		
		/*
		 * Sensor Test
		 * =======================================================================
		 */
		var sensor = null;
		var sensorListenerKey = null;
		var started = false;
		
		function showSensorResult(returnValue) {
			$('#result_mobile_sensor').html(returnValue);
		}
				
		$('#btn_mobile_sensor_getSensor').click(function() {
			if ( sensor !== null ) {
				showSensorResult('Sensor is not null');
				return;
			}

			sensor = G2NMobile.Sensor.SensorManager.getSensor(G2NMobile.Sensor.SensorType.LIGHT, function(created) {
				sensor = created;
				showSensorResult('Sensor get: ' + sensor.getObjKey());
			});
		});
		
		$('#btn_mobile_sensor_addSensorChangedListener').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			if ( sensorListenerKey !== null ) {
				showSensorResult('Already Added');
				return;
			}
			
			sensor.addSensorChangedListener(
				function(returnValue) {
					var result = '';
					for ( var i=0 ; i<returnValue.length ; i++ ) {
						result += returnValue[i];
						result += '<br/>';
					}
					
					showSensorResult(result);
				},
				function(key) {
					sensorListenerKey = key;
					showSensorResult('Added Listener');
				}
			);
		});
		
		$('#btn_mobile_sensor_startListen').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			if ( sensorListenerKey === null ) {
				showSensorResult('Not added Listener');
				return;
			}
			
			if ( started === true ) {
				showSensorResult('Already Started');
				return;
			}
			
			sensor.startListen(G2NMobile.Sensor.Delay.FAST, function() {
				started = true;
				showSensorResult('Start Listen');
			});
		});
		
		$('#btn_mobile_sensor_stopListen').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			if ( sensorListenerKey === null ) {
				showSensorResult('Not started Listening');
				return;
			}
			
			if ( started === false ) {
				showSensorResult('Already Stoped');
				return;
			}
			
			sensor.stopListen(function() {
				showSensorResult('Stop Listen');
				started = false;
			});
		});
		
		$('#btn_mobile_sensor_getMaximumRange').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getMaximumRange(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getName').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getName(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getPower').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getPower(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getResolution').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getResolution(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getType').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getType(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getVendor').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getVendor(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getVersion').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getVersion(showSensorResult);
		});
		
		$('#btn_mobile_sensor_getDescript').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.getDescript(showSensorResult);
		});
		
		$('#btn_mobile_sensor_removeSensorChangedListener').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}	
			
			if ( sensorListenerKey === null ) {
				showSensorResult('Not added Listening');
				return;
			}
			
			sensor.removeSensorChangedListener(sensorListenerKey, function() {
				showSensorResult('Removed listener');
				sensorListenerKey = null;
			});
		});
		
		$('#btn_mobile_sensor_destructSensor').click(function() {
			if ( sensor === null ) {
				showSensorResult('Sensor is null');
				return;
			}
			
			sensor.destruct(function() {
				sensor = null;
				showSensorResult('Sensor Destructed');
			});
		});
		
		
		/*
		 * Vibrate Test
		 * =======================================================================
		 */
		
		$('#btn_mobile_vibrate_playVibrate').click(function() {
			G2NMobile.Vibrate.playVibrate(1000);
		});
		
		$('#btn_mobile_vibrate_playPatternVibrate').click(function() {
			G2NMobile.Vibrate.playPatternVibrate(500, 3000);
		});
		
		$('#btn_mobile_vibrate_stopVibrate').click(function() {
			G2NMobile.Vibrate.stopVibrate();
		});
		
		$('#btn_mobile_vibrate_makeException').click(function() {
			G2NMobile.Vibrate.playVibrate(-1000);
		});
		
		
		/*
		 * Wifi Test
		 * =======================================================================
		 */
		
		var wifiStateListenerKey = null;
		var wifiList = null;
		var wifi_on = false;
		
		function showWifiResult(returnValue) {
			$('#result_mobile_wifi').html(returnValue);
		}
		
		$('#btn_mobile_wifi_addWifiStateChangedListener').click(function() {
			
			if ( wifiStateListenerKey !== null ) {
				showWifiResult('Listener is not null');
				return;
			}
			
			G2NMobile.Wifi.addWifiStateChangedListener(function(returnValue) {
				switch ( returnValue[0] ) {
					case G2NMobile.Wifi.WifiState.ENABLED:
						showWifiResult('ENABLED');
						break;
					
					case G2NMobile.Wifi.WifiState.DISABLED:
						showWifiResult('DISABLED');
						break;
						
					case G2NMobile.Wifi.WifiState.CONNECTING:
						showWifiResult('CONNECTING');
						break;
					
					case G2NMobile.Wifi.WifiState.CONNECTED:
						showWifiResult('CONNECTED');
						break;
						
					case G2NMobile.Wifi.WifiState.DISCONNECTING:
						showWifiResult('DISCONNECTING');
						break;
						
					case G2NMobile.Wifi.WifiState.DISCONNECTED:
						showWifiResult('DISCONNECTED');
						break;
					}
			}, function(key) {
				wifiStateListenerKey = key;
				showWifiResult('Added Listener');
			});
		});
	
	
		$('#btn_mobile_wifi_removeWifiStateChangedListener').click(function() {
			if ( wifiStateListenerKey === null ) {
				showWifiResult('Listener is null');
				return;
			}
			
			G2NMobile.Wifi.removeWifiStateChangedListener(wifiStateListenerKey, function() {
				showWifiResult('Removed Listener');
				wifiStateListenerKey = null;
			});
		});
	
		
		$('#btn_mobile_wifi_getWifiEnabled').click(function() {
			G2NMobile.Wifi.getWifiEnabled(function(returnValue) {
				wifi_on = returnValue;
				showWifiResult('' + wifi_on);
			});
		});
		
		$('#btn_mobile_wifi_setWifiEnabled').click(function() {
			if ( wifi_on === true )
				wifi_on = false;
			else
				wifi_on = true;
			
			G2NMobile.Wifi.setWifiEnabled(wifi_on, function() {
				showWifiResult('set wifi');
			});
		});
		
		$('#btn_mobile_wifi_getWifiList').click(function() {
			
			G2NMobile.Wifi.getWifiList(function(list) {
				wifiList = list;
				list.getWifiListSize(function (length) {
					if ( length > 0 ) {
						list.getInfo(0, function(info) {
							info.getSSID(showWifiResult);
						});
					}
				});
			});
		});
		
		$('#btn_mobile_wifi_connectWifi').click(function() {
			
			if (wifiList === null ) {
				showWifiResult('wifiList is null');
				return;
			}
			
			G2NMobile.Wifi.connectWifi(wifiList, 0);
		});
		
		$('#btn_mobile_wifi_disconnectWifi').click(function() {
			
			if (wifiList === null ) {
				showWifiResult('wifiList is null');
				return;
			}
			
			G2NMobile.Wifi.disconnectWifi(wifiList, 0);
		});
		
	});
});

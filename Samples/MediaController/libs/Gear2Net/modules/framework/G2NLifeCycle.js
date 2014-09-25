define(['G2NSystem', 'G2NConnect'], function(G2NSystem, G2NConnect) {
	
	var onCreate = null,
		onResume = null,
		onPause = null,
		onDestroy = null,
		onCreateMsg = null,
		onResumeMsg = null,
		onPauseMsg = null,
		onDestroyMsg = null,
		isDestoryed = false,
		alertWait = false,
		originalAlert = null,
		isInit = false,
		publicMember = {};
	
	function sendDestroyMsg() {
		var destroyMsg = {};
		destroyMsg.wID = G2NSystem.appId;
		destroyMsg.func = 'destroyMsg';
		
		G2NConnect.send(destroyMsg);
	}
	
	function isFunction(func) {
		if ( func === null || func === undefined ) {
			return false;
		}
		
		if ( typeof(func) === 'function' ) {
			return true;
		}
		
		return false;
	}
	
	function onCreateDefaultFunc() {
		G2NSystem.debugLog('onCreate');
		if ( onCreate ) {
			onCreate();
		}
		
		// Resume after Create!
		G2NConnect.requestSAAgent(function() {
			onResumeDefaultFunc(true);	
		});
	}
	
	function onResumeDefaultFunc(created) {
		if ( alertWait ) {
			alertWait = false;
			return;
		}
		G2NSystem.debugLog('onResume');
		G2NConnect.connect(function() {
			if ( created ) {
				G2NConnect.send(onCreateMsg);
			}
			
			G2NConnect.send(onResumeMsg);
			
			if ( onResume ) {
				onResume();
			}
		});
	}
	
	function onPauseDefaultFunc() {
//		if ( isDestoryed ) {
//			return;
//		} //deprecated
		
		if ( alertWait ) {
			return;
		}
		G2NSystem.debugLog('onPause');
		if ( onPause ) {
			onPause();
		}
		
		G2NConnect.send(onPauseMsg);
		G2NConnect.pause();
	}
	
	function onDestroyDefaultFunc() {
		G2NSystem.debugLog('onDestroy');
		if ( onDestroy ) {
			onDestroy();
		}
	}
	
	function exit() {
		onDestroyDefaultFunc();
		
		if ( G2NConnect.isConnected() === false ) {
			isDestoryed = true;
			tizen.application.getCurrentApplication().exit();
		} else {
			G2NConnect.send(onDestroyMsg);
			
		}
	}

	function onCreateReturn() {
		
	}
	
	function onResumeReturn() {
		
	}
	
	function onPauseReturn() {
		
	}
	
	function onDestroyReturn() {
		G2NConnect.disconnect(function() {
			isDestoryed = true;
			tizen.application.getCurrentApplication().exit();
		});
	}
	
	function setOnCreateCallbak(onCreateCallback) {
		if ( isFunction(onCreateCallback) ) {
			onCreate = onCreateCallback;
		}
	}
	
	function setOnResumeCallbak(onResumeCallback) {
		if ( isFunction(onResumeCallback) ) {
			onResume = onResumeCallback;
		}
	}
	
	function setOnPauseCallback(onPauseCallback) {
		if ( isFunction(onPauseCallback) ) {
			onPause = onPauseCallback;
		}
	}
	
	function setOnDestroyCallback(onDestroyCallback) {
		if ( isFunction(onDestroyCallback) ) {
			onDestroy = onDestroyCallback;
		}
	}
	
	function notPauseAlert(data) {
		alertWait = true;
		originalAlert(data);
	}
	
	function makeMsgs()
	{
		onCreateMsg = {
			msgType: 'STATUS',
			wID: G2NSystem.appId,
			status: 'create',
			countOfThread: 4,
			callbackKey: G2NSystem.registerCallback(onCreateReturn)
		};
		
		onResumeMsg = {
			msgType: 'STATUS',
			wID: G2NSystem.appId,
			status: 'resume',
			countOfThread: 'null',
			callbackKey: G2NSystem.registerCallback(onResumeReturn)
		};
		
		onPauseMsg = {
			msgType: 'STATUS',
			wID: G2NSystem.appId,
			status: 'pause',
			countOfThread: 'null',
			callbackKey: G2NSystem.registerCallback(onPauseReturn)
		};
		
		onDestroyMsg = {
			msgType: 'STATUS',
			wID: G2NSystem.appId,
			status: 'destroy',
			countOfThread: 'null',
			callbackKey: G2NSystem.registerCallback(onDestroyReturn)
		};
		
		onCreateMsg = JSON.stringify(onCreateMsg);
		onResumeMsg = JSON.stringify(onResumeMsg);
		onPauseMsg = JSON.stringify(onPauseMsg);
		onDestroyMsg = JSON.stringify(onDestroyMsg);
	}
	
	function autoReconnect(prev, cur) {
//		if ( cur === 'SCREEN_OFF' ) {
//			onPauseDefaultFunc();			
//		} else
		if ( prev === 'SCREEN_OFF' && cur === 'SCREEN_NORMAL' ) {
			if ( G2NConnect.isConnected() !== true ) {
				onResumeDefaultFunc();				
			}
			else {
				if ( onResume ) {
					onResume();
				}
			}
		}
	}
	
	function initG2NLifeCycle() {
	
		makeMsgs();
		
		if ( G2NSystem.isWatchWidget ) {
			tizen.power.setScreenStateChangeListener(autoReconnect);
		}
		
		// callback function setter
//		publicMember.setOnCreateCallback = setOnCreateCallbak;
		publicMember.setOnResumeCallback = setOnResumeCallbak;
		publicMember.setOnPauseCallback = setOnPauseCallback;
//		publicMember.setOnDestroyCallback = setOnDestroyCallback;
		
		// system callback setting
		publicMember.onCreateDefaultFunc = onCreateDefaultFunc;
		publicMember.onResumeDefaultFunc = onResumeDefaultFunc;
		publicMember.onPauseDefaultFunc = onPauseDefaultFunc;
		publicMember.onDestroyDefaultFunc = onDestroyDefaultFunc;
		
		publicMember.exit = exit;
		
		// change default alert function (for pause/resume event)
		originalAlert = window.alert;
		window.alert = notPauseAlert;
		
		G2NSystem.debugLog('G2NLifeCycle Init!');
		isInit = true;
	}
	
	if ( isInit === false ) {
		initG2NLifeCycle();
	}
	
	return publicMember;
});
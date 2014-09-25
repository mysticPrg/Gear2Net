define(['uuid', 'tau'], function() {
	
	var isDebugMode = true,
		appId = null,
		isWatchWidgetVar = false,
		callbackTable = {},
		listenerTable = {},
		objTable = {},
		classTable = {},
		isInit = false,
		publicMember = {};

	function getFunctionName(func_str) {
		var func_name_reg = /function (.*?)\(/;
		
		return func_name_reg.exec( func_str )[1];
	}
	
	function debugLog(data) {
		var caller;
		if ( isDebugMode ) {
			 caller = debugLog.caller.toString();
			 caller = getFunctionName(caller);
			 
			console.log(caller + " : " + data);
		}
	}
	
	function setDebugMode(debugMode) {
		if ( debugMode ) {
			isDebugMode = true;
		}
		else {
			isDebugMode = false;
		}
	}
	
	function registerObjBySelf(objKey, obj) {
		objTable[objKey] = obj;
		return objKey;
	}
	
	function registerObj(obj) {
		var objKey = Math.uuid(10);
		while ( objTable[objKey] ) {
			objKey = Math.uuid(10);
		}
		return registerObjBySelf(objKey, obj);
	}
	
	function getObj(objKey) {
		return objTable[objKey];
	}
	
	function isExistObj(objKey) {
		if ( objTable[objKey] ) {
			return true;
		} else {
			return false;
		}
	}
	
	function unregisterObj(objKey) {
		if ( objTable[objKey] ) {
			delete objTable[objKey];
		}
	}

	function registerCallback(callback)	{
		var callbackKey = Math.uuid(10);
		while ( callbackTable[callbackKey] ) {
			callbackKey = Math.uuid(10);
		}
		
		callbackTable[callbackKey] = callback;
		return callbackKey;
	}
	
	function unregisterCallbackByKey(callbackKey) {
		if ( callbackTable[callbackKey] ) {
			callbackTable[callbackKey] = null;
		}
	}
	
	function invokeCallback(callbackKey, returnValue) {
		if ( !callbackKey ) {
			debugLog('Invalid callback key: ' + callbackKey);
			return;
		}
		
		var callback = callbackTable[callbackKey];
		if ( callback && typeof(callback) === 'function' ) {
			callback(returnValue);
		}
		
		unregisterCallbackByKey(callbackKey);
	}
	
	function invokeListener(listenerKey, returnValue) {
		if ( !listenerKey ) {
			debugLog('Invalid listener key: ' + listenerKey);
			return;
		}
		
		var listener = listenerTable[listenerKey];
		if ( listener && typeof(listener) === 'function' ) {
			listener(returnValue);
		}
	}
	
	function registerListener(listener) {
		var listenerKey = Math.uuid(10);
		while ( listenerTable[listenerKey] ) {
			listenerKey = Math.uuid(10);
		}
		
		listenerTable[listenerKey] = listener;
		return listenerKey;
	}
	
	function unregisterListenerByKey(listenerKey) {
		if ( listenerTable[listenerKey] ) {
			listenerTable[listenerKey] = null;
		}
	}
	
	function registerClass(classname, classObj) {
		classTable[classname] = classObj;
	}
	
	function getClass(classname) {
		return classTable[classname];
	}
	
	function getWidgetInfo() {
		var appInfo = null;
	
		appInfo = tizen.application.getCurrentApplication().appInfo;
		isWatchWidgetVar = appInfo.categories.indexOf('com.samsung.wmanager.WATCH_CLOCK');
		
		if ( isWatchWidgetVar === -1 ) {
			isWatchWidgetVar = false;
		}
		else {
			isWatchWidgetVar = true;
		}
	}
	
	function isWatchWidget() {
		return isWatchWidgetVar;
	}
	
	function initG2NSystem() {
		setDebugMode(true);
		
		tau.defaults.pageTransition = "slideup";
		
		// System Info
		appId = tizen.application.getCurrentApplication().appInfo.id;
		publicMember.appId = appId;
		getWidgetInfo();
		publicMember.isWatchWidget = isWatchWidget;
		publicMember.providerAppName = 'BridgeAppService';
		
		publicMember.debugLog = debugLog;
		publicMember.setDebugMode = setDebugMode;
		
		
		// object
		publicMember.registerObjBySelf = registerObjBySelf;
		publicMember.registerObj = registerObj;
		publicMember.getObj = getObj;
		publicMember.isExistObj = isExistObj;
		publicMember.unregisterObj = unregisterObj;
		
		// callback
		publicMember.registerCallback = registerCallback;
		publicMember.unregisterCallbackByKey = unregisterCallbackByKey;
		publicMember.invokeCallback = invokeCallback;
		publicMember.invokeListener = invokeListener;
		
		// listener
		publicMember.registerListener = registerListener;
		publicMember.unregisterListenerByKey = unregisterListenerByKey;
		
		// class
		publicMember.registerClass = registerClass;
		publicMember.getClass = getClass;

		isInit = true;
		debugLog('G2NSystem Init!');
	}
	
	if ( isInit === false ) {
		initG2NSystem();
	}
	
	return publicMember;
});
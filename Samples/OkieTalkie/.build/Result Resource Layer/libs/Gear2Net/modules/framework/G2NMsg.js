define(['G2NSystem', 'uuid'], function(G2NSystem) {
	
	var isInit = false,
	publicMember = {};
	
	/*
	 * private member
	 */
	function getFunctionName(func_str) {
		var func_name_reg = /function (.*?)\(/;
		
		return func_name_reg.exec( func_str )[1];
	}
	
	function getArgs(vals, types) {
		var args = [],
			i;
		
		if ( vals ) {
			for ( i in vals ) {
				// Callback 함수를 만날때까지 매개변수 리스트 생성
				switch ( typeof(vals[i]) ) {
					case 'function':
					case undefined:
					case null:
						break;
					
					default:
						if ( types[i] ) {
							/*
							 * If argument is G2NObject Type
							 * then 
							 */
							if ( types[i] === 'G2NOBJECT' ) {
								vals[i] = vals[i].objKey;
							}
							
							args.push({
								type: types[i],
								value: vals[i]
							});
						}
				}
			}
		}
		
		return args;
	}
	
	/*
	 * public member
	 */
	
	function createConstructorMsg(classname, objKey, callback, types, arguments) {
		var args = [],
			callbackKey = null,
			vals = arguments; // argument list
		
			if ( !vals ) {
				vals = createConstructorMsg.caller.arguments;
			}
			
			// register and create key
			callbackKey = G2NSystem.registerCallback(callback);
			
			// make args
			args = getArgs(vals, types);
			
			return {
				msgType: 'CONSTRUCTOR',
				wID: G2NSystem.appId,
				
				classname: classname,
				args: args,
				objKey: objKey,
				callbackKey: callbackKey,
			};
	}
	
	function createDestructorMsg(objKey, callback) {
		var callbackKey = null;
		
		G2NSystem.unregisterObj(objKey);
		
		// register and create key
		callbackKey = G2NSystem.registerCallback(callback);
		
		return {
			msgType: 'DESTRUCTOR',
			wID: G2NSystem.appId,
			
			objKey: objKey,
			callbackKey: callbackKey
		};
	}
	
	function createMethodCallMsg(objKey, callback, types) {
		var args = [],
			callbackKey = null,
			func_str = null,
			func_name = null,
			vals = createMethodCallMsg.caller.arguments; // argument list
		
		// get function name 
		func_str = createMethodCallMsg.caller.toString();
		func_name = getFunctionName(func_str);
		
		// register and create key
		callbackKey = G2NSystem.registerCallback(callback);
		
		// make args
		args = getArgs(vals, types);
		
		return {
			msgType: 'METHOD_CALL',
			wID: G2NSystem.appId,
			
			func: func_name,
			args: args,
			objKey: objKey,
			callbackKey: callbackKey,
		};
	}
	
	function createStatusMsg(status, coutOfThread, callback) {
		var callbackKey = null;
		
		// register and create key
		callbackKey = G2NSystem.registerCallback(callback);
		
		return {
			msgType: 'STATUS',
			wID: G2NSystem.appId,
			
			status: status,
			coutOfThread: coutOfThread,
			callbackKey: callbackKey,
		};
	}
	
	function createRegistrationListenerMsg(objKey, listener, callback) {
		var callbackKey = null,
			listenerKey = null,
			func_str = null,
			func_name = null;
		
		// get function name 
		func_str = createRegistrationListenerMsg.caller.toString();
		func_name = getFunctionName(func_str);
		
		// register and create key
		listenerKey = G2NSystem.registerListener(listener);
		callbackKey = G2NSystem.registerCallback(callback);
		
		return {
			msgType: 'REGISTRATION_LISTENER',
			wID: G2NSystem.appId,
			
			func: func_name,
			objKey: objKey,
			callbackKey: callbackKey,
			listenerKey: listenerKey
		};
	}
	
	function createUnregistrationListenerMsg(objKey, listenerKey, callback) {
		var callbackKey = null,
			func_str = null,
			func_name = null;
		
		// get function name 
		func_str = createUnregistrationListenerMsg.caller.toString();
		func_name = getFunctionName(func_str);
		
		// register and create key
		G2NSystem.unregisterListenerByKey(listenerKey);
		callbackKey = G2NSystem.registerCallback(callback);
		
		return {
			msgType: 'UNRESISTRATION_LISTENER',
			wID: G2NSystem.appId,
			
			func: func_name,
			objKey: objKey,
			callbackKey: callbackKey,
			listenerKey: listenerKey
		};
	}

	/*
	 * init
	 */
	if ( isInit === false ) {
		publicMember.createConstructorMsg = createConstructorMsg;
		publicMember.createDestructorMsg = createDestructorMsg;
		publicMember.createMethodCallMsg = createMethodCallMsg;
		publicMember.createStatusMsg = createStatusMsg;
		publicMember.createRegistrationListenerMsg = createRegistrationListenerMsg;
		publicMember.createUnregistrationListenerMsg = createUnregistrationListenerMsg;
		
		G2NSystem.debugLog('G2NMsg Init!');
		isInit = true;
	}
	
	return publicMember;
});
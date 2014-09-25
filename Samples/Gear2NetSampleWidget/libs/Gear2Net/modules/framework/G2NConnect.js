define(['G2NSystem'], function(G2NSystem) {
	var channelIDs = {},
		SAAgents = {},
		SASocket = null,
		
		agentCallback = null,
		peerAgentFindCallback = null,
		
		onCreatedSAAgentCallback = null,
		onConnectedCallback = null,
		onDisconnectedCallback = null,
		
		isPause = false,
		appType = null,
		isConnectedVar = false,
		publicMember = {},
		isInit = false;
	
	/*
	 * private member
	 */
	
	function onError(err) {
		G2NSystem.debugLog("err [" + err.name + "] msg[" + err.message + "]");
	}
	
	agentCallback = {
		onconnect : function(socket) {
			SASocket = socket;
			G2NSystem.debugLog(appType + ' Widget Connected!');
			SASocket.setSocketStatusListener(function(reason){
				isConnectedVar = false;
				G2NSystem.debugLog("Service connection lost, Reason : [" + reason + "]");
				if ( onDisconnectedCallback ) {
					onDisconnectedCallback();
				}
			});
			
			isConnectedVar = true;
			isPause = false;
			
			if ( onConnectedCallback ) {
				onConnectedCallback();
			}
		},
		onrequest : function(peerAgent) {
			G2NSystem.debugLog('onRequest');
		},
		onerror : onError
	};
	
	function forceClose() {
		if ( appType === 'normal' ) {
			if ( isPause === false ) {
				alert('Disconned to Android Device!\nThis Application will be closing');
				tizen.application.getCurrentApplication().exit();	
			}
		}
	}
	
	peerAgentFindCallback = {
		onpeeragentfound : function onpeeragentfoundAtNormal(peerAgent) {
			try {
				G2NSystem.debugLog(appType + ' agent: ' + JSON.stringify(peerAgent));
				
				if (peerAgent.appName === G2NSystem.providerAppName) {
					SAAgents[appType].setServiceConnectionListener(agentCallback);
					SAAgents[appType].requestServiceConnection(peerAgent);
				} else {
					alert("Not expected app!! : " + peerAgent.appName);
				}
			} catch(err) {
				G2NSystem.debugLog("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		onerror : function(err) {
			forceClose();
		}
	};
	
	function onCreatedSAAgent(agents) {
		try {
			if (agents.length > 0) {
				
				for ( var key in agents ) {
					if ( agents[key].id === '/gear2net/bridgeapp' ) {
						SAAgents.normal = agents[key];
					} else if ( agents[key].id === '/gear2net/bridgeapp/watch' ) {
						SAAgents.watch = agents[key];
					}
				}
				
				if ( onCreatedSAAgentCallback ) {
					onCreatedSAAgentCallback();
				}
							
			} else {
				alert("Not found SAAgent!!");
			}
		} catch(err) {
			onError(err);
		}
	}
	
	function getAppType() {
		if ( G2NSystem.isWatchWidget() ) {
			appType = 'watch';
		}
		else {
			appType = 'normal';
		}
	}
	
	// receive functions
	
	function castToType(value, type) {
		var castedValue = null;
		
		switch ( type ) {
			case 'LONG':
			case 'INT':
			case 'SHORT':
			case 'FLOAT':
			case 'DOUBLE':
				castedValue = Number(value);
				break;
		
			case 'BOOLEAN':
				castedValue = Boolean(value);
				break;
				
			case 'BYTE':
			case 'CHAR':
			case 'STRING':
				castedValue = value.toString();
				break;
				
			case 'G2NOBJECT':
				castedValue = G2NSystem.getObj(value.toString());	
				break;
		}
		
		return castedValue;
	}
	
	function parseArgs(args) {
		var parsedArgs = [];
		for ( var key in args ) {
			parsedArgs.push(castToType(args[key].value, args[key].type));
		}
		return parsedArgs;
	}
	
	function onReceiveReturnCallResultMsg(msg)	{
		if ( msg.newObj !== 'false' ) {
			var classObj = G2NSystem.getClass(msg.newObj);
			new classObj(msg['return']);
		}
		obj = castToType(msg['return'], msg.returnType);
		G2NSystem.invokeCallback(msg.callbackKey, obj);
	}
	
	function onReceiveOnEventListenerMsg(msg) {
		G2NSystem.invokeListener(msg.listenerKey, parseArgs(msg.args));
	}
	
	function onReceiveExceptionMsg(msg) {
		alert('Exception: ' + msg.exception + '\n\nMessage: ' + msg.msg);
		tizen.application.getCurrentApplication().exit();
	}
	
	function onReceive(channelId, data) {
		G2NSystem.debugLog('channel: ' + channelId + ', data: ' + data );
		
		if ( channelId !== channelIDs[appType] ) {
			G2NSystem.debugLog('channel: ' + channelId + ', channelIDs[appType]: ' + channelIDs[appType] );
			return;
		}
		data = JSON.parse(data);
		switch ( data.msgType ) {
			case 'RETURN_CALL_RESULT':
				onReceiveReturnCallResultMsg(data);
				break;
				
			case 'ON_EVENT_LISTENER':
				onReceiveOnEventListenerMsg(data);
				break;
				
			case 'EXCEPTION':
				onReceiveExceptionMsg(data);
				break;
		}
	}
	
	/*
	 * public member
	 */
	
	function requestSAAgent(callback) {
		if ( SAAgents[appType] ) {
			G2NSystem.debugLog('Already exist SAAgent!');
		} else {
			try {
				if ( callback && typeof(callback) === 'function' ) {
					onCreatedSAAgentCallback = callback;
				}
				webapis.sa.requestSAAgent(onCreatedSAAgent, onError);
			} catch(err) {
				onError(err);
			}
		}
	}
	
	function connect(callback) {	
		
		if ( SAAgents[appType] === null ) {
			G2NSystem.debugLog('SAAgents is null');
			return;
		}
		
		if ( appType === 'normal' && SASocket ) {
			G2NSystem.debugLog('Already connected!');
			return;
	    }
		
		if ( callback && typeof(callback) === 'function' ) {
			onConnectedCallback = callback;
		}
		
		onDisconnectedCallback = forceClose;
		
		SAAgents[appType].setPeerAgentFindListener(peerAgentFindCallback);
		SAAgents[appType].findPeerAgents();	
		
	}
	
	function pause() {
		isPause = true;
		disconnect();
	}
	
	function disconnect(callback) {
		
		G2NSystem.debugLog('disconnect call!');
		
		if ( callback && typeof(callback) === 'function' )
			onDisconnectedCallback = callback;
		
		try {
			if (SASocket !== null) {
				SASocket.close();
				SASocket = null;
			}
		} catch(err) {
			onError(err);
		}
	}
	
	function send(msg) {	
		
		G2NSystem.debugLog('send: ' + msg);
		
		if ( !SASocket ) {
			alert('Disconned to Android Device!\nThis Application will be closing');
			tizen.application.getCurrentApplication().exit();
		}
		
		try {
			G2NSystem.debugLog('channel: ' + channelIDs[appType]);
			SASocket.setDataReceiveListener(onReceive);
			SASocket.sendData(channelIDs[appType], msg);
		} catch(err) {
			onError(err);
		}
	}
	
	function isConnected() {
		return isConnectedVar;
	}
	
	function initConnect() {
		G2NSystem.debugLog('G2NConnect Init!');

		channelIDs.normal = 810;
		channelIDs.watch = 811;
		
		SAAgents.normal = null;
		SAAgents.watch = null;
		
		getAppType();
		
		publicMember.requestSAAgent = requestSAAgent;
		publicMember.connect = connect;
		publicMember.pause = pause;
		publicMember.disconnect = disconnect;
		publicMember.send = send;
		publicMember.isConnected = isConnected;
		
		isInit = true;
	}
	
	// 모듈 단위 초기화 로직
	if ( isInit === false ) {
		initConnect();
	}
	
	return publicMember;
});
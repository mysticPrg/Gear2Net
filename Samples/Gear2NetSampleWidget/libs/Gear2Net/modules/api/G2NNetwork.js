/**
 * 
 * Gear2 use Bluetooth to communicate with Android for communication with external server.
 * Using this module makes a Gear2 look like that it communicate with external server directly.
 * Protocol provides with HTTP, TCP, UDP.
 * 
 * @module G2NNetwork
 */
define(['G2NSystem', 'G2NConnect', 'G2NMsg', 'G2NObject'], function(G2NSystem, G2NConnect, G2NMsg, G2NObject) {

	var Http = {},
		Socket = {},
		publicMember = {},
		isInit = false;

	//============================================================================================================================
	
	
	/**
	 * This is HTTP Class within G2NNetwork module.
	 * It is created for just Http namespace.
	 * 
	 * @namespace G2NNetwork
	 * @class Http
	 */
	
	
	//============================================================================================================================

	
	/**
	 * It defines the request methods.
	 * Providing that    
	 * {{#crossLink "G2NNetwork.Http.RequestMethod/POST:attribute"}}{{/crossLink}},
	 * {{#crossLink "G2NNetwork.Http.RequestMethod/GET:attribute"}}{{/crossLink}},
	 * {{#crossLink "G2NNetwork.Http.RequestMethod/PUT:attribute"}}{{/crossLink}},
	 * {{#crossLink "G2NNetwork.Http.RequestMethod/DELETE:attribute"}}{{/crossLink}}
	 * 
	 * <br><br>
     * See Also : {{#crossLink "G2NNetwork.Http.HttpRequest"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @Class Http.RequestMethod
	 */
	Http.RequestMethod = {
			
			
		/**
		 * It indicates request of GET method.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.RequestMethod/POST:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/PUT:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/DELETE:attribute"}}{{/crossLink}} 
		 * 
		 * @attribute GET
		 * @type Number
		 * @default 0
		 * @static
		 * @readOnly
		 */
		GET: 0,
		
		
		/**
		 * It indicates request of POST method.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.RequestMethod/GET:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/PUT:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/DELETE:attribute"}}{{/crossLink}}
		 *            
		 * @attribute POST
		 * @type Number
		 * @default 1
		 * @static
		 * @readOnly
		 */
		POST: 1,
		
		
		/**
		 * It indicates request of PUT method.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.RequestMethod/POST:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/GET:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/DELETE:attribute"}}{{/crossLink}}
		 *            
		 * @attribute PUT
		 * @type Number
		 * @default 2
		 * @static
		 * @readOnly
		 */
		PUT: 2,
		
		/**
		 * It indicates request of DELETE method.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.RequestMethod/GET:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/POST:attribute"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Http.RequestMethod/PUT:attribute"}}{{/crossLink}}
		 *             
		 * @attribute DELETE
		 * @type Number
		 * @default 3
		 * @static
		 * @readOnly
		 */
		DELETE: 3
	};
	
	
	//============================================================================================================================

	
	/**
	 * It is collect requests in queue, and then send the request and receive the response to web servers.
	 * <br><br>
	 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequest"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @class Http.HttpRequestQueue
	 */
	Http.HttpRequestQueue = G2NObject.G2NClassDefine({
		classname: 'net.gear2net.api.network.http.G2NHttpRequestQueue',
		
		
		/**
		 * Create the request queue.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequestQueue/addRequest:method"}}{{/crossLink}}
		 * 
		 * @method HttpRequestQueue
		 * @constructor
		 * @param {function} callback
		 * 
		 * @example
		 *		function showHttpResult(returnValue) {
		 *			$('#result_network_http').text(String(returnValue));
		 *		}
		 *		
		 *		var requestQueue = null;
		 *		var request = null;
		 *		
		 *		$('#btn_to_network_http_create_request_queue').click(function() {
		 *			requestQueue = new G2NNetwork.Http.HttpRequestQueue(function() {
		 *				showHttpResult('Queue Created!');
		 *			});
		 *		});
		 *		
		 *		
		 *		$('#btn_to_network_http_create_request').click(function() {
		 *			
		 *			var method = G2NNetwork.Http.RequestMethod.GET;
		 *			// Weather Information Service URL
		 *			var url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1144060000';
		 *			var params = {
		 *				key: 'value',
		 *				asd: 'test'
		 *			};
		 *			
		 *			request = new G2NNetwork.Http.HttpRequest(method, url, params, function() {
		 *				showHttpResult('Request Created!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_http_set_response').click(function() {
		 *			
		 *			if ( request === null ) {
		 *				showHttpResult('Request is null');
		 *				return;
		 *			}
		 *			
		 *			request.setResponseListener(showHttpResult, function() {
		 *				showHttpResult('Setting Listener!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_http_add_request').click(function() {
		 *			
		 *			if ( request === null ) {
		 *				showHttpResult('Request is null');
		 *				return;
		 *			}
		 *			
		 *			if ( requestQueue === null ) {
		 *				showHttpResult('RequestQueue is null');
		 *				return;
		 *			}
		 *			
		 *			requestQueue.addRequest(request, function() {
		 *				showHttpResult('Added Request!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_http_start_request_queue').click(function() {
		 *			if ( requestQueue === null ) {
		 *				showHttpResult('RequestQueue is null');
		 *				return;
		 *			}
		 *			
		 *			requestQueue.start(function() {
		 *				//showHttpResult('Start RequestQueue!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_http_stop_request_queue').click(function() {
		 *			if ( requestQueue === null ) {
		 *				showHttpResult('RequestQueue is null');
		 *				return;
		 *			}
		 *			
		 *			requestQueue.stop(function() {
		 *				showHttpResult('Stop RequestQueue!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_http_delete_request_queue').click(function() {
		 *			if ( requestQueue === null ) {
		 *				showHttpResult('RequestQueue is null');
		 *				return;
		 *			}
		 *			
		 *			requestQueue.destruct(function() {
		 *				requestQueue = null;
		 *				showHttpResult('Deleted RequestQueue!');
		 *			});
		 *		});
		 */
		__construct: function(callback) {
			G2NSystem.debugLog('HttpRequestQueue __construct called!');
			
			var msg = G2NMsg.createConstructorMsg(this.classname, this.objKey, callback, ['G2NOBJECT'], [G2NObject.G2NContext]);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Add the {{#crossLink "G2NNetwork.Http.HttpRequest"}}{{/crossLink}} Class objects in request queue. 
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequest"}}{{/crossLink}}
		 * <br><br>
		 * Example: {{#crossLink "G2NNetwork.Http.HttpRequestQueue/HttpRequestQueue:method"}}{{/crossLink}}
		 * 
		 * @method addRequest
		 * @param {G2NNetwork.Http.HttpRequest} request
		 * @param {functino} callback
		 */
		addRequest: function addRequest(request, callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['G2NOBJECT']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Every request in queue will be request to web servers in sequence. 
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequestQueue/stop:method"}}{{/crossLink}}
		 * <br><br>
		 * Example: {{#crossLink "G2NNetwork.Http.HttpRequestQueue/HttpRequestQueue:method"}}{{/crossLink}}
		 * 
		 * @method start
		 * @param {function} callback
		 */
		start: function start(callback) {
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['INT']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Requesting to web servers will be stop.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequestQueue/start:method"}}{{/crossLink}}
		 * <br><br>
		 * Example: {{#crossLink "G2NNetwork.Http.HttpRequestQueue/HttpRequestQueue:method"}}{{/crossLink}}
		 * 
		 * @method stop
		 * @param {function} callback
		 */
		stop: function stop(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['G2NOBJECT']);
			G2NConnect.send(JSON.stringify(msg));
		}
	
	});

	
	//============================================================================================================================

	
	/**
	 * Create the request to send web servers.
	 * It will be send request after in request queue.
	 * <br><br>
	 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequestQueue/addRequest:method"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @class Http.HttpRequest 
	 */	
	Http.HttpRequest = G2NObject.G2NClassDefine({
		classname: 'net.gear2net.api.network.http.G2NHttpRequest',
		
		
		/**
		 * It is constructor.
		 * Create the request by the url of web servers.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequest/setResponseListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example: {{#crossLink "G2NNetwork.Http.HttpRequestQueue/HttpRequestQueue:method"}}{{/crossLink}}
		 * 
		 * @method HttpRequest
		 * @constructor
		 * @param {G2NNetwork.Http.RequestMethod} method
		 * @param {String} url
		 * @param {String} params
		 * @param {function} callback
		 */
		__construct: function(method, url, params, callback){
			params = JSON.stringify(params);
			var msg = G2NMsg.createConstructorMsg(this.classname, this.objKey, callback, ['INT', 'STRING', 'STRING']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * It is listener for receive the response from web servers.  
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Http.HttpRequest/HttpRequest:method"}}{{/crossLink}}
		 * <br><br>
		 * Example: {{#crossLink "G2NNetwork.Http.HttpRequestQueue/HttpRequestQueue:method"}}{{/crossLink}}
		 * 
		 * @method setResponseListener
		 * @param {function} listener
		 * @param {function} callback
		 */
		setResponseListener: function setResponseListener(listener, callback){
			var msg = G2NMsg.createRegistrationListenerMsg(this.objKey, listener, callback, ['G2NOBJECT']);
			G2NConnect.send(JSON.stringify(msg));
		}
	});
	
	
	//============================================================================================================================

	
	/**
	 * This class indicates socket communication.
	 * It support to TCP and UDP protocol, refer to {{#crossLink "G2NNetwork.Socket.Protocol"}}{{/crossLink}}.
	 * because we don't know when response message about the socket connection and closer will come, 
	 * these must register event listener.    
	 * <br><br>
	 * See Also : {{#crossLink "G2NNetwork.Socket.Address"}}{{/crossLink}},
	 *            {{#crossLink "G2NNetwork.Socket.Protocol"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @class Socket
	 */	
	Socket.member = G2NObject.G2NClassDefine({
		classname: 'net.gear2net.api.network.socket.G2NSocket',
		
		/**
		 * Description
		 * It is constructor.
		 * After select using protocol, you will create object of Socket class.
		 * It is not open a socket. 
		 * Opening the socket refer to {{#crossLink "G2NNetwork.Socket/openAndListen:method"}}{{/crossLink}} method.  
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket.Address"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/openAndListen:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket.Protocol/TCP:attribute"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket.Protocol/UDP:attribute"}}{{/crossLink}}
		 * 
		 * @method Socket
		 * @constructor
		 * @param {G2NNetwork.Socket.Address} address
		 * @param {G2NNetwork.Socket.Protocol} protocol
		 * @param {function} callback
		 * 
		 * @example
		 *		function showSocketResult(returnValue) {
		 *			$('#result_network_socket').text(String(returnValue));
		 *		}
		 *		
		 *		var address = null;
		 *		var socket_ip = '210.118.74.165';
		 *		var socket_port = 33333;
		 *		
		 *		$('#btn_to_network_socket_create_address').click(function() {
		 *			if ( address !== null ) {
		 *				showSocketResult('address is not null');
		 *				return;
		 *			}
		 *			
		 *			address = new G2NNetwork.Socket.Address(socket_ip, socket_port, function() {
		 *				showSocketResult('Address Created!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_getPort').click(function() {
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			address.getPort(showSocketResult);
		 *		});
		 *		
		 *		$('#btn_to_network_socket_setPort').click(function() {
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			address.setPort(33336, function() {
		 *				showSocketResult('port changed!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_getIP').click(function() {
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			address.getIP(showSocketResult);
		 *		});
		 *		
		 *		$('#btn_to_network_socket_setIP').click(function() {
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			address.setIP('210.118.74.166', function() {
		 *				showSocketResult('ip changed!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_delete_address').click(function() {
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			address.destruct(function() {
		 *				showSocketResult('Address Deleted!');
		 *				address = null;
		 *			});
		 *		});
		 *		
		 *		var socket = null;
		 *		var receiveListenerKey = null;
		 *		var connectedListenerKey = null;
		 *		var disconnectedListenerKey = null;
		 *		var listen = false;
		 *	
		 *		$('#btn_to_network_socket_create_socket').click(function() {
		 *			if ( socket !== null ) {
		 *				showSocketResult('socket is not null');
		 *				return;
		 *			}
		 *			
		 *			if ( address === null ) {
		 *				showSocketResult('address is null');
		 *				return;
		 *			}
		 *			
		 *			socket = new G2NNetwork.Socket(address, G2NNetwork.Socket.Protocol.TCP, function() {
		 *				showSocketResult('Socket Created!');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_addReceiveMessageListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( receiveListenerKey !== null ) {
		 *				showSocketResult('already added');
		 *				return;
		 *			}
		 *			
		 *			socket.addReceiveMessageListener(showSocketResult, function(key) {
		 *				showSocketResult('added receive listener');
		 *				receiveListenerKey = key;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_addConnectedListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( connectedListenerKey !== null ) {
		 *				showSocketResult('already added');
		 *				return;
		 *			}
		 *			
		 *			socket.addConnectedListener(showSocketResult, function(key) {
		 *				showSocketResult('added connected listener');
		 *				connectedListenerKey = key;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_addDisconnectedListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( disconnectedListenerKey !== null ) {
		 *				showSocketResult('already added');
		 *				return;
		 *			}
		 *			
		 *			socket.addDisconnectedListener(function() {
		 *				listen = false;
		 *				
		 *				showSocketResult('Disconnected');
		 *			}, function(key) {
		 *				showSocketResult('added disconnected listener');
		 *				disconnectedListenerKey = key;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_openAndListen').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( receiveListenerKey === null ) {
		 *				showSocketResult('receive listener is not added');
		 *				return;
		 *			}
		 *			
		 *			if ( connectedListenerKey === null ) {
		 *				showSocketResult('connected listener is not added');
		 *				return;
		 *			}
		 *			
		 *			if ( disconnectedListenerKey === null ) {
		 *				showSocketResult('disconnected listener is not added');
		 *				return;
		 *			}
		 *			
		 *			if ( listen === true ) {
		 *				showSocketResult('already listening');
		 *				return;
		 *			}
		 *			
		 *			socket.openAndListen(function() {
		 *				listen = true;
		 *				showSocketResult('socket is listenning...');
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_send').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			socket.sendMessage('Hello G2N!', function() {
		 *				showSocketResult('Send Success!');
		 *			});
		 *		});
		 *	
		 *		$('#btn_to_network_socket_close').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( listen === false) {
		 *				showSocketResult('socket is not open');
		 *				return;
		 *			}
		 *			
		 *			socket.close(function() {
		 *				showSocketResult('Close Success!');
		 *				listen = false;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_removeReceiveMessageListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( receiveListenerKey === null ) {
		 *				showSocketResult('not added receive listener');
		 *				return;
		 *			}
		 *			
		 *			socket.removeReceiveMessageListener(receiveListenerKey, function() {
		 *				showSocketResult('removed receive listener');
		 *				receiveListenerKey = null;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_removeConnectedListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( connectedListenerKey === null ) {
		 *				showSocketResult('not added connected listener');
		 *				return;
		 *			}
		 *			
		 *			socket.removeConnectedListener(connectedListenerKey, function() {
		 *				showSocketResult('removed connected listener');
		 *				connectedListenerKey = null;
		 *			});
		 *		});
		 *
		 *		$('#btn_to_network_socket_removeDisconnectedListener').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *			
		 *			if ( disconnectedListenerKey === null ) {
		 *				showSocketResult('not added disconencted listener');
		 *				return;
		 *			}
		 *			
		 *			socket.removeDisconnectedListener(disconnectedListenerKey, function() {
		 *				showSocketResult('removed disconencted listener');
		 *				disconnectedListenerKey = null;
		 *			});
		 *		});
		 *		
		 *		$('#btn_to_network_socket_delete_socket').click(function() {
		 *			if ( socket === null ) {
		 *				showSocketResult('socket is null');
		 *				return;
		 *			}
		 *
		 *			if ( listen === true ) {
		 *				showSocketResult('socket is listenning...');
		 *				return;
		 *			}
		 *			
		 *			socket.destruct(function() {
		 *				showSocketResult('Deleted socket');
		 *				socket = null;
		 *			});
		 *		});
		 */
		__construct: function(address, protocol, callback){
			var msg = G2NMsg.createConstructorMsg(this.classname, this.objKey, callback, ['G2NOBJECT','INT']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Open a socket.
		 * This method is start the listener that detects whether normally open the socket.
		 * You can add listener by {{#crossLink "G2NNetwork.Socket/addConnectedListener:method"}}{{/crossLink}}.
		 * <br><br>
		 * Caution!
		 * <br> When entered IP address was wrong, you will receive 'UnknownHostException' message.
		 * <br> And if occur the problem of I/O, you will receive 'IOException' message.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/close:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/addConnectedListener:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeConnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method openAndListen
		 * @param {function} callback
		 */
		openAndListen: function openAndListen(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * IP address and Port number of host connected socket return by object of {{#crossLink "G2NNetwork.Socket.Address"}}{{/crossLink}} class.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Address"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method getAddress
		 * @param {function} callback
		 * @return {G2NNetwork.Socket.Address} address
		 */
		getAddress: function getAddress(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Send the message to host through IP address and Port number from connected socket. 
		 * <br><br>
		 * Caution!
		 * <br> If occur the problem of I/O, you will receive 'IOException' message.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/addReceiveMessageListener:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeReceiveMessageListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method sendMessage
		 * @param {String} message
		 * @param {function} callback
		 */
		sendMessage: function sendMessage(message, callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['STRING']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To detect event about receive message from external server, register the listener. 
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/sendMessage:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeReceiveMessageListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method addReceiveMessageListener
		 * @param {function} listener
		 * @param {function} callback
		 */
		addReceiveMessageListener: function addReceiveMessageListener(listener, callback){
			var msg = G2NMsg.createRegistrationListenerMsg(this.objKey, listener, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To stop detect event about receive message from external server, unregister the listener. 
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/sendMessage:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/addReceiveMessageListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method removeReceiveMessageListener
		 * @param {String} listenerKey
		 * @param {function} callback
		 */
		removeReceiveMessageListener: function removeReceiveMessageListener(listenerKey, callback){
			var msg = G2NMsg.createUnregistrationListenerMsg(this.objKey, listenerKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To detect event whether open the socket, add the listener.
	     * Doing event registration in the beginning.
		 * After that it add the listener.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/openAndListen:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeConnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method addConnectedListener
		 * @param {function} listener
		 * @param {function} callback
		 */
		addConnectedListener: function addConnectedListener(listener, callback){
			var msg = G2NMsg.createRegistrationListenerMsg(this.objKey, listener, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To stop detect event whether open the socket, remove the listener.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket/openAndListen:method"}}{{/crossLink}},
		 *            {{#crossLink "G2NNetwork.Socket/addConnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * @method removeConnectedListener
		 * @param {String} listenerKey
		 * @param {function} callback
		 */
		removeConnectedListener: function removeConnectedListener(listenerKey, callback){
			var msg = G2NMsg.createUnregistrationListenerMsg(this.objKey, listenerKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To detect event whether close the socket, add the listener.
	     * Doing event registration in the beginning.
		 * After that it add the listener.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/close:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeDisconnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method addDisconnectedListener
		 * @param {function} listener
		 * @param {function} callback
		 */
		addDisconnectedListener: function addDisconnectedListener(listener, callback){
			var msg = G2NMsg.createRegistrationListenerMsg(this.objKey, listener, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * To stop detect event whether close the socket, remove the listener.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/close:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/addDisconnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 *       
		 * @method removeDisconnectedListener
		 * @param {String} listenerKey
		 * @param {function} callback
		 */
		removeDisconnectedListener: function removeDisconnectedListener(listenerKey, callback){
			var msg = G2NMsg.createUnregistrationListenerMsg(this.objKey, listenerKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Close the connected socket.
		 * This method is start the listener that detects whether normally closed the socket.
		 * You can add listener by {{#crossLink "G2NNetwork.Socket/addDisconnectedListener:method"}}{{/crossLink}}.
		 * <br><br>
		 * See Also :	{{#crossLink "G2NNetwork.Socket/openAndListen:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/addDisconnectedListener:method"}}{{/crossLink}},
		 *				{{#crossLink "G2NNetwork.Socket/removeDisconnectedListener:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method close
		 * @param {function} callback
		 */
		close: function close(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		}
	});
	
	
	//============================================================================================================================

	
	/**
	 * Socket communication protocols have TCP and UDP.
	 * So, It indicate the protocol type.
	 * When create the socket, you decide protocol what you want in second parameter. 
	 * <br><br>
	 * See Also : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @class Socket.Protocol
	 */		
	Socket.Protocol = {
			
			
		/**
		 * Use the TCP protocol when do socket communication.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Protocol/UDP:attribute"}}{{/crossLink}}
		 * 
		 * @attribute TCP
		 * @type Number
		 * @default 0
		 * @static
		 * @readOnly
		 */
		TCP: 0,
		
		
		/**
		 * Use the UDP protocol when do socket communication.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Protocol/TCP:attribute"}}{{/crossLink}}
		 * 
		 * @attribute UDP
		 * @type Number
		 * @default 1
		 * @static
		 * @readOnly
		 */
		UDP: 1
	};
	
	
	//============================================================================================================================
	
	
	/**
	 * This class controls the IP address and the Port number that will use the socket communication.
	 * For connecting used in first parameter for this class when you will create the socket.
	 * <br><br>
	 * See Also : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
	 * 
	 * @namespace G2NNetwork
	 * @class Socket.Address
	 */	
	Socket.Address = G2NObject.G2NClassDefine({
		classname: 'net.gear2net.api.network.socket.G2NAddress',
		
		
		/**
		 * It is constructor.
		 * Set IP address and Port number
		 * Other way, It is able to set from 
		 * {{#crossLink "G2NNetwork.Socket.Address/getIP:method"}}{{/crossLink}} and
		 * {{#crossLink "G2NNetwork.Socket.Address/getPort:method"}}{{/crossLink}}.
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method Address
		 * @constructor
		 * @param {String} ip
		 * @param {Number} port
		 * @param {function} callback
		 */
		__construct: function(ip, port, callback){
			var msg = G2NMsg.createConstructorMsg(this.classname, this.objKey, callback, ['STRING', 'INT']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Set the IP address that will connect to host.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Address/getIP:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method setIP
		 * @param {String} ip
		 * @param {function} callback
		 */
		setIP: function setIP(ip, callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['STRING']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Return the set IP address.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Address/setIP:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method getIP
		 * @param {function} callback
		 * @return {String} ip
		 */
		getIP: function getIP(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Set the Port number that will connect to host.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Address/getPort:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method setPort
		 * @param {Number} port
		 * @param {function} callback
		 */
		setPort: function setPort(port, callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback, ['INT']);
			G2NConnect.send(JSON.stringify(msg));
		},
		
		
		/**
		 * Return the set Port number.
		 * <br><br>
		 * See Also : {{#crossLink "G2NNetwork.Socket.Address/setPort:method"}}{{/crossLink}}
		 * <br><br>
		 * Example : {{#crossLink "G2NNetwork.Socket/Socket:method"}}{{/crossLink}}
		 * 
		 * @method getPort
		 * @param {function} callback
		 * @return {Number} port
		 */
		getPort: function getPort(callback){
			var msg = G2NMsg.createMethodCallMsg(this.objKey, callback);
			G2NConnect.send(JSON.stringify(msg));
		}
		
	});
	
	
	//============================================================================================================================

	
	function G2NNetworkInit() {
		G2NSystem.debugLog('G2NNetwork Init!!');
		publicMember.Socket = {};
		
		publicMember.Http					= Http;
		publicMember.Socket					= Socket.member;
		publicMember.Socket.Protocol		= Socket.Protocol;
		publicMember.Socket.Address			= Socket.Address;
		
		isInit = true;
	}
	
	if ( isInit === false ) {
		G2NNetworkInit();
	}
	
	return publicMember;
});

require(['jquery', 'G2NNetwork', 'tau'], function ($, G2NNetwork) {

	$(document).ready(function() {
	
		/*
		 * Button Setting 
		 * =======================================================================
		 */
		
		$('#btn_to_network').click(function() {
			tau.changePage('#page_network');
		});
		
		$('#btn_to_network_http').click(function() {
			tau.changePage('#page_network_http');
		});
		
		$('#btn_to_network_socket').click(function() {
			tau.changePage('#page_network_socket');
		});

		
		/*
		 * Http Test
		 * =======================================================================
		 */
		
		function showHttpResult(returnValue) {
			$('#result_network_http').text(String(returnValue));
		}
		
		var requestQueue = null;
		var request = null;
		
		$('#btn_to_network_http_create_request_queue').click(function() {
			requestQueue = new G2NNetwork.Http.HttpRequestQueue(function() {
				showHttpResult('Queue Created!');
			});
		});
		
		
		$('#btn_to_network_http_create_request').click(function() {
			
			var method = G2NNetwork.Http.RequestMethod.GET;
			// Weather Information Service URL
			var url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1144060000';
			var params = {
				key: 'value',
				asd: 'test'
			};
			
			request = new G2NNetwork.Http.HttpRequest(method, url, params, function() {
				showHttpResult('Request Created!');
			});
		});
		
		$('#btn_to_network_http_set_response').click(function() {
			
			if ( request === null ) {
				showHttpResult('Request is null');
				return;
			}
			
			request.setResponseListener(showHttpResult, function() {
				showHttpResult('Setting Listener!');
			});
		});
		
		$('#btn_to_network_http_add_request').click(function() {
			
			if ( request === null ) {
				showHttpResult('Request is null');
				return;
			}
			
			if ( requestQueue === null ) {
				showHttpResult('RequestQueue is null');
				return;
			}
			
			requestQueue.addRequest(request, function() {
				showHttpResult('Added Request!');
			});
		});
		
		$('#btn_to_network_http_start_request_queue').click(function() {
			if ( requestQueue === null ) {
				showHttpResult('RequestQueue is null');
				return;
			}
			
			requestQueue.start(function() {
				//showHttpResult('Start RequestQueue!');
			});
		});
		
		$('#btn_to_network_http_stop_request_queue').click(function() {
			if ( requestQueue === null ) {
				showHttpResult('RequestQueue is null');
				return;
			}
			
			requestQueue.stop(function() {
				showHttpResult('Stop RequestQueue!');
			});
		});
		
		$('#btn_to_network_http_delete_request_queue').click(function() {
			if ( requestQueue === null ) {
				showHttpResult('RequestQueue is null');
				return;
			}
			
			requestQueue.destruct(function() {
				requestQueue = null;
				showHttpResult('Deleted RequestQueue!');
			});
		});
		
		
		/*
		 * Socket Test
		 * =======================================================================
		 */
		
		function showSocketResult(returnValue) {
			$('#result_network_socket').text(String(returnValue));
		}
		
		var address = null;
		var socket_ip = '210.118.74.165';
		var socket_port = 33333;
		
		$('#btn_to_network_socket_create_address').click(function() {
			if ( address !== null ) {
				showSocketResult('address is not null');
				return;
			}
			
			address = new G2NNetwork.Socket.Address(socket_ip, socket_port, function() {
				showSocketResult('Address Created!');
			});
		});
		
		$('#btn_to_network_socket_getPort').click(function() {
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			address.getPort(showSocketResult);
		});
		
		$('#btn_to_network_socket_setPort').click(function() {
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			address.setPort(33336, function() {
				showSocketResult('port changed!');
			});
		});
		
		$('#btn_to_network_socket_getIP').click(function() {
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			address.getIP(showSocketResult);
		});
		
		$('#btn_to_network_socket_setIP').click(function() {
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			address.setIP('210.118.74.166', function() {
				showSocketResult('ip changed!');
			});
		});
		
		$('#btn_to_network_socket_delete_address').click(function() {
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			address.destruct(function() {
				showSocketResult('Address Deleted!');
				address = null;
			});
		});
		
		var socket = null;
		var receiveListenerKey = null;
		var connectedListenerKey = null;
		var disconnectedListenerKey = null;
		var listen = false;

		$('#btn_to_network_socket_create_socket').click(function() {
			if ( socket !== null ) {
				showSocketResult('socket is not null');
				return;
			}
			
			if ( address === null ) {
				showSocketResult('address is null');
				return;
			}
			
			socket = new G2NNetwork.Socket(address, G2NNetwork.Socket.Protocol.TCP, function() {
				showSocketResult('Socket Created!');
			});
		});
		
		$('#btn_to_network_socket_addReceiveMessageListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( receiveListenerKey !== null ) {
				showSocketResult('already added');
				return;
			}
			
			socket.addReceiveMessageListener(showSocketResult, function(key) {
				showSocketResult('added receive listener');
				receiveListenerKey = key;
			});
		});
		
		$('#btn_to_network_socket_addConnectedListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( connectedListenerKey !== null ) {
				showSocketResult('already added');
				return;
			}
			
			socket.addConnectedListener(showSocketResult, function(key) {
				showSocketResult('added connected listener');
				connectedListenerKey = key;
			});
		});
		
		$('#btn_to_network_socket_addDisconnectedListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( disconnectedListenerKey !== null ) {
				showSocketResult('already added');
				return;
			}
			
			socket.addDisconnectedListener(function() {
				listen = false;
				
				showSocketResult('Disconnected');
			}, function(key) {
				showSocketResult('added disconnected listener');
				disconnectedListenerKey = key;
			});
		});
		
		$('#btn_to_network_socket_openAndListen').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( receiveListenerKey === null ) {
				showSocketResult('receive listener is not added');
				return;
			}
			
			if ( connectedListenerKey === null ) {
				showSocketResult('connected listener is not added');
				return;
			}
			
			if ( disconnectedListenerKey === null ) {
				showSocketResult('disconnected listener is not added');
				return;
			}
			
			if ( listen === true ) {
				showSocketResult('already listening');
				return;
			}
			
			socket.openAndListen(function() {
				listen = true;
				showSocketResult('socket is listenning...');
			});
		});
		
		$('#btn_to_network_socket_send').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			socket.sendMessage('Hello G2N!', function() {
				showSocketResult('Send Success!');
			});
		});
	
		$('#btn_to_network_socket_close').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( listen === false) {
				showSocketResult('socket is not open');
				return;
			}
			
			socket.close(function() {
				showSocketResult('Close Success!');
				listen = false;
			});
		});
		
		$('#btn_to_network_socket_removeReceiveMessageListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( receiveListenerKey === null ) {
				showSocketResult('not added receive listener');
				return;
			}
			
			socket.removeReceiveMessageListener(receiveListenerKey, function() {
				showSocketResult('removed receive listener');
				receiveListenerKey = null;
			});
		});
		
		$('#btn_to_network_socket_removeConnectedListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( connectedListenerKey === null ) {
				showSocketResult('not added connected listener');
				return;
			}
			
			socket.removeConnectedListener(connectedListenerKey, function() {
				showSocketResult('removed connected listener');
				connectedListenerKey = null;
			});
		});

		$('#btn_to_network_socket_removeDisconnectedListener').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}
			
			if ( disconnectedListenerKey === null ) {
				showSocketResult('not added disconencted listener');
				return;
			}
			
			socket.removeDisconnectedListener(disconnectedListenerKey, function() {
				showSocketResult('removed disconencted listener');
				disconnectedListenerKey = null;
			});
		});
		
		$('#btn_to_network_socket_delete_socket').click(function() {
			if ( socket === null ) {
				showSocketResult('socket is null');
				return;
			}

			if ( listen === true ) {
				showSocketResult('socket is listenning...');
				return;
			}
			
			socket.destruct(function() {
				showSocketResult('Deleted socket');
				socket = null;
			});
		});
		
	});
	
});
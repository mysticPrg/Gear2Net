require(['jquery', 'G2NNetwork', 'tau', 'xml2json'], function ($, G2NNetwork) {

	var news_xml = '';
	var news_dom = null;
	var news_json = null;
	//로딩페이지 필요

	function parseXml(xml) {
	   var news_dom = null;
	      try { 
	         news_dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	      } 
	      catch (e) { news_dom = null; }
	     return news_dom;
	}

	
	function getRSSXml(paramUrl) {
		//$('#background').css("background-image","url(/res/rain.jpg)");
		//$('#news_contents').text('string');
		/*
		 * Http Test
		 * =======================================================================
		 */
		
		function showHttpResult(returnValue) {
			var news_xml = returnValue[0];
			news_dom = parseXml(news_xml);
			var news_json = xml2json(news_dom, '');
			news_json = JSON.parse(news_json);
			var news = '';
			for(var i = 0; i< news_json.rss.channel.item.length; i++){
				news += news_json.rss.channel.item[i].title;
				var newListItem = $('<li/>', {
				    "id": 'FeedItemIndex'+i			    
				}); 
				$('#feedlist').append(newListItem);
			}
		}
		
		var requestQueue = null;
		var request = null;
		
		requestQueue = new G2NNetwork.Http.HttpRequestQueue(function() {
			//create request
			var method = G2NNetwork.Http.RequestMethod.GET;
			var url = paramUrl;
			var params = {
				key: 'value',
				asd: 'test'
			};
			
			request = new G2NNetwork.Http.HttpRequest(method, url, params, function() {
				//set response
				if ( request === null ) {
					showHttpResult('Request is null');
					return;
				}
				
				request.setResponseListener(showHttpResult, function() {
					//add request
					if ( request === null ) {
						showHttpResult('Request is null');
						return;
					}
					
					if ( requestQueue === null ) {
						showHttpResult('RequestQueue is null');
						return;
					}
					
					
					requestQueue.start();
					requestQueue.addRequest(request, function() {
						//start request
						if ( requestQueue === null ) {
							showHttpResult('RequestQueue is null');
							return;
						}	
					});
				});
			});
		});		
	}
});
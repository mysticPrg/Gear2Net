require(['jquery','G2NNetwork', 'G2NMobile', 'G2NUtil', 'tau', 'xml2json'], function ($, G2NNetwork, G2NMobile, G2NUtil) {
	$(document).ready(function() {
		var xmlString = '',
			index='',
			domObj = null,
			jsonObj = null,
			feedContentsJson ={};
		
		//로딩페이지 필요

		//DOM Object From XML String
		function parseXml(xml) {
		   var domObj = null;
		      try { 
		         domObj = (new DOMParser()).parseFromString(xml, "text/xml"); 
		      } 
		      catch (e) { domObj = null; }
		     return domObj;
		}
		
		//To view detail feed
		function detailView(e){
			index= $(e.currentTarget).attr('id');
			var header= $(e.currentTarget).text();
			var index_contents = feedContentsJson[index].feedContent;
			$('#m_feed_header').text(header);
			$('#detail_feed_content').html(index_contents);
			tau.changePage('#page_detail_feed');
		}
		
		//Listener
		function showHttpResult(returnValue) {
			tau.changePage('#page_feed_list');
			xmlString = returnValue[0];
			domObj = parseXml(xmlString);
			jsonObj = xml2json(domObj, '');
			jsonObj = JSON.parse(jsonObj);
			
			for(var i = 1; i< jsonObj.rss.channel.item.length; i++){
				var title = jsonObj.rss.channel.item[i].title['#cdata'];
				if(title==null)
					title = jsonObj.rss.channel.item[i].title;
				var id ='FeedItemIndex'+i;
				var newListItem = $('<li/>', {
				    'id': id,
				    'text': title,
				    'class': 'feeditem'
				}); 
				
				//Add List Item
				$('#feedlist').append(newListItem);		
				
				//Add FeedInfo
				var feedInfo = {
						'id': 'FeedItemIndex'+i,
						'feedContent': jsonObj.rss.channel.item[i].description['#cdata'],
						'link' :  jsonObj.rss.channel.item[i].link
						
				}	 
				feedContentsJson[id] = feedInfo;
			}
			$('.feeditem').off('click');
			
			//Detail feed view to Gear2
			$('.feeditem').on('click', function(e){
				detailView(e);
			});	
			
		}
		
		
		/*
		 * =======================================================================
		 * Get RSS Feed
		 * =======================================================================
		 */	
		function getRSS(paramUrl) {
			var requestQueue = null;
			var request = null;
			
			requestQueue = new G2NNetwork.Http.HttpRequestQueue(function() {
				//Create request
				var method = G2NNetwork.Http.RequestMethod.GET;
				var url = paramUrl;
				var params = {
					key: 'value',
					asd: 'test'
				};
				
				request = new G2NNetwork.Http.HttpRequest(method, url, params, function() {
					//Set response
					if ( request === null ) {
						showHttpResult('Request is null');
						return;
					}
					
					request.setResponseListener(showHttpResult, function() {
						if ( request === null ) {
							showHttpResult('Request is null');
							return;
						}
						if ( requestQueue === null ) {
							showHttpResult('RequestQueue is null');
							return;
						}
						
						requestQueue.start();
						
						//Add request
						requestQueue.addRequest(request, function() {
							//Start request
							if ( requestQueue === null ) {
								showHttpResult('RequestQueue is null');
								return;
							}	
						});
					});
				});
			});		
		}
		
		/*
		 * =======================================================================
		 * Add RSS 
		 * =======================================================================
		 */	
		$('#addPage_btn_save').click(function() {
			var url_id = $('#btn_url').attr('value');
			var newListItem = $('<li/>', {
			    'text': $('#btn_title').attr('value'),
			    'id': url_id,
			    'class': 'rssitem'
			}); 
			$('#rsslist').append(newListItem);
			
			//Add List Item
			$('#btn_title').attr('value','');
			$('#btn_url').attr('value','');
			
			tau.changePage('#page_rss_main');
			
			$('.rssitem').on('click', function(e){
				getRSS(url_id);
				tau.changePage('#page_loading');
			});	
			
			
		});

		/*
		 * =======================================================================
		 * Button Setting 
		 * =======================================================================
		 */	
		//RSS List
		
		$('#btn_rss1').click(function() {
			$('#feedlist').empty();
			getRSS('http://ideabulb.co.kr/rss');
			tau.changePage('#page_loading');
		});
		
		$('#btn_rss2').click(function() {
			$('#feedlist').empty();
			getRSS('http://estima.wordpress.com/feed/');
			tau.changePage('#page_loading');
		});
		
		//Detail feed view to Android Phone
		$('#btn_phone').click(function(){
			var linkUrl = feedContentsJson[index].link;
			G2NUtil.WebViewer.showPage(linkUrl);
		});	
		
		
		
	});
});
		
		
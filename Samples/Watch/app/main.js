
require([
		'jquery',
		'G2NSystem',
		'G2NLifeCycle',
		'G2NNetwork',
		'G2NMobile',
		'xml2json'
	], function (
		$,
		G2NSystem,
		G2NLifeCycle,
		G2NNetwork,
		G2NMobile
	) {
	
	//watch
	function watch(){
		var dt = new Date();
		
		var month = dt.getMonth()+1;
		var date = dt.getDate();
		var year = dt.getFullYear();
		var day = dt.getDay();
		var ch_day = '';
		var am_pm='';
		var hour = dt.getHours();
		var min = dt.getMinutes();
		
		if(hour==24||hour<12)am_pm = '오전';
		else am_pm = '오후';
		
		if(hour!=12) hour = hour%12;

		if(hour>=0&&hour<10)
			hour = "0"+hour;
		if(min>=0&&min<10)
			min = "0"+min;
			
		switch(day){
		case 0:
			ch_day ='일요일';
			break;
		case 1:
			ch_day ='월요일';
			break;
		case 2:
			ch_day ='화요일';
			break;
		case 3:
			ch_day ='수요일';
			break;
		case 4:
			ch_day ='목요일';
			break;
		case 5:
			ch_day ='금요일';
			break;
		case 6:
			ch_day ='토요일';
			break;
		}
		
		
		$('#am_pm').text(am_pm);
		$('#time').text(hour+":"+min);
		$('#date').text(month+'월 '+date+'일 '+ch_day);
		
		setTimeout(function(){watch();},1000);
	}
	
	/*
	 * Get Battery
	 */
	var batteryListenerKey = null;
	
	function showBatteryResult(returnValue) {
		$('#battery').text('Phone : '+returnValue+'%');
	}
	
	function addListenerCallback(key) {
		batteryListenerKey = key;
	}
	
	function addBatteryListener(result,callback){
		if ( batteryListenerKey !== null ) {
			alert('Listener is Exist');
			return;
		}
		G2NMobile.Battery.addBatteryChangedListener(result, callback);
	}
	
	/*
	 * Get Weather, News
	 */
	
	function parseXml(xml) {
		var news_dom = null;
		try {
			news_dom = (new DOMParser()).parseFromString(xml, "text/xml");
		} catch (e) {
			news_dom = null;
		}
		return news_dom;
	}
	
	function showNewsResult(returnValue) {
		var news_xml = returnValue[0];
		news_dom = parseXml(news_xml);
		var news_json = xml2json(news_dom, '');
		news_json = JSON.parse(news_json);
		var news = '';
		for(var i = 0; i<5; i++){
			news += news_json.rss.channel.item[i].title;
			news += "　　　　";				
			}				
		$('#news').text(" "+news);
	}
	
	function showWeatherResult(returnValue) {
		var xml = returnValue[0];
		dom = parseXml(xml);
		var json = xml2json(dom, '');
		json = JSON.parse(json);
		var weather = json.rss.channel.item.description.body.data[0].wfEn;
		switch(weather){
		case 'Clear':
		case 'Partly Cloudy':
			$('#background').css("background-image","url(/res/partlycloudy.png)");
			break;
		case 'Mostly Cloudy':
		case 'Cloudy':
			$('#background').css("background-image","url(/res/cloudy.jpg)");
			break;
		case 'Rain':
		case 'Snow/Rain':
			$('#background').css("background-image","url(/res/rain.jpg)");
			break;
		case 'Snow':
			$('#background').css("background-image","url(/res/snow.jpg)");
			break;
		}
	}
	
	var requestQueue = null;
	var newsRequest = null;
	var weatherRequest = null;
	
	var newsUrl = 'https://news.google.co.kr/news/feeds?pz=1&cf=all&ned=kr&hl=ko&output=rss';
	var weatherUrl = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1144060000';
	
	function initRequest() {
		requestQueue = new G2NNetwork.Http.HttpRequestQueue(function() {
			var method = G2NNetwork.Http.RequestMethod.GET;
			var params = {};
			
			requestQueue.start();
			
			newsRequest =  new G2NNetwork.Http.HttpRequest(method, newsUrl, params, function() {
				newsRequest.setResponseListener(showNewsResult, function() {
					
					weatherRequest =  new G2NNetwork.Http.HttpRequest(method, weatherUrl, params, function() {
						weatherRequest.setResponseListener(showWeatherResult, function() {
							
							requestQueue.addRequest(newsRequest);
							requestQueue.addRequest(weatherRequest);				
						});
					});
				});
			});
		});
		
		addBatteryListener(showBatteryResult, addListenerCallback);
	}
	
	

	function onResume() {
		if ( requestQueue === null ) {
			initRequest();
			return;
		}
		
		requestQueue.addRequest(newsRequest);
		requestQueue.addRequest(weatherRequest);
	}
	
	function onPause() {
		requestQueue.destruct();
		requestQueue = null;
		
		newsRequest.destruct();
		newsRequest = null;
		
		weatherRequest.destruct();
		weatherRequest = null;
	}
	
	$(document).ready(function() {
		window.setTimeout(function(){watch();},1000);
		
		G2NLifeCycle.setOnResumeCallback(onResume);
		G2NLifeCycle.setOnPauseCallback(onPause);
	});
});

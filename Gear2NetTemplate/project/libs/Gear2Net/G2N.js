// Inner Modules Path Setting
require.config({
	paths: {
		// Using Libraries
		jquery:			'Gear2Net/libs/jquery-1.9.1',
		tau:			'Gear2Net/libs/tau/js/tau',
		uuid:			'Gear2Net/libs/Math.uuid',
		
		// Framework Modules
		G2NSystem:		'Gear2Net/modules/framework/G2NSystem',
		G2NMsg:			'Gear2Net/modules/framework/G2NMsg',
		G2NObject:		'Gear2Net/modules/framework/G2NObject',
		G2NLifeCycle:	'Gear2Net/modules/framework/G2NLifeCycle',
		G2NConnect:		'Gear2Net/modules/framework/G2NConnect',
		
		// API Modules
		G2NMobile:		'Gear2Net/modules/api/G2NMobile',
		G2NNetwork:		'Gear2Net/modules/api/G2NNetwork',
		G2NUtil:		'Gear2Net/modules/api/G2NUtil'
	}
});

requirejs(['G2NSystem', 'G2NLifeCycle', 'jquery'], function(G2NSystem, G2NLifeCycle, $) {
	// LifeCycle Event Mapping
	if ( G2NSystem.isWatchWidget() ) { // Watch Clock Widget
		$(document).ready(function() {		
			G2NLifeCycle.onCreateDefaultFunc();
		});
	}
	else { // Application Widget
		$(document).ready(function() {		
			G2NLifeCycle.onCreateDefaultFunc();
		});
		
		$(window).focus(function() {
			G2NLifeCycle.onResumeDefaultFunc();
		});
		
		$(window).blur(function() {
			G2NLifeCycle.onPauseDefaultFunc();
		});
		
//		$(window).unload(function() {
//			G2NLifeCycle.onDestroyDefaultFunc();
//		});	// deprecated
	}
});
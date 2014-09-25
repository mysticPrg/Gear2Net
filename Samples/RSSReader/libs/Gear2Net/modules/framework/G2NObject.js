define(['G2NSystem', 'G2NConnect', 'G2NMsg'], function(G2NSystem, G2NConnect, G2NMsg) {
	var G2NObject = null,
		G2NContext = null, 
		isInit = false,
		publicMember = {};
	
	/*
	 * Private Member
	 */
	function G2NClass(Parent, props) {
		var Child, F, i;
		
		// Constructor
		Child = function() {
			if ( Child.uber && Child.uber.hasOwnProperty('__construct') ) {
				Child.uber.__construct.apply(this, arguments);
			}
			if ( Child.prototype.hasOwnProperty('__construct') ) {
				Child.prototype.__construct.apply(this, arguments);
			}
		};
		
		// Inherit
		Parent = Parent || Object;
		F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.uber = Parent.prototype;
		Child.prototype.constructor = Child;
		
		// Member property, method
		for ( i in props ) {
			if ( props.hasOwnProperty(i) ) {
				Child.prototype[i] = props[i];
			}
		}
		
		return Child;
	}
	
	function G2NClassDefine(props) {
		return G2NClass(G2NObject, props);
	}

	function createG2NObjectClass() {
		G2NObject = G2NClass(null, {
			__construct: function() {
				G2NSystem.debugLog('G2NObject __construct called!');
				this.objKey = G2NSystem.registerObj(this);
			},
			
			getObjKey: function() {
				return this.objKey;
			},
			
			destruct: function(callback) {
				G2NSystem.debugLog('G2NObject destruct called!');
				var msg = G2NMsg.createDestructorMsg(this.objKey, callback);
				G2NConnect.send(JSON.stringify(msg));
			}
		});
	}
	
	function createG2NContextClass() {
		var G2NContextClass = G2NClass(G2NObject, {
			__construct: function() {
				G2NSystem.debugLog('G2NContext __construct called!');
				this.objKey = 'net.gear2net.framework.G2NContext';
			}
		});
		
		G2NContext = new G2NContextClass();
	}
	
	function initG2NObject() {
		// Class Definer And Root Class
		createG2NObjectClass();
		createG2NContextClass();
		
		publicMember.G2NClass = G2NClass;
		publicMember.G2NObject = G2NObject;
		publicMember.G2NClassDefine = G2NClassDefine;
		publicMember.G2NContext = G2NContext;
		
		
		
		G2NSystem.debugLog('G2NSystem Init!');
		isInit = true;
	}
	
	if ( isInit === false ) {
		initG2NObject();		
	}
	
	return publicMember;
});
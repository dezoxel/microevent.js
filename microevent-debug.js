/**
 * MicroEvent.js debug
 *
 * # it is the same as MicroEvent.js but it adds checks to help you debug
*/

var MicroEvent	= function(){}
MicroEvent.prototype	= {
	bind	: function(event, fct){
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	one     : function(event, fct) {
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		this._oneEvents[event] = this._oneEvents[event]	|| [];
		this._oneEvents[event].push(fct);
	},
	unbind	: function(event, fct){
		console.assert(typeof fct === 'function');
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		if (event in this._events !== false) {
            console.assert(this._events[event].indexOf(fct) !== -1);
            this._events[event].splice(this._events[event].indexOf(fct), 1);
		}
		if (event in this._oneEvents !== false) {
            this._oneEvents[event].pop();
		}
	},
	trigger	: function(event /* , args... */){
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		if (event in this._events !== false) {
            for (var i = 0; i < this._events[event].length; i++) {
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
            }
		}
		if (this._oneEvents[event] && this._oneEvents[event].length) {
            for (var i = 0; i < this._oneEvents[event].length; i++){
                this._oneEvents[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
                this.unbind(event);
            }
        }
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger', 'one'];
	for(var i = 0; i < props.length; i ++){
		if( typeof destObject === 'function' ){
			destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
		}else{
			destObject[props[i]] = MicroEvent.prototype[props[i]];
		}
	}
}

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent
}

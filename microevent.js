/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 *
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

/**
 * @class MicroEvent
 */
var MicroEvent = function() {
};

MicroEvent.prototype = {
    /**
     * Binds an event until a corresponding call to `unbind` is called.
     */
	bind	: function(event, fct) {
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	/**
	 * Binds an event that is then unbound after the first call.
	 */
	one     : function(event, fct) {
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		this._oneEvents[event] = this._oneEvents[event]	|| [];
		this._oneEvents[event].push(fct);
	},
	/**
	 * Unbinds an event.
	 */
	unbind	: function(event, fct) {
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		if (event in this._events !== false) {
            var indexOfFunc = this._events[event].indexOf(fct);
            if (indexOfFunc !== -1) {
                this._events[event].splice(indexOfFunc, 1);
            } else {
                this._events[event] = [];
            }
		}
		if (event in this._oneEvents !== false) {
            this._oneEvents[event].pop();
		}
	},
	/**
	 * Triggers an event.
	 */
	trigger	: function(event /* , args... */) {
        this._events = this._events || {};
        this._oneEvents = this._oneEvents || {};
		if (this._events[event] && this._events[event].length) {
            for (var i = 0; i < this._events[event].length; i++){
                this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
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
	var props	= ['bind', 'one', 'unbind', 'trigger'];
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
	module.exports	= MicroEvent;
}

// AMD support
if( typeof define !== "undefined"){
		define([], function(){
				return MicroEvent;
		});
}

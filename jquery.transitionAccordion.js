/*!
 * jQuery transitionAccordion
 * https://github.com/Takazudo/jQuery.transitionAccordion
 *
 * Version: 0
 * Author: Takeshi Takatsudo
 */
(function($, window, document, undefined){

/* UA detection */
var iOS = (function(){
	var ua = {};
	var navigator = window.navigator;
	var platforms = [
		{ property: 'platform', regex: /iPhone/i, identity: 'iPhone' },
		{ property: 'platform', regex: /iPod/i, identity: 'iPod' },
		{ property: 'userAgent', regex: /iPad/i, identity: 'iPad' }
	];
	for(var i=0, l=platforms.length, platform; i<l; i++){
		platform = platforms[i];
		ua[platform.identity] = platform.regex.test(navigator[platform.property]);
	}
	return ua.iPhone || ua.iPod || ua.iPad || false;
})();

/**
 * Accordion
 */
var Accordion = function($el, options){
	var o =  this._options = options;
	this._$el = $el;
	this._$button = $(o.class_button, $el);
	this._$content = $(o.class_content, $el);
	this._$contentInner = $(o.class_contentInner, $el);
	this._eventify();
	this._q = $({});
	this._prepareTransitions();
};
Accordion.prototype = {
	_isOpen: false,
	_eventify: function(){
		this._$button.click($.proxy(function(e){
			e.preventDefault();
			this.toggle();
		}, this));
		return this;
	},
	_prepareTransitions: function(){
		if(!iOS){
			return this;
		}
		this._$content.css('-webkit-transition','all .5s');
		// fix iOS flicker bug
		$('*', this._$content).css('-webkit-transform','translate3d(0,0,0)');
		return this;
	},
	_animate: function(heightVal){
		var style = { height: heightVal };
		var q = this._q;
		if(iOS){
			q.queue($.proxy(function(){
				this._$content.one('webkitTransitionEnd', $.proxy(function(){
					setTimeout($.proxy(function(){
						this._isOpen = !this._isOpen;
						q.dequeue();
					}, this), 1);
				}, this)).css(style);
			}, this));
		}else{
			q.queue($.proxy(function(){
				var d = this._options.duration;
				this._$content.animate(style, d, $.proxy(function(){
					this._isOpen = !this._isOpen;
					q.dequeue();
				}, this));
			}, this));
		}
		return this;
	},
	open: function(){
		this._animate(this._$contentInner.innerHeight());
		return this;
	},
	close: function(){
		this._animate(0);
		return this;
	},
	toggle: function(){
		var q = this._q;
		q.queue($.proxy(function(){
			if(this._isOpen){
				this.close();
			}else{
				this.open();
			}
			q.dequeue();
		}, this));
		return this;
	}
};

/**
 * bridge
 */
if($.fn.transitionAccordion){
	$.error('Something is wrong about $.fn.transitionAccordion.');
}
$.fn.transitionAccordion = function(options){
	options = $.extend({
		duration: 400,
		class_button: '.ui-transitionAccordion-button',
		class_content: '.ui-transitionAccordion-content',
		class_contentInner: '.ui-transitionAccordion-content-inner'
	}, options);
	return this.each(function(){
		var $el = $(this);
		var instance = new Accordion($el, options);
		$el.data('transitionAccordion', instance);
	});
};

})(jQuery, this, this.document);

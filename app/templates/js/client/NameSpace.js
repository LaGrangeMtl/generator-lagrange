
	"use strict";

	var name = '<%= props.projectNamespace %>';

	var Promise = require('promise');
	var $ = require('jquery');

	var ns = window[name] = (window[name] || {});


	ns.window = $(window);

	ns.getBody = (function(){
		var body;
		return function(){
			return body = body || $('body');
		};
	})();

	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	/**
	 * generates unique id
	 */		
	ns.getUniqueID = function(){
		var id = 0;
		return function(){
			return 'uid' + id++;
		}
	}();

	ns.docReady = (function(){
		return new Promise(function(resolve, reject) {
			$(document).ready(function(){
				resolve();
			});
		});
	})();

	ns.docReady.then(function(){
		//console.log("ready");
	});

	module.exports = ns;


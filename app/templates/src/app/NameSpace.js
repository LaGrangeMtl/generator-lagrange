'format es6';
'use strict';

	var name = '<%= props.projectNamespace %>';

	import $ from 'jquery';
	import Promise from 'Promise';

	try{require('source-map-support').install();}catch(e){}

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

	export default ns;


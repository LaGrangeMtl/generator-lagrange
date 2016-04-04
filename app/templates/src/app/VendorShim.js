import Promise from 'promise';

//Puts jQuery in global scope for non-commonjs plugins
window.$ = window.jQuery = (window.jQuery || require('jquery'));

window.GreenSockGlobals = {};

if(!Promise) {
	Promise.onPossiblyUnhandledRejection(function(error){
		throw error;
	});
}

require('console-polyfill');

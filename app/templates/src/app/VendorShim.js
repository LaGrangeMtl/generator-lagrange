

//Puts jQuery in global scope for non-commonjs plugins
window.$ = window.jQuery = (window.jQuery || require('jquery'));

window.GreenSockGlobals = {};

require('console-polyfill');
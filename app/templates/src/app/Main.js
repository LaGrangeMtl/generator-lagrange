'format es6';
'use strict';

import $ from 'jquery';
import ns from 'ns';

ns.docReady.then(() => {
	let f = (a, b='yo yeah') => {
		$('#main').html('ok manne2 '+ b);

		// console.log(Promise);
		console.log(window.GreenSockGlobals);
	};

	f();
});
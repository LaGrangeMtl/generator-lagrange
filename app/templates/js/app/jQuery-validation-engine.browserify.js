

require('jquery.validationEngine');

var langRules = {};

require('jquery.validationEngine-fr');
langRules.fr = $.validationEngineLanguage.allRules;
require('jquery.validationEngine-en');
langRules.en = $.validationEngineLanguage.allRules;

//console.log(langRules);

module.exports = {
	setLanguage : function(lang) {
		$.validationEngineLanguage.allRules = langRules[lang];
	}
};
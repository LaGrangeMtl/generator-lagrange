'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var getSalt = function (len) {
	len = len || 20;
	var set = '0123456789ABCDEFGHIJKLMNOPQURSTUVWXYZ -!$%?&*()=_+|£¢@{}[];:',
		setLen = set.length,
		salt = '';
	for (var i = 0; i < len; i++) {
		var p = Math.floor(Math.random() * setLen);
		salt += set[p];
	}
	return salt;
}

var LagrangeGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require('../package.json');

		this.on('end', function () {
			if (!this.options['skip-install']) {
				this.installDependencies({
					callback: function () {
						if(this.props.isBrowserify) {

							this.spawnCommand('ln', ['-s', '../app', 'node_modules/app']);
							this.spawnCommand('ln', ['-s', '../app/lagrange', 'node_modules/lagrange']);
							this.spawnCommand('ln', ['-s', '../app/'+this.props.projectNamespace, 'node_modules/'+this.props.projectNamespace]);
							console.log('Symbolic links for browserify created');
						}
						this.spawnCommand('grunt', ['prebuild']);
					}.bind(this)
				});
			}
		});
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		this.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('Yeah! On starte un projet. J\'espère que ça va être payant.'));

		//console.log(this);

		var getDefaultFromPrevious = function(propName) {
			return function(answers){
				return answers[propName];
			}
		};

		var optionnalJsLibs = [
		{
			name: 'Greensock',
			value: 'isGreensock',
			checked: true
		},
		{
			name: 'Colorbox',
			value: 'isColorbox',
			checked: false
		},
		{
			name: 'Easel.js',
			value: 'isEasel',
			checked: false
		},
		{
			name: 'Raphael.js',
			value: 'isRaphael',
			checked: false
		},
		{
			name: 'Three.js',
			value: 'isThree',
			checked: false
		},
		{
			name: 'jQuery.validationEngine.js',
			value: 'isValidate',
			checked: false
		}
		];

		var prompts = [
			{
				name: 'projectName',
				type: 'input',
				message: 'Nom du client/projet',
				default : this.appname,
			},
			{
				name: 'version',
				message: 'Version',
				type: 'input',
				default: '0.0.1',
			},
			{
				name: 'homepage',
				type: 'input',
				message: 'Url',
			},
			{
				name: 'authorName',
				message: 'Auteur',
				type: 'input',
				default : 'La Grange',
			},
			{
				name: 'authorEmail',
				message: 'Email',
				type: 'input',
				default : 'info@la-grange.ca',
			},
			{
				name: 'isBrowserify',
				type: 'confirm',
				message: 'Scripts gérés par browserify?',
				default : true
			},
			{
				name: 'jqueryVersion',
				type: 'list',
				message: 'Quelle version de jQuery?',
				choices: [{
					name: '1.x',
					value: '<2',
					checked: true
				},
				{
					name: '2.x',
					value: 'latest',
					checked: false
				}],
				default : '<2'
			},
			{
				name: 'isFreestone',
				type: 'confirm',
				message: 'Utilise Freestone?',
				default : true
			},
			{
				when: getDefaultFromPrevious('isFreestone'),
				name: 'dbName',
				type: 'input',
				message: 'Nom de la db mysql',
				default : getDefaultFromPrevious('projectname'),
			},
			{
				name: 'isFramework',
				type: 'confirm',
				message: 'Utilise le framework frontend de La Grange?',
				default : true
			},
			{
				type: 'checkbox',
				name: 'optionnalJsLibs',
				message: 'Quelles librairies javascript doivent être importées?',
				choices: optionnalJsLibs
			}

		];

		this.prompt(prompts, function (answers) {
			this.props = answers;
			function hasFeature(feat) { return features.indexOf(feat) !== -1; }

			this.props.projectNamespace = this._.camelize(this.props.projectName);
			this.props.salt = getSalt();
			this.props.jsLibs = optionnalJsLibs.reduce(function(cur, el) {
				var val = el.value;
				cur[val] = answers.optionnalJsLibs.indexOf(val) !== -1;
				return cur;
			}, {});

			done();
		}.bind(this));
	},

	writeIndex : function () {
		var indexFile = this.readFileAsString(path.join(this.sourceRoot(), '/page.htm'));
		var common = this.readFileAsString(path.join(this.sourceRoot(), '/common.htm'));

		if(this.props.isFreestone) {
			common = this.engine(common, this);
			this.commonFile = common;
		} else {
			//parse le common dans un index
			var reg = /\{:([a-z]+)\}/ig;
			var el;
			while(el = reg.exec(common)){
				var key = el[1];
				var content;
				var regContent = new RegExp('\\{:'+key+'\\}([\\s\\S]+)\\{/'+key+'\\}');
				var content = regContent.exec(common);
				indexFile = indexFile.replace('{common:'+key+'}', content[1]);

			}
			//console.log(commonEls);

		}
		indexFile = this.engine(indexFile, this);


		this.indexFile = indexFile;
	},

	app: function () {
		this.mkdir('img');
		this.mkdir('js');
		if(this.props.isBrowserify) {
			this.directory('js/app', 'app');
			this.mkdir('app/lagrange');
			this.directory('js/client', 'app/'+this.props.projectNamespace);
		}
		this.mkdir('assets');
		this.directory('scss', 'scss');
		this.template('_package.json', 'package.json');
		this.template('_Gruntfile.js', 'Gruntfile.js');
		this.template('_bower.json', 'bower.json');
		this.template('_.gitignore', '.gitignore');
		this.template('_README.md', 'README.md');

		if(this.props.isFreestone) {
			this.mkdir('config');
			this.template('freestone/config/config.php', 'config/config.php');
			this.write('page.htm', this.indexFile);
			this.write('common.htm', this.commonFile);
			this.directory('freestone/modules', 'modules');
			this.directory('freestone/lang', 'lang');
		} else {
			this.write('index.html', this.indexFile);
		}

	},

	projectfiles: function () {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	}
});

module.exports = LagrangeGenerator;

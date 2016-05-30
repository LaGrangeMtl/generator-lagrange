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

							this.spawnCommand('ln', ['-s', '../src', 'node_modules/src']);
							this.spawnCommand('ln', ['-s', '../src/lagrange', 'node_modules/lagrange']);
							this.spawnCommand('ln', ['-s', '../src/app', 'node_modules/'+this.props.projectNamespace]);
							console.log('Symbolic links for browserify created');
						}
						this.spawnCommand('gulp', ['libcopy']);
					}.bind(this)
				});
			}
		});
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		// this.log(this.yeoman);
this.log(chalk.magenta(
'                                          _o=<&&&&>=vo__\n                                        ?/$="\'"  """^=<&&R$~\\\n                                      .&?/\'              `""$$,\n                                    ,/?/\'       /-"^\\.   .-=~\\T,\n                                  ,/?/\'        /\\|6?`|  |<<q- ,??\n                                ./?/\'          `\\??dp\'  `$??,/|,i\\.\n                               ,*??              `"       ""\' `b\'\\\\$$&&\\.\n                              ,Td\'                             `&:`H\' "&7, .__\n                  ._.         H||            .                  `*\\H,  `&$$S:7|\n                 |????        M|,         ,--&|\\                  `&?b   ""://\'\n        .,o--vo\\,PJ\'H|,       H|L         ``\'"H?b                 ,-`?\\   ,&&\'\n       ,P?-""^==:=\' ||b       `L9,            `H`&,               |?:!|| ,P&\n       `b?\\          9/?       ??H,            |L *b.,\'"\\          :$:&  H]\'\n        `b$\\o.        */\\.      ??*b.           9.  `\\\\:(|     .,/$6d\'  |\\T\n          ``\\Z\\\\       `\\7b.    ,To?&b.          \\(\\:-.-S:-~=-"\'\',P     MJ\'\n             `\\?*b       ?&&\\.  d\\|<_ `\\o_       `&&M\\:?-+#:>\\.|,&\'    |LT\n               `\\?\\\\      ``\\?\\d|/`4RM|:~:$=v\\.    `$k<MR&MF$$?&J\'     HJ\'\n                 `\\?\\.       `\\b/$$$&v!-?&<?::P\\\\    `"^-^-?b=Sd\'     |\\T\n     _o~=~$&$>==v\\.??\\,         `\\d `\\$$\'9P\':-?>:"=\\ooo/=/$$~?$\\     ,R/\n   ./$?~^\'"""""`"\\\\&&< ?b               "`~$P:c: /v==v,#::?<<&:\'T|   d$/\'\n   :.             ""=o/&.                ,P    o&Z\'`\'.##| |MH\\|| ,$$\'\n   =:$H&=\\.           `"b?b.             .&\'    96*.-v.:?/`\\==$&?$&*\'\n       `^$?\\.           `*&*\\\\          ,P       ?~-~\'      |$$S>\'\n          `\\7b           ,T/\\&&\\.      d?                    |T\'\n            \\/b         .&J\'  `\\>     d\'                      T,\n             &`L        /||          ?|                        ?,\n             ||9       J\\T           H                          ?,\n              H||     ||/           ||                           9,\n              ||M     PJ\'           ||                           `H\n               bT,   ||T            ||                            ||\n               T/L   H||            `b                             M\n                &T,  M|              9,                            9\n                `L9, M|              `&.                           |\n                 `?*,9||              `b                           d\n                  `\\?(|H.              `b                          ?b\n                   `*\\ `&.              `\\.                       J*|b\n                     `\\o/\\.              `&.                     ,P 9/L\n                        9:&.              `9\\                   ??  `H9.\n                         *?9\\               `b                .&\'    |/|\n                          `|`\\.              `L             ./\'      `|H\n                          d\\/qZbo.            M          .,=\'        ,|T\n                 ./~&$$?=??/\' `"=H$|          H       .o=\'\'          J\\|\n                ,*/\'\'  `\\?        `\'        ./?ov=="*b9,            ,$P\n               ,Td                         ,$$\'`\'    ?|M           ,$/\n               J||                       ,$?/         M||         ?$/\n               M||         |>\\.     ._,~9$\'\'          T||        d\'M.\n               9`|         `Hi:R&:&&6&="\'           ./$J|       `^"\\Z\\.\n               ||M          `=Z\\:""                 H|T"            `&H&>v_\n                bT,    ..   v,?|\\                   M||               .:Z|&\\.\n                ||H  _oZ??v~>`d9H|                  `?*\\              ?$ `#\'H\n                 9/L||1+ "HH  .$/                    `bZ&\\       ,o\\&|}6| &/\'\n                  \\?$.:?ooo/*""\'                       `\\$$b_   |\\9|/|?:./\'\n                   `"""\'  `\'                              `~?&qo:?:\',p#/\'\n                                                             "^~<:>/"\n'
));

		// replace it with a short and sweet description of your generator
		this.log(chalk.red('On a eu un nouveau projet sur c\'tes affaire-là d\'internet. Savez-vous ce qu\'on va faire avec c\'te 400 piasses-là?'));

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
				name: 'Selectric',
				value: 'isSelectric',
				checked: true
			},
			{
				name: 'Slick',
				value: 'isSlick',
				checked: true
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
				name: 'homepage',
				type: 'input',
				message: 'Url',
			},
			{
				name: 'isBrowserify',
				type: 'confirm',
				message: 'Scripts gérés par browserify?',
				default : true
			},
			{
				name: 'isES6',
				type: 'confirm',
				message: 'Transpile ES6 avec Babelify?',
				default : true
			},
			{
				name: 'jqueryVersion',
				type: 'list',
				message: 'Quelle version de jQuery?',
				choices: [{
					name: '1.x',
					value: '<2',
					checked: false
				},
				{
					name: '2.x',
					value: 'latest',
					checked: true
				}],
				default : 'latest'
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
		this.mkdir('css');
		if(this.props.isBrowserify) {
			this.directory('src', 'src');
			this.mkdir('src/lagrange');
		}
		this.mkdir('assets');
		this.directory('scss', 'scss');
		this.template('_package.json', 'package.json');
		this.template('_gulpfile.js', 'gulpfile.js');
		this.template('_bower.json', 'bower.json');
		this.template('_.gitignore', '.gitignore');
		this.template('_README.md', 'README.md');

		if(this.props.isFreestone) {
			this.mkdir('config');
			this.template('freestone/config/config.php', 'config/config.php');
			this.template('freestone/config/robots.txt', 'config/robots.txt');
			this.template('freestone/deploy.sh', 'deploy.sh');
			this.write('page.htm', this.indexFile);
			this.write('common.htm', this.commonFile);
			this.directory('freestone/modules', 'modules');
			this.directory('freestone/lang', 'lang');
			this.directory('freestone/common', 'common');
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

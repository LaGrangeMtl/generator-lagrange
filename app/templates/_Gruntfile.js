'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%%= pkg.title || pkg.name %> - v<%%= pkg.version %> - ' +
			'<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;'+
			'*/\n\n',
		// Task configuration.
		<% if (props.jsLibs.isEasel){ %>
		//get Easel version for bowercopy
		easelVersion : (function(){
			var easelCnf = grunt.file.readJSON('bower_components/EaselJS/bower.json');
			return easelCnf.version;
		}()),
		<% } %>
		bowercopy: {
			options: {
				srcPrefix: 'bower_components',
			},
			bootmoilastrap: {
				 files: {
					'scss/common/bootstrap' : 'bootstrap/scss',
				}
			},
			vendor: {
				options: {
					destPrefix: 'js/vendor',
				},
				 files: {
					'jquery.js' : 'jquery/<% if (props.jqueryVersion === '<2'){ %>dist/<% } %>jquery.min.js',
					'es5-shim.js' : 'es5-shim/es5-shim.min.js',
					'es5-sham.js' : 'es5-shim/es5-sham.min.js',
					<% if (props.jsLibs.isGreensock){ %>'greensock' : 'gsap/src/minified',<% } %>
					<% if (props.jsLibs.isEasel){ %>'easel.js' : 'EaselJS/lib/easeljs-<%%= easelVersion %>.min.js',<% } %>
				}
			},
			<% if (props.isFramework){ %>
			lagrange: {
				options: {
					destPrefix: 'js',
				},
				 files: {
					'lagrange' : 'lagrange/src/js/lagrange',
					'require.js' : 'lagrange/example/js/require.js',
					'vendor/native.history.js' : 'history.js/scripts/bundled/html4+html5/native.history.js',
				}
			}
			<% } %>
		},

		concat: {
			options: {
				banner: '<%%= banner %>',
				stripBanners: true
			},
			placeholder: {
				src: [
					"bower_components/placeholder.js/lib/utils.js",
					"bower_components/placeholder.js/lib/main.js",
					"bower_components/placeholder.js/lib/adapters/placeholders.jquery.js"
				],
				dest: "js/vendor/placeholders.jquery.js"
			},
		},

		uglify: {
			prebuild : {
				files: {
					'js/vendor/modernizr.js': ['bower_components/modernizr/modernizr.js'],
					'js/vendor/underscore.js': ['bower_components/underscore/underscore.js'],
					'js/vendor/placeholders.jquery.js': ['js/vendor/placeholders.jquery.js'],
					<% if(props.isFramework) { %>'js/vendor/imagesloaded.js': ['js/vendor/imagesloaded.js'],<% } %>
				}
			},
		},

		requirejs: {
			build: {
				options: {
					
					skipDirOptimize: true,
					name: "app",
					include: [],
					insertRequire: [],
					out: "built/app.js",
					baseUrl: 'js/',
					mainConfigFile: 'js/app.js',
					done: function(done, output) {
						var duplicates = require('rjs-build-analysis').duplicates(output);

						if (duplicates.length > 0) {
							grunt.log.subhead('Duplicates found in requirejs build:');
							grunt.log.warn(duplicates);
							done(new Error('r.js built duplicate modules, please check the excludes option.'));
						}

						done();
					}
				}
			}
			<% if(props.isFramework) { %>,
			imagesloaded: {
				options: {
					optimize: "none",
					skipDirOptimize: true,
					name: "imagesloaded/imagesloaded",
					include: [],
					insertRequire: [],
					out: "js/vendor/imagesloaded.js",
					baseUrl: 'bower_components/',
					paths: {}
				}
			}
			<% } %>
		},
		watch: {
			js: {
				files: 'js/**/*.js',
				tasks: ['requirejs:build']
			},
			scss: {
				files: 'scss/**/*.scss',
				tasks: ['sass']
			}
		},
		sass: {
			development: {
				options: {
					paths: [],
					compress : true,
					sourceMap: true,
					sourceMapFilename: 'css/main.css.map',
					sourceMapRootpath: '../'
				},
				files: {
					"css/main.css": "scss/main.scss"
				}
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bowercopy');

	// Default task.
	grunt.registerTask('default', ['requirejs:build']);
	grunt.registerTask('prebuild', [<% if(props.isFramework) { %>'requirejs:imagesloaded',<% } %> 'concat:placeholder', 'uglify:prebuild', 'bowercopy']);

};

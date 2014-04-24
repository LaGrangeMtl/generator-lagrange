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

		concat: {
			options: {
				banner: '<%%= banner %>',
				stripBanners: true
			},
		},

		bowercopy: {
			options: {
				srcPrefix: 'bower_components',
			},
			bootmoilastrap: {
				 files: {
					'less/common/bootstrap' : 'bootstrap/less',
				}
			},
			vendor: {
				options: {
					destPrefix: 'js/vendor',
				},
				 files: {
					'jquery.js' : 'jquery/dist/jquery.min.js',
					'es5-shim.js' : 'es5-shim/es5-shim.min.js',
					'es5-sham.js' : 'es5-shim/es5-sham.min.js',
					'modernizr.js' : 'modernizr/modernizr.js',
					'underscore.js' : 'underscore/underscore.js',
					<% if (props.jsLibs.isGreensock){ %>'greensock' : 'gsap/src/minified',<% } %>
				}
			},
			<% if (props.isFramework){ %>
			lagrange: {
				options: {
					destPrefix: 'js',
				},
				 files: {
					'lagrange' : 'lagrange/src/js/lagrange',
					'<%= props.projectNamespace %>' : 'lagrange/example/js/example',
					'app.js' : 'lagrange/example/js/app.js',
					'require.js' : 'lagrange/example/js/require.js',
					'vendor/native.history.js' : 'history.js/scripts/bundled/html4+html5/native.history.js',
				}
			}
			<% } %>
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
			prebuild: {
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
			less: {
				files: 'less/*.less',
				tasks: ['less']
			}
		},
		less: {
			development: {
				options: {
					paths: [],
					compress : true
				},
				files: {
					"css/main.css": "less/main.less"
				}
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bowercopy');

	// Default task.
	grunt.registerTask('default', ['requirejs:build']);
	grunt.registerTask('prebuild', [<% if(props.isFramework) { %>'requirejs:prebuild', <% } %>'bowercopy']);

};

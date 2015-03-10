'use strict';

module.exports = function(grunt) {

	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);

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
					'scss/common/bootstrap' : 'bootstrap-sass/assets/stylesheets/bootstrap',
				}
			},
			<% if (!props.isBrowserify){ %>
				vendor: {
					options: {
						destPrefix: 'js/vendor',
					},
					 files: {
						'jquery.js' : 'jquery/<% if (props.jqueryVersion === '<2'){ %>dist/<% } %>jquery.min.js',
						'es5-shim.js' : 'es5-shim/es5-shim.min.js',
						'es5-sham.js' : 'es5-shim/es5-sham.min.js',
						'imagesloaded.js' : 'imagesloaded/imagesloaded.js',
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
						'vendor/native.history.js' : 'history.js/scripts/bundled/html4+html5/native.history.js',
					}
				}
				<% } %>
			<% } else { %>
				vendor: {
					options: {
						destPrefix: 'js/vendor',
					},
					 files: {
						'modernizr.js' : 'modernizr/modernizr.js',
					}
				},
				<% if (props.isFramework){ %>
				lagrange: {
					options: {
						destPrefix: 'app',
					},
					 files: {
						'lagrange' : 'lagrange/src/js/lagrange',
					}
				}
				<% } %>
			<% } %>
		},
		<% if (!props.isBrowserify){ %>
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
		<% } %>
		uglify: {
			options: {
				banner:  '<%%= banner %>'
			},
			<% if (!props.isBrowserify){ %>
			prebuild : {
				files: {
					'js/vendor/modernizr.js': ['bower_components/modernizr/modernizr.js'],
					'js/vendor/lodash.js': ['bower_components/lodash/lodash.js'],
					'js/vendor/placeholders.jquery.js': ['js/vendor/placeholders.jquery.js'],
					<% if(props.isFramework) { %>'js/vendor/imagesloaded.js': ['js/vendor/imagesloaded.js'],<% } %>
				}
			},
			<% } else { %>
			prod: {
				src: 'js/app.js',
				dest: 'js/app.js'
			},
			common: {
				src: 'js/common.js',
				dest: 'js/common.js'
			}
			<% } %>
		},
		<% if (props.isBrowserify){ %>
		browserify : {
			options : {
				external: ['gsap', 'jquery', 'lodash', 'imagesloaded', 'raphael'],
				browserifyOptions : {
					debug: false
				},
				//
			},
			dev : {
				files: {
				  'js/app.js': ['app/<%= props.projectNamespace %>/App.js'],
				},
				options : {
					browserifyOptions : {
						debug: true
					},
				}
			},
			prod : {
				files: {
				  'js/app.js': ['app/<%= props.projectNamespace %>/App.js'],
				},
			},
			common: {
				src: ['.'],
				dest: 'js/common.js',
				options: {
					debug: false,
					alias : [
						'es5-shim:',
						'jquery:',
						<% if (props.jsLibs.isGreensock){ %>'gsap:',<% } %>
						<% if (props.jsLibs.isRaphael){ %>'raphael:',<% } %>
						<% if (props.jsLibs.isColorbox){ %>'jquery-colorbox:',<% } %>
						'imagesloaded:',
						'console-polyfill:',
						'lodash:',
					],
					external : null,
				},
			}
		},
		<% } %>
		watch: {
			<% if (props.isBrowserify){ %>
			js: {
				files: 'app/**/*.js',
				tasks: ['browserify:prod']
			},
			<% } %>
			scss: {
				files: 'scss/**/*.scss',
			<% if (props.isLibSass) { %>
				tasks: ['libsass']
			<% } else { %>
				tasks: ['sass']
			<% } %>
			}
		},

		<% if (props.isLibSass) { %>
			libsass: {
			    compile: {
					src: 'scss/main.scss',
					dest: 'css/main.css',
					sourceMap: true
				}
			}
		<% } else { %>
			sass: {
				development: {
					options: {
						style : 'compressed',
						sourcemap: true,
					},
					files: {
						"css/main.css": "scss/main.scss"
					}
				},
			}
		<% } %>
	});

	// Default task.
	<% if (props.isBrowserify){ %>

	grunt.registerTask('default', ['browserify:dev']);
	grunt.registerTask('prod', ['browserify:prod', 'uglify:prod']);
	grunt.registerTask('jslibs', ['browserify:common', 'uglify:common']);
	grunt.registerTask('prebuild', ['bowercopy', 'browserify:common', 'uglify:common']);
		
	<% } else { %>
	grunt.registerTask('prebuild', ['concat:placeholder', 'bowercopy', 'uglify:prebuild']);
	<% } %>
};

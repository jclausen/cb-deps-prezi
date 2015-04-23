module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['includes/css/sass/compile/**/*.{scss,sass}','includes/css/sass/include/**/*.{scss,sass}'],
				tasks: ['sass:dist']
			},
			javascript: {
                files: 'includes/js/lib/**/*.js',
                tasks: ['uglify:applibs']
            },
			livereload: {
				files: ['css/*.css'],
				options: {
					livereload: false
				}
			}
		},
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'includes/css/styles.css': 'includes/css/sass/compile/styles.scss'
				}
			}
		},
		uglify: {
			applibs:{
			  options: {
			  	//beautify: true,
			  	//mangle: false,
			    // the banner is inserted at the top of the output
			    banner: '/*! Coldbox Dependency Management Prezi <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			  },
			  files: {
			  	'includes/js/app.js': ['include/js/lib/_globals.js','include/js/lib/**/*.js']
			  }
			},
			libraries:{
				options:{
					preserveComments: true,
					banner: '/*! Coldbox Dependency Management Prezi - Consolidated Open Source Libraries. Generated: <%= grunt.template.today("dd-mm-yyyy") %> */\n\n'
				},
				files: {
					'includes/js/lib.js':
					[
				      	'bower_components/jquery/dist/jquery.min.js',
				      	'bower_components/bootstrap/dist/js/bootstrap.min.js',
				      	'bower_components/jQuery.mmenu/src/js/jquery.mmenu.min.js',
				      	'bower_components/arrive/src/arrive.js',
				      	'bower_components/angular/angular.min.js',
				      	'bower_components/angular-sanitize/angular-sanitize.min.js',
				      	'includes/js/vendor/*.js',
				      	'includes/js/vendor/**/*.js' 	
				    ]
				}

			}

		  
		}

	});
	grunt.registerTask('default', ['sass:dist', 'uglify', 'watch']);
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
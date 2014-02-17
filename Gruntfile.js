module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
       src: ["build", "dist"]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
    },
    copy: {
      jquery: {
        dest: 'dist/',
        expand: true,
        cwd: 'bower_components/',
        src: '**',
        flatten: true,
        filter: 'isFile'
      },
      js: {
        dest: 'dist/',
        expand: true,
        cwd: 'js/',
        src: '**',
        flatten: true,
        filter: 'isFile'
      },
      build: {
        dest: 'dist/',
        expand: true,
        cwd: 'build/',
        src: '**',
        flatten: true,
        filter: 'isFile'
      }
    },
    qunit: {     
      all: {
        options: {
          timeout: 20000, 
          urls: [
            'http://localhost:8000/test/test.html'
          ]
        }
      }    
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    less: {
      production: {
        options: {
          paths: ["bower_components/bootstrap/less"],
          yuicompress: true
        },
        files: {
          "css/application.min.css": "_less/application.less"
        }
      }
    },
    htmlmin: {
        site: {
            options: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            },
            files: [{
                expand: true,
                cwd: '_site',
                src: '**/*.html',
                dest: '_site'
            }]
        }
    },
    exec: {
      build: {
        cmd: 'jekyll build'
      },
      serve: {
        cmd: 'jekyll serve --watch'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('test',    ['clean', 'concat', 'uglify', 'copy', 'exec:build', 'connect', 'jshint', 'qunit']);
  grunt.registerTask('build',   ['clean', 'concat', 'uglify', 'copy', 'exec:build']);
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy', 'exec']);
};
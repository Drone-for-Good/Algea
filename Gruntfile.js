exports = function(grunt) {
  //grunt plug-ins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server')
  grunt.loadNpmTasks('grunt-mocha');

  //initial setup
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //clears out Grunt folder
    clean: {
      dist: 'dist/*'
    }

    //copy important stuff into dist:
    copy: {

    }

    //uglify the files
    uglify: {
      //still figuring out how much/which to uglify
    }

    //configure the server
    express: {
      dev: {
        options: {
          script: 'server/server.js'
        }
      }
    }

    //tracks changes in these files while grunt is running
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      client: {
        files: ['client/**'],
        tasks: ['build']
      },
      server: {
        files: ['server/**'],
        tasks: ['build']
        options: {
          spawn: false //Option to restart the server
        }
      }
      tests: {
        files: ['test/**'],
      }
    };
  });

  //build task:
  grunt.registerTask('build', ['clean', 'copy', 'uglify']); //can add jshint

  //run test:
  grunt.registerTask('test', ['tests']);

  //build and watch files:
  grunt.registerTask('default', ['build', 'express:dev', 'watch']);

};
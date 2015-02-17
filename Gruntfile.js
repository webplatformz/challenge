module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),



        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['lib/**/*.js', 'test/**/*.js']
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false
            },
            all: {src: ['test/game/**/*.js']},
            integration: {src: ['test/communication/**/*.js']}

        },
        watch: {
            lib: {
                files: 'lib/**/*.js',
                tasks: ['simplemocha', 'jshint']
            },
            test: {
                files: 'test/**/*.js',
                tasks: ['simplemocha', 'jshint']
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['simplemocha', 'jshint']);
};

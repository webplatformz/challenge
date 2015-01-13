module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            jshintrc: ".jshintrc",
            all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false
            },
            all: {src: ['test/**/*.js']}
        },
        watch: {
            lib: {
                files: 'lib/**/*.js',
                tasks: ['simplemocha']
            },
            test: {
                files: 'test/**/*.js',
                tasks: ['simplemocha']
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['simplemocha']);
};

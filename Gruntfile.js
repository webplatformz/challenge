'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["./build"],

        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        "expand": true,
                        "cwd": "./",
                        "src": ["server.js"],
                        "dest": "./build/",
                        "ext": ".js"
                    },
                    {
                        "expand": true,
                        "cwd": "./lib/",
                        "src": ["**/*.js"],
                        "dest": "./build/lib/",
                        "ext": ".js"
                    },
                    {
                        "expand": true,
                        "cwd": "./test/",
                        "src": ["**/*.js"],
                        "dest": "./build/test/",
                        "ext": ".js"
                    }
                ]
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            all: ['lib/**/*.js', 'test/**/*.js', '*.js']
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false
            },
            all: {src: ['build/test/game/**/*.js']},
            integration: {src: ['build/test/communication/**/*.js']}

        },
        sync: {
            main: {
                files: [{
                        expand: true,
                        cwd: './',
                        src: '*.html',
                        dest: 'build/',
                        filter: 'isFile'
                    }, {
                        expand: true,
                        cwd: './',
                        src: 'img/**/*',
                        dest: 'build/'
                    }
                ]
            }
        },
        watch: {
            sync: {
                files: './*.html,./img/**/*',
                tasks: ['sync']
            },
            babel: {
                files: ['./**/*.js', '!./build/**/*.js'],
                tasks: ['clean', 'babel', 'simplemocha', 'jshint']
            }
        },
        nodemon: {
            dev: {
                script: 'build/server.js'
            }
        },
        concurrent: {
            dev: ['babel', 'sync', 'nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Test task executes mocka tests and runs jshint
    grunt.registerTask('test', ['clean', 'babel', 'simplemocha', 'jshint']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['clean', 'babel', 'concurrent:dev']);

    // start server
    grunt.registerTask('start', ['clean', 'babel']);
};

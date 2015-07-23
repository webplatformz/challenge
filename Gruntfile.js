'use strict';

module.exports = function (grunt) {

    var babelify = require('babelify'),
        reactify = require('reactify');

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
                        "cwd": "./server/",
                        "src": ["**/*.js"],
                        "dest": "./build/server/",
                        "ext": ".js"
                    },
                    {
                        "expand": true,
                        "cwd": "./shared/",
                        "src": ["**/*.js"],
                        "dest": "./build/shared/",
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
        browserify: {
            options: {
                transform: [reactify, babelify]
            },
            all: {
                files: {
                    'build/client/scripts/app.js': ['client/scripts/app.js'],
                    'build/client/scripts/react.js': ['client/scripts/react.js']
                }
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            all: ['server/**/*.js', 'test/**/*.js', '*.js']
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false
            },
            all: {src: ['build/test/**/*.js']}
        },
        sync: {
            main: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: 'client/**/*.html',
                    dest: 'build/'
                }, {
                    expand: true,
                    cwd: './',
                    src: 'client/images/**/*',
                    dest: 'build/'
                }, {
                    expand: true,
                    cwd: './',
                    src: 'client/styles/**/*.css',
                    dest: 'build/'
                }, {
                    expand: true,
                    cwd: './',
                    src: 'client/scripts/react/*.js',
                    dest: 'build/'
                }
                ]
            }
        },
        watch: {
            sync: {
                files: ['./client/**/*.html', './client/images/**/*', './client/**/*.css'],
                tasks: ['sync']
            },
            babel: {
                files: ['./server/**/*.js', './shared/**/*.js', './test/**/*.js', './server.js'],
                tasks: ['jshint', 'babel']
            },
            browserify: {
                files: ['./client/**/*.js', './shared/**/*.js'],
                tasks: ['jshint', 'browserify']
            },
            test: {
                files: ['./build/**/*.js'],
                tasks: ['simplemocha']
            }
        },
        nodemon: {
            dev: {
                script: './build/server.js',
                options: {
                    env: {
                        DEBUG: 'true'
                    }
                }
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
    grunt.registerTask('test', ['clean', 'babel', 'browserify', 'simplemocha', 'jshint']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['clean', 'babel', 'browserify', 'sync', 'concurrent:dev']);

    // start server
    grunt.registerTask('build', ['clean', 'babel', 'browserify', 'sync']);
};

'use strict';

module.exports = function (grunt) {

    var babelify = require('babelify');

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
                    },
                    {
                        "expand": true,
                        "cwd": "./client/",
                        "src": ["js/**/*.js"],
                        "dest": "./build/client/",
                        "ext": ".js"
                    },
                    {
                        "expand": true,
                        "cwd": "./client/",
                        "src": ["js/**/*.jsx"],
                        "dest": "./build/client/",
                        "ext": ".jsx"
                    }
                ]
            }
        },
        browserify: {
            options: {
                transform: [babelify]
            },
            all: {
                files: {
                    'build/client/js/react.js': ['client/js/react.js']
                }
            }
        },
        less: {
            development: {
                files: {
                    './build/client/styles/main.css': './client/styles/main.less'
                }
            }
        },
        'jshint-jsx': {
            options: {
                jshintrc: true,
                convertJSX: true
            },
            all: [
                'client/**/*.js',
                'shared/**/*.js',
                'server/**/*.js',
                'test/**/*.js'
            ]
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false
            },
            all: {
                src: [
                    'build/test/**/*.js',
                    '!build/test/client/**/*.js'
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'test/client/karma.conf.js',
                options: {
                    files: [
                        'build/client/js/+polyfills.js',
                        'build/test/client/**/*.js'
                    ],
                    exclude: ['build/test/client/karma.conf.js']
                },
                singleRun: true
            }
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
                }]
            }
        },
        watch: {
            sync: {
                files: ['./client/**/*.html', './client/images/**/*'],
                tasks: ['sync'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['./client/styles/**/*.less'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
            babel: {
                files: ['./server/**/*.js', './shared/**/*.js', './test/**/*.js', './server.js'],
                tasks: ['jshint-jsx', 'babel']
            },
            browserify: {
                files: ['./client/**/*.js', './client/**/*.jsx', './shared/**/*.js'],
                tasks: ['jshint-jsx', 'browserify'],
                options: {
                    livereload: true
                }
            },
            serverTests: {
                files: [
                    './server/**/*.js',
                    './shared/**/*.js',
                    './test/server/**/*.js'
                ],
                tasks: ['simplemocha']
            },
            frontendTests: {
                files: [
                    './client/**/*.js',
                    './shared/**/*.js',
                    './test/client/**/*.js'
                ],
                tasks: ['karma']
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
            dev: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Test task executes mocka tests and runs jshint
    grunt.registerTask('test', ['build', 'simplemocha', 'karma']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['build', 'concurrent:dev']);

    // start server
    grunt.registerTask('build', ['jshint-jsx', 'clean', 'babel', 'browserify', 'less', 'sync']);

};

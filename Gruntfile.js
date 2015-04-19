module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
                        "dest": "./dist/",
                        "ext": ".js"
                    },

                    {
                        "expand": true,
                        "cwd": "./lib/",
                        "src": ["**/*.js"],
                        "dest": "./dist/lib/",
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
        },
        nodemon: {
            dev: {
                script: 'dist/server.js'
            }
        },
        concurrent: {
            dev: ["nodemon", "watch"],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Test task executes mocka tests and runs jshint
    grunt.registerTask('test', ['simplemocha', 'jshint']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['concurrent:dev']);
};

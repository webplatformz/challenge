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
            all: ['lib/**/*.js', 'test/**/*.js']
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
                expand: true,
                cwd: './',
                src: '*.html',
                dest: 'build/',
                filter: 'isFile'
            }
        },
        watch: {
            sync: {
                files: './*.html',
                tasks: ['sync']
            },
            babel: {
                files: './**/*.js',
                tasks: ['babel', 'simplemocha', 'jshint']
            }
        },
        nodemon: {
            dev: {
                script: 'build/server.js'
            }
        },
        concurrent: {
            dev: ['nodemon', 'babel', 'sync', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Test task executes mocka tests and runs jshint
    grunt.registerTask('test', ['babel', 'simplemocha', 'jshint']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['babel', 'concurrent:dev']);
};

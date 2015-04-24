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
                    },
                    {
                        "expand": true,
                        "cwd": "./test/",
                        "src": ["**/*.js"],
                        "dest": "./dist/test/",
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
            all: {src: ['dist/test/game/**/*.js']},
            integration: {src: ['dist/test/communication/**/*.js']}

        },
        sync: {
            main: {
                expand: true,
                cwd: './',
                src: '*.html',
                dest: 'dist/',
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
                tasks: ['babel']
            },
            lib: {
                files: 'dist/lib/**/*.js',
                tasks: ['simplemocha', 'jshint']
            },
            test: {
                files: 'dist/test/**/*.js',
                tasks: ['simplemocha', 'jshint']
            }
        },
        nodemon: {
            dev: {
                script: 'dist/server.js'
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
    grunt.registerTask('test', ['babel', 'simplemocha', 'jshint']);

    // Default task executes concurrent target. Watching for changes to execute tests and restart server.
    grunt.registerTask('default', ['babel', 'concurrent:dev']);
};

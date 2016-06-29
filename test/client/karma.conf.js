

module.exports = function(config) {
    config.set({
        basePath: '../../',

        singleRun: true,

        frameworks: [
            'browserify',
            'mocha'
        ],

        reporters: [
            'mocha'
        ],

        preprocessors: {
            './test/client/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [
                ['babelify']
            ]
        },

        browsers: [
            'PhantomJS'
        ],

        files: [
            './node_modules/babel-polyfill/dist/polyfill.js',
            './test/client/**/*.js'
        ],

        exclude: [
            './test/client/karma.conf.js'
        ],

        plugins: [
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-browserify',
            'karma-mocha-reporter'
        ]
    });
};

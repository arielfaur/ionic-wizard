module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'bower_components/ionic/js/ionic.bundle.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'dist*/**/*.js',
      'tests*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

});
};

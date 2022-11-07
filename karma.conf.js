// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// TFS Intergration
// https://isaacmartinezblog.wordpress.com/2018/04/02/angular-code-coverage-in-sonar-qube-and-vsts/

// ChromeHeadless from Puppeteer
// https://github.com/karma-runner/karma-chrome-launcher

// Set Env for ChromeHeadless from puppeteer
process.env.CHROME_BIN = require('puppeteer').executablePath();
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressWarnSummary: true, // do not print warn summary
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: true, // do not print information about passed tests
      suppressSkipped: true, // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('puppeteer')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },

    files: [],
    preprocessors: {},
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    junitReporter: {
      outputDir: '../../coverage', // results will be saved as $outputDir/$browserName.xml
      useBrowserName: false, // add browser name to report and classes names
      outputFile: 'TEST-loads-ui-report.xml' // if included, results will be saved as $outputDir/$browserName/$outputFile
    },
    coverageReporter: {
      dir: '../../coverage',
      subdir: 'loads-ui',
      fixWebpackSourcePaths: true,
      reporters: [
        { type: 'lcovonly', file: 'lcov.info' },
        { type: 'lcov' }
      ]
    },
    reporters: ['junit', 'coverage', 'progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_security'],
    // you can define custom flags
    customLaunchers: {
      Chrome_without_security: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-translate',
          '--disable-extensions',
        ],
      }
    },
    singleRun: false,
    restartOnFileChange: true,
    captureTimeout: 2100000,
    browserDisconnectTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 2100000,
    reportSlowerThan: 100,
    browserConsoleLogOptions: { level: 'debug', terminal: false }
  });
};

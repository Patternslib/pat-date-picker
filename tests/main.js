/* jshint sub: true */
/* global config */
//
config.paths["jasmine"] =        "bower_components/jasmine/lib/jasmine-core/jasmine";
config.paths["jasmine-html"] =   "bower_components/jasmine/lib/jasmine-core/jasmine-html";
config.paths["console-runner"] = "../node_modules/phantom-jasmine/lib/console-runner";
config.shim['jasmine-html'] = {
    deps: ['jasmine'],
    exports: 'jasmine'
};

require.config(config);

require([
    "jquery",
    "jasmine-html",
    "jquery.browser"
    ], function($, jasmine) {
        require([
            "console-runner",
            "../tests/specs/date-picker"
        ], function() {
            var jasmineEnv = jasmine.getEnv();
            var reporter;
            if (/PhantomJS/.test(navigator.userAgent)) {
                reporter = new jasmine.ConsoleReporter();
                window.console_reporter = reporter;
                jasmineEnv.addReporter(reporter);
                jasmineEnv.updateInterval = 0;
            } else {
                reporter = new jasmine.HtmlReporter();
                jasmineEnv.addReporter(reporter);
                jasmineEnv.specFilter = function(spec) {
                    return reporter.specFilter(spec);
                };
                jasmineEnv.updateInterval = 0; // Make this more to see what's happening
            }
            jasmineEnv.execute();
        });
    }
);

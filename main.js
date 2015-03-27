var config;
if (typeof(require) === 'undefined') {
    /* XXX: Hack to work around r.js's stupid parsing.
     * We want to save the configuration in a variable so that we can reuse it in
     * tests/main.js.
     */
    require = { config: function (c) { config = c; } };
}
require.config({
    baseUrl: "src",
    paths: {
        "i18n":                 "bower_components/patternslib/src/core/i18n",
        "jquery":               "bower_components/jquery/dist/jquery",
        "jquery.browser":       "bower_components/jquery.browser/dist/jquery.browser",
        "logging":              "bower_components/logging/src/logging",
        "pat-autosuggest":      "bower_components/patternslib/src/pat/autosuggest",
        "pat-base":             "bower_components/patternslib/src/core/base",
        "pat-compat":           "bower_components/patternslib/src/core/compat",
        "pat-jquery-ext":       "bower_components/patternslib/src/core/jquery-ext",
        "pat-logger":           "bower_components/patternslib/src/core/logger",
        "pat-parser":           "bower_components/patternslib/src/core/parser",
        "pat-registry":         "bower_components/patternslib/src/core/registry",
        "pat-utils":            "bower_components/patternslib/src/core/utils",
        "patterns":             "bower_components/patternslib/bundle",
        "picker":               "bower_components/pickadate/lib/picker",
        "picker.date":          "bower_components/pickadate/lib/picker.date",
        "picker.time":          "bower_components/pickadate/lib/picker.time",
        "select2":              "bower_components/select2/select2"
    },

    "shim": {
        "logging": { "exports": "logging" }
    }
});

if (typeof(require) === 'function') {
    require(["pat-registry", "pat-date-picker", "jquery.browser"], function(registry, editor) {
        window.patterns = registry;
        // workaround this MSIE bug :
        // https://dev.plone.org/plone/ticket/10894
        if ($.browser.msie) {
            $("#settings").remove();
        }
        window.Browser = {};
        window.Browser.onUploadComplete = function () {};
        registry.init();
        return;
    });
}

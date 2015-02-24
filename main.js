require.config({
    baseUrl: "src",
    paths: {
        "i18n":                 "bower_components/patternslib/src/core/i18n",
        "jquery":               "bower_components/jquery/dist/jquery",
        "jquery.browser":       "bower_components/jquery.browser/dist/jquery.browser",
        "logging":              "bower_components/logging/src/logging",
        "pat-autosuggest":      "bower_components/patternslib/src/pat/autosuggest",
        "pat-compat":           "bower_components/patternslib/src/core/compat",
        "pat-jquery-ext":       "bower_components/patternslib/src/core/jquery-ext",
        "pat-logger":           "bower_components/patternslib/src/core/logger",
        "pat-parser":           "bower_components/patternslib/src/core/parser",
        "mockup-parser":        "bower_components/mockup-core/js/parser",
        "mockup-patterns-base": "bower_components/mockup-core/js/pattern",
        "pat-registry":         "bower_components/patternslib/src/core/registry",
        "pat-utils":            "bower_components/patternslib/src/core/utils",
        "patterns":             "bower_components/patternslib/bundle",
        "picker":               "bower_components/pickadate/lib/picker",
        "picker.date":          "bower_components/pickadate/lib/picker.date",
        "picker.time":          "bower_components/pickadate/lib/picker.time",
        "select2":              "bower_components/select2/select2"
    },

    "shim": {
        "logging": { "exports": "logging" },
    }
});

require(["pat-registry", "pat-pickadate", "jquery.browser"], function(registry, upload) {
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


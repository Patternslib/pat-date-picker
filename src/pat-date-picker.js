(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
           'jquery',
           'pat-base',
           "pat-registry",
           "pat-parser",
           'picker',
           'picker.date',
           'picker.time',
           'pat-autosuggest',
           'i18n',
           'modernizr'
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        factory($, Base, root.patterns, root.patterns.Parser, Picker, PickerDate, PickerTime, Autosuggest, _t);
    }
}(this, function($, Base, registry, Parser, Picker, PickerDate, PickerTime, patternSelect2, _t) {
    'use strict';
    var parser = new Parser("date-picker");
    parser.addArgument("class-date-name",'pattern-pickadate-date');
    parser.addArgument("class-date-wrapper-name",'pattern-pickadate-date-wrapper');
    parser.addArgument("class-separator-name", 'pattern-pickadate-separator');
    parser.addArgument("class-time-name",'pattern-pickadate-time');
    parser.addArgument("class-time-wrapper-name",'pattern-pickadate-time-wrapper');
    parser.addArgument("class-wrapper-name",'pattern-pickadate-wrapper');
    parser.addArgument("date", { selectYears: true, selectMonths: true });
    parser.addArgument("separator", ' '); // Separator between date and time if both are enabled.
    parser.addArgument("show", ["date", "time"], ["date", "time", "timezone", "polyfill"], true);
    parser.addArgument("behavior", [], ["polyfill"], true);
    parser.addArgument("time", {}); // Configure the time value shown
    parser.addArgument("timezone", {});

    parser.addAlias("behaviour", "behavior");

    return Base.extend({
        name: 'date-picker',
        trigger: ".pat-date-picker",
        parser: "patternslib",

        init: function patPickadateInit ($el, opts) {
            var value = this.$el.val().split(' '),
                dateValue = value[0] || '',
                timeValue = value[1] || '';

            this.options = $.extend(this.options, parser.parse(this.$el, opts));
            this.polyfill = this.options.behavior.indexOf('polyfill') > -1;
            if (this.polyfill && Modernizr.inputtypes.date) { return; }


            this.showDate = this.options.show.indexOf('date') > -1;
            this.showTime = this.options.show.indexOf('time') > -1;
            this.showTimeZone = this.options.show.indexOf('timezone') > -1;

            if (!this.showDate) { timeValue = value[0]; }
            this.$el.hide();

            this.$wrapper = $('<div/>')
                    .addClass(this.options.class['wrapper-name'])
                    .insertAfter(this.$el);

            if (this.showDate) {
                this.options.date.formatSubmit = 'yyyy-mm-dd';
                this.$date = $('<input type="text"/>')
                    .attr('placeholder', this.options.placeholderDate)
                    .attr('data-value', dateValue)
                    .addClass(this.options.class['date-name'])
                    .appendTo($('<div/>')
                            .addClass(this.options.class['date-wrapper-name'])
                            .appendTo(this.$wrapper))
                    .pickadate($.extend(true, {}, this.options.date, {
                        onSet: function(e) {
                            if (e.select !== undefined) {
                                this.$date.attr('data-value', e.select);
                                if (this.showTime || (this.$time && this.$time.attr('data-value') !== '')) {
                                    this.updateValue.call(this, this.$el);
                                }
                            }
                            if (e.hasOwnProperty('clear')) {
                                this.$el.removeAttr('value');
                                this.$date.attr('data-value', '');
                            }
                        }.bind(this)
                    }));
            }

            if (this.showDate && this.showTime) {
                this.$separator = $('<span/>')
                    .addClass(this.options.class['separator-name'])
                    .html(this.options.separator === ' ' ? '&nbsp;': this.options.separator)
                    .appendTo(this.$wrapper);
            }

            if (this.showTime) {
                this.options.time.formatSubmit = 'HH:i';
                this.$time = $('<input type="text"/>')
                    .attr('placeholder', this.options.placeholderTime)
                    .attr('data-value', timeValue)
                    .addClass(this.options.class['time-name'])
                    .appendTo($('<div/>')
                            .addClass(this.options.class['time-wrapper-name'])
                            .appendTo(this.$wrapper))
                    .pickatime($.extend(true, {}, this.options.time, {
                        onSet: function(e) {
                            if (e.select !== undefined) {
                                this.$time.attr('data-value', e.select);
                                if (this.showDate || (this.$date && this.$date.attr('data-value') !== '')) {
                                    this.updateValue.call(this);
                                }
                            }
                            if (e.hasOwnProperty('clear')) {
                                this.$el.removeAttr('value');
                                this.$time.attr('data-value', '');
                            }
                        }.bind(this)
                    }));

                // XXX: bug in pickatime
                // work around pickadate bug loading 00:xx as value
                if (typeof(timeValue) === 'string' && timeValue.substring(0,2) === '00') {
                    this.$time.pickatime('picker').set('select', timeValue.split(':'));
                    this.$time.attr('data-value', timeValue);
                }
            }

            if (this.showDate && this.showTime && this.showTimeZone) {
                this.$separator = $('<span/>')
                    .addClass(this.options.class['separator-name'])
                    .html(this.options.separator === ' ' ? '&nbsp;'
                                                                                                : this.options.separator)
                    .appendTo(this.$wrapper);
            }

            if (this.showTimeZone) {
                this.$timezone = $('<input type="text" class="pat-autosuggest" />')
                    .addClass(this.options.classTimezoneName)
                    .attr('placeholder', this.options.placeholderTimezone)
                    .attr('data-pat-autosuggest',
                            'words-json: '+ (JSON.stringify(this.options.timezone.data) || "") +
                            '; pre-fill: '+ (this.options.timezone.default || "") +
                            '; maximum-selection-size: 1')
                    .appendTo($('<div/>')
                        .addClass(this.options.classTimezoneWrapperName)
                        .appendTo(this.$wrapper))
                    .on('change', function(e) {
                        if (e.val !== undefined){
                            this.$timezone.attr('data-value', e.val);
                            if ((this.options.date === false || this.$date.attr('data-value') !== '') &&
                                    (this.options.time === false || this.$time.attr('data-value') !== '')) {
                                this.updateValue.call(this);
                            }
                        }
                    }.bind(this));
                registry.scan(this.$timezone.parent(), ['autosuggest']);

                var defaultTimezone = this.options.timezone.default;
                // if timezone has a default value included
                if (defaultTimezone) {
                    var isInList;
                    // the timezone list contains the default value
                    this.options.timezone.data.forEach(function(obj) {
                        isInList = (obj.text === this.options.timezone.default) ? true : false;
                    }.bind(this));
                    if (isInList) {
                        this.$timezone.attr('data-value', defaultTimezone);
                        this.$timezone.parent().find('.select2-chosen').text(defaultTimezone);
                    }
                }
                // if data contains only one timezone this value will be chosen
                // and the timezone dropdown list will be disabled and
                var data = this.options.timezone.data;
                if (data && data.length === 1) {
                    this.$timezone.attr('data-value', data[0].text);
                    this.$timezone.parent().find('.select2-chosen').text(data[0].text);
                    this.$timezone.select2('enable', false);
                }
            }

            this.$clear = $('<div/>')
                .addClass(this.options.classClearName)
                .appendTo(this.$wrapper);
        },

        updateValue: function() {
            var value = '';

            if (this.showDate) {
                var date = this.$date.data('pickadate').component,
                    dateValue = this.$date.data('pickadate').get('select'),
                    formatDate = date.formats.toString;
                if (dateValue) {
                    value += formatDate.apply(date, ['yyyy-mm-dd', dateValue]);
                }
            }

            if (this.showTime) {
                if (this.showDate) { value += ' '; }
                var time = this.$time.data('pickatime').component,
                        timeValue = this.$time.data('pickatime').get('select'),
                        formatTime = time.formats.toString;
                if (timeValue) {
                    value += formatTime.apply(time, ['HH:i', timeValue]);
                }
            }
            if (this.showTimeZone) {
                var timezone = ' ' + this.$timezone.attr('data-value');
                if (timezone) { value += timezone; }
            }
            this.$el.attr('value', value);
            this.$el.trigger('updated');
        }
    });
}));

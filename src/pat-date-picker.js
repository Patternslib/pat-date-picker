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
            'i18n'
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        factory($, Base, root.patterns, root.patterns.Parser, Picker, PickerDate, PickerTime, Autosuggest, _t);
    }
}(this, function($, Base, registry, Parser, Picker, PickerDate, PickerTime, patternSelect2, _t) {
  'use strict';
  var parser = new Parser("date-picker");
  parser.add_argument("class-wrapper-name",'pattern-pickadate-wrapper');
  parser.add_argument("class-date-name",'pattern-pickadate-date');
  parser.add_argument("class-date-wrapper-name",'pattern-pickadate-date-wrapper');
  parser.add_argument("class-time-name",'pattern-pickadate-time');
  parser.add_argument("class-time-wrapper-name",'pattern-pickadate-time-wrapper');
  parser.add_argument("class-separator-name", 'pattern-pickadate-separator');
  parser.add_argument("date", { selectYears: true, selectMonths: true });
  parser.add_argument("separator", ' '); // Separator between date and time if both are enabled.
  parser.add_argument("show-date", true);
  parser.add_argument("show-time", true);
  parser.add_argument("show-timezone", false);
  parser.add_argument("time", {}); // Configure the time value shown
  parser.add_argument("timezone", {});

  return Base.extend({
    name: 'date-picker',
    trigger: ".pat-date-picker",
    parser: "patternslib",

    init: function patPickadateInit ($el, opts) {
      var self = this,
          value = self.$el.val().split(' '),
          dateValue = value[0] || '',
          timeValue = value[1] || '';

      self.options = $.extend(self.options, parser.parse(self.$el, opts));
      if (self.options.show.date === false) {
        timeValue = value[0];
      }
      self.$el.hide();

      self.$wrapper = $('<div/>')
            .addClass(self.options.class['wrapper-name'])
            .insertAfter(self.$el);

      if (self.options.show.date !== false) {
        self.options.date.formatSubmit = 'yyyy-mm-dd';
        self.$date = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderDate)
              .attr('data-value', dateValue)
              .addClass(self.options.class['date-name'])
              .appendTo($('<div/>')
                  .addClass(self.options.class['date-wrapper-name'])
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, {}, self.options.date, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$date.attr('data-value', e.select);
                    if (self.options.show.time === false ||
                        self.$time.attr('data-value') !== '') {
                      self.updateValue.call(self, self.$el);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.removeAttr('value');
                    self.$date.attr('data-value', '');
                  }
                }
              }));
      }

      if (self.options.show.date !== false && self.options.show.time !== false) {
        self.$separator = $('<span/>')
              .addClass(self.options.class['separator-name'])
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.show.time !== false) {
        self.options.time.formatSubmit = 'HH:i';
        self.$time = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderTime)
              .attr('data-value', timeValue)
              .addClass(self.options.class['time-name'])
              .appendTo($('<div/>')
                  .addClass(self.options.class['time-wrapper-name'])
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, {}, self.options.time, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$time.attr('data-value', e.select);
                    if (self.options.show.date === false ||
                        self.$date.attr('data-value') !== '') {
                      self.updateValue.call(self);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.removeAttr('value');
                    self.$time.attr('data-value', '');
                  }
                }
              }));

        // XXX: bug in pickatime
        // work around pickadate bug loading 00:xx as value
        if (typeof(timeValue) === 'string' && timeValue.substring(0,2) === '00') {
          self.$time.pickatime('picker').set('select', timeValue.split(':'));
          self.$time.attr('data-value', timeValue);
        }
      }

      if (self.options.show.date !== false && self.options.show.time !== false && self.options.timezone) {
        self.$separator = $('<span/>')
              .addClass(self.options.class['separator-name'])
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.show.timezone) {
        self.$timezone = $('<input type="text" class="pat-autosuggest" />')
          .addClass(self.options.classTimezoneName)
          .attr('placeholder', self.options.placeholderTimezone)
          .attr('data-pat-autosuggest',
              'words-json: '+ (JSON.stringify(self.options.timezone.data) || "") +
              '; pre-fill: '+ (self.options.timezone.default || "") +
              '; maximum-selection-size: 1')
          .appendTo($('<div/>')
            .addClass(self.options.classTimezoneWrapperName)
            .appendTo(self.$wrapper))
          .on('change', function(e) {
            if (e.val !== undefined){
              self.$timezone.attr('data-value', e.val);
              if ((self.options.date === false || self.$date.attr('data-value') !== '') &&
                  (self.options.time === false || self.$time.attr('data-value') !== '')) {
                self.updateValue.call(self);
              }
            }
          });
        registry.scan(self.$timezone.parent(), ['autosuggest']);

        var defaultTimezone = self.options.timezone.default;
        // if timezone has a default value included
        if (defaultTimezone) {
          var isInList;
          // the timezone list contains the default value
          self.options.timezone.data.forEach(function(obj) {
            isInList = (obj.text === self.options.timezone.default) ? true : false;
          });
          if (isInList) {
            self.$timezone.attr('data-value', defaultTimezone);
            self.$timezone.parent().find('.select2-chosen').text(defaultTimezone);
          }
        }
        // if data contains only one timezone this value will be chosen
        // and the timezone dropdown list will be disabled and
        var data = self.options.timezone.data;
        if (data && data.length === 1) {
          self.$timezone.attr('data-value', data[0].text);
          self.$timezone.parent().find('.select2-chosen').text(data[0].text);
          self.$timezone.select2('enable', false);
        }
      }

      self.$clear = $('<div/>')
        .addClass(self.options.classClearName)
        .appendTo(self.$wrapper);
    },

    updateValue: function() {
      var self = this,
          value = '';

      if (self.options.show.date !== false) {
        var date = self.$date.data('pickadate').component,
            dateValue = self.$date.data('pickadate').get('select'),
            formatDate = date.formats.toString;
        if (dateValue) {
          value += formatDate.apply(date, ['yyyy-mm-dd', dateValue]);
        }
      }

      if (self.options.show.date !== false && self.options.show.time !== false) {
        value += ' ';
      }

      if (self.options.show.time !== false) {
        var time = self.$time.data('pickatime').component,
            timeValue = self.$time.data('pickatime').get('select'),
            formatTime = time.formats.toString;
        if (timeValue) {
          value += formatTime.apply(time, ['HH:i', timeValue]);
        }
      }

      if (self.options.timezone.length) {
        var timezone = ' ' + self.$timezone.attr('data-value');
        if (timezone) {
          value += timezone;
        }
      }
      self.$el.attr('value', value);
      self.$el.trigger('updated');
    }
  });
}));

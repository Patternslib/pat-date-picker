define([
    'pat-date-picker',
    'jquery'
], function (pattern, $) {

    describe("pat-date-picker", function () {

        beforeEach(function () {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function () {
            $("#lab").remove();
        });

        it("Initialise Pickadate", function () {
            $("#lab").html(
                "<input class='pat-date-picker'/>");
            var $date = $("#lab input");
            spyOn($.fn, "pickadate").andCallThrough();
            pattern.init($date);
            expect($.fn.pickadate).toHaveBeenCalled();
        });

        it("Pickadate HTML Code added", function () {
            $("#lab").html(
                "<input class='pat-date-picker'/>");
            var $date = $("#lab input");
            pattern.init($date);
            expect($date.parent()[0].lastChild.className).toBe("pattern-pickadate-wrapper");
        });

        it("date and time element", function () {
            $("#lab").html(
                "<input class='pat-date-picker'/>");
            var $date = $("#lab input");
            var $date_root = $date.parent();
            pattern.init($date);

            var dateWrapper = $('.pattern-pickadate-date', $date_root).parent(),
                timeWrapper = $('.pattern-pickadate-time', $date_root).parent();

            // main element is hidden
            expect($date.is(':hidden')).toBe(true);

            // date and time inputs are there by default
            expect($('.pattern-pickadate-date', $date_root).size()).toEqual(1);
            expect($('.pattern-pickadate-time', $date_root).size()).toEqual(1);

            // no value on main element
            expect($date.val()).toBe('');

            // no picker is open
            expect(dateWrapper.find('.picker--opened').size()).toEqual(0);
            expect(timeWrapper.find('.picker--opened').size()).toEqual(0);

            // we open date picker (calendar)
            $('.pattern-pickadate-date', $date_root).click();

            // date picker should be opened but not time picker
            expect(dateWrapper.find('.picker--opened').size()).toEqual(1);
            expect(timeWrapper.find('.picker--opened').size()).toEqual(0);

            // select some date
            var $selectedDate = dateWrapper.find('td > div').first().click();

            // selected date should be saved on date picker element
            expect($('.pattern-pickadate-date', $date_root).attr('data-value')).toEqual($selectedDate.attr('data-pick'));

            // we open time picker
            $('.pattern-pickadate-time', $date_root).click();

            // time picker should be opened but not date picker
            expect(dateWrapper.find('.picker--opened').size()).toEqual(0);
            expect(timeWrapper.find('.picker--opened').size()).toEqual(1);

            // select some time
            var $selectedTime = timeWrapper.find('li').first().next().click();

            // selected time should be saved on time picker element
            expect($('.pattern-pickadate-time', $date_root).attr('data-value')).toEqual($selectedTime.attr('data-pick'));

            // main element should now have value
            expect($('.pat-pickadate', $date_root).val()).not.toBe('');

            // clearing time ...
            $('.picker__button--clear', timeWrapper).click();

            // ... should remove value from main element
            expect($date.val()).toEqual('');

            // select time again
            $selectedTime = timeWrapper.find('li').first().next().click();

            // main element should now have again value
            expect($('.pat-pickadate', $date_root).val()).not.toBe('');

            // clearing date ...
            $('.pattern-pickadate-date', $date_root).click();
            $('.pattern-pickadate-date', $date_root).click();
            $('.picker__button--clear', dateWrapper).click();

            // ... should also remove value from main element
            expect($date.val()).toEqual('');

            // selecting time again ...
            $selectedTime = timeWrapper.find('li').first().next().click();

            // ... should still keep main element value empty since date picker is
            // cleared
            // FIXME: is this a pickadate or pattern issue?
            // expect($date.val()).toEqual('');
        });

        it('date and time picker except custom settings', function () {
            $("#lab").html(
                "<input class='pat-date-picker'/>");
            var $date = $("#lab input");
            var $date_root = $date.parent();

            // custom settings for date and time widget
            $date.attr(
                'data-pat-date-picker',
                JSON.stringify({
                    date: {
                        selectYears: false,
                        selectMonths: false
                    },
                    time: {
                        interval: 60
                    }
                })
            );

            // scan dom for patterns
            pattern.init($date);
            // there are not dropdowns to select year or month
            expect($('.pattern-pickadate-date', $date_root).parent().find('.picker__select--year').size()).toEqual(0);
            expect($('.pattern-pickadate-date', $date_root).parent().find('.picker__select--month').size()).toEqual(0);
        });

        it('only date element', function () {
            $("#lab").html(
                "<input class='pat-date-picker'/>");
            var $date = $("#lab input");
            var $date_root = $date.parent();

            // Only date picker
            $date.attr('data-pat-date-picker', 'show: date');

            // pickadate is not initialized
            expect($('.pattern-pickadate-wrapper', $date_root).size()).toEqual(0);

            // scan dom for patterns
            pattern.init($date);

            // pickadate is initialized
            expect($('.pattern-pickadate-wrapper', $date_root).size()).toEqual(1);

            var dateWrapper = $('.pattern-pickadate-date', $date_root).parent();

            // main element is hidden
            expect($date.is(':hidden')).toBe(true);

            // date input is there by default
            expect($('.pattern-pickadate-date', $date_root).size()).toEqual(1);
            expect($('.pattern-pickadate-time', $date_root).size()).toEqual(0);

            // no value on main element
            expect($date.val()).toBe('');

            // date picker is not open
            expect(dateWrapper.find('.picker--opened').size()).toEqual(0);

            // we open date picker (calendar)
            $('.pattern-pickadate-date', $date_root).click();

            // date picker should be opened
            expect(dateWrapper.find('.picker--opened').size()).toEqual(1);

            // select some date
            var $selectedDate = dateWrapper.find('td > div').first().click();

            // selected date should be saved on date picker element
            expect($('.pattern-pickadate-date', $date_root).attr('data-value')).toEqual($selectedDate.attr('data-pick'));

            // and also on main element since time element is disabled
            expect($('.pattern-pickadate-date', $date_root).val()).not.toBe('');

            // clearing date ...
            $('.pattern-pickadate-date', $date_root).click();
            $('.pattern-pickadate-date', $date_root).click();
            $('.picker__button--clear', dateWrapper).click();

            // ... should also remove value from main element
            expect($('.pattern-pickadate-date', $date_root).val()).toEqual('');
        });
    });
});


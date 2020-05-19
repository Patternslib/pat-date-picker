##pat-date-picker

---

**Note: deprecated pattern**

This pattern is integrated into Patterns directly.<br>
Please use the pattern at: https://github.com/Patternslib/Patterns/tree/master/src/pat/date-picker

---

A Patternslib pattern which wraps the [Pickadate](http://amsul.ca/pickadate.js/) library.

##demo

To view a demo of how this pattern works, clone the repository:

    git clone https://github.com/Patternslib/pat-date-picker

The run the Makefile:

    make

And then in your browser open: http://localhost:4001

## Documentation

Property                | Type   | Default Value                              | Available values      | Description
------------------------|--------|--------------------------------------------|-----------------------|---------------------------------------------------
date                    | JSON   | { selectYears: true, selectMonths: true }) |                       | Date widget options described here. If false is selected date picker wont be shown.
separator               | string |                                            |                       | Separator between date and time if both are enabled.
show                    | list   | date, time                                 | date, time, timezone  | Which elements of the date picker should be shown?
behavior (or behaviour) | list   |                                            | polyfill              | Should the picker defer to the browser's HTML5 date support?
time                    | JSON   | {}                                         |                       | Configure the default time value
timezone                | JSON   | {}                                         |                       | Configure the default time zone value

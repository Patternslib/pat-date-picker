##pat-pickadate

A Patternslib pattern which wraps the [Pickadate](http://amsul.ca/pickadate.js/) library.

##demo

To view a demo of how this pattern works, clone the repository:

    git clone https://github.com/Patternslib/pat-masonry.git

The run the Makefile:

    make

And then in your browser open: http://localhost:4001

## Documentation

Property        | Type      | Default Value                                 | Description
----------------|-----------|-----------------------------------------------|---------------------------------------------------
date            | JSON      | { selectYears: true, selectMonths: true })    | Date widget options described here. If false is selected date picker wont be shown.
separator       | string    |  ' '                                          | Separator between date and time if both are enabled.
show-date       | boolean   | true                                          | Should the date input be shown?
show-time       | boolean   | true                                          | Should the time input be shown?
show-timezone   | boolean   | false                                         | Should the time zone input be shown?
time            | JSON      | {}                                            | Configure the default time value
timezone        | JSON      | {}                                            | Configure the default time zone value

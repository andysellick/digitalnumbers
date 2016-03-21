digitalnumbers
==============

Plugin to generate various number counters in a format resembling a digital watch.

Usage
-----

```html
<div id="digitwrapper" class="digitalnumbers"></div>

$(document).ready(function(){
	$('#digitwrapper').digitalnumbers();
});
```

Note: the plugin depends upon moment.js and the readable range plugin, which are included with this repo.

Options
-------

Different options are applicable depending on the mode chosen. See below for more detail.

- **mode**: can be scale, scaleloop, clock, or countdown
- **numMax**: largest number to scale to
- **numMin**: smallest number to scale to
- **startat**: start number
- **increment**: change number by this each iteration
- **dateTarget**: array of year, month, day, hour, minute, second e.g. [2020,2,23,14,25,0]. Used only for countdown mode
- **delay**: delay between the plugin loading and any changes beginning, milliseconds
- **speed**: how fast to change the number, milliseconds
- **direction**: either 1 to increase or -1 to decrease

Scale mode
----------

Scale mode takes an initial number and scales to the target number. Relevant options are:

- startat
- numMax
- increment
- delay
- speed
- direction

The plugin isn't very smart, so if you input a value for startat that is greater than numMax, it'll get confused and use numMax instead. Same for scale loop mode.

Scale loop mode
---------------

Scale loop mode takes an initial number, min and max values and basically loops between them. Relevant options are:

- startat
- numMax
- numMin
- increment
- delay
- speed
- direction

Clock mode
----------

Outputs a simple clock. Ignores all options.

Countdown mode
--------------

Given a date, provides a year/month/day/hour/minute/second countdown to when that date will occur. Note that if you give it a date in the past, it will simply count from that date.

This mode will update in real time based on the format above. If you want a simple number of seconds countdown, use the scale mode and set the increment to one second.

Note that the units are not displayed. Relevant options are:

- dateTarget

Demo at http://www.custarddoughnuts.co.uk/article/2016/3/18/jquery-digital-numbers-plugin


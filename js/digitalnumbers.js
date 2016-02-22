/* https://github.com/andysellick/digitalnumbers */

//timestamp shim for cross browser compatibility
if(!Date.now){
    Date.now = function() { return new Date().getTime(); }
}
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
	};

	Plugin.prototype = {
		init: function(){
			var obj = this;
			obj.timer = 0;
			obj.numCurr = 0;
			obj.numLen = 0;
			obj.dateorder = ['year','month','day','hour','minute','second']; //used to keep track of the order in which to display these things

			this.settings = $.extend({
				numMax: 100,
				numMin: 0,
				startat: 0,
				increment: 1,
				dateTarget: [2020,2,23,14,25,0],
				delay: 500, //delay between the plugin loading and any changes beginning
				speed: 500,
				direction: 1, //either 1 to increase or -1 to decrease
				mode: 'scale', //can be scale, scaleloop, clock, countdown
			}, this.defaults, this.options);

			var functions = {
                general: {
					//begin
					init: function(){
						//we want to show the digits as they should be on load for clock and countdown
						if(obj.settings.mode === 'clock'){
							obj.$elem.addClass('clock');
							obj.numLen = 6;
							obj.numCurr = functions.utility.getCurrentTime();
							functions.markup.createDigits();
							obj.timer = setTimeout(functions.general.clock,500);
						}
						else if(obj.settings.mode === 'countdown'){
							obj.$elem.addClass('clock');
							obj.targ = obj.settings.dateTarget; //fixme need to do sanity check on this value
							obj.targ = new Date(obj.targ[0],obj.targ[1] - 1,obj.targ[2],obj.targ[3],obj.targ[4],obj.targ[5]);
							obj.timeobj = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
							obj.numLen = Object.keys(obj.timeobj).length * 2;
							functions.markup.createDigits();
							functions.general.countDown();
						}
						else {
							obj.numLen = functions.utility.getNumberStrLen(obj.settings.numMax);
							obj.numCurr = obj.settings.startat;
							functions.markup.createDigits();

							if(obj.settings.mode === 'scaleloop'){
								obj.timer = setTimeout(functions.general.scaleNumberLoop,obj.settings.delay);
							}
							else if(obj.settings.mode === 'scale'){
								obj.timer = setTimeout(functions.general.scaleNumber,obj.settings.delay);
							}
						}
					},
					//do initial settings setup and prevent settings abuse, e.g. prevent numbers below zero
                    overrideSettings: function(){
						obj.settings.numMin = Math.max(obj.settings.numMin,0);
						obj.settings.numMax = Math.max(obj.settings.numMax,0);
						obj.settings.numCurr = Math.max(obj.settings.numCurr,0);
						obj.settings.increment = Math.min(obj.settings.increment,1);
						obj.settings.startat = Math.max(0,Math.min(obj.settings.startat,obj.settings.numMax));
						if(obj.settings.direction < 0){
							obj.settings.direction = -1;
						}
						else {
							obj.settings.direction = 1;
						}
						//only do this sanity check if certain options are chosen
						if(obj.settings.mode === 'countdown'){
							var resetto = [2016,2,23,14,25,0];
							if(obj.settings.dateTarget.length !== 6){
								obj.settings.dateTarget = resetto;
							}
						}
                    },

					//given a target date, now calculate and output the time remaining before that date
					//also works as a countup, if target date is in the past
                    countDown: function(){
						obj.now = new Date();
						var diff = moment.preciseDiff(obj.now,obj.targ); //moment returns a formatted string e.g. '1 day 4 hours 19 minutes 3 seconds'
						diff = diff.split(' ');
						obj.timeobj = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'}; //reset the stored time

						//loop through the output from moment, trim the 's' from the unit names, and insert accordingly into the timeobj
						for(var i = 0; i < diff.length; i += 2){
							var num = diff[i];
							var unit = diff[i + 1];
							if(unit[unit.length - 1] == 's'){ //moment's output can vary e.g. 'seconds' or 'second', to match the array keys in time we need to trim this
								unit = unit.substring(0, unit.length - 1);
							}
							obj.timeobj[unit] = num; //this only happens if moment returns a value for this digit type, which it doesn't do if it's 0
						}

						//now output the time
						var tmp = '';
						for(var d in obj.dateorder){
							var d = obj.dateorder[d];
							tmp += functions.utility.padDigits(obj.timeobj[d],2); //pad the digits and then add to the tmp string
						}
						obj.numCurr = parseInt(tmp);
						functions.markup.updateDigits();
						obj.timer = setTimeout(functions.general.countDown,100); //called more than once every second but can't guarantee it'll only take 1 second, so updating quicker is better
					},

					//scale a number until it reaches the min/max, then stop
                    scaleNumber: function(){
						obj.numCurr += obj.settings.direction;
						functions.markup.updateDigits();
						if(obj.settings.direction === 1){
							if(obj.numCurr < obj.settings.numMax){
								obj.timer = setTimeout(functions.general.scaleNumber,obj.settings.speed);
							}
						}
						else {
							if(obj.numCurr > obj.settings.numMin){
								obj.timer = setTimeout(functions.general.scaleNumber,obj.settings.speed);
							}
						}
					},

					//show a clock
					clock: function(){
						obj.numCurr = functions.utility.getCurrentTime();
						functions.markup.updateDigits();
						obj.timer = setTimeout(functions.general.clock,500);
					},

					//change a number until it hits the min/max, then loop
                    scaleNumberLoop: function(){
						obj.numCurr += obj.settings.direction;
						if(obj.numCurr === obj.settings.numMax){
							obj.settings.direction = -1;
						}
						else if(obj.numCurr === obj.settings.numMin){
							obj.settings.direction = 1;
						}
						functions.markup.updateDigits();
						obj.timer = setTimeout(functions.general.scaleNumberLoop,obj.settings.speed);
					},

                    resizeWindow: function(){
                    },
                },
                utility: {
					//get the current time as a single number, e.g. 010203 (3 seconds past 2 minutes past 1)
					getCurrentTime: function(){
						var d = new Date();
						var h = functions.utility.padDigits(d.getHours(),2);
						var m = functions.utility.padDigits(d.getMinutes(),2);
						var s = functions.utility.padDigits(d.getSeconds(),2);
						return(parseInt("" + h + m + s));
					},
					//get the number of digits in a number
					getNumberStrLen: function(num){
						var len = '' + num;
						return(len.length);
					},
					//http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
					padDigits: function(number, digits) {
						return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
					},
				},
				events: {
					initClicks: function(){
					}
				},
                markup: {
					//create elements to represent numbers
					createDigits: function(){
						var startat = '' + functions.utility.padDigits(obj.numCurr,obj.numLen);

						for(var x = 0; x < obj.numLen; x++){
							var digit = $('<div/>').addClass('digit num' + startat[x]);
							for(var i = 1; i < 8; i++){
								var bar = $('<div/>').addClass('bar bar' + i).appendTo(digit);
							}
							digit.appendTo(obj.$elem);
						}
					},
					//change the digits displayed to match a change in the actual number
					updateDigits: function(){
						var number = '' + functions.utility.padDigits(obj.numCurr,obj.numLen);
						var x = 0;
						obj.$elem.find('.digit').each(function(){
							$(this).attr('class','digit num' + number[x]);
							x++;
						});
					}
				},
            };

            $(window).on('load',function(){
				functions.general.overrideSettings();
				functions.general.init();
            });

			/*
            var resize;
        	$(window).on('resize',function(){
                //don't resize immediately
                clearTimeout(resize);
                resize = setTimeout(functions.general.resizeWindow,200);
        	});
        	*/
		}
	};
	$.fn.digitalnumbers = function(options){
		return this.each(function(){
			new Plugin(this,options).init();
		});
	};
	window.Plugin = Plugin;
})(window,jQuery);


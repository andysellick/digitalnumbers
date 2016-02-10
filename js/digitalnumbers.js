/* https://github.com/andysellick/digitalnumbers */
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

			this.settings = $.extend({
				numMax: 100,
				numMin: 0,
				startat: 0,
				increment: 1,
				speed: 500,
				direction: 1, //either 1 to increase or -1 to decrease
				mode: 'scale', //can be scale, scaleloop
			}, this.defaults, this.options);

			var functions = {
                general: {
					//begin
					init: function(){
						if(obj.settings.mode === 'clock'){
							obj.numLen = 6;
							obj.numCurr = functions.utility.getCurrentTime();
							functions.markup.createDigits();
							obj.timer = setTimeout(functions.general.clock,500);
						}
						else {
							obj.numLen = functions.utility.getNumberStrLen(obj.settings.numMax);
							obj.numCurr = obj.settings.startat;
							functions.markup.createDigits();
							
							if(obj.settings.mode === 'scaleloop'){
								obj.timer = setTimeout(functions.general.scaleNumberLoop,obj.settings.speed);
							}
							else if(obj.settings.mode === 'scale'){
								obj.timer = setTimeout(functions.general.scaleNumber,obj.settings.speed);
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


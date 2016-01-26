/*
*/
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
			obj.direction = 1;
			obj.numCurr = 0;
			obj.numLen = 0;

			this.settings = $.extend({
				numMax: 100,
				numMin: 0,
				startat: 0,
				increment: 1,
				speed: 500,
				mode: 'scale', //can be scale, random
			}, this.defaults, this.options);

			var functions = {
                general: {
					init: function(){
						obj.numLen = functions.utility.getNumberStrLen(obj.settings.numMax);
						obj.numCurr = obj.settings.startat;
						functions.markup.createDigits();
						if(obj.settings.mode === 'scale'){
							obj.timer = setTimeout(functions.general.changeNumber,obj.settings.speed);
						}
						else if(obj.settings.mode === 'randomscale'){
						}
					},
					//do initial settings setup and prevent settings abuse
                    overrideSettings: function(){
						//quick check to prevent numbers below zero
						obj.settings.numMin = Math.max(obj.settings.numMin,0);
						obj.settings.numMax = Math.max(obj.settings.numMax,0);
						obj.settings.numCurr = Math.max(obj.settings.numCurr,0);
						obj.settings.increment = Math.min(obj.settings.increment,1);
                    },

                    changeNumber: function(){
						obj.numCurr += obj.direction;
						if(obj.numCurr === obj.settings.numMax){
							obj.direction = -1;
						}
						else if(obj.numCurr === obj.settings.numMin){
							obj.direction = 1;
						}
						functions.markup.updateDigits();
						//console.log(obj.numCurr);
						obj.timer = setTimeout(functions.general.changeNumber,obj.settings.speed);
					},

                    resizeWindow: function(){
                    },
                },
                utility: {
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


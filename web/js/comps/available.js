(function($) 
{		
	$.available = function(element, options)
	{								
		var base = this;				
		base.options = options;		
		base.$element = $(element);
		
		// data				
		base.queue = [];
		base.interval;		
		
		base.check = function()
		{						
			for(var i = 0; i < base.queue.length; i++)
			{																																		
				if($(base.queue[i][0]) && ($(base.queue[i][0]).length != 0))
				{										
					try
					{
						base.queue[i][1].apply($(base.queue[i][0]).eq(0));
					}
					catch(e)
					{
						
					}
					base.queue.splice(i,1);
					i--;
				}
			}
			
			if (!base.queue.length)
			{
				base.interval = clearInterval(base.interval);
			}
		};				 
					
		base.func = function()
		{												
			base.options.timeout = (base.options.timeout == undefined) ? 10000 : base.options.timeout;				
			
			base.queue.push([base.options.ref, base.options.func, base.options.timeout]);
			
			if (!base.interval)
			{
				base.interval = setInterval(base.check, 1000);
			}			
		}
						
		base.func();
	};
		
	$.fn.available = function(options)
	{								
		options = $.extend({}, { widget:"available", ref:this.selector }, options);
		
		return this.each(function()
		{									 									
			(new $.available(this, options));			
		});		
	};	 				 					
}
)(jQuery);
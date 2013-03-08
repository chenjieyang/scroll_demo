if (!ui) var ui = function(obj)
{		
	// dependancies go here i.e: aka var cons_videoplayer = new VideoPlayers(); 
	
	// declare sys as object to hold all values globally
	var sys = new Object();
	
	// do not remove, privilege methods =========================================================================
	this.__select = function(p) 		{	return _select(p); 	};
		
	function _select(p)
	{	
		var selected = p.selected;
		var text = p.text;
		var options = p.options;
		var option = p.option;
	
		var len = options.children().length;
		var cur = -1;
		
		var scroll_on = false;
		
		$(window).bind("scroll", function()
		{
			if (scroll_on)
			{
				$(this).scrollTop(0);
			}
		});
		
		$(document).bind("click", function() 
		{						
			if (options.css("display") == "block") 
			{ 
				options.hide();
				scroll_on = false;
			}	
		});
			
		$(document).bind("keydown", function(e)
		{ 
			if (options.css("display") == "block")
			{
				if (e.keyCode == 40)
				{
					scroll_on = true;
					
					cur++;
					option.removeClass("hover");
					
					if (cur > (len-1))
					{
						cur = (len - 1);
					}	
						
					if (option.eq(cur).css("display") == "block")
					{
						option.eq(cur).addClass("hover");
					}
					else if (option.eq(cur).css("display") == "none")
					{
						if (cur == (len - 1))
						{
							cur--;
							option.eq(cur).addClass("hover");
						}
						else
						{
							cur++;
							option.eq(cur).addClass("hover");
						}
					}		
				}
				else if (e.keyCode == 38)
				{
					scroll_on = true;
					
					cur--;
					option.removeClass("hover");
					
					if (cur < 0)
					{
						cur = 0;
					}	
						
					if (option.eq(cur).css("display") == "block")
					{
						option.eq(cur).addClass("hover");
					}
					else if (option.eq(cur).css("display") == "none")
					{
						if (cur == 0)
						{
							cur++;
							option.eq(cur).addClass("hover");
						}
						else
						{
							cur--;
							option.eq(cur).addClass("hover");
						}
					}
				}
				else if (e.keyCode == 13)
				{
					option.each(function()
					{
						var css = $(this).attr("class");
						if (css.indexOf("hover") != -1)
						{
							$(this).trigger('click');
						}
					});
				}
			}	
		}); 
		
		option.bind("mouseenter", function(e) 
		{
			$(this).addClass("hover");
		});
		
		option.bind("mouseleave", function(e) 
		{
			$(this).removeClass("hover");
		});
		
		option.each(function() 
  	{
  		if ($(this).text() == text.text())
  		{
  			$(this).hide();
  		}
  	});
		
		selected.bind("click", function(e) 
		{ 
			cur = -1;
			
			e.stopPropagation();
			
			if (options.css("display") == "block")
			{
				scroll_on = false;
				options.hide();
			}
			else if (options.css("display") == "none")
			{
				options.show();
			}
		});
		option.bind("click", function(e) 
		{ 
			e.stopPropagation();
			
			option.each(function() 
			{
				if ($(this).css("display") == "none")
				{
					$(this).show();
				}
			});
			
			text.text($(this).text());
			options.hide();
			$(this).hide();
		});
	}				
};

// do not remove the bottom public functions =================================================================
ui.prototype.select = function(p) 						{	this.__select(p); 						 			};
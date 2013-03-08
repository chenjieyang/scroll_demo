// example on how to use :: $(some_elem).disableTextSelect(); 

$(function()
{
	$.extend($.fn.disableTextSelect = function() 
	{
		return this.each(function()
		{
			if($.browser.mozilla)
			{	
				// Firefox
				$(this).css('MozUserSelect','none');
				$(this).css('-webkit-user-select','none');
				$(this).css('-moz-user-select','none');
			}
			else if($.browser.msie)
			{	
				// IE
				$(this).bind('selectstart',function(){return false;});
			}
			else
			{
				//Opera, etc.
				$(this).mousedown(function(){return false;});
			}
		});
	});
});
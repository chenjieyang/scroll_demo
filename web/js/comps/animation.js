if (!animation) var animation = function(obj)
{		
	// dependancies go here i.e: aka var cons_videoplayer = new VideoPlayers(); 
	
	// declare sys as object to hold all values globally
	var sys = new Object();
	
	// do not remove, privilege methods =========================================================================
	this.__efx_alpha_show = function(p) 		{	return _efx_alpha_show(p); 			};
	this.__efx_alpha_hide = function(p) 		{	return _efx_alpha_hide(p); 			};

	function _efx_alpha_show(p)
	{																																	
		p.element.css({"opacity":p.from, "display":"block"}).animate({"opacity":p.to}, p.time, null, p.callback);
	}
	function _efx_alpha_hide(p)
	{																																	
		p.callback = (!p.callback) ? function() { p.element.hide() } : p.callback ;
		p.element.css({"opacity":p.to}).animate({"opacity":p.to}, p.time, null, p.callback);
	}			
};

// do not remove the bottom public functions =================================================================					};
animation.prototype.efx_alpha_show = function(p) 			{	this.__efx_alpha_show(p); 				};
animation.prototype.efx_alpha_hide = function(p) 			{	this.__efx_alpha_hide(p); 				};


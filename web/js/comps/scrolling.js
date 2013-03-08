if (!scrolling) var scrolling = function(obj)
{		
	// declare sys as object to hold all values globally
	var sys = new Object();
	sys.dom_target = $(obj.target);
	sys.target_name = obj.target_name;
	sys.target_row = obj.target_name+"_row";
	sys.target_pic = obj.target_pic;
	
	sys.mouse_down = false;
	sys.mouse_down_x = 0;
	sys.mouse_up = false;
	sys.mouse_up_x = 0;
	sys.mouse_move = false;
	sys.mouse_move_x = 0;
	sys.mouse_pro = undefined;
	
	var bound_left_x = 0;
	var bound_left_y = 0;
	var bound_right_x = 0;
	var bound_right_y = 0;
	var bound_center_left_x = 0;
	var bound_center_left_y = 0;
	var bound_center_right_x = 0;
	var bound_center_right_y = 0;
	
	var first_page_clickable = true;
	var prev_page_clickable = true;
	var next_page_clickable = true;
	var last_page_clickable = true;
	
	var scroller_items_id = undefined;
	
	var scroller_beg = 0;															// index of current left most profile
	var scroller_center = 0;													// index of current centered profile
	var scroller_end = 0;															// index of current right most profile
	var scroller_count = 0;														// number of profiles
	
	
	// dependancies go here i.e: aka var cons_videoplayer = new VideoPlayers(); 
	sys.comp_animation = new animation();		
	
	// do not remove, privilege methods =========================================================================
	this.__load__dependencies = function(p) {	return _load_dependencies(p); 		};
	this.__load_conf = function(p) 					{	return _load_conf(p); 						};
	this.__load_canvas = function(p)				{ return _load_canvas(p);						};
	this.__load_callback = function(p)			{ return _load_callback(p);					};
	
	// [workflow]
	// init > _load_conf > _load_variable > _load_canvas > _load_calculation > _load_events
	
	// main
	_init();
	_debug();

	
	function _debug()
	{
		$(window).bind("mousemove", function(e)
		{
			
			 var pageX = e.clientX;
       var pageY = e.clientY;
			
			$("#debug").text("x ["+pageX+"] y ["+pageY+"]");	
		});
	}

	function _init()
	{
		_load_conf();		
	};

	function _load_conf()
	{
		// ajax function ()
		_load_variables();	
	};
	
	function _load_variables()
	{
		var is_debug = false;
		var left_fast_scroll = 0;
		var right_fast_scroll = 0;
		
		i_loader = 0;
		loader_ready = false;
		loader_timeout = 20000; // 20 seconds		
		loader_freq = 1000;
		
		drag_on = false;
		move_on = false;
		beg_x = 0;
		beg_y = 0;
		end_x = 0;
		end_y = 0;
		
		scroller_mode_move_on = false;								// set to true when scroll bar has been dragged
		
		scroller_beg = 0;											// index of current left most profile
		scroller_center = 0;										// index of current centered profile
		scroller_end = 0;											// index of current right most profile
		scroller_count = 0;											// number of profiles

		scroller_items_id = "";
		scroller_items = 0;
			
		scroller_freq_extra = 250;
		scroller_freq_scroll = 2000;
		
		scroller_speed_kill = false;
		scroller_speed_counter_prev_page = 0;
		scroller_speed_counter_next_page = 0;
		i_scroller_speed_on = 0;
		i_scroller_speed_off = 0;
		scroller_length = 0;
				
		varbound_left_x = 0;
		bound_left_y = 0;
		bound_right_x = 0;
		bound_right_y = 0;
		bound_center_left_x = 0;
		bound_center_left_y = 0;
		bound_center_right_x = 0;
		bound_center_right_y = 0;
		
		first_page_clickable = true;
		prev_page_clickable = true;
		next_page_clickable = true;
		last_page_clickable = true;
			
					
		if (is_debug) { console.log("_load_canvas callee"); }			
					
		_load_canvas();	
	};
	
	function _load_canvas()
	{
		var is_debug = false; 
		
		if (is_debug) { console.log("_load_canvas"); }
		
		var ts = new Date().getTime().toString();
		
		var html = '';
		html += sub_load_scroller();
		html += sub_load_pagination();
		$("#"+sys.target_row).html(html);

		if (is_debug) { console.log("_load_doms callee "); }

		$("#"+ts).available(
		{ 
			func:function(){ _load_doms(); }
		});
		
		function sub_load_scroller()
		{
			var html = '';
			html += '<div class="bnds_lft" id="'+sys.target_row+'_bnds_lft"></div>';
			html += '<div class="center_box" id="'+sys.target_row+'_center_box"></div>';
			html += '<div class="bnds_rgt" id="'+sys.target_row+'_bnds_rgt"></div>';
			html +=	'<div class="load_status_profiles" id="'+sys.target_row+'_load_status_profiles">Loading Items ...</div>';
			html +=	'<div class="cnt_'+sys.target_name+'s id="'+sys.target_row+'_cnt_profiles">';
			html +=		'<div id="'+ts+'" class="scroller">';
			html +=			'<div class="empty_left" id="'+sys.target_row+'_empty_left"></div>';
			html += 		'<div class='+sys.target_name+'s id="'+sys.target_row+'_profiles">';	
			switch (sys.target_name)
			{
				case 'profile': 		
					for (var i=1; i<300; i=i+2)
					{
						html +=			sub_load_profile(i);
					}; break;
				case 'video': 		
					for (var i=1; i<300; i=i+2)
					{
						html +=			sub_load_video(i);
					}; break;
				case 'audio': 		
					for (var i=1; i<300; i=i+2)
					{
						html +=			sub_load_audio(i);
					}; break;
				//html +=			sub_load_profile(i);
			}
			html +=			'</div>';
			html +=			'<div class="empty_right" id="'+sys.target_row+'_empty_right"></div>';
			html +=		'</div>';
			html +=	'</div>';
			
			return html;
		};
		
		function sub_load_profile(i)
		{
			var html = "";
			html += 	'<div class="profile" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="profile_pic" id="'+sys.target_pic+'_'+i+'"></div>';
			html +=			'<div class="profile_info"><a>Text Here Text Here '+i+'</a></div>';		
			html += 	'</div>';
			i++;
			html += 	'<div class="profile whitebg" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="profile_pic whitebg" id="'+sys.target_pic+'_'+i+'"></div>';
			html +=			'<div class="profile_info whitebg"><a>Text Here Text Here '+i+'</a></div>';		
			html += 	'</div>';
			return html;
		};
		
		function sub_load_video(i)
		{
			var html = "";
			html += 	'<div class="video" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="video_pic" id="'+sys.target_pic+'_'+i+'">Artist Name</div>';
			html +=			'<div class="video_info">';
			html +=				'1. Video1 - 1000hits<br/>';
			html +=				'2. Video2 - 1000hits<br/>';
			html +=				'3. Video3 - 1000hits<br/>';
			html +=				'4. Video4 - 1000hits<br/>';
			html +=				'5. Video5 - 1000hits<br/>';
			html +=				'6. Video6 - 1000hits<br/>';
			html +=				'7. Video7 - 1000hits<br/>';
			html +=				'8. Video8 - 1000hits<br/>';
			html +=				'9. Video9 - 1000hits<br/>';
			html +=			'</div>';		
			html += 	'</div>';
			i++;
			html += 	'<div class="video whitebg" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="video_pic whitebg" id="'+sys.target_pic+'_'+i+'">Artist Name</div>';
			html +=			'<div class="video_info whitebg">';
			html +=				'1. Video1 - 1000hits<br/>';
			html +=				'2. Video2 - 1000hits<br/>';
			html +=				'3. Video3 - 1000hits<br/>';
			html +=				'4. Video4 - 1000hits<br/>';
			html +=				'5. Video5 - 1000hits<br/>';
			html +=				'6. Video6 - 1000hits<br/>';
			html +=				'7. Video7 - 1000hits<br/>';
			html +=				'8. Video8 - 1000hits<br/>';
			html +=				'9. Video9 - 1000hits<br/>';
			html +=			'</div>';	
			html += 	'</div>';
			return html;
		};
		
		function sub_load_audio(i)
		{
			var html = "";
			html += 	'<div class="audio" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="audio_pic" id="'+sys.target_pic+'_'+i+'">Artist Name</div>';
			html +=			'<div class="audio_info">';
			html +=				'1. Song1 - 1000hits<br/>';
			html +=				'2. Song2 - 1000hits<br/>';
			html +=				'3. Song3 - 1000hits<br/>';
			html +=				'4. Song4 - 1000hits<br/>';
			html +=				'5. Song5 - 1000hits<br/>';
			html +=				'6. Song6 - 1000hits<br/>';
			html +=				'7. Song7 - 1000hits<br/>';
			html +=				'8. Song8 - 1000hits<br/>';
			html +=				'9. Song9 - 1000hits<br/>';
			html +=			'</div>';		
			html += 	'</div>';
			i++;
			html += 	'<div class="audio whitebg" id="'+sys.target_name+'_'+i+'">';
			html += 		'<div class="audio_pic whitebg" id="'+sys.target_pic+'_'+i+'">Artist Name</div>';
			html +=			'<div class="audio_info whitebg">';
			html +=				'1. Song1 - 1000hits<br/>';
			html +=				'2. Song2 - 1000hits<br/>';
			html +=				'3. Song3 - 1000hits<br/>';
			html +=				'4. Song4 - 1000hits<br/>';
			html +=				'5. Song5 - 1000hits<br/>';
			html +=				'6. Song6 - 1000hits<br/>';
			html +=				'7. Song7 - 1000hits<br/>';
			html +=				'8. Song8 - 1000hits<br/>';
			html +=				'9. Song9 - 1000hits<br/>';
			html +=			'</div>';		
			html += 	'</div>';
			return html;
		};
		
		function sub_load_pagination()
		{		
			// hasPagination = this is the section that allows you to page thru	 	
			var hasPagination = true; // note (default)
			// hasJumpPage = this is the section that allows you to jump to desired section
			var hasJumpPage = true;
			// hasHistory = this is the section that allows you see your history	
			var hasHistory = true;
	
			var html = "";
			if (hasPagination)
			{	
				html += 	'<div class="profile_pag_cont_outter">';
				html +=			'<div class="profile_pag_cont">';
				html +=				'<div class="pag_pages" id="'+sys.target_row+'_pag_pages">';
				html +=					'<div class="pages_label"><a>Section Navigation</a></div>';
				html +=					'<div class="pages_interactables">';
				html +=						'<div class="p_inc" id="'+sys.target_row+'_first_page" title="first_page"><a class="ctrls_disabled">First</a></div>';
				html +=						'<div class="p_inc" id="'+sys.target_row+'_prev_page" title="prev_page"><a class="ctrls_disabled">Prev</a></div>';
				html +=						'<div class="p_set" title="1"><a>1</a></div>';
				html +=						'<div class="p_set" title="2"><a>2</a></div>';
				html +=						'<div class="p_set" title="3"><a>3</a></div>';
				html +=						'<div class="p_set" title="4"><a>4</a></div>';
				html +=						'<div class="p_set" title="5"><a>5</a></div>';
				html +=						'<div class="p_set" title="6"><a>6</a></div>';
				html +=						'<div class="p_set" title="7"><a>7</a></div>';
				html +=						'<div class="p_set" title="8"><a>8</a></div>';
				html +=						'<div class="p_set" title="9"><a>9</a></div>';
				html +=						'<div class="p_set" title="10"><a>10</a></div>';
				html +=						'<div class="p_inc" id="'+sys.target_row+'_next_page" title="next_page"><a>Next</a></div>';
				html +=						'<div class="p_inc" id="'+sys.target_row+'_last_page" title="last_page"><a>Last</a></div>';
				html +=					'</div>';
				html +=				'</div>';
			/* Currently not used
			}	
			if (hasJumpPage)
			{
				html +=				'<div class="pag_jump" id="'+sys.target_row+'_pag_jump">';
				html += 				'<div class="jump_separator"></div>';
				html += 				'<div class="jump_label"><a>Jump Page</a></div>';
				html +=					'<input type="text" class="p_jump" id="'+sys.target_row+'_p_jump" value="......"  title="Jump Page" />';
				html +=				'</div>';
			}
			if (hasHistory)
			{
				html +=				'<div class="pag_history" id="'+sys.target_row+'_pag_history">';
				html += 				'<div class="history_seperator"></div>';
				html += 				'<div class="history_label"><a>Section History</a></div>';
				html += 				'<div class="history_interactables">';
				html +=						'<div class="p_set">';
				html +=							'<div class="arrow_down"></div>';
				html +=						'</div>';
				html +=						'<div class="p_set" title="30"><a>30</a></div>';
				html +=						'<div class="p_set_empty" title=""><a>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>';
				html +=						'<div class="p_set_empty" title=""><a>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>';
				html +=						'<div class="p_set_empty" title=""><a>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>';
				html +=						'<div class="p_set_empty" title=""><a>&nbsp;&nbsp;&nbsp;&nbsp;</a></div>';
				html +=					'</div>';
				html +=				'</div>';
			*/
				html +=			'</div>';
				html += 	'</div>';
			}
			return html;
		};
	};
	
	function _load_doms()
	{		
		var is_debug = false; 
		
		if (is_debug) { console.log("_load_doms"); }
		
		sys.dom_status = sys.dom_target.find("#"+sys.target_row+"_load_status_profiles");
		sys.dom_empty_left = sys.dom_target.find(".empty_left");
		sys.dom_scroller = sys.dom_target.find(".cnt_"+sys.target_name+"s");
		sys.dom_empty_right = sys.dom_target.find(".empty_right");
		sys.dom_scroller_cnt = sys.dom_target.find(".scroller");
		sys.dom_profiles = sys.dom_scroller_cnt.find("."+sys.target_name+"s");
		sys.dom_profile = sys.dom_profiles.find("."+sys.target_name+"");
		sys.dom_pagination = sys.dom_profile.find(".profile_pag_cont");
		sys.dom_profile_pic = sys.dom_profile.find(".profile_pic img");
		sys.dom_bound_left = sys.dom_target.find("#"+sys.target_row+"_bnds_lft");
		sys.dom_bound_right = sys.dom_target.find("#"+sys.target_row+"_bnds_rgt");
		_load_avatars();
	}
	
	function _load_avatars()
	{
		sys.dom_profile.each(function()
		{
			var pic = $(this).find("."+sys.target_name+"_pic");
			var pic_id = $(this).find("."+sys.target_name+"_pic").attr("id");			
			pic_id = pic_id.substring(pic_id.lastIndexOf("_")+1);
			pic.css({"backgroundImage":"url('imgs/"+sys.target_pic+"/"+sys.target_pic+"_"+pic_id+".png')", 'background-repeat': 'no-repeat'});
		});
		
		_load_calculation();
	}
	
	function _load_calculation()
	{
		var is_debug = false;
		
		if (is_debug) { console.log("_load_calculation"); }
		
		bound_left_x = 0;																										// set left and right boundaries
		bound_left_y = Math.round(parseInt(sys.dom_scroller_cnt.offset().top) + parseInt(sys.dom_scroller_cnt.height())/2); 	// y value is 1/2 of height + wherever it starts from the top
		bound_right_x = parseInt(sys.dom_scroller.width()) - 1;
		bound_right_y = bound_left_y;
		
		profile_width = Math.round(parseInt($("#"+sys.target_row+"_center_box").outerWidth(true)) * 2 );
		
		bound_center_left_x = Math.round(parseInt($("#"+sys.target_row+"_center_box").offset().left));			// distance from where center box starts to left edge of the browser
		bound_center_left_y = Math.round(parseInt($("#"+sys.target_row+"_center_box").offset().top) + 12); 		// grabbing from top center + 12 pixels to avoid collision of child ids
		// console.log($("#"+sys.target_row+"_center_box")+" x: "+ bound_center_left_x + " y: "+bound_center_left_y );
		
		bound_center_right_x = bound_center_left_x + profile_width;
		bound_center_right_y = bound_center_left_y;
		
		sys.dom_profiles.width(_get_children_width_sum(sys.dom_profiles)); 												// set scroller width
		sys.dom_empty_left.width(bound_center_left_x);																	// set empty left space
		sys.dom_empty_right.width(bound_right_x - bound_center_right_x + 1);											// set empty right space
		sys.dom_scroller_cnt.width(sys.dom_empty_left.width()+sys.dom_profiles.width()+sys.dom_empty_right.width());
		scroller_count = sys.dom_profiles.children().length;															// get total number of profiles 

		$(window).scrollTo(0, 0);															// reset window scroller to be able to read dom obj that are not in view
		sys.dom_scroller.scrollTo(0, 0, { easing:"easeOutQuart", onAfter:function()			// reset scroller
		{
			if (is_debug) { console.log("sys.dom_scroller scrollto - bound_left_x ["+bound_left_x+"] bound_left_y["+bound_left_y+"] bound_right_x ["+bound_right_x+"] bound_right_y["+bound_right_y+"]"); }
			
			sys.dom_status.css({"z-index":"2"});
			sys.dom_scroller.css({"z-index":"3"});
			
			
			if (is_debug) { console.log("bound_left_x "+bound_left_x+"bound_left_y "+bound_left_y); }
			if (is_debug) { console.log("bound_right_x "+bound_right_x+"bound_right_y "+bound_right_y); }
			
			bound_left = document.elementFromPoint(bound_left_x, bound_left_y);
			bound_right = document.elementFromPoint(bound_right_x, bound_right_y);
			
			if (is_debug) { console.log("sys.dom_scroller scrollto - bound_left ["+bound_left+"]"); }
			if (is_debug) { console.log("sys.dom_scroller scrollto - bound_right ["+bound_right+"]"); }
			
			_get_items_count(bound_right);
			
			sys.dom_status.css({"z-index":"3"});
			sys.dom_scroller.css({"z-index":"2"});
		}});
		
		left_fast_scroll = Math.round(sys.dom_bound_left.offset().left + (profile_width * 2));
		// console.log("left_fast_scroll "+left_fast_scroll);
		
		right_fast_scroll = Math.round(sys.dom_bound_right.offset().left - (profile_width *2) +1);
		// console.log("right_fast_scroll "+right_fast_scroll);
		
		scroller_counter = 1;
		scroller_beg = 1;
		scroller_center = 1;
		scroller_end = scroller_center + Math.round(scroller_items / 2);	
		_ctrls_fix_first_page();																																														// init ctrls

		sub_disable_highlighting();
		
		if (is_debug) {  console.log("_load_events() callee"); }
		
		_load_events();

		function sub_disable_highlighting()
		{
			sys.dom_profile.disableTextSelect();
			sys.dom_profile_pic.disableTextSelect();
		}
	};

	function _load_events()
	{
		var is_debug = false;
		
		if (is_debug) { console.log("_load_events()"); }	
				
		// bind events
		sys.dom_profile.bind("mousedown", _events_profile);
		sys.dom_scroller.bind("mousedown", _events_new_scrolling_mousedown);
		sys.dom_scroller.bind("mousemove", _events_new_scrolling_mousemove);
		sys.dom_scroller.bind("mouseup", _events_new_scrolling_mouseup);
										
		$("#"+sys.target_row+"_first_page").bind("click", { "target":"first_page" }, _events_click);
		$('#'+sys.target_row+'_prev_page').bind("click", { "target":"prev_page" }, _events_click);
		$('#'+sys.target_row+'_next_page').bind("click", { "target":"next_page" }, _events_click);
		$('#'+sys.target_row+'_last_page').bind("click", { "target":"last_page" }, _events_click);

		$(obj.target).parent().find(".load_status").addClass("hide");
		// alert("button bind complete");
		_unload_status();
	};

	function _unload_status()
	{
		var is_debug = false;
		
		if (is_debug) { console.log("_unload_status"); }
		
		sys.comp_animation.efx_alpha_hide({"element":sys.dom_status, "to":"0.00", "time":"0.5", "callback":function()
		{	
			sys.dom_status.css({"display":"none"});
		}});
	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function _load_dependencies(p)
	{
		var cons_ajax = new techconnect_request();
		cons_ajax.sending(p);	
	};
	
	function _load_callback(p)
	{
		_person(p.data);
		//alert("_load_callback ["+p+"]");
	};

	// new event functions
	function _events_profile(e)
	{
		sys.mouse_pro = $(this);
	};

	function _events_new_scrolling_mousedown(e)
	{		  	
		if (sys.mouse_pro != undefined)
		{
			// reset var 
			sys.mouse_up = false;
			
			sys.mouse_down = true;
			
			// get mouse clicked position
			sys.mouse_down_x = e.clientX;
			
			// get profile position in the div 
			sys_pro_position_x = sys.mouse_pro.position().left;
			
			// get profile position on screen
			sys_pro_offset_x = sys.mouse_pro.offset().left;
			
			// get the actual clicked position in the div
			sys_pro_len = sys_pro_position_x + (sys.dom_empty_left.width()) + (sys.mouse_down_x - sys_pro_offset_x);
			
			// get the actual position of the left edge to be shown on screen
			sys_pro_len = sys_pro_len - sys.mouse_down_x;
			
			_ctrls_fix_disable_all();
			$("#debugdn").text("mouse is down ["+sys.mouse_down_x+"]");
		}
	};
	
	function _events_new_scrolling_mousemove(e)
	{
		if (sys.mouse_down)
		{
			sys.mouse_move_x = e.clientX;
			var diff = (sys.mouse_down_x - sys.mouse_move_x);			
			var sum = (sys_pro_len + diff);
			sum = (sum < 0) ? 0 : sum;
			
			_ctrls_fix_disable_all();
			sys.dom_scroller.stop();
			sys.dom_scroller.scrollTo(sum);
		}
	};

	function _events_new_scrolling_mouseup(e)
	{ 
		sys.mouse_up = true;
		sys.mouse_up_x = e.clientX;
		$("#debugup").text("mouse is up ["+sys.mouse_up_x+"]");
		
		if (sys.mouse_pro != undefined)
		{
			// detecting if fast move first
			if ( sys.mouse_up_x > right_fast_scroll )
			{
				// console.log("mouse moved to right ");
				
				var diff = (sys.mouse_down_x - sys.mouse_up_x);			
				sys_pro_len= (sys_pro_len + diff *2);
				sys_pro_len = (sys_pro_len < 0 ) ? 0 : sys_pro_len;
				
				sys.dom_scroller.stop();
				// adjusting after scrolling done
				sys.dom_scroller.scrollTo(sys_pro_len, scroller_freq_scroll, { easing:"easeOutQuart" , onAfter:function()
				{
					// after scrolling is done, adjust right most item position
					// id holds current centered profile (ex: profile17)
		
					var id_left = _get_boundary_by_coordinates(bound_center_left_x, bound_center_left_y);
					var id_right = _get_boundary_by_coordinates(bound_center_right_x, bound_center_right_y);
		
					var id_left_pos = Math.round(parseInt($("#"+id_left).offset().left));
					var id_right_pos = Math.round(parseInt($("#"+id_right).offset().left));
					
					
					if ((bound_center_left_x - id_left_pos) < Math.round(profile_width / 2))
					{
						scroller_center = parseInt(id_left.substring(id_left.indexOf(scroller_items_id)+scroller_items_id.length));
						scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
						scroller_end = scroller_center + Math.round(scroller_items /2) -1;
						// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
						var temp = "#"+scroller_items_id+scroller_center;
						var id_pos = Math.round($(temp).position().left);
						var id_x = id_pos;
		
						if (scroller_center == 1)
						{
							scroller_beg = scroller_center;
							scroller_mode_move_on = false;
							_ctrls_fix_first_page();
							scroller_counter = 1;
						}
						else
						{
							if (scroller_center == scroller_count)
							{
								scroller_end = scroller_center;
								scroller_mode_move_on = false;
								_ctrls_fix_last_page();
								scroller_counter = scroller_counter_max;
							}
							else
							{					
								_ctrls_fix_enable_all();
							}
						}
						sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
					}
					else
					{
						scroller_center = parseInt(id_right.substring(id_right.indexOf(scroller_items_id)+scroller_items_id.length));
						scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
						scroller_end = scroller_center + Math.round(scroller_items /2) -1;
						// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
						
						var temp = "#"+scroller_items_id+scroller_center;
						var id_pos = Math.round($(temp).position().left);
						var id_x = id_pos;
		
						
						if (scroller_center == 1)
						{
							scroller_mode_move_on = false;
							_ctrls_fix_first_page();
							scroller_counter = 1;
						}
						else
						{
							if (scroller_center == scroller_count)
							{
								scroller_mode_move_on = false;
								_ctrls_fix_last_page();
								scroller_counter = scroller_counter_max;
							}
							else
							{
								_ctrls_fix_enable_all();
							}
						}
						sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
					}
				}});
			}
			else 
			{
				if ( sys.mouse_up_x < left_fast_scroll )
				{
					// console.log("mouse moved to left");
					
					var diff = (sys.mouse_down_x - sys.mouse_up_x);			
					sys_pro_len= (sys_pro_len + diff *2);
					sys_pro_len = (sys_pro_len < 0 ) ? 0 : sys_pro_len;
					
					sys.dom_scroller.stop();
					// adjusting after scrolling done
					sys.dom_scroller.scrollTo(sys_pro_len, scroller_freq_scroll, { easing:"easeOutQuart" , onAfter:function()
					{
						// after scrolling is done, adjust right most item position
						// id holds current centered profile (ex: profile17)
			
						var id_left = _get_boundary_by_coordinates(bound_center_left_x, bound_center_left_y);
						var id_right = _get_boundary_by_coordinates(bound_center_right_x, bound_center_right_y);
			
						var id_left_pos = Math.round(parseInt($("#"+id_left).offset().left));
						var id_right_pos = Math.round(parseInt($("#"+id_right).offset().left));
						
						
						if ((bound_center_left_x - id_left_pos) < Math.round(profile_width / 2))
						{
							scroller_center = parseInt(id_left.substring(id_left.indexOf(scroller_items_id)+scroller_items_id.length));
							scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
							scroller_end = scroller_center + Math.round(scroller_items /2) -1;
							// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
							var temp = "#"+scroller_items_id+scroller_center;
							var id_pos = Math.round($(temp).position().left);
							var id_x = id_pos;
			
							if (scroller_center == 1)
							{
								scroller_beg = scroller_center;
								scroller_mode_move_on = false;
								_ctrls_fix_first_page();
								scroller_counter = 1;
							}
							else
							{
								if (scroller_center == scroller_count)
								{
									scroller_end = scroller_center;
									scroller_mode_move_on = false;
									_ctrls_fix_last_page();
									scroller_counter = scroller_counter_max;
								}
								else
								{					
									_ctrls_fix_enable_all();
								}
							}
							sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
						}
						else
						{
							scroller_center = parseInt(id_right.substring(id_right.indexOf(scroller_items_id)+scroller_items_id.length));
							scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
							scroller_end = scroller_center + Math.round(scroller_items /2) -1;
							// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
							
							var temp = "#"+scroller_items_id+scroller_center;
							var id_pos = Math.round($(temp).position().left);
							var id_x = id_pos;
			
							
							if (scroller_center == 1)
							{
								scroller_mode_move_on = false;
								_ctrls_fix_first_page();
								scroller_counter = 1;
							}
							else
							{
								if (scroller_center == scroller_count)
								{
									scroller_mode_move_on = false;
									_ctrls_fix_last_page();
									scroller_counter = scroller_counter_max;
								}
								else
								{
									_ctrls_fix_enable_all();
								}
							}
							sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
						}
					}});
				}
				else
				{
					// console.log("adjusting with no fast scroll");
					
					// after scrolling is done, adjust right most item position
					// id holds current centered profile (ex: profile17)
					
					var id_left = _get_boundary_by_coordinates(bound_center_left_x, bound_center_left_y);
					var id_right = _get_boundary_by_coordinates(bound_center_right_x, bound_center_right_y);
					
					// console.log("bound_center_left_x: "+bound_center_left_x+" bound_center_left_y: "+bound_center_left_y);
					
					var id_left_pos = Math.round(parseInt($("#"+id_left).offset().left));
					var id_right_pos = Math.round(parseInt($("#"+id_right).offset().left));
					// console.log("id_left_pos "+id_left_pos + " id_right_pos " +id_right_pos);
					
					if ((bound_center_left_x - id_left_pos) < Math.round(profile_width / 2))
					{
						// console.log(scroller_items_id);
						scroller_center = parseInt(id_left.substring(id_left.indexOf(scroller_items_id)+scroller_items_id.length));
						scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
						scroller_end = scroller_center + Math.round(scroller_items /2) -1;
						// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
						var temp = "#"+scroller_items_id+scroller_center;
						var id_pos = Math.round($(temp).position().left);
						var id_x = id_pos;
		
						if (scroller_center == 1)
						{
							scroller_beg = scroller_center;
							scroller_mode_move_on = false;
							_ctrls_fix_first_page();
							scroller_counter = 1;
						}
						else
						{
							if (scroller_center == scroller_count)
							{
								scroller_end = scroller_center;
								scroller_mode_move_on = false;
								_ctrls_fix_last_page();
								scroller_counter = scroller_counter_max;
							}
							else
							{					
								_ctrls_fix_enable_all();
							}
						}
						sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
					}
					else
					{
						scroller_center = parseInt(id_right.substring(id_right.indexOf(scroller_items_id)+scroller_items_id.length));
						scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
						scroller_end = scroller_center + Math.round(scroller_items /2) -1;
						// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
						
						var temp = "#"+scroller_items_id+scroller_center;
						var id_pos = Math.round($(temp).position().left);
						var id_x = id_pos;
		
						
						if (scroller_center == 1)
						{
							scroller_mode_move_on = false;
							_ctrls_fix_first_page();
							scroller_counter = 1;
						}
						else
						{
							if (scroller_center == scroller_count)
							{
								scroller_mode_move_on = false;
								_ctrls_fix_last_page();
								scroller_counter = scroller_counter_max;
							}
							else
							{
								_ctrls_fix_enable_all();
							}
						}
						sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
					}
				}
			}
		}
		sys.mouse_down = false;
		sys.mouse_down_x = 0;
		sys.mouse_up = false;
		sys.mouse_up_x = 0;
		sys.mouse_move = false;
		sys.mouse_move_x = 0;
		sys.mouse_pro = undefined;
	};
	
	function _events_click(e)
	{
		switch (e.data.target)
		{
			case "first_page":
			{
				_scroll_to_first_page();
			}
			break;
			case "prev_page":
			{
				// console.log("click event - prev_page");
				if (prev_page_clickable)
				{
					if ((scroller_center - scroller_items) < 1 )
					{
						// console.log("_scroll to first page");
						_scroll_to_first_page();
					}
					else
					{
						// console.log("_scroll_to_prev_page");
						_scroll_to_prev_page();
					}
				}
			}
			break;
			case "next_page":				
			{
				// console.log("next_page");
				
				if (next_page_clickable)
				{
					if ((scroller_center + scroller_items) > scroller_count)
					{
						// console.log("_scroll_to_last_page()");
						_scroll_to_last_page();
					}
					else
					{
						// console.log("_scroll_to_next_page()");
						_scroll_to_next_page();
					}
				}
			}					
			break;
			case "last_page":				
			{
				_scroll_to_last_page();
			}
			break;								
		}														
	};
	
	// core click funcs ==================================================================================================================
	
	function _scroll_to_first_page()
	{
		if (first_page_clickable)
		{
			// console.log("before scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
			scroller_beg = 1;
			scroller_center = 1;
			scroller_end = scroller_center + Math.round(scroller_items / 2) -1;	
			// console.log("after scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
			
			sys.dom_scroller.stop();
			sys.dom_scroller.scrollTo(scroller_beg, scroller_freq_scroll, { easing:"easeOutQuart" });
			_ctrls_fix_first_page();
		}
	};
	
	function _scroll_to_last_page()
	{
		//alert("last page clicked");
		//sys.dom_scroller.scrollTo("#profile28", 1000, { easing:"easeOutQuart" });

		if (last_page_clickable)
		{
			// console.log("before scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
			scroller_end = scroller_count;
			scroller_center = scroller_count;
			scroller_beg = scroller_center - Math.round(scroller_items / 2) +1;
			// console.log("after scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
			
			sys.dom_scroller.stop();
			sys.dom_scroller.scrollTo("#"+scroller_items_id+scroller_end+"", scroller_freq_scroll, { easing:"easeOutQuart" });
			_ctrls_fix_last_page();
		}
	};
	
	function _scroll_to_prev_page()
	{
		// console.log("before scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
		
		scroller_center = scroller_center - scroller_items;
		scroller_beg = scroller_center - Math.round(scroller_items / 2) +1;
		scroller_end = scroller_center + Math.round(scroller_items / 2) -1;	
		// console.log($("#"+scroller_items_id+(scroller_center)).position().left);
		scroller_center_pos = $("#"+scroller_items_id+(scroller_center)).position().left + sys.dom_empty_left.width();
		
		// console.log("after scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
		
		sys.dom_scroller.scrollTo( scroller_center_pos - bound_center_left_x, scroller_freq_scroll, { easing:'easeOutQuart', onAfter:function()
		{
			// after scrolling is done, adjust right most item position
			// id holds current centered profile (ex: profile17)

			var id_left = _get_boundary_by_coordinates(bound_center_left_x, bound_center_left_y);
			var id_right = _get_boundary_by_coordinates(bound_center_right_x, bound_center_right_y);

			var id_left_pos = Math.round(parseInt($("#"+id_left).offset().left));
			var id_right_pos = Math.round(parseInt($("#"+id_right).offset().left));

			if ((bound_center_left_x - id_left_pos) < Math.round(profile_width / 2))
			{
				scroller_center = parseInt(id_left.substring(id_left.indexOf(scroller_items_id)+scroller_items_id.length));
				scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
				scroller_end = scroller_center + Math.round(scroller_items /2) -1;
				// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
				
				var temp = "#"+scroller_items_id+scroller_center;
				var id_pos = Math.round($(temp).position().left);
				var id_x = id_pos;

				if (scroller_center == 1)
				{
					scroller_beg = scroller_center;
					scroller_mode_move_on = false;
					_ctrls_fix_first_page();
					scroller_counter = 1;
				}
				else
				{
					if (scroller_center == scroller_count)
					{
						scroller_end = scroller_center;
						scroller_mode_move_on = false;
						_ctrls_fix_last_page();
						scroller_counter = scroller_counter_max;
					}
					else
					{					
						_ctrls_fix_enable_all();
					}
				}
				sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
			}
			else
			{
				scroller_center = parseInt(id_right.substring(id_right.indexOf(scroller_items_id)+scroller_items_id.length));
				scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
				scroller_end = scroller_center + Math.round(scroller_items /2) -1;
				// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
				
				var temp = "#"+scroller_items_id+scroller_center;
				var id_pos = Math.round($(temp).position().left);
				var id_x = id_pos;

				
				if (scroller_center == 1)
				{
					scroller_mode_move_on = false;
					_ctrls_fix_first_page();
					scroller_counter = 1;
				}
				else
				{
					if (scroller_center == scroller_count)
					{
						scroller_mode_move_on = false;
						_ctrls_fix_last_page();
						scroller_counter = scroller_counter_max;
					}
					else
					{
						_ctrls_fix_enable_all();
					}
				}
				sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
			}
		}});
	};
	
	function _scroll_to_next_page()
	{
		// console.log("before scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
		scroller_center = scroller_center + scroller_items;
		scroller_beg = scroller_center - Math.round(scroller_items / 2) +1;
		scroller_end = scroller_center + Math.round(scroller_items / 2) -1;	
		scroller_center_pos = $("#"+scroller_items_id+(scroller_center)).position().left + sys.dom_empty_left.width();
		// console.log("after scroll: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
		
		sys.dom_scroller.scrollTo( scroller_center_pos - bound_center_left_x, scroller_freq_scroll, { easing:'easeOutQuart', onAfter:function()
			{
			// after scrolling is done, adjust right most item position
			// id holds current centered profile (ex: profile17)

			var id_left = _get_boundary_by_coordinates(bound_center_left_x, bound_center_left_y);
			var id_right = _get_boundary_by_coordinates(bound_center_right_x, bound_center_right_y);

			var id_left_pos = Math.round(parseInt($("#"+id_left).offset().left));
			var id_right_pos = Math.round(parseInt($("#"+id_right).offset().left));
			
			
			if ((bound_center_left_x - id_left_pos) < Math.round(profile_width / 2))
			{
				scroller_center = parseInt(id_left.substring(id_left.indexOf(scroller_items_id)+scroller_items_id.length));
				scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
				scroller_end = scroller_center + Math.round(scroller_items /2) -1;
				// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
				
				var temp = "#"+scroller_items_id+scroller_center;
				var id_pos = Math.round($(temp).position().left);
				var id_x = id_pos;

				if (scroller_center == 1)
				{
					scroller_beg = scroller_center;
					scroller_mode_move_on = false;
					_ctrls_fix_first_page();
					scroller_counter = 1;
				}
				else
				{
					if (scroller_center == scroller_count)
					{
						scroller_end = scroller_center;
						scroller_mode_move_on = false;
						_ctrls_fix_last_page();
						scroller_counter = scroller_counter_max;
					}
					else
					{					
						_ctrls_fix_enable_all();
					}
				}
				sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
			}
			else
			{
				scroller_center = parseInt(id_right.substring(id_right.indexOf(scroller_items_id)+scroller_items_id.length));
				scroller_beg = scroller_center - Math.round(scroller_items /2) +1;
				scroller_end = scroller_center + Math.round(scroller_items /2) -1;
				// console.log("after adjustment: scroller_beg "+scroller_beg+" scroller_center "+scroller_center+" scroller_end "+scroller_end);
				
				var temp = "#"+scroller_items_id+scroller_center;
				var id_pos = Math.round($(temp).position().left);
				var id_x = id_pos;

				
				if (scroller_center == 1)
				{
					scroller_mode_move_on = false;
					_ctrls_fix_first_page();
					scroller_counter = 1;
				}
				else
				{
					if (scroller_center == scroller_count)
					{
						scroller_mode_move_on = false;
						_ctrls_fix_last_page();
						scroller_counter = scroller_counter_max;
					}
					else
					{
						_ctrls_fix_enable_all();
					}
				}
				sys.dom_scroller.scrollTo(id_x, scroller_freq_extra);
			}
		}});
	};
	
	// status ctrls funcs ==================================================================================================================
	
	function _ctrls_fix_first_page()
	{
		first_page_clickable = false;
		prev_page_clickable = false;
		next_page_clickable = true;
		last_page_clickable = true;
		$('#'+sys.target_row+'_first_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_first_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_prev_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_prev_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_next_page').css({"cursor":"pointer"}).attr("title", "next_page");
		$('#'+sys.target_row+'_next_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_last_page').css({"cursor":"pointer"}).attr("title", "last_page");
		$('#'+sys.target_row+'_last_page').children().removeClass("ctrls_disabled");
	}
	
	function _ctrls_fix_last_page()		
	{
		first_page_clickable = true;
		prev_page_clickable = true;
		next_page_clickable = false;
		last_page_clickable = false;
		$('#'+sys.target_row+'_first_page').css({"cursor":"pointer"}).attr("title", "first_page");
		$('#'+sys.target_row+'_first_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_prev_page').css({"cursor":"pointer"}).attr("title", "prev_page");
		$('#'+sys.target_row+'_prev_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_next_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_next_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_last_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_last_page').children().addClass("ctrls_disabled");
	}

	function _ctrls_fix_enable_all()		
	{								
		first_page_clickable = true;
		prev_page_clickable = true;
		next_page_clickable = true;
		last_page_clickable = true;
		$('#'+sys.target_row+'_first_page').css({"cursor":"pointer"}).attr("title", "first_page");
		$('#'+sys.target_row+'_first_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_prev_page').css({"cursor":"pointer"}).attr("title", "prev_page");
		$('#'+sys.target_row+'_prev_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_next_page').css({"cursor":"pointer"}).attr("title", "next_page");
		$('#'+sys.target_row+'_next_page').children().removeClass("ctrls_disabled");
		$('#'+sys.target_row+'_last_page').css({"cursor":"pointer"}).attr("title", "last_page");
		$('#'+sys.target_row+'_last_page').children().removeClass("ctrls_disabled");
	}	

	function _ctrls_fix_disable_all()		
	{
		first_page_clickable = false;
		prev_page_clickable = false;
		next_page_clickable = false;
		last_page_clickable = false;
		$('#'+sys.target_row+'_first_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_first_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_prev_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_prev_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_next_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_next_page').children().addClass("ctrls_disabled");
		$('#'+sys.target_row+'_last_page').css({"cursor":"default"}).attr("title", "");
		$('#'+sys.target_row+'_last_page').children().addClass("ctrls_disabled");
	}
	
	// FUNC UTILS ================================================================================================================================================ 
	
	function _get_boundary_by_coordinates(x, y)
	{    	      			
		boundary = document.elementFromPoint(Math.round(x), Math.round(y));			
		return boundary.getAttribute("id");			
	};
		
	function _get_items_count(right)				
	{
		var is_debug = false;
		
		//var left_id = left.getAttribute("id");
		var right_id = right.getAttribute("id");
		
		if (is_debug) { console.log("[_get_items_count] right_id bef: "+right_id); }
			
		scroller_items_id = right_id.substring(0, right_id.lastIndexOf("_")+1);
		if (is_debug) { console.log("[_get_items_count] : scroller_items_id: "+scroller_items_id); }
		
		//left_id = parseInt(left_id.substring(left_id.indexOf(scroller_items_id)+scroller_items_id.length));		
		right_id = (right_id == null) ? 0 : right_id = parseInt(right_id.substring(right_id.indexOf(scroller_items_id)+scroller_items_id.length));
		
		if (is_debug) { console.log("[_get_items_count] right_id aft: "+right_id); }
		
		//check if there are any items
		if (right_id != 0)			
		{																
			first_page_clickable = false;
			prev_page_clickable = false;
			
			$('#'+sys.target_row+'_first_page').css({"cursor":"default"});
			$('#'+sys.target_row+'_first_page').children().addClass("ctrls_disabled");
			$('#'+sys.target_row+'_prev_page').css({"cursor":"default"});
			$('#'+sys.target_row+'_prev_page').children().addClass("ctrls_disabled");				
			
			right_id--;				
										
			// scroller_items = right_id * 2 - 1;
			
			// static number placeholder remove later
			scroller_items = 13;
			
			if (is_debug) { console.log("[_get_items_count] scroller_items: "+scroller_items); }
			
			scroller_counter_max = 4; // static number placeholder remove later
			// mo scroller_counter_max = Math.round(scroller_count/scroller_items);
			
			if (is_debug) { console.log("[_get_items_count] scroller_counter_max: "+scroller_counter_max); }
		}
	};
	
	function _get_children_width_sum(parent)
	{
		var w = 0;
		
		parent.children().each(function()			
		{												
			w = w + $(this).outerWidth(true);
			// console.log("child id: "+$(this).attr("id")+" width: "+$(this).outerWidth(true));
		});
		// console.log("w: "+w);
		return w;
	};
};

// do not remove the bottom public functions =================================================================
scrolling.prototype.load_dependencies = function(p) 		{	this.__load__dependencies(p); 		};
scrolling.prototype.load_conf = function(p) 				{	this.__load_conf(p); 				};
scrolling.prototype.load_convas = function(p) 				{	this.__load_canvas(p); 				};
scrolling.prototype.load_callback = function(p) 			{	this.__load_callback(p); 			};

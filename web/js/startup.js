// css
document.write('<link rel="stylesheet" HREF="css/layout.css" TYPE="text/css" />');
// JS Library 
document.write('<script type="text/javascript" src="js/libs/jquery/jquery-1.8.1.js"></script>');
// JS Library Comps
document.write('<script type="text/javascript" src="js/libs/jquery/ui/jquery.effects.core.js"></script>');
// JS Library Plugins
document.write('<script type="text/javascript" src="js/libs/jquery/plugins/jquery.disable_highlighting.js"></script>');
document.write('<script type="text/javascript" src="js/libs/jquery/plugins/jquery.scrollTo.js"></script>');
// JS Comps
document.write('<script type="text/javascript" src="js/comps/available.js"></script>');
document.write('<script type="text/javascript" src="js/comps/scrolling.js"></script>');
document.write('<script type="text/javascript" src="js/comps/animation.js"></script>');
document.write('<script type="text/javascript" src="js/comps/ui.js"></script>');

window.onload = start

// constucts
var cons_radioinstitute;

function start()
{	
	cons_radioinstitute = new radioinstitute();
}

if (!radioinstitute) var radioinstitute = function(obj)
{		
	// declare sys as object to hold all values globally
	var sys = new Object();
	sys.init = false;
	
	// dependancies go here i.e: aka var cons_videoplayer = new VideoPlayers(); 
	sys.comp_scrolling1 = new scrolling( {"target":"#profile_row", "target_name":"profile", "target_pic":"pic_profile"} );
	// sys.comp_scrolling2 = new scrolling( {"target":"#video_row", "target_name":"video", "target_pic":"pic_video"} );
	// sys.comp_scrolling3 = new scrolling( {"target":"#audio_row", "target_name":"audio", "target_pic":"pic_audio"} );
	sys.comp_ui = new ui();
};
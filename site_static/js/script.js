$(document).ready(function(){	
$('#slogan').cycle({ 
    fx:      'fade', 
    speed:    3000, 
    timeout:  7000

});

$('.gal_item').cycle({ 
    
    speed:    3000, 
    timeout:  7000

});					
					
});


$(document).ready(function(){
	/* This code is executed after the DOM has been completely loaded */

	/* Changing thedefault easing effect - will affect the slideUp/slideDown methods: */
	$.easing.def = "jswing";

	/* Binding a click event handler to the links: */
	$('h2.button a').click(function(e){
	
		/* Finding the drop down list that corresponds to the current section: */
		var dropDown = $(this).parent().next();

		//this.style.color = "#a1c758";
		/* Closing all other drop down sections, except the current one */
		$('.dropdown').not(dropDown).slideUp('slow');
			
		
		dropDown.slideToggle('slow');
		
		 
		
		/* Preventing the default event (which would be to navigate the browser to the link's address) */
		e.preventDefault();
	})
		
});


 var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28453262-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

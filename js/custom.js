//Portfolio Isotope Document
jQuery(document).ready(function(){
jQuery(function(){

var jQuerycontainer = jQuery('.portfolio_container');

jQuerycontainer.isotope({
itemSelector : '.element'
});


var jQueryoptionSets = jQuery('#options .option-set'),
jQueryoptionLinks = jQueryoptionSets.find('a');

jQueryoptionLinks.click(function(){
var jQuerythis = jQuery(this);

if ( jQuerythis.hasClass('selected') ) {
return false;
}
var jQueryoptionSet = jQuerythis.parents('.option-set');
jQueryoptionSet.find('.selected').removeClass('selected');
jQuerythis.addClass('selected');


var options = {},
key = jQueryoptionSet.attr('data-option-key'),
value = jQuerythis.attr('data-option-value');

value = value === 'false' ? false : value;
options[ key ] = value;
if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {

changeLayoutMode( jQuerythis, options )
} else {

jQuerycontainer.isotope( options );
}

return false;
});


});
});



//Portfolio Image Hover
jQuery(document).ready(function(){
jQuery(this).find('.portfolio_link').stop().css("display","none");			 
jQuery(".portfolio_img").hover(function() {
jQuery(this).find('img').stop().animate({opacity: "0.3"}, 'fast');
jQuery(this).find('.portfolio_link').stop().css("display","block");
jQuery(this).find('.portfolio_link a img').stop().animate({opacity: "1"}, 'fast');

},
function() {
jQuery(this).find('.portfolio_link').stop().css("display","none");
jQuery(this).find('img').stop().animate({opacity: "1"}, 'fast');
});
});


// Nav Document
jQuery(document).ready(function() {
	jQuery('nav').onePageNav({
	begin: function() {
	console.log('start')
	},
	end: function() {
	console.log('stop')
	}
	});
	jQuery("a.example7").fancybox({
	'titlePosition'	: 'inside'
	});
});



// Responsive Menu
jQuery(function() {

jQuery("<select />").appendTo("nav");

	jQuery("<option />", {
	"selected": "selected",
	"value"   : "",
	"text"    : "Go to..."
	}).appendTo("nav select");

	jQuery("nav li a").each(function() {
	var el = jQuery(this);
	jQuery("<option />", {
	"value"   : el.attr("href"),
	"text"    : el.text()
	}).appendTo("nav select");
	});

	jQuery("nav select").change(function() {
	window.location = $(this).find("option:selected").val();
	});

});


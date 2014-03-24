$(document).ready(function() {

	$('#section1Load').load('partials/inicio.html #section1Cont');
	$('#ribbon').css("bottom", "-100px").load('partials/inicio.html #title').animate({"bottom": "77px"}, "3000");

});
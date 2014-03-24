'use strict';

/* Controllers */

angular.module('myApp.controllers', [])



.controller('obrasCtrl', [
	function() {
		$('#section1Load').load('partials/obras.html #section1Cont', function() {

			$(document).foundation("orbit", {
				pause_on_hover: true,
				resume_on_mouseout: true,
			});

			$(".prevSlider").click(function(){
				$("#section1Cont .orbit-prev").click();
			});

			$(".nextSlider").click(function(){
				$("#section1Cont .orbit-next").click();
			});


			$('#ribbon').css("bottom", "-100px").load('partials/obras.html #title', function() {


				$('#ribbon').css("bottom", "-100px").animate({
					"bottom": "77px"
				}, "3000");


			});

		});

		$(document).foundation();
	}
	])
.controller('especialidadesCtrl', [
	function() {
		$('#section1Load').load('partials/especialidades.html #section1Cont', function() {

			$(document).foundation("orbit", {
				pause_on_hover: true,
				resume_on_mouseout: true
			});

			$(".prevSlider").click(function(){
				$("#section1Cont .orbit-prev").click();
			});

			$(".nextSlider").click(function(){
				$("#section1Cont .orbit-next").click();
			});

			$('#ribbon').css("bottom", "-100px").load('partials/especialidades.html #title', function() {


				$('#ribbon').css("bottom", "-100px").animate({
					"bottom": "77px"
				}, "3000");


			});

		});



	}
	])


.controller('empresaCtrl', [
	function() {
		$('#section1Load').load('partials/empresa.html #section1Cont', function() {

			$(document).foundation("orbit", {
				pause_on_hover: true,
				resume_on_mouseout: true
			});

			$(".prevSlider").click(function(){
				$("#section1Cont .orbit-prev").click();
			});

			$(".nextSlider").click(function(){
				$("#section1Cont .orbit-next").click();
			});

			$('#ribbon').css("bottom", "-100px").load('partials/empresa.html #title', function() {

				$('#ribbon').css("bottom", "-100px").animate({
					"bottom": "77px"
				}, "3000");

			});

		});


	}
	])


.controller('revistaCtrl', [
	function() {
		$(document).foundation();
	}
	])


.controller('adminHomeCtrl', ['$scope', '$location',
	function($scope, $location) {
		$scope.view = "settings";

		$(document).foundation("orbit", {
			pause_on_hover: true,
			resume_on_mouseout: true
		});

		$(".prevSlider").click(function(){
			$("#section1Cont .orbit-prev").click();
		});

		$(".nextSlider").click(function(){
			$("#section1Cont .orbit-next").click();
		});

		$(".btnMenu").click(function() {

			$scope.view = $(this).attr("menu");
			$scope.$apply();

		});



		// ...
	}
	]).controller('adminInicioCtrl', ['$scope', '$state',
	function($scope, $state) {


		console.log("Inicio CTRL")
	}
	]);


/**************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 **************************************************************************
 
 **/

//function LoginCtrl($scope, $http) {}



//function signUpCtrl($scope, $http) {}
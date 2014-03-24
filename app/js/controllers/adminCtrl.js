angular.module('myApp.controllers').controller('adminCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {



		
		$scope.scrollTo = function(id) {
			$location.hash(id);
			$anchorScroll();
		};
		$scope.view = "HELLO WORLD";

		$scope.currState = "inicio";

		$scope.setState = function(sate) {
			$scope.currState = sate;
			$state.transitionTo('admin.' + $scope.currState);
		};

		$scope.test = function() {
			console.log("BLOBL");

		};

		//FOUNDATION SETUP

		$('#section1Load').load('partials/admin.html #section1Cont', function() {


			$('#ribbon').css("bottom", "-100px").load('partials/admin.html #title', function() {

				$('#ribbon').css("bottom", "-100px").load('partials/admin.html #title').animate({
					"bottom": "77px"
				}, "3000");

				$(document).foundation("orbit", {
					pause_on_hover: true,
					resume_on_mouseout: true
				});

				$("#section1Cont .prevSlider").click(function(){
					$(".orbit-prev").click();
				});

				$("#section1Cont .nextSlider").click(function(){
					$(".orbit-next").click();
				});

			});
		});


	
	}

]);
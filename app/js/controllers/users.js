angular.module('myApp.controllers').controller('usersCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {



		$scope.currentUser = $AuthService.currentUser;

		$scope.logOut = $AuthService.logOut;



		$scope.currState = "inicio";

		$scope.setState = function(sate) {
			$scope.currState = sate;
			$state.transitionTo('users.' + $scope.currState);

		};


		$scope.Setup = function() {

			if (!$scope.currentUser.isLoggedIn) {

				$state.transitionTo("inicio");
				$("#logIn").foundation("reveal", "open");

				return false;

			}

			$('#section1Load').load('partials/users.html #section1Cont', function() {


				$(document).foundation("orbit", {
					pause_on_hover: true,
					resume_on_mouseout: true,
				});

				$(".prevSlider").click(function(){
					$(".orbit-prev").click();
				});

				$(".nextSlider").click(function(){
					$(".orbit-next").click();
				});

				$('#ribbon').css("bottom", "-100px").load('partials/users.html #title', function() {

					$('#ribbon').css("bottom", "-100px").animate({
						"bottom": "77px"
					}, "3000");


				});
			});



		};
		$scope.Setup();

	}
]);
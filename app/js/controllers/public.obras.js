angular.module('myApp.controllers').controller('publicObrasCtrl', ['$scope', '$state', '$http', 'AuthService', '$anchorScroll', '$location',
	function($scope, $state, $http, $AuthService, $AnchorScrollProvider, $location) {

		$scope.checkError = function(inputName, erroName) {

			return $scope.frmObra[inputName].$dirty && $scope.frmObra[inputName].$error[erroName];

		};


		$scope.scrollTo = function(id) {
			


			$('#otrasObras').goTo();
			
			

		}


		$scope.verObra = function (o) {
			
			$scope.ultimaObra = o;
		}

		$scope.getObras = function() {


			$http({
				method: 'GET',
				url: ServicesHost + 'getObras',

			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available



				$scope.obrasList = result;
				$scope.ultimaObra = $scope.obrasList[$scope.obrasList.length - 1];



			}).
			error(function(error, status, headers, config) {


				$("#dlgMessages").find("section").html('<div>' + error + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};



		$scope.Setup = function() {
			// body...

			$scope.currentUser = $AuthService.currentUser;

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
			$scope.getObras();
			
		}();

	}

]);
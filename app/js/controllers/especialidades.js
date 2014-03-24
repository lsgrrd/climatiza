angular.module('myApp.controllers').controller('especialidadesCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {


		$scope.getEspecialidades = function() {
			$http({
				method: 'GET',
				url: ServicesHost + 'getEspecialidades'

			}).
			success(function(especialidades, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.especialidadesList = especialidades;
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});
		}



		$scope.Setup = function() {


			$('#section1Load').load('partials/especialidades.html #section1Cont', function() {

				$(document).foundation("orbit", {
					pause_on_hover: true,
					resume_on_mouseout: true
				});

				$(".prevSlider").click(function() {
					$(".orbit-prev").click();
				});

				$(".nextSlider").click(function() {
					$(".orbit-next").click();
				});

				$('#ribbon').css("bottom", "-100px").load('partials/especialidades.html #title', function() {

					$('#ribbon').css("bottom", "-100px").animate({
						"bottom": "77px"
					}, "3000");
				});

			});
			$scope.getEspecialidades();



		}();


	}

]);
angular.module('myApp.controllers').controller('adminEspecialidadesCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {
		//Form Mode
		$scope.mode = "Agregar";

		$scope.checkError = function(inputName, erroName) {
			return $scope.frmEspecialidad[inputName].$dirty && $scope.frmEspecialidad[inputName].$error[erroName];

		}



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

		$scope.agregarEspecialidad = function(especialidad) {

			$http({
				method: 'POST',
				url: ServicesHost + 'agregarEspecialidad',
				data: {
					especialidad: especialidad
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available


				$scope.esp = {};
				$scope.frmEspecialidad.$setPristine();
				$scope.getEspecialidades();



				$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.


				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});

		};


		$scope.editarEspecialidad = function(e) {
			$scope.mode = "Editar";
			$scope.esp = angular.copy(e);
			$("#espModal").foundation("reveal", "open");
		};

		$scope.actualizarEspecialidad = function(e) {

			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarEspecialidad',
				data: {
					especialidad: e
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available


				$scope.esp = {};
				$scope.frmEspecialidad.$setPristine();
				$scope.getEspecialidades();



				$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.


				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});

		}

		$scope.eliminarEspecialidad = function(especialidad) {
			var row = $("<div class='row'>");
			var cont = $("<div class='large-4 columns large-offset-4'>");
			var message = $("<center><h3>Eliminar?</h3></center>");
			var ok = $("<button class='large-6'>Sí</button>");
			var cancel = $("<button class='large-6'>No</button>");

			row.append(cont);

			cont.append(message).append(ok).append(cancel);

			$("#dlgMessages").find("section").empty().append(row);
			$("#dlgMessages").foundation("reveal", "open");

			cancel.click(function() {
				$("#dlgMessages").foundation("reveal", "close");
			});

			ok.click(_.once(function() {
				$scope.$apply(function(){
					$http({
						method: 'POST',
						url: ServicesHost + 'eliminarEspecialidad',
						data: {
							_id: especialidad._id
						}
					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available



					$scope.getEspecialidades();



					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
				}).
					error(function(result, status, headers, config) {


						$("#dlgMessages").find("section").html('<div>' + result + '</div>');
						$("#dlgMessages").foundation("reveal", "open");
					});

				});

			}));


		};


		$scope.Setup = function() {
			$scope.getEspecialidades();
		}();


	}

	]);
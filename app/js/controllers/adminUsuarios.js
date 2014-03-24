angular.module('myApp.controllers').controller('adminUsuariosCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {
		$scope.ModeTitle = "Agregar Usuario";
		$scope.getUsuarios = function() {


			$http({
				method: 'GET',
				url: ServicesHost + 'getUsers',

			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available



				$scope.usuarios = result;



			}).
			error(function(error, status, headers, config) {


				$("#dlgMessages").find("section").html('<div>' + error + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};



		$scope.prepararUsuario = function(mode, u) {

			$scope.tmpCopy = {};
			angular.copy(u, $scope.tmpCopy);
			$scope.Mode = mode;
			if (mode == 'Insert') {

				$scope.ModeTitle = "Agregar Usuario";
				console.log("ASASD");
			} else if (mode == 'Edit') {
				$scope.ModeTitle = "Editar Usuario";

				$scope.user = u;



				//$scope.frmUser = u;
			}



			$("#agregarUsuario").foundation("reveal", "open");
		};

		$scope.restaurarUsuario = function() {


			angular.copy($scope.tmpCopy, $scope.user);

			$scope.user = {};
			$scope.frmUser.$setPristine();

			$("#agregarUsuario").foundation("reveal", "close");
		};


		$scope.agregarUsuario = function(u) {


			$http({
				method: 'POST',
				url: ServicesHost + 'agregarUsuario',
				data: u
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.user = {};
				$scope.frmUser.$setPristine();
				$("#dlgMessages").foundation("reveal", "close");
				$scope.getUsuarios();
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};



		$scope.editarUsuario = function(u) {


			$http({
				method: 'POST',
				url: ServicesHost + 'editarUsuario',
				data: {
					user: u
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.user = {};
				$scope.frmUser.$setPristine();
				$("#dlgMessages").foundation("reveal", "close");
				$scope.getUsuarios();

			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};



		$scope.eliminarUsuario = function(u) {



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
						url: ServicesHost + 'eliminarUsuario',
						data: {
							user: u
						}
					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getUsuarios();
					$("#dlgMessages").foundation("reveal", "close");
				}).
					error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					$("#dlgMessages").find("section").html('<div>' + data + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
				});
				});

			}));



		};



		$scope.procesarUsuario = function(u) {

			if ($scope.Mode == 'Insert') {

				$scope.agregarUsuario(u);
			} else if ($scope.Mode == 'Edit') {
				$scope.editarUsuario(u);

			}
		};
		$scope.getUsuarios();
	}

	]);
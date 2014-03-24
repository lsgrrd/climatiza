angular.module('myApp.controllers').controller('adminCategoriasCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {

		$scope.mode = 'Insertar';
		$scope.checkError = function(inputName, erroName) {
			return $scope.frmCategoria[inputName].$dirty && $scope.frmCategoria[inputName].$error[erroName];

		}

		$scope.editarCategoria = function(categoria){
			$scope.categoria = categoria;
			$scope.mode = 'Actualizar';
			$("#mdlCategoriaFrm").foundation("reveal","open");
		}


		$scope.insertarCategoria = function(categoria){
			$scope.categoria = categoria;
			$scope.mode = 'Insertar';
			$("#mdlCategoriaFrm").foundation("reveal","open");
		}

		$scope.procesarCategoria = function(categoria){
			if($scope.frmCategoria.$invalid){
				return false;
			}
			if($scope.mode =='Insertar'){
				$scope.agregarCategoria(categoria);					
			}else if($scope.mode=='Actualizar'){
				
				$scope.actualizarCategoria(categoria);					
			}
		}


		$scope.actualizarCategoria = function(categoria) {

			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarCategoria',
				data: {
					categoria: categoria
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available


				$scope.categoria = {};
				$scope.frmCategoria.$setPristine();
				$scope.getCategorias();



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

		$scope.agregarCategoria = function(categoria) {

			$http({
				method: 'POST',
				url: ServicesHost + 'agregarCategoria',
				data: {
					categoria: categoria
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available


				$scope.categoria = {};
				$scope.frmCategoria.$setPristine();
				$scope.getCategorias();



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

		$scope.getCategorias = function() {
			$http({
				method: 'GET',
				url: ServicesHost + 'getCategorias'

			}).
			success(function(categorias, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.categoriasList = categorias;
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});
		}

		$scope.getCategorias();



		$scope.eliminarCategoria = function(id) {


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
						url: ServicesHost + 'eliminarCategoria',
						data: {
							Id_Categoria: id
						}
					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available



					$scope.getCategorias();



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

	}
	])
angular.module('myApp.controllers').controller('adminComprasCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {

		$scope.cotizacionesList = [];
		$scope.isEdit = false;
		
		$scope.checkError = function(inputName, erroName) {
			return $scope.frmCompra[inputName].$dirty && $scope.frmCompra[inputName].$error[erroName];

		}

		$scope.getCompras = function() {

			$http({
				method: 'GET',
				url: ServicesHost + 'getComprasAdmin'

			}).
			success(function(comprasList, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.comprasList = comprasList;

			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});
		};


		$scope.getTotal = function(cot) {

			var value = _.reduce(cot.productos, function(acc, p) {
				//acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + p.cantidad * p.Precio);
				acc += parseFloat(p.cantidad * p.Precio);
				return parseFloat(acc);
			}, []);

			if (value === Math.round(value)) {
				return value + ".00";
			} else {
				return value;
			}


		};


		$scope.editarNumeroFactura = function(com,numeroFactura) {
			$scope.currentCompra = com;
			$scope.numFactura = com.numeroFactura;
			$scope.titulo = "Editar numero de factura";
			$scope.isEdit = true;
			$("#addNumFac").foundation("reveal","open");


		};

		$scope.agregarNumeroFactura = function(com) {
			$scope.currentCompra = com;

			$scope.isEdit = false;
			$scope.titulo = "Finalizar compra";
			$("#addNumFac").foundation("reveal","open");


		};



		$scope.finalizarCompra = function(_id,num) {


			
			$http({
				method: 'POST',
				url: ServicesHost + 'finalizarCompra',
				data: {
					_id: _id,
					numeroFactura:num,
					compra:$scope.currentCompra

				}

			}).
			success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.frmCompra.$setPristine();
					$scope.numFactura = undefined;
					$scope.getCompras();
					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");

				}).
			error(function(result, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					console.log(result);
				});



		};




		$scope.actualizarNumeroFactura = function(_id,num) {


			
			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarNumeroFactura',
				data: {
					_id: _id,
					numeroFactura:num,
					compra:$scope.currentCompra

				}

			}).
			success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getCompras();
					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");

				}).
			error(function(result, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					console.log(result);
				});



		};




		$scope.eliminarCompra = function(_id) {

			//console.log(p);

			var row = $("<div class='row'>");
			var cont = $("<div class='large-4 columns large-offset-4'>");
			var message = $("<center><h3>Cancelar la compra?</h3></center>");
			var ok = $("<button class='large-6'>Sí</button>");
			var cancel = $("<button class='large-6'>No</button>");

			row.append(cont);

			cont.append(message).append(ok).append(cancel);

			$("#dlgMessages").find("section").empty().append(row);
			$("#dlgMessages").foundation("reveal", "open");

			cancel.click(function() {
				
				$("#dlgMessages").foundation("reveal","close");
				$(".reveal-modal-bg").remove();
			});

			ok.click(_.once(function() {

				$scope.$apply(function(){



					$http({
						method: 'POST',
						url: ServicesHost + 'eliminarCompra',
						data: {
							_id: _id

						}

					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getCompras();
					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");

				}).
					error(function(result, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					console.log(result);
				});




				});
			}));






		};


		$scope.getServicioDate = function(Fecha,servicio){
			if(!servicio){
				return "";
			}
			var fechaDeCompra = new Date(Fecha);
			
			var servicioDate = new Date(new Date(fechaDeCompra).setMonth(fechaDeCompra.getMonth()+servicio));
			return servicioDate;
		}


		$scope.getCompras();
	}
	]);
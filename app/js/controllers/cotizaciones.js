angular.module('myApp.controllers').controller('usersCotizacionesCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {

		$scope.cotizacionesList = [];

		$scope.getCotizaciones = function() {

			$http({
				method: 'GET',
				url: ServicesHost + 'getCotizaciones'

			}).
			success(function(cotizacionesList, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.cotizacionesList = cotizacionesList;

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


		$scope.realizarCompra = function(_id) {


			//console.log(p);

			var row = $("<div class='row'>");
			var cont = $("<div class='large-6 columns large-offset-3'>");
			var message = $("<center><h3>Desea enviar la cotizacion a Climatiza?</h3></center>");
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
						url: ServicesHost + 'comprarCotizacion',
						data: {
							_id: _id

						}

					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getCotizaciones();
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


		$scope.eliminarCotizacion = function(_id) {

			//console.log(p);

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
						url: ServicesHost + 'eliminarCotizacion',
						data: {
							_id: _id

						}

					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getCotizaciones();
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



		$scope.getCotizaciones();
	}
	]);
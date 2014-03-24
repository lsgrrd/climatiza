'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
value('version', '0.1')

.factory('AuthService', ['$http', '$state',
	function($http, $state) {

		var currentUser = {
			"Carrito": [],
			"isLoggedIn": false,
			"email":"",
			"nombreCompleto":"",
			"telefono":"",
			"direccion":""
		};


		(function userSession() {
			$http({
				method: 'GET',

				url: ServicesHost + "userSession"


			}).success(function(user) {

				if (user) {
					_.extend(currentUser, user);
					currentUser.isLoggedIn = true;
				}



			});

		})();



		return {

			login: function() {},
			logOut: function() {

				$http({
					method: 'GET',

					url: ServicesHost + "logOut"


				}).success(function() {



					currentUser.username = undefined;
					currentUser.isLoggedIn = false;
					currentUser.rol = undefined;

					$state.transitionTo("inicio");
					$("#dlgMessages").find("section").html('<div><h4>Sesión cerrada con exito</h4></div>');
					$("#dlgMessages").foundation("reveal", "open");



				});


			},
			isLoggedIn: function() {

			},
			currentUser: currentUser

		};
	}
	]).factory('ProductosHome', ['$http', '$state', '$q',
	function($http, $state, $q) {

		var row1 = [];
		var row2 = [];


		
		return $http({
			method: 'GET',
			url: ServicesHost + 'getProductosHome'

		}).success(function(productos, status, headers, config) {
						// this callback will be called asynchronously
						// when the response is available
						

						var n = 4;
						var lists = _.groupBy(productos, function(a, b){
							return Math.floor(b/n);
						});
						lists = _.toArray(lists);

						row1 = lists[0];

						row2 = lists.length>1 ? lists[1] : [];

						return {"row1":row1,"row2":row2}

					}).error(function(result, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.

						console.log(result);
					});


					
				}
				]);
angular.module('myApp.controllers').controller('usersPerfilCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {
		$scope.currentUser = {};
		angular.copy($AuthService.currentUser, $scope.currentUser) ;

		console.log($scope.currentUser);

		$scope.acutualizarUsuario = function(){

			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarPerfil',
				data: {
					user:$scope.currentUser

				}

			}).success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$AuthService.currentUser = $scope.currentUser;
				$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
				$("#dlgMessages").foundation("reveal", "open");

			}).error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});

		};
	}
	]);
angular.module('myApp.controllers').controller('contactCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {


		$scope.sendMsg = function(){
			
			console.log($scope.msg);



			$http({
				method: 'POST',
				url: ServicesHost + 'mensaje',
				data: {
					msg: $scope.msg
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = {};
				$scope.frmContact.$setPristine();
				$("#frmContact")[0].reset();
				$("#dlgMessages").find("section").html('<div>' + "Mensaje enviado con exito" + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
				

			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});

		};
		

		$scope.closeContactForm = function(){

			$scope.msg = {};
			$scope.frmContact.$setPristine();
			$("#frmContact")[0].reset();

			$("#contactoModal").foundation("reveal","close");
		};
	}
	]);
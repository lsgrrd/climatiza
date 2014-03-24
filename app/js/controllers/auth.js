angular.module('myApp.controllers').controller('LoginCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {

		$scope.currentUser = $AuthService.currentUser;

		$scope.loginFailed = false;

		$scope.reset = function(user, frmLogin) {
			console.log("LOL");

			//$scope.frmSignUp = $scope.defaultForm;
		};
		$scope.userLogin = function(user, form) {

			if (form.$valid) {
				$scope.loginFailed = false;
				$("#frmLogin").find("button").attr("disabled", "disabled");


				var xsrf = $.param({
					username: user.username,
					password: user.password

				});

				$http({
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					url: ServicesHost + "logIn",
					data: xsrf,

				}).success(function(result) {

					if (result.isAuthenticated) {

						$scope.user = {};
						$scope.frmLogin.$setPristine();
						$scope.currentUser.username = user.username;
						$scope.currentUser.isLoggedIn = true;
						$scope.currentUser.rol = result.rol;
						$scope.currentUser.nombreCompleto = result.nombreCompleto;
						$scope.currentUser.email = result.email;
						$scope.currentUser.telefono = result.telefono;
						$scope.currentUser.direccion = result.direccion;


						$("#dlgMessages").find("section").html('<div><h4>Bienvenido ' + user.username + '</h4></div>');
						$("#dlgMessages").foundation("reveal", "open");


					} else {
						$scope.loginFailed = true;
						$("#frmLogin").find("button").removeAttr("disabled");


					}



				});


			}

		};

	}
]);



angular.module('myApp.controllers').controller('signUpCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {



		$scope.submitted = false;
		$scope.defaultForm = $scope.frmSignUp;
		$scope.reset = function() {
			$scope.user = {};
			$scope.frmSignUp.$setPristine();
			//$scope.frmSignUp = $scope.defaultForm;
		};

		$("#singUp").bind("closed", function() {


			$("#frmSignUp")[0].reset();
			$("small.error").hide();
			$("#msgSignUpSuccess").hide();
			$scope.submitted = false;
			$scope.reset();


		});



		$scope.userSignUp = function(user, form) {
			$scope.submitted = true;
			if (form.$valid) {


				var xsrf = $.param({
					username: form.username.$modelValue,
					password: form.password.$modelValue,
					email: form.email.$modelValue,
					nombreCompleto: user.nombreCompleto,
					direccion: user.direccion,
					telefono: user.telefono,
				});

				$http({
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					url: ServicesHost + "signUp",
					data: xsrf
				}).success(function(data) {

					console.log(data);


					$("#dlgMessages").find("section").html('<div><h4>Usuario registrado exitosamente</h4></div> <a class="button large-12" data-reveal-id="logIn">Iniciar Sesión</a>');
					$("#dlgMessages").foundation("reveal", "open");


					$scope.reset();
				});

			}

		};



	}
]);



angular.module('myApp.controllers').controller('menuCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {

		$scope.currentUser = $AuthService.currentUser;

		$scope.logOut = $AuthService.logOut;
		
		$scope.isAdmin = function() {

			if ($scope.currentUser.isLoggedIn && $scope.currentUser.rol === 'ADMIN') {
				return true;
			} else {
				return false;
			}

		}

	}
]);
angular.module('myApp.controllers').controller('catalogoCtrl', ['$scope', '$state', '$http', 'AuthService',
	function($scope, $state, $http, $AuthService) {

		$scope.pageSize = 9;
		$scope.currentPage = 1;
		$scope.totalPages = 1;
		$scope.Carrito = $AuthService.currentUser.Carrito;
		$scope.currentUser = $AuthService.currentUser;
		$scope.currentImageIndex = 0;


		$scope.getImg = function(imgPath, imgName, extra) {

			if (imgPath && imgName) {
				if (extra) {
					return imgPath + imgName + extra;
				} else {
					return imgPath + imgName;
				}
			} else {
				return "/img/noDisponible.jpg";
			}
		}
		$scope.showProductDetails = function(p) {

			$scope.currentProduct = p;
			$scope.cantidad = 1;
			$("#productDetails").foundation("reveal", "open");

		};

		$scope.closeProductDetails = function(p) {


			$scope.currentProduct = {};
			$scope.cantidad = 0;
			$scope.currentImageIndex = 0;
			$("#productDetails").foundation("reveal", "close");

		};



		$scope.getProductos = function() {
			var params = null
			if ($scope.catFilter) {
				if (!params) params = {};
				params.catFilter = $scope.catFilter;

			}

			if ($scope.sortFilter) {
				if (!params) params = {};
				params.sortFilter = $scope.sortFilter;
			}

			$http({
				method: 'GET',
				url: ServicesHost + 'getProductos',
				params: {
					catFilter: $scope.catFilter,
					sortFilter: $scope.sortFilter,
					pageSize: $scope.pageSize,
					currentPage: $scope.currentPage
				}

			}).
			success(function(productos, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.productosList = productos.list;
				$scope.totalSize = productos.totalSize
				$scope.totalPages = productos.totalPages;
				console.log($scope.$stateParams);
				if($scope.$stateParams.Id_Producto){

					
					var p =_($scope.productosList).where({Id_Producto:$scope.$stateParams.Id_Producto})[0];
					if(p){

						$scope.$stateParams.Id_Producto = ""
						$scope.showProductDetails (p);
							
					}

				}
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});
		};

		$scope.setPage = function(i) {
			if ($scope.currentPage != i && i !== 0 && i <= $scope.totalPages) {

				$scope.currentPage = i;
				$scope.getProductos();
			}
		};

		$scope.AgregarProducto = function(producto, cantidad) {

			if (producto && cantidad) {


				var existingProd = _.filter($scope.Carrito, function(p) {


					return p.Id_Producto === producto.Id_Producto;

				});

				if (existingProd.length > 0) {
					var prodIndex = $scope.Carrito.indexOf(existingProd[0]);
					$scope.Carrito[prodIndex].cantidad += cantidad;

				} else {
					producto.cantidad = cantidad;

					$scope.Carrito.push(producto);
				}

				$("#productDetails").foundation("reveal", "close");

			} else {
				console.log("Missing parameters");
			}


		};



		$scope.RemoveProducto = function(producto) {



			var prod = _.filter($scope.Carrito, function(p) {


				return p.Id_Producto === producto.Id_Producto;

			})[0];

			var prodIndex = $scope.Carrito.indexOf(prod);
			$scope.Carrito.splice(prodIndex, 1);



		};

		$scope.GetCurrentTotal = function() {

			if ($scope.Carrito.length > 0) {

				var currentTotal = 0;

				_.forEach($scope.Carrito, function(p) {


					currentTotal += p.cantidad * p.Precio;
				});

				return currentTotal;

			} else {

				return 0;
			}
		};


		$scope.test = function() {

			$scope.catFI
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


		/*************************************************************************************/

		$scope.getNumber = function(num) {
			return new Array(num);
		}



		$scope.guardarCotizacion = function(esCompra) {

			var tmpCart = $scope.Carrito;
			if (tmpCart.length < 1) {


				return false;
			}

			tmpCart = _.map(tmpCart, function(i) {
				return _.pick(i, "Id_Producto", "cantidad", "Descripcion", "Precio", "Nombre");
			});


			$http({
				method: 'POST',
				url: ServicesHost + 'guardarCotizacion',
				data: {
					Carrito: tmpCart,
					esCompra: esCompra
				}

			}).
			success(function(categorias, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.Carrito.length = 0;
				if (!esCompra) {
					$state.transitionTo("users.cotizaciones");
				}
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});



		};



		$scope.procesarCotizacion = function(mode) {
			if ($scope.currentUser.isLoggedIn) {
				if (mode === "Guardar") {

					$scope.guardarCotizacion(false);



				} else if (mode === "Comprar") {


					$scope.guardarCotizacion(true);
				}
			} else {

				$("#logIn").foundation("reveal", "open");
			}

		};



		$scope.nextImage = function() {
			if ($scope.currentImageIndex + 1 == $scope.currentProduct.imagenes.length) {
				$scope.currentImageIndex = 0;
			} else {
				$scope.currentImageIndex += 1;
			}
		}

		$scope.prevImage = function() {
			if ($scope.currentImageIndex - 1 < 0) {
				$scope.currentImageIndex = $scope.currentProduct.imagenes.length - 1;
			} else {
				$scope.currentImageIndex -= 1;
			}
		}


		$scope.showFichaTecnica = function(){


			$("#fichaReveal").foundation("reveal","open");
		};


		$scope.Setup = function() {


			$scope.catFilter = "";
			$scope.sortFilter = "";
			$scope.getCategorias();
			$scope.getProductos();


			$('#section1Load').load('partials/catalogo.html #section1Cont', function() {

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

				$('#ribbon').css("bottom", "-100px").load('partials/catalogo.html #title', function() {

					$('#ribbon').css("bottom", "-100px").animate({
						"bottom": "77px"
					}, "3000");
				});

			});


		}();



	}
	]);
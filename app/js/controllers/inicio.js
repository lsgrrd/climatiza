		angular.module('myApp.controllers').controller('inicioCtrl', ['$scope', '$state', '$http',
			function($scope, $state, $http) {

				$scope.row1 = [];
				$scope.row2= [];
				$scope.getProductos = function() {
					$http({
						method: 'GET',
						url: ServicesHost + 'getProductosHome'

					}).
					success(function(productos, status, headers, config) {
						// this callback will be called asynchronously
						// when the response is available
						

						var n = 4;
						var lists = _.groupBy(productos, function(a, b){
							return Math.floor(b/n);
						});
						lists = _.toArray(lists);

						$scope.row1 = lists[0];

						$scope.row2 = lists.length>1 ? lists[1] : [];
						$('#section1Load').load('partials/inicio.html #section1Cont', function() {

							$(document).foundation("orbit", {
								pause_on_hover: true,
								resume_on_mouseout: true,
							});

							$(".prevSlider").click(function(){
								$("#section1Cont .orbit-prev").click();
							});

							$(".nextSlider").click(function(){
								$("#section1Cont .orbit-next").click();
							});



						});


						$('#ribbon').css("bottom", "-100px").load('partials/inicio.html #title', function() {


							$('#ribbon').css("bottom", "-100px").animate({
								"bottom": "77px"
							}, "3000");

						});


					}).
		error(function(result, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.

						console.log(result);
					});
	};


	$scope.showProductDetails = function(p){
		
		$state.transitionTo('catalogo',{Id_Producto:p.Id_Producto});
		



	};


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
	$scope.closeReveal = function(){

		$("#dlgMessages").foundation("reveal","close");
		$(".reveal-modal-bg").remove();
	};

	$scope.Setup = function(argument) {
						// body...
						
						
						$scope.getProductos();


					}();		}
					]);
angular.module('myApp.controllers').controller('adminProductosCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {

		$scope.descLength = 50;
		$scope.currentProductId = 0;
		$scope.cropIndex = 0;
		$scope.ProductMode = "Insert";
		$scope.cropImageSrc = "http://someurl.com";

		$scope.test2 = function() {

			console.log("BLAB");
		}
		$scope.checkError = function(inputName, erroName) {

			return $scope.frmProducto[inputName].$dirty && $scope.frmProducto[inputName].$error[erroName];

		}
		$scope.resetForm = function() {
			$scope.producto = {};
			$scope.frmProducto.$setPristine();
			//$scope.frmSignUp = $scope.defaultForm;
		};


		$scope.agregarImagen = function(Id_Producto) {

			$('#upload').unbind('fileuploadsubmit');
			$('#upload').unbind('fileuploaddone');

			$('#upload').bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:

				data.formData = {
					Id_Producto: Id_Producto
				};

			});

			
			$('#upload').bind("fileuploaddone", function(e, data) {


				$scope.$apply(function() {
					$scope.getProductos();
					$("#dlgMessages").find("section").html('<div>' + data.jqXHR.responseText + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
					$("#upload ul li").remove()

				});


			});


			$("#imgUpLoad").foundation("reveal", "open");

		};


		

		$scope.agregarFichaTecnica = function(Id_Producto) {

			//console.log(Id_Producto);
			$('#frmFichaUpload').unbind('fileuploadsubmit');


			$('#frmFichaUpload').bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:

				data.formData = {
					Id_Producto: Id_Producto
				};

			});

			$('#frmFichaUpload').bind("fileuploaddone", function(e, data) {


				$scope.$apply(function() {
					$scope.getProductos();
					$("#dlgMessages").find("section").html('<div>' + data.jqXHR.responseText + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
				});


			});

			

			$("#fichaUpload").foundation("reveal", "open");

		};



		function updatePreview(c) {
			if (parseInt(c.w) > 0) {
				// Show image preview
				var imageObj = $("#croppable")[0];
				var canvas = $("#preview")[0];
				var context = canvas.getContext("2d");
				context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
			}
		};


		var jcrop_api;

		$scope.nextImage = function() {
			if ($scope.cropIndex + 1 >= $scope.currentProduct.imagenes.length) {
				$scope.cropIndex = 0;
			} else {
				console.log("Next");
				$scope.cropIndex += 1;
			}

			$scope.cropImageSrc = "ImagenesProductos/" + $scope.currentProduct.imagenes[$scope.cropIndex].imageName;

			$scope.confirmDeleteImageFlag=false;
			jcrop_api.setImage($scope.cropImageSrc);

		};



		$scope.previousImage = function() {
			console.log("Prev");
			if ($scope.cropIndex - 1 < 0) {
				$scope.cropIndex = $scope.currentProduct.imagenes.length - 1;
			} else {
				console.log("Prev");
				$scope.cropIndex -= 1;
			}
		$scope.confirmDeleteImageFlag=false;	
			$scope.cropImageSrc = "ImagenesProductos/" + $scope.currentProduct.imagenes[$scope.cropIndex].imageName;
			jcrop_api.setImage($scope.cropImageSrc);
		};



		var initjCrop = _.once(function() {



			function updatePreview(c) {
				if (parseInt(c.w) > 0) {
					// Show image preview
					var imageObj = $("#croppable")[0];
					var canvas = $("#preview")[0];
					var context = canvas.getContext("2d");
					context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
				}
			};



			$('#croppable').Jcrop({

				boxWidth: 450,
				boxHeight: 400,

				onChange: updatePreview,
				onSelect: updatePreview,
				aspectRatio: 1
			}, function() {
				jcrop_api = this
				jcrop_api.setImage($scope.cropImageSrc);
			});



		});

		$("#crop").bind("opened", function() {
			initjCrop();
			if (jcrop_api) {
				jcrop_api.setImage($scope.cropImageSrc);
			}


		});

		$scope.cropImagenes = function(p) {

			$scope.currentProduct = p;
			$scope.cropIndex = 0;
			if (p.imagenes && p.imagenes.length > 0) {
				$scope.cropImageSrc = "ImagenesProductos/" + p.imagenes[$scope.cropIndex].imageName;
			} else {
				$scope.cropImageSrc = ServicesHost+"img/noDisponible.jpg";

			}



			$("#crop").foundation("reveal", "open");

		}



		$scope.saveCrop = function(producto) {

			var canvas = $("#preview")[0];
			var imgBase64 = canvas.toDataURL();

			$http({
				method: 'POST',
				url: ServicesHost + 'agregarThumb',
				data: {
					Id_Producto: $scope.currentProduct.Id_Producto,
					imgBase64: imgBase64
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available

				$scope.producto = {};
				$scope.frmProducto.$setPristine();
				$scope.getProductos();


				$("#dlgMessages").find("section").html('<div>' + result + '</div>');
				$("#dlgMessages").foundation("reveal", "open");


			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});

		};


		$scope.agregarProducto = function(producto) {

			$http({
				method: 'POST',
				url: ServicesHost + 'agregarProducto',
				data: {
					producto: producto
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available

				$scope.producto = {};
				$scope.frmProducto.$setPristine();
				$scope.getProductos();


				$scope.agregarImagen(result.Id_Producto);
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});

		};

		$scope.actualizarProducto = function(producto) {

			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarProducto',
				data: {
					producto: producto
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available

				$scope.producto = {};
				$scope.frmProducto.$setPristine();
				$scope.getProductos();

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



		$scope.procesarProducto = function(mode, p) {
			$scope.getCategorias().success(function(a, b, c) {

				$scope.ProductMode = mode;
				if (mode === "Insert") {

					$scope.ProductTitle = "Agregar Producto";
					$scope.producto = {};
					//$scope.agregarProducto(p);

				} else if (mode === "Edit") {
					$scope.ProductTitle = "Editar Producto";

					$scope.producto = p;


				}

				$("#agregarProducto").foundation("reveal", "open");

			});

		};

		$scope.finalizarProducto = function(p) {

			if ($scope.ProductMode == "Insert") {

				$scope.agregarProducto(p);

			} else if ($scope.ProductMode == "Edit") {

				$scope.actualizarProducto(p);

			}

		}





		$scope.deleteImage = function(){

			
			var imageName = $scope.currentProduct.imagenes[$scope.cropIndex].imageName;

			// var imgID = imageName.split("_")[1].split(".")[0];
			// console.log(imgID);


			$http({
				method: 'POST',
				url: ServicesHost + 'deleteProductImage',
				data: {
					imageName: imageName
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.confirmDeleteImageFlag=false;	
				$scope.currentProduct.imagenes.splice($scope.cropIndex,1);
				if($scope.currentProduct.imagenes.length == 0){
					$("#crop").foundation("reveal","close");
				}else{
					
					$scope.previousImage();
				}
					

			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			$scope.confirmDeleteImageFlag=false;
				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};

		$scope.confirmDeleteImageFlag = false;

		$scope.confirmDeleteImage = function(){

			$scope.confirmDeleteImageFlag = true;

		};




		$scope.getProductos = function() {
			$http({
				method: 'GET',
				url: ServicesHost + 'getProductos'

			}).
			success(function(productos, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.productosList = productos.list;
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});
		}


		$scope.getCategorias = function() {
			var prom = $http({
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

			return prom;
		}

		$scope.eliminarProducto = function(p) {

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
						url: ServicesHost + 'eliminarProducto',
						data: {
							producto: {
								Id_Producto: p.Id_Producto,
								IdCategoria: p.IdCategoria
							}
						}
					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available

					if (result.error) {

					} else {

						$scope.getProductos();


					}

					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
				}).
					error(function(error, status, headers, config) {


						$("#dlgMessages").find("section").html('<div>' + error + '</div>');
						$("#dlgMessages").foundation("reveal", "open");
					});

				});
			}));

		};



		$scope.Setup = function() {



			$scope.getProductos();

			var ul = $('#upload ul');

			$('#drop a').click(function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$('#upload').fileupload({

				// This element will accept file drag/drop uploading
				dropZone: $('#drop'),

				// This function is called when a file is added to the queue;
				// either via the browse button, or via drag/drop:
				add: function(e, data) {

					var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"' +
						' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

					// Append the file name and file size
					tpl.find('p').text(data.files[0].name)
					.append('<i>' + formatFileSize(data.files[0].size) + '</i>');

					// Add the HTML to the UL element
					data.context = tpl.appendTo(ul);

					// Initialize the knob plugin
					tpl.find('input').knob();

					// Listen for clicks on the cancel icon
					tpl.find('span').click(function() {

						if (tpl.hasClass('working')) {
							jqXHR.abort();
						}

						tpl.fadeOut(function() {
							tpl.remove();
						});

					});

					// Automatically upload the file once it is added to the queue
					var jqXHR = data.submit();

					jqXHR.error(function(error) {



						$("#upload small.error").html(error.responseText);



					});
				},

				progress: function(e, data) {

					// Calculate the completion percentage of the upload
					var progress = parseInt(data.loaded / data.total * 100, 10);

					// Update the hidden input field and trigger a change
					// so that the jQuery knob plugin knows to update the dial
					data.context.find('input').val(progress).change();

					if (progress == 100) {
						data.context.removeClass('working');
					}
				},

				fail: function(e, data) {
					// Something has gone wrong!
					data.context.addClass('error');

				}

			});



var ul2 = $('#frmFichaUpload ul');

$('#fichaDrop a').click(function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$('#frmFichaUpload').fileupload({

				// This element will accept file drag/drop uploading
				dropZone: $('#fichaDrop'),

				// This function is called when a file is added to the queue;
				// either via the browse button, or via drag/drop:
				add: function(e, data) {

					var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"' +
						' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

					// Append the file name and file size
					tpl.find('p').text(data.files[0].name)
					.append('<i>' + formatFileSize(data.files[0].size) + '</i>');

					// Add the HTML to the UL element
					data.context = tpl.appendTo(ul2);

					// Initialize the knob plugin
					tpl.find('input').knob();

					// Listen for clicks on the cancel icon
					tpl.find('span').click(function() {

						if (tpl.hasClass('working')) {
							jqXHR.abort();
						}

						tpl.fadeOut(function() {
							tpl.remove();
						});

					});

					// Automatically upload the file once it is added to the queue
					var jqXHR = data.submit();

					jqXHR.error(function(error) {



						$("#frmFichaUpload small.error").html(error.responseText);



					});
				},

				progress: function(e, data) {

					// Calculate the completion percentage of the upload
					var progress = parseInt(data.loaded / data.total * 100, 10);

					// Update the hidden input field and trigger a change
					// so that the jQuery knob plugin knows to update the dial
					data.context.find('input').val(progress).change();

					if (progress == 100) {
						data.context.removeClass('working');
					}
				},

				fail: function(e, data) {
					// Something has gone wrong!
					data.context.addClass('error');

				}

			});



/*************************************************************************/



/************************************************************************/
/************************************************************************/
/************************************************************************/
/************************************************************************/
/************************************************************************/

			// Prevent the default action when a file is dropped on the window
			$(document).on('drop dragover', function(e) {
				e.preventDefault();
			});

			// Helper function that formats the file sizes

			



		};

		$scope.Setup();

	}
	]);
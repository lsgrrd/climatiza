angular.module('myApp.controllers').controller('adminObrasCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {

		$scope.checkError = function(inputName, erroName) {

			return $scope.frmObra[inputName].$dirty && $scope.frmObra[inputName].$error[erroName];

		}
		$scope.getObras = function() {


			$http({
				method: 'GET',
				url: ServicesHost + 'getObras',

			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available



				$scope.obrasList = result;



			}).
			error(function(error, status, headers, config) {


				$("#dlgMessages").find("section").html('<div>' + error + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});


		};

		$scope.getObras();

		$scope.Mode = "Insert";
		$scope.prepararObra = function(mode, o) {
			$scope.Mode = mode;
			if (mode === "Insert") {
				$scope.submitTitle = "Agregar Obra";
				$scope.obra = {};
			} else if (mode === "Edit") {
				$scope.submitTitle = "Actualizar Obra";
				$scope.obra = o;
			}
			$("#agregarObra").foundation("reveal", "open");

		};

		$scope.procesarObra = function(o) {



			if ($scope.Mode == "Insert") {

				$scope.agregarObra(o);

			} else if ($scope.Mode == "Edit") {


				$scope.actualizarObra(o);


			}


		};

		$scope.agregarObra = function(o) {


			$http({
				method: 'POST',
				url: ServicesHost + 'agregarObra',
				data: {
					obra: o
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.getObras();
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



		$scope.actualizarObra = function(o) {


			$http({
				method: 'POST',
				url: ServicesHost + 'actualizarObra',
				data: {
					obra: o
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.getObras();

			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				$("#dlgMessages").find("section").html('<div>' + data + '</div>');
				$("#dlgMessages").foundation("reveal", "open");
			});



		};


		$scope.agregarLogoObra = function(o) {


			$('#frmLogoObraUpload').unbind('fileuploadsubmit');
			$('#frmLogoObraUpload').unbind('fileuploaddone');

			$('#frmLogoObraUpload').bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:

				data.formData = {
					_id: o._id 
				};

			});

			
			$('#frmLogoObraUpload').bind("fileuploaddone", function(e, data) {


				$scope.$apply(function() {
					$scope.getObras();
					$("#dlgMessages").find("section").html('<div>' + data.jqXHR.responseText + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
					
					$("#frmLogoObraUpload").find("ul li").remove();

				});


			});

			$("#agregarLogoObra").foundation("reveal", "open");

		};

		$scope.clearLogoForm = function(){

			$("#frmLogoObraUpload ul li").remove();

		};



		$scope.agregarImagenObra = function(o) {


			$('#frmImagenObraUpload').unbind('fileuploadsubmit');
			$('#frmImagenObraUpload').unbind('fileuploaddone');

			$('#frmImagenObraUpload').bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:

				data.formData = {
					_id: o._id 
				};

			});

			
			$('#frmImagenObraUpload').bind("fileuploaddone", function(e, data) {


				$scope.$apply(function() {
					$scope.getObras();
					$("#dlgMessages").find("section").html('<div>' + data.jqXHR.responseText + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
					
					$("#frmImagenObraUpload").find("ul li").remove();

				});


			});

			$("#agregarImagenObra").foundation("reveal", "open");

		};







		$scope.eliminarObra = function(o) {


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
						url: ServicesHost + 'eliminarObra',
						data: {
							obra: o
						}
					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getObras();

					$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
					$("#dlgMessages").foundation("reveal", "open");

				}).
					error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					$("#dlgMessages").find("section").html('<div>' + data + '</div>');
					$("#dlgMessages").foundation("reveal", "open");
				});

				});



			}));



		};


		$scope.cropIndex = 0;
		$scope.imgFolder = "Obras/";
		$scope.deleteServiceName = "deleteObraImage";
		$scope.confirmDeleteImageFlag = false;
		$scope.verImagenes = function(p) {

			$scope.current = p;
			$scope.cropIndex = 0;
			if (p.imagenes && p.imagenes.length > 0) {
				$scope.cropImageSrc = $scope.imgFolder  + p.imagenes[$scope.cropIndex].imageName;
			} else {
				$scope.cropImageSrc = ServicesHost+"img/noDisponible.jpg";

			}



			$("#imageViewer").foundation("reveal","open")

		}



		$scope.nextImage = function() {
			if ($scope.cropIndex + 1 >= $scope.current.imagenes.length) {
				$scope.cropIndex = 0;
			} else {
				console.log("Next");
				$scope.cropIndex += 1;
			}

			$scope.cropImageSrc = "ImagenesProductos/" + $scope.current.imagenes[$scope.cropIndex].imageName;

			$scope.confirmDeleteImageFlag=false;
			

		};



		$scope.previousImage = function() {
			console.log("Prev");
			if ($scope.cropIndex - 1 < 0) {
				$scope.cropIndex = $scope.current.imagenes.length - 1;
			} else {
				console.log("Prev");
				$scope.cropIndex -= 1;
			}
			$scope.confirmDeleteImageFlag=false;
			$scope.cropImageSrc = $scope.imgFolder  + $scope.current.imagenes[$scope.cropIndex].imageName;
			
		};
		

		$scope.confirmDeleteImage = function(){

			$scope.confirmDeleteImageFlag = true;

		};

		$scope.deleteImage = function(){

			
			var imageName = $scope.current.imagenes[$scope.cropIndex].imageName;

			// var imgID = imageName.split("_")[1].split(".")[0];
			// console.log(imgID);


			$http({
				method: 'POST',
				url: ServicesHost + $scope.deleteServiceName,
				data: {
					imageName: imageName
				}
			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.confirmDeleteImageFlag=false;	
				$scope.current.imagenes.splice($scope.cropIndex,1);
				if($scope.current.imagenes.length == 0){
					$("#imageViewer").foundation("reveal","close");
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











		$scope.setup = function() {
			var ul = $('#frmLogoObraUpload ul');

			$('#logoObraDrop a').click(function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$('#frmLogoObraUpload').fileupload({

				// This element will accept file drag/drop uploading
				dropZone: $('#logoObraDrop'),

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



						$("#frmLogoObraUpload small.error").html(error.responseText);



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



/******************************************************************/


$('#ImagenObraDrop a').click(function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$('#frmImagenObraUpload').fileupload({

				// This element will accept file drag/drop uploading
				dropZone: $('#ImagenObraDrop'),

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



						$("#frmImagenObraUpload small.error").html(error.responseText);



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







};

$scope.setup();


}

]);
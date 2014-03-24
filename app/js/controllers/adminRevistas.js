angular.module('myApp.controllers').controller('adminRevistasCtrl', ['$scope', '$state', '$http',
	function($scope, $state, $http) {
		$scope.indiceMessage = "";
		$scope.mode = "Agregar";
		$scope.mesNombre = new Array();
		$scope.mesNombre[0] = "Enero";
		$scope.mesNombre[1] = "Febrero";
		$scope.mesNombre[2] = "Marzo";
		$scope.mesNombre[3] = "Abril";
		$scope.mesNombre[4] = "Mayo";
		$scope.mesNombre[5] = "Junio";
		$scope.mesNombre[6] = "Julio";
		$scope.mesNombre[7] = "Agosto";
		$scope.mesNombre[8] = "Septiembre";
		$scope.mesNombre[9] = "Octubre";
		$scope.mesNombre[10] = "Noviembre";
		$scope.mesNombre[11] = "Diciembre";



		$scope.getRevistas = function() {
			$http({
				method: 'GET',
				url: ServicesHost + 'getRevistas'

			}).
			success(function(revistas, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.revistasList = revistas;
			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});

		};

		$scope.ingresarRevista = function() {
			$scope.mode = 'Agregar';


			$("#revistaModal").foundation("reveal", "open");
		};

		$scope.isInt = function(n) {


			var result = n % 1 == 0 && n > 0;
			console.log(result);
			return result;
		};

		$scope.agregarRevista = function(r) {

			$http({
				method: 'POST',
				url: ServicesHost + 'agregarRevista',
				data: {
					revista: r

				}

			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.revista = {};
				$scope.frmRevista.$setPristine();
				$scope.getRevistas();
				$("#dlgMessages").find("section").html('<div>' + result.message + '</div>');
				$("#dlgMessages").foundation("reveal", "open");

			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});

		};

		$scope.editarRevista = function(r) {

			$scope.mode = 'Editar';
			$scope.currentRevista = r;
		};


		$scope.eliminarRevista = function(_id) {

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
						url: ServicesHost + 'eliminarRevista',
						data: {
							_id: _id

						}

					}).
					success(function(result, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.getRevistas();
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


		$scope.imgFolder = "Revistas/";
		$scope.deleteServiceName = "deletePagina";
		$scope.confirmDeleteImageFlag = false;

		$scope.agregarImagen = function(_id) {

			$('#frmImageUpload').unbind('fileuploadsubmit');
			$('#frmImageUpload').bind('fileuploadsubmit', function(e, data) {
				// The example input, doesn't have to be part of the upload form:

				data.formData = {
					_id: _id
				};

			});
			//justOnce(_id);

			$("#revImgUpload").foundation("reveal", "open");

		};


		$scope.confirmDeleteImage = function(){

			$scope.confirmDeleteImageFlag = true;

		};

		$scope.deletePagina = function(){

			
			var imageName = $scope.currentRev.paginas[$scope.paginaIndex].imageName;

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
				$scope.currentRev.paginas.splice($scope.paginaIndex,1);
				if($scope.currentRev.paginas.length == 0){
					$("#indicesModal").foundation("reveal","close");
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




		$scope.verPaginas = function(rev) {
			if (rev.paginas.length > 0) {
				$scope.currentRev = rev;
				$scope.paginaIndex = 0;
				$scope.currPaginaIndex = $scope.currentRev.paginas[$scope.paginaIndex].indice;
				$scope.indiceImageSrc = "Revistas/" + $scope.currentRev.paginas[$scope.paginaIndex].imageName;
				$("#indicesModal").foundation("reveal", "open");
			}


		};


		$scope.assignarIndice = function() {



			$http({
				method: 'POST',
				url: ServicesHost + 'asignarIndice',
				data: {
					_id: $scope.currentRev._id,
					IdPagina: $scope.currentRev.paginas[$scope.paginaIndex].IdPagina,
					indice: $scope.currPaginaIndex

				}

			}).
			success(function(result, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.currentRev.paginas[$scope.paginaIndex].indice = $scope.currPaginaIndex;
				$scope.getRevistas();
				

				$scope.indiceMessage = result.message;
				$("#indiceMessage").fadeIn().fadeOut(1500);

				


			}).
			error(function(result, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.

				console.log(result);
			});


		};



		$scope.nextImage = function() {
			if ($scope.paginaIndex + 1 == $scope.currentRev.paginas.length) {
				$scope.paginaIndex = 0;
			} else {
				console.log("Next");
				$scope.paginaIndex += 1;
			}

			$scope.indiceImageSrc = "Revistas/" + $scope.currentRev.paginas[$scope.paginaIndex].imageName;
			$scope.currPaginaIndex = $scope.currentRev.paginas[$scope.paginaIndex].indice;



		};



		$scope.previousImage = function() {
			console.log("Prev");
			if ($scope.paginaIndex - 1 < 0) {
				$scope.paginaIndex = $scope.currentRev.paginas.length - 1;
			} else {
				console.log("Prev");
				$scope.paginaIndex -= 1;
			}

			$scope.indiceImageSrc = "Revistas/" + $scope.currentRev.paginas[$scope.paginaIndex].imageName;
			$scope.currPaginaIndex = $scope.currentRev.paginas[$scope.paginaIndex].indice;

		};


		$scope.checkError = function(inputName, erroName) {
			return $scope.frmRevista[inputName].$dirty && $scope.frmRevista[inputName].$error[erroName];

		};


		$scope.Setup = function() {


			$('#frmImageUpload').bind("fileuploaddone", function(e, data) {


				$scope.$apply(function() {
					$scope.getRevistas();


				});

			});
			$scope.getRevistas();


			var ul2 = $('#frmImageUpload ul');

			$('#revistaDrop a').click(function() {
				// Simulate a click on the file input button
				// to show the file browser dialog
				$(this).parent().find('input').click();
			});

			// Initialize the jQuery File Upload plugin
			$('#frmImageUpload').fileupload({

				// This element will accept file drag/drop uploading
				dropZone: $('#revistaDrop'),

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



						$("#frmImageUpload small.error").html(error.responseText);



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


}();

}

]);
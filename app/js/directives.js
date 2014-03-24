'use strict';

/* Directives */


angular.module('myApp.directives', []).
directive('appVersion', ['version',
	function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};



	}
]);



function safeApply(scope, fn) {
	var phase = scope.$root.$$phase;
	if (phase == '$apply' || phase == '$digest')
		scope.$eval(fn);
	else
		scope.$apply(fn);
}

angular.module('myApp').directive('uniqueEmail', function($http) {
	var toId;
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			//when the scope changes, check the email.
			scope.$watch(attr.ngModel, function(value) {
				// if there was a previous attempt, stop it.
				if (toId) clearTimeout(toId);

				// start a new attempt with a delay to keep it from
				// getting too "chatty".

				if (value) {
					toId = setTimeout(function() {
						// call to some API that returns { isValid: true } or { isValid: false }
						$http.get(ServicesHost + 'isEmailAvailable?email=' + value).success(function(data) {

							//set the validity of the field
							safeApply(scope, function() {
								ctrl.$setValidity('uniqueEmail', data == "true");
							});

						});
					}, 20);
				}
			})
		}
	}
});



angular.module('myApp').directive('uniqueUsername', function($http) {
	var toId;
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			//when the scope changes, check the email.
			scope.$watch(attr.ngModel, function(value) {
				// if there was a previous attempt, stop it.
				if (toId) clearTimeout(toId);

				// start a new attempt with a delay to keep it from
				// getting too "chatty".
				if (value) {
					toId = setTimeout(function() {
						// call to some API that returns { isValid: true } or { isValid: false }
						$http.get(ServicesHost + 'isUserNameAvailable?username=' + value).success(function(data) {

							//set the validity of the field
							safeApply(scope, function() {
								ctrl.$setValidity('uniqueUsername', data == "true");
							});

						});
					}, 200);

				}
			})
		}
	}
});

angular.module('myApp').directive('uniqueUsernameEdit', function($http) {
	var toId;
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			//when the scope changes, check the email.
			scope.$watch(attr.ngModel, function(value) {
				// if there was a previous attempt, stop it.
				if (toId) clearTimeout(toId);

				// start a new attempt with a delay to keep it from
				// getting too "chatty".
				if (value) {
					toId = setTimeout(function() {
						// call to some API that returns { isValid: true } or { isValid: false }
						$http.get(ServicesHost + 'isUserNameAvailableEdit?username=' + value + '&current=' + scope.tmpCopy.username).success(function(data) {

							//set the validity of the field
							safeApply(scope, function() {
								ctrl.$setValidity('uniqueUsernameEdit', data == "true");
							});

						});
					}, 200);

				}
			})
		}
	}
});



angular.module('myApp').directive('uniqueEmailEdit', function($http) {
	var toId;
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			//when the scope changes, check the email.
			scope.$watch(attr.ngModel, function(value) {
				// if there was a previous attempt, stop it.
				if (toId) clearTimeout(toId);

				// start a new attempt with a delay to keep it from
				// getting too "chatty".
				if (value) {


					var user = scope.tmpCopy || scope.currentUser;

					toId = setTimeout(function() {
						// call to some API that returns { isValid: true } or { isValid: false }
						$http.get(ServicesHost + 'isEmailAvailableEdit?email=' + value + '&current=' + user.email).success(function(data) {

							//set the validity of the field
							safeApply(scope, function() {
								ctrl.$setValidity('uniqueEmailEdit', data == "true");
							});

						});
					}, 200);

				}
			})
		}
	}
});

angular.module('myApp').directive('imgCropped', function() {
	var imgObj = undefined;

	function updatePreview(c) {
		if (parseInt(c.w) > 0) {
			// Show image preview
			var imageObj = $("#theOne")[0];
			var canvas = $("#preview")[0];
			var context = canvas.getContext("2d");
			console.log(imageObj);
			context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);

		}
	};

	return {
		restrict: 'E',
		replace: true,
		scope: {
			src: '@',
			selected: '&'
		},
		link: function(scope, element, attr) {
			var myImg;
			var clear = function() {
				if (myImg) {
					myImg.next().remove();
					myImg.remove();
					myImg = undefined;
				}
			};
			scope.$watch('src', function(nv) {
				clear();
				if (nv) {
					element.after('<img />');
					myImg = element.next();
					myImg.attr('src', nv);
					myImg.attr("id", "theOne");

					$(myImg).Jcrop({
						boxWidth: 700,
						boxHeight: 0,
						onChange: updatePreview,
						onSelect: updatePreview,

						aspectRatio: Math.floor(myImg.wdith / myImg.height)

					});
				}
			});

			scope.$on('$destroy', clear);
		}
	};
});


angular.module('myApp.directives', [])
	.directive('pwMatch', [
		function() {
			return {
				require: 'ngModel',
				link: function(scope, elem, attrs, ctrl) {
					var firstPassword = '#' + attrs.pwMatch;
					elem = $(elem);
					elem.add(firstPassword).on('keyup', function() {
						scope.$apply(function() {
							var v = elem.val() === $(firstPassword).val();
							ctrl.$setValidity('pwMatch', v);
						});
					});
				}
			}
		}
	]);
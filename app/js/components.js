'use strict';



angular.module('myApp.directives', []).
directive('adminproductos', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: './partials/admin/adminProductos.html',
		controller: function($scope) {
			console.log("admin productos");

		}
	};
}).directive('adminusuarios', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: './partials/admin/adminUsuarios.html',
		controller: function($scope) {
			console.log("admin usuarios");

		}
	};
})




'use strict';
var $AnchorScrollProvider = function() {
    this.$get = ['$window', '$location', '$rootScope',
    function($window, $location, $rootScope) {
        function scroll() {}
        return scroll;
    }
    ];
};

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'resettableForm', 'ui.compat', 'ui.keypress', 'ui.event', 'ui.validate']).
config(
    ['$stateProvider', '$routeProvider', '$urlRouterProvider',
    function($stateProvider, $routeProvider, $urlRouterProvider) {
        $routeProvider.when('/inicio', {
            templateUrl: 'partials/inicio.html',
            controller: 'inicioCtrl'
        });
        $routeProvider.when('/obras', {
            templateUrl: 'partials/obras.html',
            controller: 'publicObrasCtrl'
        });

        $routeProvider.when('/catalogo', {
            templateUrl: 'partials/catalogo.html',
            controller: 'catalogoCtrl'
        });
        $routeProvider.when('/especialidades', {
            templateUrl: 'partials/especialidades.html',
            controller: 'especialidadesCtrl'
        });
        $routeProvider.when('/empresa', {
            templateUrl: 'partials/empresa.html',
            controller: 'empresaCtrl'
        });

        $routeProvider.when('/revista', {
            templateUrl: 'partials/revista.html',
            controller: 'revistaCtrl'
        });


        $routeProvider.when('/adminHome', {
            templateUrl: 'partials/admin/adminHome.html',
            controller: 'adminHomeCtrl'
        });



        $urlRouterProvider.otherwise('/inicio');



        $stateProvider
        .state('inicio', {

            url: "/inicio",
            templateUrl: 'partials/inicio.html',



        });



        $stateProvider
        .state('especialidades', {

            url: "/especialidades",
            templateUrl: 'partials/especialidades.html',
            controller: "especialidadesCtrl"



        });



        $stateProvider
        .state('admin', {

            url: "/admin",
            templateUrl: 'partials/admin.html',
            controller: "adminCtrl"



        });


        $stateProvider.state('catalogo', {
            url:'/catalogo/:Id_Producto',
            templateUrl: 'partials/catalogo.html',
            controller: 'catalogoCtrl'
        });


        $stateProvider
        .state('admin.productos', {

            url: "/productos",
            templateUrl: 'partials/admin.productos.html',


            controller: "adminProductosCtrl"



        });


        $stateProvider
        .state('admin.usuarios', {

            url: "/usuarios",
            templateUrl: 'partials/admin.usuarios.html',


            controller: "adminUsuariosCtrl"



        });

        $stateProvider
        .state('admin.obras', {

            url: "/obras",
            templateUrl: 'partials/admin.obras.html',


            controller: "adminObrasCtrl"



        });



        $stateProvider
        .state('admin.especialidades', {

            url: "/especialidades",
            templateUrl: 'partials/admin.especialidades.html',


            controller: "adminEspecialidadesCtrl"



        });



        $stateProvider
        .state('admin.revistas', {

            url: "/revistas",
            templateUrl: 'partials/admin.revistas.html',


            controller: "adminRevistasCtrl"



        });



        $stateProvider
        .state('admin.categorias', {

            url: "/categorias",
            templateUrl: 'partials/admin.categorias.html',
            controller: "adminCategoriasCtrl"
        });


        $stateProvider
        .state('admin.inicio', {

            url: "/inicio",
            templateUrl: 'partials/admin.inicio.html',
            controller: "adminInicioCtrl"
        });



        $stateProvider
        .state('admin.compras', {

            url: "/compras",
            templateUrl: 'partials/admin.compras.html',
            controller: "adminComprasCtrl"
        });


        $stateProvider
        .state('admin.cotizaciones', {

            url: "/cotizaciones",
            templateUrl: 'partials/admin.cotizaciones.html',
            controller: "adminCotizacionesCtrl"
        });







        $stateProvider
        .state('users', {

            url: "/users",
            templateUrl: 'partials/users.html',
            controller: 'usersCtrl'
        });


        $stateProvider
        .state('users.cotizaciones', {

            url: "/cotizaciones",
            templateUrl: 'partials/users.cotizaciones.html',
            controller: 'usersCotizacionesCtrl'
        });


        $stateProvider
        .state('users.compras', {

            url: "/compras",
            templateUrl: 'partials/users.compras.html',
            controller: 'usersComprasCtrl'
        });


        $stateProvider
        .state('users.soporte', {

            url: "/soporte",
            templateUrl: 'partials/users.soporte.html',
            controller: 'usersSoporteCtrl'
        });



        $stateProvider
        .state('users.perfil', {

            url: "/perfil",
            templateUrl: 'partials/users.perfil.html',
            controller: 'usersPerfilCtrl'
        });

    }
    ]).run(
    ['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
    ]).provider('$anchorScroll', $AnchorScrollProvider);


    $(document).ready(function() {
        $(".dropContent li a").click(function() {
            var idModal = $(this).attr("data-reveal-id");
            $("#" + idModal).foundation('reveal', 'open');
        });
    });
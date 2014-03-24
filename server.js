/** Config Vars ***/
var fs = require("fs");
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var _ = require("underscore");
/********** Express setup ******/
var expressPort = 80;
var express = require('express');
var app = require("./appConfig.js").app;
var util = require('util');


/*********** Load Routes Handlers *********/

var auth = require("./authentication.js");
var users = require("./users.js");

var cat = require("./categorias.js");

var prod = require("./productos");

var obras = require("./obras.js");
var esp = require("./especialidades.js");
var rev = require("./revistas.js");

var loggedUser = require("./loggedUser.js");
var contact = require("./contact.js");

/***************** ROUTES************************/
app.use("/", express.static(__dirname + '/app'));
//User Routes
app.post('/logIn', users.logIn);
app.get('/logOut', users.logOut);
app.post("/signUp", users.signUp);

app.get('/isEmailAvailable', users.isEmailAvailable);
app.get('/isUserNameAvailable', users.isUserNameAvailable);
app.get('/isUserNameAvailableEdit', users.isUserNameAvailableEdit);
app.get('/isEmailAvailableEdit', users.isEmailAvailableEdit);
app.post("/agregarUsuario", users.agregarUsuario);
app.post("/editarUsuario", users.editarUsuario);
app.post("/eliminarUsuario", users.eliminarUsuario);

app.post('/guardarCotizacion', auth.restrict, loggedUser.guardarCotizacion);


app.post('/comprarCotizacion', auth.restrict, loggedUser.comprarCotizacion);

app.get('/imprimirCotizacion',  loggedUser.imprimirCotizacion);

app.post('/actualizarPerfil',  loggedUser.actualizarPerfil);



app.post('/cancelarCompra', auth.restrict, loggedUser.cancelarCompra);
app.post('/eliminarCompra', auth.adminRestrict, loggedUser.eliminarCompra);
app.post('/eliminarCotizacion', auth.restrict, loggedUser.eliminarCotizacion);
app.get("/getCotizaciones", auth.restrict, loggedUser.getCotizaciones);
app.get("/getCompras", auth.restrict, loggedUser.getCompras);


app.get("/getComprasAdmin", auth.adminRestrict, loggedUser.getComprasAdmin);
app.get("/getCotizacionesAdmin", auth.adminRestrict, loggedUser.getCotizacionesAdmin);
app.post("/finalizarCompra", auth.adminRestrict, loggedUser.finalizarCompra);
app.post("/actualizarNumeroFactura", auth.adminRestrict, loggedUser.actualizarNumeroFactura);



app.get('/userSession', users.userSession);
app.get('/getUsers', auth.adminRestrict, users.getUsers);
app.get('/getEspecialidades', esp.getEspecialidades);


app.post("/agregarEspecialidad", esp.agregarEspecialidad);
app.post("/eliminarEspecialidad", esp.eliminarEspecialidad);
app.post("/actualizarEspecialidad", esp.actualizarEspecialidad);


app.post("/agregarRevista", rev.agregarRevista);
app.post("/eliminarRevista", rev.eliminarRevista);
app.get("/getRevistas", rev.getRevistas);
app.post("/agregarImagen", rev.agregarImagen);
app.post("/deletePagina", rev.deletePagina);
app.post("/asignarIndice", rev.asignarIndice);


/*******************************************************************************/
/*******************************************************************************/



app.get('/getCategorias', cat.getCategorias);

// Create secure routes using restrict function
app.post('/agregarCategoria', auth.adminRestrict, cat.agregarCategoria);
app.post('/eliminarCategoria', auth.adminRestrict, cat.eliminarCategoria);
app.post('/actualizarCategoria', auth.adminRestrict, cat.actualizarCategoria);



/******************************PRODUCTOS*******************************/

app.get('/getProductos', prod.getProductos);
app.get('/getProductosHome', prod.getProductosHome);

app.post('/agregarProducto', auth.adminRestrict, prod.agregarProducto);


app.post('/actualizarProducto', auth.adminRestrict, prod.actualizarProducto);


app.post('/eliminarProducto', auth.adminRestrict, prod.eliminarProducto);

app.post("/deleteProductImage", auth.adminRestrict, prod.deleteProductImage);

app.post('/upload', auth.adminRestrict, prod.agregarImagen);

app.post('/agregarFichaTecnica', prod.agregarFichaTecnica);

app.post('/agregarThumb', auth.adminRestrict, prod.agregarThumb);


app.post("/mensaje",contact.sendMsg);


app.use(function(err, req, res, next) {
	// logic

	if (err) {
		res.send(500, err.message);
		res.end(err.message);
	}
});



/**********************************************************/



// Create secure routes using restrict function
app.post('/agregarObra', obras.agregarObra);
app.post('/actualizarObra', obras.actualizarObra);
app.post('/eliminarObra', obras.eliminarObra);
app.get('/getObras', obras.getObras);
app.post('/agregarLogoObra', obras.agregarLogoObra);
app.post('/agregarImagenObra', obras.agregarImagenObra);
app.post('/deleteObraImage', obras.deleteObraImage);


app.get("/revista", rev.verRevista);



/**********************************************/

db.open(function(err, db) {
	if (!err) {


		app.listen(expressPort);

		console.log('Express started on port ' + expressPort);
	}
});

// process.on('uncaughtException', function(err) {
// 	// handle the error safely
// 	console.log(err);
// });
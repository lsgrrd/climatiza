/*** Utilities ***/
var async = require("async");
var _ = require("underscore");
/*** DB Setup ***/
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: "cnava.svam@gmail.com",
		pass: "dmenucr8!Q"
	}
});

var mailOptions = {
	from: "cnava.svam@gmail.com", // sender address
	to: "lsgrrd@gmail.com", // list of receivers
	subject: "Hello Mundus", // Subject line

	html: "<b>Hello world ✔</b>" // html body
};

exports.guardarCotizacion = function(req, res) {


	//VALIDATE FIRST

	var Carrito = {
		IdUser: ObjectID(req.session.user._id),
		nombreCompleto:req.session.user.nombreCompleto,
		productos: req.body.Carrito,
		Id_Carrito: new ObjectID(),
		esCompra: false,
		Fecha: new Date()
	};



	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {

		collection.save(Carrito,
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Cotizacion agregado con exito",

					};
					res.send(result);



				} else {
					res.send("ERROR");
				}
			});
	});



};



exports.eliminarCotizacion = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	if (!_id) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.remove({
				_id: ObjectID(_id)
			},
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Cotizacion eliminada con exito",

					};
					res.send(result);



				} else {
					res.send("ERROR");
				}
			});
		});
	}



};

exports.comprarCotizacion = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	if (!_id) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.update({
				_id: ObjectID(_id)
			}, {
				$set: {
					"esCompra": true,
					"estado": "En proceso",
					"Fecha": new Date(),
					"nombreCompleto":req.session.user.nombreCompleto
				}
			},
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Compra finalizada con exito",

					};
					res.send(result);
					
					mailOptions.html = "Se ha realizado una compra";

					smtpTransport.sendMail(mailOptions, function(error, response) {
						if (error) {
							console.log(error);
						} else {
							
							console.log("Message sent: " + response.message);
						}

							// if you don't want to use this transport object anymore, uncomment following line
							//smtpTransport.close(); // shut down the connection pool, no more messages
						});



				} else {
					res.send("ERROR");
				}
			});
		});
	}



};

exports.finalizarCompra = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	var numeroFactura = req.body.numeroFactura || undefined;
	var compra = req.body.compra;
	if (!_id || !numeroFactura || !compra) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.update({
				_id: ObjectID(_id)
			}, {
				$set: {
					
					"estado": "Finalizada",
					"numeroFactura":numeroFactura,
					"productos":compra.productos
					
					
				}
			},
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Compra finalizada con exito",

					};
					res.send(result);
					



				} else {
					res.send("ERROR");
				}
			});
		});
	}



};


exports.actualizarNumeroFactura = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	var numeroFactura = req.body.numeroFactura || undefined;
	var compra = req.body.compra;
	if (!_id || !numeroFactura) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.update({
				_id: ObjectID(_id)
			}, {
				$set: {
					
					
					"numeroFactura":numeroFactura,
					"productos":compra.productos
					
					
				}
			},
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Numero actualizado con exito",

					};
					res.send(result);
					
					


				} else {
					res.send("ERROR");
				}
			});
		});
	}



};



exports.getCotizaciones = function(req, res) {

	console.log(req.session.user._id)



	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {

		collection.find({
			IdUser: ObjectID(req.session.user._id),
			esCompra: false
		}, {
			"productos": 1,
			"_id": 1,
			"Fecha": 1,

		},
		function(err, carritos) {


			carritos.sort({
				"Fecha":-1
			}).toArray(function(err, arr) {
				if (!err) {
					res.send(arr);
				} else {
					res.send("ERROR");
				}
			});

		});
	});



};


exports.getCompras = function(req, res) {

	console.log(req.session.user._id)



	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {

		collection.find({
			IdUser: ObjectID(req.session.user._id),
			esCompra: true
		}, {
			"productos": 1,
			"_id": 1,
			"Fecha": 1,
			"numeroFactura":1,
			"estado": 1

		},
		function(err, carritos) {


			carritos.sort({
				"Fecha":-1
			}).toArray(function(err, arr) {
				if (!err) {
					res.send(arr);
				} else {
					res.send("ERROR");
				}
			});

		});
	});



};


exports.cancelarCompra = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	if (!_id) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.update({
				_id: ObjectID(_id)
			}, {
				$set: {

					"estado": "Cancelada",
					"FechaDeCancelacion": new Date()
				}
			},
			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Compra cancelada con exito",

					};


					smtpTransport.sendMail(mailOptions, function(error, response) {
						if (error) {
							console.log(error);
						} else {
							res.send(result);
							console.log("Message sent: " + response.message);
						}

							// if you don't want to use this transport object anymore, uncomment following line
							//smtpTransport.close(); // shut down the connection pool, no more messages
						});



				} else {
					res.send("ERROR");
				}
			});
		});
	}







};



exports.getComprasAdmin = function(req, res) {

	



	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {

		collection.find({

			esCompra: true
		}, {
			
			"_id": 1,
			"Fecha": 1,

			"estado": 1,
			"nombreCompleto":1,
			"numeroFactura":1,
			"productos": 1


		},
		function(err, carritos) {


			carritos.sort({
				"Fecha":-1
			}).toArray(function(err, arr) {
				if (!err) {
					res.send(arr);
				} else {
					res.send("ERROR");
				}
			});

		});
	});



};


exports.getCotizacionesAdmin = function(req, res) {

	



	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {

		collection.find({

			esCompra: false
		}, {
			
			"_id": 1,
			"Fecha": 1,

			"estado": 1,
			"nombreCompleto":1,
			
			"productos": 1


		},
		function(err, carritos) {


			carritos.sort({
				"Fecha":-1
			}).toArray(function(err, arr) {
				if (!err) {
					res.send(arr);
				} else {
					res.send("ERROR");
				}
			});

		});
	});



};



exports.eliminarCompra = function(req, res) {


	//VALIDATE FIRST

	var _id = req.body._id || undefined;
	if (!_id) {
		res.send(500, "Missing parameters");

	} else {



		db.collection('cotizaciones', {
			strict: true
		}, function(err, collection) {

			collection.remove({
				_id: ObjectID(_id)

			},
			function(err) {
				if (!err) {
					console.log("ELIMINADA");
					var result = {
						error: false,
						message: "Compra eliminada con exito",

					};


					
					res.send(result);
					
					



				} else {
					res.send("ERROR");
				}
			});
		});
	}







};

exports.imprimirCotizacion = function(req, res) {


	

	var _id = req.query._id || undefined;

	if(!_id){
		
		return false;
	}

	db.collection('cotizaciones', {
		strict: true
	}, function(err, collection) {



		collection.find({_id:ObjectID(_id)}, function(err, cotizaciones) {

			if (!err) {

				cotizaciones.toArray(function(err, cotizaciones) {

					if (!err) {


						var mostRecent;




						res.render(__dirname + "/app/partials/factura.html", {
							cot: cotizaciones[0]
						});

					} else {
						res.send("ERROR");
					}
				})
			} else {
				res.send("ERROR");
			}
		});
	});



};




exports.actualizarPerfil = function(req, res){



	var user = req.body.user;

	if (user) {
		
		// var username = user.username;

		// var email = user.email;
		// var nombreCompleto = user.nombreCompleto || "";
		// var telefono = user.telefono || "";
		// var direccion = user.direccion || "";



		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection");
			}

			collection.update({
				_id:ObjectID(req.session.user._id)

			},{ $set:{
				nombreCompleto: user.nombreCompleto,
				email:user.email,
				telefono:user.telefono,
				direccion:user.direccion
			}

		}, function(err, user) {

			if (!err) {

				var result = {
						error: false,
						message: "Usuario actualizado exitosamente",

					};
				res.send(result);

			}else{
				res.send(500,err);
			}



		});


		});

	} else {
		res.send("Please provide username, password and email");

	}







};
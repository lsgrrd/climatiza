/*** Utilities ***/
var async = require("async");
var _ = require("underscore");

/*** DB Setup ***/
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;

exports.getCategorias = function(req, res) {


	//VALIDATE FIRST

	db.collection('categorias', {
		strict: true
	}, function(err, collection) {

		if(!collection){
			res.send([]);
			return false;
		}

		collection.find({}, {
			nombre: 1,
			descripcion: 1,
			"productos": 1
		}, function(err, categorias) {
			if (!err) {

				categorias.toArray(function(err, arr) {
					arr = _.map(arr, function(cat) {
						cat.productos = cat.productos ? cat.productos.length : 0;
						return cat;
					});

					if (!err) {

						res.send(arr);

					} else {
						res.send("ERROR");
					}
				});
			} else {
				res.send("ERROR");
			}
		});



	});
};

exports.agregarCategoria = function(req, res) {


	//VALIDATE FIRST

	db.collection('categorias', {
		strict: true
	}, function(err, collection) {

		var categoria = req.body.categoria;

		collection.save(categoria, function(err) {
			if (!err) {
				var result = {
					error: false,
					message: "Categoria agregada con exito"
				};
				res.send(result);
			} else {
				res.send("ERROR");
			}
		});
	});
};


exports.actualizarCategoria = function(req, res) {


	//VALIDATE FIRST

	db.collection('categorias', {
		strict: true
	}, function(err, collection) {

		var categoria = req.body.categoria;

		collection.update({_id:ObjectID(categoria._id)},{

			$set:{
				"nombre":categoria.nombre,
				"descripcion":categoria.descripcion
			}

		}, function(err) {
			if (!err) {
				var result = {
					error: false,
					message: "Categoria actualizada con exito"
				};
				res.send(result);
			} else {
				res.send("ERROR");
			}
		});
	});
};


exports.eliminarCategoria = function(req, res) {


	//VALIDATE FIRST
	if (!req.body.Id_Categoria) {
		res.send("Insuficient parameters");
	} else {
		var o_id = new ObjectID(req.body.Id_Categoria);
		db.collection('categorias', {
			strict: true
		}, function(err, collection) {
			collection.remove({
				_id: o_id

			},

			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Categoria eliminada con exito"
					};
					res.send(result);
				} else {
					res.send("ERROR");
				}
			});
		});
	}
};
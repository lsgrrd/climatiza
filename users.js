/*** Utilities ***/
var async = require("async");
var _ = require("underscore");
/*** DB Setup ***/
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
/******** Passowrd Hash setup*****/
var passwordHash = require('password-hash');
var auth = require("./authentication.js");
var authenticate = auth.authenticate;



exports.userSession = function(req, res) {

	if (req.session.user) {
		var tmpUser = _.omit(req.session.user, "hashPass");
		res.send(tmpUser);
	}else{
		res.send();
	}


};
exports.logIn = function(req, res) {
	authenticate(req.body.username, req.body.password, function(err, user) {
		if (user) {
			// Regenerate session when signing in
			// to prevent fixation 
			req.session.regenerate(function() {
				// Store the user's primary key 
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.user = user;
				req.session.success = 'Authenticated as ' + user.username;
				//res.send(req.session.success);
				res.send(JSON.stringify({

					isAuthenticated: true,
					username: user.username,
					rol: user.rol || "none",
					nombreCompleto : user.nombreCompleto || "",
					email:user.email,
					telefono:user.telefono,
					direccion:user.direccion

				}));
				//res.redirect('back');
			});
		} else {
			req.session.error = 'Authentication failed';
			//res.send(req.session.error);

			res.send(JSON.stringify({

				isAuthenticated: false


			}));
			//res.redirect('login');
		}
	});
};

exports.logOut = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request
	req.session.destroy(function() {
		res.send("Logged out");
	});
};

exports.signUp = function(req, res) {



	var username = req.body.username;
	var hashPass = passwordHash.generate(req.body.password);
	var email = req.body.email;
	var nombreCompleto = req.body.nombreCompleto || "";
	var telefono = req.body.telefono || "";
	var direccion = req.body.direccion || "";


	if (username && hashPass && email) {


		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection");
			}

			collection.findOne({
				username: username
			}, function(err, user) {

				if (user === null) {

					collection.save({
						username: username,
						hashPass: hashPass,
						email: email,
						nombreCompleto:nombreCompleto,
						telefono:telefono,
						direccion:direccion
					}, function(err) {
						var result = {
							error: false,
							message: "Usuario registrado con exito"
						};
						res.send("User registered sucessfully");
					});


				} else {

					var result = {
						error: false,
						message: "El nombre de  usuario no esta disponible"
					};
					res.send("User registered sucessfully");

				}



			});


		});

	} else {
		res.send("Please provide username, password and email");

	}



};

exports.isEmailAvailable = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request
	var email = req.query.email;

	if (!email) {
		res.send("Email empty");
	} else {



		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection users not found");
				res.send("error");
			}
			if (!collection) {

				console.log("Error Collection users not found");
				res.send(true);
			} else {
				collection.findOne({
					email: email
				}, function(err, user) {

					if (user === null) {

						res.send(true);

					} else {

						res.send(false);

					}



				});
			}


		});


	}



};

exports.isUserNameAvailable = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request
	var username = req.query.username;

	if (!username) {
		res.send("Username empty");
	} else {



		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection users not found");
				res.send("error");
			}
			if (!collection) {

				console.log("Error Collection users not found");
				res.send(true);
			} else {
				collection.findOne({
					username: username
				}, function(err, user) {

					if (user === null) {

						res.send(true);

					} else {

						res.send(false);

					}



				});
			}


		});


	}



};


exports.isUserNameAvailableEdit = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request
	var username = req.query.username;
	var current = req.query.current;

	if (!username) {
		res.send("Username empty");
	} else if (username == current) {
		res.send(true);
	} else {



		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection users not found");
				res.send("error");
			}
			if (!collection) {

				console.log("Error Collection users not found");
				res.send(true);
			} else {
				collection.findOne({
					username: username
				}, function(err, user) {

					if (user === null) {

						res.send(true);

					} else {


						res.send(false);


					}



				});
			}


		});


	}



};


exports.isEmailAvailableEdit = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request
	var email = req.query.email;
	var current = req.query.current;

	if (!email) {
		res.send("Email empty");
	} else if (email == current) {
		res.send(true);
	} else {



		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection users not found");
				res.send("error");
			}
			if (!collection) {

				console.log("Error Collection users not found");
				res.send(true);
			} else {
				collection.findOne({
					email: email
				}, function(err, user) {

					if (user === null) {

						res.send(true);

					} else {


						res.send(false);


					}



				});
			}


		});


	}



};



exports.getUsers = function(req, res) {
	// destroy the user's session to log them out
	// will be re-created next request



	db.collection('users', {
		strict: true
	}, function(err, collection) {


		if (err) {
			console.log("Error Collection users not found");
			res.send("error");
		}
		if (!collection) {

			console.log("Error Collection users not found");
			res.send(true);
		} else {

			collection.find({
				rol: {
					$ne: "ADMIN"
				}
			}, {
				hashPass: 0
			}, function(err, users) {


				if (!err) {
					users.toArray(function(err, arr) {


						res.send(arr);

					});
				}
			});


		}


	});



};



exports.agregarUsuario = function(req, res) {



	var username = req.body.username;
	var hashPass = passwordHash.generate(req.body.password);
	var email = req.body.email;
	var telefono = req.body.telefono || "";
	var nombreCompleto = req.body.nombreCompleto || "";
	var direccion = req.body.direccion || "";
	

	var newUser = {
		username: username,
		hashPass: hashPass,
		email: email,
		telefono: telefono,
		nombreCompleto:nombreCompleto,
		direccion:direccion
	};

	if (username && hashPass && email) {


		db.collection('users', {
			strict: true
		}, function(err, collection) {


			if (err) {
				console.log("Error Collection");
			}

			collection.findOne({
				username: username
			}, function(err, user) {

				if (user === null) {

					collection.save(newUser, function(err) {
						var result = {
							error: false,
							message: "Usuario registrado con exito"
						};
						res.send("User registered sucessfully");
					});


				} else {

					var result = {
						error: false,
						message: "El nombre de  usuario no esta disponible"
					};
					res.send("User registered sucessfully");

				}



			});


		});

	} else {
		res.send("Please provide username, password and email");

	}



};


exports.editarUsuario = function(req, res) {



	var updatedUser = req.body.user;
	updatedUser._id = ObjectID(updatedUser._id);



	db.collection('users', {
		strict: true
	}, function(err, collection) {


		if (err) {
			console.log("Error Collection");
		}

		collection.findOne({
			_id: updatedUser._id
		}, function(err, user) {

			if (user !== null) {

				var hashPass = updatedUser.password !== undefined ? passwordHash.generate(updatedUser.password) : user.hashPass;


				updatedUser.hashPass = hashPass;

				collection.update({
					_id: updatedUser._id
				}, updatedUser, function(err) {



					if (!err) {
						var result = {
							error: false,
							message: "Usuario actualizado exitosamente",
							password: user.password
						};
						res.send(result);
					} else {
						var result = {
							error: true,
							message: error.toString(),

						};
						res.send(result);
					}
				});



			} else {

				var result = {
					error: false,
					message: "Usuario no encontrado"
				};
				res.send(result);

			}



		});


	});



};



exports.eliminarUsuario = function(req, res) {



	var deletedUser = req.body.user;
	deletedUser._id = ObjectID(deletedUser._id);



	db.collection('users', {
		strict: true
	}, function(err, collection) {


		if (err) {
			console.log("Error Collection");
		}

		collection.remove({
			_id: deletedUser._id,
			rol: {
				$ne: "ADMIN"
			}

		}, function(err, user) {

			if (!err && user) {



				var result = {
					error: false,
					message: "Usuario eliminado exitosamente",

				};
				res.send(result);



			} else {

				var result = {
					error: true,
					message: "Usuario no encontrado"
				};
				res.send(result);

			}



		});


	});



};

/*"email" : "admin@mail.com", "hashPass" : "sha1$bab30afc$1$5a965b9dce198032e7976103390ce52dd5d9b062", "rol" : "ADMIN", "username" : "admin"*/
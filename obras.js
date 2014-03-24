/*** Utilities ***/
var async = require("async");
var _ = require("underscore");
var glob = require("glob");

var fs = require('fs');
/*** DB Setup ***/
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
var formidable = require('formidable');
exports.getObras = function(req, res) {


	//VALIDATE FIRST

	db.collection('obras', {
		strict: true
	}, function(err, collection) {

		if (!collection) {
			res.send([]);
			return false;
		}

		collection.find({}, function(err, obras) {
			if (!err) {

				obras.toArray(function(err, arr) {

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

exports.agregarObra = function(req, res) {


	//VALIDATE FIRST

	db.collection('obras', {
		strict: true
	}, function(err, collection) {
		if (!collection) {
			res.send(500,"No collection");
			return false;
		}

		var obra = req.body.obra;

		collection.save(obra, function(err) {
			if (!err) {
				var result = {
					error: false,
					message: "Obra agregada con exito"
				};
				res.send(result);
			} else {
				res.send("ERROR");
			}
		});
	});
};


exports.actualizarObra = function(req, res) {


	//VALIDATE FIRST
	var obra = req.body.obra;
	obra._id = ObjectID(obra._id);
	db.collection('obras', {
		strict: true
	}, function(err, collection) {



		collection.update({
			_id: obra._id
		}, obra, function(err) {
			if (!err) {
				var result = {
					error: false,
					message: "Obra actualizada con exito"
				};
				res.send(result);
			} else {
				res.send(500, "ERROR");
			}
		});
	});
};


exports.eliminarObra = function(req, res) {


	//VALIDATE FIRST
	if (!req.body.obra) {
		res.send("Insuficient parameters");
	} else {
		var o_id = new ObjectID(req.body.obra._id);
		db.collection('obras', {
			strict: true
		}, function(err, collection) {
			collection.remove({
				_id: o_id

			},

			function(err) {
				if (!err) {
					var result = {
						error: false,
						message: "Obra eliminada con exito"
					};
					res.send(result);
				} else {
					res.send("ERROR");
				}
			});
		});
	}
};


exports.agregarLogoObra  = function  (req, res) {
	

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  var maxLen = 2 * 1024 * 1024;



  glob("app/Obras/"+req.body._id+"_logo.*",  function (er, files) {


  	_(files).each(function(f,index){
  		fs.unlinkSync(f);

  	});


  });

var finalFileName = "";

  var form = new formidable.IncomingForm({
  	uploadDir: __dirname + '/app/Obras/',

  }),
  fields = {},
  files = [];



  form
  .on('error', function(err) {

  	res.end('error:\n\n' + util.inspect(err));
  })
  .on('field', function(field, value) {
      //console.log(field, value);

      fields[field] = value;
      console.log(fields);
  }).on('fileBegin', function(name, file) {
      //rename the incoming file to the file's name

      fields.fileName = file.name;

      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
      	console.log("invalid type");
      	console.log(file);


      	setTimeout(function() {
      		fs.unlinkSync(file.path);
      	}, 1);


      	return next(new Error("Solo imagenes son permitidas"));
      }

      if (form.bytesExpected > maxLen) {



      	return next(new Error("El archivo excede la capacidad permitida"));
        //res.destroy("Max length error");

    }

    finalFileName =fields._id+"_logo."+file.name.split(".").reverse()[0];
    finalFileName.trim();
    file.path = form.uploadDir + finalFileName;

    

      //console.log("File contents\n" + JSON.stringify(file));
  })
  .on('file', function(field, file) {


  	if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
  		console.log("invalid type");
  		return next(new Error("Solo imagenes son permitidas"));
  	}

  	files.push([field, file]);



  })
  .on('progress', function(bytesReceived, bytesExpected) {



  	if (bytesExpected > maxLen) {



  		return next(new Error("El archivo excede la capacidad permitida"));



        //next(new Error("El archivo excede la capacidad permitida"));



    }


}).on('end', function() {



	var _id = fields._id;
	if (!_id) {
		next(new Error("Obra Empty"));
	}
	var fileName = fields.fileName;
	console.log(_id)


	db.collection('obras', {
		strict: true
	}, function(err, collection) {


		collection.update({

			"_id": ObjectID(_id)
		}, {
			$set: {
				"logo": {
					imageName: finalFileName,

				}
			}
		},
		function(err) {
			if (!err) {

				res.send("Imagen agregado con exito");
			} else {
				res.send("ERROR");
			}
		});
	});


	res.send("Imagen agregado con exito");


});


form.parse(req);



};




exports.agregarImagenObra  = function  (req, res) {
	

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  var maxLen = 2 * 1024 * 1024;



  glob("app/Obras/"+req.body._id+"_logo.*",  function (er, files) {


  	_(files).each(function(f,index){
  		fs.unlinkSync(f);

  	});


  });

var finalFileName = "";
var imageID = ObjectID();

  var form = new formidable.IncomingForm({
  	uploadDir: __dirname + '/app/Obras/',

  }),
  fields = {},
  files = [];



  form
  .on('error', function(err) {

  	res.end('error:\n\n' + util.inspect(err));
  })
  .on('field', function(field, value) {
      //console.log(field, value);

      fields[field] = value;
      console.log(fields);
  }).on('fileBegin', function(name, file) {
      //rename the incoming file to the file's name

      fields.fileName = file.name;

      if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
      	console.log("invalid type");
      	console.log(file);


      	setTimeout(function() {
      		fs.unlinkSync(file.path);
      	}, 1);


      	return next(new Error("Solo imagenes son permitidas"));
      }

      if (form.bytesExpected > maxLen) {



      	return next(new Error("El archivo excede la capacidad permitida"));
        //res.destroy("Max length error");

    }

    finalFileName =fields._id+"_"+imageID+"."+file.name.split(".").reverse()[0];
    finalFileName.trim();
    file.path = form.uploadDir + finalFileName;

    

      //console.log("File contents\n" + JSON.stringify(file));
  })
  .on('file', function(field, file) {


  	if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name)) {
  		console.log("invalid type");
  		return next(new Error("Solo imagenes son permitidas"));
  	}

  	files.push([field, file]);



  })
  .on('progress', function(bytesReceived, bytesExpected) {



  	if (bytesExpected > maxLen) {



  		return next(new Error("El archivo excede la capacidad permitida"));



        //next(new Error("El archivo excede la capacidad permitida"));



    }


}).on('end', function() {



	var _id = fields._id;
	if (!_id) {
		next(new Error("Obra Empty"));
	}
	var fileName = fields.fileName;
	console.log(_id)


	db.collection('obras', {
		strict: true
	}, function(err, collection) {


		collection.update({

			"_id": ObjectID(_id)
		}, {
			$addToSet: {
				"imagenes": {
					imageName: finalFileName,
					imageID: imageID

				}
			}
		},
		function(err) {
			if (!err) {

				res.send("Imagen agregado con exito");
			} else {
				res.send("ERROR");
			}
		});
	});


	res.send("Imagen agregado con exito");


});


form.parse(req);



};



exports.deleteObraImage = function(req, res){

  var imageName = req.body.imageName;

  var _id = imageName.split("_")[0];
  var imageID = ObjectID(imageName.split("_")[1].split(".")[0]);
  if(!imageName || !_id || !imageID){
    res.send(500,{error:true,message:"Missing parameters"});
  }else{

    _id = ObjectID(_id);
    
    glob("app/Obras/"+imageName,  function (er, files) {


      _(files).each(function(f,index){
        fs.unlinkSync(f);

      });


    });




    db.collection('obras', {
      strict: true
    }, function(err, collection) {



      collection.update({

        "_id": _id
      }, {
        $pull: {
            "imagenes": {
              
              imageID :imageID

            }
          }
      },
      function(err) {
        if (!err) {

          res.send("Imagen eliminada con exito");
        } else {
          res.send("ERROR");
        }
      });
    });




  }

  


};

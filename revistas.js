/*** Utilities ***/
var path = require("path");
var fs = require('fs');
var async = require("async");
var _ = require("underscore");
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
var formidable = require('formidable');
var glob = require("glob");

var mesNombre = {};
mesNombre["0"] = "Enero";
mesNombre["1"] = "Febrero";
mesNombre["2"] = "Marzo";
mesNombre["3"] = "Abril";
mesNombre["4"] = "Mayo";
mesNombre["5"] = "Junio";
mesNombre["6"] = "Julio";
mesNombre["7"] = "Agosto";
mesNombre["8"] = "Septiembre";
mesNombre["9"] = "Octubre";
mesNombre["10"] = "Noviembre";
mesNombre["11"] = "Diciembre";

exports.getRevistas = function(req, res) {



  db.collection('revistas', {
    strict: true
  }, function(err, collection) {



    collection.find({}, function(err, revistas) {

      if (!err) {

        revistas.toArray(function(err, revistas) {

          if (!err) {

            // res.send({
            //   listLength: productos.length,
            //   totalPages: totalPages,
            //   list: productos
            // });

            res.send(revistas);

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


exports.agregarRevista = function(req, res) {


  //VALIDATE FIRST

  var revista = req.body.revista;

  if (!revista) {

    res.send(500, "Missing parameters");
  } else {

    revista.Ano = new Date().getFullYear();
    revista.paginas = [];

    db.collection('revistas', {
      strict: true
    }, function(err, collection) {


      collection.save(revista,
        function(err) {
          if (!err) {
            var result = {
              error: false,
              message: "Revista agregada con exito",

            };
            res.send(result);
          } else {
            res.send("ERROR");
          }
        });
    });

  }

};



exports.actualizarRevista = function(req, res) {


  //VALIDATE FIRST



  db.collection('categorias', {
    strict: true
  }, function(err, collection) {
    var updatedProd = req.body.producto;
    updatedProd.Id_Producto = ObjectID(updatedProd.Id_Producto);
    updatedProd.IdCategoria = ObjectID(updatedProd.IdCategoria);



    collection.find({

        "productos.Id_Producto": updatedProd.Id_Producto
      }, {
        _id: 1,
        productos: {
          $elemMatch: {
            Id_Producto: updatedProd.Id_Producto
          }
        }
      },
      function(err, prods) {
        if (!err) {

          //Check if Categoria CHanged
          prods.toArray(function(err, arr) {
            var currProd = arr[0].productos[0];
            currProd.IdCategoria = arr[0]._id;

            var result = {
              error: false,
              message: "Producto actualizado con exito",


            };

            if (updatedProd.IdCategoria.equals(currProd.IdCategoria)) {

              updatedProd.imagenes = currProd.imagenes;



              collection.update({
                  _id: updatedProd.IdCategoria,
                  "productos.Id_Producto": updatedProd.Id_Producto
                }, {
                  $set: {

                    "productos.$.Nombre": updatedProd.Nombre,
                    "productos.$.Descripcion": updatedProd.Descripcion,
                    "productos.$.Precio": updatedProd.Precio,
                  }
                },
                function(err) {
                  if (!err) {
                    var result = {
                      error: false,
                      message: "Producto actualizado con exito",

                    };
                    res.send(result);
                  } else {
                    res.send("ERROR");
                  }
                });


            } else {
              updatedProd.imagenes = currProd.imagenes;



              collection.update({
                  _id: currProd.IdCategoria,
                  "productos.Id_Producto": currProd.Id_Producto
                }, {
                  $pull: {

                    "productos": {
                      Id_Producto: updatedProd.Id_Producto
                    }

                  }
                },
                function(err) {
                  if (!err) {



                    collection.update({
                        _id: updatedProd.IdCategoria,

                      }, {
                        $push: {

                          "productos": updatedProd

                        }
                      },
                      function(err) {
                        if (!err) {
                          var result = {
                            error: false,
                            message: "Producto actualizado con exito",

                          };
                          res.send(result);
                        } else {
                          res.send("ERROR");
                        }
                      });
                  } else {
                    res.send(err);
                  }
                });

            }



          });

        } else {
          res.send("ERROR");
        }
      });
  });



};



exports.eliminarRevista = function(req, res) {


  var _id = req.body._id || undefined;
  if (!_id) {
    res.send(500, "Missing parameters");
    return false;
  } else {



    db.collection('revistas', {
      strict: true
    }, function(err, categorias) {


      categorias.remove({
        _id: ObjectID(_id)

      }, function(err) {
        if (!err) {
          var result = {
            error: false,
            message: "Revista eliminado con exito"
          };
          res.send(result);
        } else {
          res.send("ERROR");
        }
      });
    });

  }



};

exports.agregarImagen = function(req, res, next) {

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  var finalFileName = "";
var IdPagina = ObjectID();
  var maxLen = 2 * 1024 * 1024;

  var form = new formidable.IncomingForm({
    uploadDir: __dirname + '/app/Revistas/',

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
      finalFileName =fields._id+"_"+IdPagina+"."+file.name.split(".").reverse()[0];
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
        next(new Error("Revista Empty"));
      }
      var fileName = fields.fileName;
      console.log(_id)

      db.collection('revistas', {
        strict: true
      }, function(err, collection) {


        collection.update({

            "_id": ObjectID(_id)
          }, {
            $addToSet: {
              "paginas": {
                indice: -1,
                imageName: finalFileName,
                IdPagina: IdPagina

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



    });


  form.parse(req);

};




exports.deletePagina = function(req, res){

  var imageName = req.body.imageName;

  var _id = imageName.split("_")[0];
  var IdPagina = ObjectID(imageName.split("_")[1].split(".")[0]);
  if(!imageName || !_id || !IdPagina){
    res.send(500,{error:true,message:"Missing parameters"});
  }else{

    _id = ObjectID(_id);
    
    glob("app/Revistas/"+imageName,  function (er, files) {


      _(files).each(function(f,index){
        fs.unlinkSync(f);

      });


    });




    db.collection('revistas', {
      strict: true
    }, function(err, collection) {



      collection.update({

        "_id": _id
      }, {
        $pull: {
            "paginas": {
              
              IdPagina :IdPagina

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





exports.asignarIndice = function(req, res) {


  var _id = req.body._id || undefined;
  var IdPagina = req.body.IdPagina || undefined;
  var indice = req.body.indice || indice;
  if (!_id || !IdPagina || !indice) {
    res.send(500, "Missing parameters");
    return false;
  } else {



    db.collection('revistas', {
      strict: true
    }, function(err, collection) {


      collection.update({
          _id: ObjectID(_id),
          "paginas.IdPagina": ObjectID(IdPagina)
        }, {
          $set: {

            "paginas.$.indice": indice,

          },

        },
        function(err) {
          if (!err) {
            var result = {
              error: false,
              message: "Indice asignado con exito",

            };
            res.send(result);
          } else {
            res.send("ERROR");
          }
        });

    });

  }


};

exports.verRevista = function(req, res) {


  var _id = req.query._id || undefined;

  db.collection('revistas', {
    strict: true
  }, function(err, collection) {



    collection.find({}, function(err, revistas) {

      if (!err) {

        revistas.toArray(function(err, revistas) {

          if (!err) {

            // res.send({
            //   listLength: productos.length,
            //   totalPages: totalPages,
            //   list: productos
            // });
            var mostRecent;
            var firstImageArr;
            if (_id) {


              _id = ObjectID(_id);
              mostRecent = _(revistas).filter(function(rev) {

                return rev._id.equals(_id);
              })[0] || {
                paginas: []
              };

              revistas.splice(revistas.indexOf(mostRecent), 1);

            } else {
              mostRecent = revistas.pop();
            }


            firstImageArr = _(revistas).chain().filter(function(r) {
              return r.paginas.length > 0;
            }).sortBy(function(r) {
              return r.mes;
            }).map(function(r) {

              var indexedPages = _.chain(r.paginas).sortBy(function(pag) {

                return pag.indice;
              }).filter(function(pag) {

                return pag.indice != -1;
              }).value();


              var firstPage = indexedPages.shift() || {};
              console.log("FIrst Page");
              console.log(firstPage);

              return _.extend({
                mes: r.mes,
                nombre: r.nombre,
                Id_Rev: r._id
              }, firstPage);


            }).reduce(function(seed, item) {
              seed.push(item);
              return seed;
            }, []).value();

            console.log("First Image Array");
            console.log(firstImageArr);

            var data = {
              mesNombre: mesNombre,
              revista: mostRecent,
              otras: firstImageArr
            };

            res.render(__dirname + "/app/partials/revista.html", {
              data: data
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
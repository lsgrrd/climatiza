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


exports.getProductos = function(req, res) {


  var pageSize = req.query.pageSize || undefined;
  console.log(pageSize);
  if (pageSize) {

    if (pageSize > 10) {
      pageSize = 10;

    }

  }


  var currentPage = req.query.currentPage || 1;



  var catFilter = req.query.catFilter || undefined;
  var sortFilter = req.query.sortFilter || undefined;
  var sortByProperty = sortFilter ? sortFilter.split("|")[0] : undefined;
  var sortDirection = sortFilter ? sortFilter.split("|")[1] : undefined;

  var findQuery = catFilter ? {
    _id: ObjectID(catFilter)
  } : {};



  db.collection('categorias', {
    strict: true
  }, function(err, collection) {



    collection.find(findQuery, {
      "nombre": 1,
      "productos": 1
    }, function(err, categorias) {

      if (!err) {

        categorias.toArray(function(err, categorias) {

          if (!err) {

            //res.send(JSON.stringify(arr));

            var productos = [];

            _.each(categorias, function(cat) {

              var tmp = _.map(cat.productos, function(p) {
                p.NombreCategoria = cat.nombre;
                p.IdCategoria = cat._id;

                return p;
              });

              productos = _.union(productos, tmp);



            });

            if (sortFilter) {
              if (sortByProperty != "Nombre") {
                productos = sortDirection === "Ascending" ? _.sortBy(productos, sortByProperty) : _.sortBy(productos, sortByProperty).reverse();
              } else {
                if (sortDirection === "Ascending") {
                  productos.sort(function(a, b) {
                    var nameA = a.Nombre.toLowerCase(),
                    nameB = b.Nombre.toLowerCase()
                      if (nameA < nameB) //sort string ascending
                        return -1
                      if (nameA > nameB)
                        return 1
                    return 0 //default return value (no sorting)
                  });
                } else {

                  productos.sort(function(a, b) {
                    var nameA = a.Nombre.toLowerCase(),
                    nameB = b.Nombre.toLowerCase()
                      if (nameA > nameB) //sort string ascending
                        return -1
                      if (nameA < nameB)
                        return 1
                    return 0 //default return value (no sorting)
                  });

                }

              }
            }
            var totalPages = 1;


            if (pageSize && currentPage) {
              console.log("pageSize");
              console.log(pageSize);

              totalPages = Math.ceil(productos.length / pageSize);
              console.log("SLICE ");

              console.log(pageSize * currentPage);
              var beginIndex = (currentPage - 1) * pageSize;
              var endIndex = (beginIndex + parseInt(pageSize));
              if (endIndex > productos.length) {
                endIndex = productos.length;
              }
              console.log([beginIndex, endIndex]);
              productos = productos.slice(beginIndex, endIndex);



            }



            res.send({
              listLength: productos.length,
              totalPages: totalPages,
              list: productos
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



exports.getProductosHome = function(req, res) {





  db.collection('categorias', {
    strict: true
  }, function(err, collection) {



    collection.find({},{},{limit:1}, {
      "nombre": 1,
      "productos": 1
    }, function(err, categorias) {

      if (!err) {

        categorias.toArray(function(err, categorias) {

          if (!err) {

            //res.send(JSON.stringify(arr));

            var productos = [];

            _.each(categorias, function(cat) {

              var tmp = _.map(cat.productos, function(p) {
                p.NombreCategoria = cat.nombre;
                p.IdCategoria = cat._id;

                return p;
              });

              productos = _.union(productos, tmp);



            });


            res.send(productos.slice(0,8));

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

// var sortingFuncFactory = function(sortFilter) {
//   switch (sortFilter) {

//     case "priceAscending":
//       return sortingFunc("Precio", "Number", "Ascending");



//     case "priceDescending":
//       return sortingFunc("Precio", "Number", "Descending");


//     default:
//       return null;


//   }
// };


// var sortingFunc = function(property, type, direction) {

//   switch (type) {
//     case "Number":

//       if (direction == "Ascending") {

//         return function(a, b) {
//           return a[property] - b[property];
//         };
//       }

//       if (direction == "Descending") {
//         return function(a, b) {
//           return b[property] - a[property];
//         };
//       }



//       break;
//     default:
//       return null;
//   }



// };

exports.agregarProducto = function(req, res) {


  //VALIDATE FIRST

  var IdCategoria = req.body.producto.IdCategoria;



  db.collection('categorias', {
    strict: true
  }, function(err, collection) {
    var producto = req.body.producto;
    producto.Fecha = new Date();
    delete producto.IdCategoria;
    producto.Id_Producto = ObjectID();

    collection.update({
      _id: ObjectID(IdCategoria)
    }, {
      $push: {
        productos: producto
      }
    },
    function(err) {
      if (!err) {
        var result = {
          error: false,
          message: "Producto agregado con exito",
          Id_Producto: producto.Id_Producto
        };
        res.send(result);
      } else {
        res.send("ERROR");
      }
    });
  });



};



exports.actualizarProducto = function(req, res) {


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



exports.eliminarProducto = function(req, res) {


  var IdCategoria = ObjectID(req.body.producto.IdCategoria);
  var Id_Producto = ObjectID(req.body.producto.Id_Producto);



  db.collection('categorias', {
    strict: true
  }, function(err, categorias) {


    categorias.update({
      _id: IdCategoria

    }, {

      $pull: {
        'productos': {
          Id_Producto: Id_Producto
        }
      }
    }, function(err) {
      if (!err) {
        var result = {
          error: false,
          message: "Producto eliminado con exito"
        };
        res.send(result);
      } else {
        res.send("ERROR");
      }
    });
  });



};






exports.agregarImagen = function(req, res, next) {

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  var maxLen = 2 * 1024 * 1024;

  var form = new formidable.IncomingForm({
    uploadDir: __dirname + '/app/ImagenesProductos/',

  }),
  fields = {},
  files = [];

  var imageID = ObjectID();
  var finalFileName = "";
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


      finalFileName =fields.Id_Producto+"_"+imageID+"."+file.name.split(".").reverse()[0];
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



      var Id_Producto = fields.Id_Producto;
      if (!Id_Producto) {
        next(new Error("Product Empty"));
      }
      var fileName = fields.fileName;
      console.log(Id_Producto)

      db.collection('categorias', {
        strict: true
      }, function(err, collection) {


        collection.update({

          "productos.Id_Producto": ObjectID(Id_Producto)
        }, {
          $addToSet: {
            "productos.$.imagenes": {
              imageName: finalFileName,
              imageID :imageID

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



  exports.agregarFichaTecnica = function(req, res, next) {

  // connect-form adds the req.form object
  // we can (optionally) define onComplete, passing
  // the exception (if any) fields parsed, and files parsed
  var maxLen = 2 * 1024 * 1024;

  var form = new formidable.IncomingForm({
    uploadDir: __dirname + '/app/ImagenesProductos/fichas/',

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

      fields.fileName = "ficha_" + fields.Id_Producto + "." + file.name.split(".").reverse()[0];

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
      file.path = form.uploadDir + fields.fileName;



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


      console.log(fields);
      var Id_Producto = fields.Id_Producto;
      if (!Id_Producto) {
        next(new Error("Product Empty"));
      }
      var fileName = fields.fileName;
      Id_Producto = ObjectID(Id_Producto);
      console.log(Id_Producto)

      db.collection('categorias', {
        strict: true
      }, function(err, collection) {


        collection.update({

          "productos.Id_Producto": Id_Producto
        }, {
          $set: {
            "productos.$.fichaTecnica": {
              imageName: fileName
            }
          }
        },
        function(err) {
          if (!err) {

            res.send("Ficha tecnica agregada con exito");
          } else {
            res.send("ERROR");
          }
        });
      });



    });


    form.parse(req);


  };



  exports.agregarThumb = function(req, res) {


  //VALIDATE FIRST

  var Id_Producto = ObjectID(req.body.Id_Producto);
  var imgBase64 = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");

  fs.writeFile(__dirname + "/app/ImagenesProductos/thumbs/" + "thumb_" + Id_Producto + ".png", new Buffer(imgBase64, "base64"), function(err) {

    db.collection('categorias', {
      strict: true
    }, function(err, collection) {



      collection.update({

        "productos.Id_Producto": Id_Producto
      }, {
        $set: {
          "productos.$.thumb": {
            imageName: "thumb_" + Id_Producto
          }
        }
      },
      function(err) {
        if (!err) {

          res.send("Thumbnail agregado con exito");
        } else {
          res.send("ERROR");
        }
      });
    });



  });



};




exports.deleteProductImage = function(req, res){

  var imageName = req.body.imageName;

  var Id_Producto = imageName.split("_")[0];
  var imageID = ObjectID(imageName.split("_")[1].split(".")[0]);
  if(!imageName || !Id_Producto || !imageID){
    res.send(500,{error:true,message:"Missing parameters"});
  }else{

    Id_Producto = ObjectID(Id_Producto);
    
    glob("app/ImagenesProductos/"+imageName,  function (er, files) {


      _(files).each(function(f,index){
        fs.unlinkSync(f);

      });


    });




    db.collection('categorias', {
      strict: true
    }, function(err, collection) {



      collection.update({

        "productos.Id_Producto": Id_Producto
      }, {
        $pull: {
            "productos.$.imagenes": {
              
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


/*

//Update Sub Item
db.categorias.update({
  nombre: 'Linea Blanca',
productos: { 
   $elemMatch:{
       Nombre : "Test 4"
       }
   }
},
{
  
  $set : {
     'productos.$.Nombre' : "Updated Name"
  }
})
*/


/*** Utilities ***/
var path = require("path");
var fs = require('fs');
var async = require("async");
var _ = require("underscore");
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
var formidable = require('formidable');



exports.getEspecialidades = function(req, res) {



  db.collection('especialidades', {
    strict: true
  }, function(err, collection) {



    collection.find({}, function(err, especialidades) {

      if (!err) {

        especialidades.toArray(function(err, especialidades) {

          if (!err) {

            //res.send(JSON.stringify(arr));

            res.send(especialidades);

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


exports.agregarEspecialidad = function(req, res) {


  //VALIDATE FIRST

  var especialidad = req.body.especialidad;



  db.collection('especialidades', {
    strict: true
  }, function(err, collection) {


    collection.save(especialidad,
      function(err) {
        if (!err) {
          var result = {
            error: false,
            message: "Especialidad agregada con exito"

          };
          res.send(result);
        } else {
          res.send("ERROR");
        }
      });
  });



};



exports.actualizarEspecialidad = function(req, res) {

  var especialidad = req.body.especialidad;


  if (!especialidad) {
    res.send(500, "Error");
    return false;
  }

  especialidad._id = ObjectID(especialidad._id);

  db.collection('especialidades', {
    strict: true
  }, function(err, collection) {


    collection.save(especialidad,
      function(err) {
        if (!err) {
          var result = {
            error: false,
            message: "Especialidad actualizada con exito"

          };
          res.send(result);
        } else {
          res.send("ERROR");
        }
      });
  });



};



exports.eliminarEspecialidad = function(req, res) {


  var _id = req.body._id || undefined;


  _id = ObjectID(_id);
  db.collection('especialidades', {
    strict: true
  }, function(err, especialidades) {


    especialidades.remove({
      _id: _id

    }, function(err) {
      if (!err) {
        var result = {
          error: false,
          message: "Especialidad eliminado con exito"
        };
        res.send(result);
      } else {
        res.send("ERROR");
      }
    });
  });



};
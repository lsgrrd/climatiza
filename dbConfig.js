/**** Mongo Setup *******/
var mongoPort = 27017;
var databaseName = "Climatiza";
var mongo = require('mongodb');
var MongoServer = mongo.Server,
  Db = mongo.Db;
var mongoServer = new MongoServer('localhost', mongoPort, {
  auto_reconnect: true
});
var db = new Db(databaseName, mongoServer);

var ObjectID = mongo.BSONPure.ObjectID;


exports.db = db;
exports.ObjectID = ObjectID;
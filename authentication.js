var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var passwordHash = require('password-hash');
exports.authenticate = function(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);

  db.collection('users', {
    strict: true
  }, function(err, collection) {


    if (err) {
      console.log("Error Collection not found");
    } else {
      console.log("User found");
    }



    collection.findOne({
      username: name,

    }, function(err, user) {
      if (err) {
        console.log("user not found");
      }
      if (user) {

        if (passwordHash.verify(pass, user.hashPass)) {
          //Login Sucess
          fn(null, user);
        } else {
          fn(new Error('invalid passowrd'));
        }


      } else {

        fn(new Error('user not found'));

      }


    });



  });



}

exports.restrict = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    var result = {
      error: true,
      message: "Access denied"
    };
    next(new Error("Access denied"));
  }
}

exports.adminRestrict = function(req, res, next) {
  if (req.session.user && req.session.user.rol === "ADMIN") {
    return next();
  } else {
    req.session.error = 'Access denied!';

    var result = {
      error: true,
      message: "Access denied"
    };
    next(new Error("Access denied"));
  }
}
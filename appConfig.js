/********** Express setup ******/
var expressPort = 80;
var express = require('express');
var app = express();



// Express app config
// This points the default route to the angular js seed
console.log(__dirname);

app.engine('html', require('ejs').renderFile);



// middleware


app.use(express.json())
	.use(express.urlencoded())

app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());

// Session-persisted message middleware

app.use(function(req, res, next) {
	var err = req.session.error,
		msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = '';
	if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
	if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
	next();
});




exports.app = app;
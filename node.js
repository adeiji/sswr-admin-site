function start ()
{
	var http = require("http");
	var fs = require("fs");
	var express = require('express');
	var app = express();
	var mongo = require("./mongo");

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(app.router);
	});

	app.post('/mongo', mongo.addCriteria);
	app.get('/mongo', mongo.getData);
	app.post('/mongo/update', mongo.update);
	app.use(express.static(__dirname));	
	app.listen(process.env.PORT || 8080);
};

exports.start = start;
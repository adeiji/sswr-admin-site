function start ()
{
	var http = require("http");
	var fs = require("fs");
	var express = require('express');
	var app = express();
	var mongo = require("./mongo");

	app.post('/mongo', mongo.openConnection);
	app.use(express.static(__dirname));	

	app.listen(process.env.PORT || 8080);
};

exports.start = start;
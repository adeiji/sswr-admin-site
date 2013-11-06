var mongoose = require('mongoose');
//var dbURI = 'mongodb://54.201.10.162/sswr';
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);
var db = mongoose.connection;
var InspectionCriteria;

var inspectionCriteriaSchema = mongoose.Schema( 
	{ 
		type :
		{
			typeName : String,
			part :
			{
				partName : String,
				options : String
			}
		}
	});

//Save the details to Mongo
exports.saveToMongo = function saveToMongo(inspectionDetail)
{
	inspectionDetail.save(function (err, inspectionDetail) {
		if (err)
		{
			console.log("Error saving");
		}
		else
		{
			console.log("Saved information succesfully");
		}
	});
};

//Add the criteria to the mongo database.  Gets typeName - string,
//partName - string, and options - string
exports.addCriteria = function addCriteria (request, response) {
	response.send(200, JSON.stringify(request.params));

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function callback () 
	{
		var inspectionDetail = new InspectionCriteria({ 
			type :
			{
				typeName : request.body.typeName,
				part :
				{
					partName : request.body.partName,
					options : request.body.option
				}
			}
		}); 
		saveToMongo(inspectionDetail);
	});

};

exports.getData = function getData (request, response) {
	debugger;
	var body = "hello world";
	response.setHeader('Content-Type', 'text/plain');
	response.setHeader('Content-Length', body.length);
	response.end(body);
}
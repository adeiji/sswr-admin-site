var mongoose = require('mongoose');
//var dbURI = 'mongodb://54.201.10.162/sswr';
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);
var db = mongoose.connection;

console.log('Connected to port : ' + mongoose.connection.port);
console.log('Connected to host : ' + mongoose.connection.host);

var inspectionCriteriaSchema = mongoose.Schema( 
	{ 
		type :
		{
			typeName : String,
			part :
			{
				partName : String,
				options : []
			}
		}
	});

var InspectionCriteria = mongoose.model('InspectionCriteria', inspectionCriteriaSchema);
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
exports.addCriteria = function addCriteria (request, response) 
{
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
					options : request.body.options
				}
			}
		}); 
		debugger;
		console.log("Opened Connection");
		saveToMongo(inspectionDetail);
	});

};

exports.getData = function getData (request, response) {
	InspectionCriteria.find( { "type.typeName" : "Trolley" }, 
		function (err, docs) 
		{
			var body = JSON.stringify(docs);
			body.response = response;
			response.setHeader('Content-Type', 'application/json');
			response.setHeader('Content-Length',body.length);
			response.write(body);
			response.end();
			debugger;
		 });

}
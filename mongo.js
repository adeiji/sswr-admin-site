var mongoose = require('mongoose');
//var dbURI = 'mongodb://54.201.10.162/sswr';
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);
var db = mongoose.connection;
var InspectionCriteria;

exports.openConnection = function openConnection (request, response) {	
	console.log('Reached mongo open connection');
	console.log(request.params);
	response.send(200, JSON.stringify(request.params));

	console.log('Connection Successful');		
	var mongoose = require('mongoose');
	var inspectionCriteriaSchema = mongoose.Schema( 
	{ 
		type :
		{
			typeName : String,
			part :
			{
				partName : String,
				options : Array
			}
		}
	});
};

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
exports.addCriteria = function addCriteria () {
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function callback (typeName, partName, option) 
	{
		var inspectionDetail = new InspectionCriteria({ 
			type :
			{
				typeName : typeName,
				part :
				{
					partName : partName,
					options : option
				}
			}
		}); 
		saveToMongo(inspectionDetail);
	});

};


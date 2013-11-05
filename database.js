function main ()
{
	var http = require("http");

	http.createServer(function (request, response) {
		response.writeHead(200, {"Content-Type" : "text/plain"});		
		response.end();
	}).listen(8080);
}

function start () {
 	var mongoose = require('mongoose');
	var dbURI = 'mongodb://localhost/test';

	mongoose.connect(dbURI);

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function callback() {

		var inspectionCriteriaSchema = mongoose.Schema( 
		{ 
			type:
			{
				typeName : String,
				part:
				{
					partName : String,
					options :
					{
						options : [ { option : String }]
					}
				}
			}
		});

		var InspectionCriteria = mongoose.model('inspectionCriteria', inspectionCriteriaSchema);

		var inspectionCriteria = new InspectionCriteria(
			{ 
				type : 
				{
					typeName : 'Bridge',
					part :
					{
						partName : 'Trolley',
						options :
						{
							options : [ { option : 'Release the chasse', option : 'Change the chasse' }]	
						}
					}
				}
			}); 

		inspectionCriteria.save(function (err, fluffy) {
			if (err)  //TODO handle the error
			{
				console.log('save error:');
			}
			else 
			{
				console.log("Saved information succesfully");
			}
		});

		console.log("Connection is opened");

		mongoose.connection.close(function () {
			console.log('Mongoose connection closed');
		})

		return inspectionCriteria.type;
	});
	return "Connection failed";	
 }; 

 main();

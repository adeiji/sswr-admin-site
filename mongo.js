var mongoose = require('mongoose');
//var dbURI = 'mongodb://54.01.10.162/sswr';
var dbURI = 'mongodb://localhost/test';
mongoose.connect(dbURI);
var db = mongoose.connection;
var InspectionCriteria;
var inspectionCriteriaSchema;
var partSchema;
var Part;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () 
{
	var Schema = mongoose.Schema;

	partSchema = new Schema( 
			 		{
						partName : String,
						optionList : []
					});

	Part = mongoose.model('Part', partSchema);

	inspectionCriteriaSchema = new Schema( 
	{ 
		type :
		{
			typeName : String,
			part : [Part.schema]
		}
	});

	InspectionCriteria = mongoose.model('InspectionCriteria', inspectionCriteriaSchema);
});

//Save the details to Mongo
function saveToMongo(inspectionDetail)
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
	response.send(200, JSON.stringify(  request.params));

	console.log('Connected to port : ' + mongoose.connection.port);
	console.log('Connected to host : ' + mongoose.connection.host);

	var inspectionDetail = new InspectionCriteria({ 
		type :
		{
			typeName : request.body.details.typeName,
			part :
			{
				partName 	: request.body.details.partName,
				optionList 	: request.body.details.options
			}
		}
	}); 
	
	saveToMongo(inspectionDetail);
};
//Update the model
exports.update = function update (request,respone) {

	var typeModel = mongoose.model('InspectionCriteria', inspectionCriteriaSchema);
	var partModel = mongoose.model('Part', partSchema);
	
	//create the JSON object that stores the request body
	var typeObject = new typeModel(request.body);
	var partObject = new partModel(request.body.type.part);
	
	//Push the part to the JSON object
	// console.log(typeObject);
	// console.log(partObject);

	//Get the actual object of the typeObject
	var upsertData = typeObject.toObject();

	
	delete upsertData._id;

	//First we check to see if there is already this crane and part created and in the database.  If it is then we simply update the data.
	// typeModel.update({ typeName : request.body.type.typeName, partName : request.body.type.part.partName }, upsertData.type.part , { upsert : false }, function  (err, numberAffected, raw) {
	// 	if (err) { 
	// 		console.log("Error : " + err); 
	// 	};


		//If nothing was updated, then we check if only this crane is in the database, and if it is we update it with the new part, if not then we create it.
		// if (numberAffected == 0)
		// {
		// 	console.log("Both part and type did not exist in the database!");
		// 	typeModel.update({ typeName : request.body.type.typeName }, upsertData , { upsert : true }, function  (err, numberAffected, raw) {

		// 		console.log("The number of updated documents was %d", numberAffected);
		// 		console.log("The raw response from mongo was ", raw);
		// 	});
		// };

		// console.log("The number of updated documents was %d", numberAffected);
		// console.log("The raw response from mongo was ", raw);
//	} );

	//Check to see if this part and type exists in the database and if so add the new information

	//console.log(upsertData.type.part);

	typeModel.findOne({ "type.typeName" : request.body.type.typeName, "type.part.partName" : request.body.type.part.partName } ,
		 function (err, foundObject) {
			if (foundObject)
			{
				console.log("Document with both partname and typename " + foundObject);
				foundObject.type.part.pull(foundObject.type.part[0]._id).push(partObject);

				foundObject.save(function  (err) {
					if (err) 
					{
						console.log("ERROR");
					}
					else
					{
						console.log("SUCCESS");
					};
				});
			}
			else
			{
				typeModel.findOne( { "type.typeName" : request.body.type.typeName },
					function  (err, foundObject) {
						if (foundObject)
						{
							console.log("Document with just typeName " + foundObject);
							foundObject.type.part.push(partObject);

							foundObject.save(function  (err) {
								if (err)
								{
									console.log("Error saving new part");
								}
								else
								{
									console.log("Success in saving new part");
								}
							})
						}
						else
						{
							typeObject.type.part.push(partObject);
							typeObject.save(function  (err) {
								if (err)
								{
									console.log("Error saving complete document");
								}
								else
								{
									console.log("Success in saving complete document");
								}
							})
						}
					}
				 )
			};
		}	
	); 
};

exports.getData = function getData (request, response) {
	//"type.typeName" : "Trolley"

	var queryObject = {};
	
	// for (var query in request.query)
	// {
	// 	//Get the specified column we're searching for
	// 	var column = request.query.column.toString();
	// 	//Get the specified item we're searching for
	// 	var item = request.query.item.toString();

	// 	queryObject = { column : item };
	// 	break;
	// }
	// console.log(queryObject.item);
	// console.log(queryObject.column);

	//console.log(request.query);

	InspectionCriteria.find( request.query, 
		function (err, docs) 
		{
			var body = JSON.stringify(docs);
			body.response = response;
			response.setHeader('Content-Type', 'application/json');
			response.setHeader('Content-Length',body.length);
			response.write(body);
			response.end();
		 });
}
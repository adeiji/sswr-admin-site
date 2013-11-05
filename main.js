$( document ).ready(function () {
	alert('hello');
	$("#addOption").click( function()
	{
		var typeName = "type";
		var partName = "partName";
		var part = "part";

		var request = $.ajax({
	        url: "http://localhost:8080/mongo",
	        async: false,
	        type: "POST",
	        data: { 
	        	typeName 	: "typeName",
	        	partName  	: "partName",
	        	part 		: " part" 
	        },
	        contentType: "application/javascript",
	        dataType: "json"
    });
	});
});
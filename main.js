$( document ).ready(function () {
	var jsonSchema = buildJSONSchema(3);
	var jsonToAdd = buildJSONToAdd();

	var typeName = "Chicken";
	var part = "IS";
	var option = "Delicisions";

	var request = $.ajax({
        url: "/mongo",
        async: false,
        type: "POST",
        data: JSON.stringify(
        	{ 
        		crane : {
        			typeName 	: typeName,
        			partName 	: part,
        			option 		: option
        		} 
        	}),
        contentType: "application/json",
	});

	var response = $.ajax({
		url: "/mongo", 
		type: "GET", 
		dataType : "json",
		success: function onSuccess (response) {  
			alert(JSON.stringify(response));		
			var typeName = response[0].type.typeName;
			var part = response[0].type.part.partName;
			var option = response[0].type.part.options;

			$("#nestable").append("<ol class='dd-list'>");
				$("#nestable").append("<li class='dd-item' data-id='1'>");
					$("#nestable").append("<button data-action='collapse' type='button'>Collapse</button>");
					$("#nestable").append("<button data-action='expand' type='button' style='display: none;'>Expand</button>");
					$("#nestable").append("<div class='dd-handle'>" + typeName + "</div>");
					$("#nestable").append("<ol class='dd-list'>");
						$("#nestable").append("<li class='dd-item' data-id='2'>");
                       		$("#nestable").append("<div class='dd-handle'>" + part + "</div>");
                       	$("#nestable").append("</li>");
                       	$("#nestable").append("<li class='dd-item' data-id='3'>");
					        $("#nestable").append("<div class='dd-handle'>" + option + "</div>");
	                    $("#nestable").append("</li>");
                    $("#nestable").append("</ol>");
				$("##nestable").append("</li>");
			$("##nestable").append("</ol>");
	},
		error: 
    		function onError () {
    			alert('failed to get data');
    		}
	});

	//Build the JSON schema that will be sent to the server on the POST request
	function buildJSONSchema (levels) {
		var json;
		for (var i = 0; i < levels; i++) {
			json = json + 	"type { typeName : String, data-id : Integer";
		};
		json = json + 	"part : [ { partName : String, data-id : Integer, options : [ { optionName : String, data-id: Integer } ], } ]";
		for (var i = 0; i < levels; i++) {
			json = json + ",}";
		};

		return json;
	};

	function buildJSONToAdd () {
		
	};
});
$( document ).ready(function () {
	$("#addOption").click( function()
	{
		var typeName = $('#partType').val();
		var part = $('#part').val();;
		var option = $('#option').val();;

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
    		success: 
    			function onSuccess(response)
	    		{
	    			alert(JSON.stringify(response) + ": received data");
	    		},
    		error: 
	    		function onError () {
	    			alert('failed to get data');
	    		}
    	});
	});
});
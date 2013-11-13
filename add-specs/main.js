var options = [];
var optionNum = 204878
var optionCounter = 3;
var dataId = 1;

$(document).ready( function () {
	var response = $.ajax({
		url: "/mongo", 
		type: "GET",
		dataType : "json",
		success: function onSuccess (response) { 			
			var typeName;
			var partName;
			var optionList = [];

			for (var i = 0; i < response.length; i++) {
				typeName = response[i].type.typeName;

				$("#box1View").append("<option value='501649'>" + typeName + "</option>");
			};

	},
		error: 
    		function onError () {
    			alert('failed to get data');
    		}
	});

	function getSubDocuments (criteria, level) {
		dataId ++ ;
		optionNum ++;
		var result = null;

		$.ajax({
			url: "/mongo", 
			type: "GET", 
			data: criteria,
			dataType : "json",
			success: function onSuccess (response) {
				if (level == 2)
				{
					for (var i = 0; i < response.length; i++) {					
						partName = response[i].type.part.partName;

						$("#box" + level + "View").append("<option value='" + optionNum + "'>" + partName + "</option>");
					};
				}
				if (level == 3)
				{
					optionList = response[0].type.part.options;
					for (var i = 0; i < optionList.length; i++) {
						$("#box" + level + "View").append("<option value='" + optionNum + "'>" + optionList[i] + "</option>");
					};
				}	
			},
			error:
				function onError () {
					alert("Failed to get data");
				}
		});

		return result;
	};

	$("#addType1").click(function () {
		optionNum = optionNum + 1;
		/* We empty the array so that we can still add the same options again later since this 
		array stores the options that have already been entered. */
		options = [];
		optionCounter = 0;

		var input = $('input[level="1"').val();

		$('select[level="1"]').append('<option value="' + optionNum + '">' + input + '</option>');
	});

	$("#addType2").click(function () {
		optionNum = optionNum + 1;
		/* We empty the array so that we can still add the same options again later since this 
		array stores the options that have already been entered. */
		options = [];
		optionCounter = 0;

		var input = $('input[level="2"').val();

		$('select[level="2"]').append('<option value="' + optionNum + '">' + input + '</option>');
	});

	$("#addType3").click(function () {
		optionNum = optionNum + 1;

		var input = $('input[level="3"]').val();

		$('select[level="3"]').append('<option value="' + optionNum + '">' + input + '</option>');
	});

	//When the type is selected
	$('select[level="1"').change(function () {
		//We need to remove everything from this div so that we make sure that we only contain one level here at a time.
		$('#nestable_list_1').empty();
		$('#box2View').empty();
		$('#box3View').empty();
		//Get the typename from the select list and then store that type name in the div typeName attribute.
		var typeName = $('select[level="1"] option:selected').text();
		//Append the selected item from the selected BoxView to the list
		$('#nestable_list_1').append(
				'<ol class="dd-list">' +
					'<li class="dd-item" data-id="1" level="1">' + 
            			'<div class="dd-handle" typeName="' + typeName + '">' + typeName + '</div>' +
						'<ol class="dd-list" level="1">' +								
						'</ol>' +					
					'</li>' +
    			'</ol>');

		//Check to see if there's any parts attributed to this Type
		var craneSpec = getSubDocuments({		
			"type.typeName" 	: typeName
		}, 2);
	});
	//When the part is selected
	$('select[level="2"').change(function () {
		//We need to remove everything from this div so that we make sure that we only contain one level here at a time.
		$('ol[level="1"]').empty();	
		$('#box3View').empty();	
		//Get the part name from the select list and then store that type name in the div partName attribute.
		partName = $('select[level="2"] option:selected').text();
		//Append the selected item from the selected BoxView to the list
		$('ol[level="1"]').append(
			'<li class="dd-item" data-id="2" level="2">' +
				'<div class="dd-handle" partName="' + partName + '">' + partName + '</div>' +
				'<ol class="dd-list" level="2">' +
				'</ol>' +
			'</li>');

		var craneSpec = getSubDocuments({		
			"type.part.partName" 	: partName
		}, 3);
	});

	$('select[level="3"').change(function addToList () {
		var optionText = $('select[level="3"] option:selected').text();

		if (options.indexOf(optionText) == -1)
		{
			options.push(optionText);

			//Append the selected item from the selected BoxView to the list
			$('ol[level="2"]').append(		
				'<li class="dd-item" data-id="' + optionCounter + '">' +
					'<div class="dd-handle" optionText="' + optionText + '">' + optionText + '</div>' +				
				'</li>');	
			};
			optionCounter ++;
	});

	//When the user clicks on the save button, we will save this information into the database using a POST request
	$('#save').click(function  () {
		typeName = $('div[typeName]').attr('typeName');
		partName = $('div[partName]').attr('partName');
		var optionsToAdd = [];
		
		$('div[optionText]').each(function () {
			optionsToAdd.push($(this).attr('optionText'));
		});

		sendRequest(typeName, partName, optionsToAdd);

		function sendRequest (typeName, partName, optionsToAdd) {
			var request = $.ajax({
		        url: "/mongo/update",
		        async: true,
		        type: "POST",
		        data: JSON.stringify(
		        	{ 
		        		type : {
		        			typeName 	: typeName,
		        			part : {
		        				partName 	: partName,
		        				optionList 	: optionsToAdd
		        			}
		        		} 
		        	}),
		        contentType: "application/json",
			});
		};
	})

	$('.dd').nestable({});
});

function addArea () {
    

};
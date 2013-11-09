var options = [];
var optionNum = 204878
var optionCounter = 3;

$(document).ready( function () {
	var response = $.ajax({
		url: "/mongo", 
		type: "GET", 
		dataType : "json",
		success: function onSuccess (response) {  			
			var typeName = response[0].type.typeName;
			var part = response[0].type.part.partName;
			var option = response[0].type.part.options.split(',');

			$("#box1View").append("<option value='501649'>" + option[0] + "</option>");
			$("#box1View").append("<option value='501648'>" + option[1] + "</option>");
	},
		error: 
    		function onError () {
    			alert('failed to get data');
    		}
	});

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
	});
	//When the part is selected
	$('select[level="2"').change(function () {
		//We need to remove everything from this div so that we make sure that we only contain one level here at a time.
		$('ol[level="1"]').empty();		

		//Get the part name from the select list and then store that type name in the div partName attribute.
		partName = $('select[level="2"] option:selected').text();
		//Append the selected item from the selected BoxView to the list
		$('ol[level="1"]').append(
			'<li class="dd-item" data-id="2" level="2">' +
				'<div class="dd-handle" partName="' + partName + '">' + partName + '</div>' +
				'<ol class="dd-list" level="2">' +
				'</ol>' +
			'</li>');
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
		        url: "/mongo",
		        async: false,
		        type: "POST",
		        data: JSON.stringify(
		        	{ 
		        		details : {
		        			typeName 	: typeName,
		        			partName 	: partName,
		        			options 	: optionsToAdd
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
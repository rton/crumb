let entryForm = document.getElementById('entry_form');	  
var submitButton = document.getElementById('submit_button');

var username = document.getElementById('user').innerText;

submitButton.onclick = submitForm;

function submitForm() {
	let formData = new FormData(entryForm);

	var params = {
	  // The ID of the spreadsheet to update.
	  spreadsheetId: '133rMm6P9SK7CKoZrfwNF0cgkmSs9nxlysZw0okJHB5k',

	  // The A1 notation of the values to update.
	  range: '2022 Crumbs!A2',  // TODO: Update placeholder value.

	  // How the input data should be interpreted.
	  valueInputOption: 'USER-ENTERED',  // TODO: Update placeholder value.
	};


	var valueRangeBody = '{"values": []}';

	var obj = JSON.parse(valueRangeBody);

	var values = new Array();

	for (var value of formData.values()) {
	  console.log(value);
	  values.push(value);
	}

	values.push(document.getElementById('user').innerText);
	console.log(values);

	obj.values.push(values);

	valueRangeBody = JSON.stringify(obj);

	var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
	request.then(function(response) {
	  // TODO: Change code below to process the `response` object:
	  console.log(response.result);
	}, function(reason) {
	  console.error('error: ' + reason.result.error.message);
	});

	entryForm.reset();
}
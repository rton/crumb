
// Client ID and API key from the Developer Console
var CLIENT_ID = '41224867976-qkr47jdd25q0em60bbodstqmdr9h93hg.apps.googleusercontent.com';
var API_KEY = localStorage.getItem('key');

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var addEntry = document.getElementById('add_entry');

// var addEntryButton = document.getElementById('add_entry_button');

var googleAuth;

let entryForm = document.getElementById('entry_form');	  
var submitButton = document.getElementById('submit_button');

var username = document.getElementById('user').innerText;

submitButton.onclick = submitForm;

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
	gapi.client.init({
	  apiKey: API_KEY,
	  clientId: CLIENT_ID,
	  discoveryDocs: DISCOVERY_DOCS,
	  scope: SCOPES
	}).then(function () {
	  googleAuth = gapi.auth2.getAuthInstance();

	  // Listen for sign-in state changes.
	  googleAuth.isSignedIn.listen(updateSigninStatus);

	  // Handle the initial sign-in state.
	  updateSigninStatus(googleAuth.isSignedIn.get());
	  
	  authorizeButton.onclick = handleAuthClick;
	  signoutButton.onclick = handleSignoutClick;
	  // addEntryButton.onclick = handleAddEntryClick;
	}, function(error) {
	  appendPre(JSON.stringify(error, null, 2));
	});
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
	  authorizeButton.style.display = 'none';
	  signoutButton.style.display = 'block';
	  
	  document.getElementById('user').innerText = googleAuth.currentUser.get().getBasicProfile().getName();
	  
	  addEntry.style.display = 'block';
	  
	} else {
	  authorizeButton.style.display = 'block';
	  signoutButton.style.display = 'none';
	  
	  addEntry.style.display = 'none';
	  entryForm.reset();
	  
	  document.getElementById('user').innerText = "";
	}
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
	googleAuth.signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
	googleAuth.signOut();
}

function handleAddEntryClick(event) {
	$("#index").load("add.html");
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
		pre.appendChild(textContent);
}

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
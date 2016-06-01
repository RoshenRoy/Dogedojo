var provider = new firebase.auth.GoogleAuthProvider();
var user;


$( document ).ready(function() {
	$("#welcome").hide();
	document.getElementById("upload").addEventListener('change', handleFileSelect, false);
});

function signIn() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  showWelcomeContainer();
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

};

function showWelcomeContainer() {
	$("#login").hide();
	$("#welcome").show();
	$("#welcomeText").html("Hello, " + user.displayName);
};

$(".dropdown").on("hide.bs.dropdown", function(event){
    var text = $(event.relatedTarget).text(); // Get the text of the element
    firebase.database().ref('Users/' + user.uid).set({
    	name: user.displayName,
    	email: user.email,
    	favDog: text
  	});

});

function handleFileSelect(event) {
	var file = event.target.files[0];
	var metadata = {
		contentType: 'image',
		dogType: 'Lab'
	};
	var uploadTask = firebase.storage().ref().child('dogImages/' + file.name).put(file, metadata);
	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function(snapshot){
  		// Observe state change events such as progress, pause, and resume
  		// See below for more detail
	}, function(error) {
  		// Handle unsuccessful uploads
	}, function() {
  		// Handle successful uploads on complete
  		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
  		var downloadURL = uploadTask.snapshot.downloadURL;

	});
};



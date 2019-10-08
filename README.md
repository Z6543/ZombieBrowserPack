ZombieBrowserPack
=================

Firefox, Chrome, Safari browser extensions, Rails control server, Meterpreter scripts, SET plugin, Zombie browsers

## Zombie browser pack
Copyright (C) 2012  Zoltan Balazs

This pack is a fully functional malicious browser extension pack, created for educational and testing purposes.
Please don't use them for malicious purposes or without proper permission.

Against the dark side (a.k.a black-hat usage), the extensions have been uploaded to antivirus vendors and Virustotal, and contain scheduled pop-ups to inform the users about the extension.

What you can find in this pack:

## Full
The "full/client" directory contains the source code and build instructions to create the Firefox, Chrome, and Safari browser extensions. 
The "full/server" directory contains the source code for the rails server-side code, which can be used to control the clients. 

## Lite
The "lite/client" directory contains the source code and build instructions to create the Firefox, Chrome, and Safari browser extensions, lite edition, which has limited instructions set and a lightweight server side protocol. 
The "lite/server" directory contains the source code for the rails server-side code, which can be used to control the clients. The static files can be used to control the clients, and if you want to receive the passwords and cookies from the clients, you need PHP as well. 

## Meterpreter
The "meterpreter_autorun/firefox" directory contains the Meterpreter autorun scripts to install the extensions into Firefox.
The "meterpreter_autorun/chrome" directory contains the Meterpreter autorun scripts to install the extensions into Chrome.

## SET
The "set_plugin" directory contains the SET plugin to social engineered install the Firefox extension into the victim Firefox browser.

The setup_servername.sh purpose is to mass change the files which have the server name in it. 
### Usage
./setup_servername.sh <<Your server name or IP address here>> 
  
## Main functions
| Function |          Firefox          |          Chrome                     |              Safari |
|--|--|--|--|
| Password stealing                                                                | supported                 | supported                           | supported                         |
| Cookie stealing                                                                  | supported                 | supported                           | only cookies not httponly         |
| Remote control from server                                                       | supported                 | supported                           | supported                         |
| Stealing passwords from built-in password manager                                | supported                 | ?                                   | missing API?                      |
| Uploading files from client to server                                            | supported                 | was possible via NPAPI, not anymore | missing API?                      |
| Downloading files from server to client                                          | supported                 | was possible via NPAPI, not anymore | missing API?                      |
| Executing executable                                                             | supported, Windows only   | was possible via NPAPI, not anymore | missing API?                      |
| Disabling browser blocklist update                                               | supported                 | was possible via NPAPI, not anymore | missing API?                      |
| Geolocation                                                                      | supported                 | supported                           | ?                                 |
| Playing ogg music in browser                                                     | supported                 | supported                           | supported                         |
| Text to speech                                                                   | missing API?              | supported                           | missing API?                      |
| javascript - Malware-in-the browser (rewrite content, form injection)            | supported                 | supported                           | supported                         |
| javascript - Sending HTTP request to a server and send response back to attacker | supported                 | supported                           | possible                          |
| javascript - change flash config and spy on webcam                               | supported                 | was possible via NPAPI, not anymore | missing API?                      |
| DDOS                                                                             | possible, won't implement | possible, won't implement           | possible, won't implement         |
| send spam via webmail                                                            | possible, won't implement | possible, won't implement           | possible, won't implement         |
| distributed password cracking (or crypto coin mining)                            | possible in Windows native| supported, NaCL                     | javascript only, poor performance |
| setup a new proxy (dont use it if client already uses one ...)                   | possible, todo            | ?                                   | ?                                 |

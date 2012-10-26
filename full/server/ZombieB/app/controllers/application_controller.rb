class ApplicationController < ActionController::Base
#  protect_from_forgery
after_filter :set_access_control_headers
#after_filter :disable_cache
#config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

def set_access_control_headers
	headers['Access-Control-Allow-Origin'] = '*'
	headers['Access-Control-Request-Method'] = '*'
end
def disable_cache
	headers['Last-Modified'] = Time.now.httpdate
end
end

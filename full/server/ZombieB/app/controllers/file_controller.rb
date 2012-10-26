class FileController < ApplicationController

  def index
    filename = 'flashX@adobe.com.xpi'

    extname = File.extname(filename)[1..-1]
    mime_type = Mime::Type.lookup_by_extension(extname)
    content_type = mime_type.to_s unless mime_type.nil?

    # 1
    #headers['Content-Type'] = content_type
    #render :file => filename

    # 2
    render :file => filename, :content_type => content_type
	#head :ok
  end

end

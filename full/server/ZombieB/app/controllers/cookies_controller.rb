class CookiesController < ApplicationController
http_basic_authenticate_with :name => "admin", :password => "admin", :except => [:new_fromhash]

  # GET /cookies
  # GET /cookies.json
  def index
    @cookies = Cookie.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cookies }
    end
  end

  # GET /cookies/1
  # GET /cookies/1.json
  def show
    @cookie = Cookie.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @cookie }
    end
  end

  def new_fromhash
    @zombie = Zombie.where(:hashid => params[:hashid]).first
	@cookie = @zombie.cookies.create(params[:cookie])
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @cookie }
    end
  end
  
  # GET /cookies/new
  # GET /cookies/new.json
  def new
	@zombie = Zombie.find(params[:zombie_id])
    @cookie = @zombie.cookie.create(params[:cookie])

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @cookie }
    end
  end

  # GET /cookies/1/edit
  def edit
    @cookie = Cookie.find(params[:id])
  end

  # POST /cookies
  # POST /cookies.json
  def create
    @zombie = Zombie.find(params[:zombie_id])
    @cookie = @zombie.cookie.create(params[:cookie])

    respond_to do |format|
      if @cookie.save
        format.html { redirect_to @zombie, notice: 'Cookie was successfully created.' }
        format.json { render json: @cookie, status: :created, location: @cookie }
      else
        format.html { render action: "new" }
        format.json { render json: @cookie.errors, status: :unprocessable_entity }
      end
    end
  end

 
  # DELETE /cookies/1
  # DELETE /cookies/1.json
  def destroy
    @cookie = Cookie.find(params[:id])
    @cookie.destroy

    respond_to do |format|
      format.html { redirect_to cookies_url }
      format.json { head :no_content }
    end
  end
  
	def removeall
	  Cookie.delete_all
	  flash[:notice] = "You have removed all cookies!"
	  redirect_to zombies_path
	end
	  
end

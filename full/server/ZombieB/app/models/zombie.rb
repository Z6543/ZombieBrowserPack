class Zombie < ActiveRecord::Base
validates_uniqueness_of :hashid
#validates_format_of :username, :with => /^(\w\s\.\_)+$/i, :message => "can only contain letters and numbers."
#validates_format_of :browsername, :with => /^(\w\s\.)+$/i, :message => "can only contain letters and numbers."
#validates_format_of :browserversion, :with => /^(\d\s\.)+$/i, :message => "can only contain numbers and dots."
#validates_format_of :hashid, :with => /^(a-f0-9)+$/i, :message => "can only contain hex letters."
has_one :ccconfig
has_many :cookies, :class_name => 'Cookie'
has_many :postinfos
attr_accessible :username, :os, :browsername, :browserversion, :lastseen, :updated_at, :hashid
end

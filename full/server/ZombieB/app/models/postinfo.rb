class Postinfo < ActiveRecord::Base
  belongs_to :zombie
  attr_accessible :data
end

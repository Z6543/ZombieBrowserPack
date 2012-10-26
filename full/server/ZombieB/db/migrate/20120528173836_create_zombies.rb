class CreateZombies < ActiveRecord::Migration
  def change
    create_table :zombies do |t|
      t.string :username
      t.string :os
      t.string :browsername
      t.string :browserversion
      t.datetime :lastseen
      t.string :hashid

      t.timestamps
    end
  end
end

class CreateCookies < ActiveRecord::Migration
  def change
    create_table :cookies do |t|
      t.string :data
      t.references :zombie

      t.timestamps
    end
    add_index :cookies, :zombie_id
  end
end

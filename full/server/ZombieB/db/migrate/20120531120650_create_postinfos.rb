class CreatePostinfos < ActiveRecord::Migration
  def change
    create_table :postinfos do |t|
      t.string :data
      t.references :zombie

      t.timestamps
    end
    add_index :postinfos, :zombie_id
  end
end

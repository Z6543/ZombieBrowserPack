require 'test_helper'

class PostinfosControllerTest < ActionController::TestCase
  setup do
    @postinfo = postinfos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:postinfos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create postinfo" do
    assert_difference('Postinfo.count') do
      post :create, postinfo: @postinfo.attributes
    end

    assert_redirected_to postinfo_path(assigns(:postinfo))
  end

  test "should show postinfo" do
    get :show, id: @postinfo
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @postinfo
    assert_response :success
  end

  test "should update postinfo" do
    put :update, id: @postinfo, postinfo: @postinfo.attributes
    assert_redirected_to postinfo_path(assigns(:postinfo))
  end

  test "should destroy postinfo" do
    assert_difference('Postinfo.count', -1) do
      delete :destroy, id: @postinfo
    end

    assert_redirected_to postinfos_path
  end
end

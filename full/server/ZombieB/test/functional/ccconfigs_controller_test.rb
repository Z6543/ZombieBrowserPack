require 'test_helper'

class CcconfigsControllerTest < ActionController::TestCase
  setup do
    @ccconfig = ccconfigs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:ccconfigs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create ccconfig" do
    assert_difference('Ccconfig.count') do
      post :create, ccconfig: @ccconfig.attributes
    end

    assert_redirected_to ccconfig_path(assigns(:ccconfig))
  end

  test "should show ccconfig" do
    get :show, id: @ccconfig
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @ccconfig
    assert_response :success
  end

  test "should update ccconfig" do
    put :update, id: @ccconfig, ccconfig: @ccconfig.attributes
    assert_redirected_to ccconfig_path(assigns(:ccconfig))
  end

  test "should destroy ccconfig" do
    assert_difference('Ccconfig.count', -1) do
      delete :destroy, id: @ccconfig
    end

    assert_redirected_to ccconfigs_path
  end
end

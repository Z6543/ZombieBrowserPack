require 'test_helper'

class CookiesControllerTest < ActionController::TestCase
  setup do
    @cookie = cookies(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:cookies)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create cookie" do
    assert_difference('Cookie.count') do
      post :create, cookie: @cookie.attributes
    end

    assert_redirected_to cookie_path(assigns(:cookie))
  end

  test "should show cookie" do
    get :show, id: @cookie
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @cookie
    assert_response :success
  end

  test "should update cookie" do
    put :update, id: @cookie, cookie: @cookie.attributes
    assert_redirected_to cookie_path(assigns(:cookie))
  end

  test "should destroy cookie" do
    assert_difference('Cookie.count', -1) do
      delete :destroy, id: @cookie
    end

    assert_redirected_to cookies_path
  end
end

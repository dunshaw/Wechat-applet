// pages/setPassword/setPassword.js
const WXAPI = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    yzm:'',
    password:'',
    openId: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let phone = options.phone;
    let yzm = options.code;
    that.setData({
      phone: phone,
      yzm: yzm,
      openId: wx.getStorageSync('openId')
    });
    console.log(that.data.openId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setPassword:function(e){
    let that = this;
    let setPassword = e.detail.value;
    console.log(setPassword); 
    that.setData({
      password: setPassword
    })
  },
  register:function(){
    let that = this;
    WXAPI.register({ phone: that.data.phone, password: that.data.password, code: that.data.yzm, wxOpenId: that.data.openId }).then(function (res) {
      console.log(res)
      if(res.code == -1){
        wx.showToast({
          title:res.msg,
          icon:'none'
        })
      }else{
        wx.setStorageSync('token', res.body.token);
        wx.reLaunch({
          url: "/pages/app/app"
        })
      }
    });
  }
})
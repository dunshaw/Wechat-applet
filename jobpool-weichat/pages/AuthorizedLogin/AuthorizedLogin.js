// pages/AuthorizedLogin/AuthorizedLogin.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (wx.getStorageSync('token')){
      wx.navigateBack()
    }
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
  weixinlogin(){
    let that = this;
    wx.login({
      success(res){
        console.log(res)
        that.setData({
          code: res.code
        })
      }
    })
  },
  getPhoneNumber(e){
    let that = this;
    setTimeout(function(){
      WXAPI.weChatauth({ code: that.data.code }).then(function (res) {
        console.log(res)
        var openid = res.body.openid;
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if (e.detail.iv) {
          WXAPI.weChatgetPhoneNumber({
            encryptedData: e.detail.encryptedData,
            sessionKey: res.body.session_key,
            iv: e.detail.iv
          }).then(function (res) {
            console.log(res)
            WXAPI.weChatlogin({
              phone: res.body.phoneNumber,
              temporaryToken: res.body.temporaryToken,
              openId: openid
            })
              .then(function (res) {
                console.log(res)
                if (res.code == 200) {
                  wx.setStorageSync('sourceIn', res.body.sourceIn);
                  wx.setStorageSync('requiedInformation', res.body.requiedInformation);
                  wx.setStorageSync('token', res.body.token);
                  wx.setStorageSync('tokenfalse', '1');
                  if (res.body.requiedInformation) {
                    wx.navigateBack()
                  } else {
                    wx.reLaunch({
                      url: `../personData/personData?firstname=true`
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                }
              })
          })
        }
      })
    },500)
  }
  // phonelogin(){
  //   wx.navigateTo({
  //     url:'../login/login'
  //   })
  // }
})
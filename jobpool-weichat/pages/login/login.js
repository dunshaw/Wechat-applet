// pages/login/login.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据12
   */
  data: {
    phone:'',
    yzm:'',
    showTime:false,
    secend:60,
    isAgree: true,   //是否同意协议
    src:''           //协议跳转的链接
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
  agreement:function(e){
    let that = this;
    console.log(e.target.dataset)
    wx.navigateTo({
      url: '../outPage/outPage?src=' + e.target.dataset.src
    })
    // that.setData({
    //   src: 'https://tiger.quanjikj.com/api/h5/page/integralRule.html?richtext=' + e.target.dataset.src
    // })
    
  },
  isAgree:function(){
    let that = this;
    that.setData({
      isAgree: !that.data.isAgree
    })
  },
  inputPhone:function(e){
    let that = this;
    let phone = e.detail.value;
    if (WXAPI.regularPhone.test(phone)){
      that.setData({
        phone: phone
      })
    }
  },
  inputYzm:function(e){
    let that = this;
    let yzm = e.detail.value;
    console.log(yzm);
    that.setData({
      yzm: yzm
    })
  },
  clickGetYzm:function(){
    let that= this;
    if (!that.data.phone) {
      wx.showToast({
        title: '手机号不合法',
        icon: 'none'
      })
      return false;
    }
    WXAPI.getYzm({ phone: that.data.phone, type:'register'}).then(function (res) {
      console.log(res)
      if(res.code == -1){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }else{
        that.setData({ showTime: true });
        var timeer = setInterval(function () {
          let secondTime = that.data.secend;
          secondTime--;
          that.setData({
            secend: secondTime
          })
          if (secondTime == 0) {
            clearInterval(timeer);
            that.setData({
              showTime: false,
              secend: 60
            })
          }
        }, 1000);
      }
    });
    
  },
  submit:function(){
    let that = this;
    if (that.data.isAgree){
      WXAPI.checkYzm({ phone: that.data.phone, type: 'register', code: that.data.yzm }).then(function (res) {
        console.log(res)
        if (res.code == -1) {
          wx.showToast({
            title: '验证码错误，请重新获取',
            icon: 'none',
            duration: 2000
          })
        } else {
          if (res.body.doLogin == false) {
            wx.navigateTo({
              url: "/pages/setPassword/setPassword?phone=" + that.data.phone + "&code=" + that.data.yzm,
            })
          } else if (res.body.doLogin == true && res.body.bindWxOpenId == false) {
            wx.setStorageSync('token', res.body.token);
            let wxOpenId = wx.getStorageSync('openId');
            WXAPI.bindWxOpenId({ wxOpenId: wxOpenId }).then(function (res) {
              wx.reLaunch({
                url: "/pages/app/app"
              })
            });
          } else {
            wx.setStorageSync('token', res.body.token);
            wx.reLaunch({
              url: "/pages/app/app"
            })
          }
        }
      });
    }else{
      wx.showToast({
        title:'请先阅读并同意协议',
        icon:'none'
      })
    }
    
  }
})
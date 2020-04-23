var App = getApp();
let WebIM = require("../../utils/WebIM")["default"];
Page({
  data: {
  },
  onLoad() {
    wx.setStorageSync('clickIndex',7)
    this.bindload();
  },
  bindload() {
    setTimeout(
      // this.goIndex,
      this.movesmtho,
      100)
    setTimeout(()=>{
      console.log(wx.getStorageSync('compInfo'))
      let compInfo = {
        compId: '',
        compName: '',
        lat: wx.getStorageSync('compInfo').lat,
        lng: wx.getStorageSync('compInfo').lng,
        interviewTime: ''
      }
      wx.setStorageSync('compInfo',compInfo)
      wx.getStorageSync('imUserInfo')
      App.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: wx.getStorageSync('imUserInfo').imUsername,
        pwd: wx.getStorageSync('imUserInfo').imPassword,
        appKey: WebIM.config.appkey
      });
      wx.switchTab({
        url: `../home/home`
      })
    }, 3000)
  },
  goIndex() {
    let token = wx.getStorageSync('token');
    let session_key = wx.getStorageSync('session_key')
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              let compInfo = {
                compId: '',
                compName: '',
                lat: res.latitude,
                lng: res.longitude,
                interviewTime: ''
              }
              wx.setStorageSync('compInfo',compInfo)
              // 已授权和登录的情况
              if (token && session_key) {
                wx.removeStorage({
                  key: 'clickIndex',
                  success: res => {
                    console.log(res)
                  }
                })
                setTimeout(()=>{
                  wx.switchTab({
                    url: `../home/home`
                  })
                },500)
              } else {
                wx.switchTab({
                  url: `../home/home`
                })
              }
            }
          })
          
        } else {
          // 用户没有授权
          wx.switchTab({
            url: `../home/home`
          })
        }
      }
    });
  },
  movesmtho: function () {
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(1).translateY(-200).step()
    this.setData({
      ani: animation.export()
    })
  },
})
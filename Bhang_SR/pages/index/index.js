import { userPhoneLogin, userLogin } from '../../utils/api.js';
let WebIM = require("../../utils/WebIM")["default"];
//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        statusBarHeight: app.globalData.statusBarHeight,
        lng:null,
        lat:null,
        canAbled:true
    },

    onLoad: function() {
        var that = this;
        var token = wx.getStorageSync('token') || ''
        var sessionkey = wx.getStorageSync('session_key')
        console.log(sessionkey)
        console.log(token)
        if(!sessionkey){
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log(res);
              userLogin(res.code).then(data => {
                if (data) {
                    console.log(data);
                    wx.setStorageSync('session_key',data.body.session_key)
                }
              })
            }
          })
        }
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                console.log(res);
                if (res.authSetting['scope.userLocation']) {
                    wx.getLocation({
                        type: 'wgs84',
                        success (res) {
                          let compInfo = {
                            compId: '',
                            compName: '',
                            lat: res.latitude,
                            lng: res.longitude,
                            interviewTime: ''
                          }
                          wx.setStorageSync('compInfo',compInfo)
                          setTimeout(()=>{
                            that.setData({
                              canAbled: false
                            })
                          },1000)
                        }
                    })
                    // wx.getUserInfo({
                        // success: function(res) {
                        //     console.log("用户的信息如下：");
                        //     console.log(res.userInfo);
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            // wx.login({
                            //     success: res => {
                            //         // 获取到用户的 code 之后：res.code
                            //         console.log("用户的code:" + res.code);
                            //         // 可以传给后台，再经过解析获取用户的 openid
                            //         // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                            //         // wx.request({
                            //         //     // 自行补上自己的 APPID 和 SECRET
                            //         //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                            //         //     success: res => {
                            //         //         // 获取到用户的 openid
                            //         //         console.log("用户的openid:" + res.data.openid);
                            //         //     }
                            //         // });
                            //     }
                            // });
                        // }
                    // });
                } else {
                    // 用户没有授权
                  that.bindLocationInfo()
                }
            }
        });
    },
    // 获取用户信息
    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            // 获取到用户的信息了，打印到控制台上看下
            console.log("用户的信息如下：");
            console.log(e.detail.userInfo);
            // 获取定位
            this.bindLocationInfo()
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },
    // 获取用户手机号
    getPhoneNumber:function(e){
        var that = this;
        console.log('获取用户手机号')
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if(e.detail.errMsg == "getPhoneNumber:ok"){
            console.log('ok')
            let session_key = wx.getStorageSync('session_key')
            let params= {encryptedData:e.detail.encryptedData,iv:e.detail.iv,sessionKey:session_key}
            userPhoneLogin(params).then(rsp=>{
                console.log(rsp)
                if(rsp.code==200){
                    wx.setStorageSync('staffName', rsp.body.staffName)
                    wx.setStorageSync('Jurisdiction',rsp.body.auth)
                    wx.setStorageSync('token',rsp.body.token)
                    wx.setStorageSync('clickIndex',7)
                    wx.setStorageSync('imUserInfo',{'imPassword':rsp.body.imPassword,'imUsername':rsp.body.imUsername})
                    app.conn.open({
                      apiUrl: WebIM.config.apiURL,
                      user: rsp.body.imUsername,
                      pwd: rsp.body.imPassword,
                      appKey: WebIM.config.appkey
                    });
                    wx.switchTab({
                      url: `../home/home`,
                      success: function (e) { 
                        var page = getCurrentPages().pop(); 
                        if (page == undefined || page == null) return; 
                        page.onLoad(); 
                      } 
                    })
                }else{
                    return wx.showToast({
                        title: rsp.msg,
                        image: '../../images/warn.png',
                        mask:true,
                        duration: 2000,
                    })
                }
            })
        }else{
            console.log('no')
        }
    },
    // 获取用户定位
    bindLocationInfo:function(){
        var that = this;
        wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = res.latitude
              const longitude = res.longitude
              console.log(latitude,longitude)
              //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
              let compInfo = {
                compId: '',
                compName: '',
                lat: latitude,
                lng: longitude,
                interviewTime: ''
              }
              wx.setStorageSync('compInfo',compInfo)
              that.setData({
                isHide: false,
              });
              setTimeout(() => {
                that.setData({
                  canAbled: false
                })
              }, 1000)
            },
            fail:function(res){
                console.log('nonono')
                that.openConfirm()
            }
        })
    },
    openConfirm: function () {
        var that = this;
        wx.showModal({
          content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
          success: function (res) {
            console.log(res);
            //点击“确认”时打开设置页面
            if (res.confirm) {
              console.log('用户点击确认')
              wx.openSetting({
                success: (res) => { 
                    console.log(res)
                    res.authSetting = {
                        "scope.userLocation": true,
                    }
                    console.log("openSetting: success");
                    that.bindLocationInfo()
                }
              })
            } else {
              console.log('用户点击取消')
              that.setData({
                isHide: true
              });
            }
          }
        });
    },
})
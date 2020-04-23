const app = getApp()
import { getuserQRCode,basePath,getUserStaffid } from '../../utils/api.js';

import { base64src } from '../../utils/base64src.js'

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    userQRcode:'',
    staffId:'',
    shareurl:'',
    h5basePath:'',
    shareFlag:false,
    saveFlag:false,
    pulseFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth:res.windowWidth
        });
      }
    });
    this.setData({
      h5basePath:basePath.replace('adminapi','')
    })
    console.log(basePath,this.data.h5basePath)
    this.getQRCode()
    this.getStaffid()
  },
  onShow:function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4,
        unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum
      })
    }
    if(this.data.userQRcode==''){
      this.getQRCode()
    }
  },

  // 分享
  onShareAppMessage: function (res) {
    console.log(basePath)
    var that = this;
    if (res.from === 'button') {
      // var return_url = that.data.shareWeb;
      var return_url = that.data.shareurl.replace('?','&')
      var path = 'pages/shareUrl/shareUrl?url=' + return_url   //小程序存放分享页面的内嵌网页路径
      console.log(path, return_url)
      return {
        title: '职池工作',
        path: path,
        imageUrl:'../../images/share.png',
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: "转发成功",
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }   
    }
  },
  // 获取二维码
  getQRCode(){
    var that = this;
    let params = {scanCodeType:'customerService'}
    getuserQRCode(params).then(res=>{
      console.log(res)
      that.setData({
        userQRcode:wx.arrayBufferToBase64(res.data)
      });
    }).then(res=>{
      base64src('data:image/png;base64,'+that.data.userQRcode,res=>{
        console.log(res)
        that.setData({
          userQRcodeIMG:res
        });
      })
    })
  },
  // 获取员工id
  getStaffid(){
    getUserStaffid().then(res=>{
      console.log(res,basePath)
      this.setData({
        staffId:res.body,
        shareurl:`${this.data.h5basePath}/h5/page/share.html&relationId=${res.body}&type=backstage&combineType=true&id=&scanCodeType=checkIn&interviewTime=`
      });
    })
  },
  openshare(){
    this.getTabBar().setData({
      show:false
    })
    this.setData({pulseFlag:true})
    setTimeout(()=>{
      this.saveImg()
    },1200)
    
  },
  // 保存图片
  saveImg(){
    this.setData({shareFlag:true})
    var that = this;
    const ctx = wx.createCanvasContext('shareCanvas')
    
    // 底图
    ctx.drawImage('../../images/qrcodebg.png', 0,0,300,450)

    // 作者名称
    ctx.setTextAlign('center')    // 文字居中
    ctx.setFillStyle('#333')  // 文字颜色：黑色
    ctx.setFontSize(12)         // 文字字号：22px
    

    console.log(that.data.windowWidth)
    // 二维码
    const qrImgSize = 150
    ctx.drawImage(that.data.userQRcodeIMG,  (300 - qrImgSize) / 2, 215, qrImgSize, qrImgSize)
    let staffName = wx.getStorageSync('staffName')
    console.log(staffName)
    ctx.textAlign = 'center';
    ctx.fillText(staffName+'分享码', 150, 200)
    
    ctx.stroke()
    ctx.draw()

    setTimeout(()=>{
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas'
      }, this).then(res => {
          console.log(res)
          return wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath
          })
      }).then(res => {
          that.setData({saveFlag:true}) 
          wx.showToast({
              title: '已保存到相册'
          })
      }).catch(err => {
        console.log(err);
        if(err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny"){
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success:modalSuccess=>{
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData",failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      })
    },500)
    
  },
  // 关闭图片模态
  closeshare(){
    this.setData({shareFlag:false,saveFlag:false,pulseFlag:false})
    this.getTabBar().setData({
      show:true
    })
  },
  
});
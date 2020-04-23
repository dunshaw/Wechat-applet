// pages/richText/richText.js
const WXAPI = require('../../utils/util');
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.data){
      console.log(wx.getStorageSync("richtext"))
      this.setData({content:wx.getStorageSync("richtext")})
    }else{
      this.getcontent()
    }

    
    WxParse.wxParse('content', 'html', this.data.content, this)
  },
  getcontent(){
    WXAPI.getrichtext().then(res=>{
      console.log(res)
      this.setData({content:res.body.value})
      WxParse.wxParse('content', 'html', res.body.value, this)
    })
  },
  
})
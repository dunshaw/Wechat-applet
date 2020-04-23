// pages/perfectInfomation/perfectInfomation.js
const WXAPI = require('../../../utils/util');
import { verificationCard } from '../../../utils/verificationCard.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '请完善身份证信息',
      icon: 'none',
      mask: true
    })
    console.log(options)
    this.setData({
      checkid:options.id,
      relationid:options.relationid,
      optionid: options.optionid ? options.optionid : ''
    })
  },
  // 身份证号
  inputFjCardId: function (e) {
    let that = this;
    let $id = e.detail.value;
    console.log($id)
    that.setData({
      userFjCardId: $id
    })
  },
  submitForm(){
    var that = this;
    let idcard = that.data.userFjCardId
    console.log(idcard);
    if (!verificationCard(idcard)) {
      wx.showToast({
        title: '请检查身份证是否填写正确',
        icon: 'none'
      })
      return false;
    }
    WXAPI.resumeUpdate({
      fjCardId: idcard
    }).then(res=>{
      console.log(res)
      if(res.status){
        WXAPI.scanCodeCheckIn({ id: that.data.checkid,relationId :that.data.relationid }).then(function (res) {
          console.log(res)
          wx.redirectTo({ url: '../../../pages/sao/sao?qiandaostate=' + res.status + '&describe=' + res.msg + '&optionid=' + that.data.optionid})
        })
      }
    })
  },

})
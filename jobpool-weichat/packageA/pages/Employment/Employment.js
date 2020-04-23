// pages/Employment/Employment.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    isChecked:false,
    existLaborRelationship:false,      // 至少与一家单位建立了劳动关系
    signedLaborContract:false,         // 已签署劳动合同 
    payedSocialSecurity:false,         // 是否已缴纳社保
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserinfo()
  },
  // 获取用户信息
  getUserinfo(){
    let that = this;
    WXAPI.myResume().then(function (res) {
      console.log(res)
      if(res.code ==200){
        that.setData({
          existLaborRelationship : res.body.existLaborRelationship ,
          signedLaborContract:res.body.signedLaborContract,
          payedSocialSecurity:res.body.payedSocialSecurity
        })
      }
    });
  },

  // 开关监听
  changeSwitch(e){
    console.log(e,e.detail.value)
    let _type = e.currentTarget.dataset.info;
    if(_type == 'exist'){
      this.setData({existLaborRelationship:e.detail.value})
      if(!e.detail.value){
        this.setData({signedLaborContract:e.detail.value,payedSocialSecurity:e.detail.value})
      }
    }else if(_type == 'contract'){
      this.setData({signedLaborContract:e.detail.value})
    }else if(_type == 'security'){
      this.setData({payedSocialSecurity:e.detail.value})
    }
  },

  // 保存
  submitForm(){
    console.log('保存')
    WXAPI.saveUserEmploy({existLaborRelationship:this.data.existLaborRelationship,signedLaborContract:this.data.signedLaborContract,payedSocialSecurity:this.data.payedSocialSecurity})
    .then(res=>{
      console.log(res)
      if(res.code==200){
        wx.navigateBack()
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
      }
    })
  },
})
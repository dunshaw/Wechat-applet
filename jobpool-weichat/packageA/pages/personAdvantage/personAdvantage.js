// pages/personAdvantage/personAdvantage.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaNub: 0,
    textContent:'',
    content:"",
    otherAdvantageList:[],
    showLi:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.ys == 'null'){
      options.ys = ''
    }
    new Promise((resolve,reject)=>{
      WXAPI.getJobHuntingIntention().then(function (res) {
        console.log(res.body.expectPositionId)
        resolve(res.body.expectPositionId)
      })
    }).then(params=>{
      console.log(params)
      WXAPI.otherAdvantage({jobTypeIdList:params}).then(function (res) {
        console.log(res)
        that.setData({
          content:res.body[0],
          otherAdvantageList:res.body,
          textContent: options.ys,
          textareaNub: options.ys.length
        })
      });
    })
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
  copy: function(){
    let that = this;
    that.setData({
      textContent: that.data.content.content,
      textareaNub: that.data.content.content.length
    })
  },
  countNub: function (e) {
    this.setData({
      textareaNub: e.detail.value.length,
      textContent: e.detail.value
    });
  },
  changeOne:function(){
    let that = this;
    let a = that.data.showLi;
    a++;
    if (a >= that.data.otherAdvantageList.length){
      a = 0;
    }
    that.setData({
      showLi: a,
      content: that.data.otherAdvantageList[a]
    })
  },
  submitForm:function(){
    let that = this;
    WXAPI.savePersonalAdvantage({ content: that.data.textContent}).then(function (res) {
      wx.switchTab({
        url: '../../../pages/person/person'
      })
    });
  }
})
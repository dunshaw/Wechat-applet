// pages/person/person.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    content:'',
    authenticationState:'',
    authenticationStateText:'',
    islogin: true,
    requiedInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      requiedInfo: wx.getStorageSync('requiedInformation')
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
    let that = this;
    wx.showLoading({
      title: '加载中'
    })
    WXAPI.myResume().then(function (res) {
      console.log(res)
      if (res.body.status == 401) {
        that.setData({
          islogin: false
        })
        // wx.reLaunch({
        //   url: "/pages/login/login",
        // })
      } else {
        console.log(res.body)
        res.body.workingYears = Math.round(res.body.workingYears);
        that.setData({
          islogin: true,
          content: res.body,
          authenticationState: res.body.degreeCertificationStatus
        })
      }
      switch (that.data.authenticationState) {
        case 0 : 
          that.data.authenticationStateText = '未认证'
          break;
        case 1:
          that.data.authenticationStateText = '认证中'
          break;
        case 2:
          that.data.authenticationStateText = '已认证'
          break;
        case 3:
          that.data.authenticationStateText = '认证失败'
          break;
      }
      that.setData({
        authenticationStateText: that.data.authenticationStateText
      })
      wx.hideLoading()
    });

    this.onLoad()
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
    let that = this;
    WXAPI.myResume().then(function (res) {
      wx.stopPullDownRefresh();
      if (res.body.status == 401) {
        // wx.reLaunch({
        //   url: "/pages/login/login",
        // })
        return
      }else{
        res.body.workingYears = Math.round(res.body.workingYears);
        that.setData({
          content: res.body
        })
      }
    });
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
  preview:function(){
    if (!this.data.islogin){
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
    }
    wx.navigateTo({
      url:'../../packageA/pages/preview/preview'
    })
  },
  jump: function (e) {
    let that = this;
    if (!that.data.islogin){
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return;
    }
    if (e.currentTarget.dataset.url == "personData") {
      wx.navigateTo({ url: '../personData/personData' });
    } else if (e.currentTarget.dataset.url == "educationExp"){
      wx.navigateTo({ url: '../../packageA/pages/educationExp/educationExp' });
    } else if (e.currentTarget.dataset.url == "workExp"){
      wx.navigateTo({ url: '../../packageA/pages/workExp/workExp' });
    } else if (e.currentTarget.dataset.url == "personAdvantage"){
      wx.navigateTo({ url: '../../packageA/pages/personAdvantage/personAdvantage?ys=' + that.data.content.personalAdvantage});
    } else if (e.currentTarget.dataset.url == "wantedJob"){
      wx.navigateTo({ url: '../../packageA/pages/wantedJob/wantedJob' });
    } else if (e.currentTarget.dataset.url == "Diploma"){
      wx.navigateTo({ url: '../Diploma/Diploma?status=' + that.data.content.degreeCertification})
    } else if (e.currentTarget.dataset.url == "Employment"){
      wx.navigateTo({ url: '../../packageA/pages/Employment/Employment'})
    }
  },
  changeWorkExp:function(e){
    let that= this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '../../packageA/pages/workExp/workExp?id='+id });
  },
  changeEducationExp:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '../../packageA/pages/educationExp/educationExp?id=' + id });
  }
})
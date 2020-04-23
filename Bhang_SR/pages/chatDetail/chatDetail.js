// pages/chatDetail/chatDetail.js
const app = getApp()
let disp = require("../../utils/broadcast");
import { getUserByImUsername } from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    username: {
			your: "",
    },
    nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let username = JSON.parse(options.username);
    getUserByImUsername({idStr:username.your}).then(rsp=>{
      console.log(rsp)
      this.setData({ nickname: rsp.body[0].nickname });
    })
		this.setData({ username: username });
		wx.setNavigationBarTitle({
			title: username.your
		});
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

  }
})
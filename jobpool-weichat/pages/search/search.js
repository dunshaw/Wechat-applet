// pages/search/search.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotHistory:[],
    sHistory:[],
    searchData:"",
    val:'',
    nothing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let history = wx.getStorageSync("history");
    console.log(history);
    if (history == null || history == undefined || history==''){
      history = []
    }else{
      history = history.reverse();
    }
    that.setData({
      sHistory: history,
      cityCode: options.cityCode,
      city: options.city
    });

    //暂时屏蔽热门搜索
    // WXAPI.searchPopular({ type: "jobSeeker" }).then(function (res) {
    //   that.setData({
    //     hotHistory:res.body
    //   })
    // });
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
  searchVal:function(e){
    let that = this;
    that.setData({
      val: e
    })
  },
  jump:function(){
    let that = this;
    this.goIndex(that.data.val)
  },
  goIndex:function(e){
    let that = this;
    if (!that.data.val) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return false;
    }
    let historyArr = wx.getStorageSync("history");
    if (historyArr == null || historyArr == undefined || historyArr == '') {
      historyArr = []
    } else {
      historyArr = wx.getStorageSync("history");
    }
    let value = e.detail.value;
    for (let i = 0; i < historyArr.length; i++){
      if (value == historyArr[i]){
        historyArr.splice(i,1)
      }
    }
    historyArr.push(value);
    wx.setStorageSync("history", historyArr);
    that.setData({
      searchData: value
    })
    wx.navigateTo({ url: '../searchResult/searchResult?search=' + that.data.searchData + '&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
  },
  clickThisIcon:function(e){
    let that = this;
    let value = e.currentTarget.dataset.value;
    let historyArr = wx.getStorageSync("history");
    if (historyArr == null || historyArr == undefined || historyArr == '') {
      historyArr = []
    } else {
      historyArr = wx.getStorageSync("history");
    }
    for (let i = 0; i < historyArr.length; i++) {
      if (value == historyArr[i]) {
        historyArr.splice(i, 1)
      }
    }
    historyArr.push(value);
    wx.setStorageSync("history", historyArr);
    that.setData({
      searchData: value
    });
    wx.navigateTo({ url: '../searchResult/searchResult?search=' + that.data.searchData + '&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
  },
  deleteHistory:function(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除搜索历史',
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#0f0",
      success(res) {
        if (res.confirm) {
          wx.setStorageSync("history", []);
          that.setData({
            sHistory:[]
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  
})
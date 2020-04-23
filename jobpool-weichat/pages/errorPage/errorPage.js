// pages/errorPage/errorPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errortext:'',
    imgsrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var errortext;
    var imgsrc;
    if(options.error=='400' || options.error=='404'){
      errortext='页面走丢了啊~'
      imgsrc = '../../images/404.png'
    }else if(options.error=='403'){
      errortext='还没有权限啊~'
      imgsrc = '../../images/403.png'
    }else if(options.error=='500'){
      errortext='服务器出问题了，请稍后再试~'
      imgsrc = '../../images/500.png'
    }
    this.setData({
      errortext:errortext,
      imgsrc:imgsrc
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

  }
})
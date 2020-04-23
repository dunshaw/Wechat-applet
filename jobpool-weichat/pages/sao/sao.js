// pages/sao/sao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: '',
    describe: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.qiandaostate == 'true'){
      that.data.state = '扫码成功'
    }else{
      that.data.state = '扫码失败'
    }

    that.setData({
      state: that.data.state,
      describe: options.describe,
      optionid: options.optionid ? options.optionid :''
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

  ok:function(){
    let that = this;
    let pages = getCurrentPages();   //获取小程序页面栈
    let beforePage = pages[pages.length - 2];
    console.log(that.data.optionid)
    if (that.data.optionid){
      beforePage.onLoad({ id: that.data.optionid});
    }
    wx.navigateBack({
      delta:1
    })
  }
})
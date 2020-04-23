// pages/outPage/outPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.src)
    let src = options.src
    if (!options.id){
      options.id = ''
    }
    if (src == 1){
      src = 'https://tiger.quanjikj.com/h5/page/integralRule.html?richtext=userAgreementRegistrationTermsOfService'
    } else if (src == 2){
      src = 'https://tiger.quanjikj.com/h5/page/integralRule.html?richtext=enterpriseAgreementRegistrationTermsOfService'
    }
    
    if (src.indexOf('#') != -1){
      src = src.replace(/#/g , "?").replace(/!/g , "=").replace(/%/g , "&")
    }
    console.log(src)
    this.setData({
      id: options.id,
      src: src
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
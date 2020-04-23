// pages/popularCity.js
const WXAPI = require('../../../utils/util');
const citys2 = require('../../../utils/citys2');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityData:[],   //所有城市集合
    label:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','W','X','Y','Z'],
    seehearid:'',      //当前点击的右侧字母
    h:0,                //获取当前设备的高度
    lat: '',
    lng: '',
    cityCode: '',          //当前定位城市代码
    city: '' ,           //当前定位城市
    hotcity:[]          //热门城市
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    citys2.citysinit(that);
    that.setData({
      h: wx.getSystemInfoSync().windowHeight + 50
    })
    WXAPI.popularCitylist().then(function(res){
      console.log(res)
      that.setData({
        hotcity: res.body
      })
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
    that.localtion()
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
  choicecity:function(e){
    let pages = getCurrentPages();
    let currPage = null;
    // console.log(pages) 的到一个数组
    if (pages.length) {
      // 获取当前页面的前以页面的对象
      currPage = pages[pages.length - 2];
    }
    // 获取当前页面的前一页面的路由
    let route = currPage.route
    console.log(route)
    if(route=='pages/app/app'){
      wx.reLaunch({
        url: '../../../pages/app/app?code=' + e.target.dataset.code + '&cityname=' + e.target.dataset.cityname
      })
    }else{
      wx.reLaunch({
        url: '../../../pages/companyList/companyList?code=' + e.target.dataset.code + '&cityname=' + e.target.dataset.cityname
      })
    } 
  },
  aginlocaltion:function(){
    let that = this;
    that.localtion()
  },
  localtion: function(){
    let that = this;
    wx.showLoading({
      title:'加载中...'
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          lat: latitude,
          lng: longitude
        });
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?key=fc27adfe9b36e3c6dd12d13de6218d22&location=' + longitude + ',' + latitude + '& output=JSON',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            that.setData({
              cityCode: res.data.regeocode.addressComponent.adcode.substr(0, 4) + '00',
              city: res.data.regeocode.addressComponent.city
            });
          }
        })
        wx.hideLoading()
      }
    })
  },
  seehear:function(e){
    let that = this;
    console.log(e)
    that.setData({
      seehearid: e.target.dataset.id
    })
  }
})
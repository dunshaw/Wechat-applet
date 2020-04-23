// pages/companylist/companylist.js
import { getSceneCompany } from '../../utils/api.js';
const app = getApp()
var QQMapWX = require('../../static/qqmap-wx-jssdk.js');
var qqmapsdk;




Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    scrollViewHeight:0,
    address:'',
    lat:'',
    lng:'',
    mainActiveIndex: 0,
    activeId: null,
    activeName:null,
    items:[],
    searchValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      lng:options.lng,
      lat:options.lat,
    })
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
        key: '5VKBZ-OXD6W-KZVR7-RBWW6-O43AQ-VLBTP'
    });
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
            windowHeight: res.windowHeight
        });
      }
    });
    // 减去元素距离顶部的高度获得剩余可视化高度
    let query = wx.createSelectorQuery().in(this);
    query.select('#select-tree-box').boundingClientRect();
    query.exec(function (res) {
      let totopheight = res[0].top;
      that.setData({
          scrollViewHeight: that.data.windowHeight - totopheight
      });
      console.log( that.data.windowHeight - totopheight)
    })
    this.getcompamy()
  },

  // 重新获取地址
  Getlocation:function (){
    // wx.showLoading({
    //   title: '正在重新获取...',
    // }); 
    var that=this;
    wx.getLocation({
      type: 'wgs84',
        success (res) {
          // wx.hideLoading();
          that.setData({ lng:res.longitude, lat:res.latitude})
          that.getcompamy()
          that.analysis()
        },
        fail:function(res){
          console.log('nonono')
        }
    })
  },
  // 解析定位地址
  analysis(){
    var that=this;
    qqmapsdk.reverseGeocoder({
      location: {latitude: that.data.lat,longitude: that.data.lng},
      success: function (res) {
        //address 城市
        // console.log(res)
        that.setData({ address: res.result.address})
        // wx.showToast({
        //   title: `当前位置： ` + that.data.address,
        //   icon: 'none'
        // });          
      }
    });
  },
  // 请求获取公司数据
  getcompamy(){
    var that = this;
    var params = {lng:this.data.lng,lat:this.data.lat,name:that.data.searchValue};
    getSceneCompany(params).then(rsp=>{
      console.log(rsp)
      let data = rsp.body;
      this.setData({
        items:data
      })
    })
    this.analysis()
  },
  // 重构公司列表
  restructure(data){
    // console.log(data)
    var citys=[];


    // console.log(citys)
    return citys
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0 ,
      activeId:null
    });
  },
  onClickItem({ detail = {} }) {
    console.log(detail)
    const activeId = detail.compId;
    const activeName = detail.compName;
    const lat = this.data.lat
    const lng = this.data.lng
    this.setData({ activeId,activeName });
    let p1 = new Promise((resolve,reject)=>{
      let compInfo = {
        compId:activeId,
        compName:activeName,
        lat:lat,
        lng:lng,
        interviewTime:''}
      wx.setStorageSync('compInfo',compInfo)
      resolve('compInfo')
    })
    let p2 = new Promise((resolve,reject)=>{
      wx.setStorageSync('clickIndex',7)
      resolve('clickIndex')
    })
    Promise.all([p1,p2]).then((res)=>{
      console.log(res)
      wx.switchTab({
        url: `../home/home`,
        success: function (e) { 
        var page = getCurrentPages().pop(); 
        if (page == undefined || page == null) return; 
          page.onLoad(); 
        } 
      })
    })
  },
  // 监听搜索输入
  inputSearch(e){
    console.log(e.detail.value)
    this.setData({
      searchValue:e.detail.value,
    })
    var that = this;
    var timer = this.data.timer
    clearTimeout(timer) 
    timer = setTimeout(function () {
      console.log('请求')
      that.getcompamy()
    }, 1000)
    this.setData({
      timer:timer
    })
  },
})
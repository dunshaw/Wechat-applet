// pages/address/address.js
import { getAddress } from '../../utils/api.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    scrollViewHeight: 0,
    address:[],
    defindex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    this.setData({
      info:options.info,
      previd: options.id,
      companyId: options.companyId
    })
    
    this.getselectaddr()
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
  getselectaddr(){
    var that = this;
    console.log('======')
    getAddress({ companyId: that.data.companyId}).then(res=>{
      console.log(res)
      let i = 0;
      res.body.map(item => {
        console.log(item, that.data.previd);
        item.index = i++
        item.show = (item.addrId === that.data.previd)?true:false
        switch(item.type){
          case 1:
            item.typename = '公司地址'
            break
          case 2:
            item.typename = '工作地址'
            break
          case 3:
            item.typename = '面试地址'
            break
        }
      })
      console.log(res.body)
      this.setData({
        address: res.body
      })
    })
  },
  selected(e){
    var that = this;
    console.log(e)
    console.log(that.data.info)
    let id= e.currentTarget.dataset.id
    let fmtaddr = e.currentTarget.dataset.fmtaddr
    let lat = e.currentTarget.dataset.lat
    let lng = e.currentTarget.dataset.lng
    let sptaddr = e.currentTarget.dataset.sptaddr ? e.currentTarget.dataset.sptaddr:''
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      addr: { "Addr": fmtaddr + sptaddr, "Lng": lng, "Lat": lat, addrid: id, addrBvid: id},
    })
    wx.navigateBack({
      delta: 1,
    })
  },
})
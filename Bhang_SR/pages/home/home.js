// pages/home/home.js
import { getSceneJob, getJobQRCode, getSceneJobtest } from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    defaultcomp:'水井坊',
    defaultcompId:'',
    datetime:'',
    joblist:[],
    hideBottom:true,
    stopLoadMoreTiem:false,  // 组织多次触发
    totalPages: '',    // 总页数
    currentPage: 1,  
    pageSize:10,
    newselected:0,
    ischeckmode:false ,
    opengallery:false ,
    JobQRcode:'',
    alljuris:true,
    situation:0,
    showTabBar:false,
    erweimaJob:'测试',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum
      })
    }
    this.calculateScrollViewHeight()
  },
  onShow:function () {
    console.log(app.globalData.unReadMessageNum)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum
      })
    }
    console.log('123')
    // wx.showTabBar()
    let that = this;
    that.setData({
      alljuris:wx.getStorageSync('Jurisdiction').includes('recruitmentProgress:list'),
      ischeckmode:false,
      opengallery:false,
      stopLoadMoreTiem:false,
      newselected:0
    })
    let token = wx.getStorageSync('token');
    console.log(token)
    if(token){
      this.getscenejob()
    }else{
      this.getscenejobtest()
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({newselected: 0 ,currentPage:1});
    console.log('--------下拉刷新-------')
    let params = {lng:that.data.lng,
                  lat:that.data.lat,
                  compId:that.data.defaultcompId,
                  compName:that.data.defaultcomp}
    // const pages = getCurrentPages()
    // const perpage = pages[pages.length - 1]
    setTimeout(()=>{
      that.onShow()
      wx.hideNavigationBarLoading() //完成停止加载  
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.showToast({
        title: '刷新成功',
        mask:true,
        duration: 2000
      });
    },1000)  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    console.log(that.data.currentPage)
    console.log(that.data.totalPages)
    if(that.data.currentPage == that.data.totalPages){
      wx.showToast({
        title: '没有更多了~~',
        image: '../../images/warn.png',
        mask:true,
        duration: 2000
      })
      that.setData({
        stopLoadMoreTiem:true
      })
      return ;
    }else{
      that.setData({
        stopLoadMoreTiem:true,
        currentPage:that.data.currentPage+1
      })
      that.getscenejob()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getscenejobtest(){
    let that = this;
    getSceneJobtest().then(data=>{
      if (data.code == 200) {
        that.setData({
          totalPages: data.body.pageJobTotalDto.pages,
          currentPage: data.body.pageJobTotalDto.current,
          joblist: data.body.pageJobTotalDto.records,
          defaultcomp: data.body.compName,
          defaultcompId: data.body.compId
        })
      } else {
        that.showerr(data.msg)
      }
    }).catch(err => {
      console.log(err);
      that.showerr(err)
    })
  },
  getscenejob(){
    let that = this;
    let compInfo = wx.getStorageSync('compInfo');
    let clickIndex = wx.getStorageSync('clickIndex'); 
    console.log(compInfo,clickIndex)
    that.setData({
      defaultcompId:compInfo.compId,
      lng:compInfo.lng,
      lat:compInfo.lat,
      datetime:compInfo.interviewTime,
      defaultcomp:compInfo.compName,
      situation: clickIndex
    })
    let params = {companyId:that.data.defaultcompId,lng:that.data.lng,lat:that.data.lat,interviewTime:that.data.datetime,pageNum:that.data.currentPage,pageSize:that.data.pageSize}
    console.log(params)
    let token = wx.getStorageSync('token');
    if((token&&!params.lng) || (token&&!params.lat)){
      console.log('111')
      return false;
    }
    getSceneJob(params).then(data=>{
      console.log(data)
      if(data.code == 200){
        if(data.body.pageJobTotalDto.current==1){
          console.log('111')
          that.setData({
            totalPages:data.body.pageJobTotalDto.pages,
            currentPage:data.body.pageJobTotalDto.current,
            joblist:data.body.pageJobTotalDto.records,
            defaultcomp:data.body.compName,
            defaultcompId:data.body.compId,
            stopLoadMoreTiem:false
          })
        }else{
          console.log('222')
          that.setData({
            totalPages:data.body.pageJobTotalDto.pages,
            currentPage:data.body.pageJobTotalDto.current,
            joblist:that.data.joblist.concat(data.body.pageJobTotalDto.records),
            defaultcomp:data.body.compName,
            defaultcompId:data.body.compId,
            stopLoadMoreTiem:false
          })
        }
      }else{
        that.showerr(data.msg)
      }
    }).catch(err =>{
      if(err=='0225'){
        that.getscenejob()
      }else{
        that.showerr(err)
      }
      console.log(err);
    })
  },
  // 接收选择点击的日期
  getclickDate(e){
    // console.log('father',e.detail);
    let datetime = e.detail.split("/").join('-');
    console.log(datetime)
    if(datetime == this.data.datetime){
      return false;
    }
    this.setData({ datetime: datetime, newselected: 0,currentPage:1});
    let compInfo = {
      compId:this.data.defaultcompId,
      compName:this.data.defaultcomp,
      lat:this.data.lat,
      lng:this.data.lng,
      interviewTime:datetime}
    wx.setStorageSync('compInfo',compInfo)
    this.getscenejob()
  },
  getselectedData(e){
    // console.log(e.detail);
    this.setData({
      newselected: e.detail
    });
  },
  // 修改多选mode
  intocheckmode(e){
    console.log(e.detail);
    this.setData({
      ischeckmode:e.detail,
    });
  },
  // 上拉加载更多
  loadMoreJob: function(){
    console.log('+++++++')

  },
  myCatchTouch(){
    return false
  },
  openGallery(e){
    if(e.detail.jobid == ''){
      that.onShow()
      wx.showToast({
        title: '获取超时，请重试！',
        mask:true,
        duration: 1000
      });
      return false
    }
    console.log(e.detail)
    // console.log(this.data.JobQRcode)
    getJobQRCode(e.detail).then(res=>{
      console.log(res)
      this.setData({
        JobQRcode:wx.arrayBufferToBase64(res.data),
        opengallery:true,
        erweimaJob:e.detail.jobname
      });
    })
  },
  closeGallery(){
    this.setData({
      opengallery:false,
    });
  },
  showerr(err){
    return wx.showToast({
      title: err,
      image: '../../images/warn.png',
      mask:true,
      duration: 2000
    })
  },
})
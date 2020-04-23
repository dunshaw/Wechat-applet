// pages/leadingResult/leadingResult.js
import { getJobImportresult, getJobQRCode, getUserTrack} from '../../utils/api.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navtitle: '导入结果',
    jobName:'特别的职业',
    JobQRcode: '',
    interviewTime:'2019-09-21 12:10:20-14:20:12',
    opengallery: false,
    showdetail:false,
    pageNum:1,    // 当前页码
    pageSize:10,  // 每页条数
    pages:'',
    stopLoadMoreTiem:false,  // 阻止多次触发
    resultList:[],
    steps: [
      {text: '自动注册',time: '2019-02-22 14：00：00', result: true, replaying: false},
    ],
    active :7
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calculateScrollViewHeight();
    console.log(options);
    this.setData({
      jobId: options.jobid,
      jobName: options.jobname,
      interviewTime: options.interviewtime ? options.interviewtime : ''
    })

    this.getImportData()
  },
  // 获取导入结果
  getImportData(){
    var that = this;
    if (that.data.stopLoadMoreTiem){
      return false;
    }
    if(that.data.pageNum == that.data.pages){
      wx.showToast({
        title: '没有更多了~~',
        image: '../../images/warn.png',
        mask: true,
        duration: 2000
      })
      return false;
    }
    that.setData({
      stopLoadMoreTiem: true
    });
    let params = {jobId:that.data.jobId,pageNum:that.data.pageNum,pageSize:that.data.pageSize}
    getJobImportresult(params).then(res=>{
      setTimeout(() => {  
        wx.hideLoading();  
      }, 100);
      console.log(res)
      if(res.status){
        res.body.records.map(item=>{
          item.ishow = true;
          if (item.status == 1 || item.status == -2) {
            item.result = true
          } else {
            item.result = false
          }
        })
        that.setData({
          pages:res.body.pages,
          pageNum:res.body.current + 1,
          resultList: that.data.resultList.concat(res.body.records),
          stopLoadMoreTiem: false
        })
      }
    })
  },
  // 计算scroll-view的高度
  calculateScrollViewHeight(){
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    let query = wx.createSelectorQuery().in(this);
    // 然后逐个取出navbar和header的节点信息
    // 选择器的语法与jQuery语法相同
    query.select('.title').boundingClientRect();
    query.select('.searchbar').boundingClientRect();
    query.exec((res) => {
      // 分别取出navbar和header的高度
      let navbarHeight = res[0].height;
      let headerHeight = res[1].height;
      let statusBarHeight = that.data.statusBarHeight
      console.log(navbarHeight, headerHeight, statusBarHeight)

      // 然后就是做个减法
      let scrollViewHeight = this.data.windowHeight - navbarHeight - headerHeight - statusBarHeight -50;
      console.log(scrollViewHeight)

      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight
      });
    });
  },
  // 导入
  importadd() {
    console.log('跳转导入')
    wx.redirectTo({
      url: `../../pages/leadingView/leadview?jobid=${this.data.jobId}&jobname=${this.data.jobName}&interviewtime=${this.data.interviewTime}`
    })
  },
  // 二维码
  openGallery(e) {
    console.log(e.detail)
    let params = {jobid:this.data.jobId,itviewtime:this.data.interviewTime}
    getJobQRCode(params).then(res=>{
      console.log(res)
      this.setData({
        JobQRcode:wx.arrayBufferToBase64(res.data),
        opengallery:true,
      });
    })
  },
  closeGallery() {
    this.setData({
      opengallery: false,
    });
  },

  // 搜索框输入
  inputTyping(e){
    console.log(e.detail)
    let _data = this.data.resultList;
    let _value = e.detail.value
    _data.map(item=>{
      if(item.phone.includes(_value)){
        item.ishow = true;
      }else{
        item.ishow = false;
      }
    })
    this.setData({ resultList: _data})
  },

  //导入结果详情
  openDetail(e){
    var that = this;
    console.log('userid', e.currentTarget.dataset.userid)
    console.log('interid', e.currentTarget.dataset.interid)
    let userid = e.currentTarget.dataset.userid;
    let interid = e.currentTarget.dataset.interid;
    let params = { userId: userid, interviewImportId: interid}
    getUserTrack(params).then(res=>{
      setTimeout(() => {  
        wx.hideLoading();  
      }, 100);
      console.log(res)
      if(res.status){
        res.body.tracks.map(item => {
          item.userId = userid;
          item.interviewImportId = interid;
          item.jobid = that.data.jobId;
          if (item.status == 1 || item.status == -2) {
            item.result = true
          } else {
            item.result = false
          }
        })
        let $data = res.body.tracks;
        for (let i = 0; i < $data.length;i++){
          if ($data[i].status == -1){
            $data[i].status = -3
            break
          }
        }
        console.log($data)
        that.setData({
          showdetail: true,
          steps: $data
        });
      }
    })
  },
  // 关闭详情模态
  closeDialog(){
    this.setData({
      showdetail: false,
    });
  },
  // 更新执行显示数据
  Eventupdata(e){
    console.log(e)
    let $data = this.data.resultList;
    $data.map(item=>{
      if (item.userId == e.detail.userid){
        item.stepView = e.detail.viewtext
        item.status = e.detail.status
      }
    })
    this.setData({
      resultList: $data
    })
  }
})
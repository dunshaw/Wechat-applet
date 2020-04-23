import { getjobImlist } from '../../utils/api.js';
const app = getApp()


Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    scrollHeight:0,
    searchValue:'',
    jobList:[],
    current:1,
    pages:'',
    importType:'',    // 导入或结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({importType:options.info})
    this.calculateScrollViewHeight()
    this.getjoblist()
  },

  // 计算scroll-view的高度
  calculateScrollViewHeight(){
    console.log('123')
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
    query.select('.searchbar').boundingClientRect();
    query.exec((res) => {
      // console.log(res)
      // 分别取出navbar和header的高度
      let headerHeight = res[0].height;
      let statusBarHeight = that.data.statusBarHeight
      console.log(headerHeight, statusBarHeight)

      // 然后就是做个减法
      let scrollViewHeight = this.data.windowHeight - headerHeight - statusBarHeight -50;
      console.log(scrollViewHeight)

      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight
      });
    });
  },
  
  // 搜索输入
  inputSearch(e){
    console.log(e)
    this.setData({
      searchValue:e.detail.value,
      current:1
    })
    var that = this;
    var timer = this.data.timer
    clearTimeout(timer) 
    timer = setTimeout(function () {
      that.getjoblist()
    }, 1000)
    this.setData({
      timer:timer
    })
  },
  // 获取job
  getjoblist(){
    getjobImlist({compName:this.data.searchValue,current:this.data.current,size:15}).then(res=>{
      console.log(res)
      if(res.body.current==1){
        this.setData({
          jobList:res.body.records,
          pages:res.body.pages,
          current:res.body.current
        }) 
      }else{
        this.setData({
          jobList:[...res.body.records,...this.data.jobList],
          pages:res.body.pages,
          current:res.body.current
        }) 
      }
    })
  },
  // 加载job前判断
  loadData(){
    console.log('load')
    if(this.data.current==this.data.pages){
      return false
    }else{
      this.setData({current:this.data.current+1})
      this.getjoblist()
    }
  },
  // 跳转导入或者导出
  selected(e){
    let job = e.currentTarget.dataset['item'];
    console.log(job)
    let interviewtime='';
    if(job.ivDateType==2){
      interviewtime = '等待通知'
    }
    if(this.data.importType=='import'){
      wx.navigateTo({
        url: `../../pages/leadingView/leadview?jobid=${job.jobId}&jobname=${job.jobName}&interviewtime=${interviewtime}`
      })
    }else{
      wx.navigateTo({
        url: `../../pages/leadingResult/leadingResult?jobid=${job.jobId}&jobname=${job.jobName}&interviewtime=${interviewtime}`
      })
    }
    
  },
})
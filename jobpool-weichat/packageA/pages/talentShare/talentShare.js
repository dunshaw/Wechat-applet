// pages/talentShare/talentShare.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    TopcontentList:[],
    pages:'',
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cityCode:options.cityCode,
      lat:options.lat,
      lng:options.lng
    })
    this.gettantJob()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log(this.data.pageNum,this.data.pages)
    if(this.data.pageNum<this.data.pages){
      this.setData({pageNum:pageNum+1})
      this.gettantJob()
    }
  },
  // 获取数据
  gettantJob(){
    console.log('123')
    let that = this;
    let data;
    WXAPI.indexList({cityCode:that.data.cityCode,lng: that.data.lng , lat:that.data.lat, pageNum: that.data.pageNum, pageSize: 10,homeFlag: false,jobShared:true}).then(res=>{
      console.log(res)
      if(res.code != 200) return;
      if(that.data.pageNum==1){
        data = that.fiexdData(res.body.records)
      }else{
        data = [...TopcontentList,...that.fiexdData(res.body.records)]
      }
      that.setData({
        TopcontentList: data,
        pageNum:res.body.current,
        pages:res.body.pages
      })
    })
  },
  // 修正获取的数据
  fiexdData:function(data){
    for (var i in data) {
      let a = data[i].job;
      a.salaryMin = (a.salaryMin / 1000).toFixed(1)
      a.salaryMax = (a.salaryMax / 1000).toFixed(1)
      switch (a.education) {
        case 'no':
          a['xueliyaoqiu'] = "不限";
          break;
        case 'primary':
          a['xueliyaoqiu'] = "小学";
          break;
        case 'juniorHigh':
          a['xueliyaoqiu'] = "初中";
          break;
        case 'high':
          a['xueliyaoqiu'] = "高中";
          break;
        case 'technicalSecondary':
          a['xueliyaoqiu'] = "中专";
          break;
        case 'juniorCollege':
          a['xueliyaoqiu'] = "大专";
          break;
        case 'regularCollege':
          a['xueliyaoqiu'] = "本科";
          break;
        case 'master':
          a['xueliyaoqiu'] = "硕士";
          break;
        case 'doctor':
          a['xueliyaoqiu'] = "博士";
          break;
      }
      switch (a.workingYears) {
        case 'no':
          a['gongzuonianxian'] = "经验不限";
          break;
        case 'ltOneYears':
          a['gongzuonianxian'] = "1年以下";
          break;
        case 'geOneYears':
          a['gongzuonianxian'] = "1年以上";
          break;
        case 'betweenOneAndThreeYears':
          a['gongzuonianxian'] = "1-3年";
          break;
        case 'betweenOneAndTwoYears':
          a['gongzuonianxian'] = "1-2年";
          break;
        case 'geTwoYears':
          a['gongzuonianxian'] = "2年以上";
          break;
        case 'betweenTwoAndThreeYears':
          a['gongzuonianxian'] = "2-3年";
          break;
        case 'betweenThreeAndFiveYears':
          a['gongzuonianxian'] = "3-5年";
          break;
        case 'geFiveYears':
          a['gongzuonianxian'] = "5年以上";
          break;
        case 'betweenFiveAndTenYears':
          a['gongzuonianxian'] = "5-10年";
          break;
        case 'geTenYears':
          a['gongzuonianxian'] = "10年以上";
          break;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].job.type == 'online') {
        data[i].job.interviewTime = null
      }
      if (data[i].labels){
        data[i].labels = data[i].labels.slice(0,3)
      }
    }
    return data
  },
  // 跳转职位详情页面
  jump:function(e){
    console.log(e.currentTarget.dataset.id)
    let that=this;
    wx.navigateTo({ url: `../../../pages/recruitDetail/recruitDetail?id=${e.currentTarget.dataset.id}&cityCode=${that.data.cityCode}&interviewTime=${e.currentTarget.dataset.interviewtime ? e.currentTarget.dataset.interviewtime:''}` })
  }
})
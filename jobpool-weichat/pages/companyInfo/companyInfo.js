// pages/companyInfo/companyInfo.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    active:1,
    isShowNav: false,
    id:'',
    logo:'',
    alias:'', //公司别名
    area:'', //地区
    businessStatus: '', //营业状态
    industry: '', //行业
    introduction: '', // 公司介绍 
    location: '', // 位置
    name: '', //公司全称
    enterpriseType: '' , //企业类型
    scale: '', //公司规模
    photoList:[] ,//轮播图
    establishTime: '', // 成立时间
    recruitPosition:[],   //在招职位
    lat: '',
    lng: '',
    seedown: false,      // 公司介绍查看更多
    complat:'',          //公司的经纬度
    complng:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id: options.id
    })
    console.log(that.data.id)
    WXAPI.companyGetById({ id: that.data.id}).then(function(res){
      console.log(res)
      if(res.code == 200){
        switch (res.body.businessStatus) {
          case 'subsisting':
            res.body.businessStatus = '存续';
            break;
          case 'inBusiness':
            res.body.businessStatus = '在业';
            break;
          case 'revoke':
            res.body.businessStatus = '吊销';
            break;
          case 'dissolve':
            res.body.businessStatus = '注销';
            break;
          case 'moveIn':
            res.body.businessStatus = '迁入';
            break;
          case 'moveOut':
            res.body.businessStatus = '迁出';
            break;
          case 'closed':
            res.body.businessStatus = '停业';
            break;
          case 'liquidation':
            res.body.businessStatus = '清算';
            break;
          case 'unknown':
            res.body.businessStatus = '未知';
            break;
          default:
            res.body.businessStatus = '未知';
        }
        that.setData({
          logo: res.body.logo,
          alias: res.body.alias,
          area: res.body.area,
          businessStatus: res.body.businessStatus,
          industry: res.body.industry,
          introduction: res.body.introduction,
          location: res.body.location,
          name: res.body.name,
          enterpriseType: res.body.enterpriseType,
          scale: res.body.scale,
          photoList: res.body.photoList,
          establishTime: res.body.establishTime,
          complat: res.body.lat,
          complng: res.body.lng
        })
      }else{
        wx.showToast({
          title:res.msg,
          icon:'none'
        })
      }
      
      // if (!res.establishTime){
      //   res.body.establishTime = ''
      // }
      
    })

    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.setData({
          lat: latitude,
          lng: longitude
        });
        WXAPI.companyGetJobList({
          id: that.data.id,
          lat: that.data.lat,
          lng: that.data.lng
        }).then(function (res) {
          console.log(res)
          for (let i = 0; i < res.body.length; i++) {
            res.body[i].salaryMin =  (res.body[i].salaryMin / 1000).toFixed(1)
            res.body[i].salaryMax = (res.body[i].salaryMax / 1000).toFixed(1)
            switch (res.body[i].education) {
              case 'no':
                res.body[i].education = "不限";
                break;
              case 'primary':
                res.body[i].education = "小学";
                break;
              case 'juniorHigh':
                res.body[i].education = "初中";
                break;
              case 'high':
                res.body[i].education = "高中";
                break;
              case 'technicalSecondary':
                res.body[i].education = "中专";
                break;
              case 'juniorCollege':
                res.body[i].education = "大专";
                break;
              case 'regularCollege':
                res.body[i].education = "本科";
                break;
              case 'master':
                res.body[i].education = "硕士";
                break;
              case 'doctor':
                res.body[i].education = "博士";
                break;
            }
            switch (res.body[i].workingYears) {
              case 'no':
                res.body[i].workingYears = "经验不限";
                break;
              case 'ltOneYears':
                res.body[i].workingYears = "1年以下";
                break;
              case 'oneYears':
                res.body[i].workingYears = "1年以上";
                break;
              case 'betweenOneAndThreeYears':
                res.body[i].workingYears = "1-3年";
                break;
              case 'betweenOneAndTwoYears':
                res.body[i].workingYears = "1-2年";
                break;
              case 'geTwoYears':
                res.body[i].workingYears = "2年以上";
                break;
              case 'twoYears':
                res.body[i].workingYears = "2年以上";
                break;
              case 'betweenTwoAndThreeYears':
                res.body[i].workingYears = "2-3年";
                break;
              case 'betweenThreeAndFiveYears':
                res.body[i].workingYears = "3-5年";
                break;
              case 'geFiveYears':
                res.body[i].workingYears = "5年以上";
                break;
              case 'betweenFiveAndTenYears':
                res.body[i].workingYears = "5-10年";
                break;
              case 'geTenYears':
                res.body[i].workingYears = "10年以上";
                break;
              default:
                res.body[i].workingYears = "";
                break;
            }
            
            if (res.body[i].labels) {
              res.body[i].labels = res.body[i].labels.split(',');
              if (res.body[i].labels.length > 3) {
                res.body[i].labels = res.body[i].labels.slice(0, 3)
              }
            }
          }

          that.setData({
            recruitPosition: res.body
          })
          console.log(that.data.recruitPosition)
        })
      }
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
   * 页面滚动模块固定效果
   */
  onPageScroll: function (e) {
    // var scrollTop = e.scrollTop;
    // if (scrollTop >= 330 && !this.data.isShowNav) {
    //   this.setData({ isShowNav: true })
    // }
    // if (scrollTop < 330 && this.data.isShowNav) {
    //   this.setData({ isShowNav: false })
    // }
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
  seeadd:function(){
    let that = this;
    wx.openLocation({
      latitude: that.data.complat,
      longitude: that.data.complng,
      name: that.data.location
    })
  },
  seejob:function(e){
    wx.navigateTo({
      url: `../recruitDetail/recruitDetail?id=${e.currentTarget.dataset.id}&interviewTime=${e.currentTarget.dataset.time ? e.currentTarget.dataset.time:''}`
    })
  },
  click:function(e){
    this.setData({
      active: e.currentTarget.dataset.value
    });
  },
  seecomp:function(){
    let that = this;
    wx.navigateTo({
      url:'../outPage/outPage?src=https://www.tianyancha.com/search?key=' + that.data.name
    })
  },
  seedown:function(){
    let that = this;
    that.setData({
      seedown: !that.data.seedown
    })
  }
})
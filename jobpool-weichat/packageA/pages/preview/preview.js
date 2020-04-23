// pages/preview/preview.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgip: WXAPI.imgIp,
    name:'',
    sex: '',
    //compName:'',  //公司名字
    //position: '',   //职位
    workyear: '' ,  //工作经验
    edu: '',       //学历
    age: '',        //年龄
    avatar: '',     //头像
    phone: '',      //手机号
    personalAdvantage: '' ,   //个人优势
    jobStatus:'',     //目前工作状态
    expectIndustryName: '', //期望行业
    expectWorkPlaceName: '', //期望工作地
    jobHuntingIntention: '',//期望职位
    maxExpectSalary: '' ,   //期望最高薪资
    minExpectSalary: '', //期望最低薪资
    worklist: [],  // 工作经历
    edulist: [],    //教育经历
    degreeCertificationStatus:'',  //学历认证状态
    degreeCertificationFilePath: '' //学历认证图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    WXAPI.myResume().then(function(res){
      console.log(res)
      // if (res.body.workExperienceList.length != 0){
      //   for (let i = 0; i < res.body.workExperienceList.length; i++){
      //     res.body.workExperienceList[i].startTimeMonth < 10 ? res.body.workExperienceList[i].startTimeMonth = '0' + res.body.workExperienceList[i].startTimeMonth : res.body.workExperienceList[i].startTimeMonth

      //     res.body.workExperienceList[i].endTimeMonth < 10 ? res.body.workExperienceList[i].endTimeMonth = '0' + res.body.workExperienceList[i].endTimeMonth : res.body.workExperienceList[i].endTimeMonth
      //   }
      // }
      switch (res.body.degreeCertificationStatus){
        case 0:
          res.body.degreeCertificationStatus = '未认证'
          break;
        case 1:
          res.body.degreeCertificationStatus = '认证中'
          break;
        case 2:
          res.body.degreeCertificationStatus = '认证成功'
          break;
        case 3:
          res.body.degreeCertificationStatus = '认证失败'
          break;
      }
      switch (res.body.jobStatus){
        case 'lookingJob':
          res.body.jobStatus = '正在找工作-随时到岗'
          break;
        case 'considerChangingJob':
          res.body.jobStatus = '在职-正考虑换工作'
          break;
        case 'betterOpportunitiesMayAlsoBeConsidered':
          res.body.jobStatus = '在职-有更好的机会也可以考虑'
          break;
        case 'noPlanToChangeJobTemporarily':
          res.body.jobStatus = '在职-暂时无跳槽打算'
          break;
      }
      
      that.setData({
        name:res.body.name,
        sex: res.body.sex,
        workyear: res.body.workingYears,
        edu: res.body.recordOfFormalSchoolingName,
        age: res.body.age,
        avatar: res.body.avatar,
        phone: res.body.phone,
        personalAdvantage: res.body.personalAdvantage,
        jobStatus: res.body.jobStatus,
        expectIndustryName: res.body.expectIndustryName,
        expectWorkPlaceName: res.body.expectWorkPlaceName,
        jobHuntingIntention: res.body.jobHuntingIntention,
        maxExpectSalary: res.body.maxExpectSalary,
        minExpectSalary: res.body.minExpectSalary,
        worklist: res.body.workExperienceList,
        edulist: res.body.educationExperienceList,
        degreeCertificationStatus: res.body.degreeCertificationStatus,
        degreeCertificationFilePath: res.body.degreeCertificationFilePath
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
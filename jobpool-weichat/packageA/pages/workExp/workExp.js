// pages/workExp/workExp.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    textContent:"",
    textareaNub: 0,
    company:"",
    position:"",
    starTime:"请选择",
    endTime: "请选择",

    year: [],
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //开始时间
    showTime: false,
    value: [0, 0],
    oldValue: [0, 0],
    sureValue: [0, 0],
    //结束时间
    showTimeEnd: false,
    endValue: [0, 0],
    oldEndValue: [0, 0],
    sureEndValue: [0, 0],

    //工作经历模版
    workList:[],
    workTemplate:'',
    sLi: 0
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    console.log(id)
    let year = [];
    //年份列表
    for (var i = 1970; i <= new Date().getFullYear(); i++) {
      year.push(i);
    }
    year.reverse();
    WXAPI.getWorkExperienceDetail({ workExperienceId:id}).then(function (res) {
      if(res.body !=null){
        that.setData({
          id:id,
          year: year,
          textContent: res.body.jobDescription,
          textareaNub: res.body.jobDescription.length,
          company: res.body.companyName,
          position: res.body.position,
          starTime: res.body.startTimeYear + "-" + res.body.startTimeMonth,
          endTime: res.body.endTimeYear + "-" + res.body.endTimeMonth,
        })
      }else{
        that.setData({
          year: year
        })
      }
    });
    new Promise((resolve,reject)=>{
      WXAPI.getJobHuntingIntention().then(function (res) {
        console.log(res.body.expectPositionId)
        resolve(res.body.expectPositionId)
      })
    }).then(params=>{
      console.log(params)
      WXAPI.workExperienceTemplate({jobTypeIdList:params}).then(function (res) {
        console.log(res)
        if(res.body){
          that.setData({
            workList: res.body,
            workTemplate: res.body[0].content
          })
        }
      });
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

  },
  changeNext:function(){
    let that = this;
    let a = that.data.sLi;
    a++;
    if (a >= that.data.workList.length){
      a = 0
    }
    that.setData({
      sLi:a,
      workTemplate: that.data.workList[a].content
    })
  },
  copyjl:function(){
    let that = this;
    that.setData({
      textContent: that.data.workTemplate,
      textareaNub: that.data.workTemplate.length
    })
  },
  inputCompany:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      company: value
    })
  },
  inputPosition: function (e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      position: value
    })
  },
  //开始时间展示
  openStarTime: function () {
    let that = this;
    // if (that.data.year.lastIndexOf('至今') != -1){
    //   that.data.year.pop()
    // }
    that.setData({
      showTime: !that.data.showTime
      // year: that.data.year
    })
  },
  openStarTime_cancle: function () {
    let that = this;
    that.setData({
      showTime: !that.data.showTime,
      sureValue: that.data.oldValue,
      starTime: that.data.starTime
    })
  },
  openStarTime_sure: function () {
    let that = this;
    let date = that.data.year[that.data.value[0]] + "-" + that.data.month[that.data.value[1]];

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.year[that.data.value[0]] && m < that.data.month[that.data.value[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showTime: !that.data.showTime,
      sureValue: that.data.value,
      oldValue: that.data.value,
      starTime: date
    });
    if (that.data.starTime != '请选择' && that.data.endTime != '请选择') {
      that.timebj(date, that.data.endTime)
    }
  },
  bindChange: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      value: val
    })
  },
  ////结束时间
  openEndTime: function () {
    console.log(this.data.year)
    let that = this;
    // if (that.data.year.lastIndexOf('至今') == -1){
    //   that.data.year.push('至今')
    // }
    that.setData({
      showTimeEnd: !that.data.showTimeEnd
      // year: that.data.year
    })
  },
  openEndTime_cancle: function () {
    let that = this;
    that.setData({
      showTimeEnd: !that.data.showTimeEnd,
      sureEndValue: that.data.oldEndValue,
      endTime: that.data.endTime
    })
  },
  openEndTime_sure: function () {
    let that = this;
    let date = that.data.year[that.data.endValue[0]] + "-" + that.data.month[that.data.endValue[1]];
    // if (that.data.year[that.data.endValue[0]] == '至今'){
    //   let time = new Date();
    //   let y = time.getFullYear();
    //   let m = time.getMonth() + 1;
    //   m < 10 ? m = '0' + m : m;
    //   date = y + '-' + m
    //   console.log(date)
    // }

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.year[that.data.endValue[0]] && m < that.data.month[that.data.endValue[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showTimeEnd: !that.data.showTimeEnd,
      sureEndValue: that.data.endValue,
      oldEndValue: that.data.endValue,
      endTime: date
    });
    if (that.data.starTime != '请选择' && that.data.endTime != '请选择') {
      that.timebj(that.data.starTime, date)
    }
  },
  bindChangeEnd: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      endValue: val
    })
  },
  timebj: function(s,e){
    let that = this;
    let star = s.split('-');
    let end = e.split('-');
    let nstar = star.map((item) => {
      return parseInt(item)
    })
    let nend = end.map((item) => {
      return parseInt(item)
    })
    if (nstar[0] > nend[0]){
      wx.showModal({
        title:'错误',
        content: '开始时间不能大于结束时间',
        showCancel: false,
        success(res){
          if (res.confirm) {
            that.setData({
              starTime: s,
              endTime: s
            })
          }
        }
      })
    } else if (nstar[0] == nend[0] && nstar[1] > nend[1]){
      wx.showModal({
        title: '错误',
        content: '开始时间不能大于结束时间',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.setData({
              starTime: s,
              endTime: s
            })
          }
        }
      })
    }
  },
  countNub:function(e){
    let that = this;
    that.setData({
      textContent:e.detail.value,
      textareaNub: e.detail.value.length
    });
  },
  submitForm:function(){
    let that = this;
    let id = that.data.id;
    let companyName = that.data.company;
    let position = that.data.position;
    let jobDescription = that.data.textContent;
    // let startTimeYear = that.data.year[that.data.sureValue[0]], startTimeMonth = that.data.month[that.data.sureValue[1]], endTimeYear = that.data.year[that.data.sureEndValue[0]], endTimeMonth = that.data.month[that.data.sureEndValue[1]];  
    if (companyName == "" || position == "" || that.data.starTime == "请选择" || that.data.endTime == "请选择" || jobDescription ==""){
      wx.showToast({
        title: '请填写完所有资料',
        icon:'none',
        duration:2000
      })
    }else{
      WXAPI.saveWorkExperience({ id: id, companyName: companyName, position: position, startTimeYear: that.data.starTime.split('-')[0], startTimeMonth: that.data.starTime.split('-')[1], endTimeYear: that.data.endTime.split('-')[0], endTimeMonth: that.data.endTime.split('-')[1], jobDescription: jobDescription }).then(function (res) {
        wx.navigateBack()
      });
    }
  },
  del:function(){
    let that = this;
    let token = wx.getStorageSync('token');
    wx.showModal({
      content: '确定删除吗',
      confirmColor: '#2EA7E0',
      success(res){
        if(res.confirm){
          console.log(that.data.id)
          wx.request({
            url: WXAPI.ip + '/workExperience/delete?id=' + that.data.id,
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'authorization': 'Bearer ' + token
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  complete: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              }
            }
          })
          // WXAPI.workExperience({ id: that.data.id }).then(function(res){
          //   console.log(res)
          //   if(res.code == 200){
          //     wx.showToast({
          //       title:'删除成功',
          //       icon:'none',
          //       complete:function(){
          //         wx.navigateBack({
          //           delta: 1
          //         })
          //       }
          //     })
          //   }
          // })
        }
      }
    })
  }
})
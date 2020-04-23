// pages/educationExp/educationExp.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    schoolName:"",
    major:"",
    Education:"请选择",
    goSchoolTime:"请选择",
    outSchoolTime:"请选择",
    year: [],
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    educationList: ["初中", "高中", "中专", "大专", "本科", "硕士", "博士"],
    //学历
    showEdu: false,
    eduValue: [0],
    oldEduValue: [0],
    sureEduValue: [0],
    //入学时间
    showGoTime: false,
    goValue: [0, 0],
    oldGoValue: [0, 0],
    sureGoValue: [0, 0],

    startTimeYear: "",
    startTimeMonth: "",
    
    //毕业时间
    showOutTime: false,
    outValue: [0, 0],
    oldOutValue: [0, 0],
    sureOutValue: [0, 0],

    endTimeYear: "",
    endTimeMonth: "",
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
    WXAPI.getEducationExperienceDetail({ educationExperienceId: id }).then(function (res) {
      if (res.body != null) {
        console.log(res)
        that.setData({
          id: id,
          year: year.reverse(),
          schoolName: res.body.schoolName,
          major: res.body.major,
          Education: res.body.recordOfFormalSchoolingName,
          goSchoolTime: res.body.startTimeYear + "-" + res.body.startTimeMonth,
          outSchoolTime: res.body.endTimeYear + "-" + res.body.endTimeMonth,
          startTimeYear: res.body.startTimeYear,
          startTimeMonth: res.body.startTimeMonth,
          endTimeYear: res.body.endTimeYear,
          endTimeMonth: res.body.endTimeMonth
        })
      } else {
        that.setData({
          year: year.reverse()
        })
      }
    });
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
  inputUserName: function (e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      schoolName: value
    })
  },
  inputMajor: function (e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      major: value
    })
  },
  //学历选择  Education,showEdu: false,eduValue: [0],oldEduValue: [0],sureEduValue: [0],
  openEdu: function () {
    let that = this;
    that.setData({
      showEdu: !that.data.showEdu
    })
  },
  openEdu_cancle: function () {
    let that = this;
    that.setData({
      showEdu: !that.data.showEdu,
      sureEduValue: that.data.oldEduValue,
      Education: that.data.Education
    })
  },
  openEdu_sure: function () {
    let that = this;
    let date = that.data.educationList[that.data.eduValue[0]];
    that.setData({
      showEdu: !that.data.showEdu,
      sureEduValue: that.data.eduValue,
      oldEduValue: that.data.eduValue,
      Education: date
    });
  },
  bindChangeEdu: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      eduValue: val
    })
    console.log(val)
  },
  //入学时间选择
  openGoTime: function () {
    let that = this;
    that.setData({
      showGoTime: !that.data.showGoTime
    })
  },
  openGoTime_cancle: function () {
    let that = this;
    that.setData({
      showGoTime: !that.data.showGoTime,
      sureGoValue: that.data.oldGoValue,
      goSchoolTime: that.data.goSchoolTime
    })
  },
  openGoTime_sure: function () {
    let that = this;
    let date = that.data.year[that.data.goValue[0]] + "-" + that.data.month[that.data.goValue[1]];

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.year[that.data.goValue[0]] && m < that.data.month[that.data.goValue[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showGoTime: !that.data.showGoTime,
      sureGoValue: that.data.goValue,
      oldGoValue: that.data.goValue,
      goSchoolTime: date,
      startTimeYear: that.data.year[that.data.goValue[0]],
      startTimeMonth: that.data.month[that.data.goValue[1]],
    });
    that.timebj(date, that.data.outSchoolTime)
  },
  bindChangeGoTime: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      goValue: val
    })
  },
  //毕业时间选择 
  openOutTime: function () {
    let that = this;
    that.setData({
      showOutTime: !that.data.showOutTime
    })
  },
  openOutTime_cancle: function () {
    let that = this;
    that.setData({
      showOutTime: !that.data.showOutTime,
      sureOutValue: that.data.oldOutValue,
      outSchoolTime: that.data.outSchoolTime
    })
  },
  openOutTime_sure: function () {
    let that = this;
    let date = that.data.year[that.data.outValue[0]] + "-" + that.data.month[that.data.outValue[1]];

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.year[that.data.outValue[0]] && m < that.data.month[that.data.outValue[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showOutTime: !that.data.showOutTime,
      sureOutValue: that.data.outValue,
      oldOutValue: that.data.outValue,
      outSchoolTime: date,
      endTimeYear: that.data.year[that.data.outValue[0]],
      endTimeMonth: that.data.month[that.data.outValue[1]]
    });
    that.timebj(that.data.goSchoolTime,date)
  },
  bindChangeOutTime: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      outValue: val
    })
  },
  timebj: function (s, e) {
    let that = this;
    let star = s.split('-');
    let end = e.split('-');
    let nstar = star.map((item) => {
      return parseInt(item)
    })
    let nend = end.map((item) => {
      return parseInt(item)
    })
    if (nstar[0] > nend[0]) {
      wx.showModal({
        title: '错误',
        content: '开始时间不能大于结束时间',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.setData({
              goSchoolTime: s,
              outSchoolTime: s
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
              goSchoolTime: s,
              outSchoolTime: s
            })
          }
        }
      })
    }
  },
  submitForm:function(){
    let that = this;
    let id = that.data.id;
    let schoolName = that.data.schoolName;
    let major = that.data.major;
    let recordOfFormalSchoolingId = "";
    switch (that.data.Education){
      case "初中":
        recordOfFormalSchoolingId = "juniorHigh";
        break;
      case "高中":
        recordOfFormalSchoolingId = "high";
        break;
      case "中专":
        recordOfFormalSchoolingId = "technicalSecondary";
        break;
      case "大专":
        recordOfFormalSchoolingId = "juniorCollege";
        break;
      case "本科":
        recordOfFormalSchoolingId = "regularCollege";
        break;
      case "硕士":
        recordOfFormalSchoolingId = "master";
        break;
      case "博士":
        recordOfFormalSchoolingId = "doctor";
        break;
    }
      // that.data.startTimeYear = that.data.year[that.data.sureGoValue[0]], 
      // that.data.startTimeMonth = that.data.month[that.data.sureGoValue[1]], 
      // that.data.endTimeYear = that.data.year[that.data.sureOutValue[0]], 
      // that.data.endTimeMonth = that.data.month[that.data.sureOutValue[1]];
    if (schoolName == "" || major == "" || that.data.goSchoolTime == "请选择" || that.data.outSchoolTime == "请选择" || recordOfFormalSchoolingId == "请选择") {
      wx.showToast({
        title: '请填写完所有资料',
        icon: 'none',
        duration: 2000
      })
    } else {
      WXAPI.saveEducationExperience({ id: id, schoolName: schoolName, major: major, startTimeYear: that.data.startTimeYear, startTimeMonth: that.data.startTimeMonth, endTimeYear: that.data.endTimeYear, endTimeMonth: that.data.endTimeMonth, education: recordOfFormalSchoolingId }).then(function (res) {
        console.log(res)
        wx.navigateBack()
      });
    }
  },
  del: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    wx.showModal({
      content: '确定删除吗',
      confirmColor: '#2EA7E0',
      success(res) {
        if (res.confirm) {
          console.log(that.data.id)
          wx.request({
            url: WXAPI.ip + '/educationExperience/delete?id=' + that.data.id,
            method: 'DELETE',
            header: {
              'content-type': 'application/json',
              'authorization': 'Bearer ' + token
            },
            success:function(res){
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
          // WXAPI.educationExperience({
          //   __method: "DELETE",
          //   id: that.data.id
          //   }).then(function (res) {
          //   console.log(res)
          //   if (res.code == 200) {
          //     wx.showToast({
          //       title: '删除成功',
          //       icon: 'none',
          //       complete: function () {
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
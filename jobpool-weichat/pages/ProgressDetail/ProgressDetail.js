// pages/ProgressDetail/ProgressDetail.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    imgIp: WXAPI.imgIp,
    id:'',
    content:'',
    status1:null,
    status2:null,
    status3:null,
    status4:null,
    status5:null,
    status6:null,
    status7:null,
    status8:null,
    status9:null,
    status10:null,
    status11:null,
    status12:null,
    status13:null,
    status14:null,
    status15: null,
    status16: null,
    status17: null,
    status18: null,
    status19: null,
    status20: null,
    status21: null,
    status22: null,
    status23: null,
    status24: null,

    jobType:'',
    state:'',

    jujueshow:false,
    jujueshow2: false,
    jujueyy: ['面试时间不合适','工资较低','上班地点太远','已入职其他公司'],
    yy: '',
    jjid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.data.id = options.id;
    WXAPI.progressDetail({ applyId: that.data.id }).then(function (res) {
      console.log(res)
      res.body.minSalary = (res.body.minSalary / 1000).toFixed(1)
      res.body.maxSalary = (res.body.maxSalary / 1000).toFixed(1)
      that.setData({
        content:res.body,
        jobType: res.body.jobType,
        state: res.body.interviewApplyLogList[0].statusEnum
      });
      for (let i in res.body.interviewApplyLogList){
        let a = res.body.interviewApplyLogList[i];
        switch (a.statusEnum) {
          case 'applySuccess':      //申请成功
            that.setData({
              status1:a
            })
            break;
          case 'resumeIsViewed':    //简历被查看
            that.setData({
              status2: a
            })
            break;
          case 'sendInterviewInvitation':  ///收到面试邀请
            that.setData({
              status3: a,
              phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
            })
            break;
          case 'acceptInterviewInvitation':  ///接受面试邀请
            that.setData({
              status11: a,
              phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
            })
            break;
          case 'refuseToInterviewInvitation':  ///拒绝面试邀请
            that.setData({
              status15: a,
              phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
            })
            break;
          case 'waitingForInterview':     //等待面试  
            that.setData({
              status4: a
            })
            break;
          case 'waitingForInterviewCheckIn':     //等待面试签到  
            that.setData({
              status16: a
            })
            break;
          case 'endOfInterview':      //结束面试
            that.setData({
              status5: a
            })
            break;
          case 'interviewCheckInSuccess':      //面试签到成功
            that.setData({
              status17: a
            })
            break;
          case 'sendARetestInvitation':     //收到复试邀请
            that.setData({
              status6: a,
              phone: a.content.interviewContactNumber
            })
            break;
          case 'acceptTheRetestInvitation':     //接受复试邀请
            that.setData({
              status18: a,
              phone: a.content.interviewContactNumber
            })
            break;
          case 'waitingForARetestCheckIn':     //等待复试签到
            that.setData({
              status7: a,
              phone: a.content.interviewContactNumber
            })
            break;
          case 'refuseToRetryInvitation':     //拒绝复试邀请
            that.setData({
              status19: a,
              phone: a.content.interviewContactNumber
            })
            break;
          case 'waitingForARetest':     //等待复试
            that.setData({
              status7: a
            })
            break;
          case 'endRetest':     //复试结束
            that.setData({
              status8: a
            })
            break;
          case 'retestCheckInSuccess':     //复试签到成功
            that.setData({
              status20: a
            })
            break;
          case 'sendOffer':     //发送offer
            that.setData({
              status9: a, 
              phone: a.content.interviewContactNumber

            })
            break;
          case 'notSuitable':   //不合适
            that.setData({
              status10: a
            })
            break;
          case 'end':     //结束
            that.setData({
              status24: a
            })
            break;
          case 'endTheInterview':    //拒绝面试而结束
            that.setData({
              status12: a
            })
            break;
          case 'endingTheRefusalOfTheRetest':    //拒绝复试而结束
            that.setData({
              status13: a
            })
            break;
          case 'endOfCheckIn':    //签到结束
            that.setData({
              status14: a
            })
            break;
          case 'cancel':   //取消
            that.setData({
              status21: a
            })
            break;
          case 'interviewLateArrival':    //面试签到迟到
            that.setData({
              status22: a
            })
            break;
          case 'retestLateArrival':    //复试签到迟到
            that.setData({
              status23: a
            })
            break;
        }
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
  
  cancel:function(){
    let that = this;
    // if (that.data.state == 'applySuccess' || that.data.state == 'resumeIsViewed' || that.data.state == 'sendInterviewInvitation'){
      
    // } else 
    if (that.data.state == 'cancel'){
      wx.showToast({
        title:'您已取消面试',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要取消面试申请吗',
        success(res) {
          if (res.confirm) {
            WXAPI.interviewApplyCancel({ applyId: that.data.id }).then(function (res) {
              console.log(res)
              if (res.code == 200) {
                wx.showToast({
                  title: '取消成功',
                  duration: 1000
                })
              }else{
                wx.showToast({
                  title: res.msg,
                  icon:'none',
                  duration: 1000
                })
              }
            })
          }
        }
      })
      // wx.showModal({
      //   title: '提示',
      //   content: '如需取消面试，直接拨打电话取消',
      //   showCancel: false
      // })
    }
  },
  callPhone:function(){
    let that = this;
    if (that.data.phone == ''){
      wx.showToast({
        title: '您还没有获得面试邀请',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.makePhoneCall({
        phoneNumber: that.data.phone
      })
    }
  },
  jieshoumianshi:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    WXAPI.operationalInterview({ applyLogId: id, whetherToGoToTheInterview:"accept" }).then(function (res) {
      let status3 = that.data.status3;
      status3.content.status = 1
      that.setData({
        status3: status3
      });

      WXAPI.progressDetail({ applyId: that.data.id }).then(function (res) {
        console.log(res)
        res.body.minSalary = (res.body.minSalary / 1000).toFixed(1)
        res.body.maxSalary = (res.body.maxSalary / 1000).toFixed(1)
        that.setData({
          content: res.body,
          jobType: res.body.jobType,
          state: res.body.interviewApplyLogList[0].statusEnum
        });
        for (let i in res.body.interviewApplyLogList) {
          let a = res.body.interviewApplyLogList[i];
          
          switch (a.statusEnum) {
            case 'applySuccess':      //申请成功
              that.setData({
                status1: a
              })
              break;
            case 'resumeIsViewed':    //简历被查看
              that.setData({
                status2: a
              })
              break;
            case 'sendInterviewInvitation':  ///收到面试邀请
              that.setData({
                status3: a,
                phone: that.data.phone?that.data.phone:a.content.interviewContactNumber
              })
              break;
            case 'acceptInterviewInvitation':  ///接受面试邀请
              that.setData({
                status11: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'refuseToInterviewInvitation':  ///拒绝面试邀请
              that.setData({
                status15: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'waitingForInterview':     //等待面试  
              that.setData({
                status4: a
              })
              break;
            case 'waitingForInterviewCheckIn':     //等待面试签到  
              that.setData({
                status16: a
              })
              break;
            case 'endOfInterview':      //结束面试
              that.setData({
                status5: a
              })
              break;
            case 'interviewCheckInSuccess':      //面试签到成功
              that.setData({
                status17: a
              })
              break;
            case 'sendARetestInvitation':     //收到复试邀请
              that.setData({
                status6: a
              })
              break;
            case 'acceptTheRetestInvitation':     //接受复试邀请
              that.setData({
                status18: a
              })
              break;
            case 'waitingForARetestCheckIn':     // 等待复试签到
              that.setData({
                status7: a,
                phone: a.content.interviewContactNumber
              })
              break;
            case 'refuseToRetryInvitation':     //拒绝复试邀请
              that.setData({
                status19: a
              })
              break;
            case 'waitingForARetest':     //等待复试
              that.setData({
                status7: a
              })
              break;
            case 'endRetest':     //复试结束
              that.setData({
                status8: a
              })
              break;
            case 'retestCheckInSuccess':     //复试签到成功
              that.setData({
                status20: a
              })
              break;
            case 'sendOffer':     //发送offer
              that.setData({
                status9: a
              })
              break;
            case 'notSuitable':   //不合适
              that.setData({
                status10: a
              })
              break;
            case 'endTheInterview':    //拒绝面试而结束
              that.setData({
                status12: a
              })
              break;
            case 'endingTheRefusalOfTheRetest':    //拒绝复试而结束
              that.setData({
                status13: a
              })
              break;
            case 'endOfCheckIn':    //签到结束
              that.setData({
                status14: a
              })
              break;
            case 'cancel':   //取消
              that.setData({
                status21: a
              })
              break;
            case 'interviewLateArrival':    //面试签到迟到
              that.setData({
                status22: a
              })
              break;
            case 'retestLateArrival':    //复试签到迟到
              that.setData({
                status23: a
              })
              break;
            case 'end':     //结束
              that.setData({
                status24: a
              })
              break;
          }
        }
      });
    });
  },
  jujuemianshi: function (e) {
    let that = this;
    that.setData({
      jujueshow: !that.data.jujueshow,
      jjid: e.currentTarget.dataset.id,
      yy:that.data.jujueyy[0]
    })
    console.log(that.data.yy)
  },
  jieshoufushi: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    WXAPI.operationalInterview({ applyLogId: id, whetherToGoToTheInterview: "accept" }).then(function (res) {
      let status6 = that.data.status6;
      status6.content.status = 1
      that.setData({
        status6: status6
      })
      WXAPI.progressDetail({ applyId: that.data.id }).then(function (res) {
        console.log(res)
        let $res = res.body;
        $res.minSalary = ($res.minSalary / 1000).toFixed(1)
        $res.maxSalary = ($res.maxSalary / 1000).toFixed(1)
        that.setData({
          content: res.body,
          jobType: res.body.jobType,
          state: res.body.interviewApplyLogList[0].statusEnum
        });
        for (let i in res.body.interviewApplyLogList) {
          let a = res.body.interviewApplyLogList[i];
          
          switch (a.statusEnum) {
            case 'applySuccess':      //申请成功
              that.setData({
                status1: a
              })
              break;
            case 'resumeIsViewed':    //简历被查看
              that.setData({
                status2: a
              })
              break;
            case 'sendInterviewInvitation':  ///收到面试邀请
              that.setData({
                status3: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'acceptInterviewInvitation':  ///接受面试邀请
              that.setData({
                status11: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'refuseToInterviewInvitation':  ///拒绝面试邀请
              that.setData({
                status15: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'waitingForInterview':     //等待面试  
              that.setData({
                status4: a
              })
              break;
            case 'waitingForInterviewCheckIn':     //等待面试签到  
              that.setData({
                status16: a
              })
              break;
            case 'endOfInterview':      //结束面试
              that.setData({
                status5: a
              })
              break;
            case 'interviewCheckInSuccess':      //面试签到成功
              that.setData({
                status17: a
              })
              break;
            case 'sendARetestInvitation':     //收到复试邀请
              that.setData({
                status6: a
              })
              break;
            case 'acceptTheRetestInvitation':     //接受复试邀请
              that.setData({
                status18: a
              })
              break;
            case 'refuseToRetryInvitation':     //拒绝复试邀请
              that.setData({
                status19: a
              })
              break;
            case 'waitingForARetest':     //等待复试
              that.setData({
                status7: a
              })
              break;
            case 'waitingForARetestCheckIn':     // 等待复试签到
              that.setData({
                status7: a
              })
              break;
            case 'endRetest':     //复试结束
              that.setData({
                status8: a
              })
              break;
            case 'retestCheckInSuccess':     //复试签到成功
              that.setData({
                status20: a
              })
              break;
            case 'sendOffer':     //发送offer
              that.setData({
                status9: a
              })
              break;
            case 'notSuitable':   //不合适
              that.setData({
                status10: a
              })
              break;
            case 'endTheInterview':    //拒绝面试而结束
              that.setData({
                status12: a
              })
              break;
            case 'endingTheRefusalOfTheRetest':    //拒绝复试而结束
              that.setData({
                status13: a
              })
              break;
            case 'endOfCheckIn':    //签到结束
              that.setData({
                status14: a
              })
              break;
            case 'cancel':   //取消
              that.setData({
                status21: a
              })
              break;
            case 'interviewLateArrival':    //面试签到迟到
              that.setData({
                status22: a
              })
              break;
            case 'retestLateArrival':    //复试签到迟到
              that.setData({
                status23: a
              })
              break;
            case 'end':     //结束
              that.setData({
                status24: a
              })
              break;
          }
        }
      });
    });
    
  },
  jujuefushi: function (e) {
    let that = this;
    that.setData({
      jujueshow: !that.data.jujueshow,
      jjid: e.currentTarget.dataset.id,
      yy: that.data.jujueyy[0]
    })   
  },
  openSex_cancle2: function () {
    let that = this;
    that.setData({
      jujueshow2: !that.data.jujueshow2
    })
  },
  openSex_sure2:function(){
    let that = this
    that.setData({
      jujueshow2: !that.data.jujueshow2
    });
    WXAPI.operationalInterview({ applyLogId: that.data.jjid, whetherToGoToTheInterview: "refuse", reasonForRefusal: that.data.yy }).then(function (res) {
      console.log(res)
      let status6 = that.data.status6;
      status6.content.status = 2
      that.setData({
        status6: status6
      });
      WXAPI.progressDetail({ applyId: that.data.id }).then(function (res) {
        console.log(res)
        let $res = res.body;
        $res.minSalary = ($res.minSalary / 1000).toFixed(1)
        $res.maxSalary = ($res.maxSalary / 1000).toFixed(1)
        that.setData({
          content: res.body,
          state: res.body.interviewApplyLogList[0].statusEnum
        });
        for (let i in res.body.interviewApplyLogList) {
          let a = res.body.interviewApplyLogList[i];
          switch (a.statusEnum) {
            case 'applySuccess':      //申请成功
              that.setData({
                status1: a
              })
              break;
            case 'resumeIsViewed':    //简历被查看
              that.setData({
                status2: a
              })
              break;
            case 'sendInterviewInvitation':  ///收到面试邀请
              that.setData({
                status3: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'acceptInterviewInvitation':  ///接受面试邀请
              that.setData({
                status11: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'refuseToInterviewInvitation':  ///拒绝面试邀请
              that.setData({
                status15: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'waitingForInterview':     //等待面试  
              that.setData({
                status4: a
              })
              break;
            case 'waitingForInterviewCheckIn':     //等待面试签到  
              that.setData({
                status16: a
              })
              break;
            case 'endOfInterview':      //结束面试
              that.setData({
                status5: a
              })
              break;
            case 'interviewCheckInSuccess':      //面试签到成功
              that.setData({
                status17: a
              })
              break;
            case 'sendARetestInvitation':     //收到复试邀请
              that.setData({
                status6: a
              })
              break;
            case 'acceptTheRetestInvitation':     //接受复试邀请
              that.setData({
                status18: a
              })
              break;
            case 'refuseToRetryInvitation':     //拒绝复试邀请
              that.setData({
                status19: a
              })
              break;
            case 'waitingForARetest':     //等待复试
              that.setData({
                status7: a
              })
              break;
            case 'endRetest':     //复试结束
              that.setData({
                status8: a
              })
              break;
            case 'retestCheckInSuccess':     //复试签到成功
              that.setData({
                status20: a
              })
              break;
            case 'sendOffer':     //发送offer
              that.setData({
                status9: a
              })
              break;
            case 'notSuitable':   //不合适
              that.setData({
                status10: a
              })
              break;
            case 'endTheInterview':    //拒绝面试而结束
              that.setData({
                status12: a
              })
              break;
            case 'endingTheRefusalOfTheRetest':    //拒绝复试而结束
              that.setData({
                status13: a
              })
              break;
            case 'endOfCheckIn':    //签到结束
              that.setData({
                status14: a
              })
              break;
            case 'cancel':   //取消
              that.setData({
                status21: a
              })
              break;
            case 'interviewLateArrival':    //面试签到迟到
              that.setData({
                status22: a
              })
              break;
            case 'retestLateArrival':    //复试签到迟到
              that.setData({
                status23: a
              })
              break;
            case 'end':     //结束
              that.setData({
                status24: a
              })
              break;
          }
        }
      });
    });
  },

  // 拒绝原因
  jujue:function(e){
    let that = this;
    that.setData({
      yy: that.data.jujueyy[e.detail.value[0]]
    })
  },
  openSex_cancle:function(){
    let that = this;
    that.setData({
      jujueshow: !that.data.jujueshow
    })
  },
  openSex_sure:function(){
    let that = this
    that.setData({
      jujueshow: !that.data.jujueshow
    });
    WXAPI.operationalInterview({ applyLogId: that.data.jjid, whetherToGoToTheInterview: "refuse", reasonForRefusal: that.data.yy}).then(function (res) {
      console.log(res)
      let status3 = that.data.status3;
      status3.content.status = 2
      that.setData({
        status3: status3
      })
      WXAPI.progressDetail({ applyId: that.data.id }).then(function (res) {
        console.log(res)
        let $res = res.body;
        $res.minSalary = ($res.minSalary / 1000).toFixed(1)
        $res.maxSalary = ($res.maxSalary / 1000).toFixed(1)
        that.setData({
          content: res.body,
          state: res.body.interviewApplyLogList[0].statusEnum
        });
        for (let i in res.body.interviewApplyLogList) {
          let a = res.body.interviewApplyLogList[i];
          switch (a.statusEnum) {
            case 'applySuccess':      //申请成功
              that.setData({
                status1: a
              })
              break;
            case 'resumeIsViewed':    //简历被查看
              that.setData({
                status2: a
              })
              break;
            case 'sendInterviewInvitation':  ///收到面试邀请
              that.setData({
                status3: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'acceptInterviewInvitation':  ///接受面试邀请
              that.setData({
                status11: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'refuseToInterviewInvitation':  ///拒绝面试邀请
              that.setData({
                status15: a,
                phone: that.data.phone ? that.data.phone : a.content.interviewContactNumber
              })
              break;
            case 'waitingForInterview':     //等待面试  
              that.setData({
                status4: a
              })
              break;
            case 'waitingForInterviewCheckIn':     //等待面试签到  
              that.setData({
                status16: a
              })
              break;
            case 'endOfInterview':      //结束面试
              that.setData({
                status5: a
              })
              break;
            case 'interviewCheckInSuccess':      //面试签到成功
              that.setData({
                status17: a
              })
              break;
            case 'sendARetestInvitation':     //收到复试邀请
              that.setData({
                status6: a
              })
              break;
            case 'acceptTheRetestInvitation':     //接受复试邀请
              that.setData({
                status18: a
              })
              break;
            case 'refuseToRetryInvitation':     //拒绝复试邀请
              that.setData({
                status19: a
              })
              break;
            case 'waitingForARetest':     //等待复试
              that.setData({
                status7: a
              })
              break;
            case 'endRetest':     //复试结束
              that.setData({
                status8: a
              })
              break;
            case 'retestCheckInSuccess':     //复试签到成功
              that.setData({
                status20: a
              })
              break;
            case 'sendOffer':     //发送offer
              that.setData({
                status9: a
              })
              break;
            case 'notSuitable':   //不合适
              that.setData({
                status10: a
              })
              break;
            case 'endTheInterview':    //拒绝面试而结束
              that.setData({
                status12: a
              })
              break;
            case 'endingTheRefusalOfTheRetest':    //拒绝复试而结束
              that.setData({
                status13: a
              })
              break;
            case 'endOfCheckIn':    //签到结束
              that.setData({
                status14: a
              })
              break;
            case 'cancel':   //取消
              that.setData({
                status21: a
              })
              break;
            case 'interviewLateArrival':    //面试签到迟到
              that.setData({
                status22: a
              })
              break;
            case 'retestLateArrival':    //复试签到迟到
              that.setData({
                status23: a
              })
              break;
            case 'end':     //结束
              that.setData({
                status24: a
              })
              break;
          }
        }
      });
    });
    
  },
  saoma: function () {
    var that = this;
    if(that.data.jobType!="scene"){
      return false
    }
    wx.scanCode({
      // onlyFromCamera: true,
      success(res) {
        console.log(res)
        var json;
        if(res.result.indexOf('combineType') != -1){
          json= that.getQueryArgs(res.result);
          json.content = json.id
        }else{
          let $resultstr = res.result
          let _jsostrn = that.isJSON(res.result)
          console.log(_jsostrn)
          if (!_jsostrn) {
            wx.navigateTo({ url: '../sao/sao?qiandaostate=' + '失败' + '&describe=' + '错误的二维码' })
            return false;
          }
          json = JSON.parse(res.result);
        }
        console.log(json)

        if (json.scanCodeType == "jobDetail" && json.scanCodeType) {
          wx.navigateTo({ url: `../recruitDetail/recruitDetail?id=${json.content}` })
        } else if (json.scanCodeType == "checkIn") {
          WXAPI.myResume().then(function (res) {
            console.log(res)
            if (!res.body.fjCardId && res.body.status != 401) {
              console.log('wanshanshengfenzheng')
              wx.navigateTo({ url: '../../packageA/pages/perfectInfomation/perfectInfomation?id=' + json.content +'&optionid='+that.data.id})
            } else {
              WXAPI.scanCodeCheckIn({ id: json.content,relationId :json.relationId  }).then(function (res) {
                console.log(res)
                wx.navigateTo({ url: '../sao/sao?qiandaostate=' + res.status + '&describe=' + res.msg + '&optionid=' + that.data.id})
              })
            }
          })
        } else if (json.scanCodeType == "companyDetail") {
          wx.navigateTo({ url: '../companyInfo/companyInfo?id=' + json.content })
        }
        else if (json.scanCodeType == "login") {
          wx.navigateTo({ url: '../sao/sao?qiandaostate=' + '失败' + '&describe=' + '扫码登录请使用APP客户端' })
        }
      }
    })
  },
  getQueryArgs:function(url) {
    var qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
      //保存每一项
      args = {},
      //得到每一项
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length;

    for (i = 0; i < len; i++) {
      item = items[i].split('='),
        name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      if (name.length) {
        args[name] = value;
      }
    }
    return args;
  },
  richtext:function(){
    console.log('富文本')
    wx.setStorageSync("richtext",this.data.status9.content.entryRemarks) 
    wx.navigateTo({
      url: `../richText/richText?data=offer`
    })
  },
})
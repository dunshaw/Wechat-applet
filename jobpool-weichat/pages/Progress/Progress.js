// pages/Progress/Progress.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    list:[],
    pageNub:1,
    pageSize:10,
    islogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this;
    wx.showLoading({
      title: '加载中'
    })
    console.log(that.data.pageNub, that.data.pageSize)
    WXAPI.progressList({ current: 1, size: that.data.pageSize }).then(function (res) {
      console.log(res)
      if (res.body.status == 401) {
        that.setData({
          islogin: false
        })
        // wx.reLaunch({
        //   url: "/pages/login/login",
        // })
      } else {
        for (let i in res.body) {
          let a = res.body[i];
          switch (a.statusEnum) {
            case 'applySuccess':
              a['zhuangtai'] = "申请成功";
              break;
            case 'resumeIsViewed':
              a['zhuangtai'] = "简历被查看";
              break;
            case 'sendInterviewInvitation':
              a['zhuangtai'] = "收到面试邀请";
              break;
            case 'acceptInterviewInvitation':
              a['zhuangtai'] = "接受面试邀请";
              break;
            case 'refuseToInterviewInvitation':
              a['zhuangtai'] = "拒绝面试邀请";
              break;
            case 'waitingForInterview':
              a['zhuangtai'] = "等待面试";
              break;
            case 'waitingForInterviewCheckIn':
              a['zhuangtai'] = "等待面试签到";
              break;
            case 'endOfInterview':
              a['zhuangtai'] = "面试结束";
              break;
            case 'interviewCheckInSuccess':
              a['zhuangtai'] = "面试签到成功";
              break;
            case 'sendARetestInvitation':
              a['zhuangtai'] = "收到复试邀请";
              break;
            case 'acceptTheRetestInvitation':
              a['zhuangtai'] = "接受复试邀请";
              break;
            case 'refuseToRetryInvitation':
              a['zhuangtai'] = "拒绝复试邀请";
              break;
            case 'waitingForARetest':
              a['zhuangtai'] = "等待复试";
              break;
            case 'waitingForARetestCheckIn':
              a['zhuangtai'] = "等待复试";
              break;
            case 'endRetest':
              a['zhuangtai'] = "复试结束";
              break;
            case 'retestCheckInSuccess':
              a['zhuangtai'] = "复试签到成功";
              break;
            case 'sendOffer':
              a['zhuangtai'] = "收到offer";
              break;
            case 'notSuitable':
              a['zhuangtai'] = "不合适";
              break;
            case 'end':
              a['zhuangtai'] = "结束";
              break;
            case 'endTheInterview':
              a['zhuangtai'] = "拒绝面试而结束";
              break;
            case 'endingTheRefusalOfTheRetest':
              a['zhuangtai'] = "拒绝复试而结束";
              break;
            case 'cancel':
              a['zhuangtai'] = "取消";
              break;
            case 'endOfCheckIn':
              a['zhuangtai'] = "签到后结束";
              break;
            case 'interviewLateArrival':
              a['zhuangtai'] = "面试签到迟到";
              break;
            case 'retestLateArrival':
              a['zhuangtai'] = "复试签到迟到";
              break;
            case 'confirmEntry':
              a['zhuangtai'] = "收到offer";
              break;
            case 'refuseEntry':
              a['zhuangtai'] = "收到offer";
              break;
          }
          // a.time = new Date(a.time).getFullYear().toString().substr(2, 2) + "-" + (new Date(a.time).getMonth() + 1) + "-" + new Date(a.time).getDate() + " " + new Date(a.time).getHours() + ":" + new Date(a.time).getMinutes();
        }
        that.setData({
          islogin: true,
          list: res.body,
          pageNub: that.data.pageNub + 1
        });
      }
      wx.hideLoading()
    });
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
    let that = this;
        WXAPI.progressList({ current: 1, size: that.data.pageSize }).then(function (res) {
          console.log(res)
          if (res.body.status == 401) {
            wx.reLaunch({
              url: "/pages/login/login",
            })
          } else {
           if(res.body.length != 0){
             for (let i in res.body) {
               let a = res.body[i];
               switch (a.statusEnum) {
                 case 'applySuccess':
                   a['zhuangtai'] = "申请成功";
                   break;
                 case 'resumeIsViewed':
                   a['zhuangtai'] = "简历被查看";
                   break;
                 case 'sendInterviewInvitation':
                   a['zhuangtai'] = "收到面试邀请";
                   break;
                 case 'acceptInterviewInvitation':
                   a['zhuangtai'] = "接受面试邀请";
                   break;
                 case 'refuseToInterviewInvitation':
                   a['zhuangtai'] = "拒绝面试邀请";
                   break;
                 case 'waitingForInterview':
                   a['zhuangtai'] = "等待面试";
                   break;
                 case 'waitingForInterviewCheckIn':
                   a['zhuangtai'] = "等待面试签到";
                   break;
                 case 'endOfInterview':
                   a['zhuangtai'] = "面试结束";
                   break;
                 case 'interviewCheckInSuccess':
                   a['zhuangtai'] = "面试签到成功";
                   break;
                 case 'sendARetestInvitation':
                   a['zhuangtai'] = "收到复试邀请";
                   break;
                 case 'acceptTheRetestInvitation':
                   a['zhuangtai'] = "接受复试邀请";
                   break;
                 case 'refuseToRetryInvitation':
                   a['zhuangtai'] = "拒绝复试邀请";
                   break;
                 case 'waitingForARetest':
                   a['zhuangtai'] = "等待复试";
                   break;
                 case 'endRetest':
                   a['zhuangtai'] = "复试结束";
                   break;
                 case 'retestCheckInSuccess,':
                   a['zhuangtai'] = "复试签到成功";
                   break;
                 case 'sendOffer':
                   a['zhuangtai'] = "收到offer";
                   break;
                 case 'notSuitable':
                   a['zhuangtai'] = "不合适";
                   break;
                 case 'end':
                   a['zhuangtai'] = "结束";
                   break;
                 case 'endTheInterview':
                   a['zhuangtai'] = "拒绝面试而结束";
                   break;
                 case 'endingTheRefusalOfTheRetest':
                   a['zhuangtai'] = "拒绝复试而结束";
                   break;
                 case 'cancel':
                   a['zhuangtai'] = "取消";
                   break;
                 case 'endOfCheckIn':
                   a['zhuangtai'] = "签到后结束";
                   break;
                 case 'interviewLateArrival':
                   a['zhuangtai'] = "面试签到迟到";
                   break;
                 case 'retestLateArrival':
                   a['zhuangtai'] = "复试签到迟到";
                   break;
                 case 'confirmEntry':
                   a['zhuangtai'] = "收到offer";
                   break;
                 case 'refuseEntry':
                   a['zhuangtai'] = "收到offer";
                   break;
               }
             }
             that.setData({
               list: res.body,
               pageNub: 1
             });
             wx.stopPullDownRefresh()
           }else{
             wx.showToast({
               title:'没有更多数据了',
               icon:'none'
             })
             wx.stopPullDownRefresh()
             return;
           }
          }
        })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    WXAPI.progressList({
      current: that.data.pageNub,
      size: that.data.pageSize
    }).then(function(res){
      if (res.body.length != 0) {
        for (let i in res.body) {
          let a = res.body[i];
          switch (a.statusEnum) {
            case 'applySuccess':
              a['zhuangtai'] = "申请成功";
              break;
            case 'resumeIsViewed':
              a['zhuangtai'] = "简历被查看";
              break;
            case 'sendInterviewInvitation':
              a['zhuangtai'] = "收到面试邀请";
              break;
            case 'acceptInterviewInvitation':
              a['zhuangtai'] = "接受面试邀请";
              break;
            case 'refuseToInterviewInvitation':
              a['zhuangtai'] = "拒绝面试邀请";
              break;
            case 'waitingForInterview':
              a['zhuangtai'] = "等待面试";
              break;
            case 'waitingForInterviewCheckIn':
              a['zhuangtai'] = "等待面试签到";
              break;
            case 'endOfInterview':
              a['zhuangtai'] = "面试结束";
              break;
            case 'interviewCheckInSuccess':
              a['zhuangtai'] = "面试签到成功";
              break;
            case 'sendARetestInvitation':
              a['zhuangtai'] = "收到复试邀请";
              break;
            case 'acceptTheRetestInvitation':
              a['zhuangtai'] = "接受复试邀请";
              break;
            case 'refuseToRetryInvitation':
              a['zhuangtai'] = "拒绝复试邀请";
              break;
            case 'waitingForARetest':
              a['zhuangtai'] = "等待复试";
              break;
            case 'endRetest':
              a['zhuangtai'] = "复试结束";
              break;
            case 'retestCheckInSuccess,':
              a['zhuangtai'] = "复试签到成功";
              break;
            case 'sendOffer':
              a['zhuangtai'] = "收到offer";
              break;
            case 'notSuitable':
              a['zhuangtai'] = "不合适";
              break;
            case 'end':
              a['zhuangtai'] = "结束";
              break;
            case 'endTheInterview':
              a['zhuangtai'] = "拒绝面试而结束";
              break;
            case 'endingTheRefusalOfTheRetest':
              a['zhuangtai'] = "拒绝复试而结束";
              break;
            case 'cancel':
              a['zhuangtai'] = "取消";
              break;
            case 'endOfCheckIn':
              a['zhuangtai'] = "签到后结束";
              break;
            case 'interviewLateArrival':
              a['zhuangtai'] = "面试签到迟到";
              break;
            case 'retestLateArrival':
              a['zhuangtai'] = "复试签到迟到";
              break;
            case 'confirmEntry':
              a['zhuangtai'] = "收到offer";
              break;
            case 'refuseEntry':
              a['zhuangtai'] = "收到offer";
              break;
          }
          that.data.list.push(a)
        }
        that.setData({
          list: that.data.list,
          pageNub: that.data.pageNub + 1
        });
      } else {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        })
        return;
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jump:function(e){
    if (e.currentTarget.dataset.url == "app") {
      wx.reLaunch({ url: '../app/app'});
    }else {
      wx.navigateTo({ url: '../ProgressDetail/ProgressDetail?id=' + e.currentTarget.dataset.id })
    } 
  },
  login:function(){
    wx.navigateTo({
      url:'../AuthorizedLogin/AuthorizedLogin'
    })
  }
})
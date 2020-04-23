// pages/leadingView/leadview.js
const app = getApp()
import { importInterview, getJobQRCode, getImportIndex} from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navtitle:'导入面试',
    jobId:'',
    warning:-1,
    JobQRcode: '',
    opengallery: false,
    showDay:'',
    interviewList:[],
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      jobId: options.jobid,
      jobName:options.jobname,
      interviewTime: options.interviewtime ? options.interviewtime:'',
    })
    let compInfo = wx.getStorageSync('compInfo');
    let selecteDate = compInfo.interviewTime?compInfo.interviewTime.split(' ')[0]:''
    let clickIndex = wx.getStorageSync('clickIndex');
    this.getinterviewTime(selecteDate,clickIndex)
  },

  // 提交导入数据
  formOffer: function (e) {
    var that = this;
    if (that.data.interviewTime == '暂无面试时间') {
      wx.showToast({
        title: `此职位无面试时间可导! `,
        icon: 'none'
      })
      return false;
    }
    var data = e.detail.value;
    // 验证
    let phones = that.initValidate(data);
    if (phones){
      console.log('yes');
      let params = `?jobId=${that.data.jobId}&interviewTime=${that.data.interviewTime == '等待通知' ? '' : that.data.interviewTime}&phones=`;
      for(let i=0;i<phones.length;i++){
        params+=`${phones[i]},`
      }
      console.log(params);
      let trueparams = params.slice(0,-1);
      console.log(trueparams)
      importInterview(trueparams).then(rsp => {
        console.log(rsp)
        if(rsp.code==200){
          wx.showModal({
            title: '',
            showCancel: false,
            content: '导入成功，请通知面试者查看短信',
            confirmText: "知道了",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          });
        }
      })
    };
  },
  // 验证手机号格式
  initValidate:function(data){
    let that = this;
    let result=false;
    let phones = []
    var myreg = /^[1][3-9][0-9]{9}$/;
    console.log(data);
    for (let k in data){
      if(data[k]){
        if (!myreg.test(data[k])) {
          // console.log(k.split('e')[1])
          that.setData({
            warning: parseInt(k.split('e')[1])
          })
          wx.showToast({
            title: `请输入正确的手机号码! `,
            icon: 'none'
          })
          return false;
        }
        result = true;
        phones.push(data[k]);
      }
    }
    if(!result){
      console.log('请至少导入一个!')
      wx.showToast({
        title: `请至少输入一个面试者! `,
        icon: 'none'
      }) 
      return false;
    }
    return phones;
  },
  // 取消警告
  inputFocus(e) {
    this.setData({
      warning: -1
    })
  },
  // 二维码
  openGallery(e) {
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
  // 获取显示时间
  getinterviewTime(selecteDate,clickIndex){
    console.log(selecteDate,clickIndex)
    if(this.data.interviewTime == '等待通知'){
      return false;
    }
    var that = this;
    let params = { jobId: this.data.jobId }
    getImportIndex(params).then(res => {
      wx.hideLoading();
      console.log(res);
      let trueflag = false;
      if(!res.body){
        that.setData({
          interviewTime:'暂无面试时间',
        })
        return false;
      }
      // 1、寻找点击当日是否有面试
      for(let i of res.body){
        if(i.expired && i.date == selecteDate){
          trueflag = true;
          that.setData({
            interviewTime: `${i.date} ${i.time}`,
            showDay: i.week
          })
          break;
        }
      }
      // 2、寻找距离今日最近天面试
      if(!trueflag){
        console.log('222')
        for(let i=0;i<res.body.length;i++){
          if(res.body[i].expired){
            trueflag = true;
            that.setData({
              interviewTime: `${res.body[i].date} ${res.body[i].time}`,
              showDay: res.body[i].week
            })
            break;
          }
        }
      }
      console.log(trueflag,that.data.interviewTime)
      if(!trueflag){
        that.setData({
          interviewTime: '暂无面试时间',
        })
      }
    })
  },
  // 选择面试时间
  openDialog: function () {
    var that = this;
    console.log(that.data.interviewTime)
    if (that.data.interviewTime == '等待通知'){
      wx.showToast({
        title: `面试等待通知的职位，无法自动发送面试邀请，无需选择时间! `,
        icon: 'none'
      })
      return false;
    }
    if (that.data.interviewTime == '暂无面试时间') {
      wx.showToast({
        title: `此职位无面试时间可导! `,
        icon: 'none'
      })
      return false;
    }
    let dateStr = that.data.interviewTime.split(' ')[0]; 
    let params = { jobId: this.data.jobId }
    getImportIndex(params).then(res => {
      wx.hideLoading();
      console.log(res);
      let i = 0;
      res.body.map(item=>{
        item.index = i++;
        if (item.date == dateStr){
          item.checked = true;
        }
      })
      that.setData({
        interviewList:res.body,
        istrue: true
      })
    })
  },
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  },
  // 选择面试操作
  radioChange: function (e) {
    console.log(e)
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.value);

    var radioItems = this.data.interviewList;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].index == e.currentTarget.dataset.value;
    }
    var $selected = radioItems[e.currentTarget.dataset.value];
    this.setData({
      interviewTime: `${$selected.date} ${$selected.time}`,
      showDay: $selected.week,
      interviewList: radioItems,
      istrue: false
    });
  },
  // 导入结果
  importresult(){
    console.log('跳转导入结果')
    wx.redirectTo({
      url: `../../pages/leadingResult/leadingResult?jobid=${this.data.jobId}&jobname=${this.data.jobName}&interviewtime=${this.data.interviewTime}`
    })
  }
})
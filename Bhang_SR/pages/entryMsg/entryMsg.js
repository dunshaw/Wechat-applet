// pages/entryMsg/entryMsg.js
import WxValidate from '../../utils/WxValidate';
import { getrefuseEntry , getconfirmEntry} from '../../utils/api.js';
var validate;
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navtitle:'',
    desclength:0,
    time: "07:00",
    mindate:'',
    maxdate:'',
    date:'日期选择',
    isAll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      msgtype:options.info,
      isAll:options.isAll=='true'?true:false,
      msgList:JSON.parse(options.data),
      navtitle:options.info=='enterReject'?'拒绝入职':'入职时间',
      searchContent:options.search,
    })
    this.initValidate()
  },
  initValidate(){
    this.validate = new WxValidate({
      reasonForRejection:{required:true},
    },{
      reasonForRejection:{required:'请输入拒绝的原因！'},
    })
  },
  // 备注输入长度
  userdescInput(e){
    console.log("输入的内容---" + e.detail.value)
    console.log("输入的长度---" + e.detail.value.length)
    this.setData({
      desclength: e.detail.value.length
    })
  },
  // 选择日期
  bindDateChange: function (e) {
    this.setData({
        date: e.detail.value,
    })
  },
  // 选择时间
  bindTimeChange: function (e) {
    this.setData({
        time: e.detail.value,
    })
  },
  // 发送不合适
  formRefuse:function(e){
    var that = this;
    const selectdata = that.data.selectdata;
    if (!that.validate.checkForm(e.detail.value)){
      const error = that.validate.errorList[0];
      return wx.showToast({
          title: `${error.msg} `,
          icon: 'none'
      }) 
    }else{
      let formdata = e.detail.value;
      let params = {applyIds:JSON.stringify(that.data.msgList),isAll:that.data.isAll,content:formdata.reasonForRejection,searchContent:that.data.searchContent}
      getrefuseEntry(params).then(res=>{
        console.log(res)
        if(res.code == 200){
          wx.showToast({
            title:'处理成功！',
            mask:true,
            duration: 1000
          });
          setTimeout(function(){
            wx.switchTab({
              url: `../entryManagement/entryManagement`,
              success: function (e) { 
                var page = getCurrentPages().pop(); 
                if (page == undefined || page == null) return; 
                page.onLoad(); 
              } 
            }) 
          },1500)
        }else{
          wx.showToast({
            title: res.msg,
            mask:true,
            duration: 1500,
            icon: 'none'
          });
        }
      }) 
    }
  },
  //  发送入职
  entryresolve(){
    var that = this;
    if (that.data.date == '日期选择') {
      wx.showToast({
        title: `请选择正确的日期`,
        icon: 'none'
      })
      return false
    }
    let params = {entryTime:`${that.data.date} ${that.data.time}:00`,applyIds:JSON.stringify(that.data.msgList),isAll:that.data.isAll,searchContent:that.data.searchContent}
    console.log(params)
    getconfirmEntry(params).then(res=>{
        console.log(res)
        if(res.code == 200){
          wx.showToast({
            title:"处理成功！",
            mask:true,
            duration: 1000
          });
          setTimeout(function(){
            wx.switchTab({
              url: `../entryManagement/entryManagement`,
              success: function (e) { 
                var page = getCurrentPages().pop(); 
                if (page == undefined || page == null) return; 
                page.onLoad(); 
              } 
            }) 
          },1500)
        }else{
          wx.showToast({
            title: res.msg,
            mask:true,
            duration: 1500,
            icon: 'none'
          });
        }
    }) 
  },
})
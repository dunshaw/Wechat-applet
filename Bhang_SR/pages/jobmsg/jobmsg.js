// pages/msg/msg.js
import { getsendOffer,baseImgUrl} from '../../utils/api.js';
import WxValidate from '../../utils/WxValidate';
var validate;
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navtitle:"",
    info:'',
    selectdata:[],
    disabled:false,
    job:'职位名称',
    date: "日期选择",
    time: "07:00",
    mindate:'',
    maxdate:'',
    desc:'',
    desclength:0,
    offerlist:[
      {tip:'入职职位',intype:'job',disable:false,name:'',type:'',maxlength:'20',placeholder:''},
      {tip:'入职时间',intype:'datetime',disable:false,name:'time',type:'',maxlength:'20',placeholder:'请选择入职时间'},
      {tip:'入职地点',intype:'place',disable:false,name:'',type:'',maxlength:'20',placeholder:''},
      {tip:'联系人',intype:'input',disable:false,name:'entryContact',type:'',maxlength:'20',placeholder:'请输入联系人'},
      {tip:'联系电话',intype:'input',disable:false,name:'entryContactNumber',type:'number',maxlength:'11',placeholder:'请输入联系电话'},
    ],
    reexaminelist:[
      {tip:'邀约职位',tip2:'邀约职位',intype:'job',disable:false,name:'',type:'',maxlength:'20',placeholder:''},
      {tip:'复试时间',tip2:'面试时间',intype:'datetime',disable:false,name:'time',type:'',maxlength:'20',placeholder:'请选择复试时间'},
      {tip:'复试地点',tip2:'面试地点',intype:'place',disable:false,name:'',type:'',maxlength:'20',placeholder:''},
      {tip:'联系人',tip2:'联系人',intype:'input',disable:false,name:'interviewContact',type:'',maxlength:'20',placeholder:'请输入联系人'},
      {tip:'联系电话',tip2:'联系电话',intype:'input',disable:false,name:'interviewContactNumber',type:'number',maxlength:'11',placeholder:'请输入联系电话'},
    ],
    addr:'',
    // editor
    formats: {},
    bottom: 0,
    ImgList:[]
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.geteditor()
    wx.getStorage({
      key:"jobcomname",
      success:function(res){
        console.log(res)
        that.setData({
          job:res.data
        });
      },
    })
    console.log(wx.getStorageSync('compInfo'))
    that.setData({
      companyId: wx.getStorageSync('compInfo').compId,
      operaTime: wx.getStorageSync('compInfo').interviewTime?wx.getStorageSync('compInfo').interviewTime:''
    })
    wx.getStorage({
      key: "jobInfo",
      success: function (res) {
        console.log(res)
        that.setData({
          jobInfo: res.data
        })
      },
    })
    that.setData({
      navtitle: this.gettitle(options.info),
      info:options.info,
      jobid:options.jobid,
      selectdata: options.data=='isAll'?false:JSON.parse(options.data),
      mindate:this.getNowFormatDate(),
      maxdate:this.getMaxFormatDate(),
      addr: JSON.parse(options.addr),
      companyId:options.companyId?options.companyId:that.data.companyId
    });
    if(options.info=='notSuitable'){
      this.initValidate2()
    }else{
      this.initValidate()
    }
  },
  geteditor(){
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })
  },
  gettitle(data){
    switch (data){
      case 'sendOffer':
        return '发送offer'
        break
      case 'invitationToRetest':
        return '邀约复试'
        break
      case 'notSuitable':
        return '不合适'
        break
      case 'invitationInterview':
        return '邀请面试'
        break  
    }
  },
  // 验证
  initValidate(){
    if(this.data.info=='sendOffer'){
      this.validate = new WxValidate({
        entryContact:{required:true},
        entryContactNumber:{required:true,tel:true},
        desc:{required:false}
      },{
        entryContact:{required:'请输入正确的联系人！'},
        entryContactNumber:{tel:'请输入正确的联系电话！',required:'请填写手机号!'},
        desc:{required:'请输入备注信息！'},
      })
    }else{
      this.validate = new WxValidate({
        interviewContact:{required:true},
        interviewContactNumber:{required:true,tel:true},
        desc:{required:false}
      },{
        interviewContact:{required:'请输入正确的联系人！'},
        interviewContactNumber:{tel:'请输入正确的联系电话！',required:'请填写手机号!'},
        desc:{required:'请输入备注信息！'},
      })
    }
    
  },
  initValidate2(){
    this.validate = new WxValidate({
      reasonForRejection:{required:true},
    },{
      reasonForRejection:{required:'请输入不合适原因！'},
    })
  },
  // 发送offer
  formOffer:function(e){
    var that = this;
    if (that.data.date == '日期选择') {
      return wx.showToast({
        title: `请选择正确的日期`,
        icon: 'none'
      })
    }  
    
    const selectdata = that.data.selectdata;
    console.log(e.detail.value)
    if (!that.validate.checkForm(e.detail.value)){
      const error = that.validate.errorList[0];
      return wx.showToast({
          title: `${error.msg} `,
          icon: 'none'
      }) 
    }else{
      let formdata = e.detail.value;
      new Promise((resolve,reject)=>{
        if(that.data.info == 'sendOffer'){
          that.editorCtx.getContents({
            success(res) {
              console.log(res)
              let reg = new RegExp(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/)
              if (reg.test(res.text)) {
                console.log('暂不支持输入表情符号')
                reject('暂不支持输入表情符号')
              }
              formdata.desc = res.html
              resolve(formdata.desc)
            }
          })
        }else{
          resolve(formdata.desc)
        }
      }).then(resolved=>{
        that.getrequest(resolved)
        console.log(formdata.desc)
        let params;
        if(that.data.info == 'sendOffer'){
          params = {operationType:that.data.info,entryTime:`${that.data.date} ${that.data.time}:00`,entryContact:`${formdata.entryContact}`,entryContactNumber:`${formdata.entryContactNumber}`,entryRemarks:`${formdata.desc}`}
        }else{
          params = {operationType:that.data.info,interviewTime:`${that.data.date} ${that.data.time}:00`,interviewContact:`${formdata.interviewContact}`,interviewContactNumber:formdata.interviewContactNumber,interviewRemarks:`${formdata.desc}`}
        }

        console.log(selectdata)
        if(!selectdata){
          params.isAll = true
          params.jobId = `${that.data.jobid}`
          params.operaTime = `${that.data.operaTime}`
          // params+=`&isAll=true&jobId=${that.data.jobid}&operaTime=${that.data.operaTime}`
        }else{
          params.isAll = false
          params.applyIds = selectdata
          // params+=`&isAll=false`
          // for(let i=0;i<selectdata.length;i++){
          //   params+=`&applyIds=${selectdata[i]}`
          // }
        }
        params.addrId = `${that.data.addr.addrid}`
        // console.log('发送请求:',params)
        that.getrequest(params)
      }).catch(error=>{
        wx.showToast({
          title: `${error} `,
          icon: 'none'
        }) 
        return false
      })
    }
  },
  // 发送不合适
  formRefuse:function(e){
    var that = this;
    const selectdata = that.data.selectdata;
    let params;
    if (!that.validate.checkForm(e.detail.value)){
      const error = that.validate.errorList[0];
      return wx.showToast({
          title: `${error.msg} `,
          icon: 'none'
      }) 
    }else{
      let formdata = e.detail.value;
      formdata.applyIds = that.data.selectdata
      formdata.operationType = that.data.info
      console.log('发送请求:',formdata)
      params = {operationType:that.data.info,reasonForRejection:formdata.reasonForRejection}
      // let params = `?operationType=${that.data.info}&reasonForRejection=${formdata.reasonForRejection}`;
      console.log(selectdata)
      if(!selectdata){
        params.isAll = true
        params.jobId = that.data.jobid
        params.operaTime = that.data.operaTime
        // params+=`&isAll=true&jobId=${that.data.jobid}&operaTime=${that.data.operaTime}`
      }else{
        params.isAll = false
        params.applyIds = selectdata
        // params+=`&isAll=false`
        // for(let i=0;i<selectdata.length;i++){
        //   params+=`&applyIds=${selectdata[i]}`
        // }
      }
      that.getrequest(params) 
    }
  },

  getrequest(params){
    // return console.log(params)
    let that = this;
    getsendOffer(params).then(data=>{
      console.log(data)
      if(data.code==200){
        wx.showToast({
          title: '发送成功！',
          mask:true,
          duration: 1500
        });
        setTimeout(function(){
          wx.switchTab({
            url: `../home/home`,
            success: function (e) { 
              var page = getCurrentPages().pop(); 
              if (page == undefined || page == null) return; 
              page.onLoad(); 
            } 
          }) 
        },1500)
      }else{
        console.log(data.msg)
        wx.showToast({
          title: data.msg,
          mask:true,
          duration: 1500,
          icon: 'none'
        });
      }
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
  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //获取1年后的日期,maxdate
  getMaxFormatDate(){
    let today = new Date().getTime()
    let lastDay = today + 60 * 60 * 1000 * 24 * 365; 
    let lastTime = new Date(lastDay).toISOString().split('T')[0];
    return lastTime;
  },
  // 备注输入长度
  userdescInput(e){
    console.log("输入的内容---" + e.detail.value)
    console.log("输入的长度---" + e.detail.value.length)
    this.setData({
      desclength: e.detail.value.length
    })
  },
  selectplace(){
    console.log('selectplace')
    wx.navigateTo({
      url: `../address/address?info=${this.data.info}&&id=${this.data.addr.addrBvid}&&companyId=${this.data.companyId}`
    })
  },
  
  // editor
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (file) {
        wx.showModal({
          title: '上传图片',
          content: '此操作将上传图片至服务器？',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              console.log('用户点击确定')
              wx.uploadFile({
                url: baseImgUrl + "upload/images",
                filePath: file.tempFilePaths[0],
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data",
                  'accept': 'application/json'
                },
                formData: { path: 'baohang/wx' },
                success: function (rsp) {
                  console.log(rsp)
                  let pic = JSON.parse(rsp.data);
                  console.log(pic);
                  let subData = pic.body[0];
                  pic = pic.body[0].sourcePath;
                  that.editorCtx.insertImage({
                    src: baseImgUrl+pic,
                    success: function () {
                      console.log('insert image success')
                    }
                  })
                },
                fail: function (rsp) {
                  wx.showToast({
                    title: '上传失败！',
                    duration: 2000,
                    icon:'none'
                  })
                  return false
                }
              })
            }
          }
        });
      }
    })
  },
  getcontent(){
    this.editorCtx.getContents({
      success(res) {
        console.log(res)
        let reg = new RegExp(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/)
        if (reg.test(res.text)) {
          console.log('暂不支持输入表情符号')
        }
      }
    })
  },
})
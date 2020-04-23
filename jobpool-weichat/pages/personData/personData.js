// pages/personData/personData.js
const WXAPI = require('../../utils/util');
const tcity = require("../../utils/citys.js");
import { verificationCard } from '../../utils/verificationCard.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    picUrl:null,
    //姓名
    userName:'',
    //性别
    sexArray: ["男", "女"],
    showSex:false,
    sexValue:[0],
    oldSexValue:[0],
    sureSexValue:[0],
    sex:'请选择',
    //邮箱
    userEmail:'',
    //出生日期
    yearArray: [],
    monthArray:[1,2,3,4,5,6,7,8,9,10,11,12],
    dayArray:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    showdate: false,
    dateValue: [0,0,0],
    oldDateValue: [0,0,0],
    sureDateValue: [0,0,0],
    date: '请选择',
    //学历
    diplomaArray: ["初中", "高中", "中专", "大专", "本科", "硕士","博士"],
    showEC:false,
    ECValue: [0],
    oldECValue: [0],
    sureECValue: [0],
    diploma: "请选择",
    //毕业时间
    showGraduation: false,
    graduationValue: [0, 0],
    oldGraduationValue: [0, 0],
    sureGraduationValue: [0, 0],
    graduation:"请选择",
    //参加工作时间
    showJoin: false,
    JoinValue: [0, 0],
    oldJoinValue: [0, 0],
    sureJoinValue: [0, 0],
    joinWork: "请选择",
    //现居住地
    condition: false,
    oldValue:[0,0],
    value: [0, 0],
    sureValue:[0,0],
    provinces: [],
    citys: [],
    address:"请选择您的居住地",
    oldAddressCode:"",
    AddressCode:"",
    sureAddressCode:"",
    //家乡
    showHomeTown:false,
    oldHomeValue: [0, 0],
    homeValue: [0, 0],
    sureHomeValue: [0, 0],
    homeTown: "请选择您的家乡",
    oldHomeCode: "",
    HomeCode:"",
    sureHomeCode: "",

    //毕业院校
    school:'',
    //工作单位
    workCompany:'',
    //headImg:'',
    //nameValue:'',
    //genderVlaue:'',
    sourceIn:'',
    userFjCardId:'',
    renzhengFjCardId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    let year = [];

    //年份列表
    for (var i = 1970; i <= new Date().getFullYear(); i++) {
      year.push(i);
    }
    //省市区地址、初始化地址
    tcity.init(that);
    let cityData = that.data.cityData;
    const provinces = [];
    const citys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i]);
    }
    WXAPI.getUserInfo().then(function(res){
      var showsextip = that.data.sex;
      console.log(res.body)
      if(res.body.sex == 'male'){
        showsextip = '男'
      }else if (res.body.sex == 'female'){
        showsextip = '女'
      }
      console.log(wx.getStorageSync('sourceIn'))
      that.setData({
        userName: options.firstname?'':res.body.name,
        picUrl: res.body.avatar,
        sex: showsextip,
        userEmail: res.body.email,
        date: res.body.birthday ? res.body.birthday.split(' ')[0]:'',
        diploma: res.body.recordOfFormalSchoolingName,
        graduation: res.body.graduationTime,
        joinWork: res.body.participatingInWorkTime,
        address: res.body.areaName,
        homeTown: res.body.homeName,
        sureAddressCode: res.body.areaCode,
        sureHomeCode: res.body.homeCode,
        HomeCode: res.body.homeCode,
        school: res.body.graduatedSchool,
        workCompany: res.body.originalUnitOrCurrentUnit,
        userFjCardId: res.body.userFjCardId,
        useryear:res.body.userFjCardId.substring(6, 10),
        renzhengFjCardId:res.body.userFjCardId.replace(/^(.{1})(?:\d+)(.{1})$/,"$1*************$2"),
        userFjCardFlag: res.body.userFjCardId?true:false,
        sourceIn:wx.getStorageSync('sourceIn'),
        fjAuthStatus:res.body.fjAuthStatus==1?true:false
      })
    })
    that.setData({
      yearArray: year.reverse(),
      provinces: provinces,
      citys: citys
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
  //头像上传
  chooseImage: function () {
    var openid = wx.getStorageSync("openid");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        wx.uploadFile({
          url: WXAPI.imgIp + "/upload/images", //此处换上你的接口地址
          filePath: tempFilePaths,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json'
          },
          formData: { path: 'baohang/wx' },
          success: function (res) {
            let pic = JSON.parse(res.data);
            pic = pic.body[0].sourcePath;
            that.setData({
              picUrl: pic,
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '上传失败！',
              duration: 2000
            })
          },
        })
      }
    })
  },
  //姓名填写
  inputUserName:function(e){
    console.log(e.detail.value)
    let that = this;
    let userName = e.detail.value;
    if(userName.length>25){
      userName = userName.slice(0,24)
    }
    console.log(userName);
    that.setData({
      userName: userName
    })
  },
  //性别选择
  openSex:function(){
    let that = this;
    //let val = that.data.oldSexValue;
    that.setData({
      showSex: !that.data.showSex
      //oldSexValue: val,
    })
  },
  openSex_cancle:function(){
    let that = this;
    that.setData({
      showSex: !that.data.showSex,
      sureSexValue: that.data.oldSexValue,
      sex: that.data.sex,
    })
  },
  openSex_sure:function(){
    let that = this;
    let sex = that.data.sexArray[that.data.sexValue[0]];
    if (sex == null || sex == undefined || sex == "") {
      that.setData({
        showSex: !that.data.showSex,
        sureSexValue: that.data.sexValue,
        oldSexValue: that.data.sexValue,
        sex: "请选择",
      })
    }else{
      that.setData({
        showSex: !that.data.showSex,
        sureSexValue: that.data.sexValue,
        oldSexValue: that.data.sexValue,
        sex: sex
      });
    }
    console.log(that.data.sureSexValue); 
  },
  bindChangeSex:function(e){
    let that = this;
    let val = e.detail.value
    that.setData({
      sexValue: val
    })
  },
  //邮箱填写
  inputEmail:function(e){
    let that = this;
    let userEmail = e.detail.value;
    console.log(userEmail);
    that.setData({
      userEmail: userEmail
    })
  },
  //出生日期选择
  openDate:function(){
    let that = this;
    that.setData({
      showdate: !that.data.showdate
    })
  },
  openDate_cancle:function(){
    let that = this;
    that.setData({
      showdate: !that.data.showdate,
      sureDateValue: that.data.oldDateValue,
      date: that.data.date,
    })
  },
  openDate_sure:function(){
    let that = this;
    let date = that.data.yearArray[that.data.dateValue[0]] + "-" + (that.data.monthArray[that.data.dateValue[1]] < 10 ? "0" + that.data.monthArray[that.data.dateValue[1]] : that.data.monthArray[that.data.dateValue[1]]) + "-" + (that.data.dayArray[that.data.dateValue[2]] < 10 ? "0" + that.data.dayArray[that.data.dateValue[2]] : that.data.dayArray[that.data.dateValue[2]]);
    
    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    // m < 10 ? m = '0' + m : m;
    // d < 10 ? d = '0' + d : d;
    if (y == that.data.yearArray[that.data.dateValue[0]] && m < that.data.monthArray[that.data.dateValue[1]]){
      wx.showToast({
        title:'不能超过当前的时间',
        icon:'none'
      })
      return;
    }
    if (y == that.data.yearArray[that.data.dateValue[0]] && m <= that.data.monthArray[that.data.dateValue[1]] && d < that.data.dayArray[that.data.dateValue[2]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showdate: !that.data.showdate,
      sureDateValue: that.data.dateValue,
      oldDateValue: that.data.dateValue,
      date: date
    });
  },
  bindChangeDate:function(e){
    let that = this;
    let val = e.detail.value;
    let year = that.data.yearArray[val[0]];
    let month = that.data.monthArray[val[1]];
    if (month == 2) {
      if ((year % 4 == 0) && (year % 400 == 0 || year % 100 != 0)) {
        that.setData({
          dayArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
        })
      } else {
        that.setData({
          dayArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
        })
      }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      that.setData({
        dayArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
      })
    } else {
      that.setData({
        dayArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
      })
    }
    that.setData({
      dateValue: val
    })
  },
  //学历选择
  openEC: function () {
    let that = this;
    that.setData({
      showEC: !that.data.showEC
    })
  },
  openEC_cancle: function () {
    let that = this;
    that.setData({
      showEC: !that.data.showEC,
      sureECValue: that.data.oldECValue,
      diploma: that.data.diploma,
    })

  },
  openEC_sure: function () {
    let that = this;
    let diploma = that.data.diplomaArray[that.data.ECValue[0]];
    if (diploma == null || diploma == undefined || diploma == "") {
      that.setData({
        showEC: !that.data.showEC,
        sureECValue: that.data.ECValue,
        oldECValue: that.data.ECValue,
        diploma: "请选择",
      })
    } else {
      that.setData({
        showEC: !that.data.showEC,
        sureECValue: that.data.ECValue,
        oldECValue: that.data.ECValue,
        diploma: diploma
      })
    }
    console.log(that.data.sureECValue);
  },
  bindChangeEC: function (e) {
    let that = this;
    let val = e.detail.value;
    that.setData({
      ECValue: val
    })
  },
  //毕业时间展示
  openGra: function () {
    let that = this;
    that.setData({
      showGraduation: !that.data.showGraduation
    })
  },
  openGra_cancle: function () {
    let that = this;
    that.setData({
      showGraduation: !that.data.showGraduation,
      sureGraduationValue: that.data.oldGraduationValue,
      graduation: that.data.graduation
    })
  },
  openGra_sure: function () {
    let that = this;
    let date = that.data.yearArray[that.data.graduationValue[0]] + "-" + (that.data.monthArray[that.data.graduationValue[1]] < 10 ? "0" + that.data.monthArray[that.data.graduationValue[1]] : that.data.monthArray[that.data.graduationValue[1]]);

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.yearArray[that.data.graduationValue[0]] && m < that.data.monthArray[that.data.graduationValue[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showGraduation: !that.data.showGraduation,
      sureGraduationValue: that.data.graduationValue,
      oldGraduationValue: that.data.graduationValue,
      graduation: date
    });
  },
  bindChangeGra: function (e) {
    let that = this;
    let val = e.detail.value
    that.setData({
      graduationValue: val
    })
  },
  //参加工作时间展示
  openJoinWork: function () {
    let that = this;
    that.setData({
      showJoin: !that.data.showJoin
    })
  },
  openJoin_cancle: function () {
    let that = this;
    that.setData({
      showJoin: !that.data.showJoin,
      sureJoinValue: that.data.oldJoinValue,
      joinWork: that.data.joinWork
    })
  },
  openJoin_sure: function () {
    let that = this;
    let date = that.data.yearArray[that.data.JoinValue[0]] + "-" + (that.data.monthArray[that.data.JoinValue[1]] < 10 ? "0" + that.data.monthArray[that.data.JoinValue[1]] : that.data.monthArray[that.data.JoinValue[1]]);

    //获取现在的时间用来比较
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    if (y == that.data.yearArray[that.data.JoinValue[0]] && m < that.data.monthArray[that.data.JoinValue[1]]) {
      wx.showToast({
        title: '不能超过当前的时间',
        icon: 'none'
      })
      return;
    }

    that.setData({
      showJoin: !that.data.showJoin,
      sureJoinValue: that.data.JoinValue,
      oldJoinValue: that.data.JoinValue,
      joinWork: date
    });
  },
  bindChangeJoin: function (e) {
    let that = this;
    let val = e.detail.value;
    that.setData({
      JoinValue: val
    })
  },
  //现居住地选择
  openCity: function () {
    let that = this;
    that.setData({
      condition: !that.data.condition
    })
  },
  openCity_cancle: function () {
    let that = this;
    that.setData({
      condition: !that.data.condition,
      sureValue: that.data.oldValue,
      sureAddressCode: that.data.oldAddressCode,
      address: that.data.address
    })
  },
  openCity_sure: function () {
    let that = this;
    let address = that.data.provinces[that.data.value[0]] + that.data.citys[that.data.value[1]].name;
    console.log(that.data.value[0])
    that.setData({
      condition: !that.data.condition,
      sureValue: that.data.value,
      oldValue: that.data.value,
      sureAddressCode: that.data.AddressCode,
      oldAddressCode: that.data.AddressCode,
      address: address,
      homeValue: that.data.value
    });
  },
  bindChangeCity: function (e) {
    let that = this;
    let val = e.detail.value;
    let a = val[0], b = val[1]; 
    console.log(e);
    let cityData = that.data.cityData;
    let citys = [];
    for (let i = 0; i < cityData[a].sub.length; i++) {
      citys.push(cityData[a].sub[i]);
    }
    console.log(citys[b].code); ///获取选中城市code
    that.setData({
      value: val,
      citys: citys,
      AddressCode: citys[b].code
    })
  },
  //家乡
  openHomeTown: function () {
    let that = this;
    that.setData({
      showHomeTown: !that.data.showHomeTown
    })
  },
  openHome_cancle: function () {
    let that = this;
    that.setData({
      showHomeTown: !that.data.showHomeTown,
      sureHomeValue: that.data.oldHomeValue,
      sureHomeCode: that.data.oldHomeCode,
      homeTown: that.data.homeTown
    })
  },
  openHome_sure: function () {
    let that = this;
    let homeTown = that.data.provinces[that.data.homeValue[0]] + that.data.citys[that.data.homeValue[1]].name;
    that.setData({
      showHomeTown: !that.data.showHomeTown,
      sureHomeValue: that.data.homeValue,
      oldHomeValue: that.data.homeValue,
      sureHomeCode: that.data.HomeCode,
      oldHomeCode: that.data.HomeCode,
      homeTown: homeTown
    });
    console.log(that.data.HomeCode)
  },
  bindChangeHome: function (e) {
    let that = this;
    let val = e.detail.value;
    let a = val[0],b=val[1];
    let cityData = that.data.cityData;
    let citys = [];
    for (let i = 0; i < cityData[a].sub.length; i++) {
      citys.push(cityData[a].sub[i]);
    }
    console.log(citys[b].code);///获取选中城市code
    that.setData({
      homeValue: val,
      citys: citys,
      HomeCode: citys[b].code
    })
  },

// 毕业院校
  school:function(e){
    let that = this;
    let school = e.detail.value;
    that.setData({
      school: school
    })
  },
  // 身份证号
  inputFjCardId:function (e) {
    let that = this;
    let Id = e.detail.value;
    console.log(Id)
    that.setData({
      userFjCardId: Id,
      useryear:Id.substring(6, 10),
      renzhengFjCardId:Id.replace(/^(.{4})(?:\d+)(.{4})$/,"$1*************$2"),
    })
  },
  // 工作单位
  workCompany:function(e){
    let that = this;
    let workCompany = e.detail.value;
    that.setData({
      workCompany: workCompany
    })
  },
  submitForm:function(){
    let that = this;
    console.log(that.data.userName);
    let sex = that.data.sex == "请选择" ? "" : (that.data.sex == "男"?"male":"female");
    let education = "";
    var nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    switch (that.data.diploma) {
      case "请选择":
        education ="";
        break;
      case "小学":
        education = "primary";
        break;
      case "初中":
        education = "juniorHigh";
        break;
      case "高中":
        education = "high";
        break;
      case "中专":
        education = "technicalSecondary";
        break;
      case "大专":
        education = "juniorCollege";
        break;
      case "本科":
        education = "regularCollege";
        break;
      case "硕士":
        education = "master";
        break;
      case "博士":
        education = "doctor";
        break;
    }
    // if (that.data.picUrl == null){
    //   wx.showToast({
    //     title: '头像是必填项',
    //     icon: 'none'
    //   })
    //   return;
    // }
    console.log(that.data.date, that.data.sourceIn)
    if(that.data.userName == ''){
      wx.showToast({
        title:'姓名是必填项',
        icon:'none'
      })
      return;
    }else if(sex == ''){
      wx.showToast({
        title: '性别是必填项',
        icon: 'none'
      })
      return;
    } else if (that.data.sourceIn == 2  || that.data.userFjCardFlag){
      let idcard = that.data.userFjCardId;
      console.log(verificationCard(idcard))
      if (!verificationCard(idcard)){
          wx.showToast({
            title: '请检查身份证是否填写正确',
            icon: 'none'
          })
          return;
      }else{
        let birth = idcard.substring(6, 10) + "-" + idcard.substring(10, 12) + "-" + idcard.substring(12, 14);
        console.log(birth)
        that.setData({
          date:`${birth} 00:00:00`
        })
      }
    } else if (that.data.date == '' && that.data.sourceIn == 1) {
      wx.showToast({
        title: '出生日期是必填项',
        icon: 'none'
      })
      return;
    }else if (education == ''){
      wx.showToast({
        title: '学历是必填项',
        icon: 'none'
      })
      return;
    }
    console.log({ name: that.data.userName, sex: sex, avatar: that.data.picUrl, position: "", email: that.data.userEmail, birthday: that.data.date ? that.data.date.split(' ')[0] : '', education: education, graduationTime: that.data.graduation, participatingInWorkTime: that.data.joinWork, areaCode: that.data.sureAddressCode, homeCode: that.data.sureHomeCode, graduatedSchool: that.data.school, originalUnitOrCurrentUnit: that.data.workCompany, fjCardId: that.data.userFjCardId })

    if (!nameReg.test(that.data.userName)) {
      wx.showModal({
        title: '提示',
        content: '姓名中包含非常规字符，是否保存？',
        success: function (res) {
          if (res.confirm) {  
            console.log('点击确认回调')
            that.resumeSave(sex,education)
          } else {   
            console.log('点击取消回调')
            return false;
          }
        }
      })
    }else{
      that.resumeSave(sex,education)
    }
    
  },
  resumeSave(sex,education){
    var that = this;
    WXAPI.resumeUpdate({ 
      name: that.data.userName, 
      sex: sex, 
      avatar: that.data.picUrl == null ? '' : that.data.picUrl, 
      position: "", 
      email: that.data.userEmail == null ? '' : that.data.userEmail, 
      birthday: that.data.date ? that.data.date.split(' ')[0]:'', 
      education: education, 
      graduationTime: that.data.graduation == null ? '' : that.data.graduation, 
      participatingInWorkTime: that.data.joinWork == null ? '' : that.data.joinWork, 
      areaCode: that.data.sureAddressCode == null ? '' : that.data.sureAddressCode, 
      homeCode: that.data.sureHomeCode == null ? '' : that.data.sureHomeCode, 
      graduatedSchool: that.data.school == null ? '' : that.data.school, 
      originalUnitOrCurrentUnit: that.data.workCompany == null ? '' : that.data.workCompany, 
      fjCardId: that.data.userFjCardId == null ? '' : that.data.userFjCardId
      }).then(function (res) {
      // console.log({ name: that.data.userName, sex: sex, avatar: that.data.picUrl, position: "", email: that.data.userEmail, birthday: that.data.date, education: education, graduationTime: that.data.graduation, participatingInWorkTime: that.data.joinWork, areaCode: that.data.sureAddressCode, homeCode: that.data.sureHomeCode })
      console.log(res);
      if(res.status){
        wx.setStorageSync('requiedInformation', true);
        wx.showToast({
          title: '保存成功！',
          icon: 1
        })
        wx.switchTab({
          url: '/pages/person/person'
        })
      }
    });
  },
})
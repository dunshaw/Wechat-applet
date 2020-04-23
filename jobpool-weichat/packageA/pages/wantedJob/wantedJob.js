// pages/wantedJob/wantedJob.js
const WXAPI = require('../../../utils/util');
const tcity = require("../../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    //现居住地
    condition: false,
    oldValue: [0, 0],
    value: [0, 0],
    sureValue: [0, 0],
    provinces: [],
    citys: [],
    oldCitys:[],
    address: "请选择",
    oldAddressCode: 110000,
    AddressCode: 110000,
    sureAddressCode: 110000,
    isGetBack:false,

    //期望行业
    hyisShow: false,
    hyList: [],
    truehy:[0],
    qiwanghy:'请选择',
    expectIndustry1:"",
    hyid:[],

   
    //选择期望行业返回值
    btnArray:[],
    parent:[],
    //显示期望行业
    qiwanghangye:"请选择",
    qiwangzhiwei: "请选择",


    //薪资
    showSalary: false,
    oldSalary: [0, 0],
    Salary: [0, 0],
    sureSalary: [0, 0],
    minSalary: [],
    maxSalary: [2000],
    wantSalary: "请选择",
    minExpectSalary:"",
    maxExpectSalary:"",


    //求职状态
    showStatus: false,
    oldStatus: [0],
    status: [0],
    sureStatus: [0],
    statusList: ["随时到岗", "月内到岗", "考虑机会","暂不跳槽"],
    userStatus: "请选择",

    isone: true    //是否是第一次进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //省市区地址、初始化地址
    tcity.init(that);
    let cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    let minSalary = []
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i]);
    }
    for (let i = 0; i < 29; i++) {
      let a;
      if(i<25){
        a = i * 1000 +1000;
      }else{
        a = 25000 + (i-24)*5000;
      }
      minSalary.push(a);
    }
    if (!wx.getStorageSync('tokenfalse')){
      that.setData({
        isone: false
      })
    }
    that.setData({
      provinces: provinces,
      citys: citys,
      minSalary: minSalary,
    })
    WXAPI.getJobHuntingIntention().then(function (res) {
      console.log(res)
      if(res.body){
        if (res.body.expectIndustry) {
          var hy = res.body.expectIndustry;
          var zw = res.body.expectPosition;
          that.data.sureAddressCode = res.body.expectWorkPlace;
          var zt = res.body.jobStatus;
          var ztShow = ''
          var xz = res.body.minExpectSalary + '-' + res.body.maxExpectSalary;
          WXAPI.industryController().then(function (res) {
            console.log(res)
            for (let i = 0; i < res.body.length; i++) {
              if (res.body[i].id == hy) {
                that.data.qiwanghy = res.body[i].name
              }
              that.data.hyList.push(res.body[i].name)
              that.data.hyid.push(res.body[i].id)
            };
            switch (zt) {
              case 'lookingJob':
                ztShow = that.data.statusList[0];
                break;
              case 'considerChangingJob':
                ztShow = that.data.statusList[1];
                break;
              case 'betterOpportunitiesMayAlsoBeConsidered':
                ztShow = that.data.statusList[2];
                break;
              case 'noPlanToChangeJobTemporarily':
                ztShow = that.data.statusList[3];
                break;
            };
            var gzdarr = [];
            for (let i = 0; i < cityData.length; i++) {
              console.log(that.data.sureAddressCode)
              if (cityData[i].code.substring(0, 2) == that.data.sureAddressCode.substring(0, 2)) {
                gzdarr = cityData[i].sub
              }
            }
            for (let i = 0; i < gzdarr.length; i++) {
              if (gzdarr[i].code == that.data.sureAddressCode) {
                that.data.address = gzdarr[i].name
              }
            }
            that.setData({
              address: that.data.address,
              qiwanghy: that.data.qiwanghy,
              qiwangzhiwei: zw,
              wantSalary: xz,
              userStatus: ztShow,
              hyList: that.data.hyList,
              minExpectSalary: xz.split('-')[0],
              maxExpectSalary: xz.split('-')[1],
              expectIndustry1: hy
            })
            console.log(that.data.minExpectSalary, that.data.maxExpectSalary)
          })
        }
      } else {
        WXAPI.industryController().then(function (res) {
          console.log(res)
          for (let i = 0; i < res.body.length; i++) {
            that.data.hyList.push(res.body[i].name)
            that.data.hyid.push(res.body[i].id)
          };
          that.setData({
            hyList: that.data.hyList
          })
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
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (that.data.isGetBack) {
      let qiwanghangye = "", qiwangzhiwei = "";
      for (let i in that.data.parent){
        let a = that.data.parent
        if(i>=a.length){
          qiwanghangye += a[i].name;
        }else{
          qiwanghangye += a[i].name +"、";
        }
      }
      for (let o in that.data.btnArray) {
        let a = that.data.btnArray
        if (o >= a.length) {
          qiwangzhiwei += a[o].name;
        } else {
          qiwangzhiwei += a[o].name + "、";
        }
      }
      that.setData({
        qiwanghangye: qiwanghangye,
        qiwangzhiwei: qiwangzhiwei
      })
    }
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
  skip:function(){
    wx.switchTab({
      url: '../../../pages/app/app'
    })
  },
  jump:function(e){
    if (e.currentTarget.dataset.url == "jobIntent") {
      wx.navigateTo({ url: '../jobIntent/jobIntent' });
    }
  },
  //现居住地选择
  openCity: function () {
    let that = this;
    that.setData({
      condition: !that.data.condition,
      oldCitys:that.data.citys,
    })
    console.log(that.data.value, that.data.oldValue,that.data.sureValue);
  },
  openCity_cancle: function () {
    let that = this;
    that.setData({
      condition: !that.data.condition,
      sureValue: that.data.oldValue,
      sureAddressCode: that.data.oldAddressCode,
      citys: that.data.oldCitys,
      address: that.data.address
    })
    console.log(that.data.value, that.data.oldValue,that.data.sureValue);
  },
  openCity_sure: function () {
    let that = this;
    let address = that.data.provinces[that.data.value[0]] + that.data.citys[that.data.value[1]].name;
    that.setData({
      condition: !that.data.condition,
      sureValue: that.data.value,
      oldValue: that.data.value,
      sureAddressCode: that.data.AddressCode,
      oldAddressCode: that.data.AddressCode,
      address: address,
      oldCitys: that.data.citys
    });
    console.log(address,that.data.AddressCode);
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
    console.log(that.data.value, that.data.oldValue, that.data.sureValue);
  },

  //期望行业
  openhy: function(){
    let that = this;
    that.setData({
      hyisShow: !that.data.hyisShow,
    })
  },
  openHY_cancle:function(){
    let that = this;
    that.setData({
      hyisShow: !that.data.hyisShow,
      truehy:that.data.truehy,
      qiwanghy: that.data.qiwanghy
    })
  },
  openHY_sure:function(){
    let that = this;
    that.setData({
      hyisShow: !that.data.hyisShow,
      qiwanghy: that.data.hyList[that.data.truehy[0]],
      expectIndustry1: that.data.hyid[that.data.truehy[0]]
    })
  },
  bindChangeHY:function(e){
    let that = this;
    that.data.truehy = e.detail.value
  },
  //薪资选择
  openSalary: function () {
    let that = this;
    that.setData({
      showSalary: !that.data.showSalary,
    })
  },
  openSalary_cancle: function () {
    let that = this;
    that.setData({
      showSalary: !that.data.showSalary,
      sureSalary: that.data.oldSalary,
      wantSalary: that.data.wantSalary
    })
  },
  openSalary_sure: function () {
    let that = this;
    let wantSalary = that.data.minSalary[that.data.Salary[0]] +"-"+ that.data.maxSalary[that.data.Salary[1]];
    console.log(that.data.minSalary[that.data.Salary[0]], that.data.Salary[0])
    if(that.data.Salary[0] == 0 && that.data.Salary[1] == 0){
      wantSalary ="面议"
    }
    that.setData({
      showSalary: !that.data.showSalary,
      sureSalary: that.data.Salary,
      oldSalary: that.data.Salary,
      wantSalary: wantSalary,
      minExpectSalary: that.data.minSalary[that.data.Salary[0]],
      maxExpectSalary: that.data.maxSalary[that.data.Salary[1]]
    });
  },
  bindChangeSalary: function (e) {
    console.log(e)
    let maxSalary=[];
    let that = this;
    let val = e.detail.value;
    let minSalary = this.data.minSalary[val[0]]
    for (let i = val[0]; i < 30; i++) {
      let a;
      if(i<24){
        a = i * 1000 + 2000;
      }else{
        a = 25000 + (i-23)*5000;
      }
      if(a>50000){
        break
      }else if(a > minSalary*2){
        break
      }
      maxSalary.push(a);
    }
    that.setData({
      Salary: val,
      maxSalary:maxSalary
    })
    console.log(val)
  },
  //求职状态
  openStatus: function () {
    let that = this;
    that.setData({
      showStatus: !that.data.showStatus,
    })
  },
  openStatus_cancle: function () {
    let that = this;
    that.setData({
      showStatus: !that.data.showStatus,
      sureStatus: that.data.oldStatus,
      userStatus: that.data.userStatus
    })
  },
  openStatus_sure: function () {
    let that = this;
    let userStatus = that.data.statusList[that.data.status[0]];
    console.log(userStatus)
    that.setData({
      showStatus: !that.data.showStatus,
      sureStatus: that.data.status,
      oldStatus: that.data.status,
      userStatus: userStatus,
    });
  },
  bindChangeStatus: function (e) {
    let that = this;
    let val = e.detail.value;
    console.log(val)
    that.setData({
      status: val,
    })
  },
  keepSelected: function (e) {
    let that = this;
    console.log(that.data.sureAddressCode)
    // let expectIndustry = that.data.parent[0].id;
    // minExpectSalary = that.data.minSalary[that.data.sureSalary[0]], maxExpectSalary = that.data.maxSalary[that.data.sureSalary[1]],
    let jobTypeIds = [], jobStatus="";
    for(let i in that.data.btnArray){
      jobTypeIds.push(that.data.btnArray[i].id);
    }
    switch (that.data.userStatus) {  //[, "在职-正考虑换工作", "在职-有更好的机会也可以考虑", "在职-暂时无跳槽打算"],
      case "请选择":
        jobStatus = "";
        break;
      case "随时到岗":
        jobStatus = "lookingJob";
        break;
      case "月内到岗":
        jobStatus = "considerChangingJob";
        break;
      case "考虑机会":
        jobStatus = "betterOpportunitiesMayAlsoBeConsidered";
        break;
      case "暂不跳槽":
        jobStatus = "noPlanToChangeJobTemporarily";
        break;
    }

    if (that.data.address == "请选择" || that.data.qiwanghy == "请选择" || that.data.qiwangzhiwei == '请选择' || that.data.wantSalary == "请选择" || that.data.userStatus == "请选择"){
      console.log(jobTypeIds)
      wx.showModal({
        title:'提示',
        content: '请完整填写必填内容',
        showCancel: false
      })
    }else{
      WXAPI.saveJobHuntingIntention({ expectWorkPlace: that.data.sureAddressCode, expectIndustry: that.data.expectIndustry1, jobTypeIds: jobTypeIds, minExpectSalary: that.data.minExpectSalary, maxExpectSalary: that.data.maxExpectSalary, jobStatus: jobStatus }).then(function (res) {
        console.log(jobTypeIds)
        wx.removeStorageSync('tokenfalse')
        let pages = getCurrentPages();
        let currPage = null;
        // console.log(pages) 的到一个数组
        if (pages.length) {
          // 获取当前页面的前以页面的对象
          currPage = pages[pages.length - 2];
        }
        // 获取当前页面的前一页面的路由
        let route = currPage.route
        console.log(route)
        wx.reLaunch({
          url: '../../../pages/app/app'
        })
      })
    }
  },
})
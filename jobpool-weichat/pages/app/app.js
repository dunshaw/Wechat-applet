// pages/app/app.js
const app = getApp();
const WXAPI = require('../../utils/util');
const tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabFixed: false,
    showToPerfect:false,
    sureThisValue:false,
    imgIp: WXAPI.imgIp,
    bannerList:[],
    articleList:[],
    city:'',
    cityCode:'',
    regionList:[],
    labelList:[],
    timeList:[],
    lat:'',
    lng:'',
    pageNum:1,
    pageSize:10,
    contentList:[],
    TopcontentList:[],
    choiceRegionCode:'',
    selectShow:1,
    jobTrait:[],
    traitList:[
      {value:'scene',name:'现场直面会',checked:false},
      {value:'online',name:'在线直聘',checked:false},
      {value:'isGeneral',name:'普工专栏',checked:false},
      {value:'isJobShared',name:'人才共享',checked:false}
    ],
    diploma:[],
    minSalary:'',
    maxSalary:'',
    order:'auto',
    interViewTime:'0',
    selectedName: '', //选中的名字
    nothing: false,
    noposition: false,   //用户拒绝定位
    lscode:'' ,
    wantjobFlag:true,
    floatFlag:false,
    ejectFlag:false,
    windowHeight: '',
    windowWidth:'',
    movableWidth:'',
    x:'',
    y:350,
    ejectInfo:{},
    floatInfo:{},
    diplomaList:[
      {value:'no',name:'不限',checked:false},{value:'juniorHigh',name:'初中',checked:false},{value:'high',name:'高中',checked:false},{value:'technicalSecondary',name:'中专',checked:false},{value:'juniorCollege',name:'大专',checked:false},{value:'regularCollege',name:'本科',checked:false},{value:'master',name:'硕士',checked:false},{value:'doctor',name:'博士',checked:false}
    ],
    low: 0,
    heigh:46,
    closeEject:false,
    salarytext:'不限'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    tcity.init(that);
    let tokenflag = wx.getStorageSync('requiedInformation');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth:res.windowWidth,
          x:(res.windowWidth)*0.97,
          movableWidth:(res.windowWidth)*0.97
        });
      }
    });
    // console.log(options);
    if (!tokenflag) {
      try {
        wx.removeStorageSync('token')
      } catch (e) {
        // Do something when catch error
      }
    }
    that.selfonLoad(options)
    
  },

  selfonLoad(options){
    var that = this;
    //获取定位地址
    if (options.code){
      that.setData({
        city: options.cityname,
        cityCode: options.code
      })
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude;
          const longitude = res.longitude;
          that.setData({
            noposition: false,
            lat: latitude,
            lng: longitude
          });
          that.choicecity()
        },
        fail: function (res) {
          // console.log(res)
          wx.showToast({
            title: '获取定位失败',
            icon: 'none',
            duration: 2000
          })
          that.choicecity()
        },
      })
    }else{
      // console.log('nononoo')
      that.getlocaldata()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let floatFlag = wx.getStorageSync('floatFlag')==" "?wx.getStorageSync('floatFlag'):true
    let ejectFlag = wx.getStorageSync('ejectFlag')==" "?wx.getStorageSync('ejectFlag'):true
    // console.log(floatFlag,ejectFlag)
    if(floatFlag){
      that.getadvertise('floatType')
    }
    if(ejectFlag){
      that.getadvertise('ejectType')
    }
    if(that.data.wantjobFlag){
      WXAPI.getJobHuntingIntention().then(function (res) {
        // console.log(res)
        if(res.code==200){
          if(res.body.expectIndustry && res.body.maxExpectSalary && res.body.minExpectSalary && res.body.expectPositionId  && res.body.expectWorkPlace && res.body.jobStatus ){
              that.setData({wantjobFlag:false})
          }
        }
      })
    }
    // that.setData({
    //   pageNum: 1
    // })
    // that.choicecity()
    

  },
  // 悬浮图获取、弹窗获取
  getadvertise(type){
    let that = this;
    let params = {target:'seeker',type:type}
    WXAPI.getAdvertise(params).then(res=>{
      console.log(res)
      if(res.body==null){
        return false
      }
      if(res.body.type == "ejectType"){
        that.setData({ejectInfo:res.body,ejectFlag:true})
        setTimeout(()=>{
          that.setData({closeEject:true})
        },3000)
      }else{
        that.setData({floatInfo:res.body,floatFlag:true})
      }
    })
  },
  getlocaldata(){
    var that = this;
    let cityData = that.data.cityData;
    let token = wx.getStorageSync('token');
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.setData({
          noposition: false,
          lat: latitude,
          lng: longitude
        });
        WXAPI.getJobHuntingIntention().then(function (res) {
          console.log(res)
          if(res.body.expectIndustry && res.body.maxExpectSalary && res.body.minExpectSalary && res.body.expectPositionId  && res.body.expectWorkPlace && res.body.jobStatus ){
            that.setData({wantjobFlag:false})
          }
          if(res.body.expectWorkPlace && token){
            var gzdarr = [];
            var showaddress=''
            for (let i = 0; i < cityData.length; i++) {
              // console.log(res.body.expectWorkPlace)
              if (cityData[i].code.substring(0, 2) == res.body.expectWorkPlace.substring(0, 2)) {
                gzdarr = cityData[i].sub
              }
            }
            for (let i = 0; i < gzdarr.length; i++) {
              if (gzdarr[i].code == res.body.expectWorkPlace) {
                showaddress = gzdarr[i].name
              }
            }
            that.setData({
              cityCode: res.body.expectWorkPlace,
              city: showaddress,
              choiceRegionCode: res.body.expectWorkPlace
            });
            that.choicecity()
          }else{
            // console.log('notoken')
            wx.request({
              url: 'https://restapi.amap.com/v3/geocode/regeo?key=fc27adfe9b36e3c6dd12d13de6218d22&location=' + longitude + ',' + latitude + '& output=JSON',
              data: {},
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                that.setData({
                  cityCode: res.data.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                  city: res.data.regeocode.addressComponent.city,
                  choiceRegionCode: res.data.regeocode.addressComponent.adcode.substr(0, 4) + '00'
                });
                that.choicecity()
              },
              fail: function (res) {
                // console.log(res)
                wx.showToast({
                  title: '获取定位失败',
                  icon: 'none',
                  duration: 2000
                })
              },
            })
          }
        })
      },
      fail(res) {
        that.setData({
          noposition: true
        })
      }
    });
  },
  onPageScroll:function(e){
    // var scrollTop = e.scrollTop;
    // if(scrollTop>=316 && !this.data.tabFixed){
    //   this.setData({tabFixed:true})
    // } 
    // if (scrollTop < 316 && this.data.tabFixed) {
    //   this.setData({ tabFixed: false })
    // }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.setStorageSync('floatFlag', true);
    // wx.setStorageSync('ejectFlag', true);
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
    that.cancelAllLable()
    that.getlocaldata()
    that.setData({
      pageNum: 1,
      order: 'auto',
      interViewTime: '0',
      selectedName: '', //选中的名字
      choiceRegionCode: '',
      triggered: false,
      selectShow:'',
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    // console.log(that.data.pageNum)
    let pageNub = that.data.pageNum + 1;

    let labelArr = that.data.labelList;
    let sureLabelArr = [];
    let labelId_str = ''
    let trait_str = ''
    let areaCode = that.data.choiceRegionCode;
    for (let i in labelArr) {
      if (labelArr[i].isChecked == true) {
        sureLabelArr.push(labelArr[i].id);
      }
    }

    for (let i in that.data.jobTrait) {
      trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
    }
    for (let i in sureLabelArr) {
      labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
    }
    if (that.data.choiceRegionCode == that.data.cityCode) {
      areaCode = '';
    }
    let interViewTime = ''
    if (that.data.interViewTime == '0') {
      interViewTime = '';
    } else {
      interViewTime = that.data.interViewTime + " 00:00:00";
    }
    let diplomalist = that.data.diploma
    let diploma_str = ''
    for (let i in diplomalist) {
      diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
    }
    WXAPI.indexList({ cityCode: that.data.cityCode, areaCode: areaCode, labelId: labelId_str, order: that.data.order, interViewTime: interViewTime, educationList: diploma_str, salaryMin: that.data.minSalary*1000, salaryMax: that.data.maxSalary*1000, pageNum: pageNub, pageSize: that.data.pageSize, lng: that.data.lng, lat: that.data.lat,  homeFlag: true ,featureList:trait_str}).then(function (res) {
      // console.log(res)
      let list = that.data.contentList;
      for (var i in res.body.records) {
        let a = res.body.records[i].job;
        a.salaryMin =  (a.salaryMin / 1000).toFixed(1)
        a.salaryMax =  (a.salaryMax / 1000).toFixed(1)
        switch (a.education) {
          case 'no':
            a['xueliyaoqiu'] = "学历不限";
            break;
          case 'primary':
            a['xueliyaoqiu'] = "小学";
            break;
          case 'juniorHigh':
            a['xueliyaoqiu'] = "初中";
            break;
          case 'high':
            a['xueliyaoqiu'] = "高中";
            break;
          case 'technicalSecondary':
            a['xueliyaoqiu'] = "中专";
            break;
          case 'juniorCollege':
            a['xueliyaoqiu'] = "大专";
            break;
          case 'regularCollege':
            a['xueliyaoqiu'] = "本科";
            break;
          case 'master':
            a['xueliyaoqiu'] = "硕士";
            break;
          case 'doctor':
            a['xueliyaoqiu'] = "博士";
            break;
        }
        switch (a.workingYears) {
          case 'no':
            a['gongzuonianxian'] = "经验不限";
            break;
          case 'ltOneYears':
            a['gongzuonianxian'] = "1年以下";
            break;
          case 'oneYears':
            a['gongzuonianxian'] = "1年以上";
            break;
          case 'betweenOneAndThreeYears':
            a['gongzuonianxian'] = "1-3年";
            break;
          case 'betweenOneAndTwoYears':
            a['gongzuonianxian'] = "1-2年";
            break;
          case 'geTwoYears':
            a['gongzuonianxian'] = "2年以上";
            break;
          case 'twoYears':
            a['gongzuonianxian'] = "2年以上";
            break;
          case 'betweenTwoAndThreeYears':
            a['gongzuonianxian'] = "2-3年";
            break;
          case 'betweenThreeAndFiveYears':
            a['gongzuonianxian'] = "3-5年";
            break;
          case 'geFiveYears':
            a['gongzuonianxian'] = "5年以上";
            break;
          case 'betweenFiveAndTenYears':
            a['gongzuonianxian'] = "5-10年";
            break;
          case 'geTenYears':
            a['gongzuonianxian'] = "10年以上";
            break;
          default:
            a['gongzuonianxian'] = "";
            break;
        }

        for (let i = 0; i < res.body.records.length; i++) {
          if (res.body.records[i].job.type == 'online') {
            res.body.records[i].job.interviewTime = null
          }
          if (res.body.records[i].labels){
            res.body.records[i].labels = res.body.records[i].labels.slice(0,3)
          }
        }
        list.push(res.body.records[i])
      }
      that.setData({
        contentList: list,
        pageNum: pageNub
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  choicecity:function(){
    let that = this;
    WXAPI.findByParentCode({ parentCode: that.data.cityCode }).then(function (res) {
      that.setData({
        regionList: res.body
      });
    });
    WXAPI.indexBanner({ type: 'index' }).then(function (res) {
      // console.log(res)
      that.setData({
        bannerList: res.body
      })
    });
    WXAPI.indexNews({ pageNum: 1, pageSize: 5, isHeadline: true }).then(function (res) {
      // console.log(res)
      that.setData({
        articleList: res.body.records
      })
    });
    WXAPI.labelList('welfare').then(function (res) {
      console.log(res)
      for (var i in res.body) {
        let a = res.body[i];
        a['isChecked'] = false;
      }
      that.setData({
        labelList: res.body
      })
    });
    console.log(that.data.cityCode,that.data.lng,that.data.lat)
    // 获取置顶职位
    WXAPI.indexList({cityCode: that.data.cityCode,lng: that.data.lng, lat: that.data.lat, homeFlag: false,order:'topCardList'}).then(res=>{
      console.log(res)
      if(res.code != 200) return;
      that.setData({
        TopcontentList: that.fiexdData(res.body.records)
      })
    })
    // 获取其他职位
    WXAPI.indexList({ cityCode: that.data.cityCode, pageNum: 1, pageSize: that.data.pageSize, lng: that.data.lng, lat: that.data.lat, homeFlag: true }).then(function (res) {
        console.log(res)
        if(res.code != 200) return;
        if (res.body.records.length == 0) {
          that.setData({
            nothing: true
          })
        } else {
          that.setData({
            nothing: false
          })
        }
        that.setData({
          contentList: that.fiexdData(res.body.records)
        })
      });

    let date = new Date();
    let oneDay = 86400000;
    let date2 = new Date(Date.parse(date) + oneDay * 1);
    let date3 = new Date(Date.parse(date) + oneDay * 2);
    let date4 = new Date(Date.parse(date) + oneDay * 3);
    let fourTime = [date, date2, date3, date4];
    let fourTime2 = [];
    for (let i in fourTime) {
      let week = '';
      switch (fourTime[i].getDay()) {
        case 0:
          week = "日";
          break;
        case 1:
          week = "一";
          break;
        case 2:
          week = "二";
          break;
        case 3:
          week = "三";
          break;
        case 4:
          week = "四";
          break;
        case 5:
          week = "五";
          break;
        case 6:
          week = "六";
          break;
      }
      let a = { month: fourTime[i].getMonth() + 1, day: fourTime[i].getDate(), week: week, time: fourTime[i].getFullYear() + "-" + (fourTime[i].getMonth() + 1) + "-" + fourTime[i].getDate() }
      fourTime2.push(a);
    }
    that.setData({
      timeList: fourTime2
    })
  },
  selecity:function(){
    let token = wx.getStorageSync('token');
    if (token) {
      wx.navigateTo({
        url: '../../packageA/pages/popularCity/popularCity'
      })
    } else {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
    }
  },
  recommendset:function(){
    let token = wx.getStorageSync('token');
    if(token){
      wx.navigateTo({
        url: '../../packageA/pages/wantedJob/wantedJob'
      })
    }else {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
    }
  },
  openSetting:function(e){
    let that = this;
    console.log(e)
    if (e.detail.authSetting['scope.userLocation']){
      that.onLoad()
    }
  },
  clickbanner:function(e){
    let that = this;
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return false;
    }
    for (let i = 0; i < that.data.bannerList.length; i++){
      if (that.data.bannerList[i].id == e.target.dataset.id){
        switch (that.data.bannerList[i].linkType){
          case 'link':
            wx.navigateTo({
              url: '../outPage/outPage?id=' + that.data.bannerList[i].linkTypeInfo + '&src=' + that.data.bannerList[i].link
              // url: that.data.bannerList[i].link + '?id=' + that.data.bannerList[i].linkTypeInfo
            })
            break;
          case 'company':
            wx.navigateTo({
              url: '../companyInfo/companyInfo?id=' + that.data.bannerList[i].linkTypeInfo
            })
            break;
          case 'job':
            wx.navigateTo({
              url: '../recruitDetail/recruitDetail?id=' + that.data.bannerList[i].linkTypeInfo + '&cityCode=' + that.data.cityCode+'&interviewTime='
            })
            break;
          case 'richText':
            wx.navigateTo({
              url: '../bannerText/bannerText?id=' + that.data.bannerList[i].id
            })
            break;
        }
      }
    }
  },

  seenews:function(e){
    console.log(e.target.dataset.id)
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return false;
    }
    wx.navigateTo({
      url: '../news/news?id=' + e.target.dataset.id
    })
  },
  saoma:function(){
    let that = this;
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return false;
    }
    wx.scanCode({
      // onlyFromCamera:false,
      success(res){
        console.log(res)
        var json;
        if(res.result.indexOf('combineType') != -1){
          console.log('111')
          json= that.getQueryArgs(res.result);
          json.content = json.id
        }else{
          console.log('222')
          let $resultstr = res.result
          console.log($resultstr)
          let _jsostrn = that.isJSON(res.result)
          console.log(_jsostrn,$resultstr)
          if (!_jsostrn) {
            wx.navigateTo({ url: '../sao/sao?qiandaostate=' + '失败' + '&describe=' + '错误的二维码' })
            return false;
          }
          json = JSON.parse(res.result);
        }
        console.log(json)
        if (json.scanCodeType == "jobDetail"){
          wx.navigateTo({ url: `../recruitDetail/recruitDetail?id=${json.content}`})
        } else if (json.scanCodeType == "checkIn"){
          WXAPI.myResume().then(function (res) {
            console.log(res)
            if (!res.body.fjCardId && res.body.status != 401){
              console.log('wanshanshengfenzheng')
              wx.navigateTo({ url: '../../packageA/pages/perfectInfomation/perfectInfomation?id=' + json.content+'&relationid='+json.relationId  })
            }else{
              WXAPI.scanCodeCheckIn({ id: json.content,relationId :json.relationId  }).then(function (res) {
                console.log(res)
                wx.navigateTo({ url: '../sao/sao?qiandaostate=' + res.status + '&describe=' + res.msg })
              })
            }
          })
        } else if (json.scanCodeType == "companyDetail"){
          wx.navigateTo({ url: '../companyInfo/companyInfo?id=' + json.content })
        }
        else if (json.scanCodeType == "login"){
          wx.navigateTo({ url: '../sao/sao?qiandaostate=' + '失败' + '&describe=' + '扫码登录请使用APP客户端' })
        }
      }
    })
  },
  // saook:function(){
  //   console.log(1)
  //   // WXAPI.scanCodeCheckIn({ id: res.result }).then(function(res){

  //   // })
  // },
  closeToPerfect:function(){
    this.setData({
      showToPerfect:false
    });
  },
  showScreenCon:function(e){
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return false;
    }
    let code = e.currentTarget.dataset.id;
    this.setData({
      sureThisValue: true,
      selectShow:code
    })
  },
  sureThisValue:function(e){
    let that = this;
    let code = e.currentTarget.dataset.id;
    console.log(code);
    if (code == that.data.cityCode) {
      that.setData({
        selectedName: '全成都'
      })
    } else {
      for (let i = 0; i < that.data.regionList.length; i++) {
        if (code == that.data.regionList[i].code) {
          that.data.selectedName = that.data.regionList[i].name
        }
      }
    }
    this.setData({
      choiceRegionCode: code,
      selectedName: that.data.selectedName
    })
    that.exam();
  },
  selectShow:function(e){
    let that = this;
    let code = e.currentTarget.dataset.id;
    if (code == that.data.selectShow){
      that.setData({
        sureThisValue: !that.data.sureThisValue
      })
      return false;
    }
    console.log(code)
    that.setData({
      selectShow: code
    })
  },
  
  jump:function(e){
    let that = this;
    let token = wx.getStorageSync('token');
    if (!token) {
      return wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
    }
    if (e.currentTarget.dataset.url == "search") {
      wx.navigateTo({ url: '../search/search?cityCode=' + that.data.cityCode + '&city=' + that.data.city })
    } else if (e.currentTarget.dataset.url == "searchResult"){
      switch (e.currentTarget.dataset.id){
        case "1":
          if (that.data.cityCode == that.data.lscode){
            wx.navigateTo({ url: '../searchResult/searchResult?search=&cityCode='});
          }else{
            wx.navigateTo({ url: '../searchResult/searchResult?search=&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
          }
          break;
        case "2":
          if (that.data.cityCode == that.data.lscode) {
            wx.navigateTo({ url: '../searchResult/searchResult?feature=scene&cityCode='});
          } else {
            wx.navigateTo({ url: '../searchResult/searchResult?feature=scene&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
          }
          break;
        case "3":
          if (that.data.cityCode == that.data.lscode) {
            wx.navigateTo({ url: '../searchResult/searchResult?feature=online&cityCode='});
          } else {
            wx.navigateTo({ url: '../searchResult/searchResult?feature=online&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
          }
          break;
        case "4":
          if (that.data.cityCode == that.data.lscode) {
            wx.navigateTo({ url: '../searchResult/searchResult?recommendReward=true&cityCode=' });
          } else {
            wx.navigateTo({ url: '../searchResult/searchResult?recommendReward=true&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
          }
          break;
        case "5":
          if (that.data.cityCode == that.data.lscode) {
            wx.navigateTo({ url: '../searchResult/searchResult?general=true&cityCode='});
          } else {
            wx.navigateTo({ url: '../searchResult/searchResult?general=true&cityCode=' + that.data.cityCode + '&city=' + that.data.city});
          }
          break;
      }
    }else if (e.currentTarget.dataset.url == "tanlent"){
      console.log('人才共享')
      wx.navigateTo({ url: `../../packageA/pages/talentShare/talentShare?cityCode=${that.data.cityCode}&lat=${that.data.lat}&lng=${that.data.lng}` })
    }else{
      console.log(e.currentTarget)
      wx.navigateTo({ url: `../recruitDetail/recruitDetail?id=${e.currentTarget.dataset.id}&cityCode=${that.data.cityCode}&interviewTime=${e.currentTarget.dataset.interviewtime ? e.currentTarget.dataset.interviewtime:''}` })
    }
  },
  choiceTrait:function(e){
    let that = this;
    let value = e.currentTarget.dataset.value;
    let data = that.data.jobTrait;
    let showdata = this.data.traitList;
    console.log(value)
    let _index = data.indexOf(value)
    if(_index == -1){
      data.push(value)
    }else{
      data.splice(_index,1)
    }
    showdata.map(item=>{
      if(item.value == value){
        item.checked = !item.checked;
      }
    })
    that.setData({
      jobTrait: data,
      traitList:showdata
    });
  },
  choiceThisLable:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let lableArr = that.data.labelList;
    lableArr[index].isChecked = !lableArr[index].isChecked;
    that.setData({
      labelList: lableArr
    });
    console.log(that.data.labelList);
  },
  choiceDiploma:function(e){
    let that = this;
    let value = e.currentTarget.dataset.value;
    let data = that.data.diploma;
    let showdata = this.data.diplomaList;
    console.log(value)
    let _index = data.indexOf(value)
    if(_index == -1){
      data.push(value)
    }else{
      data.splice(_index,1)
    }
    showdata.map(item=>{
      if(item.value == value){
        item.checked = !item.checked;
      }
    })
    that.setData({
      diploma: data,
      diplomaList:showdata
    });
  },
  choiceSalary:function(e){
    let that = this;
    let min = e.currentTarget.dataset.min;
    let max = e.currentTarget.dataset.max;
    that.setData({
      minSalary: min,
      maxSalary:max
    });
  },
  cancelAllLable:function(){
    let that = this;
    let labelArr = that.data.labelList;
    let traitdata = that.data.traitList;
    for (let i in labelArr){
      labelArr[i].isChecked = false;
    }
    for (let i in traitdata){
      traitdata[i].checked = false;
    }
    that.cleartraitList()
    that.setData({
      jobTrait:[],
      labelList: labelArr,
      diploma:[],
      minSalary:'',
      maxSalary:'',
      low: 0,
      heigh:46,
      salarytext:'无限'
    })
    setTimeout(()=>{
      that.submitValue()
    },500)
  },
  cleartraitList(){
    let data = this.data.traitList;
    data.map(item=>{
      item.checked = false
    })
    this.setData({traitList:data})
  },
  submitValue:function(){
    let that = this;
    that.exam();
    that.setSalary()
  },
  choiceTime:function(e){
    let that = this;
    let time = e.currentTarget.dataset.date;
    console.log(time);
    that.setData({
      interViewTime: time
    })
    that.exam();
  },
  choiceOrder:function(e){
    let that = this;
    let order = e.currentTarget.dataset.value;
    that.setData({
      order: order
    })
    that.exam();
  },


  exam:function(){
    let that = this;
    let labelArr = that.data.labelList;
    let sureLabelArr = [];
    let labelId_str = ''
    let diploma_str = ''
    let trait_str = ''
    let areaCode = that.data.choiceRegionCode;
    for (let i in labelArr) {
      if (labelArr[i].isChecked == true) {
        sureLabelArr.push(labelArr[i].id);
      }
    }
    for (let i in that.data.jobTrait) {
      trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
    }
    for (let i in sureLabelArr) {
      labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
    }
    let diplomalist = that.data.diploma
    for (let i in diplomalist) {
      diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
    }
    
    if (that.data.choiceRegionCode == that.data.cityCode){
      areaCode = '';
    } 
    let interViewTime=''
    if (that.data.interViewTime == '0'){
      interViewTime = '';
    }else{
      interViewTime = that.data.interViewTime + " 00:00:00";
    }
    WXAPI.indexList({ cityCode: that.data.cityCode, areaCode: areaCode, labelId: labelId_str, order: that.data.order, interViewTime: interViewTime, educationList: diploma_str, salaryMin: that.data.minSalary?that.data.minSalary*1000:'', salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'', pageNum: 1, pageSize: that.data.pageSize, lng: that.data.lng, lat: that.data.lat, featureList:trait_str,homeFlag: true}).then(function (res) {
      console.log(res)
      if (res.body.records.length == 0) {
        that.setData({
          nothing: true
        })
      } else {
        that.setData({
          nothing: false
        })
      }
      for (var i in res.body.records) {
        let a = res.body.records[i].job;
        a.salaryMin = (a.salaryMin / 1000).toFixed(1)
        a.salaryMax =(a.salaryMax / 1000).toFixed(1)
        switch (a.education) {
          case 'no':
            a['xueliyaoqiu'] = "学历不限";
            break;
          case 'primary':
            a['xueliyaoqiu'] = "小学";
            break;
          case 'juniorHigh':
            a['xueliyaoqiu'] = "初中";
            break;
          case 'high':
            a['xueliyaoqiu'] = "高中";
            break;
          case 'technicalSecondary':
            a['xueliyaoqiu'] = "中专";
            break;
          case 'juniorCollege':
            a['xueliyaoqiu'] = "大专";
            break;
          case 'regularCollege':
            a['xueliyaoqiu'] = "本科";
            break;
          case 'master':
            a['xueliyaoqiu'] = "硕士";
            break;
          case 'doctor':
            a['xueliyaoqiu'] = "博士";
            break;
        }
        switch (a.workingYears) {
          case 'no':
            a['gongzuonianxian'] = "经验不限";
            break;
          case 'ltOneYears':
            a['gongzuonianxian'] = "1年以下";
            break;
          case 'oneYears':
            a['gongzuonianxian'] = "1年以上";
            break;
          case 'twoYears':
            a['gongzuonianxian'] = "2年以上";
            break;
          case 'betweenOneAndThreeYears':
            a['gongzuonianxian'] = "1-3年";
            break;
          case 'betweenOneAndTwoYears':
            a['gongzuonianxian'] = "1-2年";
            break;
          case 'geTwoYears':
            a['gongzuonianxian'] = "2年以上";
            break;
          case 'betweenTwoAndThreeYears':
            a['gongzuonianxian'] = "2-3年";
            break;
          case 'betweenThreeAndFiveYears':
            a['gongzuonianxian'] = "3-5年";
            break;
          case 'geFiveYears':
            a['gongzuonianxian'] = "5年以上";
            break;
          case 'betweenFiveAndTenYears':
            a['gongzuonianxian'] = "5-10年";
            break;
          case 'geTenYears':
            a['gongzuonianxian'] = "10年以上";
            break;
          default:
            a['gongzuonianxian'] = "";
            break;
        }
        if (res.body.records[i].labels){
          if (res.body.records[i].labels.length > 3){
            res.body.records[i].labels = res.body.records[i].labels.slice(0,3)
          }
        }
      }
      that.setData({
        contentList: res.body.records,
        sureThisValue: false,
        pageNum:1
      })
    });
  },
  dingwei:function(){
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(latitude, longitude, speed, accuracy);
      }
    })
  },
  isJSON:function(str) {
    if(typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (str.indexOf('{') > -1) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return false;
  }  ,
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
  fiexdData:function(data){
    for (var i in data) {
      let a = data[i].job;
      a.salaryMin = (a.salaryMin / 1000).toFixed(1)
      a.salaryMax = (a.salaryMax / 1000).toFixed(1)
      switch (a.education) {
        case 'no':
          a['xueliyaoqiu'] = "学历不限";
          break;
        case 'primary':
          a['xueliyaoqiu'] = "小学";
          break;
        case 'juniorHigh':
          a['xueliyaoqiu'] = "初中";
          break;
        case 'high':
          a['xueliyaoqiu'] = "高中";
          break;
        case 'technicalSecondary':
          a['xueliyaoqiu'] = "中专";
          break;
        case 'juniorCollege':
          a['xueliyaoqiu'] = "大专";
          break;
        case 'regularCollege':
          a['xueliyaoqiu'] = "本科";
          break;
        case 'master':
          a['xueliyaoqiu'] = "硕士";
          break;
        case 'doctor':
          a['xueliyaoqiu'] = "博士";
          break;
      }
      switch (a.workingYears) {
        case 'no':
          a['gongzuonianxian'] = "经验不限";
          break;
        case 'ltOneYears':
          a['gongzuonianxian'] = "1年以下";
          break;
        case 'oneYears':
          a['gongzuonianxian'] = "1年以上";
          break;
        case 'betweenOneAndThreeYears':
          a['gongzuonianxian'] = "1-3年";
          break;
        case 'betweenOneAndTwoYears':
          a['gongzuonianxian'] = "1-2年";
          break;
        case 'geTwoYears':
          a['gongzuonianxian'] = "2年以上";
          break;
        case 'twoYears':
          a['gongzuonianxian'] = "2年以上";
          break;
        case 'betweenTwoAndThreeYears':
          a['gongzuonianxian'] = "2-3年";
          break;
        case 'betweenThreeAndFiveYears':
          a['gongzuonianxian'] = "3-5年";
          break;
        case 'geFiveYears':
          a['gongzuonianxian'] = "5年以上";
          break;
        case 'betweenFiveAndTenYears':
          a['gongzuonianxian'] = "5-10年";
          break;
        case 'geTenYears':
          a['gongzuonianxian'] = "10年以上";
          break;
        default:
          a['gongzuonianxian'] = "";
          break;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].job.type == 'online') {
        data[i].job.interviewTime = null
      }
      if (data[i].labels){
        data[i].labels = data[i].labels.slice(0,3)
      }
    }
    return data
  },
  closewantjob(){
    console.log('close')
    this.setData({wantjobFlag:false})
  },
  closeEject(e){
    console.log(e.currentTarget.dataset.info)
    if(e.currentTarget.dataset.info =='float'){
      wx.setStorageSync('floatFlag', false);
      this.setData({
        floatFlag:false
      })
    }else{
      wx.setStorageSync('ejectFlag', false);
      this.setData({
        ejectFlag:false
      })
    }
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.onPullDownRefresh()
      this.setData({
        triggered: false,
        sureThisValue:false
      })
      this._freshing = false
    }, 1000)
  },
  eventMove(e){
    // console.log(e.detail)
    var that = this;
    let data = e.detail
    let helfWidth = that.data.movableWidth/2
    if(data.source=='friction'){
      console.log(data.x)
      if(data.x>helfWidth){
        that.setData({x:that.data.movableWidth,y:data.y})
      }else{
        that.setData({x:0,y:data.y})
      }
    }
  },
  
  clickadvertise(e){
    let that = this;
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '../AuthorizedLogin/AuthorizedLogin'
      })
      return false;
    }
    let type = e.target.dataset.type
    if(type == 'eject'){
      wx.setStorageSync('ejectFlag', false);
      that.setData({
        ejectFlag:false
      })
    }
    // else{
    //   wx.setStorageSync('ejectFlag', false);
    //   that.setData({
    //     ejectFlag:false
    //   })
    // }
    let info = e.target.dataset.data
    console.log(info)
    switch (info.linkType){
      case 'link':
        wx.navigateTo({
          url: '../outPage/outPage?id=' + info.id + '&src=' + info.linkTypeInfo
        })
        break;
      case 'company':
        wx.navigateTo({
          url: '../companyInfo/companyInfo?id=' + info.linkTypeInfo
        })
        break;
      case 'job':
        wx.navigateTo({
          url: '../recruitDetail/recruitDetail?id=' + info.linkTypeInfo + '&cityCode=' + that.data.cityCode+'&interviewTime='
        })
        break;
      case 'richText':
        wx.setStorageSync("richtext",info.linkTypeInfo) 
        wx.navigateTo({
          url: '../richText/richText?data=offer'
        })
        break;
    }
  },
  lowValueChangeAction(e){
    console.log(e.detail);
    if(e.detail<=30){
      this.setData({minSalary:e.detail/2==0.5?1:e.detail/2})
    }else{
      this.setData({minSalary:e.detail-15==31?30:e.detail-15})
    }
    this.setsalarytext()
  },
  heighValueChangeAction(e){
    console.log(e.detail);
    if(e.detail<=30){
      this.setData({maxSalary:e.detail/2<1?1:e.detail/2})
    }else{
      this.setData({maxSalary:e.detail-15==31?'':e.detail-15})
    }
    this.setsalarytext()
  },
  setsalarytext(){
    let _min = this.data.minSalary
    let _max = this.data.maxSalary
    let that = this;
    console.log(_min,_max)
    if(_min==0 || ''){
      if(_max){
        if(_max==1){
          that.setData({salarytext:`${_max}k`})
        }else{
          that.setData({salarytext:`${_max}k以下`})
        }
      }else{
        that.setData({salarytext:`不限`})
      }
    }else{
      if(_max){
        that.setData({salarytext:`${_min}k~${_max}k`})
      }else{
        that.setData({salarytext:`${_min}k以上`})
      }
      
    }
  },
  setSalary(){
    var _min = this.data.minSalary
    var _max = this.data.maxSalary
    var that = this;
    if(_min=='' || _min==0){
      this.setData({
        low: 0,
      });
    }else if(_min<=15){
      that.setData({
        low:_min*2,
      });
    }else{
      that.setData({
        low:_min+15,
      });
    }
    if(_max=='' || _max==0){
      this.setData({
        heigh: 46,
      });
    }else if(_max<=15){
      that.setData({
        heigh:_max*2,
      });
    }else{
      that.setData({
        heigh:_max+15,
      });
    }
    
    console.log(this.data.low,this.data.heigh)
  },
})
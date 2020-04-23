// pages/searchResult/searchResult.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabFixed: false,
    sureThisValue: false,
    imgIp: WXAPI.imgIp,
    city: '',
    cityCode: '',
    regionList: [],
    labelList: [],
    timeList: [],
    lat: '',
    lng: '',
    pageNum: 1,
    pageSize: 10,
    contentList: [],
    choiceRegionCode: '',
    selectShow: 1,
    jobTrait: [],
    traitonly:true,
    traitList:[
      {value:'scene',name:'现场直面会',checked:false,show:true,},
      {value:'online',name:'在线直聘',checked:false,show:true},
      {value:'isGeneral',name:'普工专栏',checked:false,show:true},
      {value:'isJobShared',name:'人才共享',checked:false,show:true}
    ],
    diploma: [],
    minSalary: '',
    maxSalary: '',
    order: 'auto',
    interViewTime: '',
    searchkey:' ',
    isGeneral:false,
    isRecommendReward:'',
    xianchang:false,
    xianchangThis:'0',
    choicedate:[],
    contentList2: [],
    today:'',
    xcpage:1,   //现场直面会的页面数
    rtpage:1,    //返回的总页数
    selectedName:'', //选中的名字

    allpostpage:1, //全部职位的当前页面
    allpostspage: 1, //全部职位的总页数

    onlinepage: 1, //在线直聘的当前页面
    onlinepages: 1, //在线直聘的总页数
    isonline:true, //是否是在线直聘

    generalpage: 1, // 普工的当前页面
    generalpages: 1, //普工的总页数

    searchpage:1, // 搜索的当前页
    searchpages:1,  //搜索的总页数
    searchValue:'', //搜索的内容
    nothing: false,
    issearch: false,
    windowHeight:'',
    diplomaList:[
      {value:'no',name:'不限',checked:false},{value:'juniorHigh',name:'初中',checked:false},{value:'high',name:'高中',checked:false},{value:'technicalSecondary',name:'中专',checked:false},{value:'juniorCollege',name:'大专',checked:false},{value:'regularCollege',name:'本科',checked:false},{value:'master',name:'硕士',checked:false},{value:'doctor',name:'博士',checked:false}
    ],
    low: 1,
    heigh:45,
    salarytext:'不限'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight-70,
        });
      }
    });
    
    that.data.contentList2 = [];
    let searchValue = options.search;
    let general = options.general;
    let recommendReward = options.recommendReward;
    let feature = options.feature;
    console.log(searchValue, general, feature)
    //获取时间
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let maxdate = new Date(y, m, 0).getDate()
    console.log(maxdate);
    let r = date.getDate();
    let xq = date.getDay();
    // 现场直面会的头部
    let x = '';
    for(let i = 0; i < 5; i++){
      r < 10 ? r = '0' + r : r;
      if(xq >= 7){
        xq = 0
      }
      switch (xq) {
        case 0:
          x = '日';
          break;
        case 1:
          x = '一';
          break;
        case 2:
          x = '二';
          break;
        case 3:
          x = '三';
          break;
        case 4:
          x = '四';
          break;
        case 5:
          x = '五';
          break;
        case 6:
          x = '六';
          break;
      }
      that.data.choicedate.push({ riqi:r, xinqi:x })
      if (r == maxdate){
        r='1'
      }else{
        r++;
      }
      xq++;
    }
    that.setData({
      choicedate: that.data.choicedate,
      searchValue: searchValue
    })
    if (searchValue == ''){
      wx.setNavigationBarTitle({
        title:'全部职位'
      })
    } else if (general == 'true'){
      let data = that.data.traitList
      data.map(item=>{
        if(item.value != 'isGeneral'){item.show = false}
        else{item.checked = true}
      })
      wx.setNavigationBarTitle({
        title: '普工专栏'
      })
      that.setData({
        traitList:data,
        traitonly:false,
        jobTrait:['isGeneral']
      })
    } else if (feature == 'online'){
      let data = that.data.traitList
      data.map(item=>{
        if(item.value != 'online'){item.show = false}
        else{item.checked = true }
      })
      that.setData({
        isonline:false,
        traitList:data,
        traitonly:false,
        jobTrait:['isGeneral']
      })
      wx.setNavigationBarTitle({
        title: '在线直聘'
      })
    } else if (feature == 'scene'){
      wx.setNavigationBarTitle({
        title: '现场直面会'
      })
      that.setData({
        xianchang:true
      })
    } else if (searchValue != '') {
      wx.setNavigationBarTitle({
        title: '搜索结果'
      })
    }
    // if (searchValue == null || searchValue == undefined || searchValue==''){
    //   searchValue = ''
    // }
    if (general == null || general == undefined || general == '') {
      general = ''
    }
    if (recommendReward == null || recommendReward == undefined || recommendReward == '') {
      recommendReward = ''
    }
    if (feature == null || feature == undefined || feature == '') {
      feature = ''
    }

    that.setData({
      searchkey: searchValue,
      isGeneral: general,
      isRecommendReward: recommendReward,
      jobTrait: feature?[feature]:[]
    });
    if (general == 'true') {
      that.setData({
        jobTrait:['isGeneral']
      })
    }

    var lat_ = '';
    var log_ = '';
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        lat_ = res.latitude;
        log_ = res.longitude;
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?key=fc27adfe9b36e3c6dd12d13de6218d22&location=' + log_ + ',' + lat_ + '& output=JSON',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success(res) {
            that.setData({
              lscode: res.data.regeocode.addressComponent.adcode.substr(0, 4) + '00',
              lat: lat_,
              lng: log_
            })
          }
        })
      }
    })

    if (options.cityCode){
      console.log(options.cityCode)
      that.setData({
        cityCode: options.cityCode,
        city: options.city
      })
      WXAPI.findByParentCode({ parentCode: that.data.cityCode }).then(function (res) {
        that.setData({
          regionList: res.body
        });
      });
      WXAPI.labelList('welfare').then(function (res) {
        for (var i in res.body) {
          let a = res.body[i];
          a['isChecked'] = false;
        }
        that.setData({
          labelList: res.body
        })
      });

      // 筛选里面的面试时间
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
      setTimeout(function(){
        if (searchValue == '') {
          WXAPI.indexList({
            cityCode: that.data.cityCode,
            lat: that.data.lat,
            lng: that.data.lng,
            pageNum: that.data.allpostpage
          }).then(function (res) {
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
            for (let i = 0; i < res.body.records.length; i++) {
              let a = res.body.records[i].job
              a.salaryMin =  (a.salaryMin / 1000).toFixed(1)
              a.salaryMax = (a.salaryMax / 1000).toFixed(1)
              switch (res.body.records[i].job.education) {
                case 'no':
                  res.body.records[i].job.education = '学历不限'
                  break;
                case 'juniorHigh':
                  res.body.records[i].job.education = '初中'
                  break;
                case 'high':
                  res.body.records[i].job.education = '高中'
                  break;
                case 'technicalSecondary':
                  res.body.records[i].job.education = '中专'
                  break;
                case 'juniorCollege':
                  res.body.records[i].job.education = '大专'
                  break;
                case 'regularCollege':
                  res.body.records[i].job.education = '本科'
                  break;
                case 'master':
                  res.body.records[i].job.education = '硕士'
                  break;

                case 'doctor':
                  res.body.records[i].job.education = '博士'
                  break;
              }
              switch (res.body.records[i].job.workingYears) {
                case 'no':
                  res.body.records[i].job.workingYears = '经验不限'
                  break;
                case 'ltOneYears':
                  res.body.records[i].job.workingYears = '一年以下'
                  break;
                case 'geOneYears':
                  res.body.records[i].job.workingYears = '一年以上'
                  break;
                case 'oneYears':
                  res.body.records[i].job.workingYears = '一年'
                  break;
                case 'betweenOneAndTwoYears':
                  res.body.records[i].job.workingYears = '1-2年'
                  break;
                case 'twoYears':
                  res.body.records[i].job.workingYears = '2年'
                  break;
                case 'geTwoYears':
                  res.body.records[i].job.workingYears = '2年以上'
                  break;
                case 'betweenOneAndThreeYears':
                  res.body.records[i].job.workingYears = "1-3年";
                  break;
                case 'betweenTwoAndThreeYears':
                  res.body.records[i].job.workingYears = '2-3年'
                  break;
                case 'betweenThreeAndFiveYears':
                  res.body.records[i].job.workingYears = '3-5年'
                  break;
                case 'geFiveYears':
                  res.body.records[i].job.workingYears = '5年以上'
                  break;
                case 'betweenFiveAndTenYears':
                  res.body.records[i].job.workingYears = "5-10年";
                  break;
                case 'geTenYears':
                  res.body.records[i].job.workingYears = "10年以上";
                  break;
              }
              if (res.body.records[i].labels) {
                if (res.body.records[i].labels.length > 3) {
                  res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                }
              }
            }
            if (res.body.pages > 1) {
              for (let i = 0; i < res.body.records.length; i++) {
                that.data.contentList2.push(res.body.records[i])
              }
              that.setData({
                contentList2: that.data.contentList2,
                allpostpage: that.data.allpostpage + 1,
                allpostspage: res.body.pages
              })
            } else {
              that.setData({
                contentList2: res.body.records,
                allpostpage: that.data.allpostpage + 1,
                allpostspage: res.body.pages
              })
            }
          })
        } else if (general == 'true') {
          WXAPI.indexList({
            cityCode: that.data.cityCode,
            lat: that.data.lat,
            lng: that.data.lng,
            featureList:'isGeneral',
            pageNum: that.data.generalpage
          }).then(function (res) {
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
            for (let i = 0; i < res.body.records.length; i++) {
              let a = res.body.records[i].job
              a.salaryMin =  (a.salaryMin / 1000).toFixed(1)
              a.salaryMax =(a.salaryMax / 1000).toFixed(1)
              switch (res.body.records[i].job.education) {
                case 'no':
                  res.body.records[i].job.education = '学历不限'
                  break;
                case 'juniorHigh':
                  res.body.records[i].job.education = '初中'
                  break;
                case 'high':
                  res.body.records[i].job.education = '高中'
                  break;
                case 'technicalSecondary':
                  res.body.records[i].job.education = '中专'
                  break;
                case 'juniorCollege':
                  res.body.records[i].job.education = '大专'
                  break;
                case 'regularCollege':
                  res.body.records[i].job.education = '本科'
                  break;
                case 'master':
                  res.body.records[i].job.education = '硕士'
                  break;

                case 'doctor':
                  res.body.records[i].job.education = '博士'
                  break;
              }
              switch (res.body.records[i].job.workingYears) {
                case 'no':
                  res.body.records[i].job.workingYears = '经验不限'
                  break;
                case 'ltOneYears':
                  res.body.records[i].job.workingYears = '一年以下'
                  break;
                case 'geOneYears':
                  res.body.records[i].job.workingYears = '一年以上'
                  break;
                case 'oneYears':
                  res.body.records[i].job.workingYears = '一年'
                  break;
                case 'betweenOneAndTwoYears':
                  res.body.records[i].job.workingYears = '1-2年'
                  break;
                case 'twoYears':
                  res.body.records[i].job.workingYears = '2年'
                  break;
                case 'geTwoYears':
                  res.body.records[i].job.workingYears = '2年以上'
                  break;
                case 'betweenOneAndThreeYears':
                  res.body.records[i].job.workingYears = "1-3年";
                  break;
                case 'betweenTwoAndThreeYears':
                  res.body.records[i].job.workingYears = '2-3年'
                  break;
                case 'betweenThreeAndFiveYears':
                  res.body.records[i].job.workingYears = '3-5年'
                  break;
                case 'geFiveYears':
                  res.body.records[i].job.workingYears = '5年以上'
                  break;
                case 'betweenFiveAndTenYears':
                  res.body.records[i].job.workingYears = "5-10年";
                  break;
                case 'geTenYears':
                  res.body.records[i].job.workingYears = "10年以上";
                  break;
              }
              if (res.body.records[i].labels) {
                if (res.body.records[i].labels.length > 3) {
                  res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                }
              }
            }
            if (res.body.pages > 1) {
              for (let i = 0; i < res.body.records.length; i++) {
                that.data.contentList2.push(res.body.records[i])
              }
              that.setData({
                contentList2: that.data.contentList2,
                generalpage: that.data.generalpage + 1,
                generalpages: res.body.pages
              })
            } else {
              that.setData({
                contentList2: res.body.records,
                generalpage: that.data.generalpage + 1,
                generalpages: res.body.pages
              })
            }
          })
        } else if (feature == 'online') {
          WXAPI.indexList({
            featureList:'online',
            cityCode: that.data.cityCode,
            lat: that.data.lat,
            lng: that.data.lng,
            pageNum: that.data.onlinepage
          }).then(function (res) {
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
            for (let i = 0; i < res.body.records.length; i++) {
              let a = res.body.records[i].job
              a.salaryMin = (a.salaryMin / 1000).toFixed(1)
              a.salaryMax = (a.salaryMax / 1000).toFixed(1)
              switch (res.body.records[i].job.education) {
                case 'no':
                  res.body.records[i].job.education = '学历不限'
                  break;
                case 'juniorHigh':
                  res.body.records[i].job.education = '初中'
                  break;
                case 'high':
                  res.body.records[i].job.education = '高中'
                  break;
                case 'technicalSecondary':
                  res.body.records[i].job.education = '中专'
                  break;
                case 'juniorCollege':
                  res.body.records[i].job.education = '大专'
                  break;
                case 'regularCollege':
                  res.body.records[i].job.education = '本科'
                  break;
                case 'master':
                  res.body.records[i].job.education = '硕士'
                  break;

                case 'doctor':
                  res.body.records[i].job.education = '博士'
                  break;
              }
              switch (res.body.records[i].job.workingYears) {
                case 'no':
                  res.body.records[i].job.workingYears = '经验不限'
                  break;
                case 'ltOneYears':
                  res.body.records[i].job.workingYears = '一年以下'
                  break;
                case 'geOneYears':
                  res.body.records[i].job.workingYears = '一年以上'
                  break;
                case 'oneYears':
                  res.body.records[i].job.workingYears = '一年'
                  break;
                case 'betweenOneAndTwoYears':
                  res.body.records[i].job.workingYears = '1-2年'
                  break;
                case 'twoYears':
                  res.body.records[i].job.workingYears = '2年'
                  break;
                case 'geTwoYears':
                  res.body.records[i].job.workingYears = '2年以上'
                  break;
                case 'betweenOneAndThreeYears':
                  res.body.records[i].job.workingYears = "1-3年";
                  break;
                case 'betweenTwoAndThreeYears':
                  res.body.records[i].job.workingYears = '2-3年'
                  break;
                case 'betweenThreeAndFiveYears':
                  res.body.records[i].job.workingYears = '3-5年'
                  break;
                case 'geFiveYears':
                  res.body.records[i].job.workingYears = '5年以上'
                  break;
                case 'betweenFiveAndTenYears':
                  res.body.records[i].job.workingYears = "5-10年";
                  break;
                case 'geTenYears':
                  res.body.records[i].job.workingYears = "10年以上";
                  break;
              }
              if (res.body.records[i].labels) {
                if (res.body.records[i].labels.length > 3) {
                  res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                }
              }
            }
            if (res.body.pages > 1) {
              for (let i = 0; i < res.body.records.length; i++) {
                that.data.contentList2.push(res.body.records[i])
              }
              that.setData({
                contentList2: that.data.contentList2,
                onlinepage: that.data.onlinepage + 1,
                onlinepages: res.body.pages
              })
            } else {
              that.setData({
                contentList2: res.body.records,
                onlinepage: that.data.onlinepage + 1,
                onlinepages: res.body.pages
              })
            }
          })
        } else if (feature == 'scene') {

          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          m < 10 ? m = '0' + m : m;
          let d = that.data.choicedate[0].riqi;
          let t = y + '-' + m + '-' + d + ' 00:00:00'
          that.setData({
            today: t
          })
          that.xianC(t, that.data.xcpage)
        } else if (searchValue) {
          WXAPI.searchResult({
            cityCode: that.data.cityCode,
            content: searchValue,
            lat: that.data.lat,
            lng: that.data.lng
          }).then(function (res) {
            console.log(res)
            that.setData({
              issearch: true
            })
            if (res.body.dataList.length == 0) {
              that.setData({
                nothing: true
              })
            } else {
              that.setData({
                nothing: false
              })
              for (var i in res.body.dataList) {
                let a = res.body.dataList[i];
                a.salaryMin = (a.salaryMin / 1000).toFixed(1)
                a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                if (a.labels != null) {
                  a.labels = a.labels.split(",");
                } else {
                  a.labels = [];
                }
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
                  case 'geOneYears':
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
                }
                if (res.body.dataList[i].labels) {
                  if (res.body.dataList[i].labels.length > 3) {
                    res.body.dataList[i].labels = res.body.dataList[i].labels.slice(0, 3)
                  }
                }
              }
              that.setData({
                contentList: res.body.dataList
              })

              for (let i = 0; i < that.data.contentList.length; i++) {
                if (that.data.contentList[i].type == 'online') {
                  that.data.contentList[i].interviewTime = null
                }
              }
              that.setData({
                contentList: that.data.contentList,
                searchpages: res.body.totalPages
              })
            }
          })
        }
      },1500)

      // WXAPI.searchResult({ areaCode: that.data.cityCode, current: 1, size: that.data.pageSize, content: that.data.searchkey, jobFeature: that.data.jobTrait, isGeneral: that.data.isGeneral, isRecommendReward: that.data.isRecommendReward, lng: that.data.lng, lat: that.data.lat }).then(function (res) {
      //   console.log(res)
      //   for (var i in res.body.dataList) {
      //     let a = res.body.dataList[i];
      //     if (a.labels!=null){
      //       a.labels = a.labels.split(",");
      //     }else{
      //       a.labels= [];
      //     }
      //     switch (a.education) {
      //       case 'no':
      //         a['xueliyaoqiu'] = "不限";
      //         break;
      //       case 'primary':
      //         a['xueliyaoqiu'] = "小学";
      //         break;
      //       case 'juniorHigh':
      //         a['xueliyaoqiu'] = "初中";
      //         break;
      //       case 'high':
      //         a['xueliyaoqiu'] = "高中";
      //         break;
      //       case 'technicalSecondary':
      //         a['xueliyaoqiu'] = "中专";
      //         break;
      //       case 'juniorCollege':
      //         a['xueliyaoqiu'] = "大专";
      //         break;
      //       case 'regularCollege':
      //         a['xueliyaoqiu'] = "本科";
      //         break;
      //       case 'master':
      //         a['xueliyaoqiu'] = "硕士";
      //         break;
      //       case 'doctor':
      //         a['xueliyaoqiu'] = "博士";
      //         break;
      //     }
      //     switch (a.workingYears) {
      //       case 'no':
      //         a['gongzuonianxian'] = "经验不限";
      //         break;
      //       case 'ltOneYears':
      //         a['gongzuonianxian'] = "1年以内";
      //         break;
      //       case 'geOneYears':
      //         a['gongzuonianxian'] = "1年以上";
      //         break;
      //       case 'betweenOneAndTwoYears':
      //         a['gongzuonianxian'] = "1-2年";
      //         break;
      //       case 'geTwoYears':
      //         a['gongzuonianxian'] = "2年以上";
      //         break;
      //       case 'betweenTwoAndThreeYears':
      //         a['gongzuonianxian'] = "2-3年";
      //         break;
      //       case 'betweenThreeAndFiveYears':
      //         a['gongzuonianxian'] = "3-5年";
      //         break;
      //       case 'geFiveYears':
      //         a['gongzuonianxian'] = "5年以上";
      //         break;
      //     }
      //   }
      //   that.setData({
      //     contentList: res.body.dataList
      //   })

      //   for (let i = 0; i < that.data.contentList.length; i++){
      //     if (that.data.contentList[i].type == 'online'){
      //       that.data.contentList[i].interviewTime = null
      //     }
      //   }
      //   that.setData({
      //     contentList: that.data.contentList
      //   })
      // });

      wx.hideLoading()
    }else{
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          that.setData({
            lat: latitude,
            lng: longitude
          });
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
              WXAPI.findByParentCode({ parentCode: that.data.cityCode }).then(function (res) {
                that.setData({
                  regionList: res.body
                });
              });
              WXAPI.labelList('welfare').then(function (res) {
                for (var i in res.body) {
                  let a = res.body[i];
                  a['isChecked'] = false;
                }
                that.setData({
                  labelList: res.body
                })
              });

              // 筛选里面的面试时间
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
              if (searchValue == '') {
                WXAPI.indexList({
                  cityCode: that.data.cityCode,
                  lat: that.data.lat,
                  lng: that.data.lng,
                  pageNum: that.data.allpostpage
                }).then(function (res) {
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
                  for (let i = 0; i < res.body.records.length; i++) {
                    let a = res.body.records[i].job
                    a.salaryMin = (a.salaryMin / 1000).toFixed(1)
                    a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                    switch (res.body.records[i].job.education) {
                      case 'no':
                        res.body.records[i].job.education = '学历不限'
                        break;
                      case 'juniorHigh':
                        res.body.records[i].job.education = '初中'
                        break;
                      case 'high':
                        res.body.records[i].job.education = '高中'
                        break;
                      case 'technicalSecondary':
                        res.body.records[i].job.education = '中专'
                        break;
                      case 'juniorCollege':
                        res.body.records[i].job.education = '大专'
                        break;
                      case 'regularCollege':
                        res.body.records[i].job.education = '本科'
                        break;
                      case 'master':
                        res.body.records[i].job.education = '硕士'
                        break;

                      case 'doctor':
                        res.body.records[i].job.education = '博士'
                        break;
                    }
                    switch (res.body.records[i].job.workingYears) {
                      case 'no':
                        res.body.records[i].job.workingYears = '经验不限'
                        break;
                      case 'ltOneYears':
                        res.body.records[i].job.workingYears = '一年以下'
                        break;
                      case 'geOneYears':
                        res.body.records[i].job.workingYears = '一年以上'
                        break;
                      case 'oneYears':
                        res.body.records[i].job.workingYears = '一年'
                        break;
                      case 'betweenOneAndTwoYears':
                        res.body.records[i].job.workingYears = '1-2年'
                        break;
                      case 'twoYears':
                        res.body.records[i].job.workingYears = '2年'
                        break;
                      case 'geTwoYears':
                        res.body.records[i].job.workingYears = '2年以上'
                        break;
                      case 'betweenOneAndThreeYears':
                        res.body.records[i].job.workingYears = "1-3年";
                        break;
                      case 'betweenTwoAndThreeYears':
                        res.body.records[i].job.workingYears = '2-3年'
                        break;
                      case 'betweenThreeAndFiveYears':
                        res.body.records[i].job.workingYears = '3-5年'
                        break;
                      case 'geFiveYears':
                        res.body.records[i].job.workingYears = '5年以上'
                        break;
                      case 'betweenFiveAndTenYears':
                        res.body.records[i].job.workingYears = "5-10年";
                        break;
                      case 'geTenYears':
                        res.body.records[i].job.workingYears = "10年以上";
                        break;
                    }
                    
                    if (res.body.records[i].labels) {
                      if (res.body.records[i].labels.length > 3) {
                        res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                      }
                    }
                  }
                  if (res.body.pages > 1) {
                    for (let i = 0; i < res.body.records.length; i++) {
                      that.data.contentList2.push(res.body.records[i])
                    }
                    that.setData({
                      contentList2: that.data.contentList2,
                      allpostpage: that.data.allpostpage + 1,
                      allpostspage: res.body.pages
                    })
                  } else {
                    that.setData({
                      contentList2: res.body.records,
                      allpostpage: that.data.allpostpage + 1,
                      allpostspage: res.body.pages
                    })
                  }
                })
              } else if (general == 'true') {
                WXAPI.indexList({
                  cityCode: that.data.cityCode,
                  lat: that.data.lat,
                  lng: that.data.lng,
                  featureList:'isGeneral',
                  pageNum: that.data.generalpage
                }).then(function (res) {
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
                  for (let i = 0; i < res.body.records.length; i++) {
                    let a = res.body.records[i].job
                    a.salaryMin = (a.salaryMin / 1000).toFixed(1)
                    a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                    switch (res.body.records[i].job.education) {
                      case 'no':
                        res.body.records[i].job.education = '学历不限'
                        break;
                      case 'juniorHigh':
                        res.body.records[i].job.education = '初中'
                        break;
                      case 'high':
                        res.body.records[i].job.education = '高中'
                        break;
                      case 'technicalSecondary':
                        res.body.records[i].job.education = '中专'
                        break;
                      case 'juniorCollege':
                        res.body.records[i].job.education = '大专'
                        break;
                      case 'regularCollege':
                        res.body.records[i].job.education = '本科'
                        break;
                      case 'master':
                        res.body.records[i].job.education = '硕士'
                        break;

                      case 'doctor':
                        res.body.records[i].job.education = '博士'
                        break;
                    }
                    switch (res.body.records[i].job.workingYears) {
                      case 'no':
                        res.body.records[i].job.workingYears = '经验不限'
                        break;
                      case 'ltOneYears':
                        res.body.records[i].job.workingYears = '一年以下'
                        break;
                      case 'geOneYears':
                        res.body.records[i].job.workingYears = '一年以上'
                        break;
                      case 'oneYears':
                        res.body.records[i].job.workingYears = '一年'
                        break;
                      case 'betweenOneAndTwoYears':
                        res.body.records[i].job.workingYears = '1-2年'
                        break;
                      case 'twoYears':
                        res.body.records[i].job.workingYears = '2年'
                        break;
                      case 'geTwoYears':
                        res.body.records[i].job.workingYears = '2年以上'
                        break;
                      case 'betweenOneAndThreeYears':
                        res.body.records[i].job.workingYears = "1-3年";
                        break;
                      case 'betweenTwoAndThreeYears':
                        res.body.records[i].job.workingYears = '2-3年'
                        break;
                      case 'betweenThreeAndFiveYears':
                        res.body.records[i].job.workingYears = '3-5年'
                        break;
                      case 'geFiveYears':
                        res.body.records[i].job.workingYears = '5年以上'
                        break;
                      case 'betweenFiveAndTenYears':
                        res.body.records[i].job.workingYears = "5-10年";
                        break;
                      case 'geTenYears':
                        res.body.records[i].job.workingYears = "10年以上";
                        break;
                    }
                    if (res.body.records[i].labels) {
                      if (res.body.records[i].labels.length > 3) {
                        res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                      }
                    }
                  }
                  if (res.body.pages > 1) {
                    for (let i = 0; i < res.body.records.length; i++) {
                      that.data.contentList2.push(res.body.records[i])
                    }
                    that.setData({
                      contentList2: that.data.contentList2,
                      generalpage: that.data.generalpage + 1,
                      generalpages: res.body.pages
                    })
                  } else {
                    that.setData({
                      contentList2: res.body.records,
                      generalpage: that.data.generalpage + 1,
                      generalpages: res.body.pages
                    })
                  }
                })
              } else if (feature == 'online') {
                WXAPI.indexList({
                  featureList:'online',
                  cityCode: that.data.cityCode,
                  lat: that.data.lat,
                  lng: that.data.lng,
                  pageNum: that.data.onlinepage
                }).then(function (res) {
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
                  for (let i = 0; i < res.body.records.length; i++) {
                    let a = res.body.records[i].job
                    a.salaryMin =  (a.salaryMin / 1000).toFixed(1)
                    a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                    switch (res.body.records[i].job.education) {
                      case 'no':
                        res.body.records[i].job.education = '学历不限'
                        break;
                      case 'juniorHigh':
                        res.body.records[i].job.education = '初中'
                        break;
                      case 'high':
                        res.body.records[i].job.education = '高中'
                        break;
                      case 'technicalSecondary':
                        res.body.records[i].job.education = '中专'
                        break;
                      case 'juniorCollege':
                        res.body.records[i].job.education = '大专'
                        break;
                      case 'regularCollege':
                        res.body.records[i].job.education = '本科'
                        break;
                      case 'master':
                        res.body.records[i].job.education = '硕士'
                        break;

                      case 'doctor':
                        res.body.records[i].job.education = '博士'
                        break;
                    }
                    switch (res.body.records[i].job.workingYears) {
                      case 'no':
                        res.body.records[i].job.workingYears = '经验不限'
                        break;
                      case 'ltOneYears':
                        res.body.records[i].job.workingYears = '一年以下'
                        break;
                      case 'geOneYears':
                        res.body.records[i].job.workingYears = '一年以上'
                        break;
                      case 'oneYears':
                        res.body.records[i].job.workingYears = '一年'
                        break;
                      case 'betweenOneAndTwoYears':
                        res.body.records[i].job.workingYears = '1-2年'
                        break;
                      case 'twoYears':
                        res.body.records[i].job.workingYears = '2年'
                        break;
                      case 'geTwoYears':
                        res.body.records[i].job.workingYears = '2年以上'
                        break;
                      case 'betweenOneAndThreeYears':
                        res.body.records[i].job.workingYears = "1-3年";
                        break;
                      case 'betweenTwoAndThreeYears':
                        res.body.records[i].job.workingYears = '2-3年'
                        break;
                      case 'betweenThreeAndFiveYears':
                        res.body.records[i].job.workingYears = '3-5年'
                        break;
                      case 'geFiveYears':
                        res.body.records[i].job.workingYears = '5年以上'
                        break;
                      case 'betweenFiveAndTenYears':
                        res.body.records[i].job.workingYears = "5-10年";
                        break;
                      case 'geTenYears':
                        res.body.records[i].job.workingYears = "10年以上";
                        break;
                    }
                    if (res.body.records[i].labels) {
                      if (res.body.records[i].labels.length > 3) {
                        res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                      }
                    }
                  }
                  if (res.body.pages > 1) {
                    for (let i = 0; i < res.body.records.length; i++) {
                      that.data.contentList2.push(res.body.records[i])
                    }
                    that.setData({
                      contentList2: that.data.contentList2,
                      onlinepage: that.data.onlinepage + 1,
                      onlinepages: res.body.pages
                    })
                  } else {
                    that.setData({
                      contentList2: res.body.records,
                      onlinepage: that.data.onlinepage + 1,
                      onlinepages: res.body.pages
                    })
                  }
                })
              } else if (feature == 'scene') {

                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m < 10 ? m = '0' + m : m;
                let d = that.data.choicedate[0].riqi;
                let t = y + '-' + m + '-' + d + ' 00:00:00'
                that.setData({
                  today: t
                })
                that.xianC(t, that.data.xcpage)
              } else if (searchValue) {
                WXAPI.searchResult({
                  cityCode:that.data.cityCode,
                  content: searchValue,
                  lat: that.data.lat,
                  lng: that.data.lng
                }).then(function (res) {
                  console.log(res)
                  that.setData({
                    issearch: true
                  })
                  if (res.body.dataList.length == 0) {
                    that.setData({
                      nothing: true
                    })
                  } else {
                    that.setData({
                      nothing: false
                    })
                    for (var i in res.body.dataList) {
                      let a = res.body.dataList[i];
                      a.salaryMin = (a.salaryMin / 1000).toFixed(1)
                      a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                      if (a.labels != null) {
                        a.labels = a.labels.split(",");
                      } else {
                        a.labels = [];
                      }
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
                        case 'geOneYears':
                          a['gongzuonianxian'] = "1年以上";
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
                      }
                      if (res.body.dataList[i].labels) {
                        if (res.body.dataList[i].labels.length > 3) {
                          res.body.dataList[i].labels = res.body.dataList[i].labels.slice(0, 3)
                        }
                      }
                    }
                    that.setData({
                      contentList: res.body.dataList
                    })

                    for (let i = 0; i < that.data.contentList.length; i++) {
                      if (that.data.contentList[i].type == 'online') {
                        that.data.contentList[i].interviewTime = null
                      }
                    }
                    that.setData({
                      contentList: that.data.contentList,
                      searchpages: res.body.totalPages
                    })
                  }
                })
              }

              // WXAPI.searchResult({ areaCode: that.data.cityCode, current: 1, size: that.data.pageSize, content: that.data.searchkey, jobFeature: that.data.jobTrait, isGeneral: that.data.isGeneral, isRecommendReward: that.data.isRecommendReward, lng: that.data.lng, lat: that.data.lat }).then(function (res) {
              //   console.log(res)
              //   for (var i in res.body.dataList) {
              //     let a = res.body.dataList[i];
              //     if (a.labels!=null){
              //       a.labels = a.labels.split(",");
              //     }else{
              //       a.labels= [];
              //     }
              //     switch (a.education) {
              //       case 'no':
              //         a['xueliyaoqiu'] = "不限";
              //         break;
              //       case 'primary':
              //         a['xueliyaoqiu'] = "小学";
              //         break;
              //       case 'juniorHigh':
              //         a['xueliyaoqiu'] = "初中";
              //         break;
              //       case 'high':
              //         a['xueliyaoqiu'] = "高中";
              //         break;
              //       case 'technicalSecondary':
              //         a['xueliyaoqiu'] = "中专";
              //         break;
              //       case 'juniorCollege':
              //         a['xueliyaoqiu'] = "大专";
              //         break;
              //       case 'regularCollege':
              //         a['xueliyaoqiu'] = "本科";
              //         break;
              //       case 'master':
              //         a['xueliyaoqiu'] = "硕士";
              //         break;
              //       case 'doctor':
              //         a['xueliyaoqiu'] = "博士";
              //         break;
              //     }
              //     switch (a.workingYears) {
              //       case 'no':
              //         a['gongzuonianxian'] = "经验不限";
              //         break;
              //       case 'ltOneYears':
              //         a['gongzuonianxian'] = "1年以内";
              //         break;
              //       case 'geOneYears':
              //         a['gongzuonianxian'] = "1年以上";
              //         break;
              //       case 'betweenOneAndTwoYears':
              //         a['gongzuonianxian'] = "1-2年";
              //         break;
              //       case 'geTwoYears':
              //         a['gongzuonianxian'] = "2年以上";
              //         break;
              //       case 'betweenTwoAndThreeYears':
              //         a['gongzuonianxian'] = "2-3年";
              //         break;
              //       case 'betweenThreeAndFiveYears':
              //         a['gongzuonianxian'] = "3-5年";
              //         break;
              //       case 'geFiveYears':
              //         a['gongzuonianxian'] = "5年以上";
              //         break;
              //     }
              //   }
              //   that.setData({
              //     contentList: res.body.dataList
              //   })

              //   for (let i = 0; i < that.data.contentList.length; i++){
              //     if (that.data.contentList[i].type == 'online'){
              //       that.data.contentList[i].interviewTime = null
              //     }
              //   }
              //   that.setData({
              //     contentList: that.data.contentList
              //   })
              // });

              wx.hideLoading()
            },
            fail: function () {
              wx.showToast({
                title: '获取定位失败',
                icon: 'none',
                duration: 2000
              })
            },
          })
        }
      });
    }
    
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
   * 监听页面下拉
   */
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop;
    if (scrollTop >= 26 && !this.data.tabFixed) {
      this.setData({ tabFixed: true })
    }
    if (scrollTop < 26 && this.data.tabFixed) {
      this.setData({ tabFixed: false })
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
    let that = this;
    if (that.data.xianchang){
      switch (that.data.xianchangThis){
        case '0':
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            that.xianC(that.data.today, that.data.xcpage);
          }
          break;
        case '1':
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate() + 1;
            m < 10 ? m = '0' + m : m;
            d < 10 ? d = '0' + d : d;
            var ti = y + '-' + m + '-' + d + ' 00:00:00';
            that.xianC(ti, that.data.xcpage);
          }
          break;
        case '2':
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate() + 2;
            m < 10 ? m = '0' + m : m;
            d < 10 ? d = '0' + d : d;
            var ti = y + '-' + m + '-' + d + ' 00:00:00';
            that.xianC(ti, that.data.xcpage);
          }
          break;
        case '3':
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate() + 3;
            m < 10 ? m = '0' + m : m;
            d < 10 ? d = '0' + d : d;
            var ti = y + '-' + m + '-' + d + ' 00:00:00';
            that.xianC(ti, that.data.xcpage);
          }
          break;
        case '4':
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate() + 4;
            m < 10 ? m = '0' + m : m;
            d < 10 ? d = '0' + d : d;
            var ti = y + '-' + m + '-' + d + ' 00:00:00';
            that.xianC(ti, that.data.xcpage);
          }
          break;
        default:
          console.log(that.data.xcpage, that.data.rtpage)
          if (that.data.xcpage <= that.data.rtpage){
            that.xianC('', that.data.xcpage);
          }
      }
    }else{
      if (that.data.searchkey == '') {
        console.log(that.data.searchpage, that.data.searchpages)
        if (that.data.searchpage <= that.data.searchpages){
          console.log(that.data.allpostpage, that.data.allpostspage)
          if (that.data.allpostpage <= that.data.allpostspage) {
            let a = that.data.choiceRegionCode;
            if (that.data.cityCode == a) {
              a = ''
            }
            let diploma_str = ''
            let diplomalist = that.data.diploma
            for (let i in diplomalist) {
              diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
            }
            let trait_str='';
            for (let i in that.data.jobTrait) {
              trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
            }
            WXAPI.indexList({
              cityCode: that.data.cityCode,
              areaCode: a,
              lat: that.data.lat,
              lng: that.data.lng,
              featureList: trait_str,
              order: that.data.order,
              interViewTime: that.data.interViewTime,
              educationList: diploma_str,
              salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
              salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
              pageNum: that.data.allpostpage
            }).then(function (res) {
              console.log(res)
              for (let i = 0; i < res.body.records.length; i++) {
                let a = res.body.records[i].job
                a.salaryMin = (a.salaryMin / 1000).toFixed(1)
                a.salaryMax = (a.salaryMax / 1000).toFixed(1)
                switch (res.body.records[i].job.education) {
                  case 'no':
                    res.body.records[i].job.education = '学历不限'
                    break;
                  case 'juniorHigh':
                    res.body.records[i].job.education = '初中'
                    break;
                  case 'high':
                    res.body.records[i].job.education = '高中'
                    break;
                  case 'technicalSecondary':
                    res.body.records[i].job.education = '中专'
                    break;
                  case 'juniorCollege':
                    res.body.records[i].job.education = '大专'
                    break;
                  case 'regularCollege':
                    res.body.records[i].job.education = '本科'
                    break;
                  case 'master':
                    res.body.records[i].job.education = '硕士'
                    break;

                  case 'doctor':
                    res.body.records[i].job.education = '博士'
                    break;
                }
                switch (res.body.records[i].job.workingYears) {
                  case 'no':
                    res.body.records[i].job.workingYears = '经验不限'
                    break;
                  case 'ltOneYears':
                    res.body.records[i].job.workingYears = '一年以下'
                    break;
                  case 'geOneYears':
                    res.body.records[i].job.workingYears = '一年以上'
                    break;
                  case 'oneYears':
                    res.body.records[i].job.workingYears = '一年'
                    break;
                  case 'betweenOneAndTwoYears':
                    res.body.records[i].job.workingYears = '1-2年'
                    break;
                  case 'twoYears':
                    res.body.records[i].job.workingYears = '2年'
                    break;
                  case 'geTwoYears':
                    res.body.records[i].job.workingYears = '2年以上'
                    break;
                  case 'betweenOneAndThreeYears':
                    res.body.records[i].job.workingYears = "1-3年";
                    break;
                  case 'betweenTwoAndThreeYears':
                    res.body.records[i].job.workingYears = '2-3年'
                    break;
                  case 'betweenThreeAndFiveYears':
                    res.body.records[i].job.workingYears = '3-5年'
                    break;
                  case 'geFiveYears':
                    res.body.records[i].job.workingYears = '5年以上'
                    break;
                  case 'betweenFiveAndTenYears':
                    res.body.records[i].job.workingYears = "5-10年";
                    break;
                  case 'geTenYears':
                    res.body.records[i].job.workingYears = "10年以上";
                    break;
                }
                if (res.body.records[i].labels) {
                  if (res.body.records[i].labels.length > 3) {
                    res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                  }
                }
              }
              if (res.body.pages > 1) {
                for (let i = 0; i < res.body.records.length; i++) {
                  that.data.contentList2.push(res.body.records[i])
                }
                that.setData({
                  contentList2: that.data.contentList2,
                  allpostpage: that.data.allpostpage + 1,
                  allpostspage: res.body.pages
                })
              } else {
                that.setData({
                  contentList2: res.body.records,
                  allpostpage: that.data.allpostpage + 1,
                  allpostspage: res.body.pages
                })
              }
            })
          }
        }
        
      } else if (that.data.isGeneral == 'true') {
        if (that.data.generalpage <= that.data.generalpages){
          let a = that.data.choiceRegionCode;
          if (that.data.cityCode == a) {
            a = ''
          }
          let diploma_str = ''
          let diplomalist = that.data.diploma
          for (let i in diplomalist) {
            diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
          }
          let trait_str = '';
          for (let i in that.data.jobTrait) {
            trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
          }
          WXAPI.indexList({
            cityCode: that.data.cityCode,
            areaCode: a,
            lat: that.data.lat,
            lng: that.data.lng,
            featureList:trait_str,
            order: that.data.order,
            interViewTime: that.data.interViewTime,
            educationList: diploma_str,
            salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
            salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
            pageNum: that.data.generalpage
          }).then(function (res) {
            console.log(res)
            for (let i = 0; i < res.body.records.length; i++) {
              let a = res.body.records[i].job
              a.salaryMin = (a.salaryMin / 1000).toFixed(1)
              a.salaryMax = (a.salaryMax / 1000).toFixed(1)
              switch (res.body.records[i].job.education) {
                case 'no':
                  res.body.records[i].job.education = '不限'
                  break;
                case 'juniorHigh':
                  res.body.records[i].job.education = '初中'
                  break;
                case 'high':
                  res.body.records[i].job.education = '高中'
                  break;
                case 'technicalSecondary':
                  res.body.records[i].job.education = '中专'
                  break;
                case 'juniorCollege':
                  res.body.records[i].job.education = '大专'
                  break;
                case 'regularCollege':
                  res.body.records[i].job.education = '本科'
                  break;
                case 'master':
                  res.body.records[i].job.education = '硕士'
                  break;

                case 'doctor':
                  res.body.records[i].job.education = '博士'
                  break;
              }
              switch (res.body.records[i].job.workingYears) {
                case 'no':
                  res.body.records[i].job.workingYears = '经验不限'
                  break;
                case 'ltOneYears':
                  res.body.records[i].job.workingYears = '一年以下'
                  break;
                case 'geOneYears':
                  res.body.records[i].job.workingYears = '一年以上'
                  break;
                case 'oneYears':
                  res.body.records[i].job.workingYears = '一年'
                  break;
                case 'betweenOneAndTwoYears':
                  res.body.records[i].job.workingYears = '1-2年'
                  break;
                case 'twoYears':
                  res.body.records[i].job.workingYears = '2年'
                  break;
                case 'geTwoYears':
                  res.body.records[i].job.workingYears = '2年以上'
                  break;
                case 'betweenOneAndThreeYears':
                  res.body.records[i].job.workingYears = "1-3年";
                  break;
                case 'betweenTwoAndThreeYears':
                  res.body.records[i].job.workingYears = '2-3年'
                  break;
                case 'betweenThreeAndFiveYears':
                  res.body.records[i].job.workingYears = '3-5年'
                  break;
                case 'geFiveYears':
                  res.body.records[i].job.workingYears = '5年以上'
                  break;
                case 'betweenFiveAndTenYears':
                  res.body.records[i].job.workingYears = "5-10年";
                  break;
                case 'geTenYears':
                  res.body.records[i].job.workingYears = "10年以上";
                  break;
              }
              if (res.body.records[i].labels) {
                if (res.body.records[i].labels.length > 3) {
                  res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                }
              }
            }
            if (res.body.pages > 1) {
              for (let i = 0; i < res.body.records.length; i++) {
                that.data.contentList2.push(res.body.records[i])
              }
              that.setData({
                contentList2: that.data.contentList2,
                generalpage: that.data.generalpage + 1,
                generalpages: res.body.pages
              })
            } else {
              that.setData({
                contentList2: res.body.records,
                generalpage: that.data.generalpage + 1,
                generalpages: res.body.pages
              })
            }
          })
        }
        
      } else if (that.data.jobTrait == 'online') {
        if (that.data.onlinepage <= that.data.onlinepages){
          let a = that.data.choiceRegionCode;
          if (that.data.cityCode == a) {
            a = ''
          }
          let diploma_str = ''
          let diplomalist = that.data.diploma
          for (let i in diplomalist) {
            diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
          }
          WXAPI.indexList({
            cityCode: that.data.cityCode,
            areaCode: a,
            lat: that.data.lat,
            lng: that.data.lng,
            featureList:'online',
            order: that.data.order,
            interViewTime: that.data.interViewTime,
            educationList: diploma_str,
            salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
            salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
            pageNum: that.data.onlinepage
          }).then(function (res) {
            console.log(res)
            for (let i = 0; i < res.body.records.length; i++) {
              let a = res.body.records[i].job
              a.salaryMin = (a.salaryMin / 1000).toFixed(1)
              a.salaryMax = (a.salaryMax / 1000).toFixed(1)
              switch (res.body.records[i].job.education) {
                case 'no':
                  res.body.records[i].job.education = '不限'
                  break;
                case 'juniorHigh':
                  res.body.records[i].job.education = '初中'
                  break;
                case 'high':
                  res.body.records[i].job.education = '高中'
                  break;
                case 'technicalSecondary':
                  res.body.records[i].job.education = '中专'
                  break;
                case 'juniorCollege':
                  res.body.records[i].job.education = '大专'
                  break;
                case 'regularCollege':
                  res.body.records[i].job.education = '本科'
                  break;
                case 'master':
                  res.body.records[i].job.education = '硕士'
                  break;

                case 'doctor':
                  res.body.records[i].job.education = '博士'
                  break;
              }
              switch (res.body.records[i].job.workingYears) {
                case 'no':
                  res.body.records[i].job.workingYears = '经验不限'
                  break;
                case 'ltOneYears':
                  res.body.records[i].job.workingYears = '一年以下'
                  break;
                case 'geOneYears':
                  res.body.records[i].job.workingYears = '一年以上'
                  break;
                case 'oneYears':
                  res.body.records[i].job.workingYears = '一年'
                  break;
                case 'betweenOneAndTwoYears':
                  res.body.records[i].job.workingYears = '1-2年'
                  break;
                case 'twoYears':
                  res.body.records[i].job.workingYears = '2年'
                  break;
                case 'geTwoYears':
                  res.body.records[i].job.workingYears = '2年以上'
                  break;
                case 'betweenOneAndThreeYears':
                  res.body.records[i].job.workingYears = "1-3年";
                  break;
                case 'betweenTwoAndThreeYears':
                  res.body.records[i].job.workingYears = '2-3年'
                  break;
                case 'betweenThreeAndFiveYears':
                  res.body.records[i].job.workingYears = '3-5年'
                  break;
                case 'geFiveYears':
                  res.body.records[i].job.workingYears = '5年以上'
                  break;
                case 'betweenFiveAndTenYears':
                  res.body.records[i].job.workingYears = "5-10年";
                  break;
                case 'geTenYears':
                  res.body.records[i].job.workingYears = "10年以上";
                  break;
              }
              if (res.body.records[i].labels) {
                if (res.body.records[i].labels.length > 3) {
                  res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
                }
              }
            }
            if (res.body.pages > 1) {
              for (let i = 0; i < res.body.records.length; i++) {
                that.data.contentList2.push(res.body.records[i])
              }
              that.setData({
                contentList2: that.data.contentList2,
                onlinepage: that.data.onlinepage + 1,
                onlinepages: res.body.pages
              })
            } else {
              that.setData({
                contentList2: res.body.records,
                onlinepage: that.data.onlinepage + 1,
                onlinepages: res.body.pages
              })
            }
          })
        }
      } else if (that.data.issearch){
        that.setData({
          searchpage: that.data.searchpage + 1
        })
        if (that.data.searchpage > that.data.searchpages) return;
        let labelArr = that.data.labelList;
        let sureLabelArr = [];
        let labelId_str = ''
        let areaCode = that.data.choiceRegionCode;
        if (areaCode == that.data.cityCode) {
          areaCode = ''
        }
        for (let i in labelArr) {
          if (labelArr[i].isChecked == true) {
            sureLabelArr.push(labelArr[i].id);
          }
        }
        for (let i in sureLabelArr) {
          labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
        }
        let interViewTime = ''
        if (that.data.interViewTime == '0') {
          interViewTime = '';
        } else {
          interViewTime = that.data.interViewTime;
        }
        let diploma_str = ''
        let diplomalist = that.data.diploma
        for (let i in diplomalist) {
          diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
        }
        let trait_str = '';
        for (let i in that.data.jobTrait) {
          trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
        }
        WXAPI.searchResult({
          current: that.data.searchpage,
          content: that.data.searchValue,
          areaCode: areaCode,
          labelIds: labelId_str,
          featureList: trait_str,
          educationList: diploma_str,
          salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
          salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
          interviewTime: interViewTime,
          // order: that.data.order,
          lat: that.data.lat,
          lng: that.data.lng
        }).then(function (res) {
          console.log(res)
          that.setData({
            issearch: true
          })
          if (res.body.dataList.length == 0) {
            that.setData({
              nothing: true
            })
          } else {
            that.setData({
              nothing: false
            })
            for (var i in res.body.dataList) {
              let a = res.body.dataList[i];
              if (a.labels != null) {
                a.labels = a.labels.split(",");
              } else {
                a.labels = [];
              }
              switch (a.education) {
                case 'no':
                  a['xueliyaoqiu'] = "不限";
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
                case 'geOneYears':
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
              }
              if (res.body.dataList[i].labels) {
                if (res.body.dataList[i].labels.length > 3) {
                  res.body.dataList[i].labels = res.body.dataList[i].labels.slice(0, 3)
                }
              }
              that.data.contentList.push(a)
            }
            that.setData({
              contentList: that.data.contentList
            })

            for (let i = 0; i < that.data.contentList.length; i++) {
              if (that.data.contentList[i].type == 'online') {
                that.data.contentList[i].interviewTime = null
              }
            }
            that.setData({
              contentList: that.data.contentList
            })
          }
        })
      }
      // let pageNum = that.data.pageNum + 1;
      // let labelArr = that.data.labelList;
      // let sureLabelArr = [];
      // let labelId_str = ''
      // let areaCode = that.data.choiceRegionCode;
      // for (let i in labelArr) {
      //   if (labelArr[i].isChecked == true) {
      //     sureLabelArr.push(labelArr[i].id);
      //   }
      // }
      // for (let i in sureLabelArr) {
      //   labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
      // }
      // let interViewTime = ''
      // if (that.data.interViewTime == '0') {
      //   interViewTime = '';
      // } else {
      //   interViewTime = that.data.interViewTime;
      // }

      // WXAPI.searchResult({ areaCode: areaCode, content: that.data.searchkey, jobFeature: that.data.jobTrait, labelIds: labelId_str, order: that.data.order, interViewTime: interViewTime, education: that.data.diploma, salaryMin: that.data.minSalary, salaryMax: that.data.maxSalary, current: pageNum, size: that.data.pageSize, lng: that.data.lng, lat: that.data.lat, isGeneral: that.data.isGeneral, isRecommendReward: that.data.isRecommendReward }).then(function (res) {
      //   console.log(res)
      //   let list = that.data.contentList;
      //   for (var i in res.body.dataList) {
      //     let a = res.body.dataList[i];
      //     if (a.labels != null) {
      //       a.labels = a.labels.split(",");
      //     } else {
      //       a.labels = [];
      //     }
      //     switch (a.education) {
      //       case 'no':
      //         a['xueliyaoqiu'] = "不限";
      //         break;
      //       case 'primary':
      //         a['xueliyaoqiu'] = "小学";
      //         break;
      //       case 'juniorHigh':
      //         a['xueliyaoqiu'] = "初中";
      //         break;
      //       case 'high':
      //         a['xueliyaoqiu'] = "高中";
      //         break;
      //       case 'technicalSecondary':
      //         a['xueliyaoqiu'] = "中专";
      //         break;
      //       case 'juniorCollege':
      //         a['xueliyaoqiu'] = "大专";
      //         break;
      //       case 'regularCollege':
      //         a['xueliyaoqiu'] = "本科";
      //         break;
      //       case 'master':
      //         a['xueliyaoqiu'] = "硕士";
      //         break;
      //       case 'doctor':
      //         a['xueliyaoqiu'] = "博士";
      //         break;
      //     }
      //     switch (a.workingYears) {
      //       case 'no':
      //         a['gongzuonianxian'] = "经验不限";
      //         break;
      //       case 'ltOneYears':
      //         a['gongzuonianxian'] = "1年以内";
      //         break;
      //       case 'geOneYears':
      //         a['gongzuonianxian'] = "1年以上";
      //         break;
      //       case 'betweenOneAndTwoYears':
      //         a['gongzuonianxian'] = "1-2年";
      //         break;
      //       case 'geTwoYears':
      //         a['gongzuonianxian'] = "2年以上";
      //         break;
      //       case 'betweenTwoAndThreeYears':
      //         a['gongzuonianxian'] = "2-3年";
      //         break;
      //       case 'betweenThreeAndFiveYears':
      //         a['gongzuonianxian'] = "3-5年";
      //         break;
      //       case 'geFiveYears':
      //         a['gongzuonianxian'] = "5年以上";
      //         break;
      //     }
      //     list.push(a)
      //   }
      //   that.setData({
      //     contentList: list,
      //     pageNum: pageNum
      //   })
      // });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  choice:function(e){
    let that = this;
    let page = 1;
    that.setData({
      xianchangThis: e.currentTarget.dataset.choice
    })
    let t = '';
    if (e.currentTarget.dataset.choice != 'all'){
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m < 10 ? m = '0' + m : m;
      let d = that.data.choicedate[e.currentTarget.dataset.choice].riqi;
      t = y + '-' + m + '-' + d + ' 00:00:00'
    }
    that.xianC(t, page)
  },
  xianC: function (t, pageNum){
    let that = this;
    console.log(t, pageNum)
    WXAPI.indexList({
      featureList:'scene',
      cityCode: that.data.cityCode,
      lat: that.data.lat,
      lng: that.data.lng,
      interViewTime: t,
      pageNum: pageNum,
      pageSize: that.data.pageSize
    }).then(function (res) {
      console.log(res)
      if(res.body.records.length == 0){
        that.setData({
          nothing:true
        })
      } else {
        that.setData({
          nothing: false
        })
      }
      for (let i = 0; i < res.body.records.length; i++) {
        let a = res.body.records[i].job
        a.salaryMin = (a.salaryMin / 1000).toFixed(1)
        a.salaryMax = (a.salaryMax / 1000).toFixed(1)
        switch (res.body.records[i].job.education) {
          case 'no':
            res.body.records[i].job.education = '不限'
            break;
          case 'juniorHigh':
            res.body.records[i].job.education = '初中'
            break;
          case 'high':
            res.body.records[i].job.education = '高中'
            break;
          case 'technicalSecondary':
            res.body.records[i].job.education = '中专'
            break;
          case 'juniorCollege':
            res.body.records[i].job.education = '大专'
            break;
          case 'regularCollege':
            res.body.records[i].job.education = '本科'
            break;
          case 'master':
            res.body.records[i].job.education = '硕士'
            break;

          case 'doctor':
            res.body.records[i].job.education = '博士'
            break;
        }
        switch (res.body.records[i].job.workingYears) {
          case 'no':
            res.body.records[i].job.workingYears = '经验不限'
            break;
          case 'ltOneYears':
            res.body.records[i].job.workingYears = '一年以下'
            break;
          case 'geOneYears':
            res.body.records[i].job.workingYears = '一年以上'
            break;
          case 'oneYears':
            res.body.records[i].job.workingYears = '一年'
            break;
          case 'betweenOneAndTwoYears':
            res.body.records[i].job.workingYears = '1-2年'
            break;
          case 'twoYears':
            res.body.records[i].job.workingYears = '2年'
            break;
          case 'geTwoYears':
            res.body.records[i].job.workingYears = '2年以上'
            break;
          case 'betweenOneAndThreeYears':
            res.body.records[i].job.workingYears = "1-3年";
            break;
          case 'betweenTwoAndThreeYears':
            res.body.records[i].job.workingYears = '2-3年'
            break;
          case 'betweenThreeAndFiveYears':
            res.body.records[i].job.workingYears = '3-5年'
            break;
          case 'geFiveYears':
            res.body.records[i].job.workingYears = '5年以上'
            break;
          case 'betweenFiveAndTenYears':
            res.body.records[i].job.workingYears = "5-10年";
            break;
          case 'geTenYears':
            res.body.records[i].job.workingYears = "10年以上";
            break;
        }
        if (res.body.records[i].labels) {
          if (res.body.records[i].labels.length > 3) {
            res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
          }
        }
      }
      if (res.body.current > 1){
        for (let i = 0; i < res.body.records.length; i++){
          that.data.contentList2.push(res.body.records[i])
        }
        that.setData({
          contentList2: that.data.contentList2,
          xcpage: that.data.xcpage + 1,
          rtpage: res.body.pages
        })
      }else{
          that.setData({
          contentList2: res.body.records,
          xcpage: that.data.xcpage + 1,
          rtpage: res.body.pages
        })
      }
      console.log(that.data.contentList2)
    })
  },
  jump:function(e){
    let that = this;
    wx.navigateTo({ url: `../recruitDetail/recruitDetail?id=${e.currentTarget.dataset.id}&cityCode=${that.data.cityCode}&interviewTime=${e.currentTarget.dataset.interviewtime ? e.currentTarget.dataset.interviewtime : ''}` })
  },
  showScreenCon: function (e) {
    let code = e.currentTarget.dataset.id;
    console.log(code)
    this.setData({
      sureThisValue: true,
      selectShow: code
    })
  },
  sureThisValue: function (e) {
    let that = this;
    let code = e.currentTarget.dataset.id;
    if(code == that.data.cityCode){
      that.setData({
        selectedName: '全成都'
      })
    }else{
      for (let i = 0; i < that.data.regionList.length; i++) {
        if (code == that.data.regionList[i].code) {
          that.data.selectedName = that.data.regionList[i].name
        }
      }
    }
    if (code == that.data.cityCode){
      that.setData({
        choiceRegionCode:''
      })
    }else{
      that.setData({
        choiceRegionCode: code,
      })
    }
    this.setData({
      selectedName: that.data.selectedName
    })
    if (that.data.issearch){
      that.so();
    }else{
      that.exam();
    }
  },
  selectShow: function (e) {

    let code = e.currentTarget.dataset.id;
    if (code == this.data.selectShow){
      this.setData({
        sureThisValue: false
      })
      return false;
    }
    this.setData({
      selectShow: code
    })
  },
  choiceTrait:function(e){
    if(e.currentTarget.dataset.only){
      return false
    }
    let that = this;
    let value = e.currentTarget.dataset.value;
    let data = that.data.jobTrait;
    let showdata = this.data.traitList;
    console.log(value,data)
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
  choiceThisLable: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let lableArr = that.data.labelList;
    lableArr[index].isChecked = !lableArr[index].isChecked;
    that.setData({
      labelList: lableArr
    });
    console.log(that.data.labelList, index)
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
  choiceSalary: function (e) {
    let that = this;
    let min = e.currentTarget.dataset.min;
    let max = e.currentTarget.dataset.max;
    that.setData({
      minSalary: min,
      maxSalary: max
    });
  },
  cancelAllLable: function () {
    let that = this;
    let labelArr = that.data.labelList;
    that.cleartraitList()
    for (let i in labelArr) {
      labelArr[i].isChecked = false;
    }
    for (let i in that.data.diplomaList) {
      that.data.diplomaList[i].checked = false;
    }
    if (that.data.isGeneral == 'true' ){
      that.setData({
        isGeneral: true
      })
    } else{
      that.setData({
        isGeneral: false
      })
    }
    that.setData({
      jobTrait: that.data.traitonly?[]:that.data.jobTrait,
      labelList: labelArr,
      diploma: [],
      minSalary: '',
      maxSalary: '',
      salarytext:'无限',
      low: 0,
      heigh:46,
    })

    setTimeout(()=>{
      that.submitValue()
    },500)
  },
  cleartraitList(){
    if(this.data.traitonly){
      let data = this.data.traitList;
      data.map(item=>{
        item.checked = false
      })
      this.setData({traitList:data})
    }
  },
  submitValue: function () {
    let that = this;
    that.setData({
      searchpage:1,
      allpostpage: 2
    })
    if (that.data.issearch) {
      that.so();
    } else {
      that.exam();
    }
  },
  choiceTime: function (e) {
    let that = this;
    wx.showLoading({
      title: '加载中'
    })
      let time = e.currentTarget.dataset.date;
      // let m1 = time.split('-')[1];
      // let d1 = time.split('-')[2];
      //   m1 < 10 ? m1 = '0' + m1 : m1;
      //   d1 < 10 ? d1 = '0' + d1 : d1;
      //   let sj = time.split('-')[0] + '-' + m1 + '-' + d1 + ' 00:00:00'
      //   console.log(sj)
      // that.setData({
      //   interViewTime: sj
      // })
      
      if (time != '0') {
        let m = time.split('-')[1];
        let d = time.split('-')[2];
        m < 10 ? m = '0' + m : m;
        d < 10 ? d = '0' + d : d;
        let sj = time.split('-')[0] + '-' + m + '-' + d + ' 00:00:00';
          that.setData({
          interViewTime: sj
        })
        if (that.data.issearch) {
          that.setData({
            interViewTime: sj.split(' ')[0]
          })
          that.so();
        } else {
          that.exam();
        }
        // let cTimeArr = [];
        // setTimeout(function () {
        //   for (let i = 0; i < that.data.contentList2.length; i++) {
        //     if (that.data.contentList2[i].interviewTime) {
        //       if (that.data.contentList2[i].interviewTime.split(' ')[0].split('-')[0] == m && that.data.contentList2[i].interviewTime.split(' ')[0].split('-')[1] == d) {
        //         cTimeArr.push(that.data.contentList2[i])
        //       }
        //     }
        //   }
        //   that.setData({
        //     contentList2: cTimeArr
        //   })
          wx.hideLoading();
        // }, 500)
      } else {
        that.setData({
          interViewTime: ''
        })
        if (that.data.issearch) {
          that.so();
        } else {
          that.exam();
        }
        // that.setData({
        //   contentList2: that.data.contentList2
        // })
        wx.hideLoading()
      }
  },
  choiceOrder: function (e) {
    let that = this;
    let order = e.currentTarget.dataset.value;
    that.setData({
      order: order
    })
    console.log(order)
    if (that.data.issearch) {
      that.setData({
        contentList: [],
        searchpage: 1
      })
      let labelArr = that.data.labelList;
      let sureLabelArr = [];
      let labelId_str = ''
      let diploma_str = ''
      let areaCode = that.data.choiceRegionCode;
      if (areaCode == that.data.cityCode) {
        areaCode = ''
      }
      for (let i in labelArr) {
        if (labelArr[i].isChecked == true) {
          sureLabelArr.push(labelArr[i].id);
        }
      }
      let diplomalist = that.data.diploma
      for (let i in diplomalist) {
        diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
      }
      for (let i in sureLabelArr) {
        labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
      }
      let interViewTime = ''
      if (that.data.interViewTime == '0') {
        interViewTime = '';
      } else {
        interViewTime = that.data.interViewTime;
      }
      let trait_str = '';
      for (let i in that.data.jobTrait) {
        trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
      }
      WXAPI.searchResult({
        current: 1,
        cityCode:that.data.cityCode,
        content: that.data.searchValue,
        areaCode: areaCode,
        labelIds: labelId_str,
        featureList: trait_str,
        educationList: diploma_str,
        salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
        salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
        interviewTime: interViewTime,
        order: that.data.order,
        lat: that.data.lat,
        lng: that.data.lng
      }).then(function (res) {
        console.log(res)
        that.setData({
          sureThisValue: false,
          issearch: true
        })
        if (res.body.dataList.length == 0) {
          that.setData({
            nothing: true
          })
        } else {
          that.setData({
            nothing: false
          })
          for (var i in res.body.dataList) {
            let a = res.body.dataList[i];
            a.salaryMin = (a.salaryMin / 1000).toFixed(1)
            a.salaryMax = (a.salaryMax / 1000).toFixed(1)
            if (a.labels != null) {
              a.labels = a.labels.split(",");
            } else {
              a.labels = [];
            }
            switch (a.education) {
              case 'no':
                a['xueliyaoqiu'] = "不限";
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
              case 'geOneYears':
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
            }
            if (res.body.dataList[i].labels) {
              if (res.body.dataList[i].labels.length > 3) {
                res.body.dataList[i].labels = res.body.dataList[i].labels.slice(0, 3)
              }
            }
          }
          that.setData({
            contentList: res.body.dataList
          })

          for (let i = 0; i < that.data.contentList.length; i++) {
            if (that.data.contentList[i].type == 'online') {
              that.data.contentList[i].interviewTime = null
            }
          }
          that.setData({
            contentList: that.data.contentList
          })
        }
      })
    } else {
      that.exam();
    }
  },

  so:function(){
    let that = this;
    that.setData({
      contentList: [],
      searchpage:1
    })
    let labelArr = that.data.labelList;
    let sureLabelArr = [];
    let labelId_str = ''
    let areaCode = that.data.choiceRegionCode;
    if (areaCode == that.data.cityCode) {
      areaCode = ''
    }
    for (let i in labelArr) {
      if (labelArr[i].isChecked == true) {
        sureLabelArr.push(labelArr[i].id);
      }
    }
    for (let i in sureLabelArr) {
      labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
    }
    let interViewTime = ''
    if (that.data.interViewTime == '0') {
      interViewTime = '';
    } else {
      interViewTime = that.data.interViewTime;
    }
    let diploma_str = ''
    let diplomalist = that.data.diploma
    for (let i in diplomalist) {
      diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
    }
    let trait_str = '';
    for (let i in that.data.jobTrait) {
      trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
    }
    WXAPI.searchResult({
      cityCode:that.data.cityCode,
      current: 1,
      content: that.data.searchValue,
      areaCode: areaCode,
      labelIds: labelId_str,
      featureList: trait_str,
      educationList: diploma_str,
      salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
      salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
      interviewTime: interViewTime,
      // order: that.data.order,
      lat: that.data.lat,
      lng: that.data.lng
    }).then(function (res) {
      console.log(res)
      that.setData({
        sureThisValue: false,
        issearch: true
      })
      if (res.body.dataList.length == 0) {
        that.setData({
          nothing: true
        })
      } else {
        that.setData({
          nothing: false
        })
        for (var i in res.body.dataList) {
          let a = res.body.dataList[i];
          a.salaryMin = (a.salaryMin / 1000).toFixed(1)
          a.salaryMax = (a.salaryMax / 1000).toFixed(1)
          if (a.labels != null) {
            a.labels = a.labels.split(",");
          } else {
            a.labels = [];
          }
          switch (a.education) {
            case 'no':
              a['xueliyaoqiu'] = "不限";
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
            case 'geOneYears':
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
          }
          if (res.body.dataList[i].labels) {
            if (res.body.dataList[i].labels.length > 3) {
              res.body.dataList[i].labels = res.body.dataList[i].labels.slice(0, 3)
            }
          }
          // that.data.contentList.push(a)
        }
        that.setData({
          contentList: res.body.dataList
        })

        for (let i = 0; i < that.data.contentList.length; i++) {
          if (that.data.contentList[i].type == 'online') {
            that.data.contentList[i].interviewTime = null
          }
        }
        that.setData({
          contentList: that.data.contentList
        })
      }
    })
  },

  exam: function () {
    let that = this;
    let labelArr = that.data.labelList;
    let sureLabelArr = [];
    let labelId_str = ''
    let areaCode = that.data.choiceRegionCode;
    if (areaCode == that.data.cityCode){
      areaCode = ''
    }
    for (let i in labelArr) {
      if (labelArr[i].isChecked == true) {
        sureLabelArr.push(labelArr[i].id);
      }
    }
    for (let i in sureLabelArr) {
      labelId_str += sureLabelArr[i] + (parseInt(i) < sureLabelArr.length - 1 ? ',' : '');
    }
    let interViewTime = ''
    if (that.data.interViewTime == '0') {
      interViewTime = '';
    } else {
      interViewTime = that.data.interViewTime;
    }
    let diploma_str = ''
    let diplomalist = that.data.diploma
    for (let i in diplomalist) {
      diploma_str += diplomalist[i] + (parseInt(i) < diplomalist.length - 1 ? ',' : '');
    }
    let trait_str = '';
    for (let i in that.data.jobTrait) {
      trait_str += that.data.jobTrait[i] + (parseInt(i) < that.data.jobTrait.length - 1 ? ',' : '');
    }
    WXAPI.indexList({
      labelId: labelId_str,
      cityCode: that.data.cityCode,
      areaCode: areaCode,
      featureList:trait_str,
      lat: that.data.lat,
      lng: that.data.lng,
      order: that.data.order,
      interViewTime: interViewTime,
      educationList: diploma_str,
      salaryMin: that.data.minSalary?that.data.minSalary*1000:'',
      salaryMax: that.data.maxSalary?that.data.maxSalary*1000:'',
      pageNum: 1
    }).then(function (res) {
      console.log(res)
      if(res.body.records.length == 0){
        that.setData({
          nothing:true
        })
      } else {
        that.setData({
          nothing: false
        })
      }
      for (let i = 0; i < res.body.records.length; i++) {
        let a = res.body.records[i].job
        a.salaryMin = (a.salaryMin / 1000).toFixed(1)
        a.salaryMax = (a.salaryMax / 1000).toFixed(1)
        switch (res.body.records[i].job.education) {
          case 'no':
            res.body.records[i].job.education = '不限'
            break;
          case 'juniorHigh':
            res.body.records[i].job.education = '初中'
            break;
          case 'high':
            res.body.records[i].job.education = '高中'
            break;
          case 'technicalSecondary':
            res.body.records[i].job.education = '中专'
            break;
          case 'juniorCollege':
            res.body.records[i].job.education = '大专'
            break;
          case 'regularCollege':
            res.body.records[i].job.education = '本科'
            break;
          case 'master':
            res.body.records[i].job.education = '硕士'
            break;

          case 'doctor':
            res.body.records[i].job.education = '博士'
            break;
        }
        switch (res.body.records[i].job.workingYears) {
          case 'no':
            res.body.records[i].job.workingYears = '经验不限'
            break;
          case 'ltOneYears':
            res.body.records[i].job.workingYears = '一年以下'
            break;
          case 'geOneYears':
            res.body.records[i].job.workingYears = '一年以上'
            break;
          case 'oneYears':
            res.body.records[i].job.workingYears = '一年'
            break;
          case 'betweenOneAndTwoYears':
            res.body.records[i].job.workingYears = '1-2年'
            break;
          case 'twoYears':
            res.body.records[i].job.workingYears = '2年'
            break;
          case 'geTwoYears':
            res.body.records[i].job.workingYears = '2年以上'
            break;
          case 'betweenOneAndThreeYears':
            res.body.records[i].job.workingYears = "1-3年";
            break;
          case 'betweenTwoAndThreeYears':
            res.body.records[i].job.workingYears = '2-3年'
            break;
          case 'betweenThreeAndFiveYears':
            res.body.records[i].job.workingYears = '3-5年'
            break;
          case 'geFiveYears':
            res.body.records[i].job.workingYears = '5年以上'
            break;
          case 'betweenFiveAndTenYears':
            res.body.records[i].job.workingYears = "5-10年";
            break;
          case 'geTenYears':
            res.body.records[i].job.workingYears = "10年以上";
            break;
        }
        if (res.body.records[i].labels) {
          if (res.body.records[i].labels.length > 3) {
            res.body.records[i].labels = res.body.records[i].labels.slice(0, 3)
          }
        }
      }
      that.setData({
        sureThisValue: !that.data.sureThisValue,
        contentList2: res.body.records,
        searchpage: that.data.searchpage + 1,
        searchpages: res.body.pages
      })
    })
    
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
      this.setData({maxSalary:e.detail/2==0.5?1:e.detail/2})
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
// pages/recruitDetail/recruitDetail.js
const WXAPI = require('../../utils/util');
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    isShowNav:false,
    active:1,
    nav1Top:0,
    nav2Top:0,
    nav3Top:0,
    nav4Top:0,
    id:'',
    cityCode:'',
    lat:'',
    lng:'',
    applyFlag:false,
    applyId:'',
    interviewApplyList:[],
    interviewTime:'',
    company:'',
    companyPhoto:'',
    companyLogo:'',
    companyid:'',
    job:'',
    labels:[],
    jobDutyShow:false,
    requireShow:false,
    requirements:'',
    publisher:'',
    similarJobList:[],
    showMOre1:false,
    showMOre2: false,
    isShowApply:false,
    

    gerenxingxi:false,
    gongzuojinli:false,
    jiaoyujingli:false,
    onlyapply:false,
    viewtimetishi:false,

    phone:'',
    interviewt:'',         //保存一个面试时间  申请面试时比较是否已经过了
    text:'',                   //职位发布者下方需要展示的富文本消息
    //个人信息 
      userid:'',                       //用户id
      sex: '',                         // 性别
      email: '',                       // 邮箱
      birthday: '',                    //生日
      recordOfFormalSchoolingName: '', //学历
      graduationTime:'',               //毕业时间
      participatingInWorkTime: '',     //参加工作时间
      homeName: '',                    //家乡
      areaName: '',                    //现居住地
      personalAdvantage: '',           //个人优势
      jobHuntingIntention: '',          //求职意向

      workExperienceList: [],           //工作经历
      educationExperienceList: [],       //教育经历
      mslat: '',                         //面试地址经纬度
      mslng: '',
      worklat: '',                       //工作地址经纬度
      worklng: '',

      seeurl:''                          //查看竞争力外链
      ,jobsharedFlag:false
      ,imready:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    let cityCode = options.cityCode;
    console.log(options)
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          id:id,
          cityCode: cityCode,
          lat: latitude,
          lng: longitude,
          interviewTime:options.interviewTime
        });
        console.log('11111')
        console.log(id,longitude,latitude,cityCode,options.interviewTime)
        WXAPI.jobResult({ id: id, lng: longitude, lat: latitude, cityCode: cityCode ? cityCode : '', interviewTime: that.data.interviewTime ? that.data.interviewTime:'' }).then(function (res) {
          let a = res.body.job
          console.log(res)
          if (a.workingTime){
            let am = a.workingTime.split(' ')[1].substring(0, 5);
            let pm = a.offWorkingTime.split(' ')[1].substring(0, 5);
            a.workingTime = am + ' - ' + pm;
          }
          a.salaryMins = (a.salaryMin / 1000).toFixed(1)
          a.salaryMaxs = (a.salaryMax / 1000).toFixed(1)
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
              a['gongzuonianxian'] = "1年以内";
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
          switch (a.siesta) {
            case 'min30':
              a['wuxiu'] = "30分钟";
              break;
            case 'min45':
              a['wuxiu'] = "45分钟";
              break;
            case 'hours1':
              a['wuxiu'] = "1个小时";
              break;
            case 'hours2':
              a['wuxiu'] = "2个小时";
              break;
            case 'unfixed':
              a['wuxiu'] = "不定";
              break;
            case 'no':
              a['wuxiu'] = "无";
              break;
          }
           
          if (a.interviewTime!=null){
            let str = "周";
            let date = new Date(a.interviewTime);
            let week = date.getDay();
            switch (week) {
              case 0:
                str += "日";
                break;
              case 1:
                str += "一";
                break;
              case 2:
                str += "二";
                break;
              case 3:
                str += "三";
                break;
              case 4:
                str += "四";
                break;
              case 5:
                str += "五";
                break;
              case 6:
                str += "六";
                break;
            }
            a["mianshishijian"] = date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours()+ ":" + date.getMinutes();
          }else{
            a["mianshishijian"]='等待面试通知'
          }
          for (let i in res.body.similarJobList){
            let b = res.body.similarJobList[i];
            b.salaryMins = (b.salaryMin / 1000).toFixed(1)
            b.salaryMaxs = (b.salaryMax / 1000).toFixed(1)
            switch (b.education) {
              case 'no':
                b['xueliyaoqiu'] = "不限";
                break;
              case 'primary':
                b['xueliyaoqiu'] = "小学";
                break;
              case 'juniorHigh':
                b['xueliyaoqiu'] = "初中";
                break;
              case 'high':
                b['xueliyaoqiu'] = "高中";
                break;
              case 'technicalSecondary':
                b['xueliyaoqiu'] = "中专";
                break;
              case 'juniorCollege':
                b['xueliyaoqiu'] = "大专";
                break;
              case 'regularCollege':
                b['xueliyaoqiu'] = "本科";
                break;
              case 'master':
                b['xueliyaoqiu'] = "硕士";
                break;
              case 'doctor':
                b['xueliyaoqiu'] = "博士";
                break;
            }
            switch (b.workingYears) {
              case 'no':
                b['gongzuonianxian'] = "经验不限";
                break;
              case 'ltOneYears':
                b['gongzuonianxian'] = "1年以内";
                break;
              case 'oneYears':
                b['gongzuonianxian'] = "1年";
                break;
              case 'geOneYears':
                b['gongzuonianxian'] = "1年以上";
                break;
              case 'betweenOneAndTwoYears':
                b['gongzuonianxian'] = "1-2年";
                break;
              case 'twoYears':
                b['gongzuonianxian'] = "2年";
                break;
              case 'betweenOneAndThreeYears':
                b['gongzuonianxian'] = "1-3年";
                break;
              case 'geTwoYears':
                b['gongzuonianxian'] = "2年以上";
                break;
              case 'betweenTwoAndThreeYears':
                b['gongzuonianxian'] = "2-3年";
                break;
              case 'betweenThreeAndFiveYears':
                b['gongzuonianxian'] = "3-5年";
                break;
              case 'geFiveYears':
                b['gongzuonianxian'] = "5年以上";
                break;
              case 'betweenFiveAndTenYears':
                b['gongzuonianxian'] = "5-10年";
                break;
              case 'geTenYears':
                b['gongzuonianxian'] = "10年以上";
                break;
            }
            if (b.interviewTime != null) {
              // let str = "周";
              // let date = new Date(b.interviewTime);
              // let week = date.getDay();
              // switch (week) {
              //   case 0:
              //     str += "日";
              //     break;
              //   case 1:
              //     str += "一";
              //     break;
              //   case 2:
              //     str += "二";
              //     break;
              //   case 3:
              //     str += "三";
              //     break;
              //   case 4:
              //     str += "四";
              //     break;
              //   case 5:
              //     str += "五";
              //     break;
              //   case 6:
              //     str += "六";
              //     break;
              // }
              // date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours() + ":" + date.getMinutes();
              b["mianshishijian"] = b.interviewTime
            } else {
              b["mianshishijian"] = '等待通知'
            }
            if (b.labels != null) {
              b.labels = b.labels.split(",");
            } else {
              b.labels = [];
            }
            if (res.body.similarJobList[i].labels) {
              if (res.body.similarJobList[i].labels.length > 3) {
                res.body.similarJobList[i].labels = res.body.similarJobList[i].labels.slice(0, 3)
              }
            }
          }
          let jobDutyShow = false;
          let requireShow = false;
          if(res.body.labels){
            for(let i of res.body.labels){
              if(i.type=='jobDuty'){
                jobDutyShow = true
              }else if(i.type=='require'){
                requireShow = true
              }
            }
          }
          
          that.setData({
            jobDutyShow:jobDutyShow,
            requireShow:requireShow,
            applyFlag: res.body.applyFlag,
            interviewFlag: res.body.interviewFlag,
            applyId: res.body.applyId,
            interviewApplyList: res.body.interviewApplyList,
            company: res.body.company,
            companyPhoto: res.body.companyPhoto,
            companyLogo: res.body.companyLogo,
            companyid: res.body.company.id,
            job: a,
            labels: res.body.labels,
            requirements: res.body.requirements,
            publisher: res.body.publisher,
            similarJobList: res.body.similarJobList,
            interviewt: res.body.job.interviewTime,
            text: res.body.job.content,
            mslat: res.body.job.interviewAddressLat,
            mslng: res.body.job.interviewAddressLng,
            worklat: res.body.job.lat,
            worklng: res.body.job.lng,
          })
          WxParse.wxParse('text', 'html', res.body.job.content, that)
        });
      }
    });
    WXAPI.myResume().then(function (res) {
      console.log(res)
      if(res.body.status == 401){
        that.setData({
          userid: res.body.userId,                    //用户id
          sex: res.body.sex,                         // 性别
          email: res.body.email,                       // 邮箱
          birthday: res.body.birthday,                    //生日
          recordOfFormalSchoolingName: res.body.recordOfFormalSchoolingName, //学历
          graduationTime: res.body.graduationTime,               //b毕业时间
          participatingInWorkTime: res.body.participatingInWorkTime,     //参加工作时间
          homeName: res.body.homeName,                    //家乡
          areaName: res.body.areaName,                    //现居住地
          personalAdvantage: res.body.personalAdvantage,           //个人优势
          jobHuntingIntention: res.body.jobHuntingIntention,          //求职意向
          workExperienceList: [],                                    //工作经历
          educationExperienceList: []                           //教育经历
        })
      }else{
        that.setData({
          userid: res.body.userId,                    //用户id
          sex: res.body.sex,                         // 性别
          email: res.body.email,                       // 邮箱
          birthday: res.body.birthday,                    //生日
          recordOfFormalSchoolingName: res.body.recordOfFormalSchoolingName, //学历
          graduationTime: res.body.graduationTime,               //b毕业时间
          participatingInWorkTime: res.body.participatingInWorkTime,     //参加工作时间
          homeName: res.body.homeName,                    //家乡
          areaName: res.body.areaName,                    //现居住地
          personalAdvantage: res.body.personalAdvantage,           //个人优势
          jobHuntingIntention: res.body.jobHuntingIntention,          //求职意向
          workExperienceList: res.body.workExperienceList,           //工作经历
          educationExperienceList: res.body.educationExperienceList       //教育经历
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
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    //取距离顶部高度 //res就是 所有标签为mjltest的元素的信息 的数组
    query.select('#nav1').boundingClientRect(function (res) {that.setData({nav1Top:res.top});}).exec();

    var query1 = wx.createSelectorQuery();
    query1.select('#nav2').boundingClientRect(function (res) { that.setData({ nav2Top: res.top }); }).exec();
    
    var query2 = wx.createSelectorQuery();
    query2.select('#nav3').boundingClientRect(function (res) { that.setData({ nav3Top: res.top }); }).exec();
    
    var query3 = wx.createSelectorQuery();
    query3.select('#nav4').boundingClientRect(function (res) { that.setData({ nav4Top: res.top }); }).exec();

    WXAPI.jobResult({ id: that.data.id, lng: that.data.lng, lat: that.data.lat, interviewTime: that.data.interviewTime }).then(function (res) {
      let a = res.body.job
      console.log(res)
      if (a.workingTime) {
        let am = a.workingTime.split(' ')[1].substring(0, 5);
        let pm = a.offWorkingTime.split(' ')[1].substring(0, 5);
        a.workingTime = am + ' - ' + pm;
      }
      a.salaryMins =(a.salaryMin / 1000).toFixed(1)
      a.salaryMaxs = (a.salaryMax / 1000).toFixed(1)
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
          a['gongzuonianxian'] = "1年以内";
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
      switch (a.siesta) {
        case 'min30':
          a['wuxiu'] = "30分钟";
          break;
        case 'min45':
          a['wuxiu'] = "45分钟";
          break;
        case 'hours1':
          a['wuxiu'] = "1个小时";
          break;
        case 'hours2':
          a['wuxiu'] = "2个小时";
          break;
        case 'unfixed':
          a['wuxiu'] = "不定";
          break;
        case 'no':
          a['wuxiu'] = "无";
          break;
      }

      if (a.interviewTime != null) {
        let str = "周";
        let date = new Date(a.interviewTime);
        let week = date.getDay();
        switch (week) {
          case 0:
            str += "日";
            break;
          case 1:
            str += "一";
            break;
          case 2:
            str += "二";
            break;
          case 3:
            str += "三";
            break;
          case 4:
            str += "四";
            break;
          case 5:
            str += "五";
            break;
          case 6:
            str += "六";
            break;
        }
        a["mianshishijian"] = date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours() + ":" + date.getMinutes();
      } else {
        a["mianshishijian"] = '等待面试通知'
      }
      for (let i in res.body.similarJobList) {
        let b = res.body.similarJobList[i];
        b.salaryMins = (b.salaryMin / 1000).toFixed(1)
        b.salaryMaxs = (b.salaryMax / 1000).toFixed(1)
        switch (b.education) {
          case 'no':
            b['xueliyaoqiu'] = "不限";
            break;
          case 'primary':
            b['xueliyaoqiu'] = "小学";
            break;
          case 'juniorHigh':
            b['xueliyaoqiu'] = "初中";
            break;
          case 'high':
            b['xueliyaoqiu'] = "高中";
            break;
          case 'technicalSecondary':
            b['xueliyaoqiu'] = "中专";
            break;
          case 'juniorCollege':
            b['xueliyaoqiu'] = "大专";
            break;
          case 'regularCollege':
            b['xueliyaoqiu'] = "本科";
            break;
          case 'master':
            b['xueliyaoqiu'] = "硕士";
            break;
          case 'doctor':
            b['xueliyaoqiu'] = "博士";
            break;
        }
        switch (b.workingYears) {
          case 'no':
            b['gongzuonianxian'] = "经验不限";
            break;
          case 'ltOneYears':
            b['gongzuonianxian'] = "1年以内";
            break;
          case 'oneYears':
            b['gongzuonianxian'] = "1年";
            break;
          case 'geOneYears':
            b['gongzuonianxian'] = "1年以上";
            break;
          case 'betweenOneAndTwoYears':
            b['gongzuonianxian'] = "1-2年";
            break;
          case 'twoYears':
            b['gongzuonianxian'] = "2年";
            break;
          case 'betweenOneAndThreeYears':
            b['gongzuonianxian'] = "1-3年";
            break;
          case 'geTwoYears':
            b['gongzuonianxian'] = "2年以上";
            break;
          case 'betweenTwoAndThreeYears':
            b['gongzuonianxian'] = "2-3年";
            break;
          case 'betweenThreeAndFiveYears':
            b['gongzuonianxian'] = "3-5年";
            break;
          case 'geFiveYears':
            b['gongzuonianxian'] = "5年以上";
            break;
          case 'betweenFiveAndTenYears':
            b['gongzuonianxian'] = "5-10年";
            break;
          case 'geTenYears':
            b['gongzuonianxian'] = "10年以上";
            break;
        }
        if (b.interviewTime != null) {
          // let str = "周";
          // let date = new Date(b.interviewTime);
          // let week = date.getDay();
          // switch (week) {
          //   case 0:
          //     str += "日";
          //     break;
          //   case 1:
          //     str += "一";
          //     break;
          //   case 2:
          //     str += "二";
          //     break;
          //   case 3:
          //     str += "三";
          //     break;
          //   case 4:
          //     str += "四";
          //     break;
          //   case 5:
          //     str += "五";
          //     break;
          //   case 6:
          //     str += "六";
          //     break;
          // }
          // date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours() + ":" + date.getMinutes();
          b["mianshishijian"] = b.interviewTime
        } else {
          b["mianshishijian"] = '等待通知'
        }
        if (b.labels != null) {
          b.labels = b.labels.split(",");
        } else {
          b.labels = [];
        }
        if (res.body.similarJobList[i].labels) {
          if (res.body.similarJobList[i].labels.length > 3) {
            res.body.similarJobList[i].labels = res.body.similarJobList[i].labels.slice(0, 3)
          }
        }
      }
      let jobDutyShow = false;
      let requireShow = false;
      if(res.body.labels){
        for(let i of res.body.labels){
          if(i.type=='jobDuty'){
            jobDutyShow = true
          }else if(i.type=='require'){
            requireShow = true
          }
        }
      }
      that.setData({
        jobDutyShow:jobDutyShow,
        requireShow:requireShow,
        applyFlag: res.body.applyFlag,
        interviewFlag: res.body.interviewFlag,
        applyId: res.body.applyId,
        interviewApplyList: res.body.interviewApplyList,
        company: res.body.company,
        companyPhoto: res.body.companyPhoto,
        companyLogo: res.body.companyLogo,
        companyid: res.body.company.id,
        job: a,
        labels: res.body.labels,
        requirements: res.body.requirements,
        publisher: res.body.publisher,
        similarJobList: res.body.similarJobList,
        interviewt: res.body.job.interviewTime,
        text: res.body.job.content,
      })
      WxParse.wxParse('text', 'html', res.body.job.content, that)
      console.log(that.data.similarJobList)
    });
    
  },
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop;
    if (scrollTop >= 150 && !this.data.isShowNav) {
      this.setData({ isShowNav: true })
    }
    if (scrollTop < 150 && this.data.isShowNav) {
      this.setData({ isShowNav: false })
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
    let that= this;
    console.log('333')
    WXAPI.jobResult({ id: that.data.id, lng: that.data.lng, lat: that.data.lat, cityCode: that.data.cityCode, interviewTime: that.data.interviewTime }).then(function (res) {
      console.log(res)
      let a = res.body.job
      if (a.workingTime) {
        let am = a.workingTime.split(' ')[1].substring(0, 5);
        let pm = a.offWorkingTime.split(' ')[1].substring(0, 5);
        a.workingTime = am + ' - ' + pm;
      }
      a.salaryMins =  (a.salaryMin / 1000).toFixed(1)
      a.salaryMaxs =  (a.salaryMax / 1000).toFixed(1)
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
          a['gongzuonianxian'] = "1年以内";
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
      switch (a.siesta) {
        case 'min30':
          a['wuxiu'] = "30分钟";
          break;
        case 'min45':
          a['wuxiu'] = "45分钟";
          break;
        case 'hours1':
          a['wuxiu'] = "1个小时";
          break;
        case 'hours2':
          a['wuxiu'] = "2个小时";
          break;
        case 'unfixed':
          a['wuxiu'] = "不定";
          break;
        case 'no':
          a['wuxiu'] = "没有";
          break;
      }

      if (a.interviewTime != null) {
        let str = "周";
        let date = new Date(a.interviewTime);
        let week = date.getDay();
        switch (week) {
          case 0:
            str += "日";
            break;
          case 1:
            str += "一";
            break;
          case 2:
            str += "二";
            break;
          case 3:
            str += "三";
            break;
          case 4:
            str += "四";
            break;
          case 5:
            str += "五";
            break;
          case 6:
            str += "六";
            break;
        }
        a["mianshishijian"] = date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours() + ":" + date.getMinutes();
      } else {
        a["mianshishijian"] = '等待通知'
      }
      for (let i in res.body.similarJobList) {
        let b = res.body.similarJobList[i];
        b.salaryMins = (b.salaryMin / 1000).toFixed(1)
        b.salaryMaxs = (b.salaryMax / 1000).toFixed(1)
        switch (b.education) {
          case 'no':
            b['xueliyaoqiu'] = "不限";
            break;
          case 'primary':
            b['xueliyaoqiu'] = "小学";
            break;
          case 'juniorHigh':
            b['xueliyaoqiu'] = "初中";
            break;
          case 'high':
            b['xueliyaoqiu'] = "高中";
            break;
          case 'technicalSecondary':
            b['xueliyaoqiu'] = "中专";
            break;
          case 'juniorCollege':
            b['xueliyaoqiu'] = "大专";
            break;
          case 'regularCollege':
            b['xueliyaoqiu'] = "本科";
            break;
          case 'master':
            b['xueliyaoqiu'] = "硕士";
            break;
          case 'doctor':
            b['xueliyaoqiu'] = "博士";
            break;
        }
        switch (b.workingYears) {
          case 'no':
            b['gongzuonianxian'] = "经验不限";
            break;
          case 'ltOneYears':
            b['gongzuonianxian'] = "1年以内";
            break;
          case 'oneYears':
            b['gongzuonianxian'] = "1年";
            break;
          case 'geOneYears':
            b['gongzuonianxian'] = "1年以上";
            break;
          case 'betweenOneAndTwoYears':
            b['gongzuonianxian'] = "1-2年";
            break;
          case 'twoYears':
            b['gongzuonianxian'] = "2年";
            break;
          case 'betweenOneAndThreeYears':
            b['gongzuonianxian'] = "1-3年";
            break;
          case 'geTwoYears':
            b['gongzuonianxian'] = "2年以上";
            break;
          case 'betweenTwoAndThreeYears':
            b['gongzuonianxian'] = "2-3年";
            break;
          case 'betweenThreeAndFiveYears':
            b['gongzuonianxian'] = "3-5年";
            break;
          case 'geFiveYears':
            b['gongzuonianxian'] = "5年以上";
            break;
          case 'betweenFiveAndTenYears':
            b['gongzuonianxian'] = "5-10年";
            break;
          case 'geTenYears':
            b['gongzuonianxian'] = "10年以上";
            break;
        }
        if (b.interviewTime != null) {
          let str = "周";
          let date = new Date(b.interviewTime);
          let week = date.getDay();
          switch (week) {
            case 0:
              str += "日";
              break;
            case 1:
              str += "一";
              break;
            case 2:
              str += "二";
              break;
            case 3:
              str += "三";
              break;
            case 4:
              str += "四";
              break;
            case 5:
              str += "五";
              break;
            case 6:
              str += "六";
              break;
          }
          b["mianshishijian"] = date.getMonth() + 1 + "月" + date.getDate() + "日(" + str + ") " + date.getHours() + ":" + date.getMinutes();
        } else {
          b["mianshishijian"] = '等待通知'
        }
        if (b.labels != null) {
          b.labels = b.labels.split(",");
        } else {
          b.labels = [];
        }
      }
      let jobDutyShow = false;
      let requireShow = false;
      if(res.body.labels){
        for(let i of res.body.labels){
          if(i.type=='jobDuty'){
            jobDutyShow = true
          }else if(i.type=='require'){
            requireShow = true
          }
        }
      }
      that.setData({
        jobDutyShow:jobDutyShow,
        requireShow:requireShow,
        applyFlag: res.body.applyFlag,
        interviewFlag: res.body.interviewFlag,
        applyId: res.body.applyId,
        interviewApplyList: res.body.interviewApplyList,
        company: res.body.company,
        companyPhoto: res.body.companyPhoto,
        companyLogo: res.body.companyLogo,
        job: a,
        labels: res.body.labels,
        requirements: res.body.requirements,
        publisher: res.body.publisher,
        similarJobList: res.body.similarJobList,
      })
      wx.stopPullDownRefresh();
    });
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
  scrollTo:function(e){
    var nub = e.currentTarget.dataset.nub;
    if(nub == 1){
      this.setData({ active: 1 });
      wx.pageScrollTo({
        scrollTop: this.data.nav1Top - 45,
        duration: 300
      })
    } else if (nub == 2){
      this.setData({ active: 2 });
      wx.pageScrollTo({
        scrollTop: this.data.nav2Top - 45,
        duration: 300
      })
    } else if (nub == 3){
      this.setData({ active: 3 });
      wx.pageScrollTo({
        scrollTop: this.data.nav3Top - 45,
        duration: 300
      })
    }else{
      this.setData({ active: 4 });
      wx.pageScrollTo({
        scrollTop: this.data.nav4Top - 45,
        duration: 300
      })
    }
  },
  seeadd: function (e) {
    console.log(e)
    let that = this;
    // if (that.data.job.type != 'online'){
    //   if (!that.data.applyFlag) return;
    // }
    
    
    if (e.target.dataset.ip == '1'){
      wx.openLocation({
        latitude: that.data.mslat,
        longitude: that.data.mslng,
        name: that.data.job.interviewAddress
      })
    } else if (e.target.dataset.ip == '2'){
      wx.openLocation({
        latitude: that.data.worklat,
        longitude: that.data.worklng,
        name: that.data.job.workingAddress
      })
    }
    
  },
  call:function(){
    let that = this;
    if (!that.data.applyFlag){
      wx.showToast({
        title:'申请面试后才能电话沟通哦~',
        icon:'none'
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: that.data.publisher.phone
    })
  },
  seeCompetitive:function(){
    let that = this;
    if (that.data.job.applyNumber < 10){
      wx.showToast({
        title:'申请人数过少，不足以分析数据',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '../outPage/outPage?src=https://app.jobpoolhr.com/h5/page/seeCompetitive.html#jobId!' + that.data.id + '%userId!' + that.data.userid
      })
      // that.setData({
      //   seeurl: 'https://tiger.quanjikj.com/api/h5/page/seeCompetitive.html?jobId=' + that.data.id + '&userId=' + that.data.userid
      // })
    }
  },
  cha:function(){
    let that = this;
    wx.navigateTo({
      url: '../ProgressDetail/ProgressDetail?id=' + that.data.applyId
    })
  },
  // 开关监听
  changeSwitch(e){
    console.log(e,e.detail.value)
    let _type = e.currentTarget.dataset.info;
    if(_type == 'exist'){
      this.setData({existLaborRelationship:e.detail.value})
      if(!e.detail.value){
        this.setData({signedLaborContract:e.detail.value,payedSocialSecurity:e.detail.value})
      }
    }else if(_type == 'contract'){
      this.setData({signedLaborContract:e.detail.value})
    }else if(_type == 'security'){
      this.setData({payedSocialSecurity:e.detail.value})
    }else if(_type == 'imready'){
      this.setData({imready:e.detail.value})
    }
  },
  applyInterview:function(){
    /*wx.showModal({
      title: '温馨提示',
      content: '是否申请面试',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })*/
    let that = this;
    // WXAPI.getUserInfo().then(function(res){
      if (!wx.getStorageSync('token')){
        wx.showModal({
          title: '您还没有登录',
          content: '登录后才能申请哦~',
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: '../AuthorizedLogin/AuthorizedLogin'
              })
            }
          }
        })
      } else {
        WXAPI.myResume().then(function (res) {
          console.log(res)
          that.setData({
            userid: res.body.userId,                    //用户id
            sex: res.body.sex,                         // 性别
            email: res.body.email,                       // 邮箱
            birthday: res.body.birthday,                    //生日
            recordOfFormalSchoolingName: res.body.recordOfFormalSchoolingName, //学历
            graduationTime: res.body.graduationTime,               //b毕业时间
            participatingInWorkTime: res.body.participatingInWorkTime,     //参加工作时间
            homeName: res.body.homeName,                    //家乡
            areaName: res.body.areaName,                    //现居住地
            personalAdvantage: res.body.personalAdvantage,           //个人优势
            jobHuntingIntention: res.body.jobHuntingIntention,          //求职意向
            workExperienceList: res.body.workExperienceList,           //工作经历
            educationExperienceList: res.body.educationExperienceList,       //教育经历
            existLaborRelationship : res.body.existLaborRelationship ,
            signedLaborContract:res.body.signedLaborContract,
            payedSocialSecurity:res.body.payedSocialSecurity,
            imready:false
          })
          if (
            !that.data.sex || !that.data.email || !that.data.birthday || !that.data.graduationTime || !that.data.participatingInWorkTime || !that.data.homeName || !that.data.areaName || !that.data.personalAdvantage || !that.data.jobHuntingIntention
          ) {
            that.setData({
              gerenxingxi: true
            })
          }
          if (that.data.workExperienceList.length == 0 && that.data.job.jobExperience) {
            that.setData({
              gongzuojinli: true,
            })
          }
          if (that.data.educationExperienceList.length == 0 && that.data.job.educationExperience) {
            that.setData({
              jiaoyujingli: true,
            })
          }
          if(that.data.interviewTime){
            let $inttime = that.data.interviewTime.split(' ')[0]
            let $nowtime = that.getNowFormatDate()
            console.log($inttime,$nowtime)
            if($inttime == $nowtime){
              let tidaytimetishi = that.data.job.interviewTimeString.split(' ')
              console.log(tidaytimetishi)
              that.setData({
                viewtimetishi:true,
                newtidaytimetishi:tidaytimetishi[0]+'(今天)'+tidaytimetishi[2]
              })

            }
          }
          if( that.data.gongzuojinli || that.data.jiaoyujingli){
            that.setData({
              onlyapply:true,
            })
          }else{
            that.setData({
              onlyapply:false
            })
          }
          console.log(that.data.onlyapply,that.data.gongzuojinli,that.data.jiaoyujingli,that.data.viewtimetishi)
          if( that.data.gongzuojinli || that.data.jiaoyujingli  || that.data.viewtimetishi ){
            that.setData({
              isShowApply:true
            })
          }else if(that.data.job.jobShared){
            that.setData({
              jobsharedFlag: true,
            })
          }else{
            that.sureSubApply()
          }
        })

        
      }
    // })
  },
  showMore:function(e){
    let that = this;
    let a = e.currentTarget.dataset.value;
    if(a == 1){
      that.setData({
        showMOre1: !that.data.showMOre1
      })
    }else{
      that.setData({
        showMOre2: !that.data.showMOre2
      })
    }
  },
  cancleApply:function(){
    let that = this;
    that.setData({
      isShowApply: false
    })
  },
  cancleApply2:function(){
    let that = this;
    that.setData({
      jobsharedFlag: false
    })
  },
  richtext:function(){
    console.log('富文本')
    wx.navigateTo({
      url: '../richText/richText'
    })
  },
  sureSubApply2(){
    WXAPI.saveUserEmploy({existLaborRelationship:this.data.existLaborRelationship,signedLaborContract:this.data.signedLaborContract,payedSocialSecurity:this.data.payedSocialSecurity})
    .then(res=>{
      console.log(res)
      if(res.code==200){
        this.cancleApply2()
        if(!this.data.isShowApply){
          this.sureSubApply()
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
      }
    })
  },
  sureSubApply:function(){
    let that = this;
    that.setData({
      isShowApply: false
    })
    // if (!that.data.requirements.perfectingEducationExperience || !that.data.requirements.perfectingWorkExperience){
    //   return;
    // }else{
    if (that.data.job.type == 'scene' && that.data.interviewt){
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();
        let h = date.getHours();
        let min = date.getMinutes();
        m < 10 ? m = '0' + m : m;
        d < 10 ? d = '0' + d : d;
        h < 10 ? h = '0' + h : h;
        min < 10 ? min = '0' + min : min;
        
        let joby = that.data.interviewt.split(' ')[0].split('-')[0];
        let jobm = that.data.interviewt.split(' ')[0].split('-')[1];
        let jobd = that.data.interviewt.split(' ')[0].split('-')[2];
        let jobh = that.data.interviewt.split(' ')[1].split('-')[0];
        let jobmin = that.data.interviewt.split(' ')[1].split('-')[1];

        if (y > joby) {
          wx.showToast({
            title: '面试时间已过，看看其他职位吧~',
            icon: 'none'
          })
          return;
        }
        if (m > jobm) {
          wx.showToast({
            title: '面试时间已过，看看其他职位吧~',
            icon: 'none'
          })
          return;
        }
        if (h > jobh) {
          wx.showToast({
            title: '面试时间已过，看看其他职位吧~',
            icon: 'none'
          })
          return;
        }
        if (min > jobmin) {
          wx.showToast({
            title: '面试时间已过，看看其他职位吧~',
            icon: 'none'
          })
          return;
        } 
      }
    console.log(that.data.job)
    WXAPI.submitApply({
      jobId: that.data.job.id, 
      ivBeginTime: that.data.job.ivBeginTime ? that.data.job.ivBeginTime:'',
      interviewTime: that.data.job.interviewTime ? that.data.job.interviewTime:'',
      interviewTimeString: that.data.job.interviewTimeString ? that.data.job.interviewTime:'' }).then(function (res) {
        if (!res.status){
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
          return false;
        }
        wx.navigateTo({
          url: '/pages/submitSuccess/submitSuccess?id=' + res.body
        })
      })
    // }
  },
  goComplete:function(e){
    this.setData({isShowApply:false})
    if (e.currentTarget.dataset.url == "educationExp"){
      wx.navigateTo({ url: '../../packageA/pages/educationExp/educationExp' });
    } else if (e.currentTarget.dataset.url == "workExp"){
      wx.navigateTo({ url: '../../packageA/pages/workExp/workExp' })}
  },
  jump: function(e){
    wx.navigateTo({ url: `../recruitDetail/recruitDetail?id=${e.currentTarget.dataset.id}&interviewTime=${e.currentTarget.dataset.time ? e.currentTarget.dataset.time : ''}` })
  },

  gongsixiangqin:function(){
    wx.navigateTo({ url: '../companyInfo/companyInfo?id=' + this.data.companyid })
  },
  // 获取当前日期
  getNowFormatDate() {
    let date = new Date()
    let seperator1 = "-"
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
})



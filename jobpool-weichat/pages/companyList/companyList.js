// pages/companyList/companyList.js
const app = getApp();
const WXAPI = require('../../utils/util');
const tcity = require("../../utils/citys.js");
Page({
  data: {
    imgIp: WXAPI.imgIp,
    selectShow:'',
    scrollHeight:0,
    searchValue:'',
    city:'',
    cityCode:'',
    lscode:"",
    lat:'',
    lng:'',
    current:1,
    pages:null,
    choiceRegionCode:'',
    noposition: false,   //用户拒绝定位
    companyScale:[],  // 公司规模
    companyindustry:[],   //  公司行业
    scaleList:[],
    industryList:[],   // 行业
    order:'AUTO',     // 推荐
    ordertext:'推荐排序',
    companyList:[],   // 公司列表
    islogin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.calculateScrollViewHeight()  // 计算屏幕滚动窗口高度
    this.getcitycode(options)
    this.getcompany()   // 获取公司列表
    this.getconditions()    // 获取筛选条件等

  },
  onShow: function () {
    if (this.data.companyList.length == 0){
      this.getcompany()   // 获取公司列表
      this.getconditions()    // 获取筛选条件等
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  onPullDownRefresh: function () {
    console.log('下拉')
    let that = this;
    that.setData({
      current: 1,
      order: 'AUTO',
      ordertext:'推荐排序',
      companyindustry:[],
      searchValue:'',
      companyScale:[]
    })
    that.getcompany()
    wx.stopPullDownRefresh()
  },
  // 计算scroll-view的高度
  calculateScrollViewHeight(){
    console.log('123')
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    let query = wx.createSelectorQuery().in(this);
    // 然后逐个取出navbar和header的节点信息
    // 选择器的语法与jQuery语法相同
    query.select('.header').boundingClientRect();
    query.select('.filterLable').boundingClientRect();
    query.exec((res) => {
      
      // console.log(res)
      // 分别取出navbar和header的高度
      let navbarHeight = res[0].height;
      let headerHeight = res[1].height;
  

      // 然后就是做个减法
      let scrollViewHeight = this.data.windowHeight - headerHeight - navbarHeight;
      console.log(scrollViewHeight)

      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight
      });
    });
  },
  // 期望地址or定位城市
  getcitycode(options){
    var that= this;
    tcity.init(that);
    let cityData = that.data.cityData;
    var lat_ = '';
    var log_ = '';
    // 登录
    let token = wx.getStorageSync('token');
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
          that.getcompany()
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: '获取定位失败',
            icon: 'none',
            duration: 2000
          })
          that.getcompany()
        },
      })
    }else{
      console.log('nononoo')
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
            if(res.body.expectWorkPlace && token){
              var gzdarr = [];
              var showaddress=''
              for (let i = 0; i < cityData.length; i++) {
                console.log(res.body.expectWorkPlace)
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
                choiceRegionCode: res.body.expectWorkPlace,
                expectIndustry:res.body.expectIndustry
              });
              that.getcompany()
            }else{
              console.log('notoken')
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
                  that.getcompany()
                },
                fail: function (res) {
                  console.log(res)
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
    }
  },
  getcompany(){
    console.log('获取公司列表')
    if(this.data.cityCode == ''){
      return
    }
    var that = this;
    let params = {name:this.data.searchValue,appletsIndustryIds:JSON.stringify(this.data.companyindustry),appletsScaleIds:JSON.stringify(this.data.companyScale),cityCode:this.data.cityCode,order:this.data.order,expectIndustry:this.data.expectIndustry,pageNum:this.data.current}
    WXAPI.companylist(params).then(function (res){
      console.log(res)
      if(res.code== -101){
        return that.setData({islogin:false})
      }
      let alldata;
      if(res.body.current == 1){
        alldata = res.body.records
      }else{
        alldata = [...that.data.companyList,...res.body.records]
      }
      that.setData({
        companyList:alldata,
        current:res.body.current,
        pages:res.body.pages,
        islogin:true
      })
    });
  },
  
  loadData(){
    // 加载数据
    console.log(this.data.current,this.data.pages)
    var that = this;
    if(that.data.current<that.data.pages){
      that.setData({current:that.data.current+1})
      that.getcompany()
    }else{
      return false
    }
  },
  // 搜索输入
  inputSearch(e){
    console.log(e)
    this.setData({
      searchValue:e.detail.value,
      current:1
    })
    var that = this;
    var timer = this.data.timer
    clearTimeout(timer) 
    timer = setTimeout(function () {
      that.getcompany()
    }, 1500)
    this.setData({
      timer:timer
    })
  },
  // 筛选条件
  getconditions(){
    let that = this;
    WXAPI.industrylist().then(function (res) {
      console.log(res)
      if(res.code == -101){
        return
      }
      res.body.map(item=>{
        item.checked = false;
      })
      that.setData({industryList:res.body})
    });
    WXAPI.scalelist().then(function (res) {
      console.log(res)
      if(res.code == -101){
        return false
      }
      res.body.map(item=>{
        item.checked = false;
      })
      that.setData({scaleList:res.body})
    });
  },
  selectShow(e){      // 条件列表选择
    let index = e.currentTarget.dataset.id;
    if(index == 1){    // 选择城市
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
    }
    else if (index == this.data.selectShow){
      this.setData({
        selectShow: ''
      })
      return false;
    }else{
      this.setData({
        selectShow: index
      })
    }
    
  },

  choiceScale(e){    // 公司规模选择
    let that = this;
    let value = e.currentTarget.dataset.value;
    let data = this.data.companyScale;
    let showdata = this.data.scaleList;
    console.log(value)
    if(value == undefined){
      return false
    }
    let _index = data.indexOf(value)
    if(_index == -1){
      data.push(value)
    }else{
      data.splice(_index,1)
    }
    showdata.map(item=>{
      if(item.id == value){
        item.checked = !item.checked;
      }
    })
    console.log(data,showdata)
    this.setData({companyScale:data,scaleList:showdata})
  },
  choiceIndustry(e){   // 所属行业
    let that = this;
    let value = e.currentTarget.dataset.value;
    let data = that.data.companyindustry;
    console.log(value)
    let showdata = this.data.industryList;
    console.log(value)
    if(value == undefined){
      return false
    }
    let _index = data.indexOf(value)
    if(_index == -1){
      data.push(value)
    }else{
      data.splice(_index,1)
    }
    showdata.map(item=>{
      if(item.id == value){
        item.checked = !item.checked;
      }
    })
    console.log(data,showdata)
    this.setData({companyindustry:data,industryList:showdata})
  },
  choiceOrder(e){    //  推荐选择
    let that = this;
    let value = e.currentTarget.dataset.value;
    console.log(value)
    if(value == undefined){
      return false
    }
    that.setData({
      order:value,
      ordertext:value=='AUTO'?'推荐排序':'最近发布',
      current:1
    });
    this.closeModel()
    this.getcompany()
  },
  cancelAllLable(){   // 重置筛选
    let scaledata = this.data.scaleList
    let industrydata = this.data.industryList
    scaledata.map(item=>{
      item.checked = false;
    })
    industrydata.map(item=>{
      item.checked = false;
    })
    this.setData({
      scaleList:scaledata,
      industryList:industrydata,
      companyindustry:[],
      companyScale:[]
    })
  }, 
  submitValue(){      // 确认筛选
    this.setData({current:1})
    this.closeModel()
    this.getcompany()
  },
  closeModel(){
    this.setData({selectShow:''})
  },
  gocompanyInfo(e){
    let id = e.currentTarget.dataset.id;
    console.log(id)
    
    wx.navigateTo({ url: '../companyInfo/companyInfo?id=' + id })
  },
  login:function(){
    wx.navigateTo({
      url:'../AuthorizedLogin/AuthorizedLogin'
    })
  }
})
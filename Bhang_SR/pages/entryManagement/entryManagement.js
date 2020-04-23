// pages/entryManagement/entryManagement.js
import { getEntrylist } from '../../utils/api.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    tabbarNum:1,   // 未处理1、已处理2
    searchBar:false,   // 搜索框显示
    batchFlag:false,   // 批量选择显示
    ischeckedalltype:0,  // 全选方式
    checkedresult:[],   // 批量已选择
    searchValue:'',
    size:10,
    Pages:'',
    current:1,
    entryList:[],
    stopLoadMoreTiem:false,
    freeshFlag:false,
    batuserEntry:false,
    batuserReject:false,
    userReject:false,
    userEntry:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let datalist = wx.getStorageSync('Jurisdiction');
    if(datalist.indexOf('recruitmentProgress:refuseEntry')==-1){
      this.setData({
        userReject:true
      })
    }
    if(datalist.indexOf('recruitmentProgress:confirmEntry')==-1){
      this.setData({
        userEntry:true
      })
    }
    if(datalist.indexOf('recruitmentProgress:batchRefuseEntry')==-1){
      this.setData({
        batuserReject:true
      }) 
    }
    if(datalist.indexOf('recruitmentProgress:batchConfirmEntry')==-1){
      this.setData({
        batuserEntry:true
      }) 
    }
    console.log(this.data.jurisdiction)
  },
  onShow:function () {
    console.log('onshow')
    var that = this;
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        show:true,
        unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum
      })
    }
    // wx.showTabBar()
    that.setData({
      batchFlag:false,
      stopLoadMoreTiem:false,
      current:1,
      checkedresult:[]
    })
    let token = wx.getStorageSync('token');
    console.log(token)
    if(token){
      wx.pageScrollTo({
        scrollTop: 0,
        success:function() {
          console.log('回到顶部')
          that.getEntryList()
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      stopLoadMoreTiem:false,
      current:1,
      freeshFlag:true,
      checkedresult:[],
      ischeckedalltype:0
    })
    console.log('--------下拉刷新-------')
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    setTimeout(()=>{
      perpage.onLoad()
      wx.hideNavigationBarLoading() //完成停止加载  
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.showToast({
        title: '刷新成功',
        mask:true,
        duration: 2000
      });
      that.setData({
        freeshFlag:false
      })
    },1000)  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.stopLoadMoreTiem) {
      return;
    }
    console.log(that.data.current,that.data.Pages)
    if(that.data.current == that.data.Pages){
      wx.showToast({
        title: '没有更多了~~',
        image: '../../images/warn.png',
        mask:true,
        duration: 2000
      })
      that.setData({
        stopLoadMoreTiem:true
      })
      return ;
    }else{
      that.setData({
        stopLoadMoreTiem:true,
        current:that.data.current+1
      })
      that.getEntryList()
    }
  },
  // 获取入职信息
  getEntryList(){
    let that = this;
    let _type = that.data.tabbarNum==1?'waiting':'already'
    
    let params = {size:that.data.size,current:that.data.current,type:_type,content:that.data.searchValue}
    console.log(params)
    getEntrylist(params).then(res=>{
      console.log(res)
      if(res.status){
        // 处理信息
        res.body.records.map(item=>{
          if(item.status == 'confirmEntry') {
            item.entryFlag = 1
          }else if(item.status == 'refuseEntry'){
            item.entryFlag = 0
          }
          else{
            item.entryFlag = -1
          }
        })
        if(res.body.current == 1){
          that.setData({
            entryList:res.body.records,
            Pages:res.body.pages,
            current:res.body.current,
            stopLoadMoreTiem:false
          })
        }else{
          that.setData({
            entryList:that.data.entryList.concat(res.body.records),
            Pages:res.body.pages,
            current:res.body.current,
            stopLoadMoreTiem:false
          })
        }
      }
    })

  },
  // tabbar切换
  tabbarClick:function(e){
    var that = this;
    wx.pageScrollTo({
      scrollTop: 0,
      success:function() {
        console.log('回到顶部')
        that.closeAllcell()
        that.setData({
          tabbarNum:e.target.dataset.num,
          current:1,
          searchBar:false,
          searchValue:''
        })
        that.getEntryList()
      }
    })
  },
  // 收索框切换
  searchClick(){
    this.setData({
      searchBar:!this.data.searchBar,
    })
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
      that.getEntryList()
    }, 1000)
    this.setData({
      timer:timer
    })
  },
  // 右侧滑块点击事件
  enterReject(e) {
    this.setData({
      checkedresult:[e.currentTarget.dataset.applyid]
    })
    this.sendentryMsg('enterReject')
  },
  enterResolve(e) {
    this.setData({
      checkedresult:[e.currentTarget.dataset.applyid]
    })
    this.sendentryMsg('enterResolve')
  },

  onClose(event) {
    console.log('关闭滑块')
    const { position, instance } = event.detail;
    instance.close();
  },
  //touch start
  handleTouchStart: function(e) {    
    this.startTime = e.timeStamp;     
  },  
  //touch end
  handleTouchEnd: function(e) {    
    this.endTime = e.timeStamp;    
  }, 
  // 长按事件 
  handleLongPress: function(e) {    
    console.log("长按");
    this.closeAllcell()
    if(this.data.tabbarNum==2){
      return false
    }
    this.setData({batchFlag:true,checkedresult:[]}) 
    this.getTabBar().setData({
      show:false
    })
  },
  // 关闭批量
  batchBack(){
    this.setData({batchFlag:false,checkedresult:[]})
    setTimeout(()=>{
      this.getTabBar().setData({
        show:true
      })
    },200)
  },
  // 单选框事件
  onChange(event) {
    console.log(event)
    if(this.data.ischeckedalltype == event.detail){
      this.setData({
        ischeckedalltype : 0,
        checkedresult:[]
      });
    }else{
      if(event.detail == 1){
        console.log('全部')
      }else{
        console.log('本页')
      }
      this.setData({
        ischeckedalltype : event.detail,
        checkedresult:this.data.entryList.map(item=>item.applyId.toString())
      });
    }
    console.log(this.data.checkedresult);
  },
  // 多选框事件
  oncheckChange(e){
    this.setData({
      ischeckedalltype : 0,
      checkedresult: e.detail
    });
    console.log(this.data.checkedresult);
  },
  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  noop() {},
  batchEnterMsg(e){
    this.sendentryMsg(e.currentTarget.dataset.info)
  },
  // 跳转msg处理页面
  sendentryMsg(type){
    console.log(type,this.data.checkedresult)
    let isAll = this.data.ischeckedalltype==1?true:false
    wx.navigateTo({
      url: `../../pages/entryMsg/entryMsg?info=${type}&data=${JSON.stringify(this.data.checkedresult)}&isAll=${isAll}&search=${this.data.searchValue}`
    })
  },
  // 关闭所有cell的右边滑块
  closeAllcell() {
    let vanswipecell = this.selectAllComponents('.van-swipecell');
    console.log(vanswipecell)
    for(let i of vanswipecell){
      i.close()
    }
  },
  // 点击拨打电话或复制
  openActionSheet(e){
    wx.showActionSheet({
      itemList:['复制电话','拨打电话'],
      success: function(res) {
          if (!res.cancel) {
            console.log(res.tapIndex)
            if(res.tapIndex==0){
              wx.setClipboardData({
                data: e.currentTarget.dataset['phonecall'].toString(),
              })
            }else{
              wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset['phonecall'].toString()
              })
            } 
          }
      }
    });
  },
})
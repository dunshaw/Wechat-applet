// components/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:String,
      observer(newval,oldval){
        console.log(newval,oldval)
        this.onloadinfo()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList:[],    //存放日期的数组
    nowDate:'', //系统当前日期
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 格式化日期，时间
    formatTime(date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
    },
    // 格式化数字
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },
  
    // 获取日期详情
    getDateInfo(ts) {
      const date = new Date(ts);
      const weekArr = new Array("日", "一", "二", "三", "四", "五", "六");
      const week = date.getDay();
      let dateString = this.formatTime(date);
      let shortDateString = dateString.replace(/\//g, '-').substring(5, 10).replace(/-/g, '月') + "日";
      if (date.getDate() < 10) {
        shortDateString = shortDateString.replace(/0/g, '');
      }
      return {
        shortDateString,
        dateString,
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: weekArr[week]
      }
    },
    clickDate(e) {
      var that = this;
      console.log('点击日期携带的下标：', e.currentTarget.dataset.index);  //当前的点击的日期
      var index = e.currentTarget.dataset.index;
      that.setData({
        clickIndex: index,
        scrollLeftIndex: index-2
      });
      wx.setStorageSync('clickIndex',index)
      console.log(that.data.scrollLeftIndex);
      console.log('当前点击日期：',that.data.dateList[index].shortDateString);   //当前点击的日期
      that.triggerEvent('clickDate',that.data.dateList[index].dateString)//通过triggerEvent将参数传给父组件
      // const {
      //   index
      // } = e.currentTarget.dataset;
      // this.setData({
      //   clickIndex: index
      // });
      // console.log(this.data.dateList[index]);
    },
    onloadinfo(){
      var that = this;
      var myDate = new Date(); //获取系统当前时间
      var sysmonth = myDate.getMonth() + 1
      var nowDate = myDate.getDate();   //当前是本月几日
      var today = myDate.toLocaleDateString();  //今日年月日
      that.setData({
        nowDate: nowDate,
        sysmonth: sysmonth
      }),
      console.log('系统日期：',myDate);
      console.log('系统日期（年/月/日）：',today);
      console.log('系统日期（月）：', sysmonth);
      console.log('系统日期（日）：', nowDate);
      // 获取屏幕宽度，设置每个日期宽度
      wx.getSystemInfo({
        success: (res) => {
          console.log(res);
          this.setData({
            windowWidth: res.windowWidth,
            itemWidth: parseInt(res.windowWidth / 5)
          });
        },
      })
      this.initData();
    },

    initData() {
      const nowDateTime = +new Date();
      const that =this;
      let dateList = [];
      for (let i = -7; i < 8; i++) {
        let obj = this.getDateInfo(nowDateTime + i * 24 * 60 * 60 * 1000);
        obj.isChoose = i == 0;
        dateList.push(obj);
      }
      let clickIndex = wx.getStorageSync('clickIndex');
      console.log(clickIndex)
      if(clickIndex){
        that.setData({
          dateList,
          clickIndex: clickIndex,
          scrollLeftIndex: clickIndex-2
        });
      }else{
        that.setData({
          dateList,
          clickIndex: 7,
          scrollLeftIndex: 5
        });
      }
    },
    getDeltaX(e){
      console.log(e)
    },
  }
})

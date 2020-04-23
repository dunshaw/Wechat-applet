// components/jobboard/jobboard.js
import { loadmembers } from '../../utils/loadmembers.js';
import { getJobMembers } from '../../utils/api.js';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    job:{
      type:Object,
      observer(newval,oldval){
        var that = this;
        console.log(newval)        
        let jurisdiction = wx.getStorageSync('Jurisdiction');
        this.setData({
          taplist:[
          {status:'total',numberNum:newval.total,text:'应到',type:0},
          {status:'totalArrived',numberNum:newval.totalArrived,text:'实到',type:1},
          {status:'totalNotArrived',numberNum:newval.totalNotArrived,text:'未到',type:2}],
          jobinfo: { Contact: newval.interviewContact, ContactNumber: newval.interviewContactNumber, Remarks: newval.interviewRemarks},
          interviewLoc: { Addr: newval.interviewAddr, Lng: newval.interviewLng, Lat: newval.interviewLat, addrid: newval.interviewAddrId, addrBvid: newval.interViewBvAddrId },
          entryLoc: { Addr: newval.jobAddr, Lng: newval.lng, Lat: newval.lat, addrid: newval.workAddrId, addrBvid: newval.workBvAddrId },
          offerjuris:jurisdiction.includes("recruitmentProgress:sendOffer"),
          notSuijuris:jurisdiction.includes("recruitmentProgress:notSuitable"),
          Interviewjuris:jurisdiction.includes("recruitmentProgress:invitationInterview"),
          Retestjuris:jurisdiction.includes("recruitmentProgress:invitationRetest"),
          importExpiredTime: newval.importExpiredTime ? newval.importExpiredTime :'',
          clickIndex:wx.getStorageSync('clickIndex')? wx.getStorageSync('clickIndex') : 7
        })
        let compInfo = wx.getStorageSync('compInfo');
        let dtime = that.CurentTime()
        if(compInfo){
          that.setData({
            datetime: compInfo.interviewTime ? compInfo.interviewTime : dtime
          })
        }else{
          that.setData({
            datetime: dtime
          })
        }
      }
    },
    selected:{
      type:Number,
      observer(newval,oldval){
        console.log('------',newval,oldval);
        console.log(this.data.isselect);
        if(newval!=this.data.isselect){
          this.setData({
            showhide:0,
            showflag:false,
          })
        }
        else{
          // 获取新数据
          if (newval!=0){
            this.setData({
              pageNum: 1,
              topNum:0
            });
            this.getNewMembers()
          }
        }
      }
    },
    checkmode:{
      type:Boolean,
      observer(newval,oldval){
        var that = this;
        console.log('---checkmode---',newval,oldval);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showhide:0,
    showflag:false,
    isScroll:true,
    pages:0,
    pageNum:1,
    pageSize:10,
    stopLoadMoreTiem:false,
    isselect:0,
    isstatus:'',
    istype:null,
    ischeckboxeds:0,
    ischeckedalltype:0,
    checkedresult:[],
    members:[],
    showmembers:[],
    outtime:false,
    topNum:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getdetail(e){
      var that = this;
      console.log(e)
      wx.setStorage({
        key: "jobaddrs",
        data: { int:that.data.interviewLoc, work:that.data.entryLoc}
      })
      wx.setStorage({
        key: 'jobInfo',
        data: that.data.jobinfo,
      })
      let newisselect = e.currentTarget.dataset['id']
      let newisstatus = e.currentTarget.dataset['info']
      let newistype = e.currentTarget.dataset['type']
      console.log(newisselect, newisstatus, newistype)
      console.log('===========')
      console.log(that.data.isselect, that.data.isstatus, that.data.showflag)
      if(that.data.isselect == newisselect && that.data.isstatus==newisstatus){
        console.log(that.data.showmembers)
        if (that.data.showflag){
          that.setData({
            showhide: 0,
            showflag: false
          })
        }else{
          that.setData({
            showhide: 300,
            showflag: true
          })
        }
      }else{
        that.setData({
          pageNum: 1,
          isselect: newisselect,
          isstatus: newisstatus,
          istype: newistype,
          showhide: 300,
          showflag: true,
          topNum:0
        });
        that.getNewMembers()
      }
      wx.setStorage({
        key:"jobid",
        data:newisselect
      })
      that.triggerEvent('selectedData',newisselect)
    },
    // 获取新数据
    getNewMembers(){
      console.log('123123123123')
      var that =this;
      let params = { jobId: this.data.isselect, pageNum: this.data.pageNum, pageSize: this.data.pageSize, type: this.data.istype, interviewTime:this.data.datetime};
      getJobMembers(params)
      .then(data => {
        console.log(data)
        if (data.code==200) {
          this.setData({
            members:data.body.records,
            showmembers:loadmembers(data.body.records),
            pages:data.body.pages,
            stopLoadMoreTiem:false
          }); 
        }
      })
    },
    // 加载新数据
    loadNewMembers(){
      var that =this;
      let params = { jobId: this.data.isselect, pageNum: this.data.pageNum, pageSize: this.data.pageSize, type: this.data.istype,interviewTime: this.data.datetime};
      getJobMembers(params)
      .then(data => {
        console.log(data)
        if (data.code==200) {
          this.setData({
            members:that.data.members.concat(data.body.records),
            showmembers:that.data.showmembers.concat(loadmembers(data.body.records)),
            pages:data.body.pages,
            stopLoadMoreTiem:false
          }); 
        }
      })
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
    // 展开底部菜单
    openMoreSheet(e) {
      let token = wx.getStorageSync('token');
      console.log(token)
      if(!token){
        wx.showModal({
          title: '登录提示',
          content: '登录过期或未登录，请登录查看更多信息，是否去登录页面？',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
            console.log(res);
            if (res.confirm) {
              console.log('用户点击确定')
              wx.clearStorageSync('token')
              wx.reLaunch({
                url: '/pages/index/index'
              })
            } else {
              console.log('用户点击取消')
            }
          }
        });
        return false;
      }
      console.log(e)
      var that = this;
      let id = e.currentTarget.dataset.id
      let name = e.currentTarget.dataset.name
      let time = e.currentTarget.dataset.time
      wx.showActionSheet({
        itemList: ['导入面试','导入结果'],
        success: function (res) {
          if (!res.cancel) {
            console.log(res.tapIndex)
            switch(res.tapIndex){
              case 0:
                let endtime = that.data.importExpiredTime;
                let dtime = that.CurentTime();
                console.log(endtime, dtime, that.data.clickIndex)
                if (that.data.clickIndex < 7) {
                  wx.showToast({
                    title: '无法导入今日之前的面试！',
                    mask: true,
                    icon: 'none',
                    duration: 2000,
                  })
                  return false}
                // } else if (that.data.clickIndex == 7){
                //   if (endtime && endtime < dtime) {
                //     wx.showToast({
                //       title: '面试导入截至时间已过！',
                //       mask: true,
                //       icon: 'none',
                //       duration: 2000,
                //     })
                //     return false
                //   }
                // }
                wx.navigateTo({
                  url: `../../pages/leadingView/leadview?jobid=${id}&jobname=${name}&interviewtime=${time}`
                })
                break
              case 1:
                wx.navigateTo({
                  url: `../../pages/leadingResult/leadingResult?jobid=${id}&jobname=${name}&interviewtime=${time}`
                })
                break
            }
          }
        }
      });
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
      console.log(this.properties.selected)
      console.log(this.data.isstatus)
      var that = this;
      if(this.data.isstatus == 'totalArrived'){
        wx.setStorage({
          key: "jobcomname",
          data: that.properties.job.jobName
        })
        that.triggerEvent('ischeckboxmode',true)
      }
    },
    // 加载数据
    getlower(){
      var that = this;
      if (that.data.stopLoadMoreTiem) {
        return false;
      }
      if(that.data.pageNum == that.data.pages){
        wx.showToast({
          title: '没有更多了~~',
          image: '../../images/warn.png',
          mask:true,
          duration: 2000,
        })
        that.setData({
          stopLoadMoreTiem:true
        })
        return false;
      }
      that.getList();
    },
    getList(){
      var that = this;
      that.setData({
        stopLoadMoreTiem:true,
        pageNum:that.data.pageNum+1
      })
      wx.showLoading({title:'数据读取中...',mask:true})
      setTimeout(()=>{
        wx.hideLoading();
        that.loadNewMembers()
      },1000)
    },
    openGallery(e){
      console.log(e.currentTarget.dataset.id,e.currentTarget.dataset.time)
      let jobid = e.currentTarget.dataset.id;
      let itviewtime = e.currentTarget.dataset.time;
      let jobname = e.currentTarget.dataset.name;
      this.triggerEvent('openGallery',{jobid:jobid,itviewtime:itviewtime,jobname:jobname})
    },
    sendMsg(e){
      var that = this;
      console.log(e)
      let info = e.currentTarget.dataset['info'];
      let data = [e.currentTarget.dataset['applyid']];
      let addrdata = info == 'sendOffer' ? this.data.entryLoc : this.data.interviewLoc
      console.log(this.properties.job)
      wx.setStorage({
        key:"jobcomname",                   
        data:that.properties.job.jobName
      })
      wx.navigateTo({
        url: `../../pages/jobmsg/jobmsg?info=${info}&data=${JSON.stringify(data)}&addr=${JSON.stringify(addrdata)}`
      })
    },
    // 获取当前时间
    CurentTime()
      {
      var now = new Date();

      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日

      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分
      var ss = now.getSeconds();           //秒

      var clock = year + "-";

      if(month < 10)
              clock += "0";

      clock += month + "-";

      if(day < 10)
              clock += "0";

      clock += day + " ";

      if(hh < 10)
              clock += "0";

      clock += hh + ":";
      if(mm < 10) clock += '0';
      clock += mm + ":";

      if(ss < 10) clock += '0';
      clock += ss;
      return(clock);
    },
  }
})

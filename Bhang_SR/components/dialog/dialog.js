import { loadmembers , checkmembers} from '../../utils/loadmembers.js';
import { getJobMembers } from '../../utils/api.js';
//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    istrue:{
        type:Boolean,
        observer(newval,oldval){
          var that = this;
            console.log('---checkmode---',newval,oldval);
            let dtime = that.CurentTime()
            let compInfo = wx.getStorageSync('compInfo');
            if(compInfo){
              that.setData({
                datetime: compInfo.interviewTime ? compInfo.interviewTime : dtime
              })
            }else{
              that.setData({
                datetime:dtime
              })
            }
            let jurisdiction = wx.getStorageSync('Jurisdiction');
            this.setData({
              offerjuris:jurisdiction.includes("recruitmentProgress:sendOffer"),
              notSuijuris:jurisdiction.includes("recruitmentProgress:notSuitable"),
              Interviewjuris:jurisdiction.includes("recruitmentProgress:invitationInterview"),
              Retestjuris:jurisdiction.includes("recruitmentProgress:invitationRetest"),
            })
            this.setnewdata()
        }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false,
    ischeckedalltype:0,
    members:[],
    showmembers:[],
    checkedresult:[],
    pageSize:15,
    pageNum:1,
    pages:null,
    stopLoadMoreTiem:false,
  },

  methods: {
    setnewdata(){
      var that = this;
      wx.getStorage({
        key: "jobaddrs",
        success: function (res) {
          console.log(res)
          that.setData({
            intvaddr: res.data.int,
            workaddr:res.data.work
          });
        }
      })
      wx.getStorage({
        //获取本地缓存
        key:"jobid",
        success:function(res){
          console.log(res)
          that.setData({
            jobid:res.data,
          });
          that.loadNewMembers()
        }
      })
    },
    closeDialog() {
      this.setData({
        ischeckedalltype : 0,
        checkedresult:[]
      });
      wx.setStorage({
        key:"members",                   
        data:this.data.members,
        pageNum:this.data.pageNum,
        pages:this.data.pages
      })
      this.triggerEvent('ischeckboxmode',false)
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
          checkedresult:this.data.showmembers.map(item=>item.applyId.toString())
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
      console.log(this.data.checkedresult,this.data.ischeckedalltype);
    },
    toggle(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },
    noop() {},
    // 发送offer或不合适
    SendMsg(e){
      // console.log(e.currentTarget.dataset['info'])
      // console.log(this.data.checkedresult)
      let info = e.currentTarget.dataset['info'];
      let data = this.data.checkedresult
      let addrdata = info =='sendOffer'?this.data.workaddr:this.data.intvaddr
      let ischeckedalltype = this.data.ischeckedalltype
      console.log(ischeckedalltype)
      if(ischeckedalltype==1){
        wx.navigateTo({
          url: `../../pages/jobmsg/jobmsg?info=${info}&data=isAll&jobid=${this.data.jobid}&addr=${JSON.stringify(addrdata)}`
        })
      }else{
        if(data.length == 0){
          return wx.showToast({
            title: '至少选择一位!',
            image: '../../images/warn.png',
            mask:true,
            duration: 3000
          }); 
        }
        wx.navigateTo({
          url: `../../pages/jobmsg/jobmsg?info=${info}&jobid=${this.data.jobid}&data=${JSON.stringify(data)}&addr=${JSON.stringify(addrdata)}`
        })
      }
    },
    // 点击拨打电话
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
    // 加载数据
    getlower(){
      console.log(this.data.page)
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
    // 加载新数据
    loadNewMembers(){
      var that =this;
      let params = { jobId: that.data.jobid, pageNum: that.data.pageNum, pageSize: that.data.pageSize, type: 3, interviewTime: that.data.datetime};
      console.log('------',params)
      getJobMembers(params)
      .then(data => {
        console.log(data)
        if (data.code==200) {
          if(data.body.current == 1){
            that.setData({
              showmembers: checkmembers(data.body.records),
              pages: data.body.pages,
              stopLoadMoreTiem: false
            });
          }else{
            that.setData({
              showmembers: that.data.showmembers.concat(checkmembers(data.body.records)),
              pages: data.body.pages,
              stopLoadMoreTiem: false
            });
          }
        }
      })
    },
    // 获取当前时间
    CurentTime() {
      var now = new Date();

      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日

      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分
      var ss = now.getSeconds();           //秒

      var clock = year + "-";

      if (month < 10)
        clock += "0";

      clock += month + "-";

      if (day < 10)
        clock += "0";

      clock += day + " ";

      if (hh < 10)
        clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += '0';
      clock += mm + ":";

      if (ss < 10) clock += '0';
      clock += ss;
      return (clock);
    },
  },
})

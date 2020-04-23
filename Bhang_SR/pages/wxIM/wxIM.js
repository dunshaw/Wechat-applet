// pages/wxIM/wxIM.js
const app = getApp()
let disp = require("../../utils/broadcast");
var WebIM = require("../../utils/WebIM")["default"];
import {baseImgUrl} from '../../utils/api.js';
let isfirstTime = true


Page({
  data: {
    baseImgUrl:baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    scrollHeight:'',
    searchValue:'',
    unReadSpotNum: 0,
    chathistorylist:[],
    newchathistorylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calculateScrollViewHeight();
    let me = this;
		//监听未读消息数
		disp.on("em.xmpp.unreadspot", function(message){
      me.getChatList()
			me.setData({
				unReadSpotNum: app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum,
      });
    });
    
    disp.on("em.xmpp.contacts.remove", function(){
			me.getRoster();
			// me.setData({
			// 	arr: me.getChatList(),
			// 	unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			// });
    });

    // this.getRoster();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum
      })
    }
    this.getChatList()
    this.setData({
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			messageNum: getApp().globalData.saveFriendList.length,
			unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
			unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		});

		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
    }
    
    // console.log(this.data.chathistorylist)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 跳转
  chatDetail(event){
    console.log('聊天详情')
    let detail = event.currentTarget.dataset.item;
     console.log(detail)
    //群聊的chatType居然是singlechat？脏数据？ 等sdk重写后整理一下字段
		var nameList = {
			myName: wx.getStorageSync("imUserInfo").imUsername,
			your: detail.username
    };
    console.log(nameList)
    wx.navigateTo({
      url: "../chatDetail/chatDetail?username=" + JSON.stringify(nameList)
    })
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
    query.select('.searchbar').boundingClientRect();
    query.exec((res) => {
      // console.log(res)
      // 分别取出navbar和header的高度
      let headerHeight = res[0].height;
      let statusBarHeight = that.data.statusBarHeight
      console.log(headerHeight, statusBarHeight)

      // 然后就是做个减法
      let scrollViewHeight = this.data.windowHeight - headerHeight - statusBarHeight -50;
      console.log(scrollViewHeight)

      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight
      });
    });
  },

  getRoster(){
		let me = this;
		let rosters = {
			success(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				wx.setStorage({
					key: "member",
					data: member
				});
				me.setData({member: member});
				me.listGroups()
				//if(!systemReady){
					disp.fire("em.main.ready");
					//systemReady = true;
        //}
        me.getChatList()
				me.setData({
					unReadSpotNum: app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum,
				});
			},
			error(err){
				console.log(err);
			}
		};
		WebIM.conn.getRoster(rosters);
  },
  
  getChatList(){
    var that = this;
		var array = [];
    var chatlist = wx.getStorageSync("chatlist") || [];
    // var listGroups = wx.getStorageSync('listGroup')|| [];
    // console.log(chatlist)
    let allcount=0;
		for(let i = 0; i < chatlist.length; i++){
			let newChatMsgs = wx.getStorageSync(chatlist[i]) || [];
			let historyChatMsgs = wx.getStorageSync("rendered_" + chatlist[i]) || [];
			let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
      console.log(newChatMsgs,historyChatMsgs)
      let lastChatMsg;
      for(let j=curChatMsgs.length-1;j>=0;j--){
        if(curChatMsgs[j].style == 'self'){ continue; }
        lastChatMsg = curChatMsgs[j];
        break
      }
      console.log(lastChatMsg)
			if(curChatMsgs){
        
      // let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
      lastChatMsg.unReadCount = newChatMsgs.length;
      allcount+=lastChatMsg.unReadCount
      if(lastChatMsg.unReadCount > 99) {
        lastChatMsg.unReadCount = "99+";
      }
      let dateArr = lastChatMsg.time.split(' ')[0].split('-')
      let timeArr = lastChatMsg.time.split(' ')[1].split(':')
      let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
      lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
      lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
      array.push(lastChatMsg);
			}
		}
		app.globalData.unReadMessageNum=allcount
		
		array.sort((a, b) => {
			return b.dateTimeNum - a.dateTimeNum
    })
    console.log(array)
    
		that.setData({
      chathistorylist:array
    })
  },
  // 搜索输入
  inputSearch(e){
    console.log(e)
    var that = this;
    var timer = this.data.timer
    var newarr = []
    clearTimeout(timer) 
    timer = setTimeout(function () {
      for(let item of that.data.chathistorylist){
        if(item.nickname.indexOf(e.detail.value)!=-1){
          newarr.push(item)
        }
      }
      that.setData({
        newchathistorylist:newarr,
        searchValue:e.detail.value
      })
    }, 1000)
    this.setData({
      timer:timer
    })
  },
  
})


const app = getApp()

Component({
  data: {
    show:true,
    selected: 0,
    color: "#999",
    unReadSpotNum:app.globalData.unReadMessageNum > 99 ? '99+' : app.globalData.unReadMessageNum,
    selectedColor: "#2EA7E0",
    list: [
      {
        "pagePath": "/pages/invitation/invitation",
        "text": "邀约",
        "iconPath": "../images/invitation.png",
        "selectedIconPath": "../images/invitation-in.png"
      },
      {
        "pagePath": "/pages/home/home",
        "text": "面试",
        "iconPath": "../images/interviewManagement-no.png",
        "selectedIconPath": "../images/interviewManagement.png"
      },
      {
        "pagePath": "/pages/entryManagement/entryManagement",
        "text": "入职",
        "iconPath": "../images/entryManagement-no.png",
        "selectedIconPath": "../images/entryManagement.png"
      },
      {
        "pagePath": "/pages/wxIM/wxIM",
        "text": "聊天",
        "iconPath": "../images/wxim.png",
        "selectedIconPath": "../images/wxim-in.png"
      },
      {
        "pagePath": "/pages/mine/mine",
        "text": "我的",
        "iconPath": "../images/mine.png",
        "selectedIconPath": "../images/mine-in.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
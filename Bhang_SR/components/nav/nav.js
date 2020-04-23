//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backbar:{
      type:Boolean,
    },
    text:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navHeight: 46,
  },

  methods: {
    headerBack(){
      console.log('goback')
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})
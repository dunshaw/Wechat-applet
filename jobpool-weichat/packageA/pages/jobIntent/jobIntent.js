// pages/jobIntent/jobIntent.js
const WXAPI = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnArray: [],
    icon:0,
    firstType:[],
    secondType:[],
    parent:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    WXAPI.jobType("false").then(function (res) {
      that.setData({
        firstType:res.body,
        secondType: res.body[0].sub
      })
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  choice:function(e){
    let that = this;
    let value = e.currentTarget.dataset.value;
    that.setData({
      icon: value,
      secondType: that.data.firstType[value].sub
    })
  },
  deleteThisBtn:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let parent = e.currentTarget.dataset.parent;
    that.data.btnArray.splice(index, 1);
    let parentArr = that.data.parent;
    for (let i = 0; i < parentArr.length;i++){
      let a = parentArr[i]
      let isTrue = false;
      for (let o in that.data.btnArray) {
        let b = that.data.btnArray[o];
        if (a.name == b.parentName){
          isTrue = false ;
          break;
        }else{
          isTrue = true;
        }
      }
      if (isTrue){
        parentArr.splice(i, 1)
      }
    }
    that.setData({
      btnArray: that.data.btnArray,
      parent: parentArr
    })
    console.log(that.data.btnArray, that.data.parent)
  },
  selectThisJob:function(e){
    let that = this;
    let name = e.currentTarget.dataset.value; //自己的名字
    let id = e.currentTarget.dataset.id;    //自己的id
    let parent = e.currentTarget.dataset.parent;  //第一父级的名字
    let parentId = e.currentTarget.dataset.parentid;  //第一父级的id
    let parentArr = that.data.parent;
   
    if (parentArr.length<=0){
      parentArr.push({ name: parent, id: parentId });
    }else{
      let isTrue = false;
      for (let i in parentArr) {
        let a = parentArr[i];
        if (parent != a.name) {
          isTrue = true;
        }else{
          isTrue = false;
        }
      }
      if (isTrue){
        parentArr.push({ name: parent, id: parentId });
      }
    }
    that.setData({
      parent: parentArr
    });
    if (that.data.btnArray.length >= 3) {
      wx.showToast({
        title: '最多只能选择3个职位',
        icon:'none',
        duration: 2000
      })
    } else {
      let array = that.data.btnArray;
      array.push({ name: name, id: id, parentName: parent, parentId: parentId});
      that.setData({
        btnArray: array,
      });
    }
    console.log(that.data.btnArray)    
  },
  keepSelected: function (e) {
    let that = this;
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      isGetBack: true,
      btnArray: that.data.btnArray,
      parent: that.data.parent
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 2000) //延迟时间需和duration设置时间一样
  },
})
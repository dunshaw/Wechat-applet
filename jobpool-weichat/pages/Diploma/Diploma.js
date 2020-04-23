// pages/Diploma/Diploma.js
const WXAPI = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgIp: WXAPI.imgIp,
    status:false,
    diplomaImg:null,
    subData:'',
    degStatus:'',
    isok:false,    //是否成功选择选择图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let status = options.status
    console.log(status);
    WXAPI.getDegreeCertification().then(function (res) {
      console.log(res)
      that.setData({
        diplomaImg:res.body.path,
        degStatus: res.body.degreeCertificationStatus
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
  //头像上传
  chooseImage: function () {
    var openid = wx.getStorageSync("openid");
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        wx.uploadFile({
          url: that.data.imgIp + "upload/images", //此处换上你的接口地址
          filePath: tempFilePaths,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json'
          },
          formData: { path: 'baohang/wx' },
          success: function (res) {
            console.log(res)
            let pic = JSON.parse(res.data);
            console.log(pic);
            let subData = pic.body[0];
            pic = pic.body[0].sourcePath;
            that.setData({
              isok:true,
              diplomaImg: pic,
              subData: subData
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '上传失败！',
              duration: 2000,
              icon:'none'
            })
          },
        })
      }
    })
  },
  submitForm:function(){
    let that = this;
    let subData = JSON.stringify(that.data.subData);
    let n = true;
    if (subData == ""){
      wx.showModal({
        title:'错误',
        content:'图片路径失效，请重新选择图片',
        showCancel:false,
        success: function (res){
          if (res.confirm){
             n = false
          }
        }
      })
      return;
    }
    if (!that.data.isok){
      wx.showToast({
        title:'请先选择图片',
        icon:'none'
      })
      return;
    }
    console.log(subData)
    WXAPI.saveDegreeCertification({ resourceFilePath: subData}).then(function (res) {
      console.log(res)
      wx.reLaunch({
        url: '/pages/person/person?s=认证中'
      })
    });
  },
  del:function(){
    wx.showModal({
      content:'学历认证删除后将无法回复，确认要删除吗？',
      confirmColor:'#2EA7E0',
      success(res){
        if (res.confirm) {
          WXAPI.removeDegreeCertification().then(function (res) {
              if(res.code == 200){
                wx.showToast({
                  title:'成功',
                  complete:function(){
                    wx.reLaunch({
                      url:'../person/person'
                    })
                  }
                })
              }
          })
        } 
      }
    })
  },
  again:function(){
    this.setData({
      degStatus: 'uncertified'
    })
  }
})
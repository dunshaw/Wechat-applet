Page({
  data:{
    shareurl:''
  },
  onLoad: function (options) {
    console.log(options)
    const {url,relationId,interviewTime,combineType,id,scanCodeType,type} = options
    this.setData({
      shareurl:`${url}?relationId=${relationId}&type=${type}&combineType=${combineType}&id=${id}&scanCodeType=${scanCodeType}`
    })
  },
})

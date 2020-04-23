/**
 * 封装http 请求方法
 */
// const apiUrl = "http://192.168.0.77:8089"; 
// const apiUrl = "http://6s3yy7.natappfree.cc";
// const apiUrl = 'https://app.jobpoolhr.com/adminapi';
// const apiUrl = 'https://apptest.jobpoolhr.com/adminapi';
const apiUrl = 'http://47.108.24.6:8100/adminapi'


const http = (params) => {
  let token = wx.getStorageSync('token')
  console.log(token, params.url)

  //返回promise 对象
  return new Promise((resolve, reject) => {
    if (params.url != '/job/importReDo' && params.url!='/user/batchGetUserByImUsername'){
      wx.showLoading({
        title: '数据读取中..',
        mask: true
      });
    }
    // console.log(params.juris)
    if(params.juris==-1 && token){
      setTimeout(() => {  
        wx.hideLoading();  
      }, 100);
      return reject('您没有权限!')
    }
    // console.log(apiUrl + params.url)
    wx.request({
      url: apiUrl + params.url,//服务器url+参数中携带的接口具体地址
      data: params.data,//请求参数
      header: params.header || {            // 设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
        'Content-Type': 'application/json', // 默认值
        "Accept": "*/*",
        "Authorization": token || "Bearer "+token
      },
      method: params.method || 'POST',//默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      dataType: params.dataType,//返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      responseType: params.responseType,//响应的数据类型
      success: function(res) {
        setTimeout(() => {  
          wx.hideLoading();  
        }, 100);
        if(params.url.indexOf('QRCode') != -1){
          resolve(res)
          return
        }
        // console.log(res)
        //接口访问正常返回数据
        if (res.data.code == 200) {
          resolve(res.data)
        } else {
          var errMsg = res.data.msg
          //2. 操作不成功返回数据，以toast方式弹出响应信息，如后端未格式化非操作成功异常信息，则可以统一定义异常提示
          if (res.data.code == 302 && params.url !="/test/wxSceneJob"){
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
                  return false;
                } else {
                  console.log('用户点击取消')
                }
              }
            });
          }else{
            console.log(errMsg)
            if(errMsg=='请至少选择一个招聘进展'){          // 跨域导致  不提示报错
              return false
            }
            setTimeout(() => {  
              wx.showToast({
                title: `${errMsg} `,
                icon: 'none',
                duration:2000
              })  
            }, 100);
          }
          return false;
        }
      },
      fail: function(e) {
        console.log(e)
        setTimeout(() => {  
          wx.hideLoading();  
        }, 100);
        wx.showToast({
          title: e.errMsg,
          icon: 'none'
        })
        reject(e)
      }
    })
  })
}
module.exports = {
  http: http
}
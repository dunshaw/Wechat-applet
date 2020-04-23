const API_BASE_URL = 
// "http://192.168.0.25:8081";
'http://47.108.24.6:8100/api';
// 'https://apptest.jobpoolhr.com/api';   
// 'https://app.jobpoolhr.com/api';
const imgIp = 
  'https://imgtest.jobpoolhr.com/';
  // 'https://img.jobpoolhr.com/';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 封装请求接口方法
 */
const request = (url, method, data, type) => {
  wx.showLoading({
    title: '数据读取中..',
    mask: true
  });
  let _url = API_BASE_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': (type == "1" ? 'application/json' : 'application/x-www-form-urlencoded'),
        "Authorization": "Bearer "+wx.getStorageSync('token')
      },
      success(res) {
        // console.log(res)
        if(res.statusCode==200){
          setTimeout(() => {
            wx.hideLoading();
            resolve(res.data)
          }, 100);
        }else{
          wx.navigateTo({
            url: `../errorPage/errorPage?error=${res.statusCode}`
          })
        }
      },
      fail(error) {
        wx.navigateTo({
          url: '../errorPage/errorPage?error=400'
        })
        setTimeout(() => {
          wx.hideLoading();
          reject(error)
        }, 100);
      },
      complete(aaa) {
        setTimeout(() => {
          wx.hideLoading();
        }, 100);
        // 加载完成
      }
    })
  })
}

/**
 * 防止多次点击
 */
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}


/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}


module.exports = {
  formatTime: formatTime,
  request,
  imgIp: imgIp,
  ip: API_BASE_URL,

  /**正则 */
  regularPhone: /^1\d{10}$/,
  isEmoji: /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,

  /*防多次点击*/
  throttle: throttle,
  //示例
  exm: (data) => {
    return request('/exm/exm', 'GET', data)
  },
  //换取openId
  getOpenId: (data) => {
    return request('/weChat/getOpenId', 'GET',data)
  },
  //查询用户信息
  getUserInfo: (data) => {
    return request('/user/getUser', 'GET')
  },
  //获取验证码
  getYzm: (data) => {
    return request('/messages/common/sendVerificationCode', 'GET', data)
  },
  //获取验证码
  checkYzm: (data) => {
    return request('/messages/common/checkVerificationCode', 'GET', data)
  },
  //获取验证码
  register: (data) => {
    return request('/user/register', 'POST', data)
  },
  //绑定微信openId
  bindWxOpenId: (data) => {
    return request('/user/bindWxOpenId', 'POST', data)
  },
  //获取首页banner
  indexBanner: (data) => {
    return request('/banner/list', 'GET', data)
  },
  //获取新闻列表
  indexNews: (data) => {
    return request('/news/list', 'GET', data)
  },
  // 获取悬浮接口、弹窗接口
  getAdvertise:(params)=>{
    return request('/advertisement/getAdvertise', 'GET', params)
  },
  //获取首页列表
  indexList: (data) => {
    return request('/job/list', 'GET', data)
  },
  //根据上级编码获取地区列表
  findByParentCode: (data) => {
    return request('/area/findByParentCode', 'GET', data)
  },
  //获取所有福利标签
  labelList: (type) => {
    return request(`/label/list/${type}`, 'GET')
  },
  //热门搜索历史
  searchPopular: (data) => {
    return request('/search/popular', 'GET',data)
  },
  //搜索结果列表
  searchResult: (data) => {
    return request('/search/data', 'GET', data)
  },
  //根据ID查询职位详情
  jobResult: (data) => {
    return request('/job/get', 'GET', data)
  },
  //提交申请简历，申请该职位
  submitApply: (data) => {
    return request('/interviewApply/submit', 'POST', data)
  },
  //提交用工状态
  saveUserEmploy: (data) => {
    return request('/user/saveUserEmployStatus', 'POST', data)
  },
  //求职进展列表
  progressList: (data) => {
    return request('/jobSearchProgress/list', 'GET', data)
  },
  //求职进展详情
  progressDetail: (data) => {
    return request('/jobSearchProgress/detail', 'GET', data)
  },
  getrichtext: (data) => {
    return request('/setting/getRichText/personShareService', 'GET')
  },
  //接受/拒绝 面试/复试
  operationalInterview: (data) => {
    return request('/jobSearchProgress/operationalInterview', 'POST', data)
  },
  //用户简历
  myResume: () => {
    return request('/user/myResume', 'GET')
  },
  //用户简历修改
  resumeUpdate: (data) => {
    // console.log(data)
    return request('/user/update', 'POST',data)
  },
  // 公司列表
  companylist:(data)=>{
    return request('/company/list', 'GET',data)
  },
  // 公司行业列表
  industrylist:()=>{
    return request('/industry/list', 'GET')
  },
  // 公司规模列表
  scalelist:()=>{
    return request('/scale/list', 'GET')
  },
  //个人优势模板
  otherAdvantage: (data) => {
    return request('/personalAdvantageTemplate/list', 'GET', data)
  },
  //保存个人优势
  savePersonalAdvantage: (data) => {
    return request('/user/savePersonalAdvantage', 'POST',data)
  },
  //职位类型
  jobType: (popular) => {
    return request(`/jobType/list/${popular}`, 'GET')
  },
  //保存求职意向
  saveJobHuntingIntention: (data) => {
    return request('/user/saveJobHuntingIntention', 'POST', data)
  },
  //获取工作经历详情
  getWorkExperienceDetail: (data) => {
    return request('/user/getWorkExperienceDetail', 'GET', data)
  },
  //保存/修改工作经历
  saveWorkExperience: (data) => {
    return request('/workExperience/save', 'POST', data)
  },
  //获取教育经历详情
  getEducationExperienceDetail: (data) => {
    return request('/user/getEducationExperienceDetail', 'GET', data)
  },
  //保存/修改教育经历
  saveEducationExperience: (data) => {
    return request('/educationExperience/save', 'POST', data)
  },
  //获取之前学历认证
  getDegreeCertification: () => {
    return request('/user/getDegreeCertification', 'GET')
  },
  //提交学历证明
  saveDegreeCertification: (data) => {
    return request('/user/degreeCertification', 'POST' , data)
  },
  //获取求职意向
  getJobHuntingIntention: () => {
    return request('/user/getJobHuntingIntention', 'GET')
  },
  //获取行业
  industryController: () => {
    return request('/industry/list', 'GET')
  },
  //工作经历模版
  workExperienceTemplate: (data) =>{
    return request('/workExperienceTemplate/list','GET', data)
  },
  //公司信息
  companyGetById: (data) =>{
    return request('/company/getById','GET',data)
  },
  //公司招聘职位
  companyGetJobList: (data) =>{
    return request('/company/getJobList','GET',data)
  },
  //取消申请面试
  interviewApplyCancel: (data) =>{
    return request('/interviewApply/cancel','POST',data)
  },
  //扫码签到
  scanCodeCheckIn: (data) =>{
    return request('/job/scanCodeCheckIn', 'GET' , data)
  },
  //删除学历认证
  removeDegreeCertification: () =>{
    return request('/user/removeDegreeCertification', 'DELETE')
  },
  //获取热门城市
  popularCitylist: () =>{
    return request('/popularCity/list','GET')
  },
  weChatauth: (data) =>{
    return request('/weChat/auth','GET',data)
  },
  //获取用户微信绑定手机号
  weChatgetPhoneNumber: (data) =>{
    return request('/weChat/getPhoneNumber','GET',data)
  },
  //微信登录
  weChatlogin: (data) =>{
    return request('/weChat/login','POST',data)
  }
}

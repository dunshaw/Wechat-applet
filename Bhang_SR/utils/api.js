import { http } from './http.js';
var app = getApp();
  const apiUrl = 'http://47.108.24.6:8100/adminapi'
// const apiUrl = "http://6s3yy7.natappfree.cc";
// const apiUrl = "http://192.168.0.77:8089";
// const apiUrl = 'https://apptest.jobpoolhr.com/adminapi';
// const apiUrl = 'https://app.jobpoolhr.com/adminapi';

const imgUrl = apiUrl=='https://app.jobpoolhr.com/adminapi'?'https://img.jobpoolhr.com/':'https://imgtest.jobpoolhr.com/';

var url = {
    userLogin: "/weChat/getManaOpenId",  // wx登录
    userPhoneLogin:"/weChat/getManaPhoneNumber", // 手机登录
    getUserPhone: "/user/phone",  // 获取用户手机号
    getSceneJob: "/job/wxSceneJob",   // 获取公司职位
    getSceneCompany:"/company/wxSceneCompany",   //获取公司信息
    getJobMembers:"/user/wxSceneUser",    // 获取职位签到人信息
    getsendOffer:"/recruitmentProgress/batchOperationResume" ,   // 发送邀请或复试、不合适  
    getJobQRCode:"job/QRCode",      //  职位二维码
    getuserQRCode:'/job/QRCode/getQrCode.jpg',
    getUserStaffid:'/user/getStaffId',
    importInterview:"/job/importInterview",
    getSceneJobtest:"/test/wxSceneJob",       // 获取未登录首页默认数据
    getAddress:"/address/allAddress"     //拉取公司地址
  , getImportIndex:"/job/importIndex"    // 拉取导入时间
  , getJobImportresult:"/job/importResult"  // 获取job导入结果
  , getJobimportReDo: "/job/importReDo"  // 重新执行
  , getUserTrack:"/job/importUserTrack"   // 获取用户追踪列表
  , getEntrylist:"/recruitmentProgress/getEntryList"  // 获取入职管理信息
  , getconfirmEntry:"/recruitmentProgress/batchConfirmEntry"   // 确认入职
  , getrefuseEntry:"/recruitmentProgress/batchRefuseEntry"    // 拒绝入职
  , getUserByImUsername:"/user/batchGetUserByImUsername"   // 获取用户昵称
  , getjobImlist:"/job/findJobImportList"     // 获取导入公司列表
  , wxImhistory:"/imMessage/getHistory"     // 获取环信历史消息
}

var juris = {
    getSceneJob: "recruitmentProgress:list",   // 获取公司职位
    getSceneCompany:"/company/wxSceneCompany",   //获取公司信息
    getJobMembers:"/user/wxSceneUser",    // 获取职位签到人信息 
}
module.exports = {
    basePath:apiUrl,
    baseImgUrl:imgUrl,
    userLogin(params) {
        return http({      
            url: url.userLogin,
            data: { code: params},
            method:"GET"
        })
    },
    userPhoneLogin(params) {
        return http({      
            url: url.userPhoneLogin,
            data:params,
            method:"GET"
        })
    },
    getUserPhone(params) {
        return http({
            url: url.getUserPhone,
            data: params
        })
    },
    getUserByImUsername(params) {
      return http({
          url: url.getUserByImUsername,
          data: params,
          method:"get"
      })
    },
    
    wxImhistory(){
      return http({
        url: url.wxImhistory,
        method: "GET"
      })
    },
    getSceneJobtest(){
      return http({
        url: url.getSceneJobtest,
        method: "GET"
      })
    },
    getSceneJob(params) {
        let jurisdiction = wx.getStorageSync('Jurisdiction')
        console.log(jurisdiction)
        // return http({
        //     url: url.getSceneJob,
        //     data:params,
        //     method:"GET",
        //     juris:jurisdiction.indexOf(juris.getSceneJob)
        // })
        return new Promise((resolve, reject) =>{
          http({
              url: url.getSceneJob,
              data:params,
              method:"GET",
              juris:jurisdiction.indexOf(juris.getSceneJob)
          }).then(rsp=>{
              console.log(rsp)
              // for(let i of rsp.body.pageJobTotalDto.records){
              //   console.log(i)
              //   if(i.jobId=='' || !i.jobId){
              //     reject('0225')
              //     break
              //   }
              // }
              resolve(rsp)
          })
        }) 
    },
    getJobMembers(params){
        console.log(params)
        return new Promise((resolve, reject) =>{
            http({
                url: url.getJobMembers,
                data:params,
                method:"GET"
            }).then(rsp=>{
                // console.log(rsp)
                wx.setStorage({
                    key:"members",                   
                    data:rsp.body.records 
                })
                resolve(rsp)
            })
        }) 
    },
    getSceneCompany(params){
        return http({
            url: url.getSceneCompany,
            data:params,
            method:"GET"
        })
    },
    getsendOffer(params){
        return http({
            url: url.getsendOffer,
            data:params,
            header:{
              'Content-Type': 'application/x-www-form-urlencoded', // 默认值
              "Authorization": wx.getStorageSync('token') 
            }
        })
    },
    getJobQRCode(params){
        // return `${apiUrl}/${url.getJobQRCode}/${params.jobid}/${params.itviewtime}/checkIn.jpg`
        return http({
          url: `/${url.getJobQRCode}/${params.jobid}/${params.itviewtime}/checkIn.jpg`,
          method: "GET",
          responseType:'arraybuffer', 
        })
    },
    getuserQRCode(params){
      return http({
        url: url.getuserQRCode,
        data:params,
        method: "GET",
        responseType:'arraybuffer', 
      })
    },
    getUserStaffid(){
      return http({
        url: url.getUserStaffid,
        method: "GET",
      }) 
    },
    importInterview(params){
        console.log(params)
        return http({
          url: url.importInterview+params,
        }) 
    },
  getAddress(params){
      return http({
        url: url.getAddress,
        method: "GET",
        data: params
      }) 
  },
  getImportIndex(params){
    return http({
      url: url.getImportIndex,
      method: "GET",
      data: params
    }) 
  },
  getJobImportresult(params){
    return http({
      url: url.getJobImportresult,
      method: "GET",
      data: params
    })
  },
  getJobimportReDo(params){
    return http({
      url: url.getJobimportReDo,
      method: "GET",
      data: params
    })
  },
  getUserTrack(params) {
    return http({
      url: url.getUserTrack,
      method: "GET",
      data: params
    })
  },
  getEntrylist(params) {
    return http({
      url:url.getEntrylist,
      method:"GET",
      data: params
    })
  },
  getconfirmEntry(params) {
    return http({
      url:url.getconfirmEntry,
      method:"GET",
      data: params
    })
  },
  getrefuseEntry(params) {
    return http({
      url:url.getrefuseEntry,
      method:"GET",
      data: params
    })
  },
  getjobImlist(params) {
    return http({
      url:url.getjobImlist,
      method:"GET",
      data: params
    })
  },
  
}



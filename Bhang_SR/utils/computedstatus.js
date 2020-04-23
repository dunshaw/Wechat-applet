const computeStatus = (data,param) =>{
    // console.log(data,param)
    let newdata = statuslist.filter(item=>{
        return item.status == data
    })
    // console.log(newdata[0][param])
    return newdata[0][param]
}


const statuslist = [
    {status:0,data:'申请成功',msg:'完全不显示',info:false},
    {status:1,data:'简历被查看',msg:'完全不显示',info:false},
    {status:4,data:'拒绝面试邀请',msg:'完全不显示',info:false},
    {status:11,data:'拒绝复试邀请',msg:'完全不显示',info:false},
    {status:19,data:'拒绝面试而结束',msg:'完全不显示',info:false},
    {status:20,data:'拒绝复试而结束',msg:'完全不显示',info:false},
    {status:21,data:'取消',msg:'完全不显示',info:false},
    {status:18,data:'结束',msg:'完全不显示',info:false},
    {status:18,data:'结束',msg:'完全不显示',info:false},
    {status:3,data:'接受面试邀请',msg:'不会出现的',info:false},
    {status:10,data:'接受复试邀请',msg:'不会出现的',info:false},
    {status:7,data:'面试结束',msg:'不会出现的',info:false},
    {status:12,data:'等待复试',msg:'不会出现的',info:false},
    {status:14,data:'复试结束',msg:'不会出现的',info:false},
    {status:8,data:'面试签到成功',msg:'实到',info:true},
    {status:15,data:'复试签到成功',msg:'实到',info:true},
    {status:22,data:'面试签到迟到',msg:'实到',info:true},
    {status:23,data:'复试签到迟到',msg:'实到',info:true},
    {status:16,data:'发送offer',msg:'实到',info:false},
    {status:17,data:'不合适',msg:'实到',info:false},
    {status:9,data:'发送复试邀请',msg:'未到',info:false},
    {status:13,data:'等待复试签到',msg:'未到',info:false},
    {status:2,data:'发送面试邀请',msg:'未到',info:false},
    {status:6,data:'等待面试签到',msg:'未到',info:false},
    {status:24,data:'确认入职',msg:'实到',info:false},
    {status:25,data:'拒绝入职',msg:'实到',info:false},
]

module.exports = {
    computeStatus
}
// 0.不会出现的：
//       接受面试邀请-3
//       接受复试邀请-10
//       面试结束-7
//       等待复试-12
//       复试结束-14
// 1.完全不显示的：
//       申请成功-0
//       简历被查看-1
//       拒绝面试邀请-4
//       拒绝复试邀请-11
//       拒绝面试而结束-19
//       拒绝复试而结束-20
//       取消-21
//       结束-18
// 2.应到：

// 3.实到：
//       面试签到成功-8
//       复试签到成功-15
//       面试签到迟到-22
//       复试签到迟到-23
//       发送offer-16
//       不合适-17
// 4.未到：  
//       发送复试邀请-9
//       等待复试签到-13
//       发送面试邀请-2
//       等待面试签到-6
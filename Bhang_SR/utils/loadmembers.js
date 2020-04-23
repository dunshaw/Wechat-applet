import { computeAge } from './computationalAge';

// 处理获取的数据
const loadmembers = (data) =>{
    console.log(data); 
    return computeAge(data)
}

// 筛选处理未操作的数据
const checkmembers = data =>{
    return computeAge(data).filter(item=>{
        return item.operation 
    })
}

// 筛选应到、未到、实到数据
const memberstatus = (data) => {
    let newdata = computeAge(data)
    if(info=='total'){ return newdata }
    console.log(newdata)
    return newdata.filter(item=>{
        return item.statusMsg == status(info)
    })
}

const status = n =>{
    return n=='totalArrived' ? '实到' : '未到'
}

module.exports = {
    loadmembers,
    checkmembers
}

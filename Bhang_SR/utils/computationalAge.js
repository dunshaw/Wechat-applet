import { computeStatus } from './computedstatus';
// 根据出生年月计算实际年龄

const computeAge = data =>{
    data.map(item=>{
        item.age = item.age ? item.age : item.birthday ? computeAgeSinge(item.birthday.split(' ')[0]): '无'
        item.statusTip = computeStatus(item.status,'data')
        item.statusMsg = computeStatus(item.status,'msg')
        item.operation = computeStatus(item.status,'info')
    })
    return data
}



const computeAgeSinge = strBirthday =>{
    // console.log(strBirthday)
    var returnAge;
    var strBirthdayArr=strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];
    
    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    
    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄
}


module.exports = {
    computeAge
}
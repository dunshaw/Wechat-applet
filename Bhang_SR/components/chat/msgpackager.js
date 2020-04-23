let WebIM = require("../../utils/WebIM")["default"];
let msgType = require("msgtype");



module.exports = function(sendableMsg, type, myName){
	// console.log(sendableMsg, type, myName)
	var time = WebIM.time();
	var renderableMsg = {
		info: {
			from: sendableMsg.body.from,
			to: sendableMsg.body.to
		},
		username: sendableMsg.body.from == myName ? sendableMsg.body.to : sendableMsg.body.from,
		yourname: sendableMsg.body.from,
		msg: {
			type: type,
			url: sendableMsg.body.body.url,
			data: getMsgData(sendableMsg, type),
			ext: sendableMsg.body.ext
		},
		style: sendableMsg.body.from == myName ? "self" : "",
		time: sendableMsg.body.time?getTimedata(sendableMsg.body.time):time,
		oldmsg:sendableMsg.body.oldmsg,
		mid: sendableMsg.type + sendableMsg.id,
		chatType: sendableMsg.body.chatType,
		ext: sendableMsg.body.ext,
		nickname:sendableMsg.body.nickname?sendableMsg.body.nickname:sendableMsg.body.ext.userName
	};
	if(type == msgType.IMAGE){
		renderableMsg.msg.size = {
			width: sendableMsg.body.body.size.width,
			height: sendableMsg.body.body.size.height,
		};
	}else if (type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;
	}else if (type == msgType.FILE){
		renderableMsg.msg.data = [{data: "[当前不支持此格式消息展示]", type: "txt"}];
		renderableMsg.msg.type = 'txt';
	}
	return renderableMsg;

	function getMsgData(sendableMsg, type){
		if(type == msgType.TEXT){
			return WebIM.parseEmoji(sendableMsg.value.replace(/\n/mg, ""));
		}
		else if(type == msgType.EMOJI){
			return sendableMsg.value;
		}
		else if(type == msgType.IMAGE || type == msgType.VIDEO || type == msgType.AUDIO){
			return sendableMsg.body.body.url;
		} else if (type == msgType.FILE) {
			return sendableMsg.body.body.msg
		}
		return "";
	}
	function getTimedata(timestamp){
		// console.log(timestamp)
		var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = date.getDate() + ' ';
		var h = date.getHours() + ':';
		var m = date.getMinutes() + ':';
		var s = date.getSeconds();
		if(s<10){
			s = '0'+s
		}
		if(m<10){
			m = '0'+m
		}
		if(h<10){
			h= '0'+h
		}
		return Y + M + D + h + m + s;
	}
	
};

let Disp = require("../../utils/Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
let disp = require("../../utils/broadcast");


msgStorage.saveReceiveMsg = function(receiveMsg, type){
	// console.log(receiveMsg,type)
	let sendableMsg;
	if(type == msgType.IMAGE){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				nickname:receiveMsg.ext.userName,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					size: {
						width: receiveMsg.width,
						height: receiveMsg.height
					},
				},
			},
		};
	}
	else if(type == msgType.TEXT || type == msgType.EMOJI){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				time:receiveMsg.timestamp?receiveMsg.timestamp:'',
				oldmsg:receiveMsg.oldmsg?receiveMsg.oldmsg:false,
				nickname:receiveMsg.ext.userName,
				toJid: "",
				body: {
					type: type,
					msg: receiveMsg.data,
				},
			},
			value: receiveMsg.data
		};
	}
	else if (type == msgType.FILE) {
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.file_length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				nickname:receiveMsg.ext.userName,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					msg: "当前不支持此格式消息展示",
				},
			},
			value: receiveMsg.data
		};
	}
	else if(type == msgType.AUDIO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			accessToken: receiveMsg.token || receiveMsg.accessToken,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				nickname:receiveMsg.ext.userName,
				ext: receiveMsg.ext,
				chatType: type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					from: receiveMsg.from,
					to: receiveMsg.to
				},
			},
		};
	}
	else{
		return;
	}
	this.saveMsg(sendableMsg, type, receiveMsg);
};
msgStorage.saveMsg = function(sendableMsg, type, receiveMsg){
	//console.log('sendableMsgsendableMsg', sendableMsg)
	let me = this;
	let myName = wx.getStorageSync("imUserInfo").imUsername;
	
	let sessionKey;
	// 仅用作群聊收消息，发消息没有 receiveMsg
	if(receiveMsg && receiveMsg.type == "groupchat"){
		sessionKey = receiveMsg.to + myName;
	}
	// 群聊发 & 单发 & 单收
	else{
		sessionKey = sendableMsg.body.from == myName
			? sendableMsg.body.to + myName
			: sendableMsg.body.from + myName;
	}
	let curChatMsg = wx.getStorageSync(sessionKey) || [];
	let renderableMsg = msgPackager(sendableMsg, type, myName);
	if(type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;
		renderableMsg.msg.token = sendableMsg.accessToken;
	}
	// console.log('renderableMsg',renderableMsg,curChatMsg)

	curChatMsg.push(renderableMsg);

	// else{
	// 	save();
	// }
	let chatlist = wx.getStorageSync("chatlist") || [];
	// console.log(chatlist)
	if(chatlist.indexOf(sessionKey)==-1){
		chatlist.push(sessionKey)
		wx.setStorageSync('chatlist',chatlist)
	}
	save();
	function save(){
		wx.setStorage({
			key: sessionKey,
			data: curChatMsg,
			success(){
				if (type == msgType.AUDIO || type == msgType.VIDEO) {
					disp.fire('em.chat.audio.fileLoaded');
				}
				me.fire("newChatMsg", renderableMsg, type, curChatMsg, sessionKey);
				
			}
		});
	}
};

module.exports = msgStorage;

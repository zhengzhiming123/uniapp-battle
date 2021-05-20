// 提示框
const showToast = (title,callback,duration=1500,mask=false,position="bottom") => {
	uni.showToast({
		title,duration,position,mask,
		icon: "none",
		complete:()=>{
			if(callback){
				setTimeout(()=>{
					callback();
				},duration);
			}
		}
	});
}
// 成功提示框
const showToastSuc = (title,callback,duration=1500,mask=false,position="bottom") => {
	uni.showToast({
		title,duration,position,mask,
		icon:"success",
		complete:()=>{
			if(callback){
				setTimeout(()=>{
					callback();
				},duration);
			}
		}
	});
}
// 确定模态框(没有取消)
const submitModal = (title,content,callback) => {
	uni.showModal({
		title,content,
		showCancel: false,
		success: function (res) {
			if (res.confirm) {
				if(callback){
					callback();
				}
			}
		}
	});
}

// 确定模态框(没有取消)
const showModal = (title,content,callback) => {
	uni.showModal({
		title,content,
		showCancel: true,
		success: function (res) {
			if (res.confirm) {
				if(callback){
					callback();
				}
			}
		}
	});
}

const isLogin = (vue) => {
  var token = vue.vuex_token;
  var token_expire = vue.vuex_token_expire;
  if (!token) {
    return false;
  }
  if (Date.now() - token_expire.timestamp > (token_expire.expire * 1000)) {
    vue.$u.vuex('vuex_token', null);
    vue.$u.vuex('vuex_token_expire', null);
    return false;
  }
  
  return true;
}

const getPage = (level=1)=>{
	const pages = getCurrentPages();
	return pages[pages.length - level];
}


export default {
	showToast,showToastSuc,submitModal,showModal,getPage,isLogin
}
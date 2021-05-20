const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'https://api.siyoujingji.com/battle',
    // baseUrl: 'http://localhost:8081/battle',
		showLoading: true,
		loadingText: '加载中...',
		loadingTime: 800,
		loadingMask: false,
	});
	
	// 请求拦截部分，如配置，每次请求前都会执行，见上方说明
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.token = vm.vuex_token;
		// 比赛：参加比赛操作。
		// 商城：兑换。
		// 我的：个人信息、我的门票、我的积分、我的角色、购买门票的购买按钮、
		const urls = [];
		if(vm.vuex_token_expire){
			const {expire,timestamp} = vm.vuex_token_expire;
			if (Date.now() - timestamp > (expire * 1000)) {
				vm.$util.submitModal("","账号已过期,请重新登陆",()=>{
					vm.$u.vuex("vuex_user",null);
					vm.$u.vuex("vuex_token_expire",null);
					vm.$u.vuex("vuex_token","");
					vm.$u.route('/pages/mine/login')
				})
				return false;
			}
		}
		return config;
	}
	
	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.code == 0) {
			return res;
		} else if(res.code == 401) {
			// 假设201为token失效，这里跳转登录
			vm.$util.submitModal("","账号已过期,请重新登陆",()=>{
				vm.$u.vuex("vuex_user",null);
				vm.$u.vuex("vuex_token_expire",null);
				vm.$u.vuex("vuex_token","");
				vm.$u.route('/pages/mine/login')
			})
			return false;
		} else {
			// 如果返回false，则会调用Promise的reject回调，
			// 并将进入vm.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
			vm.$util.showToast(res.msg);
			return false;
		}
	}
}

export default {
	install
}
const install = (Vue, vm) => {
	// 注册
	const user_register = (params = {}) => vm.$u.post("/app/user/register", params);
	// 登录
	const user_login = (params = {}) => vm.$u.post("/app/user/login", params);
	// 重置验证码
	const user_resetPassword = (params = {}) => vm.$u.post("/app/user/resetPassword", params);
	// 注册验证码
	const sms_register = (params = {}) => vm.$u.post("/app/sms/register", params);
	// 充值密码验证码
	const sms_resetPassword = (params = {}) => vm.$u.post("/app/sms/resetPassword", params);
	// 获取用户信息
	const user_profile = (params = {}) => vm.$u.post("/app/user/profile", params);
	// 实名认证
	const user_auth = (params = {}) => vm.$u.post("/app/user/auth", params);
	// 更新用户信息
	const user_updateUser = (params = {}) => vm.$u.post("/app/user/updateUser", params);
	// 用户兑物券历史
	const userIntegralBill_list = (params = {}) => vm.$u.post("/app/userIntegralBill/list", params);
  // 赠送兑物券
  const userIntegralBill_send = (params = {}) => vm.$u.post("/app/userIntegralBill/send", params);
  // 用户钻石历史
  const userDiamondBill_list = (params = {}) => vm.$u.post("/app/userDiamondBill/list", params);
	// 我的比赛
	const competition_userEnrolls = (params = {}) => vm.$u.post("/app/competition/userEnrolls", params);
	// 增加地址
	const user_addAddress = (params = {}) => vm.$u.post("/app/user/addAddress", params);
	// 删除地址
	const user_deleteAddress = (params = {}) => vm.$u.post("/app/user/deleteAddress", params);
	// 地址列表
	const user_addressList = (params = {}) => vm.$u.post("/app/user/addressList", params);
	// 更新地址
	const user_updateAddress = (params = {}) => vm.$u.post("/app/user/updateAddress", params);
	// 好友列表
	const user_inviteUserList = (params = {}) => vm.$u.post("/app/user/inviteUserList", params);
  // 用户游戏战绩
  const user_userGames  = (params = {}) => vm.$u.post("/app/user/userGames", params);
  
  // 用户提现申请
  const user_userWithDraw_apply  = (params = {}) => vm.$u.post("/app/userWithDraw/apply", params);
  // 用户提现记录
  const user_userWithDraw_list  = (params = {}) => vm.$u.post("/app/userWithDraw/list", params);
	
  // 配置 - 用户提现
  const config_withdraw = (params = {}) => vm.$u.post("/app/config/withdraw", params);
	
	// 意见反馈
	const suggest_save = (params = {}) => vm.$u.post("/app/suggest/save", params);
	// 客服
	const user_customer = (params = {}) => vm.$u.post("/app/user/customer", params);
	// 邀请链接
	const user_inviteUrl = (params = {}) => vm.$u.post("/app/user/inviteUrl", params);
	
  // 获取banner
	const ads_banners = (params = {}) => vm.$u.post("/app/ads/banners", params);
  // 获取全部游戏列表
  const competition_games = (params = {}) => vm.$u.post("/app/game/games", params);
	// 获取全部赛段/门票列表
	const competition_competitions = (params = {}) => vm.$u.post("/app/competition/competitions", params);
	// 用户提交比赛结果
	const user_submit_room_result = (params = {}) => vm.$u.post("/app/competition/userSubmitRoomResult", params);
	// 赛段房间
	const competition_rooms = (params = {}) => vm.$u.post("/app/competition/rooms", params);
  // 创建房间
  const competition_userCreateRoom = (params = {}) => vm.$u.post("/app/competition/userCreateRoom", params);
	// 关闭房间
	const competition_userDelRoom = (params = {}) => vm.$u.post("/app/competition/userDelRoom", params);
	// 赛段房间详情
	const competition_roomInfo = (params = {}) => vm.$u.post("/app/competition/roomInfo", params);
  // 赛段房间报名用户列表
  const competition_roomUserList = (params = {}) => vm.$u.post("/app/competition/roomUserList", params);
	// 是否可以报名
	const competition_isEnroll = (params = {}) => vm.$u.post("/app/competition/isEnroll", params);
	// 报名
	const competition_enroll = (params = {}) => vm.$u.post("/app/competition/enroll", params);
	// 更新比赛房间链接
	const competition_userEditRoom = (params = {}) => vm.$u.post("/app/competition/userEditRoom", params);
  // 查询赛段报名房间数量
  const competition_roomsCount = (params = {}) => vm.$u.post("/app/competition/roomsCount", params);
	
  
  
	
	// 获取游戏
	const game_games = (params = {}) => vm.$u.post("/app/game/games", params);
  // 获取游戏
  const game_index = (params = {}) => vm.$u.post("/app/game/index", params);
	// 获取游戏区
	const game_zones = (params = {}) => vm.$u.post("/app/game/zones", params);
	// 获取段位
	const game_ranks = (params = {}) => vm.$u.post("/app/game/ranks", params);
  // 游戏绑定教程
	const game_binding_contents = (params = {}) => vm.$u.post("/app/game/bindingcontents", params);
	
	// 角色列表
	const userRole_list = (params = {}) => vm.$u.post("/app/userRole/list", params);
	// 添加角色
	const userRole_save = (params = {}) => vm.$u.post("/app/userRole/save", params);
	// 更新角色
	const userRole_update = (params = {}) => vm.$u.post("/app/userRole/update", params);
	
	// 获取用户门票
	const userTicket_userTickets = (params = {}) => vm.$u.post("/app/userTicket/userTickets", params);
	// 购买门票
	const userTicket_buy = (params = {}) => vm.$u.post("/app/userTicket/buy", params);
  // 购买门票
  const userTicket_buyByIntegral = (params = {}) => vm.$u.post("/app/userTicket/buyByIntegral", params);
	// 购买门票
	const userTicket_send = (params = {}) => vm.$u.post("/app/userTicket/send", params);
	
	// 支付
	const pay_pay = (params = {}) => vm.$u.post("/app/pay/pay", params);
  //支付状态
  const pay_querystatus = (params = {}) => vm.$u.post("/app/pay/querystatus", params);
	
	
	// 商品列表
	const goods_list = (params = {}) => vm.$u.post("/app/goods/list", params);
	// 商品详情
	const goods_goodsinfo = (params = {}) => vm.$u.post("/app/goods/goodsinfo", params);
	// 购买商品
	const goods_buy = (params = {}) => vm.$u.post("/app/goods/buy", params);
	// 商品订单列表
	const goodsorder_list = (params = {}) => vm.$u.post("/app/goodsorder/list", params);
	// 商品订单详情
	const goodsorder_orderinfo = (params = {}) => vm.$u.post("/app/goodsorder/orderinfo", params);
  
  // 邀请朋友宣传图
  const inviteImages_list = (params = {}) => vm.$u.post("/app/inviteimages/list", params);
  
  // 获取安卓最新更新信息
  const appversion_android = (params = {}) => vm.$u.post("/app/appversion/android", params);
	
  // 签到配置
  const userSignin_config = (params = {}) => vm.$u.post("/app/usersignin/config", params);
	// 签到
	const userSignin_sign = (params = {}) => vm.$u.post("/app/usersignin/sign", params);
	// 用户签到天数
	const userSignin_usersign = (params = {}) => vm.$u.post("/app/usersignin/userSign", params);
  
  // 钻石
  const diamond_list = (params = {}) => vm.$u.post("/app/diamond/list", params);
  // 购买钻石
  const diamond_buy = (params = {}) => vm.$u.post("/app/diamond/buy", params);
  
  // 微信生成H5链接
  const wx_generalSchema = (params = {}) => vm.$u.post("/app/wx/generalSchema", params);
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		user_register,
		user_login,
		user_resetPassword,
		user_profile,
		user_auth,
		user_updateUser,
		userIntegralBill_list,
    userIntegralBill_send,
    userDiamondBill_list,
		competition_userEnrolls,
		user_addAddress,
		user_deleteAddress,
		user_addressList,
		user_updateAddress,
		user_inviteUserList,
    user_userGames,
		suggest_save,
		user_customer,
		user_inviteUrl,
    
    user_userWithDraw_apply,
    user_userWithDraw_list,
    
    config_withdraw,
    
    ads_banners,
		competition_competitions,
		competition_games,
		competition_rooms,
    competition_userCreateRoom,
		competition_userDelRoom,
		user_submit_room_result,
		competition_roomInfo,
		competition_roomUserList,
		competition_isEnroll,
		competition_enroll,
		competition_userEditRoom,
    competition_roomsCount,
		sms_register,
		sms_resetPassword,
		userTicket_userTickets,
		userTicket_buy,
    userTicket_buyByIntegral,
		userTicket_send,
		pay_pay,
    pay_querystatus,
		game_games,
    game_index,
		game_ranks,
		game_zones,
    game_binding_contents,
		userRole_list,
		userRole_save,
		userRole_update,
		goods_list,
		goods_goodsinfo,
    goods_buy,
		goodsorder_list,
		goodsorder_orderinfo,
    inviteImages_list,
    userSignin_config,
		userSignin_sign,
		userSignin_usersign,
    diamond_list,
    diamond_buy,
    appversion_android,
    
    wx_generalSchema
	};
}

export default {
	install
}
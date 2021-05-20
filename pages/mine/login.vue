<template>
	<view class="main">
		<view class="title">账号密码登录</view>
		<u-form class="form" :model="form" ref="uForm" :border-bottom="false" :errorType="errorType">
			<u-form-item label="手机号" label-width="120" :label-style="labelStyle" prop="account" :border-bottom="false">
				<u-input v-model="form.account" type="number" placeholder="请输入手机号" class="form-item" height="90" :custom-style="customStyle" />
			</u-form-item>
			<u-form-item label="密码" label-width="120" :label-style="labelStyle" prop="password" :border-bottom="false">
				<u-input v-model="form.password" type="password" placeholder="请输入密码" password-icon class="form-item" height="90" :custom-style="customStyle" />
			</u-form-item>
		</u-form>
		<u-button class="btn" type="primary" :ripple="true" @click="submit">登录</u-button>
		<view class="operation">
			<text @click="$u.route('/pages/mine/forgetPwd')">忘记密码</text>
			<text style="color: #999;padding: 0 15rpx;">|</text>
			<text @click="toHome">暂不登录</text>
		</view>
		<view class="register">还没有注册？<text @click="$u.route('/pages/mine/register')">立即注册</text></view>
	</view>
</template>


<script>
  var jpushModule = uni.requireNativePlugin("JG-JPush")
  
	export default {
		name: "login",
		data() {
			return {
				labelStyle: {
					color: '#fff'
				},
				errorType: ['message'],
				form: {
					account: "",
					password: "",
				},
				rules: {
					account: [{
						required: true,
						message: '请输入账号',
						trigger: ['change', 'blur'],
					},{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change','blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}]
				},
				customStyle: {
					"color": "#fff"
				}
			};
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const {account,password} = this.form;
						this.$u.api.user_login({
							mobile: account,
							password
						}).then(res=>{
							this.$u.vuex("vuex_token", res.token);
							this.$u.vuex("vuex_token_expire", {
								expire: res.expire,
								timestamp: new Date()
							});
              
							this.$u.api.user_profile({}).then(({data})=>{
								this.$u.vuex("vuex_user",data);
								this.$util.showToastSuc("登录成功",()=>{
									this.$u.route({
										type: "navigateBack",
									})
								})
							})
              
              //设置极光推送别名
              jpushModule.setAlias({
                'alias' : account,
                'sequence': 1
              })
              
						})
					}
				});
			},
			toHome(){
				this.$u.route({
					url: '/pages/active/index',
					type: "switchTab",
				})
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>
<style scoped lang="scss">
	.main {
		padding: 0 40rpx;

		.title {
			font-size: 35rpx;
			margin-top: 70rpx;
		}

		.form {
			margin-top: 70rpx;

			.form-item {
				padding: 0 20rpx !important;
				background: #36364B;
				border-radius: 10rpx;
			}
		}

		.btn {
			height: 90rpx;
			margin-top: 80rpx;
		}
		.operation{
			text-align: center;
			color: $theme-color-light;
			font-size: 26rpx;
			margin-top: 40rpx;
		}
		.register{
			color: #999;
			text-align: center;
			margin-top: 100rpx;
			font-size: 26rpx;
			text{
				color: $theme-color-light;
			}
		}
	}
	/deep/ .u-form-item__message{
		padding-left: 30rpx !important;
	}
</style>

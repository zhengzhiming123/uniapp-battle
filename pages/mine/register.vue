<template>
	<view class="main">
		<view class="title">欢迎注册</view>
		<u-form class="form" :model="form" ref="uForm" :border-bottom="false" :errorType="errorType">
			<u-form-item label="手机号" label-width="120" :label-style="labelStyle"  prop="account" :border-bottom="false">
				<u-input v-model="form.account" type="number" placeholder="请输入手机号" class="form-input" height="90" :custom-style="customStyle" />
			</u-form-item>
			<u-form-item label="验证码" label-width="120" :label-style="labelStyle" prop="smsCode" :border-bottom="false">
				<view class="smsCode">
					<u-input v-model="form.smsCode" class="form-input" placeholder="请输入验证码" height="90" :custom-style="customStyle" />
					<button :class="{disabledSend:disabled}" :disabled="disabled" class="send" @click="sendSms">{{smsCode}}</button>
				</view>
			</u-form-item>
			<u-form-item label="密码" label-width="120" :label-style="labelStyle" prop="password" :border-bottom="false">
				<u-input v-model="form.password" type="password" placeholder="请输入密码" password-icon class="form-input" height="90" :custom-style="customStyle" />
			</u-form-item>
			<u-form-item label="邀请码" label-width="120" :label-style="labelStyle" prop="inviteCode" :border-bottom="false">
				<u-input v-model="form.inviteCode" type="number" placeholder="请输入邀请码" class="form-input" height="90" :custom-style="customStyle" />
			</u-form-item>
		</u-form>
		<u-button class="btn" type="primary" :ripple="true" @click="submit">注册</u-button>
		<view class="agreement">登录即代表您已阅读并同意<text @click="$u.route('/pages/mine/setting/agreement')">《用户协议》</text>及<text @click="$u.route('/pages/mine/setting/policy')">《隐私政策》</text></view>
	</view>
</template>


<script>
	export default {
		name: "register",
		data() {
			return {
				labelStyle: {
					color: '#fff'
				},
				disabled: false,
				errorType: ['message'],
				smsCode: "发送验证码",
				form: {
					account: "",
					smsCode: "",
					password: "",
					inviteCode: ""
				},
				rules: {
					account: [
						{required: true,message: '请输入账号',trigger: ['change', 'blur']},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					],
					smsCode: [{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur'],
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
			sendSms(){
				if(!this.$u.test.mobile(this.form.account)){
					this.$u.toast('请输入正确的手机号码');
					return;
				}
				this.$u.api.sms_register({
					mobile: this.form.account
				}).then(()=>{
					this.disabled = true;
					this.smsCode = 60;
					const timer = setInterval(()=>{
						this.smsCode--;
						if(this.smsCode===0){
							clearInterval(timer)
							this.smsCode = "发送验证码";
							this.disabled = false;
						}
					},1000)
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						const {account,...data} = this.form;
						this.$u.api.user_register({
							...data,
							mobile: account
						}).then(res=>{
							this.$util.showToastSuc("注册成功",()=>{
								this.$u.route({
									type: "navigateBack",
								})
							})
						})
					}
				});
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

			.form-input {
				padding: 0 20rpx !important;
				background: #36364B;
				border-radius: 10rpx;
			}
			.smsCode{
				width: 100%;
				position: relative;
				display: flex;
				align-items: center;
				.form-input{
					padding: 0 200rpx 0 20rpx !important;
				}
				.send{
					position: absolute;
					border: 0;
					right: 0;
					font-size: 26rpx;
					color: $theme-color-light;
					background: none;
					&::after{
						border: none;
					}
				}
				.disabledSend{
					color: #ddd;
				}
			}
		}

		.btn {
			height: 90rpx;
			margin-top: 80rpx;
		}
		.agreement{
			color: #999;
			text-align: center;
			margin-top: 150rpx;
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

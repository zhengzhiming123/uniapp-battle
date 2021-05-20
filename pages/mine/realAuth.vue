<template>
	<view class="main">
		<u-form class="form" :model="form" ref="uForm" :border-bottom="false" :errorType="errorType">
			<u-form-item label="姓名" :label-style="labelStyle" label-width="120" prop="realName" :border-bottom="false">
				<u-input v-model="form.realName" type="text" placeholder="清输入姓名" class="form-input" height="90" :custom-style="customStyle" />
			</u-form-item>
			<u-form-item label="身份证" :label-style="labelStyle" label-width="120" prop="idCard" :border-bottom="false">
				<u-input v-model="form.idCard" type="idcard" placeholder="请输入身份证号码" class="form-input" height="90" :custom-style="customStyle" />
			</u-form-item>
		</u-form>
		<u-button class="btn" shape="" type="primary" :ripple="true" @click="submit">提交</u-button>
	</view>
</template>


<script>
	export default {
		name: "realAuth",
		data() {
			return {
				labelStyle: {
					'color': '#fff'
				},
				errorType: ['message'],
				form: {
					idCard: "",
					realName: "",
				},
				rules: {
					idCard: [
						{required: true,message: '请输入身份证号码',trigger: ['change', 'blur'],},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.idCard(value);
							},
							message: '身份证号码不正确',
							trigger: ['change','blur'],
						}
					],
					realName: [{
						required: true,
						message: '清输入姓名',
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
						this.$u.api.user_auth({
							"idCard": this.form.idCard,
							"realName": this.form.realName
						}).then(res=>{
							this.$util.showToastSuc("认证成功",()=>{
								this.$u.route({
									type: "navigateBack",
								})
							})
						})
					}
				});
			}
		},
		onShow() {
			const {isAuth,realName,idCard} = this.vuex_user;
			if(isAuth){
				this.form.idCard = idCard;
				this.form.realName = realName;
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
		.form {
			margin-top: 70rpx;
			.form-input {
				padding: 0 20rpx !important;
				background: #36364B;
				border-radius: 10rpx;
			}
		}
		.btn {
			height: 90rpx;
			margin-top: 40rpx;
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

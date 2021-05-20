<template>
	<view class="main">
		<u-form class="form" :model="form" ref="uForm" :label-style="customStyle">
			<u-form-item label="手机号" prop="mobile" label-width="160" :border-bottom="false">
				<u-input v-model="form.mobile" type="number" placeholder="请输入手机号" :custom-style="customStyle" height="90" class="form-input" />
			</u-form-item>
			<u-form-item label="问题描述" prop="content" label-width="160" :border-bottom="false">
				<u-input v-model="form.content" type="textarea" placeholder="请输入问题描述" :custom-style="customStyle" class="form-input" />
			</u-form-item>
			<u-form-item label="图片" label-width="160" :border-bottom="false">
				<u-upload :custom-btn="true" :action="action" max-count="1" width="150" height="150" :file-list="fileList" :header="header" @on-success="({url})=>form.image=url">
					<view slot="addBtn" class="slot-btn">
						<u-icon label="选择图片" size="40" color="#fff" name="plus" label-pos="bottom" label-size="28"></u-icon>
						<!-- <u-icon name="photo" size="60" color="#c0c4cc"></u-icon> -->
					</view>
				</u-upload>
			</u-form-item>
		</u-form>
		<u-button type="primary" @click="submit" style="margin-top: 100rpx;">提交</u-button>
	</view>
</template>


<script>
	export default {
		name: "suggest",
		data() {
			return {
				action: "",
				header: {},
				fileList: [],
				customStyle:{"color": "#fff"},
				form: {
					mobile: "",
					content: "",
					image: ""
				},
				rules: {
					mobile: [
						{required: true,message: '请输入手机号',trigger: ['blur']},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['blur'],
						}
					],
					content: [{
						required: true,
						message: '请输入描述',
						trigger: [ 'blur'],
					}],
				},
			};
		},
		methods: {
			submit(){
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.api.suggest_save(this.form).then(res=>{
							this.$util.showToastSuc("提交成功");
						})
					}
				})
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.action = this.$u.http.config.baseUrl+ "/app/oss/upload";
			this.header = {token: this.vuex_token};
			this.$refs.uForm.setRules(this.rules);
		}
	};
</script>
<style scoped lang="scss">
	.main{
		padding: 20rpx 30rpx;
		.form {
			.form-input {
				padding: 0 20rpx !important;
				background: #36364B;
				border-radius: 10rpx;
			}
			.slot-btn {
				width: 160rpx;
				height: 160rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #36364B;
				border-radius: 10rpx;
			}
		
		}
	}
</style>

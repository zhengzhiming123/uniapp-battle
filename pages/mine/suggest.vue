<template>
	<view class="main">
		<u-form class="form" :model="form" ref="uForm" :label-style="customStyle">
			<u-form-item label="手机号" prop="mobile" label-width="160">
				<u-input v-model="form.mobile" type="number" placeholder="请输入手机号" :custom-style="customStyle" height="90" />
			</u-form-item>
			<u-form-item label="问题描述" prop="content" label-width="160" >
				<u-input v-model="form.content" :border="true" type="textarea" placeholder="请输入问题描述" :custom-style="customStyle" />
			</u-form-item>
			<u-form-item label="图片" label-width="160" >
				<u-upload :action="action" max-count="1" width="150" height="150" :file-list="fileList" :header="header" @on-success="({url})=>form.image=url" />
			</u-form-item>
		</u-form>
		<u-button type="warning" @click="submit" style="margin-top: 100rpx;">提交</u-button>
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
	}
</style>

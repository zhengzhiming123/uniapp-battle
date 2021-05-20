<template>
	<view class="main">
		<view class="lists">
			<view class="item">
				<view class="item_tit">头像</view>
				<view class="item_cont">
					<view class="avatar_wrap" @click="chooseAvatar">
						<u-image  class="avatar_img" width="80rpx"  height="80rpx"  border-radius="50%"  :src="avatar?avatar:'/static/images/user.png'" />
						<u-icon name="arrow-right" style="margin-left: 10rpx;" />
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item_tit">昵称</view>
				<view class="item_cont">
					<u-input class="input" height="70" placeholder="请输入昵称" :custom-style="style" v-model="username" input-align="right" />
				</view>
			</view>
			<view class="item">
				<view class="item_tit">性别</view>
				<view class="item_cont">
					<u-radio-group class="radio_wrap" v-model="gender" active-color="#465FFF" shape="square">
						<u-radio name="0">男</u-radio>
						<u-radio name="1">女</u-radio>
					</u-radio-group>
				</view>
			</view>
      <view class="item">
      	<view class="item_tit">QQ号</view>
      	<view class="item_cont">
      		<u-input class="input" height="70" placeholder="请输入QQ号" :custom-style="style" v-model="qq" input-align="right" />
      	</view>
      </view>
      <view class="item">
      	<view class="item_tit">微信号</view>
      	<view class="item_cont">
      		<u-input class="input" height="70" placeholder="请输入微信号(不是微信名称)" :custom-style="style" v-model="wx" input-align="right" />
      	</view>
      </view>
		</view>
		<button class="btn" @click="submit">提交</button>
	</view>
</template>


<script>
	export default {
		name: "updateUser",
		data() {
			return {
				avatar: "",
				gender: 0,
				username: "",
        qq: "",
        wx: "",
				
				style:{
					color: "#fff"
				}
			};
		},
		methods: {
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			verify(){
				if(this.avatar === ""){
					this.$util.showToast("请选择头像");
					return false;
				}else if(this.username === ""){
					this.$util.showToast("请输入昵称");
					return false;
				}
				return true;
			},
			submit() {
				if(this.verify()){
					this.$u.api.user_updateUser({
						"avatar": this.avatar,
						"gender": this.gender,
						"username": this.username,
						"qq": this.qq,
						"wx": this.wx
					}).then(res=>{
						this.$util.showToastSuc("更改成功",()=>{
							this.$u.api.user_profile({}).then(({data})=>{
								this.$u.vuex("vuex_user",data);
								this.$u.route({
									type: "navigateBack",
								})
							})
						})
					})
				}
			}
		},
		created() {
			this.avatar = this.vuex_user.avatar;
			this.gender = this.vuex_user.gender;
			this.username = this.vuex_user.username;
			this.qq = this.vuex_user.qq;
			this.wx = this.vuex_user.wx;
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				setTimeout(()=>{
					uni.showLoading({
						title:"加载中"
					})
					uni.uploadFile({
						url: this.$u.http.config.baseUrl+ "/app/oss/upload",
						filePath: path,
						name: 'file',
						header:{
							token: this.vuex_token
						},
						complete: (res) => {
							uni.hideLoading();
							const {url} = JSON.parse(res.data);
							this.avatar = url;
						}
					});
				},500)
			})
		},
		
	};
</script>
<style scoped lang="scss">
	.main {
		.lists{
			margin: 30rpx 20rpx 0 20rpx;
			.item{
				display: flex;
				justify-content: space-between;
				line-height: 100rpx;
				.item_tit{
					width: 100rpx;
				}
				.item_cont{
					display: flex;
          width: 500rpx;
          justify-content: flex-end;
					.avatar_wrap{
						width: 120rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;
					}
				}
			}
		}
		.btn {
			height: 80rpx;
			line-height: 80rpx;
			margin: 80rpx 50rpx 0 50rpx;
			background-color: #465FFF;
			color: #fff;
			border: none;
			font-size: 28rpx;
		}
	}
</style>

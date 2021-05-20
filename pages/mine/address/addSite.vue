<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<view class="ipt-wrap">
					<input v-model="userName" type="text" placeholder-class="line" placeholder="请填写收货人姓名" />
				</view>
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<view class="ipt-wrap">
					<input v-model="mobile" type="number" placeholder-class="line" placeholder="请填写收货人手机号" />
				</view>
			</view>
			<view class="item" @click="show=true">
				<view class="left">所在地区</view>
				<view class="ipt-wrap">
					<input :value="address.join('-')" disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
				</view>
			</view>
			<view class="item">
				<view class="left">详细地址</view>
				<view class="ipt-wrap">
					<textarea v-model="detailedAddress" type="text" placeholder-class="line" placeholder="街道、楼牌等" />
				</view>
			</view>
		</view>
		<!-- <view class="bottom">
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right"><switch color="#f37b1d" @change="setDefault" /></view>
			</view>
		</view> -->
		<u-picker mode="region" ref="uPicker" v-model="show" @confirm="pickerConfirm" />
		<u-button v-if="id" type="error" class="submit" @click="delect">删除</u-button>
		<u-button type="primary" class="submit" @click="submit">保存</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			"id": null,
			"show": false,
			"userName": "",
			"mobile": "",
			"address": [],
			"detailedAddress": ""
		};
	},
	methods: {
		verify(){
			if(this.userName === ""){
				this.$util.showToast("请输入收货人姓名")
				return false;
			}else if(!this.$u.test.mobile(this.mobile)){
				this.$util.showToast("请输入正确的手机号")
				return false;
			}else if(this.address.length !== 3){
				this.$util.showToast("选择省市区")
				return false;
			}else if(this.detailedAddress === ""){
				this.$util.showToast("请输入详细地址")
				return false;
			}
			return true;
		},
		submit(){
			if(this.verify()){
				if(this.id){
					this.$u.api.user_updateAddress({
						"userAddressId": this.id,
						"province": this.address[0],
						"city": this.address[1],
						"district": this.address[2],
						"address": this.detailedAddress,
						"mobile": this.mobile,
						"userName": this.userName
					}).then(res=>{
						this.$util.showToastSuc("成功",()=>{
							this.$u.route({
								type: "navigateBack",
							})
						})
					})
				}else{
					this.$u.api.user_addAddress({
						"province": this.address[0],
						"city": this.address[1],
						"district": this.address[2],
						"address": this.detailedAddress,
						"mobile": this.mobile,
						"userName": this.userName
					}).then(res=>{
						this.$util.showToastSuc("添加成功",()=>{
							this.$u.route({
								type: "navigateBack",
							})
						})
					})
				}
			}
		},
		delect(){
			uni.showModal({
				title: '提示',
				content: '是否确认删除',
				success: res=>{
					if (res.confirm) {
						this.$u.api.user_deleteAddress({
							"userAddressId": this.id
						}).then(res=>{
							this.$util.showToastSuc("删除成功",()=>{
								this.$u.route({
									type: "navigateBack",
								})
							})
						})
					}
				}
			});
		},
		// picker确定
		pickerConfirm({province,city,area}){
			this.address = [province.label,city.label,area.label];
		},
	},
	onLoad({data}) {
		if(data){
			uni.setNavigationBarTitle({
		　		title: "编辑用户地址"
			})
			const {id,name,phone,province,city,district,address} = JSON.parse(data)
			this.id = id;
			this.userName = name;
			this.mobile = phone;
			this.address = [province,city,district];
			this.detailedAddress = address;
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	.top {
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 28rpx;
			line-height: 100rpx;
			align-items: center;
			.left {
				width: 150rpx;
			}
			.ipt-wrap{
				flex: 1;
			}
			input {
				width: 100%;
				height: 80rpx;
				text-align: left;
				background-color: #36364B;
				padding-left: 20rpx;
				border-radius: 5rpx;
				box-sizing: border-box;
			}
			textarea {
				width: 100%;
				height: 150rpx;
				line-height: 60rpx;
				padding-left: 20rpx;
				border-radius: 5rpx;
				background-color: #36364B;
				box-sizing: border-box;
			}
		}
		
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: $theme-bg;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		padding: 40rpx 20rpx;
		background-color: $theme-bg;
		font-size: 28rpx;
		.default {
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
	.submit{
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		margin: 0 40rpx;
	}
}
</style>

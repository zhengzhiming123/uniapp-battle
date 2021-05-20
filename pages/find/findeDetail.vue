<template>
	<view class="main">
		<u-image
			width="100%" 
			height="360rpx" 
			class="imgs"
			border-radius="10rpx" 
			src="http://games.mmkjkj.com/uploads/20201107/16aa95107805e6cf4af1aa83419fed15.png"
		/>
		<view class="title">关于近期封禁违规账号的通知</view>
		<view class="info">广告 | 管理员 | 2020-11-29 13:06:02</view>
		<view class="txt">近期在和平精英比赛中，以下用户有使用第三方插件、外挂的违规行为，给予封号处理，参赛成绩作废：</view>
	</view>
</template>

<script>
	export default {
		name:"findeDetail",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding: 20rpx;
		.title{
			font-size: 32rpx;
			text-align: center;
			margin-top: 25rpx;
		}
		.info{
			margin: 25rpx 0;
			color: #aaa;
			text-align: center;
			font-size: 26rpx;
		}
	}
</style>

<template>
	<view class="main">
		<u-image class="logo" width="200rpx" height="200rpx" src="/static/images/hpjy.png"></u-image>
		<view class="info" style="margin: 0 10rpx;">
			<view class="title">版本更新了 1.1</view>
			<view class="cent">
				更新内容
			</view>
		</view>
		<view class="btn-wrap">
			<u-button class="btn" type="warning" shape="circle">马上更新</u-button>
			<u-button class="btn" shape="circle">下次再说</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.main{
		padding: 20rpx;
		.logo{
			margin: 50rpx auto;
		}
		.info{
			height: calc(100vh - 40rpx - 300rpx - 180rpx - var(--window-top));
			overflow: auto;
			.title{
				font-size: 35rpx;
				color: $theme-color-light;
			}
			.cent{
				color: 30rpx;
			}
		}
		.btn-wrap{
			.btn{
				width: 100%;
				margin-bottom: 20rpx;
			}
		}
	}
</style>

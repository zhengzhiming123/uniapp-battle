<template>
	<view class="wrap">
		<view class="item" v-for="item in list">
			<view class="head">
				<image class="pic" :src="item.icon" mode="widthFix" />
				<view class="name">{{item.name}}</view>
			</view>
			<view class="list">
				<view class="item_label">参赛</view>
				<view class="item_val">{{item.signNum}}</view>
			</view>
			<view class="list">
				<view class="item_label">{{item.name =='和平精英'?'吃鸡数':'获奖数'}}</view>
				<view class="item_val">{{item.winNum}}</view>
			</view>
      <view class="list">
      	<view class="item_label">淘汰数</view>
      	<view class="item_val">{{item.dieOutNum}}</view>
      </view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	methods: {
		
	},
	onLoad() {
    this.$u.api.user_userGames({}).then(res=>{
      this.list = res.list;
    });
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	display: flex;
	justify-content: space-between;
	padding: 30rpx;
	.item{
		width: 49%;
		padding: 20rpx;
		background: #36364B;
		border-radius: 10rpx;
		.head{
			display: flex;
			.pic{
				width: 48rpx;
				height: 48rpx;
				vertical-align: middle;
			}
			.name{
				font-size: 28rpx;
				margin-left: 20rpx;
				line-height: 48rpx;
			}
		}
		.list{
			background-color: #292939;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			height: 64rpx;
			line-height: 64rpx;
			padding: 0 20rpx;
		}
	}
}
</style>

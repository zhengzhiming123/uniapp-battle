<template>
	<view class="main">
		<view class="lists">
			<template v-if="list.length">
				<u-row class="list" v-for="item in list" :key="item.id">
					<u-col :span="9">
            <view class="name" v-if="item.type == 0">类型：支付宝</view>
            <view class="name" v-if="item.type == 1">类型：微信</view>
            <view class="name" v-if="item.type == 2">类型：银行卡</view>
						<view class="name">账号：{{item.account}}</view>
						<view class="name">户名：{{item.realName}}</view>
            <view class="name">申请时间：{{item.createTime}}</view>
					</u-col>
					<u-col :span="3" text-align="right">
            <view class="status" v-if="item.status == 0">申请中</view>
            <view class="status" v-if="item.status == 1">已支付</view>
            <view class="status" v-if="item.status == 2">申请失败</view>
					</u-col>
          <view v-if="item.status == 2" class="reason">退回原因：{{item.cancelReason}}</view>
				</u-row>
			</template>
			<template v-else>
				<u-empty text="暂无领奖记录" mode="history" margin-top="350"></u-empty>
			</template>
		</view>
	</view>
</template>


<script>
	export default {
		name: "myIntegralWithdrawList",
		data() {
			return {
				limit: 10,
				page: 1,
				list: []
			};
		},
		methods: {
			async loadData(){
				this.$u.api.user_userWithDraw_list({
					"limit": this.limit,
					"page": this.page
				}).then(res => {
          console.log(res);
          this.list = [...this.list,...res.page.list];
        })
				
			},
		},
		onLoad() {
			this.loadData();
		},
		onPullDownRefresh(){
			this.page = 1;
			this.list = [];
			this.loadData().then(()=>{
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom(){
			this.page++;
			this.loadData();
		}
	};
</script>
<style scoped lang="scss">
	.main {
		padding: 20rpx;
		position: relative;
		.lists{
			.list{
				background-color: #36364B;
				padding: 15rpx;
				border-bottom: 1rpx solid #444;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				.name{
					font-size: 28rpx;
					color: #fff;
				}
        .status{
          font-size: 28rpx;
          color: #fff;
        }
        .reason{
          margin-top: 10rpx;
          margin-left: 10rpx;
        	font-size: 28rpx;
        	color: #fff;
        }
			}
		}
	}
</style>

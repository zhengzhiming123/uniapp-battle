<template>
	<view class="main">
		<view class="head box">
			<view class="order-status" :class="info.status===0?'undelivered':'delivered'">
				{{info.status===0?"未发货":"已发货"}}
			</view>
			<u-row class="user-info">
				<u-col :span="1">
					<u-image width="32rpx" height="32rpx" border-radius="4" src="/static/images/place.png" />
				</u-col>
				<u-col :span="11">
					<view class="add">{{info.userAddress}}</view>
					<view class="name">{{info.userName}}<text class="phone">{{info.userMobile}}</text></view>
					
				</u-col>
			</u-row>
		</view>
		<view class="box content">
			<view class="order-info">
				<u-image class="order-img" width="160rpx" height="160rpx" border-radius="4" :src="info.goodsImg" />
				<view class="info">
					<view class="tit">
						<view>{{info.goodsName}}</view>
						<view>×{{info.num}}</view>
					</view>
					<view class="integral"><image class="gold_icon" src="/static/images/gold.png" mode="widthFix" /><text>{{info.amount}}</text></view>
					<view class="date">{{info.createTime}}</view>
				</view>
			</view>
		</view>
		
		<view class="box">
			<view class="list">
				<text class="name">订单编号</text>{{info.orderNo}}
			</view>
			<view class="list">
				<text class="name">创建时间</text>{{info.createTime}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "shopOrderDetail",
		data() {
			return {
				info: {},
			};
		},
		methods: {
			
		},
		onLoad({id}) {
			this.$u.api.goodsorder_orderinfo({
				"goodsOrderId": id
			}).then(({info})=>{
				this.info = info;
			})
		},
	}
</script>

<style scoped lang="scss">
	.main {
		padding: 20rpx 30rpx;
		.box{
			background: #36364B;
			padding: 25rpx 20rpx;
			border-radius: 6rpx;
			margin-bottom: 30rpx;
			.list{
				padding: 10rpx 0;
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
			}
		}
		.head{
			position: relative;
			.order-status{
				position: absolute;
				left: 50%;
				top: 0;
				margin-left: -50rpx;
				height: 50rpx;
				line-height: 50rpx;
				padding: 0 15rpx;
				border-bottom-left-radius: 24rpx;
				border-bottom-right-radius: 24rpx;
				font-size: 24rpx;
				&.undelivered{
					background-color: #FF4646;
				}
				&.delivered{
					background-color: #465FFF;
				}
			}
			.title{
				padding: 15rpx 0 20rpx 0;
				border-bottom: 1px solid #eee;
				color: $theme-color-light;
				display: flex;
				align-items: center;
				position: relative;
				text-indent: 30rpx;
				&::after{
					content: "";
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 8rpx;
					border-radius: 4rpx;
					height: 50%;
					background: $theme-color-light;
				}
			}
			.user-info{
				padding: 50rpx 0 10rpx 0;
				.name{
					color: #C2CAFF;
					font-size: 28rpx;
					margin-bottom: 10rpx;
					text{
						color: #807D90;
						padding-left: 10rpx;
						font-size: 24rpx;
						vertical-align: bottom;
					}
				}
				.add{
					color: #eee;
					font-size: 28rpx;
				}
			}
		}
		.content{
			.order-info{
				display: flex;
				.order-img{
					
				}
				.info{
					flex: 1;
					margin-left: 30rpx;
					.tit{
						display: flex;
						justify-content: space-between;
					}
					.integral {
						margin-top: 10rpx;
						font-size: 26rpx;
						.gold_icon{
							width: 30rpx;
							height: 30rpx;
							vertical-align: middle;
							margin-right: 10rpx;
						}
						text {
							color: #fff;
							padding-right: 20rpx;
						}
					}
					.date{
						color: #807D90;
						margin-top: 20rpx;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>

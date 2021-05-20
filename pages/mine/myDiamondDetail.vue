<template>
	<view class="main">
		<view class="lists">
			<template v-if="list.length">
				<u-row class="list" v-for="item in list" :key="item.id">
					<u-col :span="9">
						<view class="name">{{item.note}}</view>
						<view class="time">{{item.createTime}}</view>
					</u-col>
					<u-col :span="3" text-align="right" class="integral" :class="item.type===0?'plus':'minus'">
						<u-icon :name="item.type===0?'plus':'minus'" style="font-size: 26rpx;"></u-icon>{{item.diamond}}
					</u-col>
				</u-row>
			</template>
			<template v-else>
				<u-empty text="暂无积分数据" mode="history" margin-top="350"></u-empty>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: "myDiamondDetail",
		data() {
			return {
				limit: 10,
				page: 1,
				list: [],
			};
		},
		methods: {
			async loadData(){
				const {page} = await this.$u.api.userDiamondBill_list({
					"limit": this.limit,
					"page": this.page
				})
				this.list = [...this.list,...page.list];
			},
			toShop(){
				this.$u.route({
					url:"/pages/shop/index",
					type: "switchTab"
				})
			}
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
				.time{
					font-size: 26rpx;
					margin-top: 5rpx;
					color: #999;
				}
				.integral{
					line-height: 28rpx;
					font-weight: bold;
					&.plus{
						color: #fff;
					}
					&.minus{
						color: #FF4646;
					}
				}
			}
		}
	}
</style>

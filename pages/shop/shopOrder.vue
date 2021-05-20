<template>
	<view class="main">
		<u-tabs-swiper bg-color="#212121" inactive-color="#807D90" active-color="#465FFF" ref="uTabs" bar-width="80" :list="tabList" :active-item-style="activeItemStyle" :current="current" @change="tabsChange" :is-scroll="false" />
		<view class="scroll-view">
			<template v-if="list.length">
				<view class="lists" @click="toDetail(item)" v-for="item in list" :key="item.id">
					<u-row>
						<u-col span="3">
							<u-image width="95%" height="130rpx" border-radius="4" :src="item.goodsImg" />
						</u-col>
						<u-col span="9">
							<view class="tit">
								<view>{{item.goodsName}}</view>
								<view>×{{item.num}}</view>
							</view>
							<view class="integral"><image class="gold_icon" src="/static/images/gold.png" mode="widthFix" /><text>{{item.amount}}</text></view>
							<view class="time">{{item.createTime}}</view>
						</u-col>
						<!-- <u-col span="3" style="text-align: center;">
							<u-button size="mini" type="warning" @click="toDetail(item)">查看</u-button>
						</u-col> -->
					</u-row>
				</view>
			</template>
			<template v-else>
				<u-empty text="暂无数据" mode="order" margin-top="100"></u-empty>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: "buyList",
		data() {
			return {
				activeItemStyle: {
					'font-size': '28rpx',
					 color: '#fff'
				},
				tabList: [{
						name: '未发货',
						status: 0
					},
					{
						name: '已发货',
						status: 1
					},
				],
				limit: 10,
				page: 1,
				list: [],
				current: 0,
			};
		},
		methods: {
			tabsChange(e) {
				this.current = e;
				this.page = 1;
				this.list = [];
				this.loadData();
			},
			async loadData() {
				const {
					page
				} = await this.$u.api.goodsorder_list({
					"limit": this.limit,
					"page": this.page,
					"status": this.tabList[this.current].status,
				})
				this.list = [...this.list, ...page.list];
			},
			toDetail({id}){
				this.$u.route({
					url: "/pages/shop/shopOrderDetail",
					params:{
						id
					}
				})
			}
		},
		created() {
			this.loadData();
		},
		onPullDownRefresh() {
			this.page = 1;
			this.list = [];
			this.loadData().then(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			this.page++;
			this.loadData();
		}
	}
</script>

<style scoped lang="scss">
	.main {
		.scroll-view {
			// height: calc(100vh - 80rpx - var(--window-top) - var(--window-bottom));
			margin-top: 40rpx;
			.lists {
				color: white;
				padding: 20rpx 0;
				margin: 0 10rpx 20rpx 10rpx;
				background: #2D2D46;
				.tit {
					font-size: 28rpx;
					margin-bottom: 10rpx;
					display: flex;
					justify-content: space-between;
				}

				.integral {
					font-size: 26rpx;
					color: #999;

					text {
						color: #fff;
						padding-right: 20rpx;
					}
					.gold_icon{
						width: 30rpx;
						height: 30rpx;
						vertical-align: middle;
					}
				}

				.time {
					margin-top: 10rpx;
					font-size: 26rpx;
					color: #999;
				}
			}
		}
	}
</style>

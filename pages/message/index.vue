<template>
	<view class="main">
		<view>
			<u-tabs-swiper 
				bg-color="#212121"
				inactive-color="#dfdfdf"
				active-color="#f37b1d"
				ref="uTabs" 
				:list="list" 
				:current="current" 
				@change="tabsChange" 
				:is-scroll="false" 
			/>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
					<view class="list-wrap">
						<view class="lists">
							<view>比赛场次多增20场咯</view>
							<view class="time">2020-11-29 15:54:20</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{name: '系统消息'}, {name: '比赛消息'}, {name: '充值消息'},
				],
				tabs: [{
					key: "system",
					list: []
				},{
					key: "game",
					list: []
				},{
					key: "recharge",
					list: []
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			}
		},
	};
</script>
<style scoped lang="scss">
	.main{
		background: $theme-color-dark;
		margin-top: var(--status-bar-height);
		.list-wrap{
			padding: 20rpx;
			.lists{
				background: #333;
				padding: 20rpx;
				border-radius: 4px;
				font-size: 28rpx;
				.time{
					font-size: 14px;
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
</style>

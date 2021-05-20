<template>
	<view class="main">
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
		<scroll-view class="scroll-view">
			<view class="list" v-for="(item,index) in 2">
				<u-row>
					<u-col :span="10">
						<view class="name">王者荣耀-入门赛</view>
						<view class="time">2020-12-11 12:12:01</view>
					</u-col>
					<u-col :span="2">
						<view class="count"><view class="span">1</view>张</view>
					</u-col>
				</u-row>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "ticketRecord",
		data() {
			return {
				list: [
					{name: '获得门票'}, {name: '使用门票'}, {name: '过期门票'},
				],
				current: 0,
			};
		},
		methods:{
			tabsChange(e){
				this.current = e;
			},
		}
	}
</script>

<style lang="scss">
	.main{
		.scroll-view{
			height: calc(100vh - 80rpx - var(--window-top) - var(--window-bottom));
			.list{
				margin: 20rpx 20rpx 0;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #999;
				.name{
					margin-bottom: 10rpx;
					font-size: 30rpx;
				}
				.time{
					font-size: 24rpx;
					color: #999;
				}
				.count{
					text-align: right;
					font-size: 24rpx;
					.span{
						font-size: 34rpx;
						color: $theme-color-light;
					}
				}
			}
		}
	}
</style>

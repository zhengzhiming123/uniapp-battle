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
		<view class="lists">
			<view class="list" v-for="(item,index) in 6" :key="index" @click="toDetail">
				<u-row>
					<u-col :span="3">
						<u-image
							width="100%" 
							height="120rpx" 
							src="http://games.mmkjkj.com/uploads/20201106/adc02c2196cdba0e448344e375415e61.png" 
						/>
					</u-col>
					<u-col :span="9">
						<view class="tit text-overflow-1">
							关于近期封禁违规账号的通知
						</view>
						<u-tag text="广告" type="warning" mode="dark" style="padding: 6rpx 15rpx;margin: 8rpx 0;" />
						<view class="txt text-overflow-1">
							和平精英和王者荣耀的赛事都会提前发布在赛事平台，大家每天可通过公众号底部菜单“我要参赛”进入赛事列表选择合适的时间报名参赛！
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
</template>


<script>
export default {
	name: "find",
  data() {
    return {
			list: [
				{name: '公告'}, {name: '新手教程'},
			],
			current: 0,
    };
  },
  methods: {
		tabsChange(e){
			this.current = e;
		},
		toDetail(e){
			this.$u.route('/pages/find/findeDetail');
		}
  }
};
</script>
<style scoped lang="scss">
	.main{
		margin-top: var(--status-bar-height);
		.list{
			margin: 30rpx 20rpx 0;
			border-bottom: 1px solid #666;
			padding-bottom: 20rpx;
			&:last-child{
				border: 0;
			}
			.tit{
				font-size: 28rpx;
			}
			.txt{
				font-size: 22rpx;
			}
		}
	}
</style>
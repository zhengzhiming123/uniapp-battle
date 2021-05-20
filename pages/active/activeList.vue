<template>
	<view>
		<template v-if="lists.length">
			<active v-for="(item,index) in lists" :key="index" :item="item" />
		</template>
		<template v-else>
			<u-empty text="暂无数据" mode="data" margin-top="200"></u-empty>
		</template>
	</view>
</template>

<script>
	import active from "../../components/activeItem/activeItem.vue";
	export default {
		name: "activeList",
		components: {active},
		data() {
			return {
				option:{
					"competitionId": 0,
          "roomType": "0",//高级赛
          "gameId": "",
					"limit": 10,
					"page": 1
				},
				lists: []
			};
		},
		onLoad(e) {
			this.option.competitionId = e.id;
			this.option.roomType = e.roomType?e.roomType:0;
			this.option.gameId = e.gameId?e.gameId:'';
			this.loadData();
		},
		methods:{
			async loadData(){
				const {page} = await this.$u.api.competition_rooms(this.option)
				this.lists = [...this.lists,...page.list];
			}
		},
		onPullDownRefresh(){
			this.option.page = 1;
			this.lists = [];
			this.loadData().then(()=>{
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom(){
			this.option.page++;
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	/* .lists{
		padding-bottom: 30rpx;
		margin: 0 10rpx 20rpx 10rpx;
		&:last-child{
			border: 0;
		}
		.tit{
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}
		.msg{
			font-size: 20rpx;
			margin-top: 10rpx;
			color: $theme-color-light;
		}
		.tags{
			font-size: 20rpx;
			padding: 3rpx 10rpx;
			display: inline-block;
			background: #f37b1d;
			border-radius: 6rpx;
		}
	} */
</style>

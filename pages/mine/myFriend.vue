<template>
	<view class="main">
		<template v-if="lists.length">
			<view class="lists" v-for="(item, index) in lists" :key="item.id">
				<u-row>
          <u-col span="1">
          	{{index + 1}}
          </u-col>
					<u-col span="3">
						<u-image width="112" height="112" border-radius="50%" :src="item.avatar?item.avatar:'/static/images/user.png'" />
					</u-col>
					<u-col span="8">{{item.username}}</u-col>
				</u-row>
			</view>
		</template>
		<template v-else>
			<u-empty text="暂无数据" mode="data" margin-top="200"></u-empty>
		</template>
	</view>
</template>

<script>
	export default {
		name: "myFriend",
		data() {
			return {
				option:{
					"competitionId": 0,
					"limit": 10,
					"page": 1
				},
				lists: []
			};
		},
		onLoad(e) {
			this.option.competitionId = e.id;
			this.loadData();
		},
		methods:{
			async loadData(){
				const {page} = await this.$u.api.user_inviteUserList(this.option)
				this.lists = [...this.lists,...page.list];
				console.log(this.lists)
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
	.main{
		padding-top: 20rpx;
	}
	.lists{
		border-bottom: 1px solid #313141;
		padding-bottom: 20rpx;
		margin: 0 40rpx 20rpx 40rpx;
	}
</style>

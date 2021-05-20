<template>
	<view class="main">
		<template v-if="list.length">
			<view class="list" v-for="item in list" :key="item.id">
				<u-row>
					<u-col span="2">
            <u-avatar :size="80" :src="item.userAvatar ? item.userAvatar : '/static/images/team_user.png'"></u-avatar>
					</u-col>
					<u-col span="9">
            <view class="user-name">
              {{item.userName}}
            </view>
            <view class="user-role-name">
              游戏昵称：{{item.userRoleName}}
            </view>
          
          </u-col>
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
		name: "activeUserList",
		data() {
			return {
        competitionRoomId: '',
        list: []
			};
		},
		onLoad(options) {
			this.competitionRoomId = options.id
			this.loadData();
		},
		methods:{
			loadData(){
				this.$u.api.competition_roomUserList({
          competitionRoomId: this.competitionRoomId
        }).then(res => {
          this.list = res.list;
        })
			}
		},
	}
</script>

<style lang="scss" scoped>
	.main{
		padding-top: 20rpx;
	}
	.list{
		border-bottom: 1px solid #313141;
		padding-bottom: 20rpx;
		margin: 0 40rpx 20rpx 40rpx;
    .user-name{
      font-size: 25rpx;
    }
    .user-role-name{
      font-size: 20rpx; 
      color:#909399;
      margin-top: 15rpx;
    }
	}
</style>

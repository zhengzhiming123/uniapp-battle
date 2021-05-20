<template>
	<view class="wrap">
		<view class="head" @click="$u.route('/pages/mine/updateUser')">
      <u-col :span="3" >
        <u-image
          width="112rpx" 
          height="112rpx" 
          border-radius="50%"
          :src="vuex_user&&vuex_user.avatar?vuex_user.avatar:'/static/images/user.png'" 
        />
      </u-col>
      <u-col :span="8">
        <view class="info">
          <view class="user_name">{{vuex_user.username}}</view>
          <!--<view class="user_level">普通用户</view>-->
        </view>
      </u-col>
      <u-col :span="1">
      	<u-icon name="edit-pen" />
      </u-col>
		</view>
		
		<view class="list" v-for="item in list">
			<u-image width="256rpx" height="272rpx" :src="item.gainsImage" />
			<view class="list_info">
				<view class="top">
					<view class="item">
						<view>淘汰数</view>
						<view>{{item.dieOutNum}}</view>
					</view>
					<view class="item">
						<view>{{item.name=='和平精英'?'吃鸡数':'获奖数'}}</view>
						<view class="val">{{item.winNum}}</view>
					</view>
				</view>
				<view class="top btm">
					<view class="item">
						<view>获奖率</view>
						<view>{{item.rewardRate}}</view>
					</view>
					<view class="item">
						<view>参赛数</view>
						<view class="val">{{item.signNum}}</view>
					</view>
					<view class="item">
						<view>获奖兑物券</view>
						<view class="val">{{item.rewardIntegral}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	methods: {
		
	},
	onLoad() {
		this.$u.api.user_userGames({}).then(res=>{
		  this.list = res.list;
		});
	}
};
</script>

<style lang="scss" scoped>
.wrap{
	padding: 20rpx;
	.head{
		display: flex;
		align-items: center;
		.info{
			margin-left: 20rpx;
			.user_level{
				font-size: 24rpx;
				color: #C2CAFF;
				margin-top: 10rpx;
			}
		}
	}
	.list{
		margin-top: 20rpx;
		background-color: #1E222E;
		border-radius: 10rpx;
		display: flex;
		.list_info{
			flex: 1;
			font-size: 24rpx;
			.top{
				display: flex;
				justify-content: center;
				margin: 40rpx 0;
				.item{
					width: 140rpx;
					text-align: center;
					.val{
						font-weight: bold;
					}
				}
			}
			.btm{
			}
		}
	}
}
</style>

<template>
	<view class="lists" @click="toDatail">
		<u-row>
			<u-col span="3">
				<u-image
					width="128rpx" 
					height="128rpx" 
					border-radius="4"
					:src="item.pic"
				/>
			</u-col>
			<u-col span="9">
				<view class="tit" style="display: flex; justify-content: space-between;">
          <view style="width: 200px;">{{item.name}}</view>
          <view v-if="item.signNum < item.num && item.signNum > 0 && item.status==0" style="font-size: 12px;" >已报名{{item.signNum}}</view>
          <view v-if="item.signNum == item.num && item.status==0" style="font-size: 12px;" >已满</view>
        </view>
        
				<view class="tag_wrap">
					<view class="tag_list">
						<view class="tags name" v-if="item.roomType == 0">{{item.competitionName}}</view>
						<view class="tags zone">{{item.gameZoneName}}</view>
						<view class="tags level">{{item.duanwei}}</view>
					</view>
					<view class="date_wrap">
            <view class="status" v-if="item.status == 1">已开赛</view>
            <view class="status" v-if="item.status == 2">已结束</view>
            <view class="status" v-if="item.status == 3">已取消</view>
            <image  v-if="item.status == 0" class="date_icon" src="/static/images/time.png" mode="widthFix" />
            <view v-if="item.status == 0" class="game_date">{{item.startTime.substring(11, 16)}}</view>
					</view>
				</view>
				<view class="reward">
					奖励：
					{{item.reward}}
				</view>
			</u-col>
			<!-- <u-col span="3" style="text-align: center;">
				<view style="margin-bottom: 5rpx;">
					<view class="tags">
						<u-icon :name="item.gameZoneName==='微信'?'weixin-fill':'qq-fill'" />{{item.gameZoneName}}
					</view>
				</view>
				<view style="margin-bottom: 5rpx;">
					<template v-if="item.signNum>=item.num">
						<view class="tags" style="background: red;">已满</view>
					</template>
					<template  v-else-if="item.signNum!=0 && item.signNum<item.num">
						<view class="tags" style="background: red;">已报名{{item.signNum}}位</view>
					</template>
				</view>
				<view>
					<view class="tags" style="background: #505050;">{{item.name}}</view>
				</view>
			</u-col> -->
		</u-row>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type: Object,
				required: true
			}
		},
		data() {
			return {
				
			};
		},
		onShow() {
			
		},
		methods:{
			toDatail(){
				this.$u.route({
					url: '/pages/active/activeDetail',
					params: {
						id: this.item.id
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lists{
		color: white;
		padding: 15rpx;
		margin: 0 20rpx 20rpx 20rpx;
		background: #36364B;
		border-radius: 10rpx;
		.tit{
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}
		.msg{
			font-size: 20rpx;
			margin-top: 10rpx;
			color: $theme-color-light;
		}
		.reward{
			font-size: 20rpx;
			margin-top: 15rpx;
			color: #fff;
			.gold_icon{
				width: 30rpx;
				height: 30rpx;
				vertical-align: bottom;
			}
		}
		.tag_wrap{
			display: flex;
			justify-content: space-between;
			.tags{
				font-size: 20rpx;
				padding: 3rpx 10rpx;
				display: inline-block;
				background-color: #f37b1d;
				border-radius: 6rpx;
				&.name{
					background-color: rgba(70,95,255,0.5);
					border: 1px solid #465FFF;
          margin-right: 10rpx;
				}
				&.zone{
					background-color: rgba(128,125,144,0.5);
					border: 1px solid #807D90;
					margin-right: 10rpx;
				}
				&.level{
					background-color: rgba(255,139,72,0.5);
					border: 1px solid #FF8B48;
					margin-right: 10rpx;
				}
			}
			.date_wrap{
				.date_icon{
					width: 40rpx;
					height: 40rpx;
					vertical-align: middle;
				}
				.game_date{
					display: inline-block;
					font-size: 20rpx;
					color: #fff;
					vertical-align: middle;
				}
			}
      .status {
        display: inline-block;
        vertical-align: middle;
        
        color: #fff;
        padding: 2px 8px;
        font-size: 12px;
        text-align: center;
        border-radius: 2px;
        background: #d71616;
      }
      
		}
	}
</style>

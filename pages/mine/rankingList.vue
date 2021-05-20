<template>
	<view>
		<view class="nav">
			<u-tabs 
				:list="navList" 
				:is-scroll="false" 
				:current="navCurrent" 
				@change="navChange"
				bg-color="none"
				inactive-color="#999999"
				active-color="#2B51FA"
				:active-item-style="activeNavStyle"
			></u-tabs>
		</view>
		
		<view class="type_nav">
			<u-tabs
				:list="typeList" 
				:is-scroll="false" 
				:current="typeCurrent" 
				@change="typeChange"
				:show-bar="false"
				bg-color="none"
				height="50"
				font-size="26"
				inactive-color="#fff"
				:active-item-style="activeTypeStyle"
			></u-tabs>
		</view>
		
		<view class="content">
			<view class="cup_icon_wrap">
				<u-image class="cup_icon" width="100%" height="100%" src="/static/images/ranking-cup-icon.png"></u-image>
				<view class="cup_text">{{typeList[typeCurrent].name+'榜'}}</view>
			</view>
			
			<view class="game_type" v-if="typeCurrent==2">
				<view class="game_item" :class="{active:curGameType==0}" @click="changeGameType('0')">1V1</view>
				<view class="game_item" :class="{active:curGameType==1}" @click="changeGameType('1')">5V5</view>
			</view>
			
			<view class="ranking_wrap">
				<view class="ranking_item silver">
					<view class="ranking_bg">
						<u-image width="100%" src="/static/images/silver-bg.png" mode="widthFix"></u-image>
						<view class="avatar_wrap">
							<u-image class="avatar" width="100%" height="100%" border-radius="50%" :src="userList[1].avatar" mode="widthFix"></u-image>
							<view class="user_name">{{userList[1].name}}</view>
						</view>
					</view>
				</view>
				<view class="ranking_item gold">
					<view class="ranking_bg">
						<u-image width="100%" src="/static/images/gold-bg.png" mode="widthFix"></u-image>
						<view class="avatar_wrap">
							<u-image class="avatar" width="100%" height="100%" border-radius="50%" :src="userList[0].avatar" mode="widthFix"></u-image>
							<view class="user_name">{{userList[0].name}}</view>
						</view>
					</view>
				</view>
				<view class="ranking_item bronze">
					<view class="ranking_bg">
						<u-image width="100%" src="/static/images/bronze-bg.png" mode="widthFix"></u-image>
						<view class="avatar_wrap">
							<u-image class="avatar" width="100%" height="100%" border-radius="50%" :src="userList[2].avatar" mode="widthFix"></u-image>
							<view class="user_name">{{userList[2].name}}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="podium_wrap">
				<u-image class="avatar" width="100%" height="100%" border-radius="50%" src="/static/images/podium-icon.png" mode="widthFix"></u-image>
				<view class="item_wrap">
					<view class="item silver">{{userList[1].gold}}金币</view>
					<view class="item gold">{{userList[0].gold}}金币</view>
					<view class="item bronze">{{userList[2].gold}}金币</view>
				</view>
			</view>
			
			<view class="ranking_list" v-if="rankingList.length>0">
				<view class="item" v-for="(item, idx) in rankingList" :key="idx">
					<view class="user_info">
						<view class="idx">{{idx+4}}</view>
						<view class="avatar">
							<u-image width="100%" height="100%" border-radius="50%" :src="item.avatar"></u-image>
						</view>
						<view class="name">{{item.name}}</view>
					</view>
					<view class="gold">{{item.gold}}金币</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: "rankingList",
		data() {
			return {
				activeNavStyle: {
					color: '#fff'
				},
				activeTypeStyle: {
					color: '#fff',
					background: '#2B51FA',
					'border-radius': '24rpx'
				},
				navList:[
					{name:'日榜'},
					{name:'总榜'}
				],
				navCurrent: 0,
				typeList:[
					{name:'奖金排行'},
					{name:'砖石排行'},
					{name:'活跃排行'},
					{name:'助力排行'}
				],
				typeCurrent: 0,
				userList: [
					{name: '用户名1', avatar:'/static/images/avatar1.jpg', gold: '11200'},
					{name: '用户名2', avatar:'/static/images/avatar1.jpg', gold: '6000'},
					{name: '用户名3', avatar:'/static/images/avatar1.jpg', gold: '6000'},
					{name: '用户名4', avatar:'/static/images/avatar1.jpg', gold: '6000'},
					{name: '用户名5', avatar:'/static/images/avatar1.jpg', gold: '6000'},
					{name: '用户名6', avatar:'/static/images/avatar1.jpg', gold: '6000'}
				],
				rankingList: [],	//第三名之后的数据
				curGameType: 0		//活跃排行 0：1v1；1：5v5
			};
		},
		onLoad(e) {
			if(this.userList.length>3){
				this.rankingList = this.userList.slice(3);
			}
		},
		methods:{
			navChange(idx){
				this.navCurrent = idx;
			},
			typeChange(idx){
				this.typeCurrent = idx;
			},
			changeGameType(idx){
				this.curGameType = idx;
			}
		}
	}
</script>

<style scoped lang="scss">
	.type_nav{
		border-top: 1px solid #666;
		padding: 30rpx;
	}
	.cup_icon_wrap{
		width: 250rpx;
		height: 268rpx;
		margin: 0 auto;
		position: relative;
		.cup_text{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%) translateY(-50%);
			white-space: nowrap;
			font-size: 70rpx;
			font-weight: bold;
			letter-spacing: 10rpx;
		}
	}
	
	.game_type{
		width: 460rpx;
		height: 60rpx;
		padding: 8rpx;
		margin: 0 auto;
		background: #454545;
		border-radius: 28rpx;
		margin-top: -60rpx;
		display: flex;
		.game_item{
			line-height: 46rpx;
			width: 50%;
			text-align: center;
			&.active{
				background: #666;
				border-radius: 28rpx;
			}
		}
	}
	.ranking_wrap{
		display: flex;
		justify-content: space-around;
		margin-top: 20rpx;
		.ranking_item{
			width: 33.33%;
			&.silver{
				padding-top: 80rpx;
			}
			&.bronze{
				padding-top: 100rpx;
			}
			.ranking_bg{
				width: 60%;
				margin: 0 auto;
				position: relative;
				.avatar_wrap{
					position: absolute;
					width: calc(100% - 40rpx);
					height: calc(100% - 40rpx);
					bottom: 16rpx;
					left: 13rpx;
					text-align: center;
					.user_name{
						margin-top: 30rpx;
						font-weight: bold;
					}
				}
				
			}
		}
	}
	.podium_wrap{
		margin-top: -20rpx;
		position: relative;
		.item_wrap{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			display: flex;
			justify-content: space-around;
			.item{
				font-size: 30rpx;
				&.silver{
					padding-top: 140rpx;
				}
				&.gold{
					padding-top: 80rpx;
				}
				&.bronze{
					padding-top: 160rpx;
				}
			}
		}
	}
	.ranking_list{
		margin-top: 20rpx;
		padding: 0 30rpx 10rpx;
		.item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			margin-bottom: 40rpx;
			.user_info{
				display: flex;
				align-items: center;
				.avatar{
					width: 100rpx;
					height: 100rpx;
					margin-left: 30rpx;
				}
				.name{
					margin-left: 30rpx;
				}
			}
			.gold{
				color: #FFBF00;
			}
		}
	}
	/deep/ .u-tab-item{
		border-radius: 24rpx;
	}
</style>

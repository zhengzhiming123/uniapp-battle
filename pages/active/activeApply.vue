<template>
	<view class="main">
		<!-- <u-image
			width="100%" 
			height="270rpx" 
			class="imgs"
			border-radius="10rpx" 
			:src="info.pic"
		/> -->
    
    <u-modal v-model="modal.show" :title="modal.title" :content="modal.content" show-cancel-button="true" confirm-text="立即报名" cancel-text="取消" @confirm="modalConfirm"></u-modal>
    
		<view class="title">{{info.name}}</view>
		<view class="info">{{info.gameName}} | {{info.gameZoneName}} | 段位:{{info.duanwei}}</view>
		<view class="desc"  v-if="info.roomType == 0">报名需要支付：1张 {{info.gameName}}-{{info.competitionName}} 门票</view>
		<view class="box">
			<view class="game-info"><view class="tit">用户昵称:</view>{{vuex_user.username}}</view>
			<view v-if="user">
				<view class="game-info"><view class="tit">角色昵称:</view>{{user.name}}</view>
				<view class="game-info"><view class="tit">角色段位:</view>{{user.rankName}}</view>
			</view>
			<view v-else class="noUser" @click="$u.route('/pages/mine/myRole')">
				<u-icon name="plus" />添加角色
			</view>
			<!-- <view class="game-info"><view class="tit">报名截止:</view>{{info.signEndTime}}</view>
			<view class="game-info"><view class="tit">比赛开始:</view>{{info.startTime}}</view> -->
		</view>
		<view class="time-box">
			<view class="time">
				<view>报名开始</view>
				<u-image class="time-icon" src="/static/images/time-icon.png" border-radius="32" width="64" height="64" />
				<view  class="time-text">{{info.signTime.substring(10,16)}}</view>
			</view>
			<view class="time-line"></view>
			<view class="time">
				<view>比赛开始</view>
				<u-image class="time-icon" src="/static/images/time-icon.png" border-radius="32" width="64" height="64" />
				<view  class="time-text">{{info.startTime.substring(10,16)}}</view>
			</view>
		</view>
		<view class="box" v-if="info.roomType == 0">
			<view class="ticken">
				<view>{{info.gameName}}-{{info.competitionName}}(剩余{{num}}张)</view>
				<u-button class="button" size="mini" type="primary" @click="toBuyTicket">兑换门票</u-button>
			</view>
		</view>
    
    <!--竞技赛-->
		<view class="reminder" v-if="info.roomType == 0">
			<view>游戏等级必须达到18级，才能进入房间房间内</view>
			<view>房间内禁止拉未报名好友，否则成绩作废</view>
			<u-button v-if="num > 0" class="btn" type="primary" @click="submit">报名</u-button>
      <u-button v-if="num == 0" class="btn" type="primary" @click="toBuyTicket">购买门票</u-button>
		</view>
    
    <!--免费赛-->
    <view class="reminder" v-if="info.roomType == 2">
    	<view>游戏等级必须达到18级，才能进入房间房间内</view>
    	<view>房间内禁止拉未报名好友，否则成绩作废</view>
    	<u-button class="btn" type="primary" @click="submit">报名</u-button>
    </view>
    
	</view>
</template>

<script>  
	export default {
		name: "activeApply",
		data() {
			return {
				info: {},
				num: 0,
				user: undefined,
        
        modal:{
          show: false,
          title: '提示',
          content: ''
        }
			}
		},
		methods:{
			submit(){
        if(this.user){
          this.modal.show = true;
          this.modal.content = '是否立即报名';
				} else {
					this.$util.showToast("请选择角色");
				}
			},
      modalConfirm() {
        this.$u.api.competition_enroll({
          "competitionRoomId": this.info.competitionRoomId,
          "team": this.info.team||"",
          "userRoleId": this.user.id
        }).then(res=>{
          this.$util.submitModal("","报名成功",()=>{
            this.$u.route({
              type: "navigateBack",
            })
          })
        })
      },
      toBuyTicket() {
          this.$u.route('/pages/mine/ticket/buyTicket');
      }
		},
    onLoad(options) {
      this.info = options;
    },
		onShow() {
			this.$u.api.userTicket_userTickets({}).then(({list})=>{
				const obj = list.find(item=>item.gameId==this.info.gameId&&item.competitionId==this.info.competitionId);
				if(obj){
					this.num = obj.num;
				}
			})
			this.$u.api.userRole_list({}).then(({list})=>{
				this.user = list.find(item=>item.gameZoneId==this.info.gameZoneId&&item.gameId==this.info.gameId);
			})
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding: 20rpx;
		position: relative;
		padding-bottom: 110rpx;
		.title{
			font-size: 32rpx;
			text-align: center;
			margin-top: 25rpx;
		}
		.info{
			margin-top: 25rpx;
			color: #aaa;
			text-align: center;
			font-size: 26rpx;
		}
		.desc{
			text-align: center;
			color: #FF8B48;
			font-size: 24rpx;
			background-color: #2C2C46;
			line-height: 80rpx;
			margin-top: 30rpx;
		}
		.box{
			background: #36364B;
			border-radius: 8rpx;
			padding: 25rpx;
			margin-bottom: 20rpx;
      margin-top: 20rpx;
			.game-info{
				display: flex;
				margin-bottom: 15rpx;
				font-size: 26rpx;
				&:last-child{
					margin-bottom: 0;
				}
				.tit{
					width: 170rpx;
				}
			}
			.ticken{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.button{
					margin: 0;
				}
			}
		}
		.time-box{
			background-color: #36364B;
			border-radius: 10rpx;
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			margin-bottom: 20rpx;
			.time{
				width: 150rpx;
				text-align: center;
				.time-icon{
					margin: 0 auto;
				}
			}
			.time-line{
				width: 350rpx;
				height: 2rpx;
				background-color: #C2CAFF;
				margin-bottom: 35rpx;
			}
		}
		.reminder{
			position: fixed;
			left: 20rpx;
			bottom: 20rpx;
			width: calc(100% - 40rpx);
			margin-top: 40rpx;
			font-size: 25rpx;
			color: $theme-color-light;
			text-align: center;
			view{
				margin-top: 15rpx;
				color: #807D90;
			}
			.btn{
				margin-top: 20rpx;
			}
		}
	}

	/deep/ .uni-steps__row-desc{
		margin: 10rpx 0 5rpx 0;
	}
</style>

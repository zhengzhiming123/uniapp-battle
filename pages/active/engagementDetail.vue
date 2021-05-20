<template>
	<view class="wrap">
		<view class="content_wrap">
			<view class="name_wrap">
				<view>VS约战</view>
				<view>{{statusMap[info.status]}}</view>
			</view>
			<view class="tag_wrap">
				<view class="tag_list">
					<view class="tag tag0">
						1V1
					</view>
					<view class="tag tag1">
						{{info.gameName}}
					</view>
					<view class="tag" v-if="info.gameZoneId==1">
						<image class="imgs" mode="heightFix" src="/static/images/weixin-zone-icon.png" :lazy-load="false"/>
					</view>
					<view class="tag" v-if="info.gameZoneId==2">
						<image class="imgs" mode="heightFix" src="/static/images/tag3-icon.png" :lazy-load="false"/>
					</view>
				</view>
				<view class="room_num">房间编号：{{info.id}}</view>
			</view>
			<view class="team_wrap">
				<image
					class="imgs"
					mode="widthFix"
					src="../../static/images/team-bg.png"
					:lazy-load="false"
				/>
				<view class="team_box team_left">
					<view class="team_info">
						<image
							class="imgs"
							mode="widthFix"
							:src="leftUser.userAvatar || '/static/images/team_user.png'"
							:lazy-load="false"
						/>
						<view class="team_name">{{leftUser.userRoleName}}</view>
					</view>
				</view>
        
				<view class="team_box team_right">
					<view class="team_info" v-if="rightUser.userRoleName">
						<image
							class="imgs"
							mode="widthFix"
							:src="rightUser.userAvatar || '/static/images/team_user.png'"
							:lazy-load="false"
						/>
						<view class="team_name">{{rightUser.userRoleName}}</view>
					</view>
				</view>
			</view>
			<view class="reward_wrap">
				<view class="title">比赛奖励</view>
				<view>{{info.reward}}</view>
			</view>
			
			<view class="intro_wrap">
				<view class="title">比赛规则</view>
				<view v-html="info.rules"></view>
			</view>
		</view>
		
		<view class="btn_wrap" v-if="info.status!=2">
			<view class="game_link" v-if="info.createUser && (info.status==0||info.status==1)" @click="showGameLink = true">
				<image class="imgs" mode="widthFix" src="/static/images/link-icon.png" :lazy-load="false"/>
				<view class="link">游戏链接</view>
			</view>
			
			<view class="btn btn3" v-if="info.status==0 && !info.createUser && info.teamNumber<2" @click="doEnroll">立即报名</view>
			<view class="btn btn2"  v-if="info.status==0 && (isEnroll || info.createUser)" @click="toGame">进入赛事房间
				<u-count-down v-if="info.countDown" :timestamp="info.countDown" :show-hours="false" bg-color="#f1641c" color="#fff" separator-color="#fff" @end="handleCountDownEnd"></u-count-down>
			</view>
			<view class="btn btn1" v-if="info.status==1 && (isEnroll || info.createUser)" @click="gotoUploadProof">提交比赛结果</view>
			<view class="btn btn2"  v-if="info.status==1 && (isEnroll || info.createUser)" @click="toGame">进入赛事房间 
			</view>
			<view class="btn btn4" v-if="info.status==0 && info.createUser" @click="doDelRoom">取消房间</view>
		</view>
		
		<u-modal v-model="showGameLink" :content-slot="true" :show-cancel-button="true" @confirm="editRoomUrl">
      <view class="slot-content">
        <view class="tips">游戏链接</view>
        <view>
          <input class="url_input" focus type="text" maxlength="1024" v-model="roomUrl" />
        </view>
      </view>
		</u-modal>
		
		<u-toast ref="uToast" />
    
    <u-modal v-model="modal.show" :title="modal.title" :content="modal.content" show-cancel-button="true" confirm-text="立即报名" cancel-text="取消" @confirm="modalConfirm"></u-modal>
		
		<u-modal v-model="showCancel" :content-slot="true" :show-cancel-button="true" @confirm="doCancelRoom" >
      <view class="slot-content">
        确认取消吗？
      </view>
		</u-modal>
		
		<u-mask :show="qrShow" @click="qrShow = false">
			<view class="mask-warp">
				<view style="padding: 40rpx;border-radius: 10rpx;background: #fff;">
					<u-image width="350" height="350" :src="qrcode" />
				</view>
				<view class="mask-txt">微信扫描二维码进入比赛</view>
				<u-icon class="icon" name="close-circle" />
			</view>
		</u-mask>
		
	</view>
</template>

<script>
import QR from "../../static/lib/wxqrcode.js"
export default {
	name: "engagement",
	components: {},
	data() {
		return {
			competitionRoomId: '',
			info: {},
      
			statusMap: {
				'0': '未开赛',
				'1': '已开赛',
				'2': '已结束',
				'3': '已取消',
			},
      
      modal:{
        show: false,
        title: '提示',
        content: ''
      },
      
      leftUser: {},
      rightUser: {},
      
			showGameLink: false,
			roomUrl: '',
			showCancel: false,
			isEnroll: false,
			qrShow: false,
			qrcode:""
		};
	},
	onLoad(e) {
		this.competitionRoomId = e.competitionRoomId;
		this.loadData();
		this.getIsEnroll();
	},
	methods:{
		loadData(){
			this.$u.api.competition_roomInfo({
				competitionRoomId: this.competitionRoomId
			}).then(({data})=>{
        if(data.rules){
          data.rules = data.rules.replace(/\n/g,'<br/>')
          data.rules = data.rules.replace(/ /g,' &nbsp')
        }
        this.info = data;
        this.roomUrl = data.gameUrl;
        
        this.leftUser = data.usersEntityList[0]
        this.rightUser = data.usersEntityList[1] || {}
			})
			
		},
		editRoomUrl () {
			if(!this.roomUrl){
				this.$refs.uToast.show({
					title: '请输入游戏链接',
					type: 'fail'
				})
				return false;
			}
			let param = {
				roomId: this.competitionRoomId,
				roomUrl: this.roomUrl
			}
			this.$u.api.competition_userEditRoom(param).then(({data})=>{
        this.$util.showToast('修改成功')
			})
		},
		gotoUploadProof () {
			this.$u.route({
				url: '/pages/active/uploadProof',
			  params: {
			    id: this.competitionRoomId,
			  }
			});
		},
		toGame() {
		  if(!this.info.gameUrl) {
		    this.$util.submitModal('提示', '还未创建游戏房间，请稍后');
		    return;
		  }
			if(this.info.gameZoneName==="微信"){
				this.qrcode = QR.createQrCodeImg(this.info.gameUrl, {
					size: parseInt(350),
				})
				this.qrShow = true;
			}else{
				// #ifdef APP-PLUS
				plus.runtime.openURL(this.info.gameUrl);
				// #endif
			}
		},
		showToast() {
			this.$refs.uToast.show({
				title: '修改成功',
				type: 'success'
			})
		},
		handleCountDownEnd () {
			this.info.status = 1;
			this.$forceUpdate();
		},
		doCancelGame () {
			this.showCancel = true;
		},
		doCancelRoom () {
			let param = {};
			this.$u.api.competition_userEditRoom(param).then(({data})=>{
				this.showToast();
			})
		},
		getIsEnroll () {
			let param = {
				"competitionRoomId": this.competitionRoomId,
				"userRoleId": this.vuex_user.id
			};
			this.$u.api.competition_isEnroll(param).then(({isEnroll})=>{
				this.isEnroll = isEnroll;
			})
		},
		doEnroll () {
			//报名
			if(!this.$util.isLogin(this)) {
			  this.$util.submitModal('提示', '您还未登录，请先登录', () => {
			    this.$u.route('/pages/mine/login');
			  })
			  return ;
			}
     
      this.modal.show = true;
      this.modal.content = '是否立即报名';
		},
    modalConfirm() {
      let param = {
      	"competitionRoomId": this.competitionRoomId,
      	//"team": 1,
      	"userRoleId": this.vuex_user.id
      };
      console.log(param)
      this.$u.api.competition_enroll(param).then(res=>{
        this.$util.submitModal("","报名成功",()=>{
          this.loadData();
      		this.getIsEnroll();
        })
      })
    },
    
		doDelRoom () {
			this.$util.showModal('提示', '是否取消房间', () => {
				let param = {
					"competitionRoomId": this.competitionRoomId
				};
				console.log(param)
			  this.$u.api.competition_userDelRoom(param).then(res=>{
			    this.$util.submitModal("","取消成功",()=>{
			      this.$u.route({
			      	url: '/pages/active/engagement'
			      });
			    })
			  })
			})
		}
	},
	computed:{
		
	}
}
</script>

<style scoped lang="scss">
page{
	background-color: #1C1B20;
}
.wrap{
	padding: 30rpx 20rpx;
	.content_wrap{
		padding-bottom: 90rpx;
	}
	.name_wrap{
		display: flex;
		justify-content: space-between;
		color: #fff;
		font-size: 14px;
	}
	.tag_wrap{
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.tag_list{
			display: flex;
			.tag{
				height: 38rpx;
				margin-right: 10rpx;
				&.tag0{
					background-color: #d71616;
					color: #fff;
					font-size: 12px;
					height: 38rpx;
					line-height: 38rpx;
					padding: 0 8px;
					border-radius: 3px;
				}
				&.tag1{
					background-color: #8416d7;
					color: #fff;
					font-size: 12px;
					height: 38rpx;
					line-height: 38rpx;
					padding: 0 8px;
					border-radius: 3px;
				}
				.imgs{
					height: 100%;
				}
			}
		}
		.room_num{
			color: #fff;
			font-size: 12px;
		}
	}
	.team_wrap{
		position: relative;
		margin-top: 20rpx;
		.imgs{
			width: 100%;
		}
		.team_box{
			position: absolute;
			width: 50%;
			top: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			&.team_left{
				left: 0;
				.team_info{
					margin-left: -130rpx;
				}
			}
			&.team_right{
				right: 0;
				.team_info{
					margin-right: -130rpx;
				}
			}
			.team_info{
				width: 150rpx;
				.imgs{
					width: 100%;
					border-radius: 50%;
				}
				.team_name{
					text-align: center;
				}
			}
		}
	}
  
  .reward_wrap{
    margin-top: 20rpx;
    background: #2d2d39;
    padding: 20rpx 30rpx;
    border-radius: 5px;
    line-height: 40rpx;
    .title{
      font-size: 30rpx;
      font-weight: 700;
      padding: 30rpx 0rpx;
    }
  }
	
	.intro_wrap{
		margin-top: 20rpx;
		background: #2d2d39;
		padding: 20rpx 30rpx;
		border-radius: 5px;
		line-height: 40rpx;
    .title{
      font-size: 30rpx;
      font-weight: 700;
      padding: 30rpx 0rpx;
    }
	}
	
	.btn_wrap{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #1C1B20;
		.game_link{
			color: #fff;
			font-size: 12px;
			text-align: center;
			.imgs{
				width: 50rpx;
				margin: 0 auto;
			}
			.link{
				font-size: 12px;
			}
		}
		.btn{
			width: 40%;
			height: 80rpx;
			line-height:80rpx;
			color: #fff;
			text-align: center;
			line-height: 1em;
			border-radius: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			&.btn1{
				background: #2c3556;
			}
			&.btn2{
				background: #f1641c;
			}
			&.btn3{
        width: 90%;
				background: #2979ff;
			}
			&.btn4{
				background: #e1e5ec;
				color: #666;
			}
		}
	}
	.slot-content{
		height: 400rpx;
		color: #333;
		padding: 0 30rpx;
		.tips{
			font-size: 14px;
			margin-top: 50rpx;
		}
		.url_input{
			width: 100%;
			height: 60rpx;
			border: 1px solid #d6d6d6;
			border-radius: 5rpx;
			margin-top: 20rpx;
			padding-left: 20rpx;
		}
	}
	
	.mask-warp{
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.mask-txt{
			margin-top: 30rpx;
		}
		.icon{
			margin-top: 50rpx;
			font-size: 60rpx;
		}
	}
}
</style>

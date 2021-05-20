<template>
	<view class="main">
		<!-- <u-image
			width="100%" 
			height="270rpx" 
			class="imgs"
			border-radius="10rpx" 
			:src="info.pic"
		/> -->
		<view class="title">{{info.name}}</view>
		<view class="info">{{info.gameName}} | {{info.gameZoneName}} | {{info.duanwei}} | 房间号:{{info.id}}</view>
		<view class="desc" v-if="info.roomType == 0">报名需要支付：1张 {{info.gameName}}-{{info.competitionName}} 门票</view>
		<view class="box">
			<view class="tit">比赛赛程</view>
			<uniSteps class="steps" :active="-1" :options="stepsOptions" active-color="rgb(153, 153, 153)" />
		</view>
    
    <view class="box" v-if="info.teamStatus===0 && userList.length > 0">
      <view class="tit" >参赛选手
        <view class="tit-more" @click="gotoUserList(info.id)">查看更多 
          <u-icon name="arrow-right" :size="12"></u-icon>
        </view>
      </view>
      <view class="user-wrap" >
        <view class="user-item" v-for="item in userList" :key="item.id">
          <u-avatar :size="80" :src="item.userAvatar ? item.userAvatar : '/static/images/team_user.png'"></u-avatar>
          <span class="user-item-name">{{item.userRoleName}}</span>
        </view>
      </view>
    </view>
    
		<view class="box" v-if="info.teamStatus===1">
			<view class="selectTeam">
				<text>队伍</text>
				<u-button type="primary" size="mini" style="margin: 0;" @click="show=true">
					<template v-if="!teamSelected">选择队伍</template>
					<template v-else>队伍: {{teamSelected.text}}</template>
				</u-button>
			</view>
		</view>
		<view class="team-wrap" v-if="info.teamStatus===1">
			<!-- <image class="team-tit" src="../../static/images/team.png" mode="widthFix"></image> -->
			<view class="team-group">
				<view class="room">
					<view class="room-tit up">房间上方</view>
					<view class="list" v-for="item in team1" :key="item.userId">
            <u-avatar :size="80" :src="item.userAvatar ? item.userAvatar : '/static/images/team_user.png'"></u-avatar>
						<view class="team-user-name-left">{{item.userRoleName}}</view>
					</view>
				</view>
				<view class="room">
					<view class="room-tit down">房间下方</view>
					<view class="list" v-for="item in team2" :key="item.userId" style="justify-content: flex-end;">
						<view class="team-user-name-right">{{item.userRoleName}}</view>
            <u-avatar :size="80" :src="item.userAvatar ? item.userAvatar : '/static/images/team_user.png'"></u-avatar>
					</view>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="tit">赏金计划</view>
			<view class="txt-wrap">
				<text>{{info.rewardDesc}}</text>
			</view>
		</view>
		<view class="box">
			<view class="tit">比赛规则</view>
			<view class="txt-wrap">
				<text>{{info.rules}}</text>
			</view>
		</view>
    
    
    <view class="btn_wrap">
      <u-button v-if="info.status == 0" class="btn btn1" type="primary" @click="toApply">{{isEnroll===0?'报名':'已报名'}}</u-button>
      <u-button v-if="info.status == 1 && isEnroll===0" class="btn btn2" :disabled="true" type="warning">比赛已开始</u-button>
       
      <u-button v-if="info.status == 1 && isEnroll===1" class="btn btn3" type="primary" @click="gotoUploadProof">提交比赛结果</u-button>
      <u-button v-if="info.status == 1 && isEnroll===1" class="btn btn3" type="warning" @click="toGame">进入房间</u-button>
      
      <u-button v-if="info.status == 2" class="btn btn2" :disabled="true" type="warning">比赛已结束</u-button>
      <u-button v-if="info.status == 3" class="btn btn2" :disabled="true" type="warning">比赛已取消</u-button>
    </view>
      
		<u-picker mode="selector" v-model="show" :range="teamList" range-key="text" @confirm="choiceTeam"></u-picker>
		
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
	import uniSteps from "../../components/uni-steps/uni-steps"
	import QR from "../../static/lib/wxqrcode.js"
	export default {
		name:"activeDetail",
		components: {uniSteps},
		data() {
			return {
				isEnroll: 0,	//0未报名 1已报名
				id: "",
				info: {},
				team1:[
					{userRoleName:"角色1"},{userRoleName:"角色2"},{userRoleName:"角色3"},{userRoleName:"角色4"},{userRoleName:"角色5"}
				],
				team2:[
					{userRoleName:"角色1"},{userRoleName:"角色2"},{userRoleName:"角色3"},{userRoleName:"角色4"},{userRoleName:"角色5"}
				],
        userList: [],
				teamList:[],
				teamSelected: "",	//选择的队伍
				show: false,	//选择队伍显示
        
				stepsOptions: [
					{title:'报名开始',desc:''},
					{title:'比赛开始',desc:''},
					{title:'比赛结束',desc:''}
				],
				qrShow: false, //二维码显示
				qrcode:"",
			}
		},
		methods:{
      choiceTeam(e) {
        this.teamSelected = this.teamList[e[0]];
      },
      //去报名
			toApply(){
        if(!this.$util.isLogin(this)) {
          this.$util.submitModal('提示', '您还未登录，请先登录', () => {
            this.$u.route('/pages/mine/login');
          })
          return ;
        }else if((this.teamSelected==="" && this.info.teamStatus===1) || (this.teamSelected.value==="" && this.info.teamStatus===1)){
					this.$util.showToast("请选择队伍");
					return;
				}
				
				if(this.isEnroll===0){
          //竞技赛
					const {duanwei,gameName,gameZoneId,gameZoneName,pic,competitionName,signTime,startTime,competitionId,gameId,roomType} = this.info;
					this.$u.route({
						url: "/pages/active/activeApply",
						params: {
							duanwei,
              gameName,
              gameZoneName,
              gameZoneId,
              pic,
              competitionName,
              signTime,
              startTime,
              competitionId,
              gameId,
              roomType,
							team:this.teamSelected.value,
							competitionRoomId: this.competitionRoomId,
						}
					});
				}
			},
			roomInfo(){
        this.teamList = [];
				this.$u.api.competition_roomInfo({
					competitionRoomId: this.competitionRoomId
				}).then(({data})=>{
          var signTime = data.signTime.substring(5,16);
          var startTime =  data.startTime.substring(5,16);
					this.stepsOptions = [
						{title:'报名开始',desc: signTime},
						{title:'比赛开始',desc: startTime},
						{title:'比赛结束',desc:''}
					]
          this.userList = data.usersEntityList;
					const team1 = data.usersEntityList.filter(it=>it.team===1);
					const team2 = data.usersEntityList.filter(it=>it.team===2);
					team1.forEach((item,index)=>{
						this.team1[index] = item;
					})
					team2.forEach((item,index)=>{
						this.team2[index] = item;
					})
          
          if(data.teamCount == 2) {
            this.teamList.push({
              text: "房间上方",
              value: 1
            });
            this.teamList.push({
              text: "房间下方",
              value: 2
            });
          } else {
            for (var i = 1; i <= data.teamCount; i++) {
            	this.teamList.push({
            	  text: "队伍" + i,
            	  value: i
            	});
            }
          }
					
					this.info = data;
				})
			},
      //进入房间
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
      //查看参赛用户
      gotoUserList(id) {
        this.$u.route({
          url: '/pages/active/activeUserList',
          params: {id}
        })
      },
      //上传比赛结果
      gotoUploadProof () {
      	this.$u.route({
      		url: '/pages/active/uploadProof',
      	  params: {
      	    id: this.competitionRoomId,
      	  }
      	});
      },
		},
    onLoad(options) {
      this.competitionRoomId = options.id;
    },
    onShow(options) {
			this.roomInfo();
			
      if(this.$util.isLogin(this)) {
        this.$u.api.competition_isEnroll({
        	"competitionRoomId": this.competitionRoomId,
        	"userRoleId": this.vuex_user.id
        }).then(({isEnroll})=>{
        	this.isEnroll = isEnroll;
        })
      }
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
			.tit{
				font-size: 28rpx;
				border-bottom: 1px solid #313141;
				padding-bottom: 20rpx;
        .tit-more {
          float: right; 
          font-size: 13px; 
          color: #909399;
        }
			}
			.steps{
				margin: 50rpx 0 10rpx;
			}
			.txt-wrap{
				margin-top: 20rpx;
				font-size: 25rpx;
				color: #ddd;
			}
			.selectTeam{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
    .user-wrap{
      display: flex;
      overflow-x: scroll;
      .user-item{
        padding: 10rpx;
        display: flex;
        flex-direction: column;
        margin-right: 20rpx;
      }
      .user-item-name{
        text-align: center;
        font-size: 26rpx;
        margin-top: 10rpx;
        width: 80rpx;
        overflow: hidden; 
        white-space: nowrap; 
        text-overflow: ellipsis;
      }
    }
		.team-wrap{
			background: #0f1620;
			border-radius: 10rpx;
			overflow: hidden;
			margin-top: 20rpx;
			position: relative;
			margin-bottom: 20rpx;
			.team-tit{
				position: absolute;
				width: 70%;
				left: 50%;
				margin-left: -35%;
				top: 20rpx;
			}
			.team-group{
				display: flex;
				justify-content: space-between;
				.room{
					width: 49%;
					background-color: #36364B;
					.room-tit{
						background-color: #2C2C46;
						font-size: 28rpx;
						line-height: 70rpx;
						&.up{
							color: #465FFF;
							padding-left: 20rpx;
						}
						&.down{
							color: #FF4646;
							text-align: right;
							padding-right: 20rpx;
						}
					}
          .team-user-name-left{
            margin-left: 10px;
            font-size: 26rpx;
            overflow: hidden; 
            white-space: nowrap; 
            text-overflow: ellipsis;
          }
          .team-user-name-right{
            margin-right: 10px;
            font-size: 26rpx;
            overflow: hidden; 
            white-space: nowrap; 
            text-overflow: ellipsis;
          }
				}
				.list{
					display: flex;
					align-items: center;
					padding: 10rpx 20rpx 10rpx 20rpx;
				}
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
          width: calc(100% - 40px);
    		}
    		&.btn2{
          width: calc(100% - 40px);
    		}
    		&.btn3{
          width: 40%;
    		}
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

	/deep/ .uni-steps__row-desc{
		margin: 10rpx 0 5rpx 0;
	}
</style>

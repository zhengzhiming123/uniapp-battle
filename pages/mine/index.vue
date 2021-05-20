<template>
	<view class="main">
		<view class="head">
			<u-row class="info">
				<u-col :span="3">
					<u-image
						width="85%" 
						height="114rpx" 
						border-radius="50%"
						:src="vuex_user&&vuex_user.avatar?vuex_user.avatar:'/static/images/user.png'" 
					/>
				</u-col>
				<u-col :span="8">
					<view v-if="vuex_user" @click="$u.route('/pages/mine/personalCenter')">
						<view class="user_name">{{vuex_user.username}}</view>
						<view class="user_level"><!--普通用户-->
							<view class="sign_in_btn" :class="todayIsSign==1?'sign_in_btn_gray':''" @click.stop="toSignIn">{{todayIsSign==1?'已签到':'签到'}}</view>
						</view>
					</view>
					<template v-else>
						<view class="toLogin" @click="toLogin">立即登录</view>
					</template>
				</u-col>
				<u-col :span="1">
					<u-icon name="arrow-right" />
				</u-col>
			</u-row>
			<!-- <u-image
				width="100%" 
				height="110rpx" 
				src="../../static/images/vip.png"
			/> -->
		</view>
		
		<view class="nav_list">
			<view class="nav_item" v-for="item in navList" :key="item.name"  @click="navigateTo(item.src, item.login)">
				<u-image class="nav_icon" width="48rpx" height="48rpx" :src="item.icon" />
				<view class="item_text">{{item.name}}</view>
			</view>
		</view>
		
		<view class="lists">
			<u-row class="list" v-for="item in list1" :key="item.name" @click="navigateTo(item.src, item.login)">
				<u-col :span="1">
					<u-image width="100%" height="36rpx" :src="item.icon" />
				</u-col>
				<u-col :span="10">{{item.name}}</u-col>
				<u-col :span="1">
					<u-icon name="arrow-right" color="#999" />
				</u-col>
			</u-row>
		</view>
		
		<view class="lists">
			<u-row class="list" v-for="item in list2" :key="item.name" @click="navigateTo(item.src, item.login)">
				<u-col :span="1">
					<u-image width="100%" height="36rpx" :src="item.icon" />
				</u-col>
				<u-col :span="10">{{item.name}}</u-col>
				<u-col :span="1">
					<u-icon name="arrow-right" color="#999" />
				</u-col>
			</u-row>
		</view>
		
		<u-button v-if="vuex_user" type="error" style="margin-top: 40rpx;font-size: 28rpx;" @click="logoutModal=true">退出登录</u-button>
		
		<u-modal 
			v-model="logoutModal" 
			confirm-color="#f37b1d" 
			content="确定退出登录" 
			:show-title="false" 
			:show-cancel-button="true" 
			@confirm="logout"  
		/>
	</view>
</template>


<script>
export default {
	name: "mine",
  data() {
    return {
			logoutModal: false,
			navList: [
				{
					icon: "/static/images/mine_icon1.png",
					name: "我的比赛",
					src: "/pages/mine/myGame",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon2.png",
					name: "我的门票",
					src: "/pages/mine/ticket/myTicket",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon3.png",
					name: "邀请好友",
					src: "/pages/mine/invite",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon4.png",
					name: "战绩",
					src: "/pages/mine/gameRecord",
				  login: 1
				}
			],
			list1: [
        {
        	icon: "/static/images/mine_icon5.png",
        	name: "我的钻石",
        	src: "/pages/mine/myDiamond",
          login: 1
        },
				{
					icon: "/static/images/mine_icon5.png",
					name: "我的兑物券",
					src: "/pages/mine/integral/myIntegral2",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon6.png",
					name: "门票商城",
					src: "/pages/mine/ticket/buyTicket",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon7.png",
					name: "我的角色",
					src: "/pages/mine/myRole",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon8.png",
					name: "我的地址",
					src: "/pages/mine/address/site",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon9.png",
					name: "我的好友",
					src: "/pages/mine/myFriend",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon9.png",
					name: "排行榜",
					src: "/pages/mine/rankingList",
				  login: 1
				}
			],
			list2: [
				{
					icon: "/static/images/mine_icon10.png",
					name: "实名认证",
					src: "/pages/mine/realAuth",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon11.png",
					name: "客服帮助",
					src: "/pages/mine/service",
				  login: 1
				},
				{
					icon: "/static/images/mine_icon14.png",
					name: "设置",
					src: "/pages/mine/setting/index",
				  login: 0
				}
			],
      
      todayIsSign: 0
    };
  },
  methods: {
		navigateTo(src, needLogin){
      if(!this.$util.isLogin(this) && needLogin == 1) {
        this.$util.submitModal('提示', '您还未登录，请先登录', () => {
          this.$u.route('/pages/mine/login');
        })
        return ;
      }
      if(src == '/pages/mine/service') {
        this.linkKefu();
        return;
      }
			if(src){
				this.$u.route(src);
			}
		},
    getSignDays(){
      this.$u.api.userSignin_usersign({}).then(res=>{
        if(res.code == 0){
          this.todayIsSign = res.todayIsSign;
      	}
      })
    },
		logout(){
			this.$u.vuex("vuex_user",null);
			this.$u.vuex("vuex_token_expire",null);
			this.$u.vuex("vuex_token","");
			this.$util.showToastSuc("退出成功")
		},
		toLogin(){
			this.$u.route('/pages/mine/login')
		},
		toSignIn(){
			this.$u.route('/pages/mine/signIn')
		},
    linkKefu(){
      
      // #ifdef APP-PLUS
      plus.runtime.openURL("https://smssywlkjyxgs.qiyukf.com/client?k=70c6afdde2a6b98b28b1643a33b19c43&wp=1&shuntId=0");
      // #endif
      
      // window.open(,"_target");
      // this.$u.route({
      //   url: '/pages/browser/browser',
      //   params: {
      //     url: 'https://smssywlkjyxgs.qiyukf.com/client?k=70c6afdde2a6b98b28b1643a33b19c43&wp=1&shuntId=0'
      //   }
      // })
    }
  },
  
  onShow() {
    this.getSignDays();
  }
};
</script>
<style lang="scss" scoped>
	.main{
		padding: 30rpx;
		margin-top: var(--status-bar-height);
		.head{
			border-radius: 5rpx;
			background: #292939;
			padding: 30rpx 30rpx 0 30rpx;
			.info{
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				// border-bottom: 1px solid #ddd;
				.user_name{
					font-size: 28rpx;
					font-weight: bold;
				}
				.user_level{
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #C2CAFF;
					.sign_in_btn{
						display: inline-block;
						background-color: #FF9100;
						padding: 5rpx 10rpx;
						font-size: 24rpx;
						border-radius: 10rpx;
						color: #fff;
						margin-left: 10rpx;
					}
          .sign_in_btn_gray{
            background-color: #A0A0A0;
          }
				}
				.toLogin{
					padding: 20rpx 0;
					font-size: 32rpx;
				}
			}
		}
		.nav_list{
			display: flex;
			background-color: #292939;
			padding: 20rpx 0;
			.nav_item{
				width: 25%;
				text-align: center;
				.nav_icon{
					margin: 0 auto;
				}
				.item_text{
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}
		.lists{
			border-radius: 5rpx;
			background: #292939;
			margin-top: 40rpx;
			padding: 15rpx 20rpx;
			font-size: 30rpx;
			& .list:last-child{
				border-bottom: 0 !important;
			}
			.list{
				padding: 20rpx 0;
				border-bottom: 1px solid #313141;
				font-size: 24rpx;
			}
		}
	}
</style>
<template>
	<view class="wrap">
		<view class="bg"></view>
		<view class="box">
			<view class="tit">连续签到{{config.days}}天,可获得<text>{{config.diamond}}</text>钻石奖励</view>
			<view class="item_wrap">
				<view class="item" v-for="(item, idx) in config.days" :key="idx" :class="idx+1<=signinDays?'current':''">
					<image class="gold_icon" src="/static/images/diamond.png" mode="widthFix" />
					<view class="days">{{idx+1}}天</view>
				</view>
			</view>
			<button class="btn" :class="todayIsSign==1?'gray':''" @click="toSignIn">{{todayIsSign == 1?'已签到':'立即签到'}}</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			signinDays: 0,	//连续签到天数
      todayIsSign: 0, //今天是否签到过
      config: {
        days: 5,
        diamond: 0
      },
		};
	},
	methods: {
		toSignIn(){
      if(this.todayIsSign) {
        return;
      }
			this.$u.api.userSignin_sign({}).then(res=>{
        if(res.code == 0) {
          this.$util.submitModal('提示', '签到成功');
          this.getSignDays();
        }
			})
		},
    getSignDays(){
      this.$u.api.userSignin_usersign({}).then(res=>{
        if(res.code == 0){
      		this.signinDays = res.days;
          this.todayIsSign = res.todayIsSign;
      	}
      })
    },
    getSignConfig(){
      this.$u.api.userSignin_config({}).then(res=>{
        if(res.code == 0){
          this.config = res.data;
      	}
      })
    }
	},
	onLoad() {
    this.getSignConfig();
		this.getSignDays();
	}
};
</script>

<style lang="scss" scoped>

.wrap {
	.bg{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background: url(../../static/images/sign-in-bg.jpg) center bottom no-repeat;
		background-size: cover;
		z-index: -1;
	}
	.box{
		background: #003AC1;
		position: fixed;
		left: 40rpx;
		right: 40rpx;
		top: 160rpx;
		border-radius: 20rpx;
		padding: 40rpx;
		box-sizing: border-box;
		.tit{
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #465FFF;
			letter-spacing: 10rpx;
			text{
				color: #FF8B48;
				font-weight: bold;
				padding: 0 10rpx;
			}
		}
		.item_wrap{
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			background-color: #3272C5;
			padding: 30rpx 30rpx;
			border-radius: 10rpx;
			.item{
				background-color: #17349E;
				border-radius: 10rpx;
				width: 80rpx;
				padding: 20rpx 0;
				text-align: center;
				&.current{
					background-color: #FFBC48;
					color: #1E1E2A;
					font-weight: bold;
				}
				.gold_icon{
					width: 40rpx;
					height: 40rpx;
					margin: 0 auto;
				}
				.days{
					margin-top: 20rpx;
					font-size: 28rpx;
				}
			}
		}
		.btn{
			background: linear-gradient(180deg,#00cbff, #465fff);
			height: 80rpx;
			line-height: 80rpx;
			color: #fff;
			width: 400rpx;
			font-size: 28rpx;
			border-radius: 50rpx;
			margin-top: 50rpx;
		}
    .gray{
      background: linear-gradient(180deg,#A0A0A0, #A0A0A0);
    }
	}
}
</style>

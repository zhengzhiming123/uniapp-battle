<template>
	<view class="wrap">
		<view class="top">
      <view class="item">
      	<view class="left">领奖金额</view>
      	<view class="ipt-wrap">
      		<input v-model="amount" type="text" disabled="disabled" placeholder-class="line" placeholder="" />
      	</view>
      </view>
			<view class="item">
				<view class="left">银行卡号</view>
				<view class="ipt-wrap">
					<input v-model="account" type="text" placeholder-class="line" placeholder="请填写银行卡号" />
				</view>
			</view>
			<view class="item">
				<view class="left">户名</view>
				<view class="ipt-wrap">
					<input v-model="realName" type="text" placeholder-class="line" placeholder="请填写户名" />
				</view>
			</view>
      <view class="item">
      	<view class="left">身份证号</view>
      	<view class="ipt-wrap">
      		<input v-model="idCard" type="text" placeholder-class="line" placeholder="请填写身份证号" />
      	</view>
      </view>
		</view>
    <view class="desc">说明：不建议使用农行、农商行。禁止使用二类卡、三类卡</view>
		<u-button type="primary" class="submit" @click="submit">提交申请</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
      amount: 0,
			account: "",
			realName: "",
      idCard:""
		};
	},
  onLoad(data) {
    this.amount = data.money;
  },
  onShow(){
    this.$u.api.user_profile({}).then(({data})=>{
    	this.$u.vuex("vuex_user",data);
      if(!this.idCard) {
        this.idCard = data.idCard;
      }
      if(!data.isAuth) {
        this.gotoAuth();
      }
    })
  },
	methods: {
    gotoAuth() {
      var that = this;
      this.$util.showModal('提示', '您还未实名，请先进行实名认证', function(){
        that.$u.route({
        	url:"/pages/mine/realAuth",
        })
      })
    },
		verify(){
			if(this.amount <= 0){
				this.$util.showToast("请选择正确的领奖金额")
				return false;
			}else if(this.account == ""){
				this.$util.showToast("请输入账号")
				return false;
			}else if(this.realName == ""){
				this.$util.showToast("请输入户名")
				return false;
			}else if(this.idCard === ""){
				this.$util.showToast("请输入身份证号")
				return false;
			}
			return true;
		},
		submit(){
      if(!this.vuex_user.isAuth){
        this.gotoAuth();
        return;
      }
			if(!this.verify()){
				return;
			}
      this.$u.api.user_userWithDraw_apply({
        type: 2,
        amount: this.amount,
        account: this.account,
        realName: this.realName,
        idCard: this.idCard
      }).then(({data})=>{
        this.$util.showToastSuc("申请成功",()=>{
        	this.$u.route({
        		type: "navigateBack",
        	})
        })
      })
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	.top {
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 28rpx;
			line-height: 100rpx;
			align-items: center;
			.left {
				width: 150rpx;
			}
			.ipt-wrap{
				flex: 1;
			}
			input {
				width: 100%;
				height: 80rpx;
				text-align: left;
				background-color: #36364B;
				padding-left: 20rpx;
				border-radius: 5rpx;
				box-sizing: border-box;
			}
    }
	}
  .desc{
    padding: 20rpx;
    position: relative;
    color: #9593a1;
    margin-top: 20rpx;
  }
	.bottom {
		padding: 40rpx 20rpx;
		background-color: $theme-bg;
		font-size: 28rpx;
		.default {
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
	.submit{
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		margin: 0 40rpx;
	}
}
</style>

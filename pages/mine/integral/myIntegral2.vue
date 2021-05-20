<template>
	<view class="main">
    <view class="detail" @click="toDetail">兑物券明细</view>
		<view class="head">
			<image class="integral_icon" src="/static/images/integral.png" mode="widthFix" />
			<view class="tips">兑物券</view>
			<view class="num">{{vuex_user.integral}}</view>
		</view>
		<view class="btn-wrap">
			<!-- <u-button @click="gotoWithDraw" type="primary" class="btn">领奖中心</u-button> -->
      <u-button @click="showSend" type="primary" class="btn">赠送</u-button>
		</view>
    
    <u-modal v-model="showSendModal" title="赠送兑物券" 
      @cancel="showSendModal=false" @confirm="confirm" 
      :show-confirm-button="true" 
      :show-cancel-button="true" 
      width="90%" negative-top="100">
    	<u-form style="padding: 10px 20rpx;" label-width="200">
    		<u-form-item label="赠送人手机号" prop="mobile">
    			<u-input type="number" v-model="sendForm.mobile" />
    		</u-form-item>
    		<u-form-item label="赠送数量" prop="num" class="num">
    			<u-input type="number" v-model="sendForm.num" />
    		</u-form-item>
        <u-form-item label="登录密码" prop="password" class="num">
        	<u-input type="password" v-model="sendForm.password" />
        </u-form-item>
    	</u-form>
    </u-modal>
    
	</view>
</template>


<script>
	export default {
		name: "myDiamond",
		data() {
			return {
        sendForm: {
          mobile: "",
          num: "",
          password: ""
        },
        showSendModal: false
			};
		},
		methods: {
      loadData() {
        this.$u.api.user_profile({}).then(({data})=>{
        	this.$u.vuex("vuex_user",data);
        })
      },
      
      toDetail(){
        this.$u.route({
        	url:"/pages/mine/integral/myIntegralDetail",
        })
      },
      gotoWithDraw() {
        // this.$util.showToast('暂未开通，敬请期待！');
        // return;
        this.$u.route({
        	url:"/pages/mine/integral/myIntegralWithdraw",
        })
      },
      showSend() {
        this.showSendModal = true;
      },
      confirm() {
        this.showSendModal = true;
        if(!this.$u.test.mobile(this.sendForm.mobile)){
        	this.$util.showToast("请输入正确的手机号码");
        	return false;
        }else if(this.sendForm.num<=0){
        	this.$util.showToast("请输入大于零的数");
        	return false;
        }else if(this.sendForm.num > this.vuex_user.integral){
        	this.$util.showToast("兑物券不足");
        	return false;
        }
        this.$u.api.userIntegralBill_send({
        	"mobile": this.sendForm.mobile,
        	"num": this.sendForm.num,
        	"password": this.sendForm.password
        }).then(res=>{
        	if(res.code===0){
        		this.loadData();
        		this.showSendModal = false;
        		this.$util.showToastSuc("赠送成功")
        	}
        })
      },
      
      
		},
		onLoad() {
			
		},
		onShow(){
			this.loadData();
		},
	};
</script>
<style scoped lang="scss">
	.main {
		padding: 20rpx;
		position: relative;
    .detail{
    	position: absolute;
    	right: 20rpx;
    	top: 20rpx;
    }
		.head{
			margin-top: 100rpx;
			text-align: center;
			position: relative;
			.integral_icon{
				width: 200rpx;
				height: 200rpx;
			}
			.tips{
				margin-top: 30rpx;
				font-size: 38rpx;
			}
			.num{
				margin-top: 30rpx;
				font-size: 50rpx;
			}
		}
		.lists{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: 80rpx;
			.list{
				width: 30%;
				background-color: #36364B;
				padding: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				background-color: #2b2a3a;
				text-align: center;
				.name{
					font-size: 28rpx;
					color: #fff;
					.diamond_icon{
						width: 40rpx;
						height: 40rpx;
						vertical-align: middle;
					}
					text{
						font-size: 40rpx;
						margin-left: 20rpx;
					}
				}
				.price{
					color: #a4a2b8;
					font-size: 30rpx;
					margin-top: 20rpx;
				}
				&.select{
					background-color: #8e4bfd;
					.price{
						color: #fff;
					}
				}
			}
		}
		.btn-wrap{
			position: fixed;
			bottom: 30rpx;
			left: 20rpx;
			right: 20rpx;
			text-align: center;
			color: #9593a1;
			.btn{
				margin-top: 20rpx;
			}
		}
    
    .mask-warp{
    	height: 100%;
    	width: 100%;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	flex-direction: column;
    	.wrap{
    		padding: 40rpx;
    		border-radius: 10rpx;
    		background: #fff;
    		.mask-txt{
    			margin-bottom: 30rpx;
    			color: #333;
    			width: 100%;
    			display: flex;
    			justify-content: space-between;
    			view{
    				line-height: 30rpx;
    				font-size: 30rpx;
    				color: #666;
    				.icon{
    					font-size: 35rpx;
    					margin-right: 10rpx;
    					color: #06B4FD;
    				}
    			}
    		}
    	}
    }
	}
</style>

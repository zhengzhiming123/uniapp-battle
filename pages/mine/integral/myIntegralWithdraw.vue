<template>
	<view class="main">
		<view class="head">
			<view class="detail" @click="toDetail">领奖记录</view>
			<image class="integral_icon" src="/static/images/integral.png" mode="widthFix" />
			<view class="tips">剩余兑物券</view>
			<view class="num">{{vuex_user.integral}}</view>
		</view>
    <view class="lists-title">选择领奖金额</view>
		<view class="lists">
			<template v-if="list.length">
				<view class="list" :class="[selectIndex==index?'select':'']" v-for="(item,index) in list" :key="item.id" @click="selectDiamond(index)">
					<view class="price">{{item.price}}元</view>
				</view>
			</template>
		</view>
    <view class="desc">选择领奖说明：</view>
    <view class="desc">奖金累计达到{{config.minMoney}}元后可申请普通领奖，每次领奖收取{{config.rate}}%作为手续费，审核时间为24小时，每日可申请领奖一次。不建议使用农行、农商行。禁止使用二类卡、三类卡</view>
		<view class="btn-wrap">
			<u-button @click="gotoConfirm" type="primary" class="btn">申请领奖</u-button>
		</view>
	</view>
</template>


<script>
	export default {
		name: "myIntegralWithdraw",
		data() {
			return {
				list: [{'price': 20}, {'price': 30}, {'price': 50}, {'price': 100}, {'price': 200}, {'price': 500}],
        selectIndex: 0,
        config: {}
			};
		},
		methods: {
      selectDiamond(index) {
        this.selectIndex = index
      },
			loadConfig(){
				this.$u.api.config_withdraw({}).then(res=>{
          this.config = res.data;
        });
			},
      toDetail(){
        this.$u.route({
        	url:"/pages/mine/integral/myIntegralWithdrawList",
        })
      },
      gotoConfirm() {
        var money = this.list[this.selectIndex].price;
        this.$u.route({
        	url:"/pages/mine/integral/myIntegralWithdrawApply",
          params: { 
            money: money
          }
        })
      },
		},
		onLoad() {
			this.loadConfig();
		},
		onShow(){
			this.$u.api.user_profile({}).then(({data})=>{
				this.$u.vuex("vuex_user",data);
			})
		},
	};
</script>
<style scoped lang="scss">
	.main {
		padding: 20rpx;
		position: relative;
		.head{
			margin-top: 20rpx;
			text-align: center;
			position: relative;
      border: 1 1 ;
			.detail{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
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
    .lists-title{
      margin-top: 20rpx;
      font-size: 29rpx;
    }
		.lists{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin-top: 20rpx;
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
					margin-top: 10rpx;
				}
				&.select{
					background-color: #8e4bfd;
					.price{
						color: #fff;
					}
				}
			}
		}
    .desc{
      color: #9593a1;
      margin-top: 20rpx;
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

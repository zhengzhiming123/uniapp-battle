<template>
	<view class="main">
		<view class="lists">
			<template v-if="list.length">
				<u-row class="list" v-for="item in list" :key="item.id">
					<u-col :span="9">
						<view class="name">{{item.note}}</view>
						<view class="time">{{item.createTime}}</view>
					</u-col>
					<u-col :span="3" text-align="right" class="integral" :class="item.type===0?'plus':'minus'">
						<u-icon :name="item.type===0?'plus':'minus'" style="font-size: 26rpx;"></u-icon>{{item.integral}}
					</u-col>
				</u-row>
			</template>
			<template v-else>
				<u-empty text="暂无兑物券明细" mode="history" margin-top="350"></u-empty>
			</template>
		</view>
	</view>
</template>


<script>
	export default {
		name: "myIntegralDetail",
		data() {
			return {
				limit: 10,
				page: 1,
				list: [],
        
        showSendModal: false,
        sendForm: {
        	mobile: '',
        	num: '',
        },
			};
		},
		methods: {
			async loadData(){
				const {page} = await this.$u.api.userIntegralBill_list({
					"limit": this.limit,
					"page": this.page
				})
				this.list = [...this.list,...page.list];
			},
			toShop(){
				this.$u.route({
					url:"/pages/shop/index",
					type: "switchTab"
				})
			},
      toSend(){
        this.showSendModal = true;
      },
      confirm(){
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
      		"num": this.sendForm.num
      	}).then(res=>{
      		if(res.code===0){
      			this.loadData();
      			this.showSendModal = false;
      			this.$util.showToastSuc("赠送成功")
      		}
      	})
      }
		},
		onLoad() {
			this.loadData();
		},
		onShow(){
			this.$u.api.user_profile({}).then(({data})=>{
				this.$u.vuex("vuex_user",data);
			})
		},
		onPullDownRefresh(){
			this.page = 1;
			this.list = [];
			this.loadData().then(()=>{
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom(){
			this.page++;
			this.loadData();
		}
	};
</script>
<style scoped lang="scss">
	.main {
		padding: 20rpx;
		position: relative;
		.head{
			position: absolute;
			width: calc(100% - 40rpx);
			top: 0;
			left: 0;
			background: #36364B;
			padding: 25rpx;
			margin: 20rpx 20rpx 0 20rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: space-between;
			.num_wrap{
				line-height: 50rpx;
			}
			.gold_icon{
				width: 40rpx;
				height: 40rpx;
				vertical-align: middle;
				display: inline-block;
				margin-right: 10rpx;
			}
			.exchange{
				width: 100rpx;
				background: #465FFF;
				font-size: 24rpx;
				text-align: center;
				border-radius: 10rpx;
				padding: 8rpx 0;
			}
			.num{
				font-size: 28rpx;
			}
		}
		.lists{
			.list{
				background-color: #36364B;
				padding: 15rpx;
				border-bottom: 1rpx solid #444;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				.name{
					font-size: 28rpx;
					color: #fff;
				}
				.time{
					font-size: 26rpx;
					margin-top: 5rpx;
					color: #999;
				}
				.integral{
					line-height: 28rpx;
					font-weight: bold;
					&.plus{
						color: #fff;
					}
					&.minus{
						color: #FF4646;
					}
				}
			}
		}
	}
</style>

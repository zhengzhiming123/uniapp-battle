<template>
	<view class="main">
		<view class="img_wrap">
			<u-image
			width="100%" 
			height="700rpx" 
			border-radius="2"
			:src="info.goodsImg" 
			/>
			
		</view>
		<view class="item_info">
			<view class="name">{{info.name}}</view>
            <view class="stock">库存：{{info.stock}}</view>
			<view class="integral-wrap">
				<image class="gold_icon" src="/static/images/gold.png" mode="widthFix" />
				<text class="integral">{{info.consumeScore}}</text>
			</view>
		</view>
		<view class="text">
			{{info.description}}
		</view>
		<view class="address"  @click="toSite">
			<u-row v-if="addressInfo" class="info">
				<u-col :span="11">
					<view>{{addressInfo.province}}-{{addressInfo.city}}-{{addressInfo.district}}{{addressInfo.address}}</view>
					<view>{{addressInfo.userName}} {{addressInfo.userMobile}}</view>
				</u-col>
				<u-col :span="1">
					<u-icon name="arrow-right" />
				</u-col>
			</u-row>
			<view v-else class="place">
				<image class="place_icon" src="/static/images/place.png" mode="widthFix" />
				选择收获地址
			</view>
		</view>
		
		<u-popup v-model="isShow" mode="bottom" height="650rpx" :closeable="true">
			<view class="popup-cent">
				<view class="title">兑换商品</view>
				<view class="number-box">
					<view>兑换数量：<u-number-box v-model="number"></u-number-box></view>
				</view>
				<view class="desc">
					<view>备注:</view>
					<u-input v-model="note" type="textarea" border height="150"  />
				</view>
				<view class="integral">{{number * info.consumeScore}}积分</view>
				<u-button class="buy" type="warning" @click="buy()">确认</u-button>
			</view>
		</u-popup>
		
		<u-button class="btn" type="primary" @click="showSubmit">兑换</u-button>
	</view>
</template>

<script>
	export default {
		name: "shoppDetail",
		data() {
			return {
        goodsId: '',
        info: {
          consumeScore: 0,
          createTime: "",
          description: "",
          goodsImg: "",
          id: '',
          limitNumber: 0,
          name: "",
          stock: 0
        },
        
				isShow: false,
				number: 1,
				note: "",
				addressInfo: null,
			};
		},
		onLoad({id}) {
		  this.goodsId = id;
		  this.$u.api.goods_goodsinfo({
		  	goodsId: this.goodsId
		  }).then(({info}) => {
		    this.info = info;
		  });
			// 选择地址
			uni.$on('selectSite',({name,phone,province,city,district,address})=>{
				this.addressInfo = {
					userName: name,
					userMobile: phone,
					province,city,district,address
				}
			})
		},
		onUnload(){
			uni.$off('selectSite');
		},
		methods:{
      showSubmit() {
        if(!this.$util.isLogin(this)) {
          this.$util.submitModal('提示', '您还未登录，请先登录', () => {
            this.$u.route('/pages/mine/login');
          })
          return ;
        }
        this.isShow = true
      },
      buy() {
        if (this.number <= 0) {
          this.$util.showToast('请填写兑换数量')
          return;
        }
        if (!this.addressInfo) {
          this.$util.showToast('请选择收货地址')
          return;
        }
        this.$u.api.goods_buy({
        	goodsId: this.goodsId,
          note: this.note,
          "num": this.number,
          ...this.addressInfo,
        }).then(() => {
          this.isShow = false
          this.$util.submitModal("提示", "兑换成功");
        });
      },
			toSite(){
				this.$u.route({
					url: '/pages/mine/address/site',
					params:{
						isSelect: true
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding: 0 20rpx;
		position: relative;
		padding-bottom: 110rpx;
		.img_wrap{
			position: relative;
			.stock{
				position: absolute;
				top: 20rpx;
				left: 20rpx;
				font-size: 24rpx;
			}
		}
		.item_info{
			background: #2C2C46;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			.name{
				font-size: 28rpx;
				font-weight: bold;
			}
			.integral-wrap{
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				.gold_icon{
					width: 36rpx;
					height: 36rpx;
					vertical-align: middle;
				}
				.integral{
					color: #fff;
				}
			}
		}
		.text{
			font-size: 28rpx;
			margin-top: 20rpx;
		}
		.address{
			padding: 20rpx 15rpx;
			margin: 20rpx 0;
			border-radius: 6rpx;
			font-size: 26rpx;
			border: 1px dashed #36364b;
			.place{
				text-align: center;
				font-size: 24rpx;
				border: 1px dashed #36364b;
				padding: 15rpx 0;
				.place_icon{
					width: 32rpx;
					height: 32rpx;
					vertical-align: middle;
					margin-right: 10rpx;
				}
			}
		}
		.btn{
			position: fixed;
			width: calc(100% - 40rpx);
			left: 20rpx;
			bottom: 40rpx;
		}
	}

	.popup-cent{
		color: #333;
		.title{
			line-height: 85rpx;
			font-size: 30rpx;
			padding: 0 20rpx;
			border-bottom: 1px solid #ddd;
		}
		.number-box{
			padding: 30rpx 20rpx;
		}
		.desc{
			padding: 0 20rpx;
			view{
				margin-bottom: 10rpx;
			}
		}
		.integral{
			color: $theme-color-light;
			text-align: center;
			font-size: 50rpx;
			margin: 30rpx 0;
		}
		.buy{
			margin: 0 20rpx;
		}
	}
</style>

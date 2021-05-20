<template>
	<view class="main">
		<view class="head">
			<view class="detail" @click="toDetail">钻石明细</view>
			<image class="diamond_icon" src="/static/images/diamond.png" mode="widthFix" />
			<view class="tips">剩余钻石</view>
			<view class="num">{{vuex_user.diamond}}</view>
			<!-- <view class="num_wrap">
				<image class="gold_icon" src="/static/images/diamond.png" mode="widthFix" />
				<text class="num">{{vuex_user.diamond}}</text>
			</view> -->
		</view>
		<view class="lists">
			<template v-if="list.length">
				<view class="list" :class="[selectIndex==index?'select':'']" v-for="(item,index) in list" :key="item.id" @click="selectDiamond(index)">
					<view class="name">
						<image class="diamond_icon" src="/static/images/diamond.png" mode="widthFix" />
						<text>{{item.diamond}}</text>
					</view>
					<view class="price">{{item.price}}元</view>
				</view>
			</template>
		</view>
		<view class="btn-wrap">
			<view>钻石用于购买门票，购买后不支持退款</view>
			<u-button @click="buy" type="primary" class="btn">确认购买</u-button>
		</view>
    
    <u-action-sheet title="请选择支付方式" :list="payActions" v-model="showPayModal" @click="handleClickPayAction"></u-action-sheet>

	</view>
</template>


<script>
	export default {
		name: "myDiamond",
		data() {
			return {
				list: [],
        selectIndex: 0,
        
        qrShow: false, //二维码显示
        qrcode:"",
        showPayQrCode: false,
        orderNo: '',
        
        timer: '',
        
        showPayModal: false,
        payActions: [{
            text: '支付宝支付',
            color: '#2d8cf0',
            value: this.$partten.PayTypeAlipayWeb
          },{
            text: '微信支付',
            color: '#19be6b',
            value: this.$partten.PayTypeWechatMa
          }
        ],
			};
		},
		methods: {
			loadData(){
				this.$u.api.diamond_list({}).then(res=>{
          this.list = res.list;
        });
			},
      toDetail(){
        this.$u.route({
        	url:"/pages/mine/myDiamondDetail",
        })
      },
      selectDiamond(index) {
        this.selectIndex = index
      },
      //购买砖石
      buy() {
        this.$u.api.diamond_buy({
          diamondId: this.list[this.selectIndex].id
        }).then(({orderNo})=>{
          this.orderNo = orderNo;
          this.showPayModal = true;
        });
      },
      handleClickPayAction(i) {
        var payType = this.payActions[i].value;
        if(payType == this.$partten.PayTypeAlipayWeb) {
          //支付宝支付
          this.toPay(this.orderNo, this.payActions[i].value);
        } else if(payType == this.$partten.PayTypeWechatMa) {
          //微信H5跳小程序支付
          this.toWxGeneralSchema(this.orderNo, this.payActions[i].value);
        }
      },
      toPay(orderNo, payType) {
        this.qrcode = '';
        this.orderNo = orderNo;
        var that = this;
        this.$u.api.pay_pay({
          orderNo,
          "payType": payType
        }).then(res=>{
          this.isShow = false;
          if(res.data.status == 'succeeded') {
            if(payType == this.$partten.PayTypeAlipayScan) {
              //支付宝扫码支付
              const url = res.data.expend.qrcode_url;
              this.qrcode = QR.createQrCodeImg(url, {
              	size: parseInt(350),
              })
              this.showQrCode = true;
              if(this.timer) {
                  clearTimeout(this.timer);
              }
              this.timer = setInterval(function() {
                that.queryPayStatus(orderNo);
              }, 3000);
            } else if(payType == this.$partten.PayTypeAlipayWeb) {
              uni.showModal({
                title: '提示',
                content: '是否支付成功',
                confirmText: '支付成功',
                cancelText: '支付失败',
                success: function (res) {
                  if (res.confirm) {
                     that.paySuccess();
                  }
                }
              });
              //支付宝网页支付
              const url = res.data.expend.pay_info;
              // #ifdef APP-PLUS
              plus.runtime.openURL(url);
              // #endif
              // #ifdef H5
              window.open(url);
              // #endif
            }
          } else {
            this.$util.submitModal('提示', '请求支付失败：' + res.data.error_msg);
          }
        })
      },
      // 微信H5跳小程序支付
      toWxGeneralSchema(orderNo, payType) {
        var that = this;
        this.$u.api.wx_generalSchema({
          orderNo,
          payType
        }).then(res=>{
          uni.showModal({
            title: '提示',
            content: '是否支付成功',
            confirmText: '支付成功',
            cancelText: '支付失败',
            success: function (res) {
              if (res.confirm) {
                 that.paySuccess();
              }
            }
          });
          const url = res.url;
          // #ifdef APP-PLUS
          plus.runtime.openURL(url);
          // #endif
          // #ifdef H5
          window.open(url);
          // #endif
        });
      },
      
      queryPayStatus(orderNo) {
        this.$u.api.pay_querystatus({
          orderNo
        }).then(res=>{
          if(res.status == 2) {
            this.showQrCode = false;
            clearTimeout(this.timer);
            this.$util.submitModal('提示', '支付成功');
          }
        })
      },
      paySuccess() {
        this.$u.api.pay_querystatus({
          orderNo: this.orderNo
        }).then(res=>{
          if(res.status == 2) {
            this.$u.api.user_profile({}).then(({data})=>{
            	this.$u.vuex("vuex_user",data);
            })
            
            this.showQrCode = false;
            this.$util.submitModal('提示', '支付成功');
          } else {
            this.showQrCode = false;
            this.$util.submitModal('提示', '未查询到支付信息，请核查');
          }
        })
      },
      closeQr() {
        this.qrShow = false;
        clearTimeout(this.timer);
      },
		},
		onLoad() {
			this.loadData();
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
			.detail{
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}
			.diamond_icon{
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

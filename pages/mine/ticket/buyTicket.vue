<template>
	<view class="main">
    <view class="title" >
    	<view class="img">
    		<image src="/static/images/diamond.png" />
    		<view @click="$u.route('/pages/mine/myDiamondDetail')">{{vuex_user?vuex_user.diamond:0}}</view>
    	</view>
    </view>
		<u-row :gutter="30">
			<u-col :span="6" v-for="(item,index) in list" :key="index" @click="toBuy(item)">
				<view class="list">
					<view class="img_wrap">
						<u-image width="100%" height="180rpx" border-radius="2" :src="item.ticketPic" />
						<p class="name">{{item.gameName}}-{{item.name}}</p>
					</view>
					<view class="list_btm">
						<p class="integral"><image class="gold_icon" src="/static/images/diamond.png" mode="widthFix" />{{item.ticketPrice}}</p>
						<view>
							<button class="btn" @click="toBuy(item)">兑换</button>
						</view>
					</view>
				</view>
			</u-col>
		</u-row>
		
		<u-popup v-model="isShow" mode="bottom" height="500rpx" :closeable="true">
			<view class="popup-cent">
				<view class="popup-title">{{cur.gameName}}-{{cur.name}}门票</view>
				<view class="number-box">
					<view>兑换数量：<u-number-box :min="1" v-model="number"></u-number-box></view>
				</view>
				<view class="tag-wrap">
					<u-tag v-for="(item,index) in numList" :key="index" :text="item+'张'" type="info" mode="dark" @click="number=item" />
				</view>
				<view class="integral"><image class="gold_icon" src="/static/images/diamond.png" mode="widthFix" />{{cur.ticketPrice * number}}</view>
        <u-button v-if="cur.ticketPrice * number > vuex_user.diamond" class="buy" type="warning" @click="toBuyDiamond">购买钻石</u-button>
				<u-button v-else class="buy" type="warning" @click="buy">立即兑换</u-button>
			</view>
		</u-popup>

		<u-mask :show="qrShow">
			<view class="mask-warp">
				<view class="wrap" id="canvas-wrap">
					<view class="mask-txt">
						<view><u-icon class="icon" name="zhifubao-circle-fill" />请用支付宝扫码支付</view>
						<u-icon name="close"  @click="closeQr"/>
					</view>
					<view>
						<u-image width="450" height="450" :src="qrcode" />
					</view>
          <!-- #ifdef APP-PLUS -->
          <view class="save" @click="my_js.createPoster">保存到手机</view>
          <!-- #endif -->
				</view>
			</view>
		</u-mask>
        
	</view>
</template>


<script>
import QR from "@/static/lib/wxqrcode.js"
export default {
	name: "buyTicket",
  data() {
    return {
			list: [],
			cur: {},	//当前选择
			isShow: false,
			number: 1,
			numList: [5,10,15,20],
            
			qrShow: false, //二维码显示
			qrcode:"",
			
			timer: '',
    };
  },
  methods: {
		toBuy(item){
      if(!this.$util.isLogin(this)) {
        this.$util.submitModal('提示', '您还未登录，请先登录', () => {
          this.$u.route('/pages/mine/login');
        })
        return;
      }
			this.cur = item;
			this.isShow = true;
		},
    toBuyDiamond() {
      this.$u.route('/pages/mine/myDiamond');
    },
		buy(){
      let that = this;
			this.$u.api.userTicket_buy({
				"competitionId": this.cur.id,
				"num": this.number
			}).then((res)=>{
        this.isShow = false;
        if(res.code == 0){
          this.$util.submitModal('提示', '兑换成功');
          this.$u.api.user_profile({}).then(({data})=>{
          	this.$u.vuex("vuex_user",data);
          })
        } else {
          this.$util.submitModal('提示', res.msg);
        }
				//this.toPay(orderNo);
			})
		},
    
    toPay(orderNo) {
      this.qrcode = '';
      var that = this;
      var payType = this.$partten.PayTypeAlipayWeb;
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
            this.qrShow = true;
            if(this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setInterval(function() {
              that.queryPayStatus(orderNo);
            }, 3000);
          } else if(payType == this.$partten.PayTypeAlipayWeb) {
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
    queryPayStatus(orderNo) {
      this.$u.api.pay_querystatus({
        orderNo
      }).then(res=>{
          if(res.status == 2) {
              this.qrShow = false;
              clearTimeout(this.timer);
              this.$util.submitModal('提示', '支付成功');
          }
      })
    },
    closeQr() {
       this.qrShow = false;
       clearTimeout(this.timer);
    },
    creates(option) {
    	uni.showLoading({title: '加载中'});
    	this.saveHeadImgFile(option.posterImg).then(()=>{
    		this.$util.showToastSuc('图片保存成功');
    	}).catch(e=>{
    		this.$util.showToast('图片保存失败');
    	}).finally(uni.hideLoading)
    },
    saveHeadImgFile(base64) {
    	return new Promise(function(resolve, reject){
    		const bitmap = new plus.nativeObj.Bitmap("test");
    		bitmap.loadBase64Data(base64, ()=>{
    			const url = "_doc/" + new Date().getTime() + ".png"; // url为时间戳命名方式
    			bitmap.save(url, {
    				overwrite: true, // 是否覆盖
    				quality: 100  // 图片清晰度 0-100
    			}, (i) => {
    				uni.saveImageToPhotosAlbum({
    					filePath: url,
    					success: ()=>{
    						bitmap.clear();
    						resolve();
    					}
    				});
    			}, (e) => {
    				bitmap.clear();
    				reject(e);
    			});
    		}, (e) => {
    			bitmap.clear();
    			reject(e);
    		});
    	})
    },
		
		getCompetitions(gameId, gameName){
			this.$u.api.competition_competitions({gameId: gameId}).then(({list}) => {
				
			  list && list.forEach(item=>{
					const {id,name,pic,ticketPic,ticketPrice,gameId} = item;
					this.list.push({
              id,name,pic,ticketPic,ticketPrice,gameId,
              gameName: gameName
            })
				})
				console.log(this.list)
			})
		},
    
    onLoad() {
			this.$u.api.competition_games({}).then(({list})=>{
				console.log(list)
			  const arr = [];
			  list.forEach(item=>{
			    this.getCompetitions(item.id, item.name);
			  })
			  this.list = arr;
			})
    },
    onShow() {
      this.$u.api.user_profile({}).then(({data})=>{
      	this.$u.vuex("vuex_user",data);
      })
    },
    onClose() {
      clearTimeout(this.timer);
    }
	}
};
</script>

<script module="my_js" lang="renderjs">
	import html2canvas from "@/static/lib/html2canvas.min.js";
	export default {
		methods: {
			createPoster(event, ownerInstance) {
				// 生成海报  
				const domObj = document.getElementById("canvas-wrap");
				html2canvas(domObj, {
					useCORS: true,
					logging: false,
					letterRendering: true,
					allowTaint: true,
					onclone(doc) {
					},
				}).then(function(canvas) {
					var posterImg = canvas.toDataURL("image/png", 0.7);
					ownerInstance.callMethod('creates', {
						posterImg: posterImg
					})
				}).catch(e => {
					console.log(e);
				})
			},
		},
	}
</script>
<style scoped lang="scss">
	.main{
    .title{
    	display: flex;
    	align-items: center;
    	justify-content: space-between;
    	margin: 15rpx 15rpx 7rpx 15rpx;
    	padding: 15rpx 20rpx;
    	background: #36364B;
    	border-radius: 10rpx;
    	font-size: 28rpx;
    	.img{
    		display: flex;
    		align-items: center;
    		image{
    			width: 36rpx;
    			height: 36rpx;
    			margin-right: 10rpx;
    		}
    	}
    	.record{
    		padding: 10rpx 20rpx;
    		border-radius: 10rpx;
    		display: flex;
    		align-items: center;
    		background: #465FFF;
    		font-size: 26rpx;
    		.icon{
    			font-size: 26rpx;
    			margin-right: 5rpx;
    		}
    	}
    }
		.list{
			margin-top: 20rpx;
			background: #333;
			border-radius: 5rpx;
			.img_wrap{
				position: relative;
				.name{
					position: absolute;
					bottom: 10rpx;
					left: 10rpx;
					font-size: 26rpx;
				}
			}
			.list_btm{
				background-color: #2C2C46;
				display: flex;
				padding: 20rpx;
				justify-content: space-between;
			}
		}
		.integral{
			line-height: 50rpx;
			font-size: 28rpx;
			color: #fff;
			.gold_icon{
				width: 30rpx;
				height: 30rpx;
        margin-right: 10rpx;
				vertical-align: middle;
			}
		}
		.btn{
			display: block;
			width: 100rpx;
			height: 50rpx;
			line-height: 50rpx;
			background-color: #465FFF;
			color: #fff;
			font-size: 24rpx;
			padding: 0;
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
	
	.popup-cent{
		color: #333;
		.popup-title{
			line-height: 85rpx;
			font-size: 30rpx;
			padding: 0 20rpx;
			border-bottom: 1px solid #ddd;
		}
		.number-box{
			padding: 30rpx 20rpx;
		}
		.tag-wrap{
			padding: 0 20rpx;
			margin-top: 20rpx;
			& .u-tag{
				margin-right: 10rpx;
				padding: 15rpx 28rpx
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
      background-color: #465FFF;
		}
	}
  .save {
  	margin-top: 40rpx;
  	width: 100%;
  	background: $theme-color-light;
  	border-radius: 10rpx;
  	line-height: 80rpx;
  	text-align: center;
  	font-size: 30rpx;
  }
</style>
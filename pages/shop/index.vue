<template>
	<view class="main">
		<view class="title" >
			<view class="img">
				<image src="/static/images/gold.png" />
				<view @click="$u.route('/pages/mine/integral/myIntegral2')">{{vuex_user?vuex_user.integral:0}}</view>
			</view>
			<view class="record" @click="$u.route('/pages/shop/shopOrder')">
				商品兑换记录
			</view>
		</view>
    
    
    <view class="categray">门票兑换</view>
    <u-row :gutter="30">
    	<u-col :span="6" v-for="(item,index) in ticketList" :key="index" @click="toBuyTicket(item)">
    		<view class="ticket_list">
    			<view class="img_wrap">
    				<u-image width="100%" height="180rpx" border-radius="2" :src="item.ticketPic" />
    				<p class="name">{{item.gameName}}-{{item.name}}</p>
    			</view>
    			<view class="list_btm">
    				<p class="integral"><image class="gold_icon" src="/static/images/gold.png" mode="widthFix" />{{item.integralPrice}}</p>
    				<view>
    					<button class="btn" @click="toBuyTicket(item)">兑换</button>
    				</view>
    			</view>
    		</view>
    	</u-col>
    </u-row>
    
    <view class="categray">商品兑换</view>
    	<u-row :gutter="30">
    		<u-col :span="6" v-for="(item,index) in goodsList" :key="index" @click="toDetail(item.id)">
    			<view class="list">
    				<div class="list_img_wrap">
    					<u-image
    						width="100%" 
    						height="340" 
    						border-radius="2"
    						:src="item.goodsImg" 
    					/>
    					<!-- <p class="name">{{item.name}}</p> -->
    				</div>
    				<view class="list_bottom">
    					<view class="list_bottom_aside">
    						<image class="gold_icon" src="/static/images/gold.png" mode="widthFix" />
    						<text class="integral">{{item.consumeScore}}</text>
    					</view>
    					<view>
    						<u-button class="btn" type="primary" size="mini" @click="toDetail(item.id)">兑换</u-button>
    					</view>
    				</view>
    			</view>
    		</u-col>
    </u-row>
    
    <u-popup v-model="ticketPopupShow" mode="bottom" height="500rpx" :closeable="true">
    	<view class="popup-cent">
    		<view class="popup-title">{{cur.gameName}}-{{cur.name}}门票</view>
    		<view class="number-box">
    			<view>兑换数量：<u-number-box :min="1" v-model="number"></u-number-box></view>
    		</view>
    		<view class="tag-wrap">
    			<u-tag v-for="(item,index) in numList" :key="index" :text="item+'张'" type="info" mode="dark" @click="number=item" />
    		</view>
    		<view class="integral"><image class="gold_icon" src="/static/images/gold.png" mode="widthFix" />{{cur.integralPrice * number}}</view>
    		<u-button class="buy" type="primary" @click="buyTicket">立即兑换</u-button>
    	</view>
    </u-popup>
	</view>
</template>


<script>
export default {
	name: "shop",
  data() {
    return {
      goodsList: [],
      
      ticketList: [],
      cur: {},	//当前选择
      numList: [5,10,15,20],
      number: 1,
      ticketPopupShow: false
    };
  },
  methods: {
    getGoodsList() {
      this.$u.api.goods_list({}).then(({list})=>{
      	this.goodsList = list;
      })
    },
		toDetail(id){
			this.$u.route({
        url: '/pages/shop/shopDetail',
        params: {id},
      });
		},
    
    /**门票**/
    getTicketList() {
      this.ticketList = [];
      this.$u.api.competition_games({}).then(({list})=>{
        list.forEach(item=>{
          this.getCompetitions(item.id, item.name);
        })
      })
    },
    getCompetitions(gameId, gameName){
    	this.$u.api.competition_competitions({gameId: gameId}).then(({list}) => {
    	  list && list.forEach(item=>{
          const {id,name,pic,ticketPic,ticketPrice,integralPrice,gameId} = item;
    			this.ticketList.push({
    			    id,
              name,
              pic,
              ticketPic,
              ticketPrice,
              integralPrice,
              gameId,
              gameName
    			  })
    		})
    	})
    },
    toBuyTicket(item) {
      if(!this.$util.isLogin(this)) {
        this.$util.submitModal('提示', '您还未登录，请先登录', () => {
          this.$u.route('/pages/mine/login');
        })
        return;
      }
      
      this.cur = item;
      this.ticketPopupShow = true;
    },
    buyTicket() {
      let that = this;
      this.$u.api.userTicket_buyByIntegral({
      	"competitionId": this.cur.id,
      	"num": this.number
      }).then((res)=>{
        this.ticketPopupShow = false;
        if(res.code == 0){
          this.$util.submitModal('提示', '兑换成功');
          this.$u.api.user_profile({}).then(({data})=>{
          	this.$u.vuex("vuex_user",data);
          })
        } else {
          this.$util.submitModal('提示', res.msg);
        }
      })
    }
  },
	onLoad() {
    this.getGoodsList();
    this.getTicketList();
	},
	onShow(){
		if(this.$util.isLogin(this)) {
		  this.$u.api.user_profile({}).then(({data})=>{
		  	this.$u.vuex("vuex_user",data);
		  })
		}
	}
};
</script>
<style scoped lang="scss">
	.main{
		margin-top: var(--status-bar-height);
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
    .categray {
      padding: 20rpx 20rpx;
      font-weight: bold;
      font-size: 34rpx;
    }
		.list{
			margin-top: 20rpx;
			background: #2C2C46;
			border-radius: 5rpx;
			position: relative;
			.list_img_wrap{
				position: relative;
				.name{
					position: absolute;
					bottom: 10rpx;
					left: 10rpx;
					width: 100%;
					font-size: 28rpx;
					color: #fff;
				}
			}
		}
		.list_bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 10rpx;
			.integral{
				font-size: 28rpx;
				color: #fff;
			}
			.btn{
				display: block;
				padding: 0 10rpx;
			}
			.gold_icon{
				width: 36rpx;
				height: 36rpx;
				vertical-align: middle;
			}
		}
    
    .ticket_list{
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
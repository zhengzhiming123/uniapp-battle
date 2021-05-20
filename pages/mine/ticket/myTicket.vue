<template>
	<view class="main">
    <view class="detail" @click="toDetail">历史记录</view>
		<template v-if="list.length">
			<view class="tickets-list" v-for="(item,index) in list" :key="index">
				<view class="name">
					{{item.gameName}}-{{item.competitionName}}
				</view>
				<view class="count">
					<view>{{item.num}}张</view>
				</view>
			</view>
		</template>
		<template v-else>
			<u-empty text="暂无数据" mode="data" margin-top="200"></u-empty>
		</template>
		
		<u-modal 
			v-model="show" 
			title="赠送门票" 
			@cancel="show=false" 
			@confirm="confirm" 
			:show-confirm-button="true" 
			:show-cancel-button="true"
			width="90%"
			negative-top="100"
		>
			<u-form style="padding: 10px 20rpx;" label-width="200">
				<u-form-item label="赠送人手机号" prop="mobile">
					<u-input type="number" v-model="form.mobile" />
				</u-form-item>
				<u-form-item label="赠送数量" prop="num" class="num">
					<u-input type="number" v-model="form.num" />
				</u-form-item>
			</u-form>
		</u-modal>
	</view>
</template>


<script>
export default {
	name: "myTicket",
  data() {
    return {
			list: [],
			show: false,
			curTickey:null,
			form: {
				mobile: '',
				num: 1,
			},
    };
  },
  methods: {
    toDetail() {
      this.$util.showToast('暂未开通，敬请期待！');
      return;
      this.$u.route({
      	url:"/pages/mine/ticket/ticketRecord",
      })
    },
		loadData(){
			this.$u.api.userTicket_userTickets({}).then(({list})=>{
				this.list = list;
			})
		},
		showSend(item){
			this.curTickey = item;
			this.show = true;
		},
		confirm(){
			this.show = true;
			if(!this.$u.test.mobile(this.form.mobile)){
				this.$util.showToast("请输入正确的手机号码");
				return false;
			}else if(this.form.num<=0 || !this.$u.test.digits(this.form.num)){
				this.$util.showToast("请输入大于零的整数");
				return false;
			}else if(parseInt(this.form.num)>this.curTickey.num){
				this.$util.showToast("数量不足");
				return false;
			}
			this.$u.api.userTicket_send({
				"competitionId": this.curTickey.competitionId,
				"mobile": this.form.mobile,
				"num": this.form.num
			}).then(res=>{
				if(res.code===0){
					this.loadData();
					this.show = false;
					this.$util.showToastSuc("赠送成功")
				}
			})
		}
  },
	onLoad() {
		this.loadData();
	},
	onNavigationBarButtonTap(){
		this.$u.route("/pages/mine/ticketRecord");
	},
};
</script>
<style scoped lang="scss">
	.main{
		padding: 30rpx;
    .detail{
    	position: absolute;
    	right: 20rpx;
    	top: 20rpx;
    }
		.tickets-list{
      margin-top: 55rpx;
			height: 150rpx;
			width: 100%;
			background: url(/static/images/ticketsBg.png);
			background-size: 100% 100%;
			margin-bottom: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name{
				background: #e25248;
				padding: 10rpx 15rpx;
			}
			.count{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 200rpx;
				.send{
					margin-top: 15rpx;
					background: #e25248;
					padding: 8rpx 20rpx;
					font-size: 26rpx;
					border-radius: 5rpx;
				}
			}
		}
	}
	.num::after{
		border: 0;
	}
</style>
<template>
	<view class="main">
		<view class="info">
      <view class="tit">
      	<view>游戏:</view>
      	<view>{{info.gameName}}</view>
      </view>
			<view class="tit">
				<view>区\服:</view>
				<view>{{info.zonesName}}</view>
			</view>
			<view style="margin-top: 50rpx;">
				<u-input class="input" :custom-style="style" placeholder="请输入游戏昵称" height="80" v-model="name" />
				<u-input class="input" :custom-style="style" placeholder="请选择游戏段位" height="80" v-model="gameRankName" :disabled="true" @click="show=true" />
				<u-select v-model="show" :list="list" label-name="name" value-name="id" mode="single-column" @confirm="confirm" />
			</view>
		</view>
    <view class="desc" v-if="bindingContentList.length > 0">
      <view>绑定流程</view>
      <view v-for="item in bindingContentList">
       <view class="text">{{item.sequence}}、{{item.content}}</view>
       <u-image class="img" :src="item.image" style="height: 100px;"></u-image>
      </view>
    </view>
		<u-button class="btn" type="warning" @click="submit">提交</u-button>
	</view>
</template>


<script>
export default {
	name: "roleDetail",
  data() {
    return {
			info:{},
			style:{
				color: "#fff"
			},
			name: "",
			gameRankName: "",
			gameRankId: "",
			id: "",	//更新时有
			show: false,
			list: [],
      bindingContentList: [],//绑定教程
    };
  },
  methods: {
		confirm(e){
			this.gameRankName = e[0].label;
			this.gameRankId = e[0].value;
		},
		submit(){
			if(this.name === ""){
				this.$util.showToast("请输入名称");
				return
			}else if(this.gameRankId === ""){
				this.$util.showToast("请选择段位");
				return
			}
			if(this.id === ""){
				this.$u.api.userRole_save({
					"gameId": parseInt(this.info.gameId),
					"gameRankId": this.gameRankId,
					"gameZoneId": parseInt(this.info.zonesId),
					"name": this.name
				}).then(()=>{
					this.$util.showToastSuc("添加成功",()=>{
						this.$u.route({
							type: "navigateBack",
						})
					})
				})
			}else{
				this.$u.api.userRole_update({
					"name": this.name,
					"userRoleId": this.id,
					"gameRankId": this.gameRankId,
				}).then(()=>{
					this.$util.showToastSuc("修改成功",()=>{
						this.$u.route({
							type: "navigateBack",
						})
					})
				})
			}
		},
    getUserRoleInfo() {
      this.$u.api.game_ranks({
      	"gameId": this.info.gameId
      }).then(({list})=>{
      	this.list = list;
      	if(this.info.roleInfo){
      		uni.setNavigationBarTitle({
      	　　title: "修改角色"
      		})
      		const roleInfo = JSON.parse(this.info.roleInfo)
      		const rank = this.list.find(item=>item.id===roleInfo.rankId);
      		this.name = roleInfo.name;
      		this.gameRankName = rank.name;
      		this.gameRankId = rank.id;
      		this.id = roleInfo.id;
      	}
      })
    },
    getGameBindingContents() {
      this.$u.api.game_binding_contents({
        'gameId': parseInt(this.info.gameId),
      }).then(({list})=>{
        this.bindingContentList = list
      })
    }
  },
	onLoad(e) {
		this.info = e;
    this.getGameBindingContents();
    this.getUserRoleInfo();
	},
};
</script>
<style scoped lang="scss">
	.main{
		padding: 30rpx;
		.info{
			background: $theme-bg;
			padding: 40rpx 30rpx;
			border-radius: 10rpx;
			margin-top: 10rpx;
			.tit{
				display: flex;
				margin-bottom: 20rpx;
				justify-content: space-between;
				font-size: 26rpx;
			}
			.input{
				background: #444;
				margin-top: 40rpx;
				border-radius: 5rpx;
				padding: 0 10px !important;
			}
		}
    .desc{
    	background: $theme-bg;
    	padding: 10rpx  30rpx 40rpx 30rpx;
    	border-radius: 10rpx;
    	margin-top: 10rpx;
      .text{
        padding: 10rpx 0rpx;
        font-size: 26rpx;
      }
      .img{
        width: 100%; 
      }
    }
		.btn{
			position: fixed;
			width: calc(100% - 40rpx);
			left: 20rpx;
			bottom: 10rpx;
		}
	}
</style>
<template>
	<view class="main">
		<view class="info" v-for="item in list" :key="item.id">
			<u-row justify="between">
				<u-col :span="3">
					<view style="width: 90%;">
						<u-image 
							width="100%" 
							height="120rpx" 
							mode="scaleToFill" 
							:src="item.icon"/>
						<!-- <view class="tit">{{item.name}}</view> -->
					</view>
				</u-col>
				<u-col :span="9">
					<view class="list">
						<view class="item" v-for="it in item.zones" :key="it.id" @click="toDetail(item,it)">
							<view>{{it.name}}</view>
							<view v-if="hasRole(it)" class="edit">{{bindRoleName(it)}}<u-icon name="arrow-right" /></view>
							<view v-else class="binding">绑定</view>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>


<script>
export default {
	name: "myRole",
  data() {
    return {
			list: [],
			roleList: [],
    };
  },
  methods: {
		// 加载游戏和区
		async loadlist(){
			const {list} = await this.$u.api.game_games({});
			this.list = list;
		},
		// 加载角色列表
		loadRole(){
			this.$u.api.userRole_list({}).then(({list})=>{
				this.roleList = list;
			})
		},
		hasRole(item){
			return this.roleList.find(it=>it.gameZoneId===item.id&&it.gameId===item.gameId);
		},
		bindRoleName(item){
			return this.roleList.find(it=>it.gameZoneId===item.id&&it.gameId===item.gameId).name;
		},
		
		toDetail(game,zones){
			// 找到游戏和区有没有绑定的角色
			const roleInfo = this.roleList.find(it=>it.gameZoneId===zones.id&&it.gameId===game.id);
			this.$u.route({
				url: 'pages/mine/roleDetail',
				params: {
					gameId: game.id,
					gameName: game.name,
					zonesName: zones.name,
					zonesId: zones.id,
					roleInfo: JSON.stringify(roleInfo)
				}
			})
		}
  },
	onShow() {
		this.loadlist();
		this.loadRole();
	},
};
</script>
<style scoped lang="scss">
	.main{
		padding: 30rpx;
		.info{
			background: #36364B;
			padding: 20rpx;
			border-radius: 10rpx;
			margin-bottom: 30rpx;
			.tit{
				text-align: center;
				margin-top: 10rpx;
				font-size: 26rpx;
			}
			.list{
				.item{
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					padding: 0 0 25rpx 0;
					&:last-child{
						padding: 25rpx 0 0 0;
						border-top: 1px solid #292939;
					}
					.binding{
						background: #465FFF;
						padding: 5px 15px;
						font-size: 24rpx;
						border-radius: 10rpx;
					}
					.edit{
						line-height: 1;
					}
				}
			}
		}
	}
</style>
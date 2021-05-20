<template>
	<view class="wrap">
    
    <template v-if="list.length">
      <view class="item" v-for="(item, index) in list" :key="item.id" @click="gotoGameInfo(item.id)">
				<view class="status_wrap">
					<u-count-down v-if="item.status==0 && item.countDown"
						:timestamp="item.countDown" bg-color="#222131" :show-hours="false" color="#fff" font-size="30" separator-color="#fff" @end="handleCountDownEnd(index)"></u-count-down>
					<view v-if="item.status==1" class="status started">已开赛</view>
					<view v-if="item.status==2" class="status started">已开赛</view>
				</view>
      	<view class="item_img">
      		<image class="imgs" mode="widthFix" :src="item.pic" :lazy-load="false" />
      	</view>
      	<view class="item_info">
      		<view class="name">VS约战赛-房间号：{{item.id}}</view>
      		<view class="info_middle">
      			<view class="tag_wrap">
      				<view class="tag tag0">
      					1V1
      				</view>
      				<view class="tag tag1">
      					{{item.gameName}}
      				</view>
							<view class="tag" v-if="item.gameZoneId==1">
								<image class="imgs" mode="heightFix" src="/static/images/weixin-zone-icon.png" :lazy-load="false"/>
							</view>
      				<view class="tag" v-if="item.gameZoneId==2">
      					<image class="imgs" mode="heightFix" src="/static/images/tag3-icon.png" :lazy-load="false"/>
      				</view>
      			</view>
      		</view>
      		<view class="info_award">{{item.rewardDesc}}</view>
      	</view>
      </view>
      
    </template>
    <template v-else>
    	<u-empty text="暂无数据" mode="data"></u-empty>
    </template>
    
    <view class="create_room" @click="toCreateRoom">
    	<image class="imgs" mode="widthFix" src="../../static/images/create-room-icon.png" :lazy-load="false" />
    </view>
    <!-- <view class="my_room" @click="toCreateRoom">
    	<image class="imgs" mode="widthFix" src="../../static/images/create-room-icon.png" :lazy-load="false" />
    </view> -->
	</view>
</template>

<script>
  export default {
  	name: "engagement",
  	components: {},
  	data() {
  		return {
  			dataForm:{
          "gameId": 0,
  				"competitionId": 0,
          "roomType": 1,//1v1
  				"limit": 10,
  				"page": 1
  			},
  			list: []
  		};
  	},
  	onLoad(options) {
      this.dataForm.gameId = options.gameId
  		this.dataForm.competitionId = options.competitionId;
  		this.loadData();
  	},
  	methods:{
      toCreateRoom() {
        this.$u.route({
        	url: '/pages/active/createRoom',
          params: {
            gameId: this.dataForm.gameId,
            competitionId: this.dataForm.competitionId,
          }
        });
      },
			gotoGameInfo (id) {
				this.$u.route({
					url: '/pages/active/engagementDetail',
				  params: {
				    competitionRoomId: id,
				  }
				});
			},
  		async loadData(){
  			const {page} = await this.$u.api.competition_rooms(this.dataForm)
  			this.list = [...this.list,...page.list];
  		},
      handleCountDownEnd (idx) {
      	this.list[idx].status=1;
				this.$forceUpdate();
      }
  	},
  	onPullDownRefresh(){
  		this.dataForm.page = 1;
  		this.list = [];
  		this.loadData().then(()=>{
  			uni.stopPullDownRefresh();
  		});
  	},
  	onReachBottom(){
  		this.dataForm.page++;
  		this.loadData();
  	}
  }
</script>

<style scoped lang="scss">
page{
	background-color: #1C1B20;
}
.wrap{
  .u-empty{
    padding-top: 200rpx;
  }
  .create_room{
  	position: fixed;
  	right: 80rpx;
  	bottom: 200rpx;
  	width: 140rpx;
  	.imgs{
  		width: 100%;
  		height: 100%;
  	}
  }
  .my_room{
    position: absolute;
    right: 80rpx;
    bottom: 380rpx;
    width: 140rpx;
    .imgs{
    	width: 100%;
    	height: 100%;
    }
  }
	.item{
		background: #222131;
		display: flex;
		align-items: center;
		padding: 10rpx 10rpx;
		margin-bottom: 20rpx;
		border-radius: 10px;
		position: relative;
		.status_wrap{
			position: absolute;
			right: 20rpx;
			.status{
				color: #fff;
				padding: 2px 8px;
				font-size: 12px;
				text-align: center;
				border-radius: 5rpx;
				&.started{
					background: #d71616;
				}
			}
		}
		.item_img{
			width: 160rpx;
			.imgs{
				width: 100%;
			}
		}
		.item_info{
			flex: 1;
			margin-left: 20rpx;
			.name{
				color: #fff;
				font-size: 24rpx;
			}
			.info_middle{
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.tag_wrap{
					display: flex;
					.tag{
						height: 38rpx;
						margin-right: 10rpx;
						&.tag0{
							background-color: #d71616;
							color: #fff;
							font-size: 12px;
							height: 38rpx;
							line-height: 38rpx;
							padding: 0 8px;
							border-radius: 3px;
						}
						&.tag1{
							background-color: #8416d7;
							color: #fff;
							font-size: 12px;
							height: 38rpx;
							line-height: 38rpx;
							padding: 0 8px;
							border-radius: 3px;
						}
						.imgs{
							height: 100%;
						}
					}
				}
			}
			.info_award{
				font-size: 20rpx;
				margin-top: 10rpx;
				color: #CCCCCC;
			}
		}
	}
	
}
</style>

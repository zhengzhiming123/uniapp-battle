<template>
	<view class="main">
		<u-tabs-swiper
			bg-color="#212121"
			inactive-color="#807D90" 
			active-color="#465FFF"
			font-size="24"
			:active-item-style="activeItemStyle"
			bar-width="100"
			ref="uTabs" 
			:list="tabList" 
			:current="current" 
			@change="tabsChange" 
			:is-scroll="false" 
		/>
		<view class="scroll-view">
			<template v-if="list.length">
				<view class="lists" @click="toDatail(item)" v-for="item in list" :key="item.id">
					<u-row>
						<u-col span="3">
							<u-image
								width="128rpx" 
								height="128rpx" 
								border-radius="4"
								:src="item.pic"
							/>
						</u-col>
						<u-col span="9">
							<view class="tit">{{item.name}}</view>
							<view class="tag_wrap">
								<view class="tag_list">
                  <view class="tags zone" v-if="item.roomType == 1">1v1</view>
									<view class="tags name">{{item.competitionName}}</view>
									<view class="tags zone">{{item.gameZoneName}}</view>
									<!-- <view class="tags level">{{item.duanwei}}</view> -->
								</view>
								<view v-if="(current==0 || current==1) && item.roomType != 1" class="date_wrap">
									<image class="date_icon" src="/static/images/time.png" mode="widthFix" />
									<view class="game_date" >{{item.startTime.substring(11, 16)}}</view>
								</view>
                <view v-if="current==2" class="result_wrap">
                  <!-- <view  class="result_desc">{{item.integral > 0 ? '胜' : '负'}}</view> -->
                  <image class="result_img" v-if="item.integral > 0" src="/static/images/game_win.png"></image>
                  <image class="result_img" v-else src="/static/images/game_lose.png"></image>
                </view>
							</view>
							<view class="reward">
								<!-- 奖励： -->
								<!-- <image class="gold_icon" src="/static/images/gold.png" mode="widthFix" /> -->
								{{item.reward}}
							</view>
						</u-col>
						<!-- <u-col span="3" style="text-align: center;">
							
							<view style="margin-bottom: 20rpx;">
								<view class="tags" style="background: #505050;">{{item.name}}</view>
							</view>
							<u-button size="mini" type="warning" @click="toDatail(item)">查看</u-button>
						</u-col> -->
					</u-row>
				</view>
			</template>
			<u-empty v-else margin-top="200" text="暂无记录" mode="list"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		name: "myGame",
		data() {
			return {
				tabList: [
					{name: '报名中',competitionRoomStatus:0},
					{name: '比赛开始',competitionRoomStatus:1},
					{name: '比赛结束',competitionRoomStatus:2}, 
					{name: '比赛取消',competitionRoomStatus:3},
				],
				limit: 10,
				page: 1,
				list: [],
				current: 0,
				activeItemStyle: {
					'font-size': '28rpx',
					color: '#fff'
				}
			};
		},
		methods:{
			tabsChange(e){
				this.current = e;
				this.page = 1;
				this.list = [];
				this.loadData();
			},
			async loadData(){
				const {page} = await this.$u.api.competition_userEnrolls({
					"competitionRoomStatus": this.tabList[this.current].competitionRoomStatus,
					"limit": this.limit,
					"page": this.page
				})
				this.list = [...this.list,...page.list];
			},
			toDatail(roomInfo){
        if(roomInfo.roomType == 1) {
          //跳到1v1
          this.$u.route({
          	url: '/pages/active/engagementDetail',
          	params: {
              competitionRoomId: roomInfo.id,
            }
          });
        } else {
          //跳到普通比赛
          this.$u.route({
          	url: '/pages/active/activeDetail',
          	params: {
              id: roomInfo.id,
            }
          });
        }
			}
		},
		onLoad() {
			// this.$u.api.competition_userEnrolls()
			this.loadData();
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
	}
</script>

<style lang="scss">
	.main{
		.scroll-view{
			// height: calc(100vh - 80rpx - var(--window-top) - var(--window-bottom));
			.lists{
				color: white;
				border-bottom: 1px solid #666;
				padding-bottom: 30rpx;
				margin: 0 10rpx 20rpx 10rpx;
				&:first-child{
					padding-top: 20rpx;
				}
				&:last-child{
					border: 0;
					padding-bottom: 10rpx;
				}
				.tit{
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}
				.msg{
					font-size: 20rpx;
					margin-top: 10rpx;
					color: $theme-color-light;
				}
				.reward{
					font-size: 20rpx;
					margin-top: 15rpx;
					color: #fff;
					.gold_icon{
						width: 30rpx;
						height: 30rpx;
						vertical-align: bottom;
					}
				}
				.tag_wrap{
					display: flex;
					justify-content: space-between;
					.tags{
						font-size: 20rpx;
						padding: 3rpx 10rpx;
						display: inline-block;
						background-color: #f37b1d;
						border-radius: 6rpx;
						&.name{
							background-color: rgba(70,95,255,0.5);
							border: 1px solid #465FFF;
              margin-right: 10rpx;
						}
						&.zone{
							background-color: rgba(128,125,144,0.5);
							border: 1px solid #807D90;
							margin-right: 10rpx;
						}
						&.level{
							background-color: rgba(255,139,72,0.5);
							border: 1px solid #FF8B48;
							margin-right: 10rpx;
						}
					}
					.date_wrap{
						width: 150rpx;
						.date_icon{
							width: 40rpx;
							height: 40rpx;
							vertical-align: middle;
						}
						.game_date{
							display: inline-block;
							font-size: 20rpx;
							color: #fff;
							vertical-align: middle;
						}
					}
          .result_wrap{
            width: 100rpx;
            .result_img{
              width: 100rpx;
              height: 100rpx; 
              position: absolute;
              margin: -60rpx 0 0 -26rpx;
             
            }
            // .result_desc{
            //   font-size: 20rpx;
            //   color: #fff;
            //   vertical-align: middle;
            // }
          }
          
				}
			}
		}
	}
</style>

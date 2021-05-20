<template>
	<view class="main">
		<u-swiper :list="bannerList" height="400" @click="bannerClick" bg-color="#212121"></u-swiper>
		<view class="tab-wrap">
			
		</view>
		<u-tabs :list="gameList" :current="currentGameIndex" @change="tabsChange" bg-color="#131319" inactive-color="#807D90" active-color="#465FFF" font-size="24" :active-item-style="activeItemStyle" bar-width="100" height="60" item-width="180" gutter="20"></u-tabs>
    <!-- <u-loading mode="flower" size="50"></u-loading> -->
    <view class="game-wrap">
			<view class="loading-wrap" v-if="showLoading">
					<u-loading mode="flower" size="80"></u-loading>
			</view>
      <!-- <u-collapse class="collapse">
        <u-collapse-item>
          <view slot="title" class="collapse-tit">您有<span>0</span>场赛事可以快速参加</view>
          <activeItem v-for="(it,idx) in actives" :key="idx" :item="it" />
        </u-collapse-item>
      </u-collapse> -->
      <view class="scroll-wrap">
        <!-- <u-image 
          width="100%" 
          height="172rpx" 
          class="imgs"
          border-radius="10rpx" 
          src="http://games.mmkjkj.com/h5/static/images/banner.png"
        /> -->
        <!-- <view class="tit">活动赛事</view> -->
        
        
        <!-- 1v1比赛 -->
				<view class="engagement" v-if="currentGame.status == 2">
          <block  v-for="(item, index) in competitionList" :key="index">
            <view class="enga_list" v-if="item.open1v1 == 1">
            	<image width="100%"  class="imgs" border-radius="10rpx" mode="widthFix" :src="item.open1v1Pic" @click="toEngagement(currentGame.id, item.id)" :lazy-load="false" />
            </view>
          </block>
				</view>
        
        <!-- 免费赛 + 常规赛 -->
        <view class="imgs_wrap"  v-if="currentGame.status == 3">
          <!-- <view class="status">报名中</view> -->
          <view class="num">{{freeGameCompetition.count}}场</view>
          <image width="100%" class="imgs" border-radius="10rpx" mode="widthFix" src="https://siyoujingji.oss-cn-beijing.aliyuncs.com/upload/20210410/10216bdfc6ba484da5e159355009c43d.png" @click="toFreeGame()" :lazy-load="false" />
        </view>
        <view class="imgs_wrap"  v-if="currentGame.status == 3">
          <image width="100%" class="imgs" border-radius="10rpx" mode="widthFix" src="https://siyoujingji.oss-cn-beijing.aliyuncs.com/upload/20210410/5059bd3870a14e9aa8bb477f924a2ea9.png" @click="toBattleGame()" :lazy-load="false" />
        </view>
				
        <!-- 常规赛+常规赛赛段 -->
				<view class="imgs_wrap"  v-if="currentGame.status == 1" v-for="it in competitionList" :key="it.id">
					<view class="status">报名中</view>
					<view class="num">{{it.roomNumber}}场</view>
					<image width="100%" class="imgs" border-radius="10rpx" mode="widthFix" :src="it.pic" @click="toDetail(it.id)" :lazy-load="false" />
				</view>
        
      </view>
    </view>
		<u-mask :show="show" @click.stop="show=false">
			<view class="pop-up-warp">
				<u-image width="50%" mode="widthFix" border-radius="10" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2787928403,2563458279&fm=26&gp=0.jpg" />
				<u-icon name="close-circle" size="30px" @click="show=false"></u-icon>
			</view>
		</u-mask>
		
		<u-mask :show="updateShow">
			<view class="update-cont">
				<u-image width="100%" mode="widthFix" class="update-img" src="/static/images/update-bg.png" />
				<view class="update-text">
          <view>
            更新内容： {{updateData.content}}
          </view>
          <view class="update-btn-wrap">
            <button size="mini" type="primary" class="update-btn" @click="toUpdate">立即更新</button>
          </view>
				</view>
				<u-icon name="close-circle" class="close-update" size="20px" @click="updateShow=false"></u-icon>
				</view>
		</u-mask>
		
	</view>
</template>

<script>
import activeItem from "../../components/activeItem/activeItem.vue";
export default {
	name: "active",
	components: {activeItem},
  data() {
    return {
			showLoading: true,
			gameList: [],
			bannerList: [],
			actives: [{},{}],
			currentGameIndex: 0,
      currentGame: {},
      
      freeGameCompetition: {
        count: 0
      },
			
      competitionList: [],
			show: false,
			activeItemStyle: {
				'font-size': '28rpx',
				 color: '#fff'
			},
      
      updateShow: false,
      updateData: {}
    };
  },
  methods: {
    // bannerClick
    bannerClick(index) {
      var banner = this.bannerList[index];
      if(banner.linkUrl) {
        this.$u.route({
          url: '/pages/browser/browser',
          params: {
            url: banner.linkUrl
          }
        })
      }
    },
		// tabs通知swiper切换
		tabsChange(index) {
			this.currentGameIndex = index;
      this.currentGame = this.gameList[index];
			this.showLoading = true;
			this.getCompetitionList(index)
		},
		
		toDetail(id){
			this.$u.route({
				url: '/pages/active/activeList',
				params: {id}
			});
		},
		async getCompetitionList(idx){
			var gameId = this.gameList[idx].id;
      this.showLoading = true;
			const {list} = await this.$u.api.competition_competitions({gameId: gameId})
      this.showLoading = false;
      this.competitionList = list;
      
      //免费赛
      if(this.currentGame.status == 3) {
        this.getFreeGameCount();
      }
		},
    checkAppUpdate() {
      let that = this;
      this.$u.api.appversion_android({}).then(({data}) => {
        if(data) {
          this.updateData = data;
          var appid = plus.runtime.appid;
          plus.runtime.getProperty(plus.runtime.appid, (wgtInfo)=> {
            if(wgtInfo.versionCode < data.versionCode) {
              that.updateShow = true;
            }
          });
        }
      })
    },
    getFreeGameCount() {
      let that = this;
      this.freeGameCompetition = {
        count: 0
      };
      this.$u.api.competition_roomsCount({
        gameId: this.currentGame.id,
        competitionId: 0,
        roomType: 2
      }).then(res => {
        that.freeGameCompetition.count = res.count;
      })
    },
    toUpdate() {
       plus.runtime.openURL(this.updateData.url);
    },
    toEngagement (gameId,competitionId) {
			this.$u.route({
				url: '/pages/active/engagement',
        params: {
          gameId: gameId,
          competitionId: competitionId
          }
			});
		},
    //免费赛
    toFreeGame () {
      this.$u.route({
      	url: '/pages/active/activeList',
      	params: {
          gameId: this.currentGame.id,
          id: 0,
          roomType: 2
        }
      });
    },
    //常规赛
    toBattleGame () {
      this.$u.route({
      	url: '/pages/active/competitionList/competitionList',
      	params: {
          gameId: this.currentGame.id,
          gameName: this.currentGame.name
        }
      });
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    switch(uni.getSystemInfoSync().platform){
        case 'android':
          this.checkAppUpdate();
           break;
        case 'ios':
          this.checkAppUpdate();
           break;
        default:
           break;
    }
    // #endif
    
    
    this.$u.api.ads_banners({}).then(({list}) => {
      this.bannerList = list;
    })
    
    this.$u.api.game_index({}).then(({list})=>{
    	this.gameList = list;
      this.currentGame = list[0];      
			this.getCompetitionList(0);
    })
  },
	onShow() {
		
	},
  onPullDownRefresh(){
  	this.getCompetitionList(this.currentGameIndex).then(()=>{
				uni.stopPullDownRefresh();
			});
  }
};
</script>
<style scoped lang="scss">
	page{
		background-color: #131319;
	}
	.main{
		margin-top: var(--status-bar-height);
		.tab-wrap{
			box-shadow: 0px -3px 10px 0px rgba(37,61,212,0.83); 
			border-top-left-radius: 20rpx;
			border-top-right-radius: 20rpx;
			margin-top: 15rpx;
			height: 20rpx;
		}
		.game-wrap{
			height: 100%;
			width: 100%;
			overflow-y: auto;
			position: relative;
			.loading-wrap{
				position: absolute;
				top: 50%;
				left: 50%;
				margin-left: -20rpx;
				margin-top: -50rpx;
				z-index: 1000;
			}
			.scroll-wrap{
				padding: 20rpx 20rpx 30rpx 20rpx;
				.tit{
					font-weight: normal;
					margin: 10rpx 0 20rpx 0;
				}
				.imgs_wrap{
					position: relative;
					.status{
						position: absolute;
						right: 140rpx;
						top: 0;
						width:100rpx;
						text-align: center;
						font-size: 20rpx;
						line-height: 50rpx;
						z-index: 10;
					}
					.num{
						position: absolute;
						right: 0;
						width:140rpx;
						text-align: center;
						font-size: 20rpx;
						line-height: 50rpx;
						z-index: 10;
					}
					.imgs{
						width: 100%;
						margin-bottom: 25rpx;
					}
				}
			}
		}
    .collapse{
      margin-top: 20rpx;
      /deep/ .u-collapse-head{
        color: white;
        padding-right: 10rpx;
        padding-left: 10rpx;
        margin: 0 15rpx 20rpx 15rpx;
        border-radius: 10rpx;
        background: url(../../static/images/quickGame.ec465167.png) no-repeat;
        background-size: 100% 100%;
      }
      .collapse-tit{
        font-size: 28rpx;
        color: white;
        span{
          padding: 0 5rpx;
          color: $theme-color-light;
        }
      }
		}
		.pop-up-warp{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			flex-direction: column;
			.u-icon{
				margin-top: 30rpx;
			}
		}
		.update-cont{
			width: 60%;
			position: fixed;
			left: 50%;
			top: 40%;
			transform: translateX(-50%) translateY(-50%);
			font-size: 0;
			.update-img{
				border-top-left-radius: 10rpx;
				border-top-right-radius: 10rpx;
			}
			.update-text{
				background-color: #1E1E2A;
				font-size: 24rpx;
				padding: 20rpx;
			}
      .update-btn-wrap {
        text-align: center;
      }
      .update-btn {
         margin-top: 40rpx;
         margin-bottom: 20rpx;
         width: 240rpx;
         border-radius: 100rpx;
      }
			.close-update{
				position: absolute;
				bottom: -80rpx;
				left: 50%;
				margin-left: -20rpx;
			}
		}
	}
	.engagement{
		.enga_list{
			width: 100%;
			margin-bottom: 30rpx;
			.imgs{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
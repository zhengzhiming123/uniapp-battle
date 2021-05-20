<template>
	<view class="scroll-wrap">
		<view class="imgs_wrap" v-for="it in competitionList" :key="it.id">
			<view class="status">报名中</view>
			<view class="num">{{it.roomNumber}}场</view>
			<image width="100%" class="imgs" border-radius="10rpx" mode="widthFix" :src="it.pic" @click="toDetail(it.id)" :lazy-load="false" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameId: '',
        gameName: '',
        competitionList: []
			}
		},
    onLoad(e) {
      this.gameId = e.gameId;
      this.gameName = e.gameName;
      uni.setNavigationBarTitle({
      　　title: this.gameName
      })
      this.getCompetitionList();
    },
		methods: {
			async getCompetitionList(){
			  this.showLoading = true;
				const {list} = await this.$u.api.competition_competitions({gameId: this.gameId})
			  this.showLoading = false;
			  this.competitionList = list;
			},
      
      toDetail(id){
      	this.$u.route({
      		url: '/pages/active/activeList',
      		params: {
            id: id,
            gameId: this.gameId
          }
      	});
      },
		}
	}
</script>

<style scoped lang="scss">
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
</style>

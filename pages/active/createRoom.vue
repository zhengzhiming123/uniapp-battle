<template>
	<view class="wrap">
		<view class="item" @click="showSelectGame=true">
			<view class="label"><text class="needed">*</text>选择游戏</view>
			<view class="item_val" >{{selectedGame && selectedGame.name || '请选择'}}
				<image class="imgs" mode="widthFix" src="/static/images/arrow-right.png" :lazy-load="false" />
      </view>
		</view>
		
		<view class="item">
			<view class="label"><text class="needed">*</text>选择房间</view>
			<view class="item_val" @click="showSelectCompetition=true" >{{selectedCompetition && (selectedCompetition.name || selectedCompetition.label) || '请选择'}}
				<image class="imgs" mode="widthFix" src="/static/images/arrow-right.png" :lazy-load="false"
				/>
			</view>
		</view>
		
		<view class="item">
			<view class="label"><text class="needed">*</text>选择区服</view>
			<view class="item_val" @click="showSelectZone=true" >{{selectedZone && (selectedZone.name || selectedZone.label)  || '请选择'}}
				<image class="imgs" mode="widthFix" src="/static/images/arrow-right.png" :lazy-load="false"/>
			</view>
		</view>
		
		<view class="textarea_item">
			<view class="label"><text class="needed">*</text>房间链接</view>
			<view class="item_val"
			>
			<textarea class="textarea" placeholder-style="color:#92929e" maxlength="1024" placeholder="请输入游戏中创建房间的链接" v-model="roomUrl" />
			</view>
		</view>
		
		<view class="handbook_wrap">
			<image class="imgs" mode="widthFix" src="/static/images/wx-handbook.png" :lazy-load="false" @click="wxGuidHandle" />
		</view>
		<view class="handbook_wrap">
			<image class="imgs" mode="widthFix" src="/static/images/qq-handbook.png" :lazy-load="false" @click="qqGuidHandle" />
		</view>
		
    <view class="desc">创建房间需要消耗一张【{{selectedGame.name}}-{{selectedCompetition.name}}】门票</view>
		<view class="btn" @click="confirmCreateRoom">确认创建房间</view>
		
		<u-select v-model="showSelectGame" mode="single-column" :list="gameList" value-name="id" label-name="name" @confirm="confirmGame"></u-select>
		<u-select v-model="showSelectCompetition" mode="single-column" :list="competitionList" value-name="id" label-name="name"  @confirm="confirmCompetition"></u-select>
		<u-select v-model="showSelectZone" mode="single-column" :list="zoneList" value-name="id" label-name="name" @confirm="confirmZone"></u-select>
	</view>
</template>

<script>
	export default {
		name: "createroom",
		components: {},
	  data() {
	    return {
        gameId: "",
        competitionId: "",
        
				showSelectGame: false,
				showSelectCompetition: false,
				showSelectZone: false,
				gameList: [],
				selectedGame: {},
				competitionList: [],
				selectedCompetition: {},
				zoneList: [],
				selectedZone: {},
				roomUrl: '',
        
        ticketList: []//用户门票
	    };
	  },
	  methods: {
      wxGuidHandle() {
        this.$u.route({
          url: '/pages/browser/browser',
          params: {
            url: "https://h5.siyoujingji.com/adv/1v1wx/index.html"
          }
        })
      },
      qqGuidHandle() {
        this.$u.route({
          url: '/pages/browser/browser',
          params: {
            url: "https://h5.siyoujingji.com/adv/1v1qq/index.html"
          }
        })
      },
	    toCreateRoom () {
				this.$u.route({
					url: '/pages/active/createRoom'
				});
			},
			confirmGame (item){
				this.selectedGame = this.gameList.find(game=>{
					return game.id == item[0].value
				});
        this.zoneList = this.selectedGame.zones
        this.competitionList = this.selectedGame.competitions
        this.selectedCompetition = this.selectedGame.competitions[0]
        this.selectedZone = this.selectedGame.zones[0]
			},
			confirmCompetition (item) {
				this.selectedCompetition = {
          id: item[0].value,
          name: item[0].label
        }
			},
			confirmZone (item) {
				this.selectedZone = {
          id: item[0].value,
          name: item[0].label
        }
			},
      getGameList() {
        //从哪个赛段进来，只能创建该赛段的对抗赛
        this.$u.api.competition_games({}).then(({list})=>{
          list = list.filter(it => it.id == this.gameId);
          list.forEach(g => {
            g.competitions = g.competitions.filter(it => it.id == this.competitionId);
          })
        	this.gameList = list;
          
					this.selectedGame = list[0]
					this.zoneList = list[0].zones
					this.competitionList = list[0].competitions
					this.selectedZone = list[0].zones[0]
          this.selectedCompetition = list[0].competitions[0]
        })
      },
      getUserTicketNum() {
        this.$u.api.userTicket_userTickets({}).then(({list})=>{
          this.ticketList = list;
        })
      },
      hasEnoughTicketNum() {
        const tickObj = this.ticketList.find(item=>item.gameId==this.selectedGame.id && (item.competitionId==this.selectedCompetition.id||this.selectedCompetition.value));
        return tickObj && (tickObj.num>0) || false
      },
      confirmCreateRoom() {
        let that = this;
        if(!this.hasEnoughTicketNum()) {
          uni.showModal({
            title: '提示',
            content: '门票不足，请先购买',
            confirmText: '立即购买',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                that.$u.route('/pages/mine/ticket/buyTicket');
              }
            }
          });
          return
        }
        uni.showModal({
          title: '提示',
          content: '是否要创建房间',
          confirmText: '创建房间',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              that.doCreateRoom();
            }
          }
        });
      },
			doCreateRoom () {
        let that = this;
        if(!this.roomUrl) {
          this.$util.showToast('请输入房间地址');
          return
        }
        console.log(this.selectedZone.id)
        this.$u.api.competition_userCreateRoom({
          gameId: this.selectedGame.id,
          competitionId: this.selectedCompetition.id,
          gameZoneId: this.selectedZone.id,
          roomType: 1,
          roomUrl: this.roomUrl
        }).then((data)=>{
          uni.showModal({
            title: '提示',
            content: '创建成功',
            confirmText: '进入房间',
            cancelText: '稍后进入',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                that.$u.route('/pages/active/engagementDetail?competitionRoomId=' + data.competitionRoomId);
              } else {
                uni.navigateBack({
                  delta: 1
                });
              }
            }
          });
        })
      }
	  },
	  onLoad(options) {
      this.gameId = options.gameId;
      this.competitionId = options.competitionId;
      
	    this.getGameList();
	  },
    onShow() {
      this.getUserTicketNum()
    }
    
	};
</script>

<style scoped lang="scss">
page{
	background-color: #1c1b21;
}
.wrap{
	padding: 30rpx 20rpx;
	.needed{
		color: #f43f20;
		padding-right: 5px;
	}
	.item{
		background: #2d2d39;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		color: #92929e;
		font-size: 14px;
		border-radius: 5px;
		margin-bottom: 20rpx;
		.imgs{
			width: 20rpx;
			margin-left: 30rpx;
		}
	}
	.textarea_item{
		background: #2d2d39;
		padding: 20rpx;
		color: #92929e;
		font-size: 14px;
		border-radius: 5px;
		.item_val{
			margin-top: 10rpx;
			.textarea{
				height: 200rpx;
				font-size: 14px;
			}
		}
	}
	
	.handbook_wrap{
		margin-top: 20rpx;
		width: 100%;
			font-size: 0;
		.imgs{
			width: 100%;
			height: 100%;
		}
	}
  .desc{
    color: #FEF0F0;
    margin-top: 50rpx;
    text-align: center;
  }
	.btn{
		height: 90rpx;
		line-height: 90rpx;
		background-color: #f63f20;
		border-radius: 20rpx;
		text-align: center;
		color: #fff;
		margin-top: 10rpx;
	}
}
</style>

<template>
	<view class="main">
		<view class="lists">
			<u-row class="list" v-for="item in list" :key="item.name" @click="navigateTo(item.src, item.login)">
				<u-col :span="1">
					<u-image width="100%" height="36rpx" :src="item.icon" />
				</u-col>
				<u-col :span="10">{{item.name}}</u-col>
				<u-col :span="1">
					<u-icon name="arrow-right" color="#999" />
				</u-col>
			</u-row>
		</view>
  </view>
</template>

<script>
export default {
	name: "setting",
  data() {
    return {
			list: [
        {
					icon: "/static/images/mine_icon15.png",
					name: "关于我们",
					src: "/pages/mine/setting/about",
				  login: 0
				},{
					icon: "/static/images/mine_icon12.png",
					name: "意见反馈",
					src: "/pages/mine/setting/suggest",
          login: 0
				},{
					icon: "/static/images/mine_icon13.png",
					name: "用户协议",
					src: "/pages/mine/setting/agreement",
          login: 0
				},{
					icon: "/static/images/mine_icon16.png",
					name: "隐私协议",
					src: "/pages/mine/setting/policy",
          login: 0
				}
			]
		};
  },
  methods: {
		navigateTo(src, needLogin){
      if(!this.$util.isLogin(this) && needLogin == 1) {
        this.$util.submitModal('提示', '您还未登录，请先登录', () => {
          this.$u.route('/pages/mine/login');
        })
        return ;
      }
			if(src){
				this.$u.route(src);
			}
		},
  },
};
</script>
<style lang="scss" scoped>
	.main{
		padding: 30rpx;
		margin-top: var(--status-bar-height);
		.head{
			border-radius: 5rpx;
			background: #292939;
			padding: 30rpx 30rpx 0 30rpx;
			.info{
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				.toLogin{
					padding: 20rpx 0;
					font-size: 32rpx;
				}
			}
		}
		.lists{
			border-radius: 5rpx;
			background: #292939;
			margin-top: 40rpx;
			padding: 15rpx 20rpx;
			font-size: 28rpx;
			
			& .list:last-child{
				border-bottom: 0 !important;
			}
			.list{
				padding: 28rpx 0;
				border-bottom: 1px solid #313141;
			}
		}
	}
</style>
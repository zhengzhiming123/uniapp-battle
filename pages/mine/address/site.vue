<template>
	<view>
		<view class="item" v-for="(res, index) in siteList" :key="res.id" @click.stop="select(res)">
			<view class="top">
				<view class="name">{{ res.name }}</view>
				<view class="phone">{{ res.phone }}</view>
				<view class="tag">
					<text v-for="(item, index) in res.tag" :key="index">{{ item.tagText }}</text>
				</view>
			</view>
			<view class="bottom">
				{{res.province}}{{res.city}}{{res.district}}{{res.address}}
				<u-icon name="edit-pen" :size="40" color="#999999" @click="toEdit(res)"></u-icon>
			</view>
		</view>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isSelect: null,
			siteList: []
		};
	},
	onLoad(e) {
		this.isSelect = e.isSelect;
	},
	onShow() {
		this.$u.api.user_addressList({}).then(({list})=>{
			this.siteList = list.map(item=>{
				return {
					id: item.id,
					name: item.userName,
					phone: item.mobile,
					tag: [
						// {tagText: '默认'},
					],
					province: item.province,
					city: item.city,
					district: item.district,
					address: item.address,
				}
			})
		})
	},
	methods: {
		select(e){
			if(this.isSelect){
				uni.$emit('selectSite',e);
				this.$u.route({
					type: "navigateBack",
				})
			}
		},
		toEdit(data){
			this.$u.route({
				url: '/pages/mine/addSite',
				params:{
					data: JSON.stringify(data)
				}
			})
		},
		toAddSite(){
			this.$u.route('/pages/mine/address/addSite')
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color: $theme-color-light;
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	line-height: 80rpx;
	position: absolute;
	bottom: 40rpx;
	left: 40rpx;
	right: 40rpx;
	background-color: #465FFF;
	border-radius: 10rpx;
	font-size: 28rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>

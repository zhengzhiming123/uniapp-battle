<template>
	<view class="main">
		<view class="img-list">
			<view class="img-wrap" v-for="(item,index) in imgList" @click="selectImage(index)">
				<image v-show="imgCur===index" class="select" src="/static/images/select_a.png" />
				<image v-show="imgCur!==index" class="select" src="/static/images/select.png" />
				<u-image width="170" height="180" border-radius="10" :src="item.image" />
			</view>
		</view>
		<view class="canvas-wrap" id="canvas-wrap">
			<u-image width="100%" height="670" :src="imgCurUrl" />
			<view class="info">
				<view class="left">
					<view class="user">
						<u-image class="avatar" width="75" height="75" border-radius="50%" :src="vuex_user.avatar" />
						<text class="name">{{vuex_user.username}}</text>
					</view>
					<view class="id">邀请码:{{vuex_user.code}}</view>
				</view>
				<u-image class="qr-code" width="130" height="130" border-radius="5" :src="qrcode" />
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="save" @click="my_js.createPoster">保存到手机</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import QR from "../../static/lib/wxqrcode.js";
	export default {
		name: "invite",
		data() {
			return {
				qrcode: "",
				imgList: [],
				imgCur: 0,
        imgCurUrl: ""
			};
		},
		methods: {
			creates(option) {
				uni.showLoading({title: '加载中'});
				this.saveHeadImgFile(option.posterImg).then(()=>{
					this.$util.showToastSuc('图片保存成功');
				}).catch(e=>{
					console.log(e);
					this.$util.showToast('图片保存失败');
				}).finally(uni.hideLoading)
			},
			saveHeadImgFile(base64) {
				return new Promise(function(resolve, reject){
					const bitmap = new plus.nativeObj.Bitmap("test");
					bitmap.loadBase64Data(base64, ()=>{
						const url = "_doc/" + new Date().getTime() + ".png"; // url为时间戳命名方式
						bitmap.save(url, {
							overwrite: true, // 是否覆盖
							quality: 100  // 图片清晰度 0-100
						}, (i) => {
							uni.saveImageToPhotosAlbum({
								filePath: url,
								success: ()=>{
									bitmap.clear();
									resolve();
								}
							});
						}, (e) => {
							bitmap.clear();
							reject(e);
						});
					}, (e) => {
						bitmap.clear();
						reject(e);
					});
				})
			},
      selectImage(index) {
        this.imgCur = index;
        this.imgCurUrl = this.imgList[index].image;
      }
		},
		onLoad() {
			this.$u.api.user_inviteUrl({}).then(({url})=>{
				this.qrcode = QR.createQrCodeImg(url, {
					size: 180,
				})
			})
      
      this.$u.api.inviteImages_list({}).then(({list})=>{
        this.imgList = list
        this.imgCurUrl = list[0].image
      })
		}
	}
</script>
<script module="my_js" lang="renderjs">
	import html2canvas from "@/static/lib/html2canvas.min.js";
	export default {
		methods: {
			createPoster(event, ownerInstance) {
				// 生成海报  
        (window.html2canvas || html2canvas)(document.getElementById("canvas-wrap"), {
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
        }).then(canvas => {
          var posterImg = canvas.toDataURL("image/png", 0.7);
          ownerInstance.callMethod('creates', {
          	posterImg: posterImg
          })
        })
        .catch(err => {
          this.$util.showToast('保存失败, 请自行截图');
        });
        
				// const domObj = document.getElementById("canvas-wrap");
				// html2canvas(domObj, {
				// 	useCORS: true,
				// 	logging: false,
				// 	letterRendering: true,
				// 	// proxy: "http://oss.licai521.com/",
				// 	allowTaint: true,
				// 	onclone(doc) {
				// 		// let e = doc.querySelector("#posterHtml");
				// 		// e.style.display = "block";
				// 	},
				// }).then(function(canvas) {
				// 	var posterImg = canvas.toDataURL("image/png", 0.7);
				// 	ownerInstance.callMethod('creates', {
				// 		posterImg: posterImg
				// 	})
				// }).catch(e => {
				// 	console.log(e);
				// })
			},
		},
	}
</script>

<style scoped lang="scss">
	.main {
		padding: 0 40rpx;

		.img-list {
			display: flex;
			overflow-x: auto;

			.img-wrap {
				margin-right: 15rpx;
				position: relative;

				.select {
					position: absolute;
					right: 0;
					top: 0;
					z-index: 1;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.canvas-wrap {
			background: $theme-bg;
			margin-top: 30rpx;
			border-radius: 5rpx;
			overflow: hidden;
			position: relative;
			.info {
				bottom: 0;
				left: 0;
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding: 30rpx 20rpx;
				background: rgba(30,30,42,.6);
				.qr-code {
					flex: none;
					margin-left: 40rpx;
				}

				.left {
					flex: auto;

					.user {
						display: flex;
						align-items: center;
						color: #cfcfcf;
						padding-bottom: 20rpx;

						.avatar {
							margin-right: 10rpx;
						}

						.name {
							color: #fff;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
					.id {
						font-size: 24rpx;
					}
				}
			}
		}

		.save {
			margin-top: 40rpx;
			width: 100%;
			background: $theme-color-light;
			border-radius: 10rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 30rpx;
		}
	}
</style>

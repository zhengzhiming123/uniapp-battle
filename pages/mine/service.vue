<template>
  <view class="main">
   
	</view>
</template>

<script>
	(function (w, d, n, a, j) {
		w[n] = w[n] || function () {
			(w[n].a = w[n].a || []).push(arguments);
		};
		j = d.createElement('script');
		j.async = true;
		j.src ='https://qiyukf.com/script/70c6afdde2a6b98b28b1643a33b19c43.js';
		d.body.appendChild(j);
	})(window, document, 'ysf');
</script>

<script>
  
  
	export default {
		name: "service",
		data() {
			return {
				src: ""
			};
		},
		methods: {
			save(){
				uni.downloadFile({
					url: this.src,
					success: (res) =>{
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: ()=> {
								this.$util.showToastSuc("保存成功");
							},
							fail: ()=> {
								this.$util.showToast("保存失败");
							}
						});
					}
				})
			}
		},
		onLoad() {
			this.$u.api.user_customer({}).then(res=>{
				this.src = res.url;
			})
		}
	};
</script>
<style scoped lang="scss">
	.main{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
    width: 100%;
    height: 100%;
		.btn{
			width: 85%;
      bottom: 50rpx;
		}
	}
</style>

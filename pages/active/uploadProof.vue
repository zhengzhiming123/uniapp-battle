<template>
	<view class="wrap">
		<view class="tips">注：上传王者荣耀相关图片</view>
		<view class="upload_wrap">
			<u-upload :action="action" :file-list="fileList" :header="header" :auto-upload="true"
				@on-success="({url})=>form.pathUrl=url"></u-upload>
		</view>
		<view class="result_wrap">

			<label @click="radioChange(1)">
				<view class="item">
					<view>我赢了</view>
					<view>
						<radio class="form_radio" checked="true" :checked="form.resultStatus===1" />
					</view>
				</view>
			</label>

			<label @click="radioChange(0)">
				<view class="item">
					<view>我输了</view>
					<view>
						<radio class="form_radio" :checked="form.resultStatus===0" />
					</view>
				</view>
			</label>

			<label @click="radioChange(2)">
				<view class="item">
					<view>我没有参加比赛</view>
					<view>
						<radio class="form_radio" :checked="form.resultStatus===2" />
					</view>
				</view>
			</label>
		</view>

		<view class="btn" @click="doUpload">确定上传</view>
	</view>
</template>

<script>
	export default {
		name: "engagement",
		components: {},
		data() {
			return {
				action: '', //上传地址
				header: {},
				fileList: [], //文件列表
				form: {
					competitionRoomId: 0,
					resultStatus: 2,
					pathUrl: ''
				}
			};
		},
		methods: {
			radioChange(val) {
				console.log(val)
				this.form.resultStatus = val;
			},
			doUpload() {
				if(this.form.pathUrl==''){
					this.$util.showToast("请先上传比赛结果图片");
					return;
				}
				this.$u.api.user_submit_room_result(this.form).then(res => {
					this.$util.showToastSuc("提交成功");
				})
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onLoad(options) {
			this.form.competitionRoomId = options.id;
		},
		onReady() {
			this.action = this.$u.http.config.baseUrl + "/app/oss/upload";
			this.header = {
				token: this.vuex_token
			};
			//this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		padding: 0 50rpx;

		.tips {
			font-size: 14px;
			color: #707070;
			margin-top: 50rpx;
		}

		.upload_wrap {
			margin-top: 20rpx;
		}

		.result_wrap {
			margin-top: 50rpx;

			.item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				font-size: 13px;

				.form_radio {
					transform: scale(0.7);
				}
			}
		}

		.btn {
			margin-top: 50rpx;
			background: #2979ff;
			color: #fff;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 14px;
			border-radius: 20rpx;
		}
	}
</style>

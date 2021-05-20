<script>
  var jpushModule = uni.requireNativePlugin("JG-JPush")
	export default {
    onLaunch: function() {
    	jpushModule.initJPushService();
    	jpushModule.setLoggerEnable(false);
    	jpushModule.addConnectEventListener(result=>{
    		let connectEnable = result.connectEnable
    		uni.$emit('connectStatusChange',connectEnable)
    	});
      
    	
    	jpushModule.addNotificationListener(result=>{
    		let notificationEventType = result.notificationEventType
    		let messageID = result.messageID
    		let title = result.title
    		let content = result.content
    		let extras = result.extras
    		
    		// uni.showToast({
    		// 	icon: 'none',
    		// 	title: JSON.stringify(result),
    		// 	duration: 3000
    		// })
    	});
    }
	}
  
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	
	uni-page-body{
		color: #fff;
	}
	page{
		color: #fff;
		background: $theme-color-dark;
	}
	/* 文字溢出隐藏 */
	.text-overflow-1{
		/*display: -webkit-box;white-space: normal !important;text-overflow: ellipsis;overflow: hidden;-webkit-line-clamp: 1;-webkit-box-orient: vertical;*/
		overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
	}
	.text-overflow-2{
		display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;
	}
	.text-overflow-3{
		display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;
	}
</style>

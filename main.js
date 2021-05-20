import Vue from 'vue'
import App from './App'

import util from '@/common/util.js';
Vue.prototype.$util = util;

import {Partten} from '@/partten';
Vue.prototype.$partten = Partten;

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

// 全局变量和持久化数据
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import store from '@/store';

const app = new Vue({
	store,
	...App
})

// http拦截器
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

app.$mount()

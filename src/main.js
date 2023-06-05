import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

import dayjs from 'dayjs'
// 计算相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zhCn from 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale(zhCn)

Vue.filter('dateFormat', dt => {
  return dayjs().to(dt)
})

Vue.use(vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

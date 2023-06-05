import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import LoginView from '@/views/LoginView.vue'
import MainView from '@/views/MainVIew.vue'
import HomeView from '@/views/HomeView.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: LoginView, name: 'login' },
  {
    path: '/',
    component: MainView,
    redirect: '/',
    children: [
      { path: '', name: 'home', component: HomeView, meta: { isRecord: true, top: 0 } },
      { path: 'user', name: 'user', component: () => import('@/views/UserView.vue') }
    ]
  },
  { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue') },
  { path: '/search/:kw', name: 'search-result', component: () => import('@/views/SearchResult.vue'), props: true, meta: { isRecord: true, top: 0 } },
  { path: '/article/:id', name: 'art-detail', component: () => import('@/views/ArtDetail.vue'), props: true, meta: { isRecord: true, top: 0 } },
  { path: '/user/edit', name: 'user-edit', component: () => import('@/views/UserEdit.vue') },
  { path: '/chat', name: 'chat', component: () => import('@/views/ChatView.vue') },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

const pagePathArr = ['/user', '/user/edit']

// 重写push方法解决报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  if (pagePathArr.includes(to.path)) {
    const tokenStr = store.state.tokenInfo.token
    tokenStr ? next() : next(`/login?pre=${to.fullPath}`)
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  if (to.meta.isRecord) {
    // afterEach执行完dom才会更新,改变滚动事件的执行顺序
    setTimeout(() => {
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

export default router

import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'
Vue.use(Vuex)

let initState = {
  // token 的信息对象
  tokenInfo: {},
  // 用户的基本信息
  userInfo: {},
  // 用户的简介信息
  userProfile: {}
}
const stateStr = localStorage.getItem('state')
if (stateStr) {
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  state: initState,
  getters: {
    userAvatar(state) {
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }
      return imgSrc
    }
  },
  mutations: {
    updateTokenInfo(state, payload) {
      state.tokenInfo = payload
      this.commit('saveStateToStorage')
    },
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    updateUserInfo(state, payload) {
      state.userInfo = payload
      this.commit('saveStateToStorage')
    },

    cleanState(state) {
      state.tokenInfo = {}
      state.userInfo = {}

      this.commit('saveStateToStorage')
    },
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    }
  },
  actions: {
    async initUserInfo(ctx) {
      const { data: res } = await getUserInfoAPI()
      ctx.commit('updateUserInfo', res.document)
    },
    async initUserProfile(ctx) {
      const { data: res } = await getUserProfileAPI()
      console.log(res)
      ctx.commit('updateUserProfile', res.document)
    }
  },
  modules: {}
})

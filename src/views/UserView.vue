<template>
  <div class="user-cotainer">
    <div class="user-card">
      <van-cell>
        <template #icon>
          <img class="avatar" :src="userInfo.photo" alt="" />
        </template>
        <template #title>
          <span class="user-name">{{ userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>

      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <van-cell-group>
      <van-cell icon="edit" title="编辑资料" is-link to="/user/edit"></van-cell>
      <van-cell icon="chat-o" title="联系客服" is-link to="/chat"></van-cell>
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  neme: 'UserView',
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    console.log(2)
    this.initUserInfo()
  },
  activated() {
    this.initUserInfo()
  },
  methods: {
    ...mapActions(['initUserInfo']),
    ...mapMutations(['cleanState']),
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认退出登录吗？'
        })
        // console.log(confirmResult, typeof confirmResult)
        this.cleanState()
        this.$router.push('/login')
      } catch {}
    }
  }
}
</script>

<style lang="less" scoped>
.user-card {
  color: #fff;
  background-color: #007bff;
  padding-top: 20px;
  .van-cell {
    color: white;
    background-color: #007bff;
    &::after {
      display: none;
    }
    .avatar {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      background-color: #fff;
      border-radius: 50%;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      .user-name {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .user-data {
    display: flex;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

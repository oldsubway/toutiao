<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item name="home" icon="home-o" :to="{ name: 'home' }">主页 </van-tabbar-item>
      <van-tabbar-item name="user" icon="user-o" :to="{ name: 'user' }">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'MainView'
}
</script>

<style lang="less" scoped></style>

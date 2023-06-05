<template lang="">
  <div>
    <div class="home-container">
      <!-- 头部区域 -->
      <van-nav-bar fixed title="黑马头条">
        <!-- 左侧的插槽 -->
        <template #left>
          <img src="@/assets/header.png" class="logo" />
        </template>
        <!-- 右侧的插槽 -->
        <template #right>
          <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
        </template>
      </van-nav-bar>
      <van-tabs v-model="active" sticky offset-top="46px" :before-change="beforeTabsChange" @change="onTabsChange">
        <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
          <art-list :channelId="item.id"></art-list>
        </van-tab>
      </van-tabs>
      <van-icon name="plus" size="16" class="plus" @click="show = true" />
      <!-- 频道管理的弹出层 -->
      <van-popup v-model="show" :close-on-click-overlay="false" @closed="isDel = false">
        <div class="popup-container">
          <!-- 弹出层的头部区域 -->
          <van-nav-bar title="频道管理">
            <template #right>
              <van-icon name="cross" size="14" color="white" @click="show = false" />
            </template>
          </van-nav-bar>

          <!-- 弹出层的主体区域 -->
          <div class="pop-body">
            <!-- 我的频道 -->
            <div class="my-channel-box">
              <div class="channel-title">
                <div>
                  <span class="title-bold">已添加频道：</span>
                  <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
                </div>
                <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
              </div>
              <!-- 我的频道列表 -->
              <van-row type="flex">
                <van-col span="6" v-for="(item, index) in userChannel" :key="item.id">
                  <!-- 用户的频道 Item 项 -->
                  <div class="channel-item van-hairline--surround" @click="onUserChannelClick(item, index)">
                    {{ item.name }}
                    <van-badge color="transparent" class="cross-badge" v-if="isDel && item.name !== '首页'">
                      <template #content>
                        <van-icon name="cross" class="badge-icon" color="red" size="12" />
                      </template>
                    </van-badge>
                  </div>
                </van-col>
              </van-row>
            </div>

            <!-- 分隔线 -->
            <div class="van-hairline--top sp-line"></div>

            <!-- 更多频道 -->
            <div class="more-channel-box">
              <div class="channel-title">
                <div>
                  <span class="title-bold">可添加频道：</span>
                  <span class="title-gray">点击添加频道</span>
                </div>
              </div>
              <!-- 更多频道列表 -->
              <van-row type="flex">
                <van-col span="6" v-for="item in moreChannel" :key="item.id" @click="addChannel(item)">
                  <div class="channel-item van-hairline--surround">{{ item.name }}</div>
                </van-col>
              </van-row>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/api/homeAPI.js'
import ArtList from '@/components/ArtList/ArtList.vue'
const nameToTop = {}
export default {
  name: 'HomeView',
  components: {
    ArtList
  },
  data() {
    return {
      active: 0,
      userChannel: [],
      show: false,
      allChannel: [],
      isDel: false
    }
  },
  computed: {
    moreChannel() {
      return this.allChannel.filter(item => {
        const index = this.userChannel.findIndex(x => x.id === item.id)
        if (index === -1) return true
        return false
      })
    }
  },
  created() {
    this.initUserChannel()
    this.initAllChannel()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      this.userChannel = res.document.channels
    },

    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      this.allChannel = res.documents
    },

    addChannel(channel) {
      this.userChannel.push(channel)
      this.updateChannel()
    },

    async updateChannel() {
      const userChannel = this.userChannel
        .filter(item => item.name !== '首页')
        .map(item => ({
          id: item.id,
          name: item.name
        }))
      await updateUserChannelAPI(userChannel)
      this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
    },

    onUserChannelClick(channel, index) {
      if (this.isDel) {
        if (channel.name === '首页' || this.userChannel.length === 2) return
        this.userChannel = this.userChannel.filter(item => item.id !== channel.id)
        this.updateChannel()
      } else {
        this.active = index
        this.show = false
      }
    },
    beforeTabsChange() {
      const name = this.userChannel[this.active].name
      nameToTop[name] = window.scrollY
      return true
    },
    onTabsChange() {
      // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
      this.$nextTick(() => {
        const name = this.userChannel[this.active].name
        window.scrollTo(0, nameToTop[name] || 0)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 46px;
  padding-bottom: 50px;
}
// logo 样式
.logo {
  height: 80%;
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>

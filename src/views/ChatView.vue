<template>
  <div class="container">
    <van-nav-bar fixed title="客服" left-arrow @click-left="$router.back()" />

    <div class="chat-list">
      <div class="chat-time">{{ message }}</div>
      <div v-for="(item, index) in list" :key="index">
        <div class="chat-item left" v-if="item.name === 'kf'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{ item.msg }}</div>
        </div>
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ item.msg }}</div>
          <van-image fit="cover" round :src="userAvatar" />
        </div>
      </div>
    </div>

    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <span @click="send()" style="font-size: 12px; color: #999">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'ChatView',
  data() {
    return {
      word: '',
      list: [
        { name: 'kf', msg: '你好' },
        { name: 'me', msg: '你好' },
        { name: 'kf', msg: '你好' }
      ],
      sk: null,
      canSend: false,
      message: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    ...mapGetters(['userAvatar'])
  },
  created() {
    this.initConnet()
  },
  beforeDestroy() {
    this.sk.close()
    this.sk = ''
  },
  methods: {
    send() {
      if (!this.word || !this.canSend) return
      this.list.push({ name: 'me', msg: this.word })
      this.sk.send(this.word)
      this.word = ''
    },

    initConnet() {
      const sk = new WebSocket('ws://localhost:3000')

      sk.addEventListener('error', () => {
        this.$notify({ type: 'danger', message: '与服务器连接失败' })
      })
      sk.addEventListener('message', event => {
        this.list.push(JSON.parse(event.data))
      })
      sk.addEventListener('open', () => {
        this.canSend = true
      })
      sk.addEventListener('close', () => {
        this.canSend = false
      })

      this.sk = sk
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow: scroll;
    .chat-time {
      text-align: center;
      color: #b3b0b0;
      padding-top: 10px;
    }
    .van-image {
      width: 40px;
      height: 40px;
      vertical-align: top;
    }
    .chat-item {
      margin-top: 10px;
    }
    .chat-pao {
      display: inline-block;
      position: relative;
      padding: 0 10px;
      vertical-align: top;
      min-width: 70px;
      max-width: 70%;
      line-height: 40px;
      border: 1px solid #c2d9ea;
      border-radius: 4px;
      background-color: #e0effb;
      word-break: break-all;
      font-size: 14px;
      color: #333;
      &::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        top: 12px;
        background-color: #e0effb;
        border-top: 0.5px solid #c2d9ea;
        border-right: 0.5px solid #c2d9ea;
      }
    }
    .chat-item.left {
      text-align: left;

      .chat-pao {
        margin-left: 15px;
        margin-right: 0;
        &::before {
          left: -5px;
          transform: rotate(-135deg);
        }
      }
    }
    .chat-item.right {
      text-align: right;
      .chat-pao {
        margin-right: 15px;
        margin-left: 0;
        &::before {
          right: -5px;
          transform: rotate(45deg);
        }
      }
    }
  }
  .reply-container {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 44px;
    width: 100%;
    background: #f5f5f5;
    z-index: 9999;
  }
}
</style>

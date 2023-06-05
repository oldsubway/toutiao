<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <van-list class="cmt-list" v-model="loading" :finished="finished" finished-text="没有更多评论了" :immediate-check="false" @load="onLoad">
      <div v-for="item in cmtList" :key="item.com_id" class="cmt-item">
        <!-- 头部 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img class="avatar" src="@/assets/logo.png" alt="" />
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon v-if="item.is_liking" name="like" size="16" color="red" />
            <van-icon v-else name="like-o" size="16" color="gray" />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{ item.content }}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="count" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <div class="cmt-box van-hairline--top" v-else>
      <textarea v-model.trim="cmt" placeholder="友善评论、理性发言、阳光心灵" ref="iptCmt" @blur="hideBox2"></textarea>
      <van-button type="default" :disabled="cmt.length === 0" @click="addCmt">发布</van-button>
    </div>
  </div>
</template>

<script>
import { getCmtListAPI, addCmtAPI } from '@/api/articleAPI.js'
import { animate } from 'popmotion'
export default {
  name: 'ArtCmt',
  props: {
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      cmtList: [],
      loading: false,
      finished: false,
      page: 0,
      isShowBox1: true,
      count: 0,
      cmt: ''
    }
  },
  created() {
    this.initCmtList()
  },
  methods: {
    async initCmtList() {
      const { data: res } = await getCmtListAPI(this.artId, this.page)
      this.cmtList = [...this.cmtList, ...res.documents]
      this.loading = false
      if (res.documents.length === 0) {
        this.finished = true
      } else {
        this.count = res.documents[0].comm_count
      }
      this.page += 1
    },

    onLoad() {
      this.initCmtList()
    },

    showBox2() {
      this.isShowBox1 = false
      this.$nextTick(() => {
        this.$refs.iptCmt.focus()
      })
    },

    hideBox2() {
      setTimeout(() => {
        this.isShowBox1 = true
        this.cmt = ''
      }, 100)
    },

    async addCmt() {
      const data = await addCmtAPI(this.artId, this.cmt)
      this.cmtList.unshift(data)
      this.count += 1
    },

    scrollToCmtList() {
      // 当前滚动条的位置
      const now = window.scrollY
      // 目标位置
      const dist = document.querySelector('.article-container').offsetHeight
      animate({
        from: now,
        to: dist,
        onUpdate: latest => window.scrollTo(0, latest)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;

  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>

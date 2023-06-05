<template>
  <div class="artlist-container">
    <van-pull-refresh v-model="isLoading" :disabled="finished" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
        <!-- 循环渲染文章的列表 -->
        <art-item v-for="item in artList" :key="item.art_id" :article="item" @remove-article="removeArticle"></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArtListAPI } from '@/api/homeAPI.js'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'ArtList',
  components: {
    ArtItem
  },
  props: {
    channelId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      artList: [],
      loading: false,
      finished: false,
      page: 1,
      isLoading: false
    }
  },
  created() {
    this.initArtList()
  },
  methods: {
    async initArtList(isRefresh) {
      const { data: res } = await getArtListAPI(this.page, this.channelId)
      // 判断是上拉刷新还是下拉刷新
      if (isRefresh) {
        this.artList = [...res.documents, ...this.artList]
        this.isLoading = false
      } else {
        this.artList = [...this.artList, ...res.documents]
        this.loading = false
      }
      // 判断数据是否加载完毕
      if (res.documents.length === 0) {
        this.finished = true
      }
      // 页码+1
      this.page += 1
    },
    onLoad() {
      this.initArtList()
    },
    onRefresh() {
      this.initArtList(true)
    },
    removeArticle(id) {
      this.artList = this.artList.filter(item => item.art_id !== id)
      // 如果剩余数据不足十条，主动刷新一次
      if (this.artList.length < 6) {
        this.initArtList()
      }
    }
  }
}
</script>

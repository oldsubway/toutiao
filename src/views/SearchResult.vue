<template>
  <div class="search-result-container">
    <van-nav-bar title="搜索结果" left-arrow fixed @click-left="$router.back()"></van-nav-bar>

    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
      <art-item v-for="item in searchList" :key="item.art_id" :article="item" :closeAble="false"></art-item>
    </van-list>
  </div>
</template>
<script>
import { getSearchResultAPI } from '@/api/SearchAPI'
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'SearchResult',
  components: {
    ArtItem
  },
  props: ['kw'],
  data() {
    return {
      searchList: [],
      loading: false,
      finished: false,
      page: 0
    }
  },
  watch: {
    kw() {
      // 1. 重置关键数据
      this.page = 0
      this.searchList = []
      this.loading = false
      this.finished = false
      // 2. 请求数据
      this.initSearchList()
    }
  },
  created() {
    this.initSearchList()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  },
  methods: {
    async initSearchList() {
      const { data: res } = await getSearchResultAPI(this.kw, this.page)
      this.searchList = [...this.searchList, ...res.documents]
      this.loading = false
      if (res.documents.length === 0) {
        this.finished = true
      }
      this.page += 1
    },

    onLoad() {
      this.initSearchList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>

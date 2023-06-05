<template>
  <div class="search-container">
    <div class="search-header">
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()"></van-icon>
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input="onInput"></van-search>
    </div>

    <div class="sugg-list" v-if="kw.length !== 0">
      <div v-for="(item, index) in suggestList" v-html="item" :key="index" class="sugg-item" @click="gotoSearchResult"></div>
    </div>

    <div class="search-history" v-else>
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="delete" class="delete-icon" @click="history = []"></van-icon>
        </template>
      </van-cell>
      <div class="history-list">
        <div v-for="(item, index) in history" v-html="item" :key="index" class="history-item" @click="gotoSearchResult">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSuggestListAPI } from '@/api/SearchAPI'
export default {
  name: 'SearchView',
  data() {
    return {
      kw: '',
      timer: null,
      suggestList: [],
      history: JSON.parse(localStorage.getItem('history') || '[]')
    }
  },
  watch: {
    history(val) {
      localStorage.setItem('history', JSON.stringify(val))
    }
  },
  mounted() {
    const ipt = document.querySelector('input[type=search]')
    ipt && ipt.focus()
  },
  methods: {
    onInput() {
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
        return
      }
      this.timer = setTimeout(() => {
        this.initSuggestList()
      }, 500)
    },

    async initSuggestList() {
      const res = await getSuggestListAPI(this.kw)
      if (res.length === 0) {
        this.suggestList = []
        return this.$notify({ message: '没有找到相关文章', type: 'danger', duration: 1000 })
      }
      this.suggestList = res
      this.highKeywords(this.suggestList)

      const newHistory = this.history.filter(item => item !== this.kw)
      newHistory.unshift(this.kw)
      this.history = newHistory
    },

    highKeywords(arr) {
      const reg = new RegExp(this.kw, 'ig')
      arr.forEach((item, index) => {
        arr[index] = item.replaceAll(reg, val => {
          return `<span style='color:red;font-weight:bold;'>${val}</span>`
        })
      })
    },

    gotoSearchResult(e) {
      this.kw = ''
      const kw = e.currentTarget.innerText
      this.$router.push('/search/' + kw)
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;

  .goback {
    padding-left: 14px;
  }

  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-style: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.delete-icon {
  font-size: 16px;
  line-height: inherit;
  color: red;
}
.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    margin: 10px 8px 0px 8px;
    padding: 8px 14px;
    background-color: #efefef;
    font-size: 12px;
    border-radius: 10px;
  }
}
</style>

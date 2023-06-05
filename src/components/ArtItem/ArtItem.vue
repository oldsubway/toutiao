<template>
  <div @click="$router.push('/article/' + article.art_id)" v-if="article.cover">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <span>{{ article.title }}</span>
          <img v-if="article.cover.type === 1" src="@/assets/logo.png" alt="" class="thumb" />
        </div>
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img v-for="(item, index) in article.cover.images" :key="index" src="@/assets/logo.png" alt="" class="thumb" />
        </div>
      </template>
      <!-- label区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span>{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论 &nbsp;&nbsp; {{ article.pubdate | dateFormat }}</span>
          <!-- 关闭按钮 -->
          <van-icon v-if="closeAble" name="cross" @click.stop="show = true" />
        </div>
      </template>
    </van-cell>
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" get-container="body">
      <div v-if="isFirst">
        <van-cell v-for="(item, index) in actions" :key="index" :title="item.name" title-class="center-title" clickable @click="onCellClick(item.name)" />
      </div>
      <div v-else>
        <van-cell title="返回" clickable title-class="center-title" @click="isFirst = true" />
        <van-cell v-for="(item, index) in reports" :key="index" :title="item.label" title-class="center-title" @click="reportArticle()" />
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import reports from '@/api/reports.js'
export default {
  name: 'ArtItem',
  props: {
    article: {
      required: true,
      type: Object
    },
    closeAble: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      actions: [{ name: '不感兴趣' }, { name: '反馈垃圾内容' }, { name: '拉黑作者' }],
      isFirst: true,
      reports
    }
  },
  created() {},
  methods: {
    onCellClick(name) {
      switch (name) {
        case '不感兴趣':
          this.show = false
          this.$emit('remove-article', this.article.art_id)
          break
        case '拉黑作者':
          this.show = false
          break
        case '反馈垃圾内容':
          this.isFirst = false
          break
      }
    },

    reportArticle() {
      this.$emit('remove-article', this.article.art_id)
      this.show = false
      this.isFirst = true
    }
  }
}
</script>
<style lang="less" scoped>
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.thumb-box {
  display: flex;
  justify-content: space-between;
}
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.center-title {
  text-align: center;
}
</style>

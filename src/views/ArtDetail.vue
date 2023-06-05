<template>
  <div v-if="article">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell :title="article.aut_name" :label="article.pubdate | dateFormat">
        <template #icon>
          <img src="@/assets/logo.png" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button v-if="article.is_followed" type="info" size="mini" @click="setUnfollow">已关注</van-button>
            <van-button v-else icon="plus" type="info" size="mini" plain @click="setFollow">关注</van-button>
          </div>
        </template>
      </van-cell>

      <van-divider />

      <div class="art-content" v-html="article.content"></div>

      <van-divider>End</van-divider>

      <div class="like-box">
        <van-button v-if="article.attitude" icon="good-job" type="danger" size="small" @click="setDisLike">已点赞</van-button>
        <van-button v-else icon="good-job-o" type="danger" plain size="small" @click="setLike">点赞</van-button>
      </div>
    </div>

    <art-cmt :art-id="id"></art-cmt>
  </div>
</template>

<script>
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI.js'
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'
export default {
  name: 'ArtDetail',
  components: {
    ArtCmt
  },
  props: ['id'],
  data() {
    return {
      article: null
    }
  },
  watch: {
    id() {
      this.article = null
      this.initArticle()
    }
  },
  created() {
    this.initArticle()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  },
  methods: {
    async initArticle() {
      const { data: res } = await getArticleDetailAPI(this.id)
      this.article = res.documents[0]
    },

    async setFollow() {
      await followUserAPI(this.article.aut_id)
      this.$toast.success('关注成功')
      this.article.is_followed = true
    },

    async setUnfollow() {
      await unfollowUserAPI(this.article.aut_id)
      this.$toast.success('取关成功')
      this.article.is_followed = false
    },

    async setLike() {
      await addLikeAPI(this.article.art_id)
      this.$toast.success('点赞成功')
      this.article.attitude = true
    },

    async setDisLike() {
      await delLikeAPI(this.article.art_id)
      this.$toast.success('取消点赞成功')
      this.article.attitude = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
  margin-top: 46px;

  .art-title {
    font-size: 16px;
    margin: 10px 0;
  }

  .van-cell {
    padding: 5px 0;
    &::after {
      display: none;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #f8f8f8;
      margin-right: 5px;
      border: none;
    }
  }

  .art-content {
    font-size: 12px;
    line-height: 24px;
    width: 100%;
    overflow-x: scroll;
    word-break: break-all;
  }

  .like-box {
    display: flex;
    justify-content: center;
  }
}
</style>

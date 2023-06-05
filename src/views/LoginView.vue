<template>
  <div class="login-container">
    <van-nav-bar left-arrow title="黑马头条 - 登录" fixed @click-left="$router.push('/')"></van-nav-bar>
    <van-form @submit="login">
      <van-field v-model="form.mobile" label="手机号" maxlength="11" type="tel" name="mobile" placeholder="请输入手机号" :rules="rules.mobile" />
      <!-- 通过 validator 进行函数校验 -->
      <van-field v-model="form.code" label="密码" type="password" name="code" placeholder="请输入密码" :rules="rules.code" />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/userAPI.js'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        mobile: '13633987732',
        code: '12345678'
      },
      rules: {
        mobile: [
          { required: true, message: '请输入您的手机号', trigger: 'onBlur' },
          { pattern: /1\d{10}/, message: '请输入正确的手机号', trigger: 'onBlur' }
        ],
        code: [{ required: true, message: '请输入您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['updateTokenInfo']),
    async login() {
      const { data: res } = await loginAPI()
      this.updateTokenInfo(res.document)
      const toPath = this.$route.query.pre || '/'
      this.$router.replace(toPath)
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  padding-top: 46px;
}
</style>

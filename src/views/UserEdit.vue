<template>
  <div class="user-edit-container">
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()"></van-nav-bar>

    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfile.photo" @click="$refs.fileRef.click()" />
          <input v-show="false" ref="fileRef" type="file" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click="onNameCellClick" />
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="onBirthCellClick" />
    </van-cell-group>

    <!-- 名称dialog -->
    <van-dialog v-model="showNameDialog" title="修改名称" show-cancel-button :before-close="beforeClose">
      <van-field v-model.trim="name" ref="nameRef" placeholder="请输入用户名" input-align="center" maxlength="7" />
    </van-dialog>

    <van-dialog v-model="showBirthdSheet" :showConfirmButton="false">
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate" @cancel="showBirthdSheet = false" @confirm="updateBirthday" />
    </van-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { updateUserProfileAPI, updateAvatarAPI } from '@/api/userAPI.js'
import dayjs from 'dayjs'
export default {
  name: 'UserEdit',
  data() {
    return {
      showNameDialog: false,
      name: '',
      showBirthdSheet: false,
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date()
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  created() {
    this.initUserProfile()
  },
  methods: {
    ...mapActions(['initUserProfile']),
    onNameCellClick() {
      this.name = this.userProfile.name
      this.showNameDialog = true
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    beforeClose(action, done) {
      // action 的值为cancel或confirm
      // done为dialog的关闭函数,done(false)阻止dialog关闭
      if (action === 'cancel') return done()
      if (this.name === '' || this.name.length > 7) {
        this.$notify({ type: 'warning', message: '名称的长度为1到7个字符', duration: 2000 })
        this.$refs.nameRef.focus()
        return done(false)
      }
      this.updateName(done)
    },
    async updateName(done) {
      await updateUserProfileAPI({ name: this.name })
      done()
      this.initUserProfile()
      this.$notify({ type: 'success', message: '修改用户名成功', duration: 2000 })
    },
    onBirthCellClick() {
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      this.showBirthdSheet = true
    },
    async updateBirthday(value) {
      this.showBirthdSheet = false
      const dateStr = dayjs(value).format('YYYY-MM-DD')
      await updateUserProfileAPI({ birthday: dateStr })
      this.initUserProfile()
      this.$notify({ type: 'success', message: '修改生日成功', duration: 1000 })
    },
    async onFileChange(e) {
      const files = e.currentTarget.files
      if (files.length === 0) return
      const fd = new FormData()
      fd.append('photo', files[0])
      console.log(FormData)
      await updateAvatarAPI(fd)
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
}
</style>

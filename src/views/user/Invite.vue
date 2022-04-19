<template>
  <div class="main-content">
    <a-spin :spinning="checkLoading">
      <div v-if="!invalid && !checkLoading">
        <div class="title">
          You have been invited to join <span>{{ schoolName }}</span> community
        </div>
        <a-button type="primary" block :loading="loading" size="large" @click="handleBtn">{{ btnText }}</a-button>
      </div>
      <div v-if="invalid" class="title">The invite code is invalid</div>
    </a-spin>
  </div>
</template>

<script>
import { checkInvite, acceptInvite } from '@/api/schoolUser'
import store from '@/store'

export default {
  name: 'Invite',
  components: { },
  data() {
    return {
      inviteCode: '',
      schoolName: '',
      loading: false,
      checkLoading: false,
      btnText: '',
      invalid: false,
      roleMap: {
        2: 'teacher',
        4: 'student'
      }
    }
  },
  created () {
    const paramSearch = new URLSearchParams(window.location.search)
    const inviteCode = paramSearch.get('inviteCode')
    this.inviteCode = inviteCode
    this.checkInviteCode()
  },
  methods: {
    async checkInviteCode() {
      this.checkLoading = true
      const res = await checkInvite({
        inviteCode: this.inviteCode
      })
      this.checkLoading = false
      if (res.success) {
        if (!res?.result?.valid) {
          this.invalid = true
        } else if (this.roleMap[res?.result?.role] !== store.getters.currentRole) {
          this.invalid = true
        } else {
          this.schoolName = res?.result?.schoolName
          this.btnText = res?.result?.approveFlag ? 'Apply' : 'Join'
        }
      }
    },
    async handleBtn() {
      this.loading = true
      const res = await acceptInvite({
        inviteCode: this.inviteCode,
        username: store.getters.userInfo.username
      })
      if (res.success) {
        this.$message.success(res.message)
        this.$store.dispatch('GetInfo').then(() => {
          this.$router.push(this.$store.getters.defaultRouter)
        })
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
@import '~@/components/index.less';
.main-content {
  text-align: center;
  .title {
    margin-bottom: 10px;
    font-size: 18px;
    color: #000;
    font-family: FZCuYuan-M03S;
    font-weight: 800;
    text-align: center;
  }
  button {
    width: 200px;
    border-radius: 8px;
    margin-top: 50px;
  }
}
</style>

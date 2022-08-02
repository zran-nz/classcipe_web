<template>
  <div class="main-content">
    <a-spin :spinning="checkLoading">
      <div v-if="!invalid && !checkLoading">
        <div class="title">
          You have been invited to join <span>{{ schoolName }}</span> community
        </div>
        <a-button type="primary" block :loading="loading" size="large" @click="handleBtn">{{ btnText }}</a-button>
      </div>
      <div v-if="invalid" class="title">
        <img src="~@/assets/icons/invite/invalidLink.png" class="no-result" alt="" />
      </div>
    </a-spin>
  </div>
</template>

<script>
import { checkInvite } from '@/api/schoolUser'
import { acceptInvite } from '@/api/v2/schoolUser'
import { SwitchUserModeSchool } from '@/api/user'
import { TOOGLE_USER_MODE } from '@/store/mutation-types'
import { USER_MODE } from '@/const/common'

import { mapActions, mapMutations, mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'Invite',
  components: { },
  data() {
    return {
      inviteCode: '',
      schoolName: '',
      schoolId: '',
      loading: false,
      checkLoading: false,
      btnText: '',
      invalid: false,
      isAdmin: false,
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
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    })
  },
  methods: {
    ...mapMutations([TOOGLE_USER_MODE, 'SET_CURRENT_SCHOOL']),
    ...mapActions(['GetClassList']),
    async checkInviteCode() {
      this.checkLoading = true
      const res = await checkInvite({
        inviteCode: this.inviteCode
      })
      if (res.success) {
        if (!res?.result?.valid) {
          this.invalid = true
        } else if (this.roleMap[res?.result?.role] !== store.getters.currentRole) {
          this.invalid = true
        } else {
          this.isAdmin = res?.result?.isSchoolAdmin
          this.schoolId = res?.result?.schoolId
          this.schoolName = res?.result?.schoolName
          this.btnText = res?.result?.approveFlag ? 'Apply' : 'Join'
          // 判断用户是否已经邀请了
          const existSchools = this.info.schoolList.find(item => item.id === res?.result?.schoolId)
          if (existSchools) {
            if (this.isAdmin) {
              if (existSchools.roleNames.map(item => item.toLowerCase()).includes('admin')) {
                this.doRedirect()
              }
            } else {
              this.doRedirect()
            }
          }
        }
      }
      this.checkLoading = false
    },
    async handleBtn() {
      this.loading = true
      const res = await acceptInvite({
        inviteCode: this.inviteCode,
        email: store.getters.userInfo.email
      })
      if (res.success && res.code === 0) {
        this.$message.success(res.message)
        this.$store.dispatch('GetInfo').then(() => {
          this.doRedirect()
        })
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    },
    doRedirect() {
      // 如果邀请为管理，则直接跳转到学校的的info界面
      if (this.isAdmin) {
        SwitchUserModeSchool({
          isPersonal: false,
          schoolId: this.schoolId
        }).then(res => {
          // 获取对应学校班级
          this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
          this.GetClassList(this.userMode)
          this.$store.dispatch('GetInfo').then(() => {
            this.$router.push('/manage/school-info')
          })
        })
      } else {
        this.$router.push(this.$store.getters.defaultRouter)
      }
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
.no-result {
  height: 500px;
}
</style>

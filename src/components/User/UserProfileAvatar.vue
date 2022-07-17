<template>
  <div class='user-profile-avatar'>
    <div class='notification' @click='handleToNotification'>
      <a-badge :count="msg1Count" >
        <a-icon type="mail" :style="{ fontSize: '20px', color: '#999' }" />
      </a-badge>
    </div>
    <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
      <a-avatar :src='$store.getters.userInfo.avatar' />
      <div class='profile-info' slot="overlay">
        <div class='base-info'>
          <div class='avatar'>
            <a-avatar :src='$store.getters.userInfo.avatar' />
          </div>
          <div class='base'>
            <div class='name'>{{ $store.getters.userInfo.firstname }} {{ $store.getters.userInfo.lastname }}</div>
            <div class='email'>{{ $store.getters.userInfo.email }}</div>
          </div>
        </div>
        <div class='storage-info'>
          <a-progress :percent="storageProgress" class='cc-storage-progress' :show-info='false'/>
          <div class='storage-info-text'>
            {{ consumedSize | sizeFormat }} of {{ totalSize | sizeFormat }}
          </div>
        </div>
        <div class='plan-upgrade'>
          <a-space>
            <div class='free-plan' v-if="info.planInfo">{{ info.planInfo.planName }}</div>
            <div class='free-plan' v-else>Free plan</div>
            <div class='upgrade'>Upgrade storage</div>
          </a-space>
          <div class='plan-end' v-if='info.planInfo.planUser && info.planInfo.planUser.planEndTime && !info.planInfo.freeUsePlan'>
            Ends on {{ info.planInfo.planUser.planEndTime }}
          </div>
          <div class='plan-end' v-if='info.planInfo.freeUsePlan'>
            trial
          </div>
        </div>
        <a-divider class='cc-small-divider' />
        <div class='class-info'>
          <div class='class-list'>
            <div class='class-item' @click='handleChangePersonal'>
              <div class='class-avatar'>
                <a-avatar :src='$store.getters.userInfo.avatar' />
              </div>
              <div class='class-base-info'>
                <div class='class-name'>Personal</div>
                <div class='class-updated-by'>{{ $store.getters.userInfo.email }}</div>
                <div class='active-dot' v-if='userMode === USER_MODE.SELF'></div>
              </div>
            </div>
            <div class='class-item' v-for='schoolItem in info.schoolList' :key='schoolItem.id' @click='handleChangeSchool(schoolItem)'>
              <div class='class-avatar'>
                <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
                  {{ schoolItem.schoolName ? schoolItem.schoolName[0].toUpperCase() : 'C' }}
                </a-avatar>
              </div>
              <div class='class-base-info'>
                <div class='class-name'>{{ schoolItem.schoolName }}</div>
                <div class='class-updated-by'>
                  <div class='role-name' v-for='roleName in schoolItem.roleNames' :key='roleName'>{{ roleName }}</div>
                </div>
                <div class='active-dot' v-if='userMode === USER_MODE.SCHOOL && currentSchool.schoolName === schoolItem.schoolName'></div>
              </div>
            </div>
          </div>
        </div>
        <a-divider class='cc-small-divider' />
        <!-- <div class='profile profile-menu-item' @click='handleToSettings'>
          Profile
        </div> -->
        <div class='account profile-menu-item' @click='handleToAccounts'>
          <template v-if='userMode === USER_MODE.SCHOOL'>
            School account
          </template>
          <template v-else>
            Account
          </template>
        </div>
        <div class='logout profile-menu-item' @click='handleLogout'>
          Logout
        </div>
      </div>
    </a-dropdown>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { Modal } from 'ant-design-vue'
import { SwitchUserModeSchool } from '@/api/user'
import { TOOGLE_USER_MODE } from '@/store/mutation-types'
import { USER_MODE } from '@/const/common'
import { SchoolUserRole } from '@/const/role'
import { ListCementByUser } from '@/api/notice'

export default {
  name: 'UserProfileAvatar',
  data() {
    return {
      // consumedSize: 102400000,
      // totalSize: 1024 * 1024 * 1024,
      unit: 1024 * 1024 * 1024,
      schoolUserRole: SchoolUserRole,
      USER_MODE: USER_MODE,

      msg1Count: '0',
      msg2Count: '0',
      stopTimer: false
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    msgTotal () {
      return parseInt(this.msg1Count) + parseInt(this.msg2Count)
    },
    consumedSize() {
     return this.userMode === USER_MODE.SELF ? this.info.usedSpace * 1024 : this.currentSchool.usedSpace * 1024
    },
    totalSize() {
      return this.info.planInfo ? this.info.planInfo.storageSpace * this.unit : this.unit
    },
    storageProgress () {
      return Math.round(this.consumedSize / this.totalSize * 100)
    }
  },
  created() {
    this.initData()
  },
  methods: {
    ...mapMutations([TOOGLE_USER_MODE, 'SET_CURRENT_SCHOOL']),
    ...mapActions(['GetClassList']),

    timerFun () {
      this.stopTimer = false
      const myTimer = setInterval(() => {
        // 停止定时器
        if (this.stopTimer) {
          clearInterval(myTimer)
          return
        }
        this.loadData()
      }, 6000)
    },
    initData() {
      ListCementByUser().then((res) => {
        if (res.success) {
          this.announcement1 = res.result.anntMsgList
          this.msg1Count = res.result.anntMsgTotal
          this.$store.commit('SET_UNREAD_COUNT', this.msg1Count ? this.msg1Count : 0)
          this.$store.commit('SET_SHARED_COUNT', res.result.collaborate ? res.result.collaborate : 0)
        }
      }).catch(error => {
        this.$logger.error('系统消息通知异常', error)
        this.stopTimer = true
        this.$logger.error('清理timer')
      })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleToAccounts () {
      this.$router.push({ path: '/account/info' })
    },
    handleToNotification () {
      this.$router.push({ path: '/notification' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    },

    handleChangePersonal() {
      // 后端记录当前用户是否是个人模式，在个人模式下后台设置school未空字符
      SwitchUserModeSchool({
        isPersonal: true,
        schoolId: ''
      }).finally(() => {
        this[TOOGLE_USER_MODE](USER_MODE.SELF)
        // this.SET_CURRENT_SCHOOL(null)
        this.GetClassList(this.userMode)
        this.$store.dispatch('GetInfo')
      })
    },
    handleChangeSchool(val) {
      SwitchUserModeSchool({
        isPersonal: false,
        schoolId: val.id
      }).then(res => {
        // 获取对应学校班级
        this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
        // const item = this.info.schoolList.find(item => item.id === val.id)
        // this.SET_CURRENT_SCHOOL(item)
        this.GetClassList(this.userMode)
        this.$store.dispatch('GetInfo')
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.user-profile-avatar {
  background-color: #fff;
  padding: 0 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .notification {
    margin-left: 5px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .profile-info {
    padding: 10px 15px;
    background-color: #fff;
    width: 240px;
    border: 2px solid #EFF1F4;
    box-shadow: 0px 3px 9px 1px rgba(37, 37, 37, 0.06);
    border-radius: 3px;

    .base-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .avatar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      .base {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding-left: 10px;

        .name {
          font-size: 14px;
          font-family: Arial;
          font-weight: bold;
          color: #3D3F44;
          line-height: 22px;
          user-select: none;
          cursor: pointer;
        }

        .email {
          user-select: none;
          font-size: 13px;
          font-family: Arial;
          color: #aaa;
          line-height: 14px;
          cursor: pointer;
        }
      }
    }

    .storage-info {
      padding: 5px 0;

      .storage-info-text {
        cursor: pointer;
        font-family: Arial;
        color: #17181A;
        line-height: 25px;
        font-weight: bold;
        font-size: 12px;
      }
    }

    .plan-upgrade {
      .free-plan {
        cursor: pointer;
        font-size: 13px;
        font-family: Arial;
        font-weight: bold;
        color: #153C76;
        line-height: 15px;
      }

      .plan-end {
        cursor: pointer;
        font-size: 12px;
        padding-top: 5px;
        line-height: 15px;
        color: #999;
      }

      .upgrade {
        cursor: pointer;
        padding: 5px 8px;
        border-radius: 20px;
        color: #fff;
        background-color: #000;
        font-size: 12px;
        font-family: Arial;
        line-height: 13px;
      }
    }

    .class-info {
      max-height: 200px;
      overflow-y: auto;
      .class-item {
        padding: 8px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .class-base-info {
          position: relative;
          width: 100%;
          padding-left: 10px;
          .class-name {
            font-size: 14px;
            font-family: Arial;
            color: #3D3F44;
            line-height: 22px;
            user-select: none;
            cursor: pointer;
          }

          .class-updated-by {
            user-select: none;
            font-size: 12px;
            font-family: Arial;
            color: #aaa;
            line-height: 14px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .role-name {
              margin-right: 5px;
            }
          }

          .active-dot {
            position: absolute;
            right: 1px;
            top: 50%;
            margin-top: -3px;
            width: 6px;
            height: 6px;
            border-radius: 6px;
            border: 3px solid #15c39a;
          }
        }
      }
    }

    .profile-menu-item {
      padding-left: 5px;
      cursor: pointer;
      user-select: none;
      line-height: 35px;
      font-weight: bold;
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      color: #1B1C20;
      border-radius: 8px;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>

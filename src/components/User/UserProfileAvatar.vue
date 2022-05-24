<template>
  <div class='user-profile-avatar'>
    <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
      <a-avatar :src='$store.getters.userInfo.avatar' />
      <div class='profile-info' slot="overlay">
        <div class='base-info'>
          <div class='avatar'>
            <a-avatar :src='$store.getters.userInfo.avatar' />
          </div>
          <div class='base'>
            <div class='name'>{{ $store.getters.userInfo.nickname }}</div>
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
            <div class='free-plan'>Free plan</div>
            <div class='upgrade'>Upgrade</div>
          </a-space>
        </div>
        <a-divider class='cc-small-divider' />
        <div class='class-info'>
          <div class='class-list'>
            <div class='class-item' v-for='classItem in classList' :key='classItem.id'>
              <div class='class-avatar'>
                <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
                  {{ classItem.name ? classItem.name[0] : 'C' }}
                </a-avatar>
              </div>
              <div class='class-base-info'>
                <div class='class-name'>{{ classItem.name }}</div>
                <div class='class-updated-by'>{{ classItem.headTeacherName || classItem.updateBy }}</div>
              </div>
            </div>
          </div>
        </div>
        <a-divider class='cc-small-divider' />
        <div class='profile profile-menu-item' @click='handleToSettings'>
          Profile
        </div>
        <div class='account profile-menu-item' @click='handleToSettings'>
          Account
        </div>
        <div class='logout profile-menu-item' @click='handleLogout'>
          Logout
        </div>
      </div>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Modal } from 'ant-design-vue'

export default {
  name: 'UserProfileAvatar',
  data() {
    return {
      consumedSize: 102400,
      totalSize: 1024000
    }
  },
  computed: {
    ...mapState({
      classList: state => state.user.classList
    }),

    storageProgress () {
      return Math.round(this.consumedSize / this.totalSize * 100)
    }
  },
  created() {
  },
  methods: {
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.user-profile-avatar {
  background-color: #fff;

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
      max-height: 150px;
      overflow-y: scroll;
      .class-item {
        padding: 8px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .class-base-info {
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

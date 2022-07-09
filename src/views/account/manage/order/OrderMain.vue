<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="school-name">{{ head }}</div>
        <s-menu
          :mainRouter="mainRouter"
          :fromRole="''"
          :currentRouterName="currentRouterName"
          :initSelected="selectedKey"
          :hiddenRoute="hiddenRoute"
          className="cc-menu"
          iconTheme="outlined"
        >

          <!-- <a-menu-item key="/teacher/managing/school-user">
            <a-icon type="user" />
            <span>School User</span>
          </a-menu-item>
          <a-menu-item key="/teacher/managing/class">
            <a-icon type="desktop" />
            <span>Classes</span>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title"><a-icon type="schedule" /><span>Academics</span></span>
            --            <a-menu-item key="/teacher/managing/term"> Academics Terms </a-menu-item>--
            <a-menu-item key="/teacher/managing/planning-format">  Planning format </a-menu-item>
            <a-menu-item key="/teacher/managing/tag-settings">  Tags </a-menu-item>
            <a-menu-item key="/teacher/managing/skill" v-if="$store.getters.bindCurriculum == curriculumType.IBMYP">
              <a-tooltip title="Upload achievement objectives">Upload achievement objectives</a-tooltip>
            </a-menu-item>
          </a-sub-menu> -->
        </s-menu>
      </a-layout-sider>
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { CurriculumType, USER_MODE } from '@/const/common'
import SMenu from '@/components/SideBar/SMenu'

import { mapState } from 'vuex'

export default {
  name: 'Main',
  components: {
    SMenu,
    PageHeaderWrapper
  },
  data() {
    return {
      selectedKey: '/manage/order/buy',
      currentRouterName: 'manage',
      mainRouter: 'Order',
      curriculumType: CurriculumType
    }
  },
  computed: {
    ...mapState({
      bindCurriculum: state => state.user.bindCurriculum,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    head() {
      if (this.userMode === USER_MODE.SELF) {
        return 'Personal managing'
      } else {
        return this.currentSchool.schoolName + ' managing'
      }
    }
  },
  mounted() {},
  methods: {
    handleMenuSelect({ key }) {
      this.$router.push({ path: key })
    },
    hiddenRoute(route) {
      if (route.meta.curriculumType && route.meta.curriculumType + '' !== this.bindCurriculum) {
        return true
      }
      if (route.meta.mode && route.meta.mode !== this.userMode) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="css">
.nav-bar-left .ant-badge-count {
  right: 5px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  border-radius: 10px;
}
</style>

<style lang="less" scoped>
@black: #000;
@primary-color: #15c39a;
@text-color-secondary: fade(@black, 45%);
.ant-layout-sider {
  background: #fff;
  min-height: 400px;
}

.ant-layout-content {
  background: #fff;
  padding: 0 15px;
  min-height: 400px;
  box-sizing: border-box;
}

.nav-bar-left {
  height: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding-right: 5px;
  .nav-bar-wrapper {
    .nav-bar-item {
      font-family: Inter-Bold;
      font-size: 14px;
      cursor: pointer;
      background-image: url('~@/assets/icons/myContent/Rectangle@2x.png');
      background-repeat: repeat;
      background-size: cover;

      .memu-icon {
        width: 30px;
        height: 30px;
        margin: 0px 10px;
      }

      a {
        display: flex;
        align-items: center;
        width: 100%;
        line-height: 30px;
        padding: 10px 20px;
        color: #000000;

        i {
          width: 50px;
          font-size: 20px;
        }
      }

      &:hover {
        background: #edf1f5;
        a {
          color: @primary-color;
        }
      }
    }

    .nav-bar-item-split {
      margin-bottom: 20px;
    }

    .selected-nav-bar {
      background: #edf1f5;
      a {
        color: @primary-color;
        font-weight: bold;
      }
    }
  }
}
.school-name{
  color: rgba(0,0,0,.85);
  font-size: 16px;
  margin: 5px;
  line-height: 25px;
  font-weight: 500;
}
</style>

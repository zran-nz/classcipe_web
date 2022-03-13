<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <a-menu
          :default-selected-keys="[selectedKey]"
          @select="handleMenuSelect"
          mode="inline"
          :inline-collapsed="false"
        >
          <a-menu-item key="/teacher/managing/school-user">
            <a-icon type="user" />
            <span>School User</span>
          </a-menu-item>
          <a-menu-item key="/teacher/managing/class">
            <a-icon type="desktop" />
            <span>Classes</span>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title"><a-icon type="schedule" /><span>Academics</span></span>
            <!--            <a-menu-item key="/teacher/managing/term"> Academics Terms </a-menu-item>-->
            <a-menu-item key="/teacher/managing/planning-format">  Planning format </a-menu-item>
            <a-menu-item key="/teacher/managing/tag-settings">  Tags </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/teacher/managing" v-if="$store.getters.bindCurriculum === curriculumType.IBMYP">
            <a-icon type="cloud-upload" />
            <span>IB skills</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import * as logger from '@/utils/logger'
import CreatedByMeSvg from '@/assets/svgIcon/myContent/Created_by_me.svg?inline'
import DiscoverSvg from '@/assets/svgIcon/myContent/Discover.svg?inline'
import MyFavoriteSvg from '@/assets/svgIcon/myContent/My_favorite.svg?inline'
import PopularSvg from '@/assets/svgIcon/myContent/Popular.svg?inline'
import SharedSvg from '@/assets/svgIcon/myContent/Shared.svg?inline'
import SubscribesSvg from '@/assets/svgIcon/myContent/Subscribes.svg?inline'
import { CurriculumType } from '@/const/common'

export default {
  name: 'Main',
  components: {
    PageHeaderWrapper,
    CreatedByMeSvg,
    DiscoverSvg,
    MyFavoriteSvg,
    PopularSvg,
    SharedSvg,
    SubscribesSvg
  },
  data() {
    return {
      selectedKey: '/teacher/managing/skill',
      curriculumType: CurriculumType
    }
  },
  watch: {
    '$route.path'(to) {
      logger.debug('My Content route.path change ' + to)
      this.selectedKey = to
    }
  },
  computed: {},
  created() {
    this.selectedKey = this.$route.path
    logger.info('selectedKey ', this.selectedKey)
  },
  mounted() {},
  methods: {
    handleMenuSelect({ key }) {
      this.$router.push({ path: key })
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
</style>

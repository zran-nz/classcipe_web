<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="nav-bar-left">
          <div class='quick-action'>
            <a-row :gutter="10">
              <a-col span='12'>
                <div class='quick-action-item' @click='handleViewQuickSession'>
                  <div class='action-icon'>
                    <quick-session-svg />
                  </div>
                  <div class='action-title'>
                    Quick session
                  </div>
                </div>
              </a-col>
              <a-col span='12'>
                <div class='quick-action-item' @click='handleOpenGoogleSlide'>
                  <div class='action-icon'>
                    <google-slide-svg />
                  </div>
                  <div class='action-title'>
                    Google slide
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
          <div class="nav-bar-wrapper">
            <div :class="{ 'nav-bar-item': true, 'selected-nav-bar': selectedKey === '/teacher/main/created-by-me' }">
              <router-link to="/teacher/main/created-by-me">
                <created-by-me-svg />
                {{ $t('teacher.main.created-by-me') }}
              </router-link>
            </div>
            <div
              :class="{
                'nav-bar-item': true,
                'selected-nav-bar': true,
                'selected-nav-bar': selectedKey === '/teacher/main/shared',
              }"
            >
              <router-link to="/teacher/main/shared">
                <!--                <a-badge :count="$store.getters.sharedCount">-->
                <shared-svg />
                <!--                </a-badge>-->
                {{ $t('teacher.main.shared') }}
              </router-link>
            </div>
            <div
              :class="{
                'nav-bar-item': true,
                'nav-bar-item-split': true,
                'selected-nav-bar': selectedKey === '/teacher/main/my-favorite',
              }"
            >
              <router-link to="/teacher/main/my-favorite">
                <my-favorite-svg />
                {{ $t('teacher.main.my-favorite') }}
              </router-link>
            </div>
            <!--            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/teacher/main/discover'}">-->
            <!--              <router-link to="/teacher/main/discover">-->
            <!--                <a-badge :count="$store.getters.sharedFindCount">-->
            <!--                  <discover-svg />-->
            <!--                </a-badge>-->
            <!--                {{ $t('teacher.main.discover') }}-->
            <!--              </router-link>-->
            <!--            </div>-->
            <!--            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/teacher/main/subscribes'}">-->
            <!--              <router-link to="/teacher/main/subscribes">-->
            <!--                <subscribes-svg />-->
            <!--                {{ $t('teacher.main.subscribes') }}-->
            <!--              </router-link>-->
            <!--            </div>-->
            <!--            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/teacher/main/popular'}">-->
            <!--              <router-link to="/teacher/main/popular">-->
            <!--                <popular-svg />-->
            <!--                {{ $t('teacher.main.popular') }}-->
            <!--              </router-link>-->
            <!--            </div>-->
          </div>
        </div>
      </a-layout-sider>
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
    <AddPreference />
    <quick-session @close='hiddenQuickSession' :visible.sync='quickSessionVisible' v-if='quickSessionVisible'/>
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
import AddPreference from '@/components/Teacher/AddPreference'
import QuickSessionSvg from '@/assets/icons/quickSession/Quick session.svg?inline'
import GoogleSlideSvg from '@/assets/icons/quickSession/Google slide.svg?inline'
import QuickSession from '@/components/QuickSession/QuickSession'

export default {
  name: 'Main',
  components: {
    QuickSession,
    PageHeaderWrapper,
    CreatedByMeSvg,
    DiscoverSvg,
    MyFavoriteSvg,
    PopularSvg,
    SharedSvg,
    SubscribesSvg,
    AddPreference,
    QuickSessionSvg,
    GoogleSlideSvg
  },
  data() {
    return {
      selectedKey: '/teacher/main/created-by-me',
      quickSessionVisible: false
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
    handleViewQuickSession () {
      this.quickSessionVisible = true
    },

    hiddenQuickSession () {
      this.quickSessionVisible = false
    },

    handleOpenGoogleSlide () {
      window.open('https://docs.google.com/presentation', '_blank')
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

.main-content {
  min-width: 1050px;
}

.nav-bar-left {
  height: 100%;
  box-sizing: border-box;
  padding-right: 5px;
  .nav-bar-wrapper {
    .nav-bar-item {
      font-family: Inter-Bold;
      font-size: 14px;
      cursor: pointer;
      background-image: url('~@/assets/icons/myContent/Rectangle@2x.png');
      background-repeat: repeat;
      background-size: cover;

      a {
        display: flex;
        align-items: center;
        width: 100%;
        line-height: 30px;
        padding: 10px 20px;
        color: #000000;

        svg {
          width: 50px;
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

.quick-action {
  margin-bottom: 15px;
  .quick-action-item {
    user-select: none;
    padding: 8px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #FBFBFBFF;
    border: 1px solid #DBDBDBFF;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      background: #15C39A1A;
      border: 1px solid #15C39AFF;
    }

    &:active {
      box-shadow: 0 0 3px 3px #15C39A1A;
    }

    .action-icon {
      svg {
        width: 26px;
        height: 26px;
      }
    }

    .action-title {
      line-height: 12px;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>

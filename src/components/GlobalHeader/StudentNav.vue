<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
          <a-menu-item key="/student/library-v2" v-show="studyMode === 'selfStudy'">
            <router-link to="/student/library-v2">
              <div class="nav-item">
                <div class="nav-icon">
                  <library-icon-svg />
                </div>
                <div class="nav-label">
                  {{ $t('menu.library') }}
                </div>
                <div class="nav-button-border"></div>
              </div>
            </router-link>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <a-select :value="studyMode" class="study-mode" @change="handleChange">
        <a-select-option value="selfStudy">
          Self-study
        </a-select-option>
        <!-- <a-select-option value="schoolStudy">
          School-study
        </a-select-option> -->
      </a-select>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import LibraryIconSvg from '@/assets/icons/header/Librar_icony.svg?inline'
import EditIconSvg from '@/assets/icons/header/bianji.svg?inline'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'
import ManageIconSvg from '@/assets/icons/header/Managing_icon.svg?inline'
import { TOOGLE_STUDY_MODE } from '@/store/mutation-types'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StudentNav',
  components: {
    LibraryIconSvg,
    EditIconSvg,
    ManageIconSvg,
    SousuoIconSvg
  },
  data () {
    return {
      defaultSelectedKeys: [],
      selectedKeys: []
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('nav watch route path change ' + to)
      this.selectedKeys = [to]
      // 如果是学校模式，当前路由如果是library，则跳出到mytask
      if (this.studyMode === 'schoolStudy' && to === '/student/library-v2') {
        this.$router.push({ path: '/student/main/my-task' })
      }
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  computed: {
    ...mapState({
      studyMode: state => state.app.studyMode
    })
  },
  methods: {
    ...mapMutations([TOOGLE_STUDY_MODE]),
    handleChange(val) {
      this[TOOGLE_STUDY_MODE](val)
      // 如果是学校模式，当前路由如果是library，则跳出到mytask
      if (val === 'schoolStudy' && this.$route.name === 'StudentLibraryV2') {
        this.$router.push({ path: '/student/main/my-task' })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.nav-right {
  align-items: center;
}

.study-mode {
  /deep/ .ant-select-selection {
    background: transparent;
    color: #fff;
  }
  /deep/ .ant-select-arrow {
    color: #fff;
  }
}

.my-nav-search {
  width: 150px;
}

.add-new {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.top-nav {
  ul, ol {
    margin-bottom: 0;
  }
}

a {
  color: #15C39A;
}

ant-dropdown {
  a:hover {
    background: #EDF1F5;
  }
}

.nav-button-border {
  display: none;
}

.nav-item {
  position: relative;
  .nav-icon {
    z-index: 50;
  }
  .nav-label {
    z-index: 50;
  }
}

.router-link-active {
  .nav-button-border {
    position: absolute;
    bottom: 0;
    width: 80%;
    height: 4px;
    border: 1px solid #15c39a;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: #15c39a;
    display: inline-block;
    z-index: 100;
  }
}
</style>

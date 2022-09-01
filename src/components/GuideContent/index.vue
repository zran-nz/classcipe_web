<template>
  <a-popover
    :getPopupContainer="trigger => trigger.parentElement"
    v-if="guideKey && guideData[$store.state.app.userMode][guideKey]"
    v-model="guideData[$store.state.app.userMode][guideKey].visible"
    :overlayStyle="{ width: '310px' }"
    trigger="manual">
    <div slot="title" @click.stop.prevent>
      {{ guideData[$store.state.app.userMode][guideKey].title }}
    </div>
    <div slot="content" @click.stop.prevent>
      <label>{{ guideData[$store.state.app.userMode][guideKey].content }}</label>
      <div class="guide-action" v-if="guideData[$store.state.app.userMode][guideKey].actions">
        <a-space>
          <a-button
            size="small"
            @click="item.fn"
            :type="item.type"
            v-for="item in guideData[$store.state.app.userMode][guideKey].actions"
            :key="item.title">
            {{ item.title }}
          </a-button>
        </a-space>
      </div>
    </div>
    <div :id="'guide_' + guideKey">
      <slot name="content"></slot>
    </div>
  </a-popover>
  <div v-else>
    <slot name="content"></slot>
  </div>
</template>

<script>
import GuideEvent from '@/components/GuideContent/GuideEvent'

import { scrollIntoViewById } from '@/utils/domUtil'
import { USER_MODE } from '@/const/common'
import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'GuideContent',
  props: {
    guideKey: {
      type: String,
      default: ''
    },
    // 从哪个guide开始，不同页面的起始不一样，默认guideData的第一个
    // 例如class页面，从addGrade开始判断
    beginKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cacheKey: 'GUIDE_',
      guideData: {
        [USER_MODE.SELF]: {
          'planningFormat': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Set the format of your Unit plan and Task here',
            actions: [{
              title: 'skip',
              type: 'link',
              fn: this.skipStep
            }, {
              title: 'next',
              type: 'primary',
              fn: this.nextStep
            }]
          },
          'tagsSetting': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Set the tag categories and customized tags which can be added to your Unit and Task later on',
            actions: [{
              title: 'skip',
              type: 'link',
              fn: this.skipStep
            }, {
              title: 'next',
              type: 'primary',
              fn: this.nextStep
            }]
          },
          'verification': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Get your teacher and service verification done to be listed as a qualified educator, so that your content will be recommended to other teachers as well as purchased by students',
            actions: [{
              title: 'finish',
              type: 'primary',
              fn: this.finishStep
            }]
          }
        },
        [USER_MODE.SCHOOL]: {
          'classSetting': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Set the standard class and subject class for your school here',
            actions: [{
              title: 'skip',
              type: 'primary',
              fn: this.skipStep
            }]
          },
          'addGrade': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Select the grades in which you would like to add Classes',
            actions: [{
              title: 'next',
              type: 'primary',
              fn: this.nextStep
            }]
          },
          'addStandardClass': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Add standard class under this grade',
            actions: [{
              title: 'finish',
              type: 'primary',
              fn: this.nextStep
            }]
          },
          'classStudentUpload': {
            visible: false,
            title: 'New to Classcipe?',
            content: 'Bulk upload students or add invididual student to this Class',
            actions: [{
              title: 'finish',
              type: 'primary',
              fn: this.finishStep
            }]
          }
        }
      },
      cachedGuide: {}
    }
  },
  created() {
    this.$EventBus.$on(GuideEvent.GUIDE_CACHE, this.initGuide)
  },
  beforeDestroy() {
    this.$EventBus.$off(GuideEvent.GUIDE_CACHE, this.initGuide)
  },
  methods: {
    initGuide(cached) {
      const userMode = this.$store.state.app.userMode
      this.cachedGuide[userMode] = cloneDeep(cached)
      this.showTip()
    },
    showTip() {
      let firstVisId = ''
      const userMode = this.$store.state.app.userMode
      const cachedData = this.cachedGuide[userMode]
      let doStart = false
      for (const key in cachedData) {
        if (!this.beginKey || key === this.beginKey) {
          doStart = true
        }
        if (doStart) {
          // 当前guidekey的下一个
          if (!firstVisId && !cachedData[key].visible) {
            firstVisId = key
            this.guideData[userMode][key].visible = true
          }
        }
      }
      if (firstVisId && firstVisId === this.guideKey) {
        this.$nextTick(() => {
          if (document.getElementById('guide_' + firstVisId)) {
            scrollIntoViewById('guide_' + firstVisId)
          }
        })
      }
    },
    skipStep() {
      const userMode = this.$store.state.app.userMode
      this.guideData[userMode][this.guideKey].visible = false
      this.$EventBus.$emit(GuideEvent.GUIDE_SKIP, this.guideKey)
    },
    nextStep() {
      const userMode = this.$store.state.app.userMode
      this.guideData[userMode][this.guideKey].visible = false
      this.$EventBus.$emit(GuideEvent.GUIDE_NEXT, this.guideKey)
    },
    finishStep() {
      const userMode = this.$store.state.app.userMode
      this.guideData[userMode][this.guideKey].visible = false
      this.$EventBus.$emit(GuideEvent.GUIDE_FINISH)
    }
  }
}
</script>

<style scoped lang="less">
.guide-action {
  text-align: right;
}
</style>

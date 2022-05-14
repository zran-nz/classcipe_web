<template>
  <div class='form-slide'>
    <div class='form-action-bar'>
      <div class='slide-switch'>
        <a-radio-group :default-value="displayModeType.SlideDrift" button-style="solid" class='cc-radio-group' v-model='displayMode' @change='handleSwitchDisplayMode'>
          <a-radio-button :value="displayModeType.SlideDrift">
            Slide draft
          </a-radio-button>
          <a-radio-button :value="displayModeType.SlideTemplate">
            Selected template
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class='go-to-google'>
        <custom-text-button label='Edit google slides'>
          <template v-slot:icon>
            <google-icon />
          </template>
        </custom-text-button>
      </div>
    </div>
    <div class='form-slide-content'>
      <div class='slide-wrapper'>
        <slide-viewer
          :show-arrow='true'
          :show-nav='true'
          :img-list='imageList'
          v-if='!loading'/>
        <a-skeleton v-if='loading'/>
      </div>
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import GoogleIcon from '@/assets/v2/icons/google_02.svg?inline'
import SlideViewer from '@/components/PPT/SlideViewer'
import { TemplatesGetPresentation } from '@/api/template'

const displayModeType = {
  SlideDrift: 'SlideDrift',
  SlideTemplate: 'SlideTemplate'
}

export default {
  name: 'FormSlide',
  components: {
    SlideViewer,
    CustomTextButton,
    GoogleIcon
  },
  props: {
    sourceId: {
      type: String,
      required: true
    },
    sourceType: {
      type: Number,
      required: true
    },
    needRefresh: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      displayMode: displayModeType.SlideDrift,
      displayModeType: displayModeType,

      loading: true,
      pptTitle: null,
      thumbnailList: null,
      imageList: null
    }
  },
  created() {
    this.loadSlideData()
  },
  methods: {
    loadSlideData() {
      this.loading = true
      TemplatesGetPresentation({
        taskId: this.sourceId,
        needRefresh: this.needRefresh
      }).then(response => {
        this.$logger.info('loadThumbnail response', response.result)
        if (response.code === 0) {
          const pageObjects = response.result.pageObjects
          this.pptTitle = response.result.title
          this.thumbnailList = []
          this.imageList = []
          pageObjects.forEach(page => {
            this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
            this.imageList.push(page.contentUrl)
          })
        } else if (response.code === this.ErrorCode.ppt_google_token_expires || response.code === this.ErrorCode.ppt_forbidden) {
          this.$logger.info('等待授权事件通知')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSwitchDisplayMode () {

    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.form-slide {
  padding: 0 15px;
}

.form-action-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.form-slide-content {
  margin: 20px 0;
}

.slide-wrapper {
  height: 400px;
}
</style>

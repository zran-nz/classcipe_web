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
        <custom-text-button
          label='Edit google slides'
          @click="handleEditGoogleSlide">
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
          :show-notes='true'
          :slide-id='slideId'
          v-bind="$attrs" />
      </div>
    </div>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import GoogleIcon from '@/assets/v2/icons/google_02.svg?inline'
import SlideViewer from '@/components/PPT/SlideViewer'

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
    slideId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      displayMode: displayModeType.SlideDrift,
      displayModeType: displayModeType
    }
  },
  created() {
  },
  methods: {
    handleSwitchDisplayMode () {
    },

    async handleEditGoogleSlide() {
      this.$emit('edit-google-slide')
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
}
</style>

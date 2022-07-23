<template>
  <div class='form-slide'>
    <div class='form-action-bar'>
      <div class='slide-switch'>
        <a-radio-group
          v-show='showDisplayModeSwitch'
          :default-value="displayMode"
          button-style="solid"
          class='cc-radio-group'
          v-model='displayMode'
          @change='handleSwitchDisplayMode'>
          <a-radio-button :value="displayModeType.SlideDrift">
            Slide draft
          </a-radio-button>
          <a-radio-button :value="displayModeType.SlideTemplate">
            Selected resource
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class='go-to-google'>
        <custom-text-button
          label='Edit google slides'
          :loading="editLoading"
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
          v-show='displayMode === displayModeType.SlideDrift'
          :show-arrow='true'
          :show-nav='true'
          :show-notes='true'
          :slide-id='slideId'
          v-bind="$attrs" />
        <slide-template
          v-show='displayMode === displayModeType.SlideTemplate'
          v-bind="$attrs"
        />
      </div>
    </div>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import GoogleIcon from '@/assets/v2/icons/google_02.svg?inline'
import SlideViewer from '@/components/PPT/SlideViewer'
import SlideTemplate from '@/components/PPT/SlideTemplate'

const displayModeType = {
  SlideDrift: 'SlideDrift',
  SlideTemplate: 'SlideTemplate'
}

export default {
  name: 'FormSlide',
  components: {
    SlideTemplate,
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
    },
    showSelected: {
      type: Boolean,
      default: false
    },
    showDisplayModeSwitch: {
      type: Boolean,
      default: true
    },
    editLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayMode: this.showSelected ? displayModeType.SlideTemplate : displayModeType.SlideDrift,
      displayModeType: displayModeType
    }
  },
  created() {
  },
  methods: {
    handleSwitchDisplayMode () {
      this.$emit('handle-change-selected', this.displayMode === displayModeType.SlideTemplate)
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

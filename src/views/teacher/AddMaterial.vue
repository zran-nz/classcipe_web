<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="material-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="material-last-change-time">
            <span class="material-nav-title">
              {{ material.name }}
            </span>
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="material-right-action">
        <a-space>
          <a-button @click="handleSaveMaterial"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="material-content">
      <a-col offset="5" span="14">
        <div class="uploader-wrapper">
          <div class="file-type"></div>
          <div class="uploader-container">
            <a-upload-dragger
              name="file"
              accept="image/png, image/jpeg"
              :showUploadList="false"
              :customRequest="handleUpload"
            >
              <template v-if="uploading">
                <div class="upload-container">
                  <p class="ant-upload-drag-icon">
                    <a-icon type="cloud-upload" />
                  </p>
                  <p class="ant-upload-text">
                    <a-spin />
                    <span class="uploading-tips">{{ $t('teacher.add-unit-plan.uploading') }}</span>
                  </p>
                </div>
              </template>
              <template v-if="!uploading && material && material.image">
                <div class="image-preview">
                  <img :src="material.image" alt="">
                </div>
              </template>
              <template v-if="!uploading && material && !material.image">
                <div class="upload-container">
                  <p class="ant-upload-drag-icon">
                    <a-icon type="picture" />
                  </p>
                  <p class="ant-upload-text">
                    {{ $t('teacher.add-unit-plan.click-to-upload') }}
                  </p>
                </div>
              </template>
            </a-upload-dragger>
          </div>
        </div>
        <div class="info-wrapper"></div>
        <div class="tag-wrapper"></div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'

export default {
  name: 'AddUnitPlan',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null
  },
  data () {
    return {
      material: {
        name: '',
        image: ''
      },
      uploading: false
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
  },
  mounted () {
  },
  methods: {
    handleSaveMaterial () {
      logger.info('handleSaveMaterial')
    },

    handleUpload () {
      logger.info('handleUpload')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.material-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid  rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }

  .material-nav-title {
    color: @text-color;
    font-weight: bold;
  }

  .material-last-change-time {
    line-height: 32px;
    color: @text-color-secondary;
  }

  .material-right-action {
    display: flex;
    justify-content: flex-end;
  }
}

.material-content {
  padding-top: 24px;

  .uploader-container {
    height: 300px;
  }
}
</style>

<template>
  <div class="task-tip">
    <template v-if="taskLoading">
      <div class="loading-task">
        <img src="~@/assets/newBrowser/loading.gif" />
      </div>
    </template>
    <template v-if="!taskLoading">
      <div class="tip-content">
        <a-textarea
          placeholder="Insert tip for the slide"
          :autosize="{ minRows: 10, maxRows: 15 }"
          allow-clear
          v-model="tip_text"
        />
        <a-col class="material-row">
          <a-space>
            <a-tooltip title="Record Video" placement="top">
              <div class="upload-type-item">
                <div class="remark-button-outer">
                  <img src="~@/assets/icons/addMaterial/video.png" class="remark-button" alt="" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip title="my computer" placement="top">
              <div class="upload-type-item">
                <open-dir-svg class="svg-icon" />
                <!-- <common-upload accept="video/*" /> -->
              </div>
            </a-tooltip>

            <a-tooltip title="google drive" placement="top">
              <div class="upload-type-item">
                <google-drive-icon class="svg-icon" />
              </div>
            </a-tooltip>

            <a-tooltip title="youtube" placement="top">
              <div class="upload-type-item">
                <youtube-icon class="svg-icon" />
              </div>
            </a-tooltip>
          </a-space>
        </a-col>

        <a-button class="btn" type="primary">
          Confirm
        </a-button>
      </div>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import OpenDirSvg from '@/assets/svgIcon/library/open_dir.svg?inline'
import GoogleDriveIcon from '@/assets/svgIcon/addMaterial/google_drive.svg?inline'
import YoutubeIcon from '@/assets/svgIcon/addMaterial/youtube.svg?inline'
export default {
  name: 'Tip',
  components: {
    GoogleDriveIcon,
    OpenDirSvg,
    YoutubeIcon
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      taskLoading: false,
      tip_text: ''
    }
  },
  created() {
    logger.info('created ', this.taskId)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.task-tip {
  height: 100%;
  width: 100%;
  .loading-task {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 200px;
    }
  }
  .tip-content {
    height: 100%;
    width: 100%;
    padding: 50px;
    justify-content: center;
    align-items: center;
    .material-row{
       margin-top: 20px;
    }
    .btn {
      margin-top: 50px;
    }
  }
  .remark-button {
    width: 32px;
    height: 32px;
  }
  .svg-icon {
    width: 32px;
    height: 32px;
  }
}
</style>

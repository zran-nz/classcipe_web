<template>
  <div class='content-item' v-if='content' :style="{'border': '1px ' + borderStyle + ' #15c39a'}">
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content' @click='handlePreviewDetail(content)'>
        <div class='base-info'>
          <div class='name'>
            {{ content.name }}
          </div>
          <div class='tag-info'></div>
          <div class='owner'>
            {{ content.createBy }}
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
            {{ content.updateTime | dayjs }}
          </div>
        </div>
      </div>
      <div class='action'>
        <template v-if='showButton'>
          <a-space>
            <a-button type='primary' v-if='content.type === typeMap.task && content.subTasks.length > 0'>SubTask</a-button>
            <a-button type='primary'>Original Tips</a-button>
            <a-button type='primary' v-if='content.type === typeMap.task || content.type === typeMap.pd' @click='handleSchedule'>Schedule</a-button>
            <a-button type='primary' @click='editItem(content)'>Edit</a-button>
            <a-dropdown :trigger="['click']" :getPopupContainer="trigger => trigger.parentElement">
              <a-button type='primary'><a-icon type="dash" /></a-button>
              <div class='content-item-more-action' slot="overlay">
                <div class='self-learning menu-item' v-if='content.type === typeMap.task'>
                  Self learning <a-switch size="small" @change='handleSelfLearning' />
                </div>
                <div class='menu-item'>
                  <a-button type='primary' size='small' @click='handlePublishStatus'>
                    <template v-if='content.status === 0'>Publish</template>
                    <template v-if='content.status === 1'>UnPublish</template>
                  </a-button>
                </div>
                <div class='menu-item'>
                  <a-button type='danger' size='small' @click='handleDeleteItem'>Delete</a-button>
                </div>
              </div>
            </a-dropdown>
          </a-space>
        </template>
      </div>

      <preview-content :preview-current-id='previewCurrentId' :preview-type='previewType' v-if='previewVisible' @close='handlePreviewClose' />
    </div>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { DeleteMyContentByType } from '@/api/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import PreviewContent from '@/components/MyContentV2/PreviewContent'

export default {
  name: 'ContentItem',
  components: { PreviewContent },
  props: {
    content: {
      type: Object,
      default: null
    },
    showButton: {
      type: Boolean,
      default: true
    },
    clickPreview: {
      type: Boolean,
      default: true
    },
    borderStyle: {
      type: String,
      default: 'dashed'
    }
  },
  mixins: [ ContentItemMixin ],
  data () {
    return {
      typeMap: typeMap,
      isSelfLearning: false
    }
  },
  created() {
    this.allowPreview = this.clickPreview
  },
  computed: {
    status () {
      return this.content.status
    }
  },
  methods: {
    editItem (item) {
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.id
        })
      } else if (item.type === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.id
        })
      }
    },

    handleSchedule () {
      this.$router.push({
        path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
      })
    },

    handleSelfLearning (isSelfLearning) {
      this.$logger.info('handleSelfLearning', isSelfLearning)
      this.isSelfLearning = isSelfLearning
    },

    handlePublishStatus () {
      this.$emit('update-publish', {
        content: this.content
      })
    },

    handleDeleteItem () {
      logger.info('handleDeleteItem', this.content)
      DeleteMyContentByType(this.content).then(res => {
        logger.info('DeleteMyContentByType', res)
        this.$emit('delete', {
          content: this.content
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-item {
  padding: 15px;
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;

  .cover {
    border: 1px solid #e1e1e1;
    .cover-block {
      height: 160px;
      width: 260px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    height: 160px;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-grow: 1;

      .base-info {
        .name {
          line-height: 30px;
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }
      }
    }

    .action {
      flex-shrink: 0;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>

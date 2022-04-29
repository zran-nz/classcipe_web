<template>
  <div class='content-item' v-if='content' @click='handlePreviewDetail(content)'>
    <div class='cover'>
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
        <a-space>
          <a-button type='primary' @click='editItem(content)'>Edit</a-button>
          <a-button type='primary' @click='handleDuplicateItem'>Duplicate</a-button>
          <a-dropdown :trigger="['click']" :getPopupContainer="trigger => trigger.parentElement">
            <a-button type='primary'><a-icon type="dash" /></a-button>
            <div class='content-item-more-action' slot="overlay">
              <div class='menu-item'>
                <a-button type='danger' size='small' @click='handleDeleteItem'>Delete</a-button>
              </div>
            </div>
          </a-dropdown>
        </a-space>
      </div>
    </div>

    <preview-content :preview-current-id='previewCurrentId' :preview-type='previewType' v-if='previewVisible' @close='handlePreviewClose' />
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { DeleteMyContentByType } from '@/api/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import PreviewContent from '@/components/MyContentV2/PreviewContent'

export default {
  name: 'FavoriteContentItem',
  components: { PreviewContent },
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  mixins: [ ContentItemMixin ],
  data () {
    return {
      typeMap: typeMap,
      isSelfLearning: false
    }
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
    },

    handleDuplicateItem () {
      logger.info('handleDuplicateItem', this.content)
      this.$emit('duplicate', {
        content: this.content
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-item {
  padding: 15px;
  border: 1px dashed #15c39a;
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-width: 730px;

  .cover {
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

.content-wrapper {
  min-height: calc(100vh - 160px);
  .content-list {
    min-height: calc(100vh - 200px);

    .empty-tips {
      height: calc(100vh - 300px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<template>
  <div class='content-item' v-if='content'>
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content' @click='handlePreviewDetail(content)'>
        <div class='base-info'>
          <div class='header-info'>
            <div class='name'>
              {{ content.name }}
            </div>
            <div class='price'>
              <span class='price-label'>Price </span>
              <span class='price-data'>
                ${{ (content.price || 0).toFixed(2) }}
              </span>
              <span class='price-setting'>
                <a-icon type="edit" :style="{ fontSize: '13px', color: '#999' }"/>
              </span>
            </div>
            <div class='sales'>
              <span class='sales-label'>Sales </span>
              <span class='sales-data'>
                {{ content.sales || 0 }}
              </span>
            </div>
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
          <a-button type='primary' @click='handleDeleteItem(content)'>Delete</a-button>
          <a-button type='primary' @click='handlePublishStatus'>UnPublish</a-button>
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
  name: 'PublishedContentItem',
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
        .header-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          .name {
            width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
            line-height: 30px;
            font-size: 15px;
            color: #333;
            font-weight: 500;
          }

          .price {
            width: 120px;
            user-select: none;
            cursor: pointer;
            padding-left: 10px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            line-height: 30px;
          }

          .sales {
            width: 80px;
            user-select: none;
            cursor: pointer;
            padding-right: 10px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            line-height: 30px;
          }

          .price-label, .sales-label {
            font-size: 12px;
            color: #8e8e8e;
            padding-right: 5px;
            line-height: 30px;
          }

          .price-data {
            color: #e4393c;
            font-size: 20px;
            font-weight: 400;
            font-family: Verdana;
            vertical-align: middle;
            line-height: 30px;
          }

          .price-setting {
            display: none;
            padding-left: 5px;
          }

          .price {
            &:hover {
              .price-setting {
                display: flex;
              }
            }
          }

          .sales-data {
            color: #6C6C6C;
            font-size: 18px;
            font-weight: 400;
            line-height: 30px;
          }
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

<template>
  <div class='content-item' v-if='content'>
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
          <div class='subject'>
            Ray ka Art
          </div>
          <div class='tag-info'>
            <div class='tag-info-item'>
              Knowledge tag
            </div>
            <div class='tag-info-item'>
              Commen term
            </div>
          </div>
          <div class='owner'>
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
          </div>
        </div>
      </div>
      <div class='action'>
        <template v-if='showButton'>
          <a-space>
            <custom-button label='Duplicate' @click='handleDuplicateItem'>
              <template v-slot:icon>
                <duplicate-icon />
              </template>
            </custom-button>

            <custom-button label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button>
          </a-space>
        </template>
      </div>

      <preview-content
        :preview-current-id='previewCurrentId'
        :preview-type='previewType'
        v-if='previewVisible'
        @close='handlePreviewClose' />
    </div>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import PreviewContent from '@/components/MyContentV2/PreviewContent'
import CustomButton from '@/components/Common/CustomButton'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import DuplicateIcon from '@/assets/v2/icons/duplicate.svg?inline'

export default {
  name: 'FavoriteContentItem',
  components: {
    CustomButton,
    PreviewContent,
    DuplicateIcon,
    EditIcon
  },
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
    }
  },
  mixins: [ContentItemMixin],
  data() {
    return {
      typeMap: typeMap,
      isSelfLearning: false
    }
  },
  created() {
    this.allowPreview = this.clickPreview
  },
  computed: {
    status() {
      return this.content.status
    }
  },
  methods: {
    editItem() {
      const item = this.content
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

    handlePublishStatus() {
      this.$emit('update-publish', {
        content: this.content
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

<style lang='less' scoped>
@import "~@/components/index.less";

.content-item {
  padding: 15px 20px;
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 7px;
  border: 1px solid #EEF1F6;

  .cover {
    .cover-block {
      border-radius: 8px;
      height: 160px;
      width: 270px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    height: 160px;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-grow: 1;

      .base-info {
        .name {
          line-height: 32px;
          font-size: 16px;
          font-family: Arial;
          font-weight: bold;
          color: #17181A;
          cursor: pointer;
        }

        .subject {
          cursor: pointer;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
          line-height: 22px;
          font-size: 13px;
        }
      }
    }

    .action {
      flex-shrink: 0;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  }
}

.more-action {
  cursor: pointer;
  svg {
    width: 40px;
    height: 36px;
    fill: #494B52 !important;
  }

  &:hover {
    svg {
      fill: #14C39A !important;
    }
  }
}
</style>

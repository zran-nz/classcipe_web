<template>
  <div class='link-content-item' v-if='content'>
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
        <div class='preview-mask'>
        </div>
        <div class='preview-button-wrapper'>
          <div class='preview-button'>
            <div class='preview-icon'>
              <preview-icon />
            </div>
            <div class='preview-label'>
              Preview
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
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
        </div>
        <div class='right-info'>
          <div class='update-time'>
          </div>
        </div>
      </div>
      <div class='action'>
      </div>
    </div>

    <div class='delete-wrapper' v-if='showDelete'>
      <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelete" cancel-text="No">
        <delete-icon color='#F16A39' />
      </a-popconfirm>
    </div>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import PreviewContent from '@/components/MyContentV2/PreviewContent'
import PreviewIcon from '@/assets/v2/icons/preview.svg?inline'
import DeleteIcon from '@/components/Common/DeleteIcon'

export default {
  name: 'LinkContentItem',
  components: { DeleteIcon, PreviewContent, PreviewIcon },
  props: {
    content: {
      type: Object,
      default: null
    },
    showDelete: {
      type: Boolean,
      default: false
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

    handleDelete () {
      this.$emit('delete', this.content)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.link-content-item {
  position: relative;
  padding: 15px 20px;
  margin: 15px 0;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  box-shadow: 0 1px 3px 0 rgba(99, 99, 99, 0.11);
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;

  .cover {
    .cover-block {
      border-radius: 6px;
      height: 130px;
      width: 240px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;

      .preview-mask {
        position: absolute;
        left: 0;
        right: 0;
        border-radius: 6px;
        top: 0;
        bottom: 0;
        opacity: 0;
        background-color: #000;
        transition: all 0.2s ease-in-out;
        z-index: 100;
      }

      .preview-button-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        border-radius: 6px;
        top: 0;
        bottom: 0;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        z-index: 200;
        transition: all 0.2s ease-in-out;
        .preview-button {
          cursor: pointer;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;
          .preview-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            svg {
              width: 25px;
              height: 25px;
              fill: #FF686B;
            }
          }

          .preview-label {
            padding-left: 5px;
            color: #FF686B;
            font-size: 16px;
          }
        }

        &:hover {
          opacity: 1;
        }
      }

      &:hover {
        .preview-mask {
          opacity: 0.7;
        }
      }
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 20px;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-grow: 1;

      .base-info {
        .name {
          line-height: 25px;
          font-size: 15px;
          font-family: Arial;
          font-weight: bold;
          color: #1D2041;
        }
        .subject {
          cursor: pointer;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
          line-height: 22px;
          font-size: 13px;
        }
        .tag-info {
          display: flex;
          flex-direction: row;
        }
      }
    }

    .action {
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .delete-wrapper {
    cursor: pointer;
    display: none;
    position: absolute;
    right: 5px;
    top: 5px;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }

  &:hover {
    .delete-wrapper {
      display: flex;
    }
  }
}
</style>

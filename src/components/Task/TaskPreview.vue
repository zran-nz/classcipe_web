<template>
  <div class="task-preview" :data-uid="rawSubTaskData ? rawSubTaskData._uid : ''">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header" :gutter="[16,24]">
        <a-col span="24">
          <span class="title">
            {{ task.name }}
          </span>
        </a-col>
      </a-row>
      <a-row class="top-info" :gutter="[16,24]">
        <a-col class="left-preview" span="9">
          <a-carousel arrows>
            <div
              slot="prevArrow"
              class="custom-slick-arrow"
              style="left: 10px;z-index: 1"
            >
              <a-icon type="left-circle" />
            </div>
            <div
              slot="nextArrow"
              class="custom-slick-arrow"
              style="right: 10px">
              <a-icon type="right-circle" />
            </div>
            <div v-if="!loading && !thumbnailList.length" class="no-preview-img">
              <no-more-resources />
            </div>
            <div class="preview-img-item" v-for="(thumbnail,index) in thumbnailList" :key="index">
              <div class="preview-block" :style="{backgroundImage: 'url(' + thumbnail.contentUrl + ')' }" :data-img="thumbnail"></div>
            </div>
          </a-carousel>
        </a-col>
        <a-col class="right-detail" span="15">
          <div class="detail-wrapper">
            <div class="detail-block">
              <div class="block-title">
                {{ task.overview }}
                <span class="title-icon">
                  <a-tooltip>
                    <template slot="title">
                      Overview
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </div>
              <div class="block-content">
                <div class="content-list" v-if="task.customTags && task.customTags.length">
                  <div class="label">
                    customTags
                  </div>
                  <div class="content-sub-list">
                    <div class="content-sub-item" v-for="(customTag, kIndex) in task.customTags" :key="kIndex">
                      <div class="sub-title">
                        <a-tag :color="tagColorList[kIndex % tagColorList.length]">
                          {{ customTag.name }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="delete-icon">
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteItem" cancel-text="No">
                <img src="~@/assets/icons/tag/delete.png"/> Delete
              </a-popconfirm>
            </div>
          </div>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'TaskPreview',
  components: { NoMoreResources },
  props: {
    taskData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      rawSubTaskData: null,
      task: null,
      thumbnailList: [],

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1
    }
  },
  created () {
    logger.info('TaskPreview taskId ' + this.taskId)
    this.loadTaskData()
  },
  methods: {
    loadTaskData () {
      this.loading = true
      logger.info('TaskPreview exist taskData ', this.taskData)
      this.rawSubTaskData = this.taskData
      this.task = this.taskData.subTask
      // 手动把selectPageImages中图片复制到thumbnailList中
      this.thumbnailList = []
      this.rawSubTaskData.selectPageImages.forEach(image => {
        this.thumbnailList.push({ contentUrl: image })
      })
      this.loading = false
    },

    handleDeleteItem () {
      this.$emit('delete-sub-task', this.rawSubTaskData)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.task-preview {
  border: 1px solid #fff;

  &:hover {
    border: 1px solid #f9f9f9;
  }

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;

    .title {
      font-weight: bold;
    }

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }

  .top-info {
    padding: 20px 0 0 0;
  }

  .left-preview {
    height: 100%;

    .ant-carousel {

      /deep/ .slick-list {
        border: 1px solid #eee;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
      }

      /deep/ .slick-slide {
        text-align: center;
        height: 200px;
        line-height: 200px;
        overflow: hidden;
      }

      /deep/ .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.81);
        opacity: 0.1;
        border-radius: 50%;
        transition: all 0.3s ease-in;
      }

      &:hover {
        /deep/ .custom-slick-arrow {
          opacity: 0.3;
        }
      }

      /deep/ .custom-slick-arrow:before {
        display: none;
      }

      /deep/ .custom-slick-arrow:hover {
        opacity: 0.3;
      }

      /deep/ .slick-slide h3 {
        color: #fff;
      }

      /deep/ .no-preview-img {
        padding: 20px;
        .description {
        }
      }

      /deep/ .preview-img-item {
        .preview-block {
          height: 200px;
          background-position: center;
          background-size: cover;
        }
      }
    }

    .edit-action {
      margin-top: 20px;
    }
  }

  .right-detail {
    .detail-wrapper {
      position: relative;
      .detail-block {
        margin-bottom: 10px;
        border: 1px solid #f3f3f3;

        .block-title {
          font-weight: 700;
          font-size: 16px;
          padding: 10px 90px 10px 10px;
          background-color: #fafafa;

          audio {
            height: 30px;
            outline: none;
          }
          .title-icon {
            font-size: 14px;
            font-weight: normal;
            color: @text-color-secondary;
          }
        }

        .block-content {
          padding: 10px;
          .cover {
            img {
              height: 150px;
            }
          }
          .content-list {
            .label {
              font-weight: 500;
              padding: 5px 0;
              font-size: 15px;
            }
            .content-item {
              margin-bottom: 10px;
              .question {
                padding-bottom: 5px;
                font-size: 14px;
                font-weight: 500;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                padding-bottom: 10px;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                }
              }

              .content-sub-list {
                padding: 5px 0;
                background-color: #f9f9f9;
                margin-bottom: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                .content-sub-item {
                  margin: 0 5px 5px 0;
                }
              }
            }
          }
        }
      }

      .delete-icon {
        position: absolute;
        right: 10px;
        top: 3px;
        cursor: pointer;
        color: #D01919;
        background-color: #fafafa;

        img {
          width: 40px;
        }
      }
    }
  }

  .bottom-relative {

    .type-button {
      width: 100px;
    }

    /deep/ .left-button {
      border-radius: 16px 0 0 16px;
    }

    /deep/ .right-button {
      border-radius: 0 16px 16px 0 ;
    }
  }
}

.content-sub-list {
  padding: 5px 0;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .content-sub-item {
    margin: 0 5px 5px 5px;
  }
}
</style>

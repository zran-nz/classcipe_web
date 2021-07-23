<template>
  <div class="material-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header" :gutter="[16,24]">
        <a-col span="24">
          <span class="title">
            {{ materialData.name }}
          </span>
          <template v-if="lastChangeSavedTime">
            <a-divider type="vertical" />
            <span class="last-change-time">
              {{ $t('teacher.material.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
            </span>
          </template>
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
            <div v-if="!loading && !imgList.length" class="no-preview-img">
              <a-empty>
                <!--                <span slot="description"></span>-->
              </a-empty>
            </div>
            <div class="preview-img-item" v-for="(img,index) in imgList" :key="index">
              <div class="preview-block" :style="{backgroundImage: 'url(' + img + ')' }" :data-img="img"></div>
            </div>
          </a-carousel>
          <div class="edit-action">
            <a-button type="primary">
              <router-link :to="'/teacher/add-material/' + materialId">{{ $t('teacher.material-preview.edit') }}</router-link>
            </a-button>
          </div>
        </a-col>
        <a-col class="right-detail" span="15">
          <div class="detail-wrapper">
            <div class="detail-block">
              <div class="block-title">
                {{ materialData.overview && materialData.overview }}
                <span class="title-icon">
                  <a-tooltip>
                    <template slot="title">
                      {{ $t('teacher.material.overview') }}
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </div>
            </div>
            <div class="detail-block material-detail">
              <div class="block-content" v-if="materialData && materialData.files">
                <div v-for="(materialItem,index) in materialData.files" :key="index" class="material-item" >
                  <div class="material-item-content-wrapper">
                    <div class="material-item-content">
                      <template v-if="materialItem.fileType === fileTypeMap.txt">
                        <div class="material-text-content" v-html="materialItem.description"></div>
                      </template>
                      <template v-if="materialItem.fileType === fileTypeMap.img">
                        <div class="material-image-content">
                          <img :src="materialItem.fileUrl" alt="" v-if="materialItem && materialItem.fileUrl">
                        </div>
                      </template>
                      <template v-if="materialItem.fileType === fileTypeMap.audio">
                        <div class="material-audio-content" :data-url="materialItem.fileUrl">
                          <audio :src="materialItem.fileUrl" v-show="materialItem && materialItem.fileUrl" controls />
                        </div>
                      </template>
                      <template v-if="materialItem.fileType === fileTypeMap.video">
                        <div class="material-video-content" :data-url="materialItem.fileUrl">
                          <video :src="materialItem.fileUrl" v-show="materialItem && materialItem.fileUrl" controls />
                        </div>
                      </template>
                      <template v-if="materialItem.fileType === fileTypeMap.link">
                        <div class="material-embed-content" :data-url="materialItem.fileUrl">
                          <span class="iframe-url">
                            {{ materialItem.fileUrl }}
                          </span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-divider v-if="showAssociate"/>
      <material-associate-preview :material-id="materialId" v-if="showAssociate"/>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import MaterialAssociatePreview from '@/components/Material/MaterialAssociatePreview'
import { fileTypeMap } from '@/const/material'
const { formatLocalUTC } = require('@/utils/util')
const { MaterialQueryById } = require('@/api/material')

export default {
  name: 'MaterialPreview',
  props: {
    materialId: {
      type: String,
      default: null
    },
    showAssociate: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MaterialAssociatePreview
  },
  computed: {
    lastChangeSavedTime () {
      if (this.materialData) {
        logger.info('lastChangeSavedTime materialData', this.materialData)
        const time = this.materialData.createTime || this.materialData.updateTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    }
  },
  mounted () {
  },
  data () {
    return {
      loading: true,
      materialData: null,
      associateData: null,
      imgList: [],

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1,
      typeMap: typeMap,
      fileTypeMap: fileTypeMap,

      subPreviewVisible: false
    }
  },
  created () {
    logger.info('MaterialPreview materialId ' + this.materialId)
    this.loadMaterialData()
  },
  methods: {
    loadMaterialData () {
      logger.info('loadMaterialData ' + this.materialId)
      this.loading = true
      MaterialQueryById({
        id: this.materialId
      }).then(response => {
        logger.info('MaterialQueryById ' + this.materialId, response.result)
        this.materialData = response.result
        if (this.materialData && this.materialData.files) {
          this.materialData.files.forEach(item => {
            if (item.fileType === fileTypeMap.img) {
              this.imgList.push(item.fileUrl)
            }
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleSelectContentType (contentType) {
      logger.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      logger.info('handleSubPreviewClose')
      this.subPreviewVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.material-preview {

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
      .detail-block {
        margin-bottom: 10px;
        border: 1px solid #f3f3f3;

        .block-title {
          font-weight: 700;
          font-size: 16px;
          padding: 10px;
          background-color: #fafafa;
          .title-icon {
            font-size: 14px;
            font-weight: normal;
            color: @text-color-secondary;
          }
        }

        .block-content {
          padding: 10px;
          width: 100%;
          .material-item {
            box-sizing: border-box;
            border: 2px solid #fff;
            width: 100%;
            padding: 20px 10px;
            display: flex;
            justify-content: center;
            flex-direction: row;
            position: relative;
            cursor: auto;
            .material-item-content-wrapper {
              padding: 0;
              margin: 0;
              width: 100%;
              text-align: center;
              .material-audio-content {
                display: block;
                audio {
                  margin: auto;
                  display: block;
                  height: 40px;
                }
              }

              .material-video-content {
                display: block;
                video {
                  width: 100%;
                  margin: auto;
                  display: block;
                }
              }

              .material-embed-content {
                .iframe-url {
                  color: @primary-color;
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }
      }

      .material-detail {
        box-shadow: 0 4px 4px 0 rgba(31, 33, 44, 10%);
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
</style>

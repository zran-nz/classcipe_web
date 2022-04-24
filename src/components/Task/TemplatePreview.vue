<template>
  <div class="preview-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="action-header">
        <a-col span="24" class="action-header-toggle">
          {{ templateData.name }}
        </a-col>
      </a-row>
      <a-row class="top-header">
        <a-col class="material-row" >
          <div class="icon-group">
            <a-badge :count="showMaterialSize('text')" v-if="currentPageMaterial.hasOwnProperty('text')">
              <div class="icon" @click="showPluginMaterial('text')">
                <text-type-svg />
                <div class="icon-text">Text</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('image')" v-if="currentPageMaterial.hasOwnProperty('image')">
              <div class="icon" @click="showPluginMaterial('image')">
                <image-type-svg />
                <div class="icon-text">Image</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('video')" v-if="currentPageMaterial.hasOwnProperty('video')">
              <div class="icon" @click="showPluginMaterial('video')">
                <video-type-svg />
                <div class="icon-text">Video</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('audio')" v-if="currentPageMaterial.hasOwnProperty('audio')">
              <div class="icon" @click="showPluginMaterial('audio')">
                <audio-type-svg />
                <div class="icon-text">Audio</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('iframe')" v-if="currentPageMaterial.hasOwnProperty('iframe')">
              <div class="icon" @click="showPluginMaterial('iframe')">
                <youtube-type-svg />
                <div class="icon-text">Youtube</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('pdf')" v-if="currentPageMaterial.hasOwnProperty('pdf')" >
              <div class="icon" @click="showPluginMaterial('pdf')">
                <pdf-type-svg />
                <div class="icon-text">PDF</div>
              </div>
            </a-badge>
            <a-badge :count="showMaterialSize('website')" v-if="currentPageMaterial.hasOwnProperty('website')">
              <div class="icon" @click="showPluginMaterial('website')">
                <url-type-svg />
                <div class="icon-text">Website</div>
              </div>
            </a-badge>
          </div>
        </a-col>
      </a-row>
      <a-row class="preview-data-info" >
        <a-col class="slide-preview" span="24" >
          <!--        <a-spin v-show="slideLoading" class="spin-loading"/>-->
          <!-- lesson task img list-->
          <a-col span="24">
            <div v-if="!thumbnailList.length" class="no-preview-img">
              <no-more-resources />
            </div>
          </a-col>
          <a-col class="left-preview" span="24" style="display:flex;flex-direction:row">
            <div class="left-preview-left" style="display:flex">
              <a-carousel ref="carousel" v-if="thumbnailList.length" class="my-carousel">
                <div v-for="(item,cIndex) in thumbnailList" :key="'cIndex' + cIndex">
                  <img :src="item.contentUrl" />
                </div>
              </a-carousel>
              <div class="plugin-tags" v-if="currentPageItem">
                <a-row class="tag-row">
                  <span class="tag-item" v-if="currentPageItem.data.bloomLevel">
                    <span class="tag-title">Bloom's Taxonomy:</span>
                    <span class="tag-value" style="color:#F16A39">{{ currentPageItem.data.bloomLevel }}</span>
                  </span>
                  <span class="tag-item" v-if="currentPageItem.data.knowledgeLevel">
                    <span class="tag-title">Knowledge dimension(s):</span>
                    <span class="tag-value" style="color:#F16A39">{{ currentPageItem.data.knowledgeLevel }}</span>
                  </span>
                </a-row>
                <a-row class="tag-row">
                  <span class='tag-item' v-if='currentPageItem.data.verbs && currentPageItem.data.verbs.length > 0'>
                    <span class="tag-title">Command terms:</span>
                    <span class="tag-value" v-for="(v,index) in currentPageItem.data.verbs" :key="index" style="color:#15C39A">{{ v }}</span>
                  </span>
                  <span class="tag-item" v-if="currentPageTips">
                    <span class="tag-title">Tip added:</span>
                    <span class="tag-value" style="color:#0054FF">{{ currentPageTips.tip }}</span>
                  </span>
                </a-row>
                <a-row class='tag-row' v-if="currentPageItem.data.learnOuts && currentPageItem.data.learnOuts.length > 0">
                  <span class="tag-item">
                    <span class="tag-title">Assessment objective(s):</span>
                    <span class="tag-value" v-for="(learn,index) in currentPageItem.data.learnOuts" :key="index" style="color:#00BCF2">
                      <a-tooltip :title="learn.path" :overlayStyle="{ 'z-index': '3000'}">{{ learn.name }} </a-tooltip>
                    </span>
                  </span>
                </a-row>
                <a-row class="tag-row">
                  <span class="tag-item">
                    <span class="tag-title">This is a <span>{{ currentPageItem.type }}</span> slide</span>
                  </span>
                </a-row>
              </div>
              <div class="page-info" v-if="thumbnailList && thumbnailList.length">
                {{ currentImgIndex + 1 }} / {{ thumbnailList.length }}
              </div>
              <a-button
                class="action-ensure action-item"
                type="primary"
                shape="round"
                @click="handleSelectTemplate($event)"
                v-if="selectIds.indexOf(template.id) === -1">
                <a-icon type="plus-circle" class="btn-icon"/>
                <div class="btn-text">
                  Insert
                </div>
              </a-button>
              <!--              <a-button-->
              <!--                v-else-->
              <!--                class="action-ensure action-item"-->
              <!--                shape="round"-->
              <!--                type="primary"-->
              <!--                @click="handleSelectTemplate()">-->
              <!--                <a-icon type="minus-circle" class="btn-icon"/>-->
              <!--                <div class="btn-text">-->
              <!--                  Remove-->
              <!--                </div>-->
              <!--              </a-button>-->
            </div>
            <div class="carousel-page">
              <div class="img-list-wrapper">
                <div class="img-list">
                  <div class="img-item" v-for="(item,index) in thumbnailList" :key="'index' + index" @click="handleGotoImgIndex(index)">
                    <img :src="item.contentUrl" />
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-col>
      </a-row>

      <a-modal
        v-model="materialVisible"
        :footer="null"
        destroyOnClose
        width="800px"
        :zIndex="6000"
        title="My Materials"
        @ok="materialVisible = false"
        @cancel="materialVisible = false">
        <task-material-preview :current-page-element-lists="currentPageElementLists" :filter-type="filterMaterialType" :current-page-index="currentImgIndex"></task-material-preview>
      </a-modal>

      <a-modal
        v-model="mediaVisible"
        :footer="null"
        destroyOnClose
        width="900px"
        :zIndex="5000"
        :title="null"
        @ok="mediaVisible = false"
        @cancel="mediaVisible = false">
        <media-preview :media-list="mediaList" :material-type="filterMaterialType"></media-preview>
      </a-modal>
    </template>
  </div>
</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/icons/material/youtube.svg?inline'
import PdfTypeSvg from '@/assets/icons/material/pdf.svg?inline'
import UrlTypeSvg from '@/assets/icons/material/url.svg?inline'
import MaterialTypeIcon from '@/components/Task/MaterialTypeIcon'
import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'
import { typeMap } from '@/const/teacher'
import { TemplatesGetPublishedPresentation } from '@/api/template'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import MediaPreview from '@/components/Task/MediaPreview'
import { MyContentEvent, MyContentEventBus } from '@/components/MyContent/MyContentEventBus'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'

export default {
  name: 'TemplatePreview',
  components: {
    TaskMaterialPreview,
    MaterialTypeIcon,
    NoMoreResources,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg,
    MediaPreview
  },
  props: {
    template: {
      type: Object,
      default: () => null
    },
    selectedTemplateIdList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    selectedTemplateIdList (value) {
      this.$logger.info('selectedTemplateIdList ', value)
      this.selectIds = value
    }
  },
  computed: {
  },
  mounted () {

  },
  data () {
    return {
      selectIds: [],
      templateData: {},
      loading: true,
      loadingClass: false,
      data: null,
      subPreviewVisible: false
    }
  },
  mixins: [ PptPreviewMixin, GoogleAuthCallBackMixin ],
  created () {
    this.loadData()
  },
  methods: {
    loadData() {
      this.templateData = this.template
      this.$logger.info('selectedTemplateIdList ', this.selectedTemplateIdList)
      this.selectIds = this.selectedTemplateIdList
      if (this.templateData.type === typeMap.task) {
        this.loading = true
        TemplatesGetPublishedPresentation({
          presentationId: this.templateData.presentationId
        }).then(response => {
          this.$logger.info('task loadThumbnail response', response.result)
          if (response.code !== this.ErrorCode.ppt_google_token_expires) {
            const pageObjects = response.result.pageObjects
            this.templateData.pageObjectIds = []
            pageObjects.forEach(page => {
              this.templateData.pageObjectIds.push(page.id)
              this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
              this.$logger.info('current thumbnailList ', this.thumbnailList)
            })
          }
        }).finally(() => {
          this.loading = false
          this.getClassInfo(this.templateData.presentationId)
        })
      } else {
        this.loading = false
        this.templateData.images.forEach((image, index) => {
          this.thumbnailList.push({ contentUrl: image, id: this.templateData.pageObjectIds[index] })
        })
        this.getClassInfo(this.templateData.presentationId)
      }
    },
    handleAuthCallback() {
      this.$logger.info('handleAuthCallback')
      this.loadData()
    },
    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    },
    handleSelectTemplate ($event) {
      this.$logger.info('handleSelectTemplate ' + this.templateData.name)
      // this.$emit('handle-select')
      MyContentEventBus.$emit(MyContentEvent.ToggleSelectContentItem, this.templateData, $event)
    },
    handlePreviewMaterial (item) {
      this.$logger.info('handlePreviewMaterial ' + item)
      if (item.type !== 'tip') {
        window.open(item.url, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.preview-preview {
  padding: 10px 16px;

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    .material-row{
      width: fit-content;
      margin: 0 auto;
    }
    .icon-group{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      flex-basis: auto;
      justify-content: center;
      align-items: center;
      margin:10px auto;
      border: 1px solid #ddd;
      border-radius: 6px;
      /deep/ .ant-badge-count{
        top:10px;
        right:12px;
      };
      .icon {
        width: 50px;
        height: 50px;
        margin:10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: #fafafa;
        display: flex;
        flex-direction: column;
        font-weight: bold;
        padding:2px;
        cursor: pointer;
        align-items: center;
        .icon-text {
          display: flex;
          font-size: 12px;
        }
        svg {
          display: flex;
          width: 32px;
          height: 32px;
        }
      }
    }

    .title-line {
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .name {
        width: 70%;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        font-family: Inter-Bold;
        font-size: 15px;
        font-weight: bold;
        color: #182552;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .action-item {
        display: flex;
        width: 30%;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .star {
          img {
            width: 22px;
          }
        }

        .edit {
          margin-left: 15px;
          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            .edit-icon {
              padding-left: 5px;
              width: 18px;
            }
          }
        }
      }
    }
  }

  .preview-data-info {
    margin-top: 10px;
    min-height: 100px;
    padding: 5px;
    opacity: 1;
  }

  .left-preview {
    //margin-top: 10px;
    height: 100%;
    .left-preview-left{
      display: flex;
      flex-direction: column;
    }
    .action-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 13px;
      position: absolute;
      bottom: 0px;
      right:200px;
      width: 90px;
      margin-right: -150px;
      .btn-icon {
        height: 18px;
        margin-right: 5px;
        padding-top:3px
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

.material-preview {
  padding: 5px 16px;

  .title-header {
    width:70%;
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    .title-line {
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .title-split{
        margin: 0px 20px;
      }
      .title-size{
        color: rgba(21, 195, 154, 1)
      }
      .title-name {
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        font-family: Inter-Bold;
        font-size: 15px;
        font-weight: bold;
        color: #182552;
        padding-right: 10px;
        box-sizing: border-box;
      }
    }
  }

  .content-wrapper {
    .content-list {
      margin-top: 10px;
      width:100%;
      /deep/ .ant-list-item {width:100%}

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        opacity: 1;
        .btn-text{
          padding-left: 4px;
        }
      }
      .action-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        width: 80px;
        box-sizing: border-box;
        img {
          height: 18px;
        }
      }
      .icon-content{
        width:70px;
      }
      .page-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 300px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
    }
  }

}

/deep/ .left-button {
  border-radius: 16px 0 0 16px;
  font-family: Inter-Bold;
  color: #11142D;
}

/deep/ .right-button {
  border-radius: 0 16px 16px 0 ;
  background: rgba(247, 248, 255, 1);
  border: none;
  font-size: 14px;
  font-family: Inter-Bold;
  color: #11142D;
  opacity: 1;
  top:-1px;
}

.action-header {
  margin-bottom: 10px;
  .action-header-toggle {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    font-family: Inter-Bold;
    font-size: 15px;
    font-weight: bold;
    color: #182552;
    padding-right: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}

.edit-action {
  text-align: right;
}

.my-carousel {
  width: 740px;
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
  div {
    img {
      height: 400px;
      width: 100%;
    }
  }
}

.carousel-page {
  display: flex;
  width: 200px;
  max-height:400px;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
  .img-list-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height:400px;
    .img-list {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .img-item {
        cursor: pointer;
        height: 80px;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin-bottom: 10px;
        img {
          height: 100%;
        }
      }
    }
  }
}

.data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 15px;
  }
}

.custom-tags {
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  .tag-item {
    font-size: 16px;
    margin-right: 5px;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    .tag {
      background: rgba(255, 187, 0, 0.1);
      border: 1px solid #FFBB00;
      border-radius: 20px;
      font-family: Inter-Bold;
      color: #FFBB00;
      padding: 3px 10px;
    }
  }
}

.learn-question-tag {
  width: 100%;
}

.data-detail-wrapper {
  background: rgba(253, 238, 218, 0.5);
  border: 1px solid rgba(220, 220, 220, 1);
  padding: 10px;
  .detail-block {
    .block-title {
      font-weight: 500;
      font-size: 16px;
      font-family: Inter-Bold;
      color: #000000;
      width: 100%;
    }

    .scenario-block-content {
      padding: 5px 0;
      .content-list {
        display: flex;
        flex-direction: column;

        .content-item {
          background: #fff;
          padding: 5px 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .question {
            font-size: 14px;
            font-weight: 500;
            padding-right: 15px;
          }
          .tags {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 250px;
            justify-content: flex-end;

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
              .tag {
                background: rgba(255, 187, 0, 0.1);
                border: 1px solid #FFBB00;
                border-radius: 20px;
                font-family: Inter-Bold;
                color: #FFBB00;
              }
            }
          }

          .content-sub-list {
            padding: 5px 0;
            background-color: #f9f9f9;
            .subject-name {
              cursor: pointer;
              color: @primary-color;
              padding: 0 10px;
              line-height: 30px;
              border-radius: 30px;
              margin: 0 10px;
              background-color: fade(@outline-color, 20%);
            }
          }
        }
      }
    }

    .keyword-block-content {
      padding: 5px 0;
      .content-list {
        display: flex;
        flex-direction: column;

        .content-item {
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          .question {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            padding: 5px 0;
          }
          .tags {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

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
              .tag {
                background: rgba(255, 187, 0, 0.1);
                border: 1px solid #FFBB00;
                border-radius: 20px;
                font-family: Inter-Bold;
                color: #FFBB00;
              }
            }
          }

          .content-sub-list {
            padding: 5px 0;
            width: 100%;
            .content-sub-item {
              background: rgba(255, 187, 0, 0.1);
              color: rgba(255, 187, 0, 1);
              margin-bottom: 10px;
              .sub-title {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                .sub-title-name {
                  padding-right: 15px;
                  font-weight: 500;
                  display: inline-block;
                  .subject-name {
                    display: inline-block;
                    cursor: pointer;
                    color: @primary-color;
                    padding: 0 8px;
                    line-height: 20px;
                    border-radius: 20px;
                    margin: 0 5px;
                    background-color: fade(@outline-color, 20%);
                  }
                }
              }
            }

            .tag {
              background: rgba(255, 187, 0, 0.1);
              border: 1px solid #FFBB00;
              border-radius: 20px;
              font-family: Inter-Bold;
              color: #FFBB00;
            }
          }
        }
      }
    }

    .inquiry-block-content {
      width: 100%;
      background: rgba(21, 195, 154, 0.1);
      border: 1px dashed rgba(216, 216, 216, 1);
      .inquiry {
        padding: 5px 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        color: rgba(21, 195, 154, 1);
      }
    }

    .overview-block {
      padding: 10px;
      margin-bottom: 10px;
      .view-text {
        padding: 10px;
        background: #fff;
        color: #000;
        font-family: Inter-Bold;
        font-weight: 500;
      }
    }
  }
}

.preview-data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 0;
  }

  .content-item {
  }
}

.page-info {
  margin-top: 30px;
  background: #E4E4E4;
  padding: 1px 10px;
  border-radius: 20px;
  width:80px;
  text-align: center;
  .page-num-tag {
    display: inline;
    background: rgba(228, 228, 228, 0.5);
    padding: 1px 10px;
    border-radius: 16px;
    font-size: 8px;
    font-family: Segoe UI;
    font-weight: 400;
    color: #808191;
  }
}

/deep/ .ant-carousel {
  .slick-dots li{
    background:#364d79;
    //&.slick-active{
    //  background:#15c39a;
    //}
  }
}
.associate-info{
  padding: 10px 5px 10px 5px;
}

.plugin-tags{
  height: 100px;
  width: 740px;
  overflow-y:auto;
  background-color:#F7F7F7;
  font-size: 12px;
  padding-left: 15px;
  font-family: Segoe UI;
  .tag-row{
    margin: 5px;
  }
  .tag-item{
    //margin-left: 15px;
  }
  .tag-title{
    font-weight: 400;
    line-height: 0px;
    color: #808191;
    opacity: 1;
  }
  .tag-value{
    margin-left: 10px;
    //max-width: 200px;
  }
}
</style>

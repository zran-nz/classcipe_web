<template>
  <div class="preview-preview">
    <template v-if="loadingClass">
      <a-skeleton active />
    </template>
    <template v-else>
      <div class="material-preview">
        <a-row class="title-header">
          <a-col span="24" class="action-header-toggle title-line">
            <div class="title" v-if="computerSize('video') > 0">
              <!--              <span> |</span>-->
              <span class="title-name">Video :</span>
              <span class="title-size">{{ computerSize('video') }}</span>
            </div>
            <div class="title" v-if="computerSize('audio') > 0">
              <span class="title-split" v-if="!filterType"> |</span>
              <span class="title-name">Audio :</span>
              <span class="title-size">{{ computerSize('audio') }}</span>
            </div>
            <div class="title" v-if="computerSize('pdf') > 0">
              <span class="title-split" v-if="!filterType"> |</span>
              <span class="title-name">Pdf :</span>
              <span class="title-size">{{ computerSize('pdf') }}</span>
            </div>
            <div class="title" v-if="computerSize('image') > 0">
              <span class="title-split" v-if="!filterType"> |</span>
              <span class="title-name">Image :</span>
              <span class="title-size">{{ computerSize('image') }}</span>
            </div>
            <div class="title" v-if="computerSize('iframe') > 0">
              <span class="title-split" v-if="!filterType"> |</span>
              <span class="title-name">Youtube :</span>
              <span class="title-size">{{ computerSize('iframe') }}</span>
            </div>
            <div class="title" v-if="computerSize('website') > 0">
              <span class="title-split" v-if="!filterType"> |</span>
              <span class="title-name">Website :</span>
              <span class="title-size">{{ computerSize('website') }}</span>
            </div>
          </a-col>
        </a-row>
        <a-row class="preview-data-info" >
          <div class="content-wrapper">
            <div class="content-list">
              <a-list size="large" :data-source="elementsList">
                <a-list-item slot="renderItem" key="item.key" slot-scope="item" class="my-list-item">

                  <material-type-icon :type="item.type" class="icon-content"/>

                  <span class="name-content" :title="item.tip || item.url">
                    <span class="name-text">
                      {{ item.tip || item.url }}
                    </span>
                  </span>

                  <span class="page-content">
                    <span class="name-text">
                      Page  {{ currentPageIndex + 1 }}
                    </span>
                  </span>

                  <div class="action" >
                    <a-button
                      class="action-ensure action-item"
                      shape="round"
                      v-if="item.type !== 'tip'"
                      @click="handlePreviewMaterial(item)"
                    >
                      <a-icon type="eye" theme="filled"/>
                      <div class="btn-text">
                        Preview
                      </div>
                    </a-button>
                  </div>
                </a-list-item>
              </a-list>
            </div>

          </div>
        </a-row>
      </div>
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
import { fileTypeMap } from '@/const/material'
import MaterialTypeIcon from '@/components/Task/MaterialTypeIcon'

export default {
  name: 'TaskMaterialPreview',
  components: {
    MaterialTypeIcon,
    NoMoreResources,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg
  },
  props: {
    currentPageElementLists: {
      type: Array,
      default: () => []
    },
    currentPageIndex: {
      type: Number,
      default: 0
    },
    filterType: {
      type: String,
      default: ''
    }
  },
  computed: {

  },
  mounted () {

  },
  data () {
    return {
      elementsList: [],
      showMenuList: [],
      fileTypeMap: fileTypeMap,
      loadingClass: false
    }
  },
  created () {
    this.$logger.info('currentPageElementLists ', this.currentPageElementLists)
    if (this.filterType) {
      this.elementsList = this.currentPageElementLists.filter(item => item.type === this.filterType)
    } else {
      this.elementsList = this.currentPageElementLists
    }
  },
  methods: {
    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    },
    handlePreviewMaterial (item) {
      this.$logger.info('handlePreviewMaterial ' + item)
      if (item.type !== 'tip') {
        window.open(item.url, '_blank')
      }
    },
    computerSize (type) {
        var size = 0
        this.elementsList.forEach(data => {
            if (data.type === type) {
              size++
            }
        })
        return size
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.preview-preview {
  padding: 10px 16px;
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

</style>

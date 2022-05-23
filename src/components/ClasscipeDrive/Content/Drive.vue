<template>
  <div class='cc-drive'>
    <div class='drive-filter'>
      <div class='drive-filter-left'>
        <a-space :size='20'>
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            v-model='gradeId'
            @change='handleChangeGrade'
            class='cc-select-white-no-round'
            placeholder='Select a grade'>
            <a-select-option v-for='(grade,index) in gradeList' :key='index' :value='grade.id'>
              {{ grade.name }}
            </a-select-option>
          </a-select>
          <custom-search-input :round='false' :value.sync='keywords' @search='handleSearch' placeholder='Search your content'/>
        </a-space>
      </div>
      <div class='drive-filter-right'>
        <a-checkbox :checked="isSearchByContent" @change="searchModeChange" class='cc-checkbox'>
          Show material categorized by content
        </a-checkbox>
      </div>
    </div>
    <div class='drive-content'>
      <div class='file-list' v-show='searchMode === searchModeType.fileName && !loading'>
        <div class='file-item' v-for='fileItem in dataList' :key='fileItem.id'>
          <custom-media-item
            width='230px'
            height='180px'
            @click='handleSelectItem(fileItem)'
            :show-mask-selected='selectedList.indexOf(fileItem) !== -1'
            :media-title='fileItem.fileName'
            :media-size='fileItem.fileLength'
            :media-url='fileItem.filePath'
            :media-type='fileItem.fileType'
            :video-controls='false'
            :media-item='fileItem' />
        </div>
      </div>
      <div class='content-list' v-show='searchMode === searchModeType.content && !loading'>
        <div class='content-item' v-for='item in contentList' :key='item.id'>
          <content-item :content='item' :show-button='false' :click-preview='false' @click.native='handleFileContentItemClick(item)' />
        </div>
      </div>
      <div class='content-sub-file-back' v-show='searchMode === searchModeType.contentSubFile && !loading'>
        <a-space>
          <custom-text-button label='Back' @click='contentSubGoBack'></custom-text-button>
          <div class='content-info'>
            {{ currentContentItem && currentContentItem.name || 'Untitled' }} ({{ contentSubList.length }})
          </div>
        </a-space>
      </div>
      <div class='file-list' v-show='searchMode === searchModeType.contentSubFile && !loading'>
        <div class='file-item' v-for='fileItem in contentSubList' :key='fileItem.id'>
          <custom-media-item
            width='230px'
            height='180px'
            @click='handleSelectItem(fileItem)'
            :show-mask-selected='selectedList.indexOf(fileItem) !== -1'
            :media-title='fileItem.fileName'
            :media-size='fileItem.fileLength'
            :media-url='fileItem.filePath'
            :media-type='fileItem.fileType'
            :video-controls='false'
            :media-item='fileItem' />
        </div>
      </div>
      <div class='list-loading' v-show='loading'>
        <a-spin tip='loading...' />
      </div>
    </div>
    <div class='drive-action'>
      <a-button type='primary' :disabled='selectedList.length === 0' @click='handleInsertSelected'>Insert</a-button>
    </div>
  </div>
</template>

<script>

import { FindMyContent, GetMyGrades } from '@/api/teacher'
import { FileRecord } from '@/api/material'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import CustomMediaItem from '@/components/Common/CustomMediaItem'
import * as logger from '@/utils/logger'
import ContentItem from '@/components/MyContentV2/ContentItem'
import CustomTextButton from '@/components/Common/CustomTextButton'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'

const searchModeType = {
  fileName: 'fileName',
  content: 'content',
  contentSubFile: 'contentSubFile'
}

const fileType = {
  image: 'image',
  video: 'video'
}

export default {
  name: 'Drive',
  components: { CustomTextButton, ContentItem, CustomMediaItem, CustomSearchInput },
  props: {
    filterFileType: {
      type: String,
      default: 'image'
    },
    // 最多允许选择的数量
    maxSelectedNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loading: true,
      searchModeType: searchModeType,
      fileType: fileType,
      searchMode: searchModeType.fileName,
      gradeList: [],

      gradeId: null,
      keywords: null,

      isSearchByContent: false,
      dataList: [],
      contentList: [],
      contentSubList: [],
      pageNo: 0,
      pageSize: 50,

      currentContentItem: null,

      selectedList: []
    }
  },
  created() {
    this.$logger.info('Drive created ' + this.filterFileType)
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      GetMyGrades().then((res) => {
        this.$logger.info('GetMyGrades', res)
        if (res.result) {
          this.gradeList = res.result
          if (this.gradeList.length) {
            this.gradeId = this.gradeList[0].id
          }
          this.handleSearch()
        }
      }).catch(e => {
        this.$message.error('Drive Error ' + e)
        this.loading = false
      })
    },

    handleChangeGrade () {
      if (this.searchMode === this.searchModeType.contentSubFile) {
        this.searchMode = this.searchModeType.content
      }
      this.handleSearch()
    },

    handleSearch() {
      this.loading = true
      this.pageNo = 1
      if (this.searchMode === this.searchModeType.fileName) {
        this.searchFileName()
      } else {
        this.searchContent()
      }
    },

    searchFileName() {
      FileRecord({
        keywords: this.keywords,
        fileType: this.filterFileType,
        gradeId: this.gradeId,
        uploadType: 1,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(response => {
        this.$logger.info('FileRecord ', response.result)
        if (response.result && response.result.records) {
          this.dataList = response.result.records
        }
      }).finally(() => {
        this.loading = false
      })
    },

    searchContent () {
      this.loading = true
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        searchKey: this.keywords || '',
        types: [],
        delFlag: 0
      }
      FindMyContent(params).then(res => {
        logger.info('Drive getMyContent', res)
        if (res.success && res.code === 0) {
          this.contentList = res.result.records
        }
      }).finally(() => {
        this.loading = false
      })
    },

    searchFileByContentId (item) {
      FileRecord({
        contentId: item.id,
        contentType: item.type,
        uploadType: 1,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(response => {
        this.$logger.info('FileRecord ', response.result)
        if (response.result && response.result.records) {
          this.fileList = response.result.records
        }
      }).finally(() => {
        this.loading = false
      })
    },

    searchModeChange (e) {
      this.isSearchByContent = e.target.checked
      this.searchMode = this.isSearchByContent ? this.searchModeType.content : this.searchModeType.fileName
      this.$logger.info('searchModeChange now', this.searchMode)
      this.handleSearch()
    },

    handleFileContentItemClick (item) {
      this.$logger.info('handleFileContentItemClick', item)
      this.searchMode = this.searchModeType.contentSubFile
      this.currentContentItem = item
      this.searchFileByContentId(item)
    },

    contentSubGoBack () {
      this.searchMode = this.searchModeType.content
      this.currentContentItem = null
    },

    handleSelectItem(fileItem) {
      if (this.selectedList.indexOf(fileItem) === -1) {
        this.selectedList.push(fileItem)
      } else {
        this.selectedList.splice(this.selectedList.indexOf(fileItem), 1)
      }

      if (this.selectedList.length > this.maxSelectedNum) {
        this.selectedList.splice(0, this.selectedList.length - this.maxSelectedNum)
      }
    },

    handleInsertSelected () {
      this.$logger.info('handleInsertSelected', this.selectedList)
      this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_SELECTED_DRIVE_ITEM, this.selectedList)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.drive-filter {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.drive-content {
  margin-top: 20px;
  height: 430px;
  overflow-y: auto;
  .file-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
    .file-item {
      position: relative;
      margin-right: 13px;
      margin-bottom: 15px;
    }
  }

  .file-list:nth-child(4n) {
    margin-right: 0;
  }

  .list-loading {
    display: flex;
    height: 300px;
    align-items: center;
    justify-content: center;
  }
}

.drive-action {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.content-list {
  padding-right: 10px;
  .content-item {
    background-color: #fff;
    border-radius: 7px;
  }
}

.content-sub-file-back {
  font-size: 15px;
  font-weight: bold;
}

.selected-item {
}

</style>

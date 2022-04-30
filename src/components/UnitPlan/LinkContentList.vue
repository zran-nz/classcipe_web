<template>
  <div class='link-content-list'>
    <div class='search-input'>
      <a-input-search placeholder="input search text" v-model='searchKey' style="width: 300px" enter-button @search="searchContent" />
    </div>
    <div class='display-content-list'>
      <draggable
        data-nodraggable='link-content-list'
        animation="300"
        :sort='false'
        group="content-item"
      >
        <div v-for='(item) in myContentList' :key='item.id' class="group-link-item" :data-item='JSON.stringify(item)'>
          <link-content-item :content='item' style='width: 100%' />
        </div>
      </draggable>
    </div>

    <a-drawer
      :closable="false"
      :visible="previewVisible"
      destroyOnClose
      placement="right"
      width="1000px"
      @close="previewVisible = false"
    >
      <div class="preview-wrapper-row">
        <div class="view-back">
          <a-button type='primary' class='preview-back-btn' shape='round' @click="previewVisible = false"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
        </div>
        <div v-if="previewCurrentId && previewType" class="detail-wrapper">
          <common-preview-v2 :id="previewCurrentId" :type="previewType" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import { FindMyContent } from '@/api/teacher'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DownloadedSvg from '@/assets/libraryv2/downloaded.svg?inline'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import LinkContentItem from '@/components/UnitPlan/LinkContentItem'

export default {
  name: 'LinkContentList',
  components: { LinkContentItem, ContentTypeIcon, draggable, DownloadedSvg, CommonPreviewV2 },
  data () {
    return {
      loading: true,
      pageNo: 0,
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 16
      },
      searchKey: null,
      myContentList: [],
      previewVisible: false,
      previewCurrentId: '',
      previewType: ''
    }
  },
  created() {
    this.loadContent()
  },
  methods: {
    searchContent() {
      this.pageNo = 0
      this.myContentList = []
      this.loadContent()
    },
    loadContent () {
      this.loading = true
      const params = {
        owner: ownerMap['owner-by-me'],
        status: statusMap.published,
        collabrated: false,
        types: [typeMap.task],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchKey ? this.searchKey : '',
        delFlag: 0
      }
      FindMyContent(params).then(res => {
        logger.info('loadContent', res)
        if (res.success) {
          res.result.records.forEach((record, index) => {
            record.key = index
            record.isNoLinkedContent = true
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          if (res.result.records.length === 0 && this.pagination.total > 0) {
            this.pageNo = res.result.pages
            this.loadContent()
          }
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        this.$logger.info('loadContent myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },

    handleViewDetail (item) {
      logger.info('handleViewDetail', item)
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.search-input {
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
}

.content-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }

  .name {
    width: 40%;
    padding-right: 5px;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .status {
    width: 70px;
  }

  .date {
    width: 160px;
    text-align: center;
  }

  .action-area {
    width: 90px;

    .action-item {
      color: #15c39a;
      font-weight: 500;
    }
  }
}

.green-active-task-type {
  background: rgba(21, 195, 154, 0.1);
  border: 2px solid #15C39A;
  border-radius: 50%;
  font-weight: bold;
  color: #15C39A;
}

.red-active-task-type {
  background: rgba(255, 51, 85, 0.1);
  border: 2px solid #FF3355;
  border-radius: 50%;
  opacity: 1;
  font-weight: bold;
  color: #FF3355;
  opacity: 1;
}

.blue-active-task-type {
  background: rgb(230, 247, 255);
  border: 2px solid rgb(145, 213, 255);
  border-radius: 50px;
  opacity: 1;
  font-weight: bold;
  color: rgb(24, 144, 255);
}

.task-type-tag {
  margin-left: 5px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.downloaded-icon {
  cursor: pointer;
  padding-left: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  svg {
    height: 15px;
    width: 15px;
  }
}

.group-link-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  flex: 1;
  position: relative;

  .left-info {
    z-index: 50;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    width: calc(100% - 250px);

    .icon {
      width: 40px;
    }

    &:hover {
      background-color: #fdfdfd;
      cursor: move;
    }

    .name {
      color: #000;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .task-type-tag {
      right: 5px;
      margin-left: 5px;
      border-radius: 20px;
      border-width: 2px;
      font-weight: bold;
    }
  }

  .right-info {
    z-index: 100;
    background-color: #fff;
    position: absolute;
    right: 0;
    padding-left: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .status {
      text-align: right;
      width: 70px;
    }

    .more-action-wrapper {
      width: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

</style>

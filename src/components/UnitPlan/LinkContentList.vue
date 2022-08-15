<template>
  <div class='link-content-list'>
    <div class='content-filter-wrapper'>
      <div class='source-filter'>
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          placeholder='Curriculum'
          v-model='sourceType'
          @change='handleTypeFilter'
          class='cc-select cc-lo-select-mid'>
          <a-select-option value='MyContent' >
            My content
          </a-select-option>
          <a-select-option value='Library' >
            Library
          </a-select-option>
        </a-select>
      </div>
      <div class='content-filter'>
        <content-filter @search='handleSearch' ref='filter'/>
      </div>
    </div>
    <div class='display-content-list'>
      <template v-if='searching'>
        <a-skeleton />
      </template>
      <template v-if='!searching'>
        <draggable
          data-nodraggable='link-content-list'
          animation="300"
          :sort='false'
          group="content-item"
        >
          <div v-for='(item) in myContentList' :key='item.id' class="group-link-item" :data-item='JSON.stringify(item)'>
            <link-content-item :show-delete='false' :content='item' style='width: 100%' @preview='handleViewDetail' />
          </div>
          <template v-if='myContentList.length === 0'>
            <div class='empty-content-list'>
              <common-no-data />
            </div>
          </template>
        </draggable>
      </template>
    </div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import { FindMyContent } from '@/api/teacher'
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DownloadedSvg from '@/assets/libraryv2/downloaded.svg?inline'
import LinkContentItem from '@/components/UnitPlan/LinkContentItem'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import { SourceType } from '@/components/MyContentV2/Constant'
import { QueryContentsFilter } from '@/api/library'
import CommonNoData from '@/components/Common/CommonNoData'
import { mapState } from 'vuex'

export default {
  name: 'LinkContentList',
  components: { CommonNoData, ContentFilter, CustomSearchInput, LinkContentItem, ContentTypeIcon, draggable, DownloadedSvg },
  props: {
    filterTypes: {
      type: Array,
      default: () => []
    },
    selectedIdList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searching: true,
      pageNo: 0,
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 1000
      },
      contentList: [],
      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      sourceType: 'MyContent'
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    }),
    myContentList({ contentList, selectedIdList }) {
      return contentList.filter(item => selectedIdList.indexOf(item.id) === -1)
    }
  },
  watch: {
    selectedIdList(newVal) {
      console.log('selectedIdList', newVal)
    }
  },
  created() {
    this.handleSearch({})
    this.$EventBus.$on('refresh-link-content-list', this.handleTypeFilter)
  },
  beforeDestroy() {
    this.$EventBus.$off('refresh-link-content-list', this.handleTypeFilter)
  },
  methods: {
    handleTypeFilter () {
      this.$logger.info('handleTypeFilter selectedIdList', this.selectedIdList)
      this.$refs.filter.triggerSearch()
    },
    handleSearch (data) {
      this.$logger.info('handleSearch data', data)
      this.searching = true
      if (this.sourceType === 'MyContent') {
        this.searchContent(data)
      } else if (this.sourceType === 'Library') {
        this.searchLibrary(data)
      }
    },
    searchContent(data) {
      this.pageNo = 0
      this.contentList = []
      this.loadContent(data)
    },
    searchLibrary (data) {
      this.pageNo = 0
      this.contentList = []
      this.loadLibrary(data)
    },
    loadContent (data) {
      data.schoolId = this.currentSchool?.id
      data.pageNo = this.pageNo
      data.shareType = SourceType.CreatedByMe
      data.pageSize = this.pagination.pageSize
      data.types = this.filterTypes

      FindMyContent(data).then(res => {
        logger.info('loadContent', res)
        if (res.success) {
          res.result.records.forEach((record, index) => {
            record.key = index
            record.isNoLinkedContent = true
          })
          this.contentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          if (res.result.records.length === 0 && this.pagination.total > 0) {
            this.pageNo = res.result.pages
            this.loadContent()
          }
        } else {
          this.contentList = []
          this.pagination.total = 0
        }
        this.$logger.info('loadContent contentList', this.contentList)
      }).finally(() => {
        this.searching = false
      })
    },
    loadLibrary (data) {
      this.$logger.info('loadLibrary', data)
      data.type = this.filterTypes
      QueryContentsFilter(data).then(response => {
        if (response.result) {
          this.contentList = response.result
        }
      }).finally(() => {
        this.searching = false
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

.empty-content-list {
  width: 100%;
  height: 200px;
}

.content-filter-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.display-content-list {
  padding-right: 10px;
  max-height: calc(100vh - 230px);
  overflow-y: scroll;
}

.item-checked-icon {
  position: absolute;
  top: 10px;
  right: 0;
  z-index: 100;
  margin-top: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 25px;
  margin-right: 5px;
  .empty-circle {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  img {
    width: 18px;
    height: 18px;
  }
}

.selected-item {
  .link-content-item {
    border: 2px solid #15C39A;
  }
}

</style>

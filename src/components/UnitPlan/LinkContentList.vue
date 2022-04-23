<template>
  <div class='link-content-list'>
    <div class='search-input'>
      <a-input-search placeholder="input search text" v-model='searchKey' style="width: 300px" enter-button @search="searchContent" />
    </div>
    <div class='display-content-list'>
      <draggable
        animation="300"
        group="root">
        <div class='content-item' v-for='(item) in myContentList' :key='item.id'>
          <div class='type-icon'>
            <content-type-icon :type='item.type'/>
          </div>
          <div class='name'> {{ item.name }}</div>
          <div class='status'>
            <template v-if="item.status === 0">Draft</template>
            <template v-if="item.status === 1">Published</template>
          </div>
          <div class='date'>{{ item.updateTime }}</div>
          <div class='action-area'>
            <div class='action-item'>Preview</div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import { FindMyContent } from '@/api/teacher'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
export default {
  name: 'LinkContentList',
  components: { ContentTypeIcon, draggable },
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
      myContentList: []
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

</style>

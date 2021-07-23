<template>
  <div class="content-sidebar">
    <template v-if="!loading">
      <div class="main-name" >
        <span class="name-label">
          <a-tooltip :title="name">> {{ name }} </a-tooltip>
        </span>
      </div>
      <div class="sub-list">
        <div class="sub-item" v-for="(item,index) in associateList" :key="index" @click="handleViewItem(item)">
          <  {{ item.name }}
        </div>
      </div>
    </template>
    <template v-if="loading">
      <div class="main-loading">
        <a-spin />
      </div>
    </template>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { GetAssociate } from '@/api/teacher'
export default {
  name: 'AssociateSidebar',
  components: {
    ContentTypeIcon
  },
  props: {
    name: {
      type: String,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: true,
      typeMap: typeMap,
      associateList: []
    }
  },
  watch: {
    id (newId) {
      this.$logger.info('loadAssociateData change id', newId)
      if (newId) {
        this.loadAssociateData()
      }
    }
  },
  created () {
    this.$logger.info('AssociateSidebar id ' + this.id + ' type ' + this.type)
    if (this.id) {
      this.loadAssociateData()
    } else {
      this.loading = false
    }
  },
  methods: {
    handleViewItem (item) {
      this.$logger.info('handleViewItem ', item)

      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap['topic']) {
        window.open('/expert/topic-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap['material']) {
        window.open('/teacher/add-material/' + item.id, '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap.lesson) {
        window.open('/teacher/lesson-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id, '_blank')
      }
    },
    loadAssociateData () {
      GetAssociate({
        id: this.id,
        type: this.type
      }).then(response => {
        this.$logger.info('AssociateSidebar GetAssociate response', response)
        const owner = response.result.owner
        const others = response.result.owner
        const associateList = []
        owner.forEach(item => {
          const itemType = item.type
          const itemTypeName = item.typeName
          item.datas.forEach(dataItem => {
            if (dataItem.lists.length) {
              dataItem.lists.forEach(aItem => {
                associateList.push({
                  itemType,
                  itemTypeName,
                  ...aItem
                })
              })
            }
          })
        })

        others.forEach(item => {
          const itemType = item.type
          const itemTypeName = item.typeName
          item.datas.forEach(dataItem => {
            if (dataItem.lists.length) {
              dataItem.lists.forEach(aItem => {
                associateList.push({
                  itemType,
                  itemTypeName,
                  ...aItem
                })
              })
            }
          })
        })

        this.$logger.info('associateList', associateList)
        this.associateList = associateList
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-sidebar {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  .main-loading {
    padding: 20px;
    margin: auto;
  }
  .main-name {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    .name-label {
      padding-left: 5px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 500;
      color: @primary-color;
    }
    padding: 5px 0;
  }

  .sub-list {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .sub-item {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      padding: 3px 0;
      color: @primary-color;
    }
  }
}
</style>

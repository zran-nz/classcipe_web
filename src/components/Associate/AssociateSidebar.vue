<template>
  <div class="content-sidebar">
    <template v-if="!loading">
      <div class="content-collapse">
        <a-collapse default-active-key="1" :bordered="false">
          <a-collapse-panel key="1" :header="name">
            <div class="sub-list" v-if="associateList.length > 0">
              <div class="sub-item" v-for="(item,index) in associateList" :key="index">
                <div class="icon" @click="handleViewItem(item)">
                  <content-type-icon :type="item.type" size="20px" />
                </div>
                <div class="name" @click="handleViewItem(item)">
                  {{ item.name }}
                </div>
                <div class="cancel-associate">

                  <a-popconfirm
                    title="Cancel associate?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleCancelAssociate(item)"
                  >
                    <a-icon type="close" />
                  </a-popconfirm>

                </div>
              </div>
            </div>
            <div class="sub-empty" v-if="!associateList.length">
              No data
            </div>
          </a-collapse-panel>
        </a-collapse>
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
import { GetAssociate, AssociateCancel } from '@/api/teacher'
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
  mounted () {
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
      this.loading = true
      GetAssociate({
        id: this.id,
        type: this.type
      }).then(response => {
        this.$logger.info('AssociateSidebar GetAssociate response', response)
        const owner = response.result.owner
        const others = response.result.others
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
    },
    handleCancelAssociate (item) {
      this.$logger.info('handleCancelAssociate', item)
      AssociateCancel({
        fromId: this.id,
        fromType: this.type,
        toId: item.id,
        toType: item.type
      }).then(response => {
        this.$logger.info('handleCancelAssociate response ', response)
        // 刷新子组件的关联数据
        this.loadAssociateData()
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
  margin-bottom: 15px;
  .main-loading {
    padding: 20px;
    margin: auto;
  }

  .content-collapse {

    .sub-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .sub-item {
        width: 100%;
        padding: 8px 15px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        position: relative;

        .icon {
          min-width: 23px;
        }

        .name {
          padding-left: 6px;
        }
      }
      .sub-item:hover {
        color: @primary-color;
      }

      .sub-item:hover {
        background: rgba(21, 195, 154, 0.1);
      }
    }
  }
}

.sub-empty {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  padding-top: 10px;
  padding-bottom: 10px;
}

.cancel-associate {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>

<template>
  <div class="unit-menu-list">
    <div class="menu-category-item parent-data" v-if="parentAssociateList.length > 0">
      <div class="content-sidebar">
        <div class="content-collapse parent-content">
          <div class="sub-list">
            <div class="sub-item" v-for="(item,index) in parentAssociateList" :key="index">
              <div class="icon" @click="handleViewItem(item)">
                <content-type-icon :type="item.type" size="20px" />
              </div>
              <div class="name" @click="handleViewItem(item)">
                {{ item.name ? item.name : 'Unnamed' }}
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
        </div>
      </div>
    </div>
    <div class="menu-category-item current-data">
      <div class="action-bar-wrapper">
        <div class="editing-item">
          <div class="name">
            {{ name ? name : "Unnamed" }}
          </div>
          <div class="cancel-associate">
          </div>
        </div>
        <div class="action-create" @click="handleCreateEvent" v-show="showCreate">
          <div class="action-icon">
            <img src="~@/assets/icons/common/sidebar/jianli_icon@2x.png" />
          </div>
          <div class="action-label">Create new under current</div>
        </div>
        <div class="action-link" @click="handleLinkEvent">
          <div class="action-icon">
            <img src="~@/assets/icons/common/sidebar/Link@2x.png" />
          </div>
          <div class="action-label">Link in my content</div>
        </div>
      </div>
    </div>
    <div class="menu-category-item  sub-data" v-if="subAssociateList.length > 0">
      <div class="content-sidebar">
        <div class="content-collapse sub-content">
          <div class="sub-list">
            <div class="sub-item" v-for="(item,index) in subAssociateList" :key="index">
              <div class="icon" @click="handleViewItem(item)">
                <content-type-icon :type="item.type" size="20px" />
              </div>
              <div class="name" @click="handleViewItem(item)">
                {{ item.name ? item.name : 'Unnamed' }}
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
        </div>
      </div>
    </div>
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
    },
    showCreate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      typeMap: typeMap,
      associateList: [],
      parentAssociateList: [],
      subAssociateList: []
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
    this.$logger.info('AssociateSidebar id ' + this.id + ' type ' + this.type + 'name' + this.name)
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

        /**
         * Unit plan 只有下级页面，没有上级页面

         Topic 只有下级页面，没有上级页面

         Lesson/Task 既有下级页面Evaluation，也有上级页面Unit plan

         Evaluation只有上级页面，没有下级页面
         Unit plan > Lesson

         Unit plan/Topic > task

         Lesson > Evaluation

         Task > Evaluation
         * @type {string}
         */
        this.parentName = null
        this.subName = null
        if (this.type === this.typeMap['unit-plan'] || this.type === this.typeMap.topic) {
          // 没有上级，所有的都是下级
          this.subAssociateList = this.associateList
        }

        if (this.type === this.typeMap.lesson || this.type === this.typeMap.task) {
          // 上级只能是task或者unit plan
          this.parentAssociateList = this.associateList.filter(aItem => aItem.type === this.typeMap['unit-plan'] || aItem.type === this.typeMap.topic)

          // 下级页面Evaluation Task
          this.subAssociateList = this.associateList.filter(aItem => aItem.type === this.typeMap.evaluation || aItem.type === this.typeMap.task)
        }

        if (this.type === this.typeMap.evaluation) {
          // 只有上级
          this.parentAssociateList = this.associateList
        }

        this.$logger.info('associateList ', this.associateList, ' parentAssociateList ', this.parentAssociateList, ' subAssociateList', this.subAssociateList)
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
    },

    handleLinkEvent () {
      this.$logger.info('handelLinkEvent')
      this.$emit('link')
    },

    handleCreateEvent () {
      this.$logger.info('handleCreateEvent')
      this.$emit('create')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-sidebar {
  display: flex;
  flex-direction: column;
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
        padding: 10px 2px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        position: relative;
        font-size: 14px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #000000;

        .icon {
          min-width: 23px;
        }

        .name {
          padding-left: 6px;
          padding-right: 10px;
          word-break: break-all;
        }
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
  right: 5px;
  top: 10px;
  color:red;
}

.action-bar-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 0 10px;
  color: #fff;
  .action-create {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 10px;
    background: rgba(255, 51, 85, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;

    .action-icon {
      img {
        height: 15px;
      }
    }

    .action-label {
      font-size: 12px;
      padding-left: 8px;
    }
  }

  .action-link {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 10px;
    background: rgba(21, 195, 154, 1);
    box-shadow:  0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;

    .action-icon {
      img {
        height: 15px;
      }
    }

    .action-label {
      font-size: 12px;
      padding-left: 8px;
    }
  }
}

.unit-menu-list {
  margin-top: 10px;
  padding: 0 0 16px 0;

  .menu-category-item {
    user-select: none;
    cursor: pointer;

    .menu-category-item-label {
      font-weight: 600;
      padding: 10px 0;
    }

    .menu-category-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .include-item {
        color: @primary-color;
        padding: 5px 0;
        max-width: 100%;
        text-decoration: underline;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .action-item {
      color: @primary-color;
      padding: 5px 0;
      text-decoration: underline;
    }
  }

  .already-add-to-list {
    .add-to-type {
      border-right: none;
      color: @text-color;
      .add-to-type-label {
        padding: 15px 0 5px 0;
        cursor: pointer;
      }
      .add-to-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
    }
  }
}

.parent-content {
  .ant-collapse-header {
    background: rgba(21, 195, 154, 0.1);
  }
}

.sub-content {
  .ant-collapse-header {
    background: rgba(228, 228, 228, 0.2);
  }
}

.content-collapse {

  .ant-collapse-item {
    border-bottom: none;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }
}

.editing-item {
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;

  .icon {
    min-width: 23px;
  }

  .name {
    padding-left: 6px;
    padding-right: 10px;
    word-break: break-all;
  }
}

.parent-data {
  background: rgba(228, 228, 228, 0.1);
}

.current-data {
  padding-left: 30px;
  padding-right: 10px;
  background: rgba(21, 195, 154, 0.1);
}

.sub-data {
  padding-left: 50px;
  background: rgba(228, 228, 228, 0.1);
}
</style>

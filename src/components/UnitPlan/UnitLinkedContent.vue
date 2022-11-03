<template>
  <div class='unit-linked-content'>
    <div class='header-action' v-if='canEdit'>
      <a-space>
        <custom-text-button label='Add new task' @click='handleAddNew'>
          <template v-slot:icon>
            <a-spin v-if='creatingTask'></a-spin>
          </template>
        </custom-text-button>
        <custom-text-button label='Add category' @click='handleAddCategory'>
          <template slot='icon'>
            <a-icon type='plus-circle' />
          </template>
        </custom-text-button>
      </a-space>
    </div>
    <div class='no-category-linked-content'>

    </div>
    <div class='linked-content'>
      <draggable
        v-model="groups"
        :disabled="!canEdit"
        animation="300"
        group="category">
        <div
          class='linked-category'
          v-for='(groupItem) in groups'
          :key='groupItem.groupName'>
          <div class='category-name' :style="{'background-color': '#DEF1EE'}" v-show='groupItem.groupName'>
            {{ groupItem.groupName }}
          </div>
          <div class='delete-category' v-show='groupItem.groupName' v-if="canEdit">
            <a-popconfirm cancel-text="No" ok-text="Yes" title="Delete ?" @confirm="handleDeleteGroup(groupItem)">
              <delete-icon color='#F16A39' />
            </a-popconfirm>
          </div>
          <draggable
            v-model="groupItem.contents"
            :disabled="!canEdit"
            animation="300"
            group="content-item"
            style="width: 100%; min-height: 50px"
            :move='handleOnMve'
            @add="handleDragContent($event, groupItem)">
            <div class='linked-item' v-for='content in groupItem.contents' :key='content.id' :data-item='JSON.stringify(content)' :data-inner='true'>
              <link-content-item :content='content' :show-delete='canEdit' @delete='handleDeleteLinkItem' />
            </div>
            <template v-if='allEmpty'>
              <div class='no-linked-data'>
                <common-no-data text='No linked content, please Add content.' />
              </div>
            </template>
          </draggable>
        </div>
        <template v-if='groups.length === 0'>
          <div class='no-linked-data'>
            <common-no-data text='No linked content, please Add category.' />
          </div>
        </template>
      </draggable>
    </div>

    <linked-category v-if='addCategoryVisible && canEdit' @close='addCategoryVisible = false' @confirm='handleConfirmAddCategory'/>
  </div>
</template>

<script>
import LinkedCategory from '@/components/UnitPlan/LinkedCategory'
import {
  AddOrSaveGroupName,
  Associate,
  AssociateCancel,
  DeleteGroup,
  GetAssociate
} from '@/api/teacher'
import LinkContentItem from '@/components/UnitPlan/LinkContentItem'
import draggable from 'vuedraggable'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomTextButton from '@/components/Common/CustomTextButton'
import CommonNoData from '@/components/Common/CommonNoData'
import { TaskAddOrUpdate } from '@/api/task'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'

export default {
  name: 'UnitLinkedContent',
  components: { CommonNoData, CustomTextButton, DeleteIcon, LinkContentItem, LinkedCategory, draggable },
  props: {
    fromId: {
      type: String,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      linkGroupLoading: true,
      addCategoryVisible: false,
      groups: [],
      ownerLinkGroupList: [],
      color: [
        '#DEF1EE',
        '#FAE7D1',
        '#DEEFF1',
        '#F4F4F4'
      ],
      associateTaskIdList: [],
      associateTaskList: [],
      associateId2Name: new Map(),
      creatingTask: false
    }
  },
  created() {
    console.info('UnitLinkedContent ' + this.fromId)
    this.getAssociate()
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAddNew)
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAddNew)
  },
  computed: {
    groupNameList () {
      const result = []
      this.groups.forEach(group => {
        result.push(group.groupName)
      })
      return result
    },
    allEmpty () {
      return this.groups.every(group => group.contents.length === 0) && this.groups.length <= 1
    }
  },
  methods: {
    handleAddNew () {
      if (this.creatingTask) {
        return
      }

      const data = {
        name: 'Untitled task',
        status: 0
      }
      this.creatingTask = true

      TaskAddOrUpdate(data).then((response) => {
        console.info('TaskAddOrUpdate response', response.result)
        if (response.success) {
          if (response.code !== 520 && response.code !== 403) {
            // 关联当前unit与task
            const taskId = response.result.id

            const associateData = {
              fromId: this.fromId,
              fromType: this.$classcipe.typeMap['unit-plan'],
              groupName: 'Relevant Unit Plan(s)',
              otherContents: [
                {
                  toId: taskId,
                  toType: this.$classcipe.typeMap.task,
                  linkCategory: 'MyContent'
                }
              ]
            }
            Associate(associateData).then((res) => {
              console.info('associate success')
              this.$router.push('/teacher/add-task-v2/' + taskId)
            }).finally(() => {
              this.creatingTask = false
            })
          } else {
            console.info('等待授权回调')
          }
        } else {
          this.$message.error(response.message)
        }
      }).catch((e) => {
        this.$logger.error(e)
        this.creatingTask = false
      })
    },
    handleAddCategory () {
      this.addCategoryVisible = true
    },

    handleConfirmAddCategory (selectedCategoryList) {
      console.info('handleConfirmAddCategory', selectedCategoryList)
      this.addCategoryVisible = false
      const newGroupNameList = []
      selectedCategoryList.forEach(groupName => {
        this.ownerLinkGroupList.findIndex(group => group.group === groupName) === -1 && newGroupNameList.push(groupName)
      })
      this.handleAddTerm(newGroupNameList)
      console.info('newGroupNameList', newGroupNameList)
    },

    async getAssociate () {
      console.info('GetAssociate id[' + this.fromId)
      if (!this.fromId) {
        return
      }
      this.associateUnitList = []
      this.associateUnitIdList = []
      this.associateTaskList = []
      this.associateTaskIdList = []
      this.associateId2Name.clear()
      this.linkGroupLoading = true
      const response = await GetAssociate({
        id: this.fromId,
        type: this.$classcipe.typeMap['unit-plan'],
        published: 0
      })

      console.info('UnitLinkedContent getAssociate', response)
      const isExistEmptyGroup = response.result.groups.some(group => group.groupName === '')
      response.result.owner.forEach(ownerItem => {
        const groupItem = response.result.groups.find(group => group.groupName === ownerItem.group)
        if (groupItem) {
          ownerItem.groupId = groupItem.id
          groupItem.contents = JSON.parse(JSON.stringify(ownerItem.contents))
        }
      })
      this.ownerLinkGroupList = response.result.owner
      response.result.groups.sort((g1, g2) => {
        if (g1.name) {
          return -1
        } else {
          return 1
        }
      })
      const groups = response.result.groups
      console.info('GetAssociate owner', this.ownerLinkGroupList)

      this.ownerLinkGroupList.forEach(group => {
        const targetGroup = groups.find(item => item.groupName === group.group || (group.group === 'Relevant Unit Plan(s)' && item.groupName === ''))
        group.contents.forEach(content => {
          if (content.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitIdList.push(content.id)
            this.associateId2Name.set(content.id, content.name)
            this.associateUnitList.push(content)
          }

          if (content.type === this.$classcipe.typeMap.task) {
            this.associateTaskIdList.push(content.id)
            this.associateId2Name.set(content.id, content.name)
            this.associateTaskList.push(content)
          }
          if (targetGroup && !targetGroup.contents.some(item => item.id === content.id)) {
            targetGroup.contents.push(JSON.parse(JSON.stringify(content)))
          }
        })
      })
      this.groups = groups
      console.info('groups', groups)
      this.associateUnitIdList = Array.from(new Set(this.associateUnitIdList))
      this.associateTaskIdList = Array.from(new Set(this.associateTaskIdList))
      console.info('GetAssociate associateUnitIdList', this.associateUnitIdList)
      console.info('GetAssociate associateTaskIdList', this.associateTaskIdList)
      this.$emit('update-unit-id-list', this.associateUnitIdList)
      this.$emit('update-task-id-list', this.associateTaskIdList)
      this.linkGroupLoading = false
      if (!isExistEmptyGroup) {
        await AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.$classcipe.typeMap['unit-plan'],
          groupName: ''
        })
        await this.getAssociate()
      }
    },

    async handleDragContent (event, groupItem) {
      console.info('UnitLinkedContent handleDropContent', event, groupItem)
      event.item.style.display = 'none'
      const itemData = JSON.parse(event.item.dataset.item)
      event.item?.parentElement && event.item.parentElement.removeChild(event.item)
      console.info('item data', itemData)
      console.info('item inner', event.item.dataset.inner)

      if (event.item.dataset.inner) {
        await this.handleDeleteLinkItem(itemData, false)
      }
      const associateData = {
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        groupName: groupItem.groupName,
        otherContents: [
          {
            toId: itemData.id,
            toType: itemData.type,
            linkCategory: itemData.linkCategory
          }
        ]
      }
      console.info('associateData', associateData)
      await Associate(associateData)
      await this.getAssociate()
    },

    async handleDeleteGroup (group) {
      console.info('handleDeleteGroup', group)
      const jobList = []
      group.contents.forEach(content => {
        jobList.push(AssociateCancel({
          fromId: this.fromId,
          fromType: this.$classcipe.typeMap['unit-plan'],
          toId: content.id,
          toType: content.type
        }).then(response => {
          console.info('handleDeleteLinkItem response ', response)
        }))
      })

      await Promise.all(jobList)

      console.info('handleDeleteGroup all contents')
      DeleteGroup({
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        id: group.id
      }).then(async response => {
        console.info('DeleteGroup', response)
        await this.getAssociate()
      }).finally(() => {
        this.$EventBus.$emit('refresh-link-content-list')
      })
    },

    async handleAddTerm(newGroupNameList) {
      console.info('handleAddTerm', this.groupNameList)
      const jobList = []
      for (let i = 0; i < newGroupNameList.length; i++) {
        jobList.push(AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.$classcipe.typeMap['unit-plan'],
          groupName: newGroupNameList[i]
        }))
      }
      await Promise.all(jobList)
      await this.getAssociate()
    },

    handleOnMve(e) {
      console.log('handleOnMve', e.to.dataset)
      if (e.to.dataset['nodraggable']) {
        return false
      }
      return true
    },

    async handleDeleteLinkItem (item, refresh = true) {
      console.info('handleDeleteLinkItem', item)
      const response = await AssociateCancel({
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        toId: item.id,
        toType: item.type
      })
      console.info('handleDeleteLinkItem response ', response)
      // 刷新子组件的关联数据
      if (refresh) {
        await this.getAssociate()
      }
      this.$nextTick(() => {
        this.$EventBus.$emit('refresh-link-content-list')
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.header-action {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.category-name {
  cursor: pointer;
  padding: 10px 15px;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  position: relative;

  .category-delete {
    cursor: pointer;
    display: none;
    position: absolute;
    left: -30px;
    top: 0;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 42px;
  }

  &:hover {
    .category-delete {
      display: flex;
    }
  }
}

.unit-linked-content {
  .linked-content {
    margin-top: 15px;
  }
}

.linked-item {
  position: relative;
  .linked-item-deleted {
    cursor: pointer;
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }

  &:hover {
    .linked-item-deleted {
      display: flex;
    }
  }
}

.no-linked-data {
  height: 200px;
}

.linked-category {
  position: relative;

  .delete-category {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 14px;
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    .delete-category {
      display: flex;
    }
  }
}

</style>

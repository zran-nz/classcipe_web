<template>
  <div class='unit-linked-content'>
    <div class='linked-content'>
      <div
        class='linked-category'
        v-for='(groupItem, gIdx) in ownerLinkGroupList'
        :key='gIdx'>
        <draggable
          class='list-group'
          v-model="groupItem.contents"
          :disabled="!canEdit"
          animation="300"
          group="content-item"
          :move='handleOnMve'
          @add="handleDragContent($event)">
          <div class='linked-item' v-for='content in groupItem.contents' :key='content.id'>
            <link-content-item :content='content' :show-delete='canEdit' @delete='handleDeleteLinkItem' />
          </div>
        </draggable>
      </div>
      <div class='init-group' v-if='ownerLinkGroupList.length === 0'>
        <draggable
          class='list-group'
          v-model="initContents"
          :disabled="!canEdit"
          animation="300"
          group="content-item"
          style="width: 100%; min-height: 50px"
          :move='handleOnMve'
          @add="handleDragContent($event)">
          <div class='linked-item' v-for='content in initContents' :key='content.id'>
            <link-content-item :content='content' :show-delete='canEdit' @delete='handleDeleteLinkItem' />
          </div>
          <template v-if='initContents.length === 0'>
            <div class='no-linked-data'>
              <common-no-data text='No linked content, please drag content from right side here' />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <linked-category v-if='addCategoryVisible' @close='addCategoryVisible = false' @confirm='handleConfirmAddCategory'/>
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
import CommonNoData from '@/components/Common/CommonNoData'

export default {
  name: 'FormLinkedContent',
  components: { CommonNoData, DeleteIcon, LinkContentItem, LinkedCategory, draggable },
  props: {
    fromId: {
      type: String,
      required: true
    },
    fromType: {
      type: Number,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    filterTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      linkGroupLoading: true,
      addCategoryVisible: false,
      groups: [],
      ownerLinkGroupList: [],
      color: [
        '#fa525211',
        '#12b88611',
        '#fab00511'
      ],
      associateUnitIdList: [],
      associateUnitList: [],
      associateId2Name: new Map(),

      associateTaskIdList: [],
      associateTaskList: [],

      initContents: []
    }
  },
  created() {
    console.info('FormLinkedContent ' + this.fromId)
    this.getAssociate()
  },
  computed: {
    groupNameList () {
      const result = []
      this.groups.forEach(group => {
        result.push(group.groupName)
      })
      return result
    }
  },
  methods: {
    handleAddNew () {

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
      console.info('GetAssociate id[' + this.fromId + '] [type:' + this.fromType + ']')
      if (!this.fromId) {
        return
      }
      this.associateUnitList = []
      this.associateUnitIdList = []
      this.associateUnitIdList = []
      this.associateTaskList = []
      this.associateId2Name.clear()
      this.linkGroupLoading = true
      const response = await GetAssociate({
        id: this.fromId,
        type: this.fromType,
        published: 0
      })

      console.info('UnitLinkedContent getAssociate', response)
      response.result.owner.forEach(ownerItem => {
        const groupItem = response.result.groups.find(group => group.groupName === ownerItem.group || (group.groupName === 'Relevant Unit Plan(s)' && ownerItem.group === ''))
        const contentList = JSON.parse(JSON.stringify(ownerItem.contents))
        console.log('contentList', contentList, 'groupItem', groupItem)
        if (groupItem) {
          ownerItem.groupId = groupItem.id
          let contents = []
          if (this.filterTypes.length && contentList?.length) {
            console.info('filterTypes', this.filterTypes)
            contentList.forEach(item => {
              if (this.filterTypes.indexOf(item.type) !== -1) {
                contents.push(item)
              }
            })
          } else {
            contents = contentList
          }
          ownerItem.contents = contents
          console.info('filterTypes contents', contents)
        } else {
          let contents = []
          if (this.filterTypes.length && contentList?.length) {
            console.info('else filterTypes', this.filterTypes)
            contentList.forEach(item => {
              if (this.filterTypes.indexOf(item.type) !== -1) {
                contents.push(item)
              }
            })
          } else {
            contents = contentList
          }
          ownerItem.contents = contents
        }
      })
      this.ownerLinkGroupList = response.result.owner
      this.groups = response.result.groups
      console.info('ownerLinkGroupList', this.ownerLinkGroupList)

      this.ownerLinkGroupList.forEach(group => {
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
        })
      })
      this.$emit('update-unit-id-list', this.associateUnitIdList)
      this.$emit('update-task-id-list', this.associateTaskIdList)
      this.linkGroupLoading = false
    },

    // 当拖入内容时，先隐藏dom，然后提取数据后删除组件插入的dom，随后手动处理数据，方便Vue监听
    async handleDragContent (event) {
      console.info('UnitLinkedContent handleDropContent', event)
      event.item.style.display = 'none'
      const itemData = JSON.parse(event.item.dataset.item)
      event.item.parentElement.removeChild(event.item)
      console.info('item data', itemData)

      let groupName
      if (itemData.type === this.$classcipe.typeMap['unit-plan']) {
        groupName = 'Relevant Unit Plan(s)'
      } else if (itemData.type === this.$classcipe.typeMap.evaluation) {
        groupName = 'Linked assessment tool(s)'
      } else {
        groupName = 'Linked content(s)'
      }
      const associateData = {
        fromId: this.fromId,
        fromType: this.fromType,
        groupName: groupName,
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
      const response = await DeleteGroup({
        fromId: this.fromId,
        fromType: this.fromType,
        id: group.id
      })
      console.info('DeleteGroup', response)
      await this.getAssociate()
      this.$nextTick(() => {
        this.$EventBus.$emit('refresh-link-content-list')
      })
    },

    async handleAddTerm(newGroupNameList) {
      console.info('handleAddTerm', this.groupNameList)
      for (let i = 0; i < newGroupNameList.length; i++) {
        await AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.fromType,
          groupName: newGroupNameList[i]
        })
      }
      await this.getAssociate()
    },

    handleOnMve(e) {
      console.log('handleOnMve', e.to.dataset)
      if (e.to.dataset['nodraggable']) {
        return false
      }
      return true
    },

    async handleDeleteLinkItem (item) {
      console.info('handleDeleteLinkItem', item)
      const response = await AssociateCancel({
        fromId: this.fromId,
        fromType: this.fromType,
        toId: item.id,
        toType: item.type
      })
      console.info('handleDeleteLinkItem response ', response)
      await this.getAssociate()
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
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.category-name {
  cursor: pointer;
  padding: 10px;
  color: #333;
  font-size: 15px;
  font-weight: 400;
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
  padding: 0 15px;
}

.linked-item {
  position: relative;
  .linked-item-deleted {
    cursor: pointer;
    display: none;
    position: absolute;
    left: -30px;
    top: 0;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 100%;
  }

  &:hover {
    .linked-item-deleted {
      display: flex;
    }
  }
}

.list-group {
  min-height: 100px;
}

.no-linked-data {
  height: 200px;
}

</style>

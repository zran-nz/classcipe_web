<template>
  <div class='unit-linked-content'>
    <div class='header-action'>
      <a-space>
        <custom-text-button label='Add new task' @click='handleAddNew'></custom-text-button>
        <custom-text-button label='Add category' @click='handleAddCategory'>
          <template slot='icon'>
            <a-icon type='plus-circle' />
          </template>
        </custom-text-button>
      </a-space>
    </div>
    <div class='linked-content'>
      <draggable
        v-model="groups"
        :disabled="!canEdit"
        animation="300"
        group="category">
        <div
          class='linked-category'
          v-for='(groupItem, gIdx) in groups'
          :key='groupItem.groupName'>
          <div class='category-name' :style="{'background-color': color[gIdx]}">
            {{ groupItem.groupName }}
            <div class='category-delete' v-if="canEdit">
              <a-popconfirm title="Delete category ?" ok-text="Yes" @confirm="handleDeleteGroup(groupItem)" cancel-text="No">
                <delete-icon />
              </a-popconfirm>
            </div>
          </div>
          <draggable
            v-model="groupItem.contents"
            :disabled="!canEdit"
            animation="300"
            group="content-item"
            style="width: 100%; min-height: 50px"
            :move='handleOnMve'
            @add="handleDragContent($event, groupItem)">
            <div class='linked-item' v-for='content in groupItem.contents' :key='content.id'>
              <div class='linked-item-deleted'>
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteLinkItem(content)" cancel-text="No">
                  <delete-icon />
                </a-popconfirm>
              </div>
              <link-content-item :content='content' />
            </div>
          </draggable>
        </div>
        <template v-if='groups.length === 0'>
          <div class='no-linked-data'>
            <common-no-data text='No linked content, please Add category.' />
          </div>
        </template>
      </draggable>
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
import CustomTextButton from '@/components/Common/CustomTextButton'
import CommonNoData from '@/components/Common/CommonNoData'

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
      associateId2Name: new Map()
    }
  },
  created() {
    this.$logger.info('UnitLinkedContent ' + this.fromId)
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
      window.open('/teacher/task-redirect')
    },
    handleAddCategory () {
      this.addCategoryVisible = true
    },

    handleConfirmAddCategory (selectedCategoryList) {
      this.$logger.info('handleConfirmAddCategory', selectedCategoryList)
      this.addCategoryVisible = false
      const newGroupNameList = []
      selectedCategoryList.forEach(groupName => {
        this.ownerLinkGroupList.findIndex(group => group.group === groupName) === -1 && newGroupNameList.push(groupName)
      })
      this.handleAddTerm(newGroupNameList)
      this.$logger.info('newGroupNameList', newGroupNameList)
    },

    async getAssociate () {
      this.$logger.info('GetAssociate id[' + this.fromId)
      this.linkGroupLoading = true
      await GetAssociate({
        id: this.fromId,
        type: this.$classcipe.typeMap['unit-plan'],
        published: 0
      }).then(response => {
        this.$logger.info('UnitLinkedContent getAssociate', response)
        response.result.owner.forEach(ownerItem => {
          const groupItem = response.result.groups.find(group => group.groupName === ownerItem.group)
          if (groupItem) {
            ownerItem.groupId = groupItem.id
            groupItem.contents = JSON.parse(JSON.stringify(ownerItem.contents))
          }
        })
        this.ownerLinkGroupList = response.result.owner
        this.groups = response.result.groups
        this.$logger.info('ownerLinkGroupList', this.ownerLinkGroupList)

        this.ownerLinkGroupList.forEach(group => {
          group.contents.forEach(content => {
            if (content.type === this.$classcipe.typeMap.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              this.associateTaskList.push(content)
            }
          })
        })
      }).finally(() => {
        this.linkGroupLoading = false
      })
    },

    // 当拖入内容时，先隐藏dom，然后提取数据后删除组件插入的dom，随后手动处理数据，方便Vue监听
    async handleDragContent (event, groupItem) {
      this.$logger.info('UnitLinkedContent handleDropContent', event, groupItem)
      event.item.style.display = 'none'
      const itemData = JSON.parse(event.item.dataset.item)
      event.item.parentElement.removeChild(event.item)
      this.$logger.info('item data', itemData)

      const associateData = {
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        groupName: groupItem.groupName,
        otherContents: [
          {
            toId: itemData.id,
            toType: itemData.type
          }
        ]
      }

      this.$logger.info('associateData', associateData)
      await Associate(associateData)
      this.getAssociate()
    },

    handleDeleteGroup (group) {
      this.$logger.info('handleDeleteGroup', group)
      DeleteGroup({
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        id: group.id
      }).then(response => {
        this.$logger.info('DeleteGroup', response)
        this.getAssociate()
      })
    },

    async handleAddTerm(newGroupNameList) {
      this.$logger.info('handleAddTerm', this.groupNameList)
      for (let i = 0; i < newGroupNameList.length; i++) {
        await AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.$classcipe.typeMap['unit-plan'],
          groupName: newGroupNameList[i]
        })
      }
      this.getAssociate()
    },

    handleOnMve(e) {
      console.log('handleOnMve', e.to.dataset)
      if (e.to.dataset['nodraggable']) {
        return false
      }
      return true
    },

    handleDeleteLinkItem (item) {
      this.$logger.info('handleDeleteLinkItem', item)
      AssociateCancel({
        fromId: this.fromId,
        fromType: this.fromType,
        toId: item.id,
        toType: item.type
      }).then(response => {
        this.$logger.info('handleDeleteLinkItem response ', response)
        // 刷新子组件的关联数据
        this.getAssociate()
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

.no-linked-data {
  height: 200px;
}

</style>

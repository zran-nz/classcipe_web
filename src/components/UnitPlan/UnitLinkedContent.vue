<template>
  <div class='unit-linked-content'>
    <div class='header-action'>
      <a-space>
        <a-button type='primary' @click='handleAddNew'>Add new</a-button>
        <a-button type='primary' @click='handleAddCategory'>Add category</a-button>
      </a-space>
    </div>
    <div class='linked-content'>
      <draggable
        v-model="ownerLinkGroupList"
        :disabled="!canEdit"
        animation="300"
        group="category">
        <div
          class='linked-category'
          v-for='(groupItem, gIdx) in ownerLinkGroupList'
          :key='groupItem.group'>
          <div class='category-name' :style="{'background-color': color[gIdx]}">
            {{ groupItem.group }}
          </div>
          <draggable
            v-model="groupItem.contents"
            :disabled="!canEdit"
            animation="300"
            group="content-item"
            style="width: 100%; min-height: 50px"
            @add="handleDragContent"
            @update="handleDragContent"
            @end="handleDragEnd">
            <div class='linked-item' v-for='content in groupItem.contents' :key='content.id'>
              <link-content-item :content='content' />
            </div>
          </draggable>
        </div>
      </draggable>
    </div>

    <linked-category v-if='addCategoryVisible' :selected='groupNameList' @close='addCategoryVisible = false' @confirm='handleConfirmAddCategory'/>
  </div>
</template>

<script>
import LinkedCategory from '@/components/UnitPlan/LinkedCategory'
import { AddOrSaveGroupName, DeleteGroup, GetAssociate, SaveGroupItems } from '@/api/teacher'
import LinkContentItem from '@/components/UnitPlan/LinkContentItem'
import draggable from 'vuedraggable'

export default {
  name: 'UnitLinkedContent',
  components: { LinkContentItem, LinkedCategory, draggable },
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
        '#fa525211',
        '#12b88611',
        '#fab00511'
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
      this.ownerLinkGroupList.forEach(group => {
        result.push(group.group)
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
      this.$logger.info('handleConfirmAddCategory', selectedCategoryList)
      this.addCategoryVisible = false
      const newGroupNameList = []
      selectedCategoryList.forEach(groupName => {
        this.ownerLinkGroupList.findIndex(group => group.group === groupName) === -1 && newGroupNameList.push(groupName)
      })
      this.handleAddTerm(newGroupNameList)
      this.$logger.info('newGroupNameList', newGroupNameList)
      this.getAssociate()
    },

    getAssociate () {
      this.$logger.info('GetAssociate id[' + this.fromId)
      this.linkGroupLoading = true
      GetAssociate({
        id: this.fromId,
        type: this.$classcipe.typeMap['unit-plan'],
        published: 1
      }).then(response => {
        this.$logger.info('UnitLinkedContent getAssociate', response)
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

    handleDragContent (event, data) {
      this.$logger.info('handleDropContent', event)
    },

    handleDragEnd () {
      this.$logger.info('handleDragEnd ', this.groups)
      this.groups.forEach((group, index) => {
        this.$set(this.groups, index, group)
      })

      SaveGroupItems({
        fromId: this.fromId,
        fromType: this.$classcipe.typeMap['unit-plan'],
        groups: this.groups
      }).then(response => {
        this.$logger.info('AddOrSaveGroupName', response)
      })
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
          fromId: this.unitPlanId,
          fromType: this.contentType['unit-plan'],
          groupName: newGroupNameList[i]
        }).then(response => {
          this.$logger.info(`create ${newGroupNameList[i]}`, response)
        })
      }
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
}

</style>

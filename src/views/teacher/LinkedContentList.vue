<template>
  <div class='my-sub-task-list'>
    <fixed-vertical-header>
      <template v-slot:left>
        <a-button class='cc-dark-button' @click='handleCreateSubtask'>
          {{ displayLabel }} linked content
        </a-button>
      </template>
      <template v-slot:right>
        <a-space v-show='selectedTaskList.length > 0'>
          <a-button class='cc-dark-button' @click='publishSelected'>
            Publish
          </a-button>
          <a-button class='cc-dark-button' @click='unPublishSelected'>
            Unpublish
          </a-button>
        </a-space>
      </template>
    </fixed-vertical-header>
    <div class='sub-task-container'>
      <div class='sub-task-list vertical-left' v-for='content in linkedContentList' :key='content.id'>
        <div class='checked-icon vertical-center' @click='toggleSelectItem(content)'>
          <a-checkbox :checked='selectedTaskList.indexOf(content) !== -1' :disabled='content.needComplete'></a-checkbox>
        </div>
        <div class='task-item vertical-left'>
          <div class='complete-mask' v-if='content.needComplete' @click='handleEditItem(content)'>
            <a-button type='primary' shape='round' class='cc-complete-button' size='large'>Complete</a-button>
          </div>
          <content-item
            :content='content'
            :show-button='true'
            :show-edit='true'
            :show-delete='true'
            :show-schedule='true'
            :click-preview='false'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedVerticalHeader from '@/components/Common/FixedVerticalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import { GetAssociate } from '@/api/teacher'
import { getLabelNameType, typeMap } from '@/const/teacher'
import { PlanField, TaskField } from '@/const/common'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import CustomTextButton from '@/components/Common/CustomTextButton'

export default {
  name: 'LinkedContentList',
  components: { CustomTextButton, ContentItem, FixedVerticalHeader, FixedFormHeader },
  props: {
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      typeMap: typeMap,
      linkedContentList: [],
      selectedTaskList: [],
      requiredPlanFields: [
        PlanField.Name,
        PlanField.Image,
        PlanField.Inquiry,
        PlanField.Scenarios,
        PlanField.Question,
        PlanField.LearnOuts
      ],
      requiredTaskFields: [
        TaskField.Name,
        TaskField.Image,
        TaskField.Overview,
        TaskField.LearnOuts
      ]
    }
  },
  computed: {
    displayLabel () {
      return getLabelNameType(parseInt(this.contentType))
    }
  },
  async created() {
    const token = storage.get(ACCESS_TOKEN)
    this.loading = true
    await this.$store.dispatch('loadFormConfigData', token)
    this.loadAssociateData()
  },
  methods: {
    handleCreateSubtask () {
      // this.$router.push({
      //   path: '/teacher/split-task/' + this.taskId
      // })
    },

    async loadAssociateData () {
      try {
        const slideData = await GetAssociate({
          id: this.contentId,
          type: this.contentType,
          published: 0
        })
        console.log('loadAssociateData', slideData)
        const list = slideData.result.owner
        this.linkedContentList = []
        const taskList = []
        const unitList = []
        list.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === this.$classcipe.typeMap.task) {
              taskList.push(content)
            }

            if (content.type === this.$classcipe.typeMap['unit-plan']) {
              unitList.push(content)
            }
          })
        })
        console.log('taskList', taskList)
        this.checkTaskAllowPublished(taskList)
        console.log('unitList', unitList)
        this.checkUnitAllowPublished(unitList)
        this.linkedContentList = [...unitList, ...taskList]
        this.$logger.info('sub list', this.linkedContentList)
      } catch (e) {
        console.error('loadSlideData', e)
      } finally {
        this.loading = false
      }
    },

    // 检查必填项是否为空,只检测null,undefined,空字符串,空数组,空对象
    isEmpty(value) {
       if (value === null || value === '' || value === undefined) {
         return true
       }
       if (value.hasOwnProperty('length') && value.length === 0) {
         return true
       }

       return JSON.stringify(value) === '{}'
     },

    checkTaskAllowPublished (taskList) {
      taskList.forEach(item => {
        item.needComplete = false
        this.requiredTaskFields.forEach(field => {
          if (this.isEmpty(item[field])) {
            item.needComplete = true
            this.$logger.info('task need complete', item)
          }
        })
      })
    },
    checkUnitAllowPublished (unitList) {
      unitList.forEach(item => {
        item.needComplete = false
        this.requiredPlanFields.forEach(field => {
          if (this.isEmpty(item[field])) {
            item.needComplete = true
            this.$logger.info('plan need complete', item)
          }
        })
      })
    },

    toggleSelectItem (item) {
      this.$logger.info('toggleSelectItem', item)
      const index = this.selectedTaskList.findIndex(subTask => subTask.id === item.id)
      this.$logger.info('index', index)
      if (index === -1) {
        this.selectedTaskList.push(item)
        this.$logger.info('push item', this.selectedTaskList)
      } else {
        this.selectedTaskList.splice(index, 1)
        this.$logger.info('delete item', index)
      }
      this.$logger.info('selected list', this.selectedTaskList)
    },

    publishSelected () {
      this.$logger.info('publishSelected', this.selectedTaskList)
    },

    unPublishSelected () {
      this.$logger.info('unPublishSelected', this.selectedTaskList)
    },

    handleEditItem (item) {
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.id
        })
      } else if (item.type === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.id
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.sub-task-container {
  margin-top: 70px;
  height: calc(100vh - 70px);
  padding: 10px 20px;
  overflow-y: auto;
  .sub-task-list {
    background: #fff;
    padding: 0 15px;
    .checked-icon {
      padding-right: 15px;
    }
  }
}

.task-item {
  width: 100%;
  position: relative;

  .complete-mask {
    position: absolute;
    left: 0;
    top: 10px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 5px;
  }
}
</style>

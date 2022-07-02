<template>
  <div class='my-sub-task-list'>
    <fixed-vertical-header>
      <template v-slot:left>
        <a-button class='cc-dark-button' @click='handleCreateSubtask'>
          Create sub task
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
      <div class='sub-task-list vertical-left' v-for='content in subTaskList' :key='content.id'>
        <div class='checked-icon vertical-center' @click='toggleSelectItem(content)'>
          <a-checkbox :checked='selectedTaskList.indexOf(content) !== -1'></a-checkbox>
        </div>
        <div class='task-item vertical-left'>
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
import { TaskQueryById } from '@/api/task'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedVerticalHeader from '@/components/Common/FixedVerticalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import { TaskField } from '@/const/common'

export default {
  name: 'MySubtaskList',
  components: { ContentItem, FixedVerticalHeader, FixedFormHeader },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      subTaskList: [],
      selectedTaskList: [],
      requiredTaskFields: [
        TaskField.Name,
        TaskField.Image,
        TaskField.Overview,
        TaskField.LearnOuts
      ]
    }
  },
  created() {
    this.initTask()
  },
  methods: {
    initTask() {
      TaskQueryById({
        id: this.taskId
      }).then(res => {
        this.$logger.info('sub task', res.result)
        if (res.code === 0) {
          const subTasks = res.result.subTasks
          this.checkTaskAllowPublished(subTasks)
          this.subTaskList = subTasks
        }
      })
    },

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

    handleCreateSubtask () {
      this.$router.push({
        path: '/teacher/split-task/' + this.taskId
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
}
</style>

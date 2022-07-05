<template>
  <div class='my-sub-task-list'>
    <fixed-vertical-header>
      <template v-slot:left>
        <a-tooltip placement='leftBottom'>
          <template slot='title'>
            The task is more likely to be purchased by other educators if it is simple, clear and focus on specific learning outcome(s).
            So dividing your main task into small sub-tasks with specific tags is always a good idea.
          </template>
          <a-button class='cc-dark-button' @click='handleCreateSubtask'>
            Create sub task
          </a-button>
        </a-tooltip>
      </template>
      <template v-slot:right>
        <a-space>
          <a-button :class="currentAction !== 'publish' ? '' : 'cc-dark-button'" @click="updateAction('publish')">
            Publish
          </a-button>
          <a-button :class="currentAction !== 'unpublish' ? '' : 'cc-dark-button'" @click="updateAction('unpublish')">
            Unpublish
          </a-button>
        </a-space>
      </template>
    </fixed-vertical-header>
    <div class='sub-task-container'>
      <div class='sub-task-list vertical-left' v-for='content in subTaskList' :key='content.id'>
        <div class='checked-icon vertical-center' @click='toggleSelectItem(content)'>
          <template v-if='currentAction'>
            <a-checkbox
              :checked='selectedTaskList.indexOf(content) !== -1'
              v-if="(currentAction === 'publish' && content.status === 0) || (currentAction === 'unpublish' && content.status === 1)"
            ></a-checkbox>
          </template>
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
    <fixed-form-footer>
      <template v-slot:right>
        <a-button :disabled="disabled" :loading='loading' type='primary' @click='handleConfirm' class='cc-round-button'>
          Confirm
        </a-button>
      </template>
    </fixed-form-footer>
  </div>
</template>

<script>
import { TaskQueryById } from '@/api/task'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedVerticalHeader from '@/components/Common/FixedVerticalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import { TaskField } from '@/const/common'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import { UpdateContentStatus } from '@/api/teacher'

export default {
  name: 'MySubtaskList',
  components: { FixedFormFooter, ContentItem, FixedVerticalHeader, FixedFormHeader },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      subTaskList: [],
      selectedTaskList: [],
      requiredTaskFields: [
        TaskField.Name,
        TaskField.Image,
        TaskField.Overview,
        TaskField.LearnOuts
      ],
      currentAction: null
    }
  },
  computed: {
    disabled () {
      return !this.currentAction || !this.selectedTaskList.length
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

    updateAction(action) {
      this.currentAction = action
      this.selectedTaskList = []
    },

    handleConfirm () {
      if (this.currentAction === 'publish') {
        this.publishSelected()
      } else if (this.currentAction === 'unpublish') {
        this.unPublishSelected()
      }
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
      this.loading = true
      this.$logger.info('publishSelected', this.selectedTaskList)
      const job = []
      this.selectedTaskList.forEach(item => {
        job.push(UpdateContentStatus({
          id: item.id,
          type: item.type,
          status: 0
        }))
      })

      Promise.all(job).then(res => {
        this.initTask()
      }).finally(() => {
        this.loading = false
      })
    },

    unPublishSelected () {
      this.loading = true
      this.$logger.info('unPublishSelected', this.selectedTaskList)
      const job = []
      this.selectedTaskList.forEach(item => {
        job.push(UpdateContentStatus({
          id: item.id,
          type: item.type,
          status: 1
        }))
      })

      Promise.all(job).then(res => {
        this.initTask()
      }).finally(() => {
        this.loading = false
      })
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
      width: 33px;
      padding-right: 15px;
    }
  }
}

.task-item {
  width: 100%;
}
</style>

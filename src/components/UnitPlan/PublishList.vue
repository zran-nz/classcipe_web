<template>
  <a-modal
    v-model='visible'
    :closable='true'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='640px'>
    <div class='publish-list-wrapper'>
      <div class='publish-list'>
        <a-row :gutter="5" class='publish-item' v-for='(task, tIdx) in myTaskList' :key='tIdx'>
          <a-col :span='1'>
            <a-checkbox
              :checked='task.checked'
              @click='handleChangeItem(task)'
              v-show='publishedIdList.indexOf(task.id) === -1'>
            </a-checkbox>
          </a-col>
          <a-col :span='14'>
            <div class='task-info'>
              <div class='task-icon'>
                <content-type-icon :type="task.type" />
              </div>
              <div class='task-name' v-if='task.taskType'>
                {{ task.name ? task.name : 'untitled' }}
                <a-tag class='task-type-tag green-active-task-type' v-if="task.taskType.toLowerCase() === 'fa'">
                  {{ task.taskType }}
                </a-tag>
                <a-tag class='task-type-tag red-active-task-type' v-if="task.taskType.toLowerCase() === 'sa'">
                  {{ task.taskType }}
                </a-tag>
                <a-tag class='task-type-tag blue-active-task-type' v-if="task.taskType.toLowerCase() === 'activity'">
                  {{ task.taskType }}
                </a-tag>
              </div>
            </div>
          </a-col>
          <a-col :span='6'>
            {{ task.updateTime | dayjs }}
          </a-col>
          <a-col :span='3'>
            {{ task.status === 1 ? 'Published' : 'Draft' }}
          </a-col>
        </a-row>
      </div>
      <div class='publish-button'>
        <a-button @click='handlePublish' type='primary' shape='round'>Publish</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>

import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

export default {
  name: 'PublishList',
  components: { ContentTypeIcon },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskList: {
      type: Array,
      default: () => []
    },
    parentType: {
      type: Number,
      required: true
    },
    parentId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selectedIdList: [],
      publishedIdList: [],
      myTaskList: []
    }
  },
  created() {
    this.publishedIdList = []
    this.myTaskList = []
    this.taskList.forEach(item => {
      const itemData = Object.assign({}, item)
      itemData.checked = false
      if (itemData.status) {
        this.publishedIdList.push(itemData.id)
      }
      this.myTaskList.push(itemData)
    })
    this.$logger.info('PublishList myTaskList', this.myTaskList)
  },
  methods: {
    handlePublish () {
      this.$logger.info('PublishList handlePublish', this.selectedIdList)
      this.selectedIdList = []
      this.myTaskList.forEach(item => {
        if (item.checked) {
          this.selectedIdList.push(item.id)
        }
      })
      this.$emit('publish', this.selectedIdList)
    },
    handleChangeItem (task) {
      this.$logger.info('PublishList handleChangeItem', task)
      task.checked = !task.checked
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.publish-list-wrapper {
  margin-top: 50px;
  .publish-list {
    max-height: 400px;
    overflow-y: auto;
    .publish-item {
      cursor: pointer;
      padding: 7px 0;
      width: 580px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #f1f1f1;
      user-select: none;

      .task-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
      }
    }
  }
}

.publish-button {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.task-type-tag {
  right: 5px;
  margin-left: 5px;
  border-radius: 20px;
  border-width: 2px;
  font-weight: bold;
}

.green-active-task-type {
  background: rgba(21, 195, 154, 0.1);
  border: 2px solid #15C39A;
  border-radius: 50%;
  font-weight: bold;
  color: #15C39A;
}

.red-active-task-type {
  background: rgba(255, 51, 85, 0.1);
  border: 2px solid #FF3355;
  border-radius: 50%;
  opacity: 1;
  font-weight: bold;
  color: #FF3355;
  opacity: 1;
}

.blue-active-task-type {
  background: rgb(230, 247, 255);
  border: 2px solid rgb(145, 213, 255);
  border-radius: 50px;
  opacity: 1;
  font-weight: bold;
  color: rgb(24, 144, 255);
}
</style>

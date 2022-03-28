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
        <a-row :gutter="5" class='publish-item' v-for='(task, tIdx) in myTaskList' :key='tIdx' @click.native='handleChangeItem(task)'>
          <a-col :span='1'>
            <a-checkbox
              :checked='task.checked'
              v-show='publishedIdList.indexOf(task.id) === -1'>
            </a-checkbox>
          </a-col>
          <a-col :span='14'>
            <div class='task-info'>
              <div class='task-icon'>
                <content-type-icon :type="task.type" />
                {{ task.name ? task.name : 'Untitled' }}
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
      myTaskList: [],
      visible: true
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

.task-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
</style>

<template>
  <div class="content-sidebar">
    <div class="main-name">
      <span class="name-label">
        <a-tooltip :title="name">> {{ name }} </a-tooltip>
      </span>

    </div>
    <div class="sub-list">
      <div class="sub-item" v-for="(item,index) in subList" :key="index">
        <  {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
export default {
  name: 'ContentSidebar',
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
    subList: {
      type: Array,
      default: () => [
        {
          name: 'test task',
          type: typeMap.task
        },
        {
          name: 'test lesson',
          type: typeMap.lesson
        },
        {
          name: 'test evaluation',
          type: typeMap.evaluation
        },
        {
          name: 'test topic',
          type: typeMap.topic
        }
      ]
    }
  },
  data () {
    return {
      typeMap: typeMap
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-sidebar {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  .main-name {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    .name-label {
      padding-left: 5px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 500;
      color: @primary-color;
    }
    padding: 5px 0;
  }

  .sub-list {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .sub-item {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      padding: 3px 0;
      color: @primary-color;
    }
  }
}
</style>

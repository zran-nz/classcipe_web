<template>
  <div class="task-preview" :data-uid="rawSubTaskData ? rawSubTaskData._uid : ''">
    <div class='mask'></div>
    <div class='sub-task-item' :style="{backgroundImage: thumbnailList.length ? 'url(' + thumbnailList[0].contentUrl + ')' : ''}">
    </div>
    <div class="mask-actions">
      <div class="action-item action-item-bottom" >
        <div class="session-btn" @click.stop="handleDeleteItem">
          <div class="session-btn-icon content-list-action-btn">
            <shanchu-icon />
          </div>
          <div class="session-btn-text">Remove</div>
        </div>
        <div class="session-btn" @click.stop="">
          <div class="session-btn-icon content-list-action-btn">
            <a-icon type="eye" theme="filled" />
          </div>
          <div class="session-btn-text">Preview</div>
        </div>
      </div>
    </div>
    <div class='sub-task-name'>{{ task.name }}</div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import NoMoreResources from '@/components/Common/NoMoreResources'
import ShanchuIcon from '@/assets/svgIcon/task/shanchu_icon.svg?inline'

export default {
  name: 'TaskPreview',
  components: { NoMoreResources, ShanchuIcon },
  props: {
    taskData: {
      type: Object,
      required: true
    },
    classItemsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      loading: true,
      rawSubTaskData: null,
      task: null,
      thumbnailList: [],

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1
    }
  },
  created () {
    logger.info('TaskPreview taskId ' + this.taskId)
    this.loadTaskData()
  },
  methods: {
    loadTaskData () {
      logger.info('TaskPreview exist taskData ', this.taskData)
      this.rawSubTaskData = this.taskData
      this.task = this.taskData.subTask
      // 手动把selectPageImages中图片复制到thumbnailList中
      this.thumbnailList = []
      this.rawSubTaskData.selectPageImages.forEach(image => {
        this.thumbnailList.push({ contentUrl: image })
      })
      // 按照选择的ppt 去加载对应的tag标签
      this.getClassPptCustomTags()
    },
    getClassPptCustomTags() {
      const pageIds = this.taskData.selectPageObjectIds
      const blooms = []
      const dimensions = []
      this.classItemsList.forEach(e => {
        if (pageIds.indexOf(e.pageId) !== -1) {
          const json = JSON.parse(e.data)
          if (json.data && json.data.bloomLevel) {
            if (blooms.indexOf(json.data.bloomLevel) === -1) {
              blooms.push(json.data.bloomLevel)
            }
          }
          if (json.data && json.data.knowledgeLevel) {
            if (dimensions.indexOf(json.data.knowledgeLevel) === -1) {
              dimensions.push(json.data.knowledgeLevel)
            }
          }
        }
      })
      logger.info('getClassPptCustomTags ', blooms, dimensions)
      this.taskData.customTags = []
      if (blooms.length > 0) {
        blooms.forEach(tag => {
          this.taskData.customTags.push({
            name: tag,
            parentName: 'Bloom\'s Taxonomy'
          })
        })
      }
      if (dimensions.length > 0) {
        dimensions.forEach(tag => {
          this.taskData.customTags.push({
            name: tag,
            parentName: 'Knowledge Dimensions'
          })
        })
      }
    },

    handleDeleteItem () {
      this.$emit('delete-sub-task', this.rawSubTaskData)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.task-preview {
  width: 210px;
  height: 190px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.16);

  .mask {
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #0A1C32;
    transition: opacity 0.8s;
    cursor: pointer;
    opacity: 0;
    border-radius: 4px;
  }

  &:hover {
    .mask {
      opacity: 0.3;
    }

    .mask-actions {
      display: flex;
    }
  }

  .sub-task-item {
    z-index: 50;
    cursor: pointer;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 210px;
    height: 150px;

    &:hover {
      .task-action {
        opacity: 1;
      }
    }
  }

  .sub-task-name {
    user-select: none;
    z-index: 50;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    background: #fff;
    color: #fff;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    line-height: 40px;
    font-size: 13px;
    padding: 0 5px;
  }

  .mask-actions{
    z-index: 150;
    top: 100px;
    height: 100%;
    width: 100%;
    position: absolute;
    flex-direction: column;
    display: none;
    .action-item-bottom{
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .session-btn {
        height: 33px;
        overflow: hidden;
        width: auto;
        display: flex;
        border-radius: 32px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 6px 10px;
        transition: all 0.3s ease-in-out;
        background: rgba(245, 245, 245, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);

        .session-btn-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          svg {
            width: 14px;
            height: 14px;
            fill: #182552;
            stroke: #182552;
            stroke-width: 0.5px;
          }
        }

        .session-btn-text {
          transition: all 0.3s ease-in-out;
          display: none;
          font-size: 13px;
          padding-left: 7px;
          font-family: Inter-Bold;
          color: #182552;
        }
      }

      .session-btn:hover {
        .session-btn-text {
          display: inline-block;
        }
      }
    }
  }
}
</style>

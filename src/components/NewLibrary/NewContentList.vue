<template>
  <div class="content-list-wrapper">
    <div class="content-header">
      <div class="name" :style="{width: nameWidth + 'px'}">
        Name
      </div>
      <!--      <div class="owner">-->
      <!--        Owner-->
      <!--      </div>-->
      <!--      <div class="date-modified">-->
      <!--        Date Modified-->
      <!--      </div>-->
    </div>
    <div class="content-list">
      <template v-if="contentDataList && contentDataList.length">
        <div
          :class="{'content-item': true,
                   'odd-line': index % 2 === 0,'even-line': index % 2 === 1,
                   'active-line': currentId === item.id,
                   'selected-line': item.hasOwnProperty('froms') ? selectedKnowledgeIdList.indexOf(item.knowledgeId) !== -1 : selectedIdList.indexOf(item.id) !== -1}"
          v-for="(item,index) in contentDataList"
          :key="index">
          <div class="name" :style="{width: nameWidth + 'px'}" @click="handleContentListItemClick(item)">
            <div class="icon">
              <template v-if="item.type">
                <content-type-icon :type="item.type" />
              </template>
              <template v-else>
                <a-icon type="folder" theme="filled" class="file-dir-icon"/>
              </template>
            </div>
            <div class="name-text">
              {{ item.name || item.description }}
            </div>
            <div class="action-icon" v-if="item.hasOwnProperty('froms') ? selectedKnowledgeIdList.indexOf(item.knowledgeId) !== -1 : selectedIdList.indexOf(item.id) !== -1">
              <img src="~@/assets/icons/lesson/selected.png"/>
            </div>
          </div>
          <!--          <div class="owner">-->
          <!--            {{ item.createBy }}-->
          <!--          </div>-->
          <!--          <div class="date-modified">-->
          <!--            {{ item.updateTime | dayjs }}-->
          <!--          </div>-->
        </div>
      </template>
      <template v-else>
        <div class="content-empty" v-if="!firstLoad">
          <a-empty />
        </div>
      </template>
    </div>

    <a-drawer
      destroyOnClose
      placement="right"
      closable
      width="800px"
      :visible="previewVisible"
      @close="handlePreviewClose"
    >
      <div class="preview-wrapper">
        <div class="preview-detail">
          <unit-plan-preview :unit-plan-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap['unit-plan']" />
          <material-preview :material-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap.material" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { typeMap } from '@/const/teacher'

export default {
  name: 'NewContentList',
  components: {
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview
  },
  data () {
    return {
      currentId: null,
      nameWidth: 500,
      contentDataList: [],
      parent: null,

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      blockIndex: 0,
      typeMap: typeMap,
      firstLoad: true,

      selectedIdList: [],
      selectedKnowledgeIdList: [],
      selectedKnowledgeIdNameMap: new Map()
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectedListUpdate, this.handleContentSelectedListUpdate)
    this.nameWidth = document.getElementById('new-library').getBoundingClientRect().width - 400
    this.$logger.info('nameWidth ' + this.nameWidth)
  },
  methods: {
    handleContentListUpdate (data) {
      this.$logger.info('handleContentListUpdate ', data)
      this.contentDataList = data.contentList
      this.parent = data.currentTreeData
      this.firstLoad = false
    },

    handleContentSelectedListUpdate (data) {
      this.$logger.info('handleContentSelectedListUpdate ', data)
      if (this.selectedIdList.indexOf(data.id) === -1) {
        this.selectedIdList.push(data.id)
      } else {
        this.selectedIdList.splice(this.selectedIdList.indexOf(data.id), 1)
      }
      this.$logger.info('after handleContentSelectedListUpdate ', this.selectedIdList)
    },
    handleContentListItemClick (item) {
      this.$logger.info('handleContentListItemClick', item, this.parent)

      if (item.hasOwnProperty('froms')) {
        this.$logger.info('handle sync handleContentListItemClick', item)
        const index = this.selectedKnowledgeIdList.indexOf(item.knowledgeId)
        if (index !== -1) {
          this.selectedKnowledgeIdList.splice(index, 1)
          this.selectedKnowledgeIdNameMap.delete(item.knowledgeId)
        } else {
          this.selectedKnowledgeIdList.push(item.knowledgeId)
          this.selectedKnowledgeIdNameMap.set(item.knowledgeId, item.name)
        }
        const selectedList = []
        this.selectedKnowledgeIdList.forEach(knowledgeId => {
          selectedList.push({
            knowledgeId: knowledgeId,
            name: this.selectedKnowledgeIdNameMap.get(knowledgeId)
          })
        })
        this.$emit('select-sync', selectedList)
        this.$logger.info('selectedKnowledgeIdNameMap', this.selectedKnowledgeIdNameMap)
      } else {
        if (item.children.length) {
          // 如果有子列表，表示还未到最后一层description，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            parent: this.parent,
            eventType: 'sync'
          })
          this.$logger.info('$emit sync')
        } else {
          // 最后一列，字列表无需让导航栏更新，导航栏不显示最后一层description。通过事件类型区分。
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            parent: this.parent,
            eventType: 'selectDescription'
          })
          this.$logger.info('$emit selectDescription')
        }
        // if (item.type) {
        //   this.$logger.info('handleContentListItemClick type', item)
        //   this.handlePreviewDetail(item)
        // }
      }
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },
    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data)
      this.previewCurrentId = data.id
      this.previewType = data.type
      this.previewVisible = true
    }
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    this.$logger.info('off NewContentList ContentListUpdate handler')
    LibraryEventBus.$off(LibraryEvent.ContentListSelectedListUpdate, this.handleContentSelectedListUpdate)
    this.$logger.info('off NewContentList ContentListSelectedListUpdate handler')
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.content-list-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-header {
    font-weight: 600;
    background-color: #eee;
    line-height: 30px;
    cursor: pointer;
    user-select: none;
    display: flex;
    overflow: hidden;
    padding: 5px 10px;
    .name {
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
    }
    .owner {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }

    .date-modified {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }
  }
  .content-list {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    height: calc(100%- 40);

    .content-empty {
      margin-top: 150px;
    }

    .even-line {
      background-color: #ffffff;
    }

    .odd-line {
      background-color: #F8F8F8;
    }

    .selected-line {
      background-color: fade(@outline-color, 10%);
      color: @text-color;
      border: 1px solid #15C39A !important;
      box-sizing: border-box;

      .action-icon {
        position: absolute;
        right: 40px;
        img {
          height: 18px;
        }
      }
    }

    .active-line {
      background-color: #EBEEFD;
      color: @primary-color;
    }

    .content-item {
      border: 1px solid #fff;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding: 10px;
      margin: 3px;

      .name {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        word-break: break-all;
        padding: 0 10px;
        width: 100%;
        .icon {
          .file-dir-icon {
            padding: 3px 0;
            box-sizing: border-box;
            color: #82c0d8;
            font-size: 18px;
          }
        }

        .name-text {
          padding: 0 5px;
          box-sizing: border-box;
          word-break: break-all;
          white-space:normal;
        }
      }

      .owner {
        width: 170px;
        padding: 0 10px;
        text-align: left;
      }

      .date-modified {
        width: 170px;
        padding: 0 10px;
        text-align: left;
      }
    }
  }

  *::-webkit-scrollbar {
    width: 3px;
    height: 0;
  }
  *::-webkit-scrollbar-track {
    border-radius: 1px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  *::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
}
</style>

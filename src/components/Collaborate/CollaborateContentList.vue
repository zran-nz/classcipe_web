<template>
  <div class="collaborate-content">
    <div class="collaborate-content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :data-source="collaborateContentList" :loading="loading">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item" :class="{'my-list-item': true}" >

              <span class="content-info-left" @click="handleViewDetail(item, $event)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <span class="status">
                  <template v-if="item.status === 0">Draft</template>
                  <template v-if="item.status === 1">Published</template>
                </span>
                <div class="action" >
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div class="action-item" @click="handleAddToEditor(item.id)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedEditorContentIdList.indexOf(item.id) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedEditorContentIdList.indexOf(item.id) !== -1" />
                        </div>
                        <div class="action-name">Editor</div>
                        <div class="active-icon">
                          <img src="~@/assets/icons/collaborate/editor.png" />
                        </div>
                      </div>
                      <div class="action-item" @click="handleAddToViewer(item.id)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedViewerContentIdList.indexOf(item.id) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedViewerContentIdList.indexOf(item.id) !== -1" />
                        </div>
                        <div class="action-name">Viewer</div>
                        <div class="active-icon">
                          <img src="~@/assets/icons/collaborate/viewer.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>
      <div class="action-line">
        <a-button class="button-item" type="primary" shape="round" @click="handleEnsureSelect"> Select User</a-button>
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
          <div class="preview-detail" v-if="previewCurrentId && previewType">
            <common-preview :id="previewCurrentId" :type="previewType" />
          </div>
        </div>
      </a-drawer>
    </div>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { GetAssociate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import CommonPreview from '@/components/Common/CommonPreview'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'CollaborateContentList',
  components: {
    CommonPreview,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview,
    NoMoreResources
  },
  props: {
    mainContent: {
      type: Object,
      required: true
    },
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      collaborateContentList: [],

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',

      typeMap: typeMap,

      selectedViewerContentIdList: [],
      selectedEditorContentIdList: []
    }
  },
  created () {
    logger.info('Collaborate contentId ' + this.contentId + ' type ' + this.contentType, this.mainContent)
    this.loadAssociateContent()
  },
  mounted () {
  },
  methods: {
    loadAssociateContent () {
      this.$logger.info('loadAssociateContent' + this.contentId + ' type ' + this.contentType)
      this.loading = true
      GetAssociate({
        id: this.contentId,
        type: this.contentType
      }).then((response) => {
        logger.info('loadAssociateContent GetAssociate ', response)
        const collaborateContentList = [this.mainContent]
        const owner = response.result.owner
        owner.forEach(item => {
          const itemType = item.type
          const itemTypeName = item.typeName
          item.datas.forEach(dataItem => {
            if (dataItem.lists.length) {
              dataItem.lists.forEach(aItem => {
                collaborateContentList.push({
                  itemType,
                  itemTypeName,
                  ...aItem
                })
              })
            }
          })
        })

        this.collaborateContentList = collaborateContentList

        this.selectedViewerContentIdList = []
        this.selectedEditorContentIdList = []
        this.collaborateContentList.forEach(cItem => {
          // this.selectedViewerContentIdList.push(cItem.id)
          this.selectedEditorContentIdList.push(cItem.id)
        })
        this.$logger.info('collaborateContentList', this.collaborateContentList)
      }).then(() => {
        logger.info('get favorite ' + this.materialId)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },

    handleViewDetail (item, event) {
      logger.info('handleViewDetail', item)
      event.preventDefault()
      event.stopPropagation()
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handlePreviewClose () {
      logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleAddToEditor (id) {
      this.$logger.info('handleAddToEditor ' + id)
      const index = this.selectedEditorContentIdList.indexOf(id)
      if (index !== -1) {
        this.selectedEditorContentIdList.splice(index, 1)
      } else {
        this.selectedEditorContentIdList.push(id)
        if (this.selectedViewerContentIdList.indexOf(id) > -1) {
          this.selectedViewerContentIdList.splice(this.selectedViewerContentIdList.indexOf(id), 1)
        }
      }
      this.$logger.info('selectedEditorContentIdList ', this.selectedEditorContentIdList)
    },

    handleAddToViewer (id) {
      this.$logger.info('handleAddToViewer ' + id)
      const index = this.selectedViewerContentIdList.indexOf(id)
      if (index !== -1) {
        this.selectedViewerContentIdList.splice(index, 1)
      } else {
        this.selectedViewerContentIdList.push(id)
        if (this.selectedEditorContentIdList.indexOf(id) > -1) {
          this.selectedEditorContentIdList.splice(this.selectedEditorContentIdList.indexOf(id), 1)
        }
      }
      this.$logger.info('selectedViewerContentIdList ', this.selectedViewerContentIdList)
    },

    handleEnsureSelect () {
      this.$logger.info('handleEnsureSelect', this.selectedViewerContentIdList, this.selectedEditorContentIdList)
      if (this.selectedEditorContentIdList.length === 0 && this.selectedViewerContentIdList.length === 0) {
        this.$message.warn('please select content!')
      } else {
        const selectedViewerContentList = []
        const selectedEditorContentList = []
        this.selectedViewerContentIdList.forEach(id => {
          const item = this.collaborateContentList.find(it => it.id === id)
          selectedViewerContentList.push({
            id: id,
            type: item.type
          })
        })
        this.selectedEditorContentIdList.forEach(id => {
          const item = this.collaborateContentList.find(it => it.id === id)
          selectedEditorContentList.push({
            id: id,
            type: item.type
          })
        })
        this.$logger.info('event data', selectedViewerContentList, selectedEditorContentList)
        this.$emit('selected', {
          selectedViewerContentList,
          selectedEditorContentList
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.my-list-item {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  margin-bottom: 15px;
}
.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}
.collaborate-content {

  .collaborate-content-wrapper {
    .content-list {
      min-height: 300px;
      .content-info-left {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .status-icon-item {
          font-size: 18px;
          width: 40px;
        }

        &:hover {
          color: @primary-color;
        }
      }
      .content-info-right {
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .update-time {
          width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: Inter-Bold;
          font-size: 13px;
          color: #000000;
          opacity: 0.5;
        }

        .status {
          width: 70px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          opacity: 1;
          text-align: center;
        }
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .action-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 10px;
          user-select: none;

          .active-status-icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 20px;
            img {
              height: 18px;
            }

            font-size: 15px;
            color: rgba(21, 195, 154, 1);
          }
          .action-name {
            padding: 0 5px;
          }

          .active-icon {
            img {
              height: 14px;
            }
          }
        }
      }

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        max-width: 450px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
    }
  }
}

a.delete-action {
  color: @red-4;
}

.collaborate-content {
  margin-top: 30px;
}

.action-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}
</style>

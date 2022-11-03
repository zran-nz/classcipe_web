<template>
  <div class="collaborate-content">
    <div class="collaborate-content-wrapper">
      <div class="previous">
        <a-button type="primary" @click="handlePrevious">< Previous</a-button>
      </div>
      <div class="choose-content">Choose the content</div>
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :data-source="collaborateContentList" :loading="loading">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item" :class="{'my-list-item': true}" >

              <span class="content-info-left" @click="handleViewDetail(item, $event)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name ? item.name : 'Untitled' }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <div class="action" >
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div class="action-item" @click="handleAddContent(item.id)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedContentIdList.indexOf(item.id) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedContentIdList.indexOf(item.id) !== -1" />
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
      <div class="message-wrapper">
        <a-textarea v-model="inviteMessage" placeholder="Entre message" aria-placeholder="Entre message" class="my-textarea" />
      </div>
      <div class="action-line">
        <a-button :disabled="selectedContentIdList.length === 0" class="button-item" type="primary" shape="round" @click="handleEnsureSelect"> Confirm </a-button>
      </div>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        width="1000px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <a-row class="preview-wrapper-row">
          <a-col span="2">
            <div class="view-back" @click="handlePreviewClose">
              <div class="back-icon">
                <img src="~@/assets/icons/common/back.png" />
              </div>
            </div>
          </a-col>
          <a-col span="22">
            <div class="detail-wrapper" v-if="previewCurrentId && previewType">
              <common-preview-v2 :id="previewCurrentId" :type="previewType" />
            </div>
          </a-col>
        </a-row>
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
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'CollaborateContentList',
  components: {
    CommonPreviewV2,
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
      inviteMessage: null,

      selectedContentIdList: []
    }
  },
  created () {
    console.info('Collaborate contentId ' + this.contentId + ' type ' + this.contentType, this.mainContent)
    this.loadAssociateContent()
    this.selectedContentIdList.push(this.contentId)
  },
  mounted () {
  },
  methods: {
    loadAssociateContent () {
      console.info('loadAssociateContent' + this.contentId + ' type ' + this.contentType)
      this.loading = true
      this.selectedContentIdList = []
      GetAssociate({
        id: this.contentId,
        type: this.contentType
      }).then((response) => {
        console.info('loadAssociateContent GetAssociate ', response)
        const collaborateContentList = [this.mainContent]
        const owner = response.result.owner
        if (owner) {
          owner.forEach(group => {
            collaborateContentList.push(...group.contents)
          })
        }
        this.collaborateContentList = collaborateContentList
        console.info('collaborateContentList', this.collaborateContentList)
      }).then(() => {
        console.info('get favorite ' + this.materialId)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },

    handleViewDetail (item, event) {
      console.info('handleViewDetail', item)
      event.preventDefault()
      event.stopPropagation()
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handlePrevious () {
      console.info('handlePrevious')
      this.$emit('go-previous')
    },

    handlePreviewClose () {
      console.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleAddContent (id) {
      console.info('handleAddToEditor ' + id)
      const index = this.selectedContentIdList.indexOf(id)
      if (index !== -1) {
        this.selectedContentIdList.splice(index, 1)
      } else {
        this.selectedContentIdList.push(id)
      }
      console.info('selectedContentIdList ', this.selectedContentIdList)
    },

    handleEnsureSelect () {
      console.info('handleEnsureSelect', this.selectedContentIdList)
      if (this.selectedContentIdList.length === 0) {
        this.$message.warn('please select content!')
      } else {
        const selectedContentList = []

        this.selectedContentIdList.forEach(id => {
          const item = this.collaborateContentList.find(it => it.id === id)
          selectedContentList.push({
            id: id,
            type: item.type
          })
        })
        console.info('event data', selectedContentList)
        this.$emit('selected', {
          selectedContentList,
          message: this.inviteMessage
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

.choose-content {
  margin: 10px 0 5px 0;
  line-height: 24px;
  color: #000;
}
</style>

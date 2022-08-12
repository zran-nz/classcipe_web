<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper" v-if="selectedType === 'created-by-me'">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'skill-active-mode' : currentStatus === 'all-status'}" @click="toggleStatus('all-status', $t('teacher.my-content.all-status'))">
                {{ $t('teacher.my-content.all-status') }}
              </div>
              <div :class="{'mode-item': true, 'knowledge-active-mode' : currentStatus === 'published'}" @click="toggleStatus('published', $t('teacher.my-content.published-status'))">
                {{ $t('teacher.my-content.published-status') }}
              </div>
              <div :class="{'mode-item': true, 'general-active-mode' : currentStatus === 'draft'}" @click="toggleStatus('draft', $t('teacher.my-content.draft-status'))">
                {{ $t('teacher.my-content.draft-status') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading" v-if="dataListMode === 'list'">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item" :class="{'my-list-item': true, 'active-item': selectedList.indexOf(item.id) !== -1}" @click="handleToggleSelect(item,$event)">

              <span class="content-info-left" >
                <content-type-icon :type="item.type"/>

                <span class="name-content">
                  <span class="name-text" @click="handleViewDetail(item, $event)">
                    {{ item.name ? item.name : 'Untitled' }}
                  </span>
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
                  <div slot="actions" v-if="mode === displayMode.Link">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm :title="'Link this content to my Unit' + '?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">
                          <span>
                            <a-icon type="form" /> Link
                          </span>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                  <div slot="actions" v-if="mode === displayMode.Refer">
                    <div class="action-wrapper">
                      <div class="action-item refer-item">
                        <a-button class="refer-btn" type="primary" @click="handleReferItem(item, $event)">
                          <img src="~@/assets/icons/myContent/refer_white.png" class="btn-icon btn-icon-white"/>
                          <img src="~@/assets/icons/myContent/refer_color.png" class="btn-icon btn-icon-color"/>
                          <div class="btn-text">
                            Refer
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div slot="actions" v-show="mode === displayMode.Evaluation">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm :title="'Link ?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">
                          <div class="link-item">
                            <img src="~@/assets/icons/myContent/link-icon.png" class="link-icon"/>
                            {{ 'Link this evaluation to this ' + (item.type === typeMap.task ? 'task' : (item.type === typeMap.lesson ? 'lesson' : '')) }}
                          </div>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
              <div class="action-icon" v-if="selectedList.indexOf(item.id) !== -1" v-show="mode !== 'refer'">
                <img src="~@/assets/icons/lesson/selected.png"/>
              </div>
            </a-list-item>
          </a-list>

          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="dataListMode === 'card'">
            <div slot="renderItem" key="item.key" class="my-card-list-item" slot-scope="item" >

              <div class="ppt-preview-wrapper">
                <div class="template-hover-action-mask">
                  <div class="template-hover-action">
                    <div class="modal-ensure-action-line">
                      <a-button
                        class="action-ensure action-item"
                        shape="round"
                        @click="handlePreviewTemplate(item)"
                      >
                        <a-icon type="eye" theme="filled"/>
                        <div class="btn-text">
                          Preview
                        </div>
                      </a-button>
                      <a-button
                        v-if="selectedList.indexOf(item.id) === -1"
                        class="action-ensure action-item"
                        shape="round"
                        @click="handleToggleSelect(item,$event)">
                        <a-icon type="plus-circle" theme="filled"/>
                        <div class="btn-text">
                          Add
                        </div>
                      </a-button>
                      <a-button
                        v-else
                        class="action-ensure action-item"
                        shape="round"
                        @click="handleToggleSelect(item,$event)"
                      >
                        <a-icon type="minus-circle" theme="filled"/>
                        <div class="btn-text">
                          Remove
                        </div>
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="cover-img-wrapper">
                  <div
                    class="cover-image"
                    :style="{backgroundImage: 'url(' + item.image + ')' }"
                  >
                  </div>
                </div>
              </div>
              <div class="item-intro" @click="handleViewDetail(item, $event)">
                <div class="page-info">
                  <span class="page-num-tag">
                    1/{{ item.pageObjectIds.length }}
                  </span>
                </div>
                <div class="main-title" >
                  {{ item.name ? item.name : 'Untitled' }}
                </div>
                <div class="sub-title">
                  {{ item.createTime | dayjs }}
                </div>
              </div>
              <!--              <div class="item-action-wrapper">-->
              <!--                <div v-show="mode === displayMode.Link">-->
              <!--                  <div class="action-wrapper">-->
              <!--                    <div class="action-item">-->
              <!--                      <a-popconfirm :title="'Link this content to my Unit' + '?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">-->
              <!--                        <span>-->
              <!--                          <a-icon type="form" /> Link-->
              <!--                        </span>-->
              <!--                      </a-popconfirm>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--                &lt;!&ndash; refer mode &ndash;&gt;-->
              <!--                <div v-show="mode === displayMode.Refer">-->
              <!--                  <div class="action-wrapper">-->
              <!--                    <div class="action-item refer-item">-->
              <!--                      <a-button class="refer-btn" type="primary" @click="handleReferItem(item, $event)">-->
              <!--                        <img src="~@/assets/icons/myContent/refer_white.png" class="btn-icon btn-icon-white"/>-->
              <!--                        <img src="~@/assets/icons/myContent/refer_color.png" class="btn-icon btn-icon-color"/>-->
              <!--                        <div class="btn-text">-->
              <!--                          Refer-->
              <!--                        </div>-->
              <!--                      </a-button>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--                &lt;!&ndash; refer mode &ndash;&gt;-->
              <!--                <div v-show="mode === displayMode.Evaluation">-->
              <!--                  <div class="action-wrapper">-->
              <!--                    <div class="action-item">-->
              <!--                      <a-popconfirm :title="'Link ?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">-->
              <!--                        <div class="link-item">-->
              <!--                          <img src="~@/assets/icons/myContent/link-icon.png" class="link-icon"/>-->
              <!--                          {{ 'Link this evaluation to this ' + (item.type === typeMap.task ? 'task' : (item.type === typeMap.lesson ? 'lesson' : '')) }}-->
              <!--                        </div>-->
              <!--                      </a-popconfirm>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
              <div class="card-action-icon">
                <img src="~@/assets/icons/lesson/selected.png" v-if="selectedList.indexOf(item.id) !== -1"/>
              </div>
            </div>
          </a-list>
        </div>

      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        width="1000px"
        :closable="false"
        :z-index="4000"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper-row">
          <div class="view-back">
            <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
          </div>
          <div class="detail-wrapper">
            <div class="preview-detail" v-if="previewCurrentId && previewType">
              <common-preview-v2 :id="previewCurrentId" :type="previewType" />
            </div>
          </div>
        </div>
      </a-drawer>
      <a-modal
        v-model="previewTemplateVisible"
        :footer="null"
        destroyOnClose
        width="1000px"
        :zIndex="4000"
        :title="null"
        @ok="previewTemplateVisible = false"
        @cancel="previewTemplateVisible = false">
        <div class="link-content-wrapper">
          <template-preview :template="previewTemplate" :selected-template-id-list="selectedList" @handle-select="handleToggleSelect"></template-preview>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { FindMyContent } from '@/api/teacher'
import { FavoritesGetMyFavorites } from '@/api/favorites'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { MyContentEvent, MyContentEventBus } from '@/components/MyContent/MyContentEventBus'
import DisplayMode from '@/components/MyContent/DisplayMode'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import NoMoreResources from '@/components/Common/NoMoreResources'
import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import TemplatePreview from '@/components/Task/TemplatePreview'

export default {
  name: 'MyContentCreatedByMe',
  components: {
    CommonPreviewV2,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview,
    NoMoreResources,
    PubuSvg,
    LiebiaoSvg,
    TemplatePreview
  },
  props: {
    filterTypeList: {
      type: Array,
      default: () => []
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: DisplayMode.Link
    },
    selectedType: {
      type: String,
      default: 'created-by-me'
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      myContentList: [],
      displayMode: DisplayMode,
      currentStatus: 'all-status',
      currentStatusLabel: this.$t('teacher.my-content.all-status'),
      currentType: '',
      currentTypeLabel: this.$t('teacher.my-content.all-type'),
      currentOwner: 'all-owner',
      currentOwnerLabel: this.$t('teacher.my-content.all-owner'),

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 100
      },
      pageNo: 1,

      typeMap: typeMap,

      dataListMode: 'card',
      previewTemplate: {},
      previewTemplateVisible: false
    }
  },
  watch: {
    selectedType (value) {
      this.$logger.info('watch select type ' + value)
      this.pageNo = 1
      this.myContentList = []
      this.pagination.total = 0
      this.pagination.pageSize = 100
      this.loadMyContent()
    }
  },
  computed: {
    countPptSize () {
      return function (pageObjectIds) {
        if (!pageObjectIds) {
          return 0
        }
        return pageObjectIds.split(',').length
      }
    }
  },
  created () {
    logger.info('teacher my content filter type ', this.filterTypeList)
    // if (this.filterTypeList) {
      // this.currentType = this.filterTypeList[0]
      // this.currentTypeLabel = getLabelNameType(this.typeMap[this.filterTypeList[0]])
    // }
    // this.$logger.info('currentType ' + this.currentType + ' , currentTypeLabel ' + this.currentTypeLabel + ', selected type ' + this.selectedType)
    this.loadMyContent()
  },
  mounted () {
  },
  methods: {
    loadMyContent () {
      this.loading = true
      if (this.selectedType === 'created-by-me') {
        this.getMyContent()
      } else if (this.selectedType === 'my-favorite') {
        this.getMyFavorites()
      } else if (this.selectedType === 'shared') {
        this.loading = false
        this.skeletonLoading = false
        this.$logger.info('shared coming soon!')
      }
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    getMyContent () {
      const typeList = []
      this.filterTypeList.forEach(item => {
        typeList.push(typeMap[item])
      })
      FindMyContent({
        owner: ownerMap[this.currentOwner],
        status: statusMap[this.currentStatus],
        types: this.currentType ? [typeMap[this.currentType]] : typeList,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        currentId: this.currentId,
        slideStatus: 1
      }).then(res => {
        logger.info('getMyContent', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },

    getMyFavorites () {
      this.$logger.info('getMyFavorites')
      FavoritesGetMyFavorites({
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then((res) => {
        this.$logger.info('FavoritesGetMyFavorites response', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },
    toggleStatus (status, label) {
      logger.info('toggleStatus ' + status + ' label ' + label)
      this.currentStatus = status
      this.currentStatusLabel = label
      this.loadMyContent()
    },
    toggleType (type, label) {
      logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.loadMyContent()
    },
    toggleOwner (owner, label) {
      logger.info('toggleOwner ' + owner + ' label ' + label)
      this.currentOwner = owner
      this.currentOwnerLabel = label
      this.loadMyContent()
    },

    handleLinkItem (item, event) {
      logger.info('handleLinkItem', item)
      event.preventDefault()
      event.stopPropagation()
      MyContentEventBus.$emit(MyContentEvent.LinkToMyContentItem, { item })
    },
    handleViewDetail (item, event) {
      logger.info('my content created by me handleViewDetail', item, event)
      event.preventDefault()
      event.stopPropagation()
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handleToggleSelect (item, event) {
      logger.info('handleToggleSelect', item, event)
      MyContentEventBus.$emit(MyContentEvent.ToggleSelectContentItem, item, event)
      this.previewTemplateVisible = false
    },

    handlePreviewClose () {
      logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleReferItem (item, event) {
      logger.info('handleReferItem', item)
      event.preventDefault()
      event.stopPropagation()
      MyContentEventBus.$emit(MyContentEvent.ReferContentItem, { item })
    },
    handlePreviewTemplate (template) {
      this.$logger.info('handlePreviewTemplate ', template)
      this.previewTemplateVisible = true
      this.previewTemplate = template
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ant-list-item {
  padding: 0;
  position: relative;
  width: 23%;
}

.my-list-item {
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.my-list-item:hover {
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.16);
}

.active-item {
  border: 2px solid #15C39A;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      .toggle-mode-type-wrapper {
        width: 280px;
        box-sizing: border-box;
        .toggle-mode-type {
          height: 40px;
          display: inline-block;
          border-radius: 40px;
          background: rgba(228, 228, 228, 0.3);

          .toggle-mode {
            border-radius: 40px;
            height: 40px;
            display: flex;
            flex-direction: row;
            font-size: 14px;

            //.mode-item:first-child {
            //  border-bottom-left-radius: 35px;
            //  border-top-left-radius: 35px;
            //}
            //
            //.mode-item:last-child {
            //  border-bottom-right-radius: 35px;
            //  border-top-right-radius: 35px;
            //}

            .mode-item {
              padding: 0 8px;
              font-size: 12px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;

              &:hover {
                background: #EDF1F5;
              }
            }

            .skill-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }

            .knowledge-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }

            .general-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }

    .status-item {
      border-radius: @btn-border-radius-base;
      cursor: pointer;
      display: inline-block;
      min-width: 50px;
      text-align: center;
      line-height: 28px;
      padding: 0 15px;
      color: @text-color;
      font-size: @btn-font-size-sm;
      font-weight: @btn-font-weight;
    }

    .active-status-item {
      background: @primary-color;
      color: #fff;
    }

    .type-owner {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .content-wrapper {
    .content-list {
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
        margin-right: 20px;

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
          width: 80px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          opacity: 1;
          text-align: center;
        }
      }

      .action-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        width: 80px;
        box-sizing: border-box;
        img {
          height: 18px;
        }
      }

      .action {
        color: @primary-color;
        font-weight: 500;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .action-item {
          display: inline;
          margin-right: 10px;
          user-select: none;
          .link-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 5px 15px;
            border-radius: 35px;
            border: 1px solid #BCBCBC;
            font-family: Inter-Bold;
            color: #182552;
            font-size: 13px;
            background: rgba(228, 228, 228, 0.2);
            transition: all 0.3s ease;
            .link-icon {
              margin-right: 5px;
              width: 15px;
            }
          }

          .link-item:hover {
            background: rgba(228, 228, 228, 0.5);
          }
        }

        .refer-item {
          .refer-btn{
            background: rgba(21, 195, 154, 0.1);
            border: 1px solid #15C39A;
            border-radius: 20px;
            color: #15C39A;
            padding: 10px 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
          .btn-icon {
            height: 10px;
            width: 10px;
          }
          .btn-icon-white {
            display: none;
          }
          .btn-icon-color {
            display: inline-block;
          }
          .btn-text {
            padding-left: 8px;
          }
        }

        .refer-btn:hover {
          background: #07AB84;
          color: #fff;
          .btn-icon-white {
            display: inline-block;
          }
          .btn-icon-color {
            display: none;
          }
        }
      }

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 400px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
      /deep/ .ant-list-items{
        justify-content:space-between;
      }
    }
    /deep/ .ant-spin-container{
      max-height: 600px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.00);
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
      }
      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(0,0,0,0.12);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
      }
    }
  }
}

a.delete-action {
  color: @red-4;
}

.switch-icon {
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .icon-item {
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      width: 20px;
      color: rgba(24, 37, 82, 1);
    }
  }

  .active-icon {
    svg {
      color: rgba(21, 195, 154, 1);
    }
  }

  &:hover {
    border-color: #15c39a;
  }
}

.preview-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;

  .preview-wrapper-row {
    width: 100%;
    .view-back {
      .back-icon {
        text-align: center;
        img {
          width: 70px;
          cursor: pointer;
        }
      }
    }
    .detail-wrapper {
      background: #FFFFFF;
      border: 1px solid #ddd;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      border-radius: 10px;
    }
  }
}

.my-card-list-item {
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 15px 15px 0;
  width: 23%;
  position: relative;
  user-select: none;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;

  &:hover {
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 2px 1px @primary-color;
  }

  .ppt-preview-wrapper {
    position: relative;
    .template-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      .template-hover-action{
        width: 100%;
        top:30%
      }

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        background: rgba(0, 0, 0, 0.45);
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
      }
      .template-hover-action {
        position: absolute;
      }
    }
    &:hover {
      .template-hover-action-mask {
        display: block;
      }
    }
  }

  .cover-img-wrapper {
    border-radius: 6px;
    border: none;
    outline: none;
    .cover-image {
      border: none;
      outline: none;
      height: 150px;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border-bottom: 1px solid #eee;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
    }
  }

  .item-intro {
    padding: 10px;
    display: flex;
    flex-direction: column;
    cursor: pointer;

    .page-info {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      align-items: center;
      .page-num-tag {
        display: inline;
        background: rgba(228, 228, 228, 0.5);
        padding: 1px 10px;
        border-radius: 16px;
        font-size: 8px;
        font-family: Segoe UI;
        font-weight: 400;
        color: #808191;
      }
    }

    .main-title {
      padding: 5px 0;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-title {
      font-size: 8px;
      font-family: Segoe UI;
      font-weight: 400;
      color: #808191;
    }
  }

  .item-action-wrapper {
    padding: 5px 10px 15px 10px;

    .action-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .action-item {
        display: inline;
        margin-right: 10px;
        user-select: none;
        .link-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 5px 15px;
          border-radius: 35px;
          border: 1px solid #BCBCBC;
          font-family: Inter-Bold;
          color: #182552;
          font-size: 13px;
          background: rgba(228, 228, 228, 0.2);
          transition: all 0.3s ease;
          .link-icon {
            margin-right: 5px;
            width: 15px;
          }
        }

        .link-item:hover {
          background: rgba(228, 228, 228, 0.5);
        }
      }

      .refer-item {
        .refer-btn{
          background: rgba(21, 195, 154, 0.1);
          border: 1px solid #15C39A;
          border-radius: 20px;
          color: #15C39A;
          padding: 10px 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }
        .btn-icon {
          height: 10px;
          width: 10px;
        }
        .btn-icon-white {
          display: none;
        }
        .btn-icon-color {
          display: inline-block;
        }
        .btn-text {
          padding-left: 8px;
        }
      }

      .refer-btn:hover {
        background: #07AB84;
        color: #fff;
        .btn-icon-white {
          display: inline-block;
        }
        .btn-icon-color {
          display: none;
        }
      }
    }
  }
  .card-action-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    img {
      height: 18px;
    }
  }
}
</style>

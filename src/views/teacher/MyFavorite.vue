<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <!--        <span :class="{'status-item': true, 'active-status-item': currentStatus === 'all-status'}" @click="toggleStatus('all-status', $t('teacher.my-content.all-status'))">-->
        <!--          {{ $t('teacher.my-content.all-status') }}-->
        <!--        </span>-->
        <!--        <a-divider type="vertical" />-->
        <!--        <span :class="{'status-item': true, 'active-status-item': currentStatus === 'published'}" @click="toggleStatus('published', $t('teacher.my-content.published-status'))">-->
        <!--          {{ $t('teacher.my-content.published-status') }}-->
        <!--        </span>-->
        <!--        <a-divider type="vertical" />-->
        <!--        <span :class="{'status-item': true, 'active-status-item': currentStatus === 'draft'}" @click="toggleStatus('draft', $t('teacher.my-content.draft-status'))">-->
        <!--          {{ $t('teacher.my-content.draft-status') }}-->
        <!--        </span>-->
      </div>
      <div class="type-owner">
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item disabled>
                <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('all-type', $t('teacher.my-content.all-type'))">
                <span>{{ $t('teacher.my-content.all-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('topic', $t('teacher.my-content.topics-type') )">
                <span>{{ $t('teacher.my-content.topics-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))">
                <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                <span>{{ $t('teacher.my-content.tasks-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('lesson', $t('teacher.my-content.lesson-type'))">
                <span>{{ $t('teacher.my-content.lesson-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))">
                <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
              </a-menu-item>
            </a-menu>
            <a-button
              style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;"> Choose type(s)of content <a-icon type="caret-down" /> </a-button>
          </a-dropdown>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <a-icon type="appstore" theme="filled" v-if="viewMode === 'img'"/>
              <a-icon type="appstore" v-if="viewMode === 'list'"/>
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <a-icon type="unordered-list"/>
            </div>
          </div></div>

      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading" v-if="viewMode === 'list'">
            <a-list-item class="my-list-item" slot="renderItem" key="item.key" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <div class="action">
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                          <a href="#" class="delete-action">
                            <a-icon type="delete" /> {{ $t('teacher.my-content.action-delete') }}
                          </a>
                        </a-popconfirm>
                      </div>
                      <div class="action-item">
                        <a @click="handleEditItem(item)">
                          <a-icon type="form" /> {{ $t('teacher.my-content.action-edit') }}
                        </a>
                      </div>
                      <!--                    <div class="action-item" v-if="item.type === typeMap['evaluation']">
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a @click="handleEvaluation(item)">
                                {{ $t('teacher.my-content.start-evaluation') }}
                              </a>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </div>
                      <div class="action-item" v-if="item.type === typeMap['lesson'] || item.type === typeMap['task']">
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a @click="handleStartSession(item)">
                                {{ $t('teacher.my-content.action-session-new') }}
                              </a>
                            </a-menu-item>
                            <a-menu-item>
                              <a @click="handleViewPreviewSession(item)">
                                {{ $t('teacher.my-content.action-session-previous') }}
                              </a>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </div>-->

                    </div>
                  </div></div></span>

            </a-list-item>
          </a-list>
          <a-list
            :grid="{ gutter: 16, column: 4 }"
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'img'">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">
              <a-card class="cover-card">
                <div
                  @click="handleViewDetail(item)"
                  class="cover-image"
                  slot="cover"
                  :style="{backgroundImage: 'url(' + item.image + ')' }"
                ></div>
                <a-card-meta :title="item.name" :description="item.createTime | dayjs" @click="handleViewDetail(item)"></a-card-meta>
                <template slot="actions" class="ant-card-actions">
                  <div class="action-item">
                    <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                      <a href="#" class="delete-action">
                        <a-icon type="delete" /> {{ $t('teacher.my-content.action-delete') }}
                      </a>
                    </a-popconfirm>
                  </div>
                  <div class="action-item">
                    <a @click="handleEditItem(item)">
                      <a-icon type="form" /> {{ $t('teacher.my-content.action-edit') }}
                    </a>
                  </div>
                  <!--          <div class="action-item" v-if="item.type === typeMap['evaluation']">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a @click="handleEvaluation(item)">
                            {{ $t('teacher.my-content.start-evaluation') }}
                          </a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <div class="action-item" v-if="item.type === typeMap['lesson'] || item.type === typeMap['task']">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a @click="handleStartSession(item)">
                            {{ $t('teacher.my-content.action-session-new') }}
                          </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a @click="handleViewPreviewSession(item)">
                            {{ $t('teacher.my-content.action-session-previous') }}
                          </a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>-->
                </template>
              </a-card>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

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
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { FavoritesGetMyFavorites, FavoritesDelete } from '@/api/favorites'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import { lessonStatus, lessonHost } from '@/const/googleSlide'
import { StartLesson, getMyClasses } from '@/api/lesson'
import storage from 'store'
import { VIEW_MODE } from '@/store/mutation-types'
import CommonPreview from '@/components/Common/CommonPreview'

export default {
  name: 'MyFavorite',
  components: {
    CommonPreview,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    TvSvg
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      myContentList: [],
      currentStatus: 'all-status',
      currentStatusLabel: this.$t('teacher.my-content.all-status'),
      currentType: 'all-type',
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
        pageSize: 15
      },
      pageNo: 1,
      typeMap: typeMap,
      viewMode: storage.get(VIEW_MODE) ? storage.get(VIEW_MODE) : 'list'
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
    this.loadMyContent()
  },
  methods: {
    toggleViewMode (viewMode) {
      this.$logger.info('viewMode', viewMode)
      storage.set(VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    loadMyContent () {
      this.loading = true
      FavoritesGetMyFavorites({
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then(res => {
        logger.info('FavoritesGetMyFavorites', res)
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
        logger.info('myContentList', this.myContentList)
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

    handleEditItem (item) {
      logger.info('handleEditItem', item)
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap['topic']) {
        this.$router.push({
          path: '/expert/topic-redirect/' + item.id
        })
      } else if (item.type === typeMap['material']) {
        this.$router.push({
          path: '/teacher/add-material/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.lesson) {
        this.$router.push({
          path: '/teacher/lesson-redirect/' + item.id
        })
      } else if (item.type === typeMap.evaluation) {
        this.$router.push({
          path: '/teacher/evaluation-redirect/' + item.id
        })
      }
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      FavoritesDelete({
        sourceId: item.id,
        sourceType: item.type
      }).then(res => {
        logger.info('FavoritesDelete', res)
      }).then(() => {
        this.loadMyContent()
      })
    },
    handleViewDetail (item) {
      logger.info('handleViewDetail', item)
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handlePreviewClose () {
      logger.info('handlePreviewClose')
      this.previewVisible = false
      this.$nextTick(() => {
        this.previewCurrentId = null
        this.previewType = -1
      })
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      if (item.presentationId) {
        const requestData = {
          author: this.$store.getters.email,
          slide_id: item.presentationId,
          file_name: item.name,
          status: lessonStatus.studentPaced,
          redirect_url: null
        }

        this.$logger.info('handleStartSession', requestData)
        StartLesson(requestData).then(res => {
          this.$logger.info('StartLesson res', res)
          if (res.code === 'ok') {
            // const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
            const targetUrl = lessonHost + 't/' + res.data.class_id
            this.$logger.info('try open ' + targetUrl)
            window.open(targetUrl, '_blank')
          } else {
            this.$message.warn('StartLesson Failed! ' + res.message)
          }
        })
      } else {
        this.$message.warn('This record is not bound to PPT!')
      }
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      if (item.presentationId) {
        const requestData = {
          author: this.$store.getters.email,
          slide_id: item.presentationId,
          file_name: item.name,
          status: lessonStatus.studentPaced,
          redirect_url: null
        }

        this.$logger.info('handleDashboard', requestData)
        StartLesson(requestData).then(res => {
          this.$logger.info('StartLesson res', res)
          if (res.code === 'ok') {
            // const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&direct=true&currentPage=0&type=dashboard'
            const targetUrl = lessonHost + 't/' + res.data.class_id
            this.$logger.info('try open ' + targetUrl)
            window.open(targetUrl, '_blank', 'height=700, width=1200, top=100, left= 100 toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
          } else {
            this.$message.warn('StartLesson Failed! ' + res.message)
          }
        })
      } else {
        this.$message.warn('This record is not bound to PPT!')
      }
    },

    handleEditEvaluationRubric (item) {
      this.$logger.info('handleEditEvaluationRubric', item)
      getMyClasses({ limit: 100, cursor: 0, slide_id: item.presentationId }).then(response => {
        this.$logger.info('', response)
      })
    },

    handleEnableStudentEvaluation (item) {
      this.$logger.info('handleEnableStudentEvaluation', item)
    },
    handleReviewEvaluation (item) {
      this.$logger.info('handleReviewEvaluation', item)
    },
    handleEnablePeerEvaluation (item) {
      this.$logger.info('handleEnablePeerEvaluation', item)
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
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

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  margin-bottom: 15px;
}

.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
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

    .type-owner {
      height: 40px;
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

        .update-time {
          width: 150px;
          color: #11142D;
          font-size: 13px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .status {
          font-family: Inter-Bold;
          line-height: 24px;
          color: #11142D;
          width: 80px;
        }
      }
      .action {
        width: 200px;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .action-item {
          display: inline;
          margin-left: 20px;
          user-select: none;
        }
      }

      .name-content {
        text-align: left;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #11142D;
        display: inline-block;
        max-width: 450px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
a.delete-action {
  color: @red-4;
}

.view-mode-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 20px;
      padding-left: 5px;
      margin: 0 3px;
    }

    .active-view {
      i {
        color: @primary-color;
      }
    }
  }
}

.cover-image {
  height: 150px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-bottom: 1px solid #eee;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 2px 1px @primary-color;
  }
}

</style>

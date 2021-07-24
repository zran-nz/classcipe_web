<template>
  <div class="my-content">
    <div class="view-mode-toggle">
      <div class="view-mode">
        <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
          <a-icon type="appstore"/>
        </div>
        <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
          <a-icon type="unordered-list"/>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading" v-if="viewMode === 'list'">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">

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
                      <div class="action-item" v-if="item.type === typeMap['evaluation']">
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
                      </div>

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
                  <div class="action-item" v-if="item.type === typeMap['evaluation']">
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
                  </div>
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
        width="700px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper">
          <div class="preview-detail">
            <unit-plan-preview :unit-plan-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap['unit-plan']" />
            <topic-preview :topic-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap.topic" />
            <main-task-preview :task-id="previewCurrentId" v-if="previewType === typeMap.task" />
            <main-lesson-preview :lesson-id="previewCurrentId" v-if="previewType === typeMap.lesson" />
            <evaluation-preview :evaluation-id="previewCurrentId" v-if="previewType === typeMap.evaluation" />
          </div>
        </div>
      </a-drawer>

      <a-modal
        v-model="viewPreviewSessionVisible"
        :footer="null"
        destroyOnClose
        width="800px"
        title="Previous sessions"
        @ok="viewPreviewSessionVisible = false"
        @cancel="viewPreviewSessionVisible = false">
        <div class="preview-session-wrapper">
          <class-list :slide-id="currentPreviewLesson.presentationId" :classData="currentPreviewLesson" v-if="currentPreviewLesson && currentPreviewLesson.presentationId"/>
          <a-empty v-else/>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MainTaskPreview from '@/components/Task/MainTaskPreview'
import MainLessonPreview from '@/components/Lesson/MainLessonPreview'
import EvaluationPreview from '@/components/Evaluation/EvaluationPreview'
import TopicPreview from '@/components/Topic/TopicPreview'
import { deleteMyContentByType, getMyContent } from '@/api/teacher'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { lessonStatus, lessonHost } from '@/const/googleSlide'
import { StartLesson } from '@/api/lesson'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import ClassList from '@/components/Teacher/ClassList'

export default {
  name: 'CreatedByMe',
  components: {
    ClassList,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MainTaskPreview,
    MainLessonPreview,
    EvaluationPreview,
    TopicPreview,
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
      currentPreviewLesson: null,

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 16,
        current: 1
      },
      pageNo: 1,

      typeMap: typeMap,
      viewPreviewSessionVisible: false,
      PPTCommentPreviewVisible: false,
      classList: [],
      viewMode: 'list'
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
      this.viewMode = viewMode
    },
    loadMyContent () {
      this.loading = true
      getMyContent({
        owner: ownerMap[this.currentOwner],
        status: statusMap[this.currentStatus],
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then(res => {
        logger.info('getMyContent', res)
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
      this.pageNo = 1
      this.loadMyContent()
    },
    toggleType (type, label) {
      logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.pageNo = 1
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
    handlePrevious (item) {
      this.$router.push({
        path: '/teacher/my-class?slideId=' + item.presentationId
      })
    },

    handleEvaluation (item) {
      this.$router.push({
        path: '/teacher/start-evaluation/' + item.id
      })
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      deleteMyContentByType(item).then(res => {
        logger.info('DeleteMyContentByType', res)
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
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleStartSession (item) {
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
            const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
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
            const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&direct=true&currentPage=0&type=dashboard'
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

    handleViewPreviewSession (item) {
      this.$logger.info('handleViewPreviewSession', item)
      this.currentPreviewLesson = item
      this.viewPreviewSessionVisible = true
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

.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
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
          width: 250px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: @primary-color;
          }
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
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 18px;
      padding-left: 10px;
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
}
</style>

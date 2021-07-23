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
        <a-space>
          <div class="type-filter">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ currentTypeLabel }} <a-icon type="down" />
              </a>
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
                <!--                <a-menu-item @click="toggleType('material', $t('teacher.my-content.materials-type'))">
                  <span>{{ $t('teacher.my-content.materials-type') }}</span>
                </a-menu-item>-->
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
            </a-dropdown>
          </div>
          <!--          <a-divider type="vertical" />-->
          <!--          <div class="owner-filter">-->
          <!--            <a-dropdown>-->
          <!--              <a class="ant-dropdown-link" @click="e => e.preventDefault()">-->
          <!--                {{ currentOwnerLabel }} <a-icon type="down" />-->
          <!--              </a>-->
          <!--              <a-menu slot="overlay">-->
          <!--                <a-menu-item @click.native="toggleOwner('all-owner', $t('teacher.my-content.all-owner') )">-->
          <!--                  <span>{{ $t('teacher.my-content.all-owner') }}</span>-->
          <!--                </a-menu-item>-->
          <!--                <a-menu-item @click="toggleOwner('owner-by-me', $t('teacher.my-content.owner-by-me') )">-->
          <!--                  <span>{{ $t('teacher.my-content.owner-by-me') }}</span>-->
          <!--                </a-menu-item>-->
          <!--                <a-menu-item @click="toggleOwner('owner-by-others', $t('teacher.my-content.owner-by-others'))">-->
          <!--                  <span>{{ $t('teacher.my-content.owner-by-others') }}</span>-->
          <!--                </a-menu-item>-->
          <!--              </a-menu>-->
          <!--            </a-dropdown>-->
          <!--          </div>-->
        </a-space>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name }}
                </span>
              </span>

              <span>
                <span class="name-content">
                  {{ item.createBy }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <div class="action">
                  <div slot="actions">
                    <div class="action-wrapper">
                      <template v-if="item.type === typeMap['lesson'] || item.type === typeMap['task']">
                        <div class="action-item">
                          <a @click="handleTeacherProjecting(item)">
                            <tv-svg />
                          </a>
                        </div>
                        <div class="action-item">
                          <a @click="handleDashboard(item)">
                            <a-icon type="menu" />
                          </a>
                        </div>
                      </template>
                      <template v-else>
                        <div class="action-item">
                          <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                            <a href="#" class="delete-action">
                              <a-icon type="delete" />
                            </a>
                          </a-popconfirm>
                        </div>
                        <div class="action-item">
                          <a @click="handleEditItem(item)">
                            <a-icon type="form" />
                          </a>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </span>

            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        closable
        width="900px"
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
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { DeleteSharedByIdAndType, GetShared } from '@/api/user'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import { lessonStatus, lessonHost } from '@/const/googleSlide'
import { StartLesson, getMyClasses } from '@/api/lesson'

export default {
  name: 'Shared',
  components: {
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

      typeMap: typeMap
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
    this.loadMyContent()
  },
  methods: {
    loadMyContent () {
      this.loading = true
      GetShared({
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then(res => {
        logger.info('GetShared', res)
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
      } else if (item.type === typeMap['material']) {
        this.$router.push({
          path: '/teacher/add-material/' + item.id
        })
      }
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      DeleteSharedByIdAndType({
        sourceId: item.id,
        sourceType: item.type
      }).then(res => {
        logger.info('DeleteSharedByIdAndType', res)
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
        width: 600px;
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
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: @primary-color;
          }
        }
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .action-item {
          display: inline;
          margin-left: 5px;
          user-select: none;
          font-size: 18px;

          a {
            width: 30px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            svg {
              width: 25px;
              height: 25px;
            }
          }
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
</style>

<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
      </div>
      <div class="type-owner">
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item disabled>
                <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
              </a-menu-item>
              <a-menu-item
                @click="toggleType('all-type', $t('teacher.my-content.all-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.all-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('topic', $t('teacher.my-content.topics-type') )">
                <span>{{ $t('teacher.my-content.topics-type') }}</span>
              </a-menu-item>
              <!--                <a-menu-item @click="toggleType('material', $t('teacher.my-content.materials-type'))">
                <span>{{ $t('teacher.my-content.materials-type') }}</span>
              </a-menu-item>-->
              <a-menu-item
                @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                <span>{{ $t('teacher.my-content.tasks-type') }}</span>
              </a-menu-item>
              <a-menu-item
                @click="toggleType('lesson', $t('teacher.my-content.lesson-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.lesson-type') }}</span>
              </a-menu-item>
              <a-menu-item
                @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
              </a-menu-item>
            </a-menu>
            <a-button
              style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;">
              Choose type(s)of content
              <a-icon type="caret-down"/>
            </a-button>
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
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="label-title-red">
          <div class="label-icon">
            <img src="~@/assets/icons/collaborate/invite.png" class="collaborate-icon"/>
          </div>
          <div class="label-text">Invitation received</div>
        </div>
        <div class="no-received-wrapper">
          <template v-if="sharedNotReceivedList.length">
            <div class="no-received-list" v-if="viewMode === 'list'">
              <div class="no-received-my-list-item " v-for="(item,index) in sharedNotReceivedList" :key="index">
                <div class="collaborate-item">
                  <div class="message-wrapper">
                    {{ item.message }}
                  </div>
                  <div class="collaborate-action-wrapper">
                    <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                      <div class="type-icon">
                        <content-type-icon size="40px" :type="item.content.type"/>
                      </div>
                      <div class="name"> {{ item.content.name }}</div>
                      <div class="time"> {{ item.createTime }}</div>
                      <div class="author">
                        {{ item.createBy }}
                      </div>
                    </div>
                    <div class="collaborate-action">
                      <div class="collaborate-action-item">
                        <a-button
                          class="button-item button-item-view"
                          @click="handleCollaborate(item)">
                          <img src="~@/assets/icons/collaborate/collaborate.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Collaborate
                          </span>
                        </a-button>
                      </div>
                      <div class="collaborate-action-item">
                        <a-popconfirm
                          :title="$t('teacher.my-content.action-delete') + '?'"
                          ok-text="Yes"
                          @confirm="handleDeleteCollaborate(item)"
                          cancel-text="No">
                          <a-button
                            class="button-item button-item-delete">
                            <img src="~@/assets/icons/collaborate/shanchu@2x.png" class="collaborate-icon"/>
                            <span
                              class="btn-text">
                              Delete
                            </span>
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-received-card-list" v-if="viewMode === 'img'">
              <div class="no-received-card-my-list-item" v-for="(item,index) in sharedNotReceivedList" :key="index">
                <div class="card-collaborate-item">
                  <div class="message-wrapper">
                    {{ item.message }}
                  </div>
                  <div class="collaborate-action-wrapper">
                    <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                      <div class="type-icon">
                        <content-type-icon size="40px" :type="item.content.type"/>
                        <div class="name"> {{ item.content.name }}</div>
                      </div>
                      <div class="sub-info">
                        <div class="time"> {{ item.createTime }}</div>
                        <div class="author">
                          {{ item.createBy }}
                        </div>
                      </div>
                    </div>
                    <div class="collaborate-action">
                      <div class="collaborate-action-item">
                        <a-button
                          class="button-item button-item-view"
                          @click="handleCollaborate(item)">
                          <img src="~@/assets/icons/collaborate/collaborate.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Collaborate
                          </span>
                        </a-button>
                      </div>
                      <div class="collaborate-action-item">
                        <a-popconfirm
                          :title="$t('teacher.my-content.action-delete') + '?'"
                          ok-text="Yes"
                          @confirm="handleDeleteCollaborate(item)"
                          cancel-text="No">
                          <a-button
                            class="button-item button-item-delete"
                            style="">
                            <img src="~@/assets/icons/collaborate/refuse.png" class="collaborate-icon"/>
                            <span
                              class="btn-text">
                              Delete
                            </span>
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="no-received-empty" v-if="sharedNotReceivedList.length === 0">
            <no-more-resources tips="No Invitation received"/>
          </div>
        </div>
        <div class="label-title-green">
          <div class="label-icon">
            <img src="~@/assets/icons/collaborate/Shared@2x.png" class="collaborate-icon"/>
          </div>
          <div class="label-text">Shared content</div>
        </div>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'list'">
            <a-list-item class="my-list-item" slot="renderItem" key="item.key" slot-scope="item">
              <div class="collaborate-item">
                <div class="collaborate-action-wrapper">
                  <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                    <div class="type-icon">
                      <content-type-icon size="40px" :type="item.content.type"/>
                    </div>
                    <div class="name"> {{ item.content.name }}</div>
                    <div class="time"> {{ item.createTime }}</div>
                    <div class="author">
                      {{ item.createBy }}
                    </div>
                    <div class="author">
                      <template v-if="item.content.status === 0">Draft</template>
                      <template v-if="item.content.status === 1">Published</template>
                    </div>
                  </div>
                  <div class="collaborate-action">
                    <div class="collaborate-action-item">
                      <a-button
                        class="button-item button-item-view"
                        @click="handleEditItem(item.content)"
                        style="">
                        <img src="~@/assets/icons/collaborate/bianji2.png" class="collaborate-icon"/>
                        <span
                          class="btn-text">
                          Edit
                        </span>
                      </a-button>
                    </div>
                    <div class="collaborate-action-item">
                      <a-popconfirm
                        :title="$t('teacher.my-content.action-delete') + '?'"
                        ok-text="Yes"
                        @confirm="handleDeleteCollaborate(item)"
                        cancel-text="No">
                        <a-button
                          class="button-item button-item-delete">
                          <img src="~@/assets/icons/collaborate/shanchu@2x.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Delete
                          </span>
                        </a-button>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'img'">
            <a-list-item slot="renderItem" class="card-my-list-item" key="item.key" slot-scope="item">
              <div class="card-collaborate-item">
                <div class="collaborate-action-wrapper">
                  <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                    <div class="type-icon">
                      <content-type-icon size="40px" :type="item.content.type"/>
                      <div class="name"> {{ item.content.name }}</div>
                    </div>
                    <div class="sub-info">
                      <div class="time"> {{ item.createTime }}</div>
                      <div class="author">
                        <template v-if="item.content.status === 0">Draft</template>
                        <template v-if="item.content.status === 1">Published</template>
                      </div>
                    </div>
                  </div>
                  <div class="collaborate-action">
                    <div class="collaborate-action-item">
                      <a-button
                        class="button-item button-item-view"
                        @click="handleEditItem(item.content)">
                        <img src="~@/assets/icons/collaborate/bianji2.png" class="collaborate-icon"/>
                        <span
                          class="btn-text">
                          Edit
                        </span>
                      </a-button>
                    </div>
                    <div class="collaborate-action-item">
                      <a-popconfirm
                        :title="$t('teacher.my-content.action-delete') + '?'"
                        ok-text="Yes"
                        @confirm="handleDeleteCollaborate(item)"
                        cancel-text="No">
                        <a-button
                          class="button-item button-item-delete">
                          <img src="~@/assets/icons/collaborate/shanchu@2x.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Delete
                          </span>
                        </a-button>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        width="800px"
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
              <common-preview :id="previewCurrentId" :type="previewType" />
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
  import { typeMap } from '@/const/teacher'
  import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
  import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
  import { DeleteCollaborate, GetShared, ReceiveCollaborate, GetSharedNotReceived } from '@/api/collaborate'
  import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
  import { lessonStatus, lessonHost } from '@/const/googleSlide'
  import { StartLesson, getMyClasses } from '@/api/lesson'
  import storage from 'store'
  import { VIEW_MODE } from '@/store/mutation-types'
  import CommonPreview from '@/components/Common/CommonPreview'
  import NoMoreResources from '@/components/Common/NoMoreResources'

  export default {
    name: 'Shared',
    components: {
      NoMoreResources,
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
        viewMode: storage.get(VIEW_MODE) ? storage.get(VIEW_MODE) : 'list',

        sharedNotReceivedList: []
      }
    },
    computed: {},
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
        GetSharedNotReceived().then((response) => {
          this.$logger.info('GetSharedNotReceived response', response)
          this.sharedNotReceivedList = response.result
        }).finally(() => {
          this.loading = false
          this.skeletonLoading = false
        })
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
        DeleteCollaborate({ id: item.id }).then(res => {
          logger.info('DeleteCollaborate', res)
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
            file_name: item.name ? item.name : 'Unnamed',
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
            file_name: item.name ? item.name : 'Unnamed',
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
      },

      handleCollaborate (item) {
        this.$logger.info('handleCollaborate', item)
        ReceiveCollaborate({ id: item.id }).then(res => {
          logger.info('ReceiveCollaborate', res)
          this.$message.success('collaborate success')
        }).then(() => {
          this.loadMyContent()
        })
      },

      handleDeleteCollaborate (item) {
        this.$logger.info('handleDeleteCollaborate', item)
        DeleteCollaborate({ id: item.id }).then(res => {
          logger.info('DeleteCollaborate', res)
        }).then(() => {
          this.loadMyContent()
        })
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
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;

    .collaborate-item {
      width: 100%;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;

        .collaborate-content-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;

          .name {
            padding-left: 10px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            padding-right: 10px;
          }

          .time {
            width: 150px;
            color: #000000;
            opacity: 0.5;
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          align-items: center;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .card-my-list-item {
    margin: 0 10px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .card-collaborate-item {
      width: 350px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      background: #FFFFFF;
      padding: 15px;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px 0;

        .collaborate-content-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;

          .type-icon {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              padding-left: 10px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              padding-right: 10px;
            }
          }

          .sub-info {
            width: 100%;
            padding-left: 45px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .time {
              width: 150px;
              color: #000000;
              opacity: 0.5;
            }
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-top: 20px;
          justify-content: flex-end;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
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
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
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

          .author {
            width: 150px;
          }

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

  .type-owner {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
  }

  .label-title-red {
    margin: 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(255, 51, 85, 0.1);
    opacity: 1;
    border-radius: 6px;

    .label-icon {
      img {
        height: 20px;
      }
    }

    .label-text {
      padding-left: 10px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #FF3355;
    }
  }

  .label-title-green {
    margin: 50px 0 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(21, 195, 154, 0.1);
    opacity: 1;
    border-radius: 6px;

    .label-icon {
      img {
        height: 20px;
      }
    }

    .label-text {
      padding-left: 10px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #15C39A;;
    }
  }

  .no-received-card-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 15px 10px;
  }

  .no-received-my-list-item {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    background: #FFFFFF;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;

    .collaborate-item {
      width: 100%;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0 0;

        .collaborate-content-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;

          .name {
            padding-left: 10px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            padding-right: 10px;
          }

          .time {
            width: 150px;
            color: #000000;
            opacity: 0.5;
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          align-items: center;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .no-received-card-my-list-item {
    margin: 0 10px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .card-collaborate-item {
      width: 350px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      background: #FFFFFF;
      padding: 15px;

      .message-wrapper {
        min-height: 150px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px 0;

        .collaborate-content-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;

          .type-icon {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              padding-left: 10px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              padding-right: 10px;
            }
          }

          .sub-info {
            width: 100%;
            padding-left: 45px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .time {
              width: 130px;
              opacity: 0.5;
              font-size: 12px;
              color: #000000;
            }

            .author {
              font-size: 13px;
              color: #000000;
            }
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-top: 20px;
          justify-content: flex-end;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .collaborate-action-wrapper {
    .button-item-delete {
      padding: 0 10px;
      display: flex;
      align-items: center;
      height: 36px;
      border-radius: 6px;
      background: rgba(255, 51, 85, 1);
      border: 1px solid #eee;
      font-family: Inter-Bold;
      color: #fff;
    }
    .button-item-view {
      padding: 0 10px;display:flex; align-items:center ;height: 36px;border-radius: 6px;background: #15C39A;border: 1px solid #eee;
      font-family: Inter-Bold;color: #fff;
    }
  }
</style>

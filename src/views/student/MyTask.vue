<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'active-mode' : currentStatus === ''}" @click="toggleStatus('')">
                {{ $t('teacher.my-content.all-status') }}
              </div>
              <div
                v-for="(item,index) in statusList"
                :key="'status'+index"
                :class="{'mode-item': true, 'active-mode' : currentStatus === item.value}"
                @click="toggleStatus(item.value)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="type-owner">
        <div class="my-search">
          <a-input-search
            placeholder="Search"
            v-model="searchText"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
        </div>
        <div class="filter-icon" @click="showFilter = !showFilter">
          <div class="filter-item">
            <filter-icon class="filter-icon" />
            <filter-active-icon class="filter-active-icon"/>
            <div class="filter-label">
              Filter
            </div>
          </div>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <pubu-svg />
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <liebiao-svg />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showFilter">
      <div class="filter-params">
        <filter-content
          @filter-config-update="handleUpdateFilterConfig"
          :filter-config="filterConfig"
          :age-options="filterAgeOptions"
          :period-options="filterPeriodOptions"
          :subject-options="filterSubjectOptions"
          :filter-fa-options="filterFaOptions"
          :filter-sa-options="filterSaOptions"
          :filter-activity-options="filterActivityOptions"
        />
      </div>
      <div class="expand-icon" v-if="showFilter" @click="showFilter = !showFilter">
        <a-icon type="up-circle" theme="filled" title="Collapse filter" /> Close
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="loading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'list'"
          >
            <a-list-item class="my-list-item" slot="renderItem" key="item.id" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">

                <span class="name-content">
                  {{ (item.task && item.task.name) ? item.task.name : 'Unnamed' }}
                </span>

                <!-- <span class="collaborate-icon-item" v-if="item.collaborates > 0">
                  <collaborate-svg />
                </span> -->

                <div class="my-list-progress" v-if="item.status === 0">
                  <a-progress
                    :stroke-color="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                    :strokeWidth="15"
                    :percent="item.percentage"
                  />
                </div>

              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime | dayjs }}
                </span>
                <span class="status">
                  {{ formatStatus(item.status) }}
                </span>
                <div class="action">
                  <div slot="actions">
                    <div class="action-wrapper">
                      <template v-if="currentStatus !== 2">
                        <div class="start-session-wrapper action-item-wrapper">
                          <div class="session-btn content-list-action-btn" >
                            <div class="session-btn-icon">
                              <student-pace />
                            </div>
                            <div class="session-btn-text"> Enter session</div>
                          </div>
                        </div>

                        <div class="more-action-wrapper action-item-wrapper" >
                          <a-dropdown>
                            <a-icon type="more" style="margin-right: 8px" />
                            <a-menu slot="overlay">
                              <a-menu-item>
                                <a @click="handleReportItem(item)">
                                  <a-icon type="bar-chart" /> Report
                                </a>
                              </a-menu-item>
                              <a-menu-item>
                                <a-popconfirm title="Archive ?" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                                  <a>
                                    <a-icon type="delete" theme="filled" /> Archive
                                  </a>
                                </a-popconfirm>
                              </a-menu-item>
                              <a-menu-item>
                                <a @click="handlePaymentItem(item)">
                                  <a-icon type="ordered-list" /> Payment Details
                                </a>
                              </a-menu-item>
                            </a-menu>
                          </a-dropdown>
                        </div>
                      </template>
                      <template v-else>
                        <div class="start-session-wrapper action-item-wrapper">
                          <div class="session-btn content-list-action-btn" @click="handlePermanentDeleteItem(item)">
                            <div class="session-btn-icon">
                              <a-icon type="delete" theme="filled" />
                            </div>
                            <div class="session-btn-text">Delete</div>
                          </div>
                        </div>
                        <div class="start-session-wrapper action-item-wrapper">
                          <a-popconfirm :title="'Confirm restore ' +((item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleRestoreItem(item)" cancel-text="No">
                            <div class="session-btn content-list-action-btn" >
                              <div class="session-btn-icon">
                                <a-icon type="undo" theme="filled" />
                              </div>
                              <div class="session-btn-text">Restore</div>
                            </div>
                          </a-popconfirm>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </span>
            </a-list-item>
          </a-list>
          <a-list
            :grid="{ gutter: 16, column: 4 }"
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'img'">
            <a-list-item slot="renderItem" key="item.id" slot-scope="item">
              <a-card class="cover-card" >
                <div class="mask"></div>

                <div class="mask-actions" v-if="currentStatus !== 2">
                  <div class="action-item action-item-top">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" class="more-icon" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a-popconfirm title="Archive ?" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                            <a>
                              <a-icon type="delete" theme="filled" /> Archive
                            </a>
                          </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item>
                          <a @click="handlePaymentItem(item)">
                            <a-icon type="ordered-list" /> Payment Details
                          </a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <div class="action-item action-item-center" v-if="currentStatus !== 2">
                    <div class="session-btn session-btn-right">
                      <div class="session-btn-text">
                        <student-pace />
                        Enter session
                      </div>
                    </div>
                  </div>
                  <div class="action-item action-item-bottom" >
                    <template v-if="currentStatus !== 2">
                      <div class="session-btn" @click.stop="handleReportItem(item)">
                        <div class="session-btn-icon content-list-action-btn">
                          <a-icon type="bar-chart" />
                        </div>
                        <div class="session-btn-text">Report</div>
                      </div>
                      <div class="session-btn" @click.stop="handleViewDetail(item)">
                        <div class="session-btn-icon content-list-action-btn">
                          <a-icon type="eye" theme="filled" />
                        </div>
                        <div class="session-btn-text">Preview</div>
                      </div>
                    </template>
                    <template v-if="currentStatus === 2">
                      <a-popconfirm :title="'Confirm restore ' +(( item.task && item.task.name) ? item.task.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleRestoreItem(item)" cancel-text="No">
                        <div class="session-btn">
                          <div class="session-btn-icon content-list-action-btn">
                            <bianji />
                          </div>
                          <div class="session-btn-text">Restore</div>
                        </div>
                      </a-popconfirm>
                      <a-popconfirm :title="'Confirm permanent delete ' +(item.name ? item.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handlePermanentDeleteItem(item)" cancel-text="No">
                        <div class="session-btn">
                          <div class="session-btn-icon content-list-action-btn">
                            <a-icon type="delete" theme="filled" />
                          </div>
                          <div class="session-btn-text">Delete</div>
                        </div>
                      </a-popconfirm>
                    </template>
                  </div>
                </div>
                <div class="cover-img" :style="{backgroundImage: 'url(' + (item.task && item.task.image) + ')'}"></div>

                <a-card-meta class="my-card-meta-info" :title="(item.task && item.task.name) ? item.task.name : 'Untitled'" :description="item.updateTime | dayjs">
                  <content-type-icon :type="item.type" slot="avatar"></content-type-icon>
                </a-card-meta>

                <div class="my-card-progress" v-if="item.status === 0">
                  <a-progress
                    :stroke-color="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                    :strokeWidth="15"
                    :percent="item.percentage"
                    :show-info="false" />
                  <label>{{ item.percentage }}%</label>
                </div>

                <!-- <collaborate-svg class="card-collaborate-icon-item" v-if="item.collaborates > 0"/> -->
              </a-card>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>
    </div>
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
            <common-preview :id="previewCurrentId" :type="previewType" :isLibrary="true"/>
          </div>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { CustomTagType, StudentStudyTaskStatus, CurriculumType, SESSION_VIEW_MODE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import CommonPreview from '@/components/Common/CommonPreview'
import NoMoreResources from '@/components/Common/NoMoreResources'
import FilterContent from '@/components/UnitPlan/FilterContent'

import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import PreviousSessionsSvg from '@/assets/icons/common/PreviousSessions.svg?inline'
import EditSvg from '@/assets/icons/common/Edit.svg?inline'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import StartSessionSvg from '@/assets/icons/common/StartSession.svg?inline'
import StudentPace from '@/assets/icons/common/StudentPace.svg?inline'
import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { SelfStudyTaskList } from '@/api/selfStudy'
import { FindCustomTags } from '@/api/tag'
import { SubjectTree } from '@/api/subject'
import { GetGradesByCurriculumId } from '@/api/preference'

import { StudyModeMixin } from '@/mixins/StudyModeMixin'

import storage from 'store'

export default {
  name: 'MyTask',
  mixins: [StudyModeMixin],
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    ContentTypeIcon,
    PreviousSessionsSvg,
    EditSvg,
    Bianji,
    StartSessionSvg,
    CollaborateSvg,
    StudentPace,
    CommonPreview,
    NoMoreResources,
    FilterContent
  },
  data() {
    return {
      loading: true,
      statusList: StudentStudyTaskStatus,
      typeMap: typeMap,
      currentStatus: '',
      myContentList: [],
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 16
      },
      pageNo: 1,
      // 当前选中的配置项
      filterConfig: {
        age: [],
        subject: [],
        period: '',
        faSaActivityType: '',
        unitType: '',
        projectBased: '',
        faTags: [],
        saTags: [],
        activityTags: []
      },
      filterSubjectOptions: [],
      filterAgeOptions: [],
      filterPeriodOptions: [],
      filterSaOptions: [],
      filterFaOptions: [],
      filterActivityOptions: [],
      showFilter: false,
      filterParams: {},
      lastedRevisionId: '',
      searchText: '',
      viewMode: storage.get(SESSION_VIEW_MODE) ? storage.get(SESSION_VIEW_MODE) : 'img',

      previewVisible: false,
      previewCurrentId: '',
      previewType: typeMap.task,
      currentPreviewLesson: null
    }
  },
  created () {
    logger.info('student my content')
    this.loadMyContent()
    this.initFilterOption()
  },
  methods: {
    loadMyContent() {
      this.loading = true
      let params = {
        status: this.currentStatus,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : ''
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      SelfStudyTaskList(params).then(res => {
        logger.info('SelfStudyTaskList', res)
        if (res.success) {
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },
    initFilterOption() {
      SubjectTree({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(grade => {
          this.filterAgeOptions.push({ label: grade.name, value: grade.id })
        })
      })
      this.loadUserTags()
      this.filterPeriodOptions = [
        { label: 'This month', value: 'month' },
        { label: 'Last 7 days', value: '7' }
      ]
    },
    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.filterSaOptions = []
          this.filterFaOptions = []
          this.filterActivityOptions = []
          const recommends = response.result.recommends
          // 默认展示的tag分类
          CustomTagType.task.sa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterSaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.fa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterFaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.activity.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterActivityOptions.push(parent)
              }
            })
          })
        }
      })
    },
    formatStatus (status) {
      const item = this.statusList.find(item => item.value === status)
      return item ? item.title : 'Undefined'
    },
    toggleStatus (status) {
      this.currentStatus = status
      this.pageNo = 1
      // sessionStorage.setItem(SESSION_CURRENT_STATUS, status)
      // sessionStorage.setItem(SESSION_CURRENT_PAGE, this.pageNo)
      this.loadMyContent()
    },
    toggleViewMode (viewMode) {
      storage.set(SESSION_VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    handleUpdateFilterConfig (filter) {
      // TODO 根据配置更新请求参数
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.filterParams = filter
      this.loadMyContent()
    },
    handleViewDetail (item) {
      logger.info('handleViewDetail', item)
      if (!item.task || this.currentStatus === 2) {
        return
      }
      this.previewCurrentId = item.taskId
      this.previewType = typeMap.task
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
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      // deleteMyContentByType(item).then(res => {
      //   logger.info('DeleteMyContentByType', res)
      // }).then(() => {
      //   this.loadMyContent()
      // })
    },
    handleRestoreItem (item) {
      logger.info('handleRestoreItem', item)
      // ContentRestore({ id: item.id, type: item.type }).then(response => {
      //   this.$logger.info('handleRestoreItem response', response)
      // }).finally(() => {
      //   this.loadMyContent()
      // })
    },
    handlePermanentDeleteItem (item) {

    },
    handlePaymentItem (item) {

    },
    handleReportItem (item) {

    },
    triggerSearch() {
      this.loadMyContent()
    }
  }
}
</script>

<style scoped lang="less">
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
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 15px;
  cursor: pointer;
  .collaborate-icon-item{
    width:30px;
    height: 30px;
    margin-left: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

            .active-mode {
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
    .my-search{
      margin-right: 10px;
      border-radius:6px;
      width: 200px;
      /deep/ .ant-input{
        border-radius:6px;
        height: 40px;
      }
    }

    .filter-icon {
      .filter-item {
        color: #333;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #D3D3D3;
        opacity: 1;
        border-radius: 6px;
        padding: 9px 15px;
        white-space:nowrap;
        margin-right: 20px;

        svg {
          height: 20px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          border: 1px solid #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }

        .filter-label {
          font-family: Inter-Bold;
          line-height: 20px;
          padding-left: 8px;
        }
      }
    }

  }
  .filter-params{
    margin-bottom: 5px;
    border: 1px solid #E4E4E4;
    padding: 5px 15px;
    border-radius: 5px;
    max-height: 290px;
    overflow: auto;
    background: rgba(228, 228, 228, 0.2);

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
    }
  }
  .expand-icon {
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding: 0 5px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 23px;
      }
    }
  }

  .content-wrapper {
    min-width: 900px;
    .content-list {
      min-width: 900px;
      .my-list-item {
        overflow: hidden;
        .content-info-left {
          cursor: pointer;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: calc(100% - 400px);

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
            width: 170px;
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
            width: 70px;
          }
        }
        .action {
          width: 200px;
        }

        .action-wrapper {
          height: 33px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .action-item-wrapper {
            display: none;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-left: 5px;

            .session-btn {
              display: flex;
              border-radius: 32px;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              padding: 6px 13px;
              background: rgba(245, 245, 245, 0.5);
              opacity: 1;
              border: 1px solid rgba(188, 188, 188, 1);

              .session-btn-icon {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                i {
                  svg {
                    height: 14px;
                    fill: #182552;
                    stroke: #182552;
                    stroke-width: 0.5px;
                  }
                }
              }
              .session-btn-text {
                font-size: 13px;
                padding-left: 7px;
                font-family: Inter-Bold;
                color: #182552;
                display: flex;
                align-items: center;
              }
            }

            .session-btn:hover {
              border-color: #15c39a;
              background: rgba(21, 195, 154, 0.1);
              .session-btn-icon {
                i {
                  svg {
                    fill: #15c39a;
                    stroke: #15c39a;
                    stroke-width: 0.5px;
                  }
                }

                svg {
                  fill: #15c39a;
                  stroke: #15c39a;
                  stroke-width: 0.5px;
                }
              }

              .session-btn-text {
                display: inline-block;
                color: #15C39A;
              }
            }
          }
        }

        .name-content {
          padding-left: 5px;
          text-align: left;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #11142D;
          display: inline-block;
          max-width: 300px;
          width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &:hover {
          box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.10);
          .action-wrapper {
            .action-item-wrapper {
              display: flex;
            }
          }
        }
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
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;

  &:hover {
    border: 1px solid #15c39a;
  }
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
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        height: 22px;
      }
    }

    .active-view {
      svg {
        fill: @primary-color;
      }
    }
  }
}

.mask {
  height: 100%;
  width: 100%;
  opacity: 0;
  margin:-10px;
  position: absolute;
  cursor: pointer;
  transition: opacity 0.8s;
  background: #0A1C32;
  border-radius: 6px;
}

.cover-card{
  background: #FFFFFF;
  opacity: 1;
  border-radius: 6px;
  border: none;
  position:relative;
  .card-collaborate-icon-item{
    width: 30px;
    padding-top: 17px;
    padding-right: 5px;
    position: absolute;
    right: 0;
    bottom: 5px;
  }

  .cover-img {
    width: 100%;
    min-height: 160px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 10px;
  }
  &:hover {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    .mask-actions{
      display: block;
    }
    .mask{
      opacity: 0.3;
    }
  }
  .mask-actions{
    margin:-10px;
    height: 100%;
    width: 100%;
    position: absolute;
    flex-direction: column;
    display: none;
    .action-item{
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
    .action-item-top{
      height: 20px;
      flex-direction: row;
      justify-content: flex-end;
      padding-top: 15px;
      i{
        width: 25px;
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }
    .action-item-center{
      min-height: 150px;
      .session-btn{
        margin:15px
      }
      .session-btn-left {
        width: 160px;
        height: 40px;
        background: #15C39A;
        opacity: 1;
        border-radius: 20px;
        justify-content: center;
        display: flex;
        padding: 6px 13px;
        .session-btn-text {
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
          display: flex;
          align-items: center;
          display: flex;
          align-items: center;
          svg {
            margin-right: 5px;
          }
        }
      }

      .session-btn-right {
        width: 160px;
        height: 40px;
        background: #182552;
        opacity: 1;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        padding: 6px 13px;
        .session-btn-text {
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
          display: flex;
          align-items: center;

          svg {
            margin-right: 5px;
          }
        }
      }
    }
    .action-item-bottom{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .session-btn {
        height: 33px;
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

  img {
    width: 100%;
    height: 160px;
    padding: 5px 10px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    //border-bottom: 1px solid #eee;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;

  }
}

.my-card-meta-info {
  margin-top: 10px;

  .ant-card-meta-avatar {
    padding-right: 0;
  }
}

.my-card-progress {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  & > label {
    width: 100%;
    position: absolute;
    top: 0;
    left: 10px;
    color: #fff;
    font-size: 12px;
    height: 22px;
    line-height: 22px;
  }
}

.my-list-progress {
  width: 150px;
  margin-left: 10px;
}

.preview-session-wrapper {
  min-height: 300px;

  .no-session {
    padding: 100px;
  }
  .preview-session-search{
    margin: 10px;
    width: 400px;
  }
}
</style>

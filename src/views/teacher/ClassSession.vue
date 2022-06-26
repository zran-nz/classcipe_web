<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type' :style="{visibility: WORK_SHOPS_TYPE.FEATURE.value !== queryParams.workshopsType ? 'visible' : 'hidden'}">
        <radio-switch @select="handleSelectWorkStatus" :menu-list='menuList' />
      </div>
      <div class='create-new'>
        <a-space>
          <custom-search-input :round='false' :value.sync='queryParams.searchKey' @search='handleSearch' placeholder='Search your content'/>
          <class-create-new @create='handleImport' v-show="WORK_SHOPS_TYPE.LUNCHEDBYME.value === queryParams.workshopsType"/>
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <content-item @reload="loadMyContent" @reFetch='loadMyContent' :show-type-name='false' v-for='item in myContentList' :key='item.id' :content='item.content' :session='item'>
              <template v-slot:cover-action>
                <div class='cover-action'>
                  <div class='action-btn' @click.stop=''>
                    <custom-button bg-color='#0C90E3' color='#ffffff' label='Student pace' @click="handleStartOrJoin(item.session, classStatus.studentPaced)"></custom-button>
                    <custom-button bg-color='#0C90E3' color='#ffffff' label='Teacher pace' @click="handleStartOrJoin(item.session, classStatus.teacherPaced)"></custom-button>
                  </div>
                </div>
              </template>
            </content-item>
          </template>
          <div class='empty-tips' v-if='pagination.total === 0 && !loading'>
            <no-more-resources />
          </div>
        </div>
      </a-spin>
      <div class='pagination' v-if='pagination.total !== 0 && !loading'>
        <a-pagination
          v-model="pageNo"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :showTotal='pagination.showTotal'
          @change='pagination.onChange'
          show-less-items />
      </div>
    </div>
    <a-modal
      v-model='importVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='1000px'
      @cancel='handleCloseImport'>
      <content-select
        :type="importType"
        :title="importType === typeMap.task ? 'Select Task content' : 'Select PD content'"
        @choose="handleChoose"
      />
    </a-modal>

    <!--    <a-modal-->
    <!--      v-model="oldSelectSessionVisible"-->
    <!--      :footer="null"-->
    <!--      :title="null"-->
    <!--      :closable="true"-->
    <!--      destroyOnClose-->
    <!--      :dialog-style="{ top: '50px' }"-->
    <!--      width="950px">-->
    <!--      <div>-->
    <!--        <old-session-list-->
    <!--          :task-id='oldSelectSessionTaskId'-->
    <!--          :session-list="sessionList"-->
    <!--          @start-new-session="handleStartSession"-->
    <!--          @cancel="oldSelectSessionVisible=false"-->
    <!--          @show-preview-session-list='viewPreviewSessionVisible = true'-->
    <!--          :mode="sessionMode" />-->
    <!--      </div>-->
    <!--    </a-modal>-->

  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import RadioSwitch from '@/components/Common/RadioSwitch'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE, WORK_SHOPS_STATUS, WORK_SHOPS_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import ContentItem from '@/components/ClassSession/ContentItem'
import ContentSelect from '@/components/MyContentV2/ContentSelect'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { findClassSessionsV2 } from '@/api/v2/classes'
import { StudentClassMixin } from '@/mixins/StudentClassMixin'
import ContentTypeFilter from '@/components/MyContentV2/ContentTypeFilter'
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ClassCreateNew from '@/components/ClassSession/ClassCreateNew'
import CustomButton from '@/components/Common/CustomButton'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import OldSessionList from '@/components/Teacher/OldSessionList'
import moment from 'moment'
import { AddOrUpdateClass, StartOpenSession } from '@/api/classroom'

export default {
  name: 'ClassSession',
  mixins: [StudentClassMixin],
  components: {
    OldSessionList,
    CustomButton,
    ClassCreateNew,
    CustomSearchInput,
    UserProfileAvatar,
    GlobalSearchInput,
    ContentTypeFilter,
    ContentItem,
    ContentFilter,
    CreateNew,
    RadioSwitch,
    NoMoreResources,
    ContentSelect
  },
  watch: {
    $route(to, from) {
        this.loadMyContent()
    }
  },
  data () {
    return {
      typeMap: typeMap,
      menuList: [
        {
          name: 'Scheduled',
          type: 2
        },
        {
          name: 'On-going',
          type: 1
        },
        {
          name: 'Ended',
          type: 3
        }
      ],
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      WORK_SHOPS_TYPE_VALUES: Object.values(WORK_SHOPS_TYPE),
      queryParams: {
        classId: '',
        status: 2, // 2: scheduled, 1: on-going, 3: ended
        searchKey: ''
      },
      loading: true,
      myContentList: [],

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          sessionStorage.setItem(SESSION_CURRENT_PAGE, page)
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        current: 1,
        total: 0,
        pageSize: 16
      },
      pageNo: sessionStorage.getItem(SESSION_CURRENT_PAGE) ? parseInt(sessionStorage.getItem(SESSION_CURRENT_PAGE)) : 1,

      filterParams: {},
      radioSwitchShow: false,

      importVisible: false,
      importType: typeMap.task,

      oldSelectSessionVisible: false,
      viewPreviewSessionVisible: false,
      oldSelectSessionTaskId: null,
      sessionMode: null,
      sessionItem: null,
      lastedRevisionId: null,
      sessionList: [],
      startLoading: false,
      classStatus: lessonStatus
    }
  },
  created() {
    this.loadMyContent()
  },
  methods: {
    handleClassChange(classList) {
      if (classList && classList.length > 0) {
        console.log(classList)
        const currentClass = classList.filter(item => item.id === this.$route.params.classId)
        if (currentClass.length === 0) {
          const classId = classList[0].id
          this.$router.push(`/teacher/class-session/${classId}`)
        }
      } else {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }
    },
    handleSearch () {
      this.pageNo = 1
      this.loadMyContent()
    },
    handleImport(type) {
      this.$logger.info('handleImport', type)
      // this.importType = type
      // this.importVisible = true
    },
    handleCloseImport() {
      this.importVisible = false
    },
    changeType(item) {
      this.queryParams.workshopsType = item.value
      if (item.value === this.WORK_SHOPS_TYPE.FEATURE.value) {
        // TODO
        this.queryParams.status = '' // this.WORK_SHOPS_STATUS.SCHEDULE.value
      } else {
        this.queryParams.status = this.WORK_SHOPS_STATUS.ONGOING.value
      }
      this.loadMyContent()
    },
    loadMyContent () {
      this.loading = true
      this.queryParams.classId = this.$route.params.classId
      let params = {
        ...this.queryParams,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        types: [],
        delFlag: 0
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      findClassSessionsV2(params).then(res => {
        logger.info('getMyContent', res)
        if (res.success && res.code === 0) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          if (res.result.records.length === 0 && this.pagination.total > 0) {
            this.pageNo = res.result.pages
            this.loadMyContent()
          }
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },
    handleChoose(item) {
      console.log(item)
      this.importVisible = false
      this.$router.push({
        path: '/teacher/schedule-session/' + item.id + '/' + item.type
      })
    },

    handleSelectWorkStatus (item) {
      this.queryParams.status = item.type
      this.loadMyContent()
    },

    handleStartSessionHistory (item, mode) {
      this.$logger.info('handleStartSessionHistory', item, 'mode:', mode)
      this.sessionMode = mode
      this.sessionItem = item
      // if (!item.presentationId) {
      //   this.$message.warn('This Task is not bound to PPT!')
      // }
      // logger.info('loadTeacherClasses  slideId:' + item.presentationId)
      // this.loading = true
      // FindNewClasses({ slideId: item.presentationId }).then(response => {
      //   logger.info('FindNewClasses', response.result.data)
      //   if (response.success) {
      //     this.sessionList = response.result.classList
      //     this.lastedRevisionId = response.result.revisionId
      //   }
      //   this.loading = false
      // }).finally(() => {
      //   this.oldSelectSessionVisible = true
      //   this.oldSelectSessionTaskId = item.id
      //   this.$logger.info('set currentPreviewLesson', item)
      //   this.currentPreviewLesson = item
      // })
    },

    handleStartSession () {
      this.startLoading = true
      const item = this.sessionItem
      this.$logger.info('handleStartSession', item)
      if (item.presentationId) {
        const requestData = {
          taskId: item.id,
          mode: this.sessionMode === 1 ? lessonStatus.teacherPaced : lessonStatus.studentPaced
        }
        this.$logger.info('handleStartSession', requestData)
        StartOpenSession(requestData).then(res => {
          this.$logger.info('StartOpenSession res', res)
          if (res.success) {
            this.startLoading = false
            const targetUrl = lessonHost + 'd/' + res.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
            this.$logger.info('try open ' + targetUrl)
            const url = lessonHost + 't/' + res.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
            let windowObjectReference
            const height = document.documentElement.clientHeight * 0.7
            const width = document.documentElement.clientWidth * 0.7
            const strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
            if (this.sessionMode === 1) {
              windowObjectReference = window.open(
                'about:blank',
                '_blank',
                strWindowFeatures
              )
              windowObjectReference.location = url
              setTimeout(function () {
                window.location.href = targetUrl
              }, 1000)
            } else {
              window.location.href = targetUrl
            }
          } else {
            this.$message.warn('StartLesson Failed! ' + res.message)
            this.startLoading = false
          }
        })
      } else {
        this.$message.warn('This record is not bound to PPT!')
        this.startLoading = false
      }
    },
    goToClassPage(classId) {
      const dashUrl = lessonHost + 'd/' + classId + '?token=' + storage.get(ACCESS_TOKEN)
      const url = lessonHost + 't/' + classId + '?token=' + storage.get(ACCESS_TOKEN)
      var height = document.documentElement.clientHeight * 0.7
      var width = document.documentElement.clientWidth * 0.7
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
      var windowObjectReference
      if (this.mode === 1) {
        windowObjectReference = window.open(
          'about:blank',
          '_blank',
          strWindowFeatures
        )
        windowObjectReference.location = url
        setTimeout(function () {
          window.location.href = dashUrl
        }, 1000)
      } else {
        window.location.href = dashUrl
      }
    },

    handleStartOrJoin (item, paced) {
      this.$logger.info('handleStartOrJoin', item, 'paced:', paced)
      this.loading = true
      if (item.status !== paced) {
        const data = Object.assign({}, item)
        // 状态需要提交后台处理
        data.status = paced
        // 课程开始时间未设置
        if (!data.date) {
          data.date = parseInt(moment.utc(new Date()).toDate().getTime() / 1000)
        }

        AddOrUpdateClass(data).then(response => {
          item.loading = false
          this.goToClassPage(item.classId)
        })
      } else {
        this.goToClassPage(item.classId)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-content {
  padding: 15px;
  background: #fff;
  height: 100%;

  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }

  .create-new {
    max-width: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .content-wrapper {
    min-height: calc(100vh - 160px);
    .content-list {
      min-height: calc(100vh - 200px);

      .empty-tips {
        height: calc(100vh - 300px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

</style>

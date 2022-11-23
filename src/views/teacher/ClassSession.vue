<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type' :style="{visibility: WORK_SHOPS_TYPE.FEATURE.value !== queryParams.workshopsType ? 'visible' : 'hidden'}">
        <!-- <radio-switch @select="handleSelectWorkStatus" :menu-list='menuList' :default-selected-item="getSelectItem"/> -->
        <radio-switch
          v-if="userMode !== USER_MODE.SELF"
          @select="handleSelectQueryType"
          :menu-list='queryTypeList'
          :default-selected-item="defaultQueryType"
          displayProperty="label"
        />
        <label for="" class="class-name">{{ className }}</label>
      </div>
      <div class='create-new'>
        <a-space>
          <custom-search-input :round='false' :value.sync='queryParams.sessionName' @search='handleSearch' placeholder='Search your content'/>
          <class-create-new @create='handleImport'/>
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='filter-bar'>
      <a-space class="status-filter">
        <label
          :class="{active: queryParams.status == item.type}"
          v-for="item in menuList"
          @click="handleSelectWorkStatus(item)"
          :key="item.name"><a>{{ item.name }}</a></label>
      </a-space>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <ContentItem
              @reload="loadMyContent"
              @reFetch='loadMyContent'
              :show-type-name='true'
              v-for='item in myContentList'
              :key='item.id'
              :content='item.content'
              :show-button="false"
              :school-resource="item.schoolId !== '0'"
              :school-resource-id="item.schoolId"
              :show-avatar-tips="true"
              :session='item'>
              <template v-slot:cover-action v-if="queryParams.queryType == 1">
                <div class='cover-action'>
                  <div class='action-btn' @click.stop=''>
                    <custom-button bg-color='#0C90E3' color='#ffffff' label='Dashboard view' @click="goToClassPage(item.session.classId, classStatus.studentPaced)"></custom-button>
                    <custom-button bg-color='#0C90E3' color='#ffffff' label='Classroom view' @click="goToClassPage(item.session.classId, classStatus.teacherPaced)"></custom-button>
                  </div>
                </div>
              </template>
            </ContentItem>
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
import {
  WORK_SHOPS_STATUS,
  WORK_SHOPS_TYPE,
  USER_MODE
} from '@/const/common'
import { typeMap } from '@/const/teacher'
import ContentItem from '@/components/ClassSession/ContentItem'
import ContentSelect from '@/components/MyContentV2/ContentSelect'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { findClassSessionsV2 } from '@/api/v2/classes'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
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
import { uniqBy } from 'lodash-es'

import { mapState } from 'vuex'

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
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setV2Box', null)
    next()
  },
  data () {
    return {
      typeMap: typeMap,
      USER_MODE: USER_MODE,
      menuList: Object.values(WORK_SHOPS_STATUS).map(item => ({
        name: item.label,
        type: item.value
      })),
      queryTypeList: [{
        label: 'My Session',
        value: 1
      }, {
        label: 'Others',
        value: 2
      }],
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      WORK_SHOPS_TYPE_VALUES: Object.values(WORK_SHOPS_TYPE),
      queryParams: {
        classId: '',
        status: WORK_SHOPS_STATUS.SCHEDULE.value, // 2: scheduled, 1: on-going, 3: ended
        sessionName: '',
        queryType: 1,
        delFlag: 0
      },
      loading: true,
      myContentList: [],

      pagination: {
        onChange: page => {
          console.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        current: 1,
        total: 0,
        pageSize: 16
      },
      pageNo: 1,

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
      classStatus: lessonStatus,

      subjectOptions: [],
      gradeOptions: [],
      curriculumOptions: []
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList
    }),
    getSelectItem() {
      const index = this.menuList.findIndex(item => item.type === this.queryParams.status)
      if (index > -1) {
        return this.menuList[index]
      }
      return this.menuList[0]
    },
    defaultQueryType() {
      if (this.queryParams.queryType) {
        const index = this.queryTypeList.findIndex(item => item.value + '' === this.queryParams.queryType + '')
        if (index > -1) {
          return this.queryTypeList[index]
        }
      }
      return this.queryTypeList[0]
    },
    className() {
      const clsId = this.$route.params.classId
      const cls = this.classList.find(item => item.id === clsId)
      if (cls.classType === 0) {
        const grade = this.gradeOptions.find(grade => grade.gradeId === cls.gradeId)
        if (grade) {
          return `${this.curriculumOptions[grade.curriculumId]} - ${grade.gradeName} - ${cls.name}`
        }
      } else if (cls.classType === 1) {
        const subject = this.subjectOptions.find(subject => subject.subjectId === cls.subject)
        if (subject) {
          return `${subject.subjectName} - ${cls.name}`
        }
      }
      return cls.name
    }
  },
  created() {
    if (this.$route.query.workshopsStatus) {
      this.queryParams.status = this.$route.query.workshopsStatus
    }
    if (this.$route.query.queryType) {
      this.queryParams.queryType = this.$route.query.queryType
    }
    this.loadMyContent()
    this.initData()
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
    initData() {
      this.loading = true
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        getCurriculumBySchoolId({
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes, gradeRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList.map(sub => ({
                ...sub,
                curriculumId: item.curriculumId
              })))
            }
          })
          this.subjectOptions = uniqBy(subjects.map(item => {
            return {
              subjectId: item.parentSubjectId,
              subjectName: item.parentSubjectName,
              curriculumId: item.curriculumId
            }
          }), 'subjectId')
        }
        if (gradeRes.success) {
          let grades = []
          gradeRes.result.forEach(item => {
            grades = grades.concat((item.gradeSettingInfo || []).map(grade => ({
              ...grade,
              curriculumId: item.curriculumId
            })))
            this.curriculumOptions[item.curriculumId] = item.curriculumName
          })
          this.gradeOptions = grades
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNo = 1
      this.loadMyContent()
    },
    handleImport(val) {
      console.info('handleImport', val)
      const type = val === 'quick' ? typeMap.task : val
      const source = val === 'quick' ? val : ''
      const subpath = val === 'quick' ? '/v2' : ''
      const path = `${subpath}/teacher/session-import/${type}/${this.$route.params.classId}?searchType=2&source=${source}`
      if (val === 'quick') {
        console.log('PATH', `${window.origin}${path}`);
        window.location.href = `${window.origin}${path}`
      } else {
        this.$router.push(path)
      }
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
        this.queryParams.status = this.WORK_SHOPS_STATUS.SCHEDULE.value
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
        types: []
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      findClassSessionsV2(params).then(res => {
        console.info('getMyContent', res)
        if (res.success && res.code === 0) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          res.result.records.forEach(record => {
            record.allowEdit = true
            // archive no edit
            if (this.queryParams.status + '' === '-1') {
              record.allowEdit = false
            }
            if (record.session.sessionStartTime) {
              const startTimestamp = moment.utc(record.session.sessionStartTime).toDate().getTime()
              if (startTimestamp < Date.now()) {
                record.allowEdit = false
              }
            }
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
        console.info('myContentList', this.myContentList)
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
      this.$router.replace({
        path: `/teacher/class-session/${this.$route.params.classId}?workshopsStatus=${this.queryParams.status}&queryType=${this.queryParams.queryType}`
      })
    },

    handleSelectQueryType (item) {
      this.queryParams.queryType = item.value
      this.$router.replace({
        path: `/teacher/class-session/${this.$route.params.classId}?workshopsStatus=${this.queryParams.status}&queryType=${this.queryParams.queryType}`
      })
    },

    handleStartSessionHistory (item, mode) {
      console.info('handleStartSessionHistory', item, 'mode:', mode)
      this.sessionMode = mode
      this.sessionItem = item
      // if (!item.presentationId) {
      //   this.$message.warn('This Task is not bound to PPT!')
      // }
      // console.info('loadTeacherClasses  slideId:' + item.presentationId)
      // this.loading = true
      // FindNewClasses({ slideId: item.presentationId }).then(response => {
      //   console.info('FindNewClasses', response.result.data)
      //   if (response.success) {
      //     this.sessionList = response.result.classList
      //     this.lastedRevisionId = response.result.revisionId
      //   }
      //   this.loading = false
      // }).finally(() => {
      //   this.oldSelectSessionVisible = true
      //   this.oldSelectSessionTaskId = item.id
      //   console.info('set currentPreviewLesson', item)
      //   this.currentPreviewLesson = item
      // })
    },

    handleStartSession () {
      this.startLoading = true
      const item = this.sessionItem
      console.info('handleStartSession', item)
      if (item.presentationId) {
        const requestData = {
          taskId: item.id,
          mode: this.sessionMode === 1 ? lessonStatus.teacherPaced : lessonStatus.studentPaced
        }
        console.info('handleStartSession', requestData)
        StartOpenSession(requestData).then(res => {
          console.info('StartOpenSession res', res)
          if (res.success) {
            this.startLoading = false
            const targetUrl = lessonHost + 'd/' + res.result.classId + '?token=' + storage.get('feathers-jwt')
            console.info('try open ' + targetUrl)
            const url = lessonHost + 't/' + res.result.classId + '?token=' + storage.get('feathers-jwt')
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
    goToClassPage(classId, pace) {
      var height = document.documentElement.clientHeight * 0.7
      var width = document.documentElement.clientWidth * 0.7
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
      var windowObjectReference
      if (pace === 'teacher-paced') {
        windowObjectReference = window.open('about:blank', '_blank', strWindowFeatures)
        windowObjectReference.location = lessonHost + 't/' + classId + '?token=' + storage.get('feathers-jwt')
      } else {
        window.location.href = lessonHost + 'd/' + classId + '?token=' + storage.get('feathers-jwt') // + '&status=student'
      }
    },
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
    max-width: 500px;
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
.source-type {
  display: flex;
  align-items: center;
  .class-name {
    margin-left: 20px;
    font-weight: bold;
  }
}
.filter-bar {
    position: relative;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-filter {
      label {
        margin-right: 20px;
        border-radius: 3px;
        padding:5px;
        height: 30px;
        display: flex;
        a {
          color: #464749;
          font-size: 14px;
        }
        &.active {
          background: #F8FAFB;
          a {
            font-weight: bold;
            color: #1574B7;
          }
        }
      }
    }
}
</style>

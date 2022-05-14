<template>
  <div class="my-content">
    <div class="filter-line">
      <radio-switch @select="toggleType" :menu-list='menuList'/>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <favorite-content-item v-for='item in myContentList' :key='item.id' :content='item' @delete='handleDeleteItem' @duplicate='handleDuplicateItem'></favorite-content-item>
          </template>
          <template v-if='pagination.total === 0 && !loading'>
            <div class='empty-tips'>
              <no-more-resources />
            </div>
          </template>
        </div>
      </a-spin>
      <div class='pagination'>
        <a-pagination
          v-model="pageNo"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :showTotal='pagination.showTotal'
          @change='pagination.onChange'
          show-less-items />
      </div>
    </div>
    <a-drawer
      destroyOnClose
      placement="right"
      :closable="false"
      width="1000px"
      :visible="previewVisible"
      @close="handlePreviewClose"
    >
      <div class="preview-wrapper-row">
        <div class="view-back">
          <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
        </div>
        <div class="detail-wrapper" v-if="previewCurrentId && previewType">
          <common-preview-v2 @favoritiesAdd="handleFavoriteChange" :id="previewCurrentId" :type="previewType" />
        </div>
      </div>
    </a-drawer>

    <a-modal
      v-model="viewPreviewSessionVisible"
      :footer="null"
      :title="null"
      :closable="false"
      destroyOnClose
      width="900px">
      <modal-header @close="viewPreviewSessionVisible = false"/>
      <div class="preview-session-wrapper">
        <class-list :slide-id="currentPreviewLesson.presentationId" :classData="currentPreviewLesson" v-if="currentPreviewLesson && currentPreviewLesson.presentationId"/>
        <no-more-resources tips="Not exist previous sessions" v-else/>
      </div>
    </a-modal>

    <a-modal
      title="Add session tags"
      v-model="lessonSelectTagVisible"
      :maskClosable="false"
      :closable="true"
      destroyOnClose
      width="800px">
      <div>
        <div>
          <custom-tag
            :user-tags="userTags"
            :custom-tags-list="['class']"
            :selected-tags-list="sessionTags"
            ref="customTag"
            @change-user-tags="handleSelectedSessionTags"></custom-tag>
        </div>
      </div>
      <template slot="footer">
        <a-button key="back" @click="lessonSelectTagVisible=false">
          Cancel
        </a-button>
        <a-button key="submit" type="primary" :loading="startLoading" @click="handleStartSession()">
          Start
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { Duplicate, SaveSessonTags } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { FavoritesDelete, FavoritesGetMyFavorites } from '@/api/favorites'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import { lessonHost, lessonStatus } from '@/const/googleSlide'
import { StartLesson } from '@/api/lesson'
import ModalHeader from '@/components/Common/ModalHeader'
import { CustomTagType, USER_MODE } from '@/const/common'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import { FindCustomTags } from '@/api/tag'
import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import EvaluationSvg from '@/assets/icons/common/evaluation.svg?inline'
import PreviousSessionsSvg from '@/assets/icons/common/PreviousSessions.svg?inline'
import EditSvg from '@/assets/icons/common/Edit.svg?inline'
import CopySvg from '@/assets/icons/common/copy.svg?inline'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import StartEvaluation from '@/assets/icons/common/StartEvaluation.svg?inline'
import StartSessionSvg from '@/assets/icons/common/StartSession.svg?inline'
import TeacherPresenting from '@/assets/icons/common/TeacherPresenting.svg?inline'
import StudentPace from '@/assets/icons/common/StudentPace.svg?inline'
import ClassList from '@/components/Teacher/ClassList'
import CustomTag from '@/components/UnitPlan/CustomTag'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import ContentItem from '@/components/MyContentV2/ContentItem'
import FavoriteContentItem from '@/components/MyContentV2/FavoriteContentItem'
import RadioSwitch from '@/components/Common/RadioSwitch'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

export default {
  name: 'MyFavorite',
  components: {
    RadioSwitch,
    FavoriteContentItem,
    ContentItem,
    CommonPreviewV2,
    ContentStatusIcon,
    ContentTypeIcon,
    ModalHeader,
    TvSvg,
    Bianji,
    TeacherPresenting,
    EvaluationSvg,
    StartSessionSvg,
    PreviousSessionsSvg,
    StartEvaluation,
    ClassList,
    StudentPace,
    CustomTag,
    EditSvg,
    CopySvg,
    LiebiaoSvg,
    PubuSvg,
    NoMoreResources
  },
  mixins: [ GoogleAuthCallBackMixin, UserModeMixin, CurrentSchoolMixin ],
  data () {
    return {
      loading: true,
      myContentList: [],
      currentType: null,

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
        pageSize: 15
      },
      pageNo: 1,

      typeMap: typeMap,

      viewPreviewSessionVisible: false,
      PPTCommentPreviewVisible: false,
      classList: [],
      lessonSelectTagVisible: false,
      sessionTags: [],
      sessionItem: {},
      startLoading: false,
      userTags: {},

      customTagList: [],

      menuList: [
        {
          name: 'All types',
          type: null
        },
        {
          name: 'Unit Plan',
          type: this.$classcipe.typeMap['unit-plan']
        },
        {
          name: 'Task',
          type: this.$classcipe.typeMap['task']
        }
      ]
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
    this.loadMyContent()
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.pageNo = 1
      this.loadMyContent()
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      if (userMode === USER_MODE.SELF) {
        this.pageNo = 1
        this.loadMyContent()
      }
    },
    loadMyContent () {
      this.loading = true
      const postData = {
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }

      if (this.currentType) {
        postData.type = this.currentType
      }
      FavoritesGetMyFavorites(postData).then(res => {
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
      })
    },
    toggleType (item) {
      logger.info('toggleType ', item)
      this.currentType = item.type
      this.loadMyContent()
    },

    handleEditItem (item) {
      logger.info('handleEditItem', ...item)
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.evaluation) {
        this.$router.push({
          path: '/teacher/evaluation-redirect/' + item.id
        })
      }
    },

    handleDuplicateItem (data) {
      this.$logger.info('handleDuplicateItem', data)
      const item = data.content
      this.$confirm({
        title: 'Confirm duplicate',
        content: 'Are you sure to duplicate ' + item.name + ' ?',
        centered: true,
        onOk: () => {
          Duplicate({ id: item.id, type: item.type }).then((response) => {
            if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
              this.$logger.info('Duplicate response', response)
              this.$message.success('Duplicate successfully! Please check in My Content.')
            } else {
              this.currentMethodName = 'handleDuplicateItem'
              this.currentMethodParam = data
            }
          })
        }
      })
    },

    handleAuthCallback () {
      this.$logger.info('Shared handleAuthCallback')
      if (this.currentMethodName === 'handleDuplicateItem') {
        this.handleDuplicateItem(this.currentMethodParam)
      }
    },

    handlePrevious (item) {
      this.$router.push({
        path: '/teacher/my-class?slideId=' + item.presentationId
      })
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      FavoritesDelete(item).then(res => {
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
      this.previewVisible = false
      this.$nextTick(() => {
        this.previewCurrentId = null
        this.previewType = -1
      })
    },

    handleStartSession () {
      this.$logger.info('selected sessionTags', this.sessionTags)
      if (this.sessionTags.length === 0) {
        this.$message.warn('Please add session tags')
        return
      }
      this.startLoading = true
      const item = this.sessionItem
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
            const dataTags = []
            this.sessionTags.forEach(tag => {
              dataTags.push({
                'name': tag.name,
                'parentId': tag.parentId,
                'isGlobal': tag.isGlobal ? 1 : 0,
                'classId': res.data.class_id,
                'presentationId': item.presentationId,
                'sourceId': item.id,
                'sourceType': item.type
              })
            })
            SaveSessonTags(dataTags).then(() => {
              this.startLoading = false
              this.lessonSelectTagVisible = false
              // const targetUrl = lessonHost + 'slide_id=' + item.presentationId + '&class_id=' + res.data.class_id + '&type=classroom'
              const targetUrl = lessonHost + 'd/' + res.data.class_id
              this.$logger.info('try open ' + targetUrl)
              // window.open(targetUrl, '_blank')
              // 课堂那边需要点击返回回到表单，改成location.href跳转
              window.location.href = targetUrl
            })
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
            const targetUrl = lessonHost + 'd/' + res.data.class_id
            this.$logger.info('try open ' + targetUrl)
            // window.open(targetUrl, '_blank')
            // 课堂那边需要点击返回回到表单，改成location.href跳转
            window.location.href = targetUrl
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
    },
    handleSelectedSessionTags (tags) {
      this.sessionTags = tags
      this.$logger.info('handleSelectedSessionTags', tags)
    },
    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.userTags = response.result
          // 默认展示的tag分类
          CustomTagType.task.default.forEach(name => {
            this.customTagList.push(name)
          })
          // 再拼接自己添加的
          this.userTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name) === -1) {
              this.customTagList.push(tag.name)
            }
          })
        } else {
          this.$message.error(response.message)
        }
        // this.$refs.customTag.tagLoading = false
      })
    },
    handleFavoriteChange(item) {
      this.loadMyContent()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-content {
  padding: 0 15px 25px 15px;
  background: #fff;
  .filter-line {
    padding-top: 10px;
    display: flex;
    justify-content: space-between;

    .type-owner {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
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

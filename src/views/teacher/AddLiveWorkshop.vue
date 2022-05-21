<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Back'
          :form='form'
          :show-share='false'
          :show-collaborate='false'
          :last-change-saved-time='lastChangeSavedTime'
          @back='goBack'>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
      <template v-slot:nav>
        <my-vertical-steps
          ref='steps-nav'
          :steps='steps'
          :step-index='currentActiveStepIndex'
          @step-change='handleStepChange' />
      </template>
    </fixed-form-header>
    <div class='form-content'>
      <div class='step-content' v-if='!contentLoading'>
        <div class='form-body root-locate-form' id='form-body'>
          <div class="choose-session">
            <div class="choose-session-title">
              <a-input v-model="form.title"></a-input>
            </div>
            <div class="choose-session-cover">
              <custom-cover-media :type='form.coverType' :url='form.cover' @update='handleUpdateCover'/>
            </div>
          </div>
          <template v-if="userMode === USER_MODE.SELF">
            <div class="pay-session">
              <label for="">Paid session</label>
              <a-switch v-model="form.paidType" />
              <div class="pay-session-discount" v-show="form.paidType">
                <price-discount-set ref="priceDiscount"/>
              </div>
            </div>
            <div class="pay-session">
              <label for="">Max Participants</label>
              <a-switch v-model="form.needParticipants" />
              <div class="pay-session-participants" v-show="form.needParticipants">
                <a-input-number placeholder="Participants" v-model="form.maxParticipants"></a-input-number>
              </div>
            </div>
            <div class="pay-session">
              <label for="">Register Before</label>
              <a-date-picker :show-time="{ format: 'HH:mm' }" @change="handleSelectDate" />
            </div>
          </template>
          <template v-else>
            <a-radio-group class="notify-session" v-model="form.notifyType">
              <a-radio v-for="item in NOTIFY_TYPE" :value="item.value" :key="item.value">
                {{ item.label }}
                <a-popover title="Teachers" placement="right" v-show="item.value === NOTIFY_TYPE.FILTER.value" >
                  <template slot="content">
                    <div class="member-list" v-if="memberList && memberList.length > 0">
                      <div class="member-item" v-for="member in memberList" :key="member.id">
                        <a-avatar class="item-avatar" icon="user" v-if="!member.avatar"/>
                        <img :src="member.avatar" class="item-avatar" v-else alt="">
                        <div class="item-detail">
                          <label for="">{{ member.realname }}</label>
                          <label>{{ member.email }}</label>
                        </div>
                      </div>
                    </div>
                    <div v-else style="color: #666; font-size: 12px;">No results</div>
                  </template>
                  <span class="detail-font"><icon-font type="icon-xuesheng"/></span>
                </a-popover>

              </a-radio>
            </a-radio-group>
            <div class="filter-session" v-show="form.notifyType === NOTIFY_TYPE.FILTER.value">
              <a-select
                @change="changeFilter"
                v-model="filter.subjects"
                class="filter-select"
                placeholder="Select Subject"
                :showArrow="true"
                mode="multiple">
                <a-select-option :value="item.value" v-for="(item, index) in filterSubjectOptions" :key="index" >
                  {{ item.label }}
                </a-select-option>
              </a-select>

              <a-select
                @change="changeFilter"
                v-model="filter.ages"
                class="filter-select"
                placeholder="Select Age"
                :showArrow="true"
                mode="multiple">
                <a-select-option :value="item.value" v-for="(item, index) in filterAgeOptions" :key="index" >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </template>
        </div>
        <div class='tag-body'>
          <div class='select-date'>
            <div class='title'>Schedule</div>
            <div class='date-picker'>
              <a-range-picker @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
            </div>
          </div>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:left>
        <a-button class='cc-round-button' @click="goBack">Discard</a-button>
      </template>
      <template v-slot:right>
        <a-button type='primary' :loading="confirmLoading" @click='handleNextStep' class='cc-round-button'>Next</a-button>
      </template>
    </fixed-form-footer>
    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleBack'
      @select='handleSelectUnit' />
  </div>
</template>

<script>

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import PriceDiscountSet from '@/components/Common/PriceDiscountSet'
import SelectSessionUnit from '@/components/Schedule/SelectSessionUnit'
import { formatLocalUTC } from '@/utils/util'
import { typeMap } from '@/const/teacher'
import { TaskQueryById } from '@/api/task'
import { PDContentQueryById } from '@/api/pdContent'
import { AddSessionV2 } from '@/api/v2/classes'
import { SubjectTree } from '@/api/subject'
import { GetGradesByCurriculumId } from '@/api/preference'
import { queryTeachers } from '@/api/common'
import { PAID_TYPE, NOTIFY_TYPE, USER_MODE } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { AssociateMixin } from '@/mixins/AssociateMixin'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'AddLiveWorkshop',
  mixins: [AssociateMixin, ZoomAuthMixin, UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    MyVerticalSteps,
    CustomCoverMedia,
    PriceDiscountSet,
    SelectSessionUnit
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool,
      bindCurriculum: state => state.user.bindCurriculum
    }),
    lastChangeSavedTime() {
      const time = this.form && (this.form.updateTime || this.form.createTime)
      if (time) {
        return formatLocalUTC(time)
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      PAID_TYPE: PAID_TYPE,
      NOTIFY_TYPE: NOTIFY_TYPE,
      USER_MODE: USER_MODE,
      filterSubjectOptions: [],
      filterAgeOptions: [],
      contentLoading: false,
      confirmLoading: false,
      selectSessionUnitVisible: false,
      associateUnitList: [],
      fontSize: '16px',
      startDate: null,
      endData: null,
      sessionType: 1,
      planId: null,
      zoom: 1,
      filter: {
        subjects: [],
        ages: []
      },
      form: {
        title: null,
        coverType: null,
        cover: null,
        goals: null,
        maxParticipants: null,
        notifyStudents: [],
        paidType: Boolean(PAID_TYPE.FREE.value),
        notifyType: NOTIFY_TYPE.ALL.value,
        needParticipants: false,
        price: 0,
        discountInfo: [],
        registerBefore: null
      },
      contentType: typeMap,
      steps: [
        {
          id: 1,
          name: 'Choose Participants'
        }
        // {
        //   id: 2,
        //   name: 'Schedule'
        // }
      ],
      currentActiveStepIndex: this.getSessionStep(),
      currentRightModule: null,
      memberList: []
    }
  },
  created() {
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.steps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.steps[this.currentActiveStepIndex]
    this.handleDisplayRightModule()
    this.handleAssociate()
    if (!this.zoomAccessToken) {
      this.goToZoomAuth()
    }
    this.initData()
    this.initFilterOption()
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.initData()
      this.initFilterOption()
    },
    handleModeChange(userMode) {
      if (userMode === USER_MODE.SELF) {
        this.initData()
        this.initFilterOption()
      }
    },
    initFilterOption() {
      const curriculumId = this.userMode === USER_MODE.SELF ? this.bindCurriculum : this.currentSchool.curriculumId
      SubjectTree({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(grade => {
          this.filterAgeOptions.push({ label: grade.name, value: grade.id })
        })
      })
    },
    initData() {
      let promise = null
      if (this.type === typeMap.task) {
        promise = TaskQueryById
      } else if (this.type === typeMap.pd) {
        promise = PDContentQueryById
      }
      if (promise) {
        this.contentLoading = true
        promise({
          id: this.id
        }).then(response => {
          this.form.title = response.result.name
          this.form.cover = response.result.image
          this.form.coverType = 'image'
        }).finally(() => {
          this.contentLoading = false
        })
      }
    },

    changeFilter() {
      if (USER_MODE.SCHOOL === this.userMode) {
        queryTeachers({
          gradeIds: this.filter.ages,
          subjectIds: this.filter.subjects,
          schoolId: this.currentSchool.id
        }).then(res => {
          if (res.success) {
            this.memberList = res.result
          }
        })
      }
    },

    async handleAssociate() {
      const associateData = await this.getAssociate(this.id, this.type, 1)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      this.$logger.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 1) {
        this.planId = this.associateUnitList[0].id
      } else if (this.associateUnitList.length > 1) {
        this.selectSessionUnitVisible = true
      }
    },

    goBack() {
      this.$router.push({ path: '/teacher/main/live-workshops' })
    },

    handleBack () {
      this.$router.go(-1)
    },

    getSessionStep() {
      const oldStep = sessionStorage.getItem('live-workshop-' + this.id)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },

    handleStepChange(data) {
      this.$logger.info('pd handleStepChange ', data)
      this.currentStep = data.step
      this.currentActiveStepIndex = data.index
      this.handleDisplayRightModule()
      this.setSessionStep(data.index)
    },

    setSessionStep(step) {
      this.currentActiveStepIndex = step
      sessionStorage.setItem('live-workshop-' + this.id, step)
    },

    handleDisplayRightModule () {
      this.$logger.info('handleDisplayRightModule', this.currentStep)
    },

    handleNextStep () {
      // this.$refs['steps-nav'].nextStep()
      if (!this.form.paidType) {
        this.form.price = null
        this.form.discountInfo = []
        this.handleSubmit()
      } else {
        this.$refs.priceDiscount.validate((valid, priceInfo) => {
          if (valid) {
            this.form.price = priceInfo.price
            this.form.discountInfo = [ ...priceInfo.discountInfo ]
            this.handleSubmit()
          }
        })
      }
    },
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        if (value === 0) callback(new Error('请输入正整数!'))
        callback()
      } else {
        callback(new Error('请输入正整数!'))
      }
    },
    handleSubmit() {
      if (!this.form.needParticipants) {
        this.form.maxParticipants = 0
      } else {
        if (!new RegExp(/^[0-9]*[1-9][0-9]*$/).test(this.form.maxParticipants)) {
          this.$message.error('Please Enter Valid Number')
          return
        }
      }
      if (!this.form.title) {
        this.$message.error('Please Enter Valid Title')
        return
      }
      if (!this.form.cover) {
        this.$message.error('Please Upload Valid Cover')
        return
      }
      if (this.userMode === USER_MODE.SELF && !this.form.registerBefore) {
        this.$message.error('Please Input Register Before Date')
        return
      }
      if (!this.startDate || !this.endData) {
        this.$message.error('Please Input Schedule Date')
        return
      }
      const params = {
        startDate: this.startDate,
        endData: this.endData,
        contentId: this.id,
        openSession: true,
        sessionType: this.sessionType,
        zoom: this.zoom,
        register: {
          ...this.form,
          paidType: Number(this.form.paidType),
          notifyType: this.userMode === USER_MODE.SELF ? null : this.form.notifyType,
          notifyStudents: this.memberList.map(item => item.id)
        }
      }
      if (params.register.notifyType === NOTIFY_TYPE.FILTER.value && this.memberList.length === 0) {
        params.register.notifyType = NOTIFY_TYPE.ALL.value
      }
      console.log(params)
      this.confirmLoading = true
      AddSessionV2(params).then(res => {
         if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          this.$router.replace('/teacher/main/live-workshops')
        } else {
          this.$confirm({
            title: 'Warn',
            content: 'Schedule session failed.' + res.message + '. Please try again.',
            centered: true
          })
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    handleSelectUnit(data) {
      this.$logger.info('ScheduleSession handleSelectUnit ', data)
      this.planId = data.id
      this.selectSessionUnitVisible = false
    },

    handleUpdateCover (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
      this.form.cover = coverData.url
    },

    handleSelectDate (date, dateString) {
      this.form.registerBefore = moment(date.toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
    },

    handleDateChange (date, dateString) {
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.form-content {
  height: calc(100vh - 155px);
  margin-top: 110px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.step-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .form-body {
    width: 55%;
    padding: 20px 30px;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
  }

  .tag-body {
    width: 45%;
    padding: 20px 30px;
    height: 100%;
    overflow-y: scroll;
  }
}

.loading-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.choose-session {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
  .choose-session-title {
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 14px;
    margin-top: 10px;
    margin-right: 40px;
    flex: 1;
  }
  .choose-session-cover {
    width: 280px;
    height: 160px;
    display: flex;
    align-items: center;
    .cover-info {
      display: flex;
      font-size: 12px;
      label {
        font-size: 12px;
        font-family: Arial;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
  }
}
.pay-session {
  margin-top: 30px;
  & > label {
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #292C31;
    margin-right: 10px;
  }
  .pay-session-discount {
    margin-top: 15px;
  }
  .pay-session-participants {
    display: inline-block;
    margin-left: 40px;
  }
}
.select-date{
  width: 380px;
  .title {
    font-weight: 500;
    color: #333;
    line-height: 30px;
    padding-left: 5px;
  }
}
.notify-session {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 10px;
    margin-left: 30px;
  }
  /deep/ .ant-radio-wrapper-checked {
    font-weight: bold;
  }
}
.filter-session {
  margin-top: 20px;
  display: flex;
  .filter-select {
    margin-right: 20px;
    flex: 1;
  }
}
.detail-font {
  width: 25px;
  height: 25px;
  background: #849B4D;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  color: #fff;
  i {
    color: #fff;
  }
}
.member-list {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow: auto;
  .member-item {
    display: flex;
    margin-bottom: 10px;
    .item-avatar {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 50%;
      object-fit: contain;
      i {
      }
    }
    .item-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      label {
        font-size: 14px;
      }
      label:last-child {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>

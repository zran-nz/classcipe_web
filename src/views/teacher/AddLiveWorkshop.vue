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
          :is-preview-mode='true'
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
              <label for="">Workshop title: </label>
              <a-input v-model="form.title"></a-input>
            </div>
            <div class="choose-session-cover">
              <!-- <custom-cover-media
                v-if="form.coverVideo"
                type='video'
                :field='PdField.CoverVideo'
                :url='form.coverVideo'
                @update='handleUpdateCover'/> -->
              <custom-image-uploader
                :field='PdField.Image'
                :content-type='typeMap.pd'
                :img-url='form.image'
                :need-del="false"
                @update='handleUpdateCover' />
            </div>
          </div>
          <template v-if="userMode === USER_MODE.SELF">
            <div class='pay-info'>
              <div class='pay-title'>
                <div class='title'>
                  Paid session
                </div>
                <div class='pay-switch'>
                  <a-switch size='small' v-model='form.paidType' />
                </div>
              </div>
              <div class='pay-detail' v-show='form.paidType'>
                <div class='fee'>
                  <span class='fee-title'>Pricing</span>
                  <div class='fee-input'>
                    <a-input v-model='price' type='number' class='dollar-price-input' prefix="$" />
                  </div>
                </div>
                <div class='pay-discount'>
                  <div class='pay-sub-title'>
                    Bulk discount pricing
                  </div>
                  <div class='pay-discount-item' v-for='discount in discountList' :key='discount.id' @click.stop='handleDiscountEdit(discount)'>
                    <div class='item-detail'>
                      <div class='item-detail-it vertical-between'>
                        <div class='it-name'>
                          <div class='pay-participant'>No. of participants</div>
                        </div>
                        <div class='it-value vertical-left'>
                          <div class='person-num'>
                            <template v-if='discount.editing'>
                              <a-input v-model='discount.peopleThreshold' min='1' type='number' class='cc-form-input discount-input'/>
                            </template>
                            <template v-else>
                              {{ discount.peopleThreshold }}
                            </template>
                            and more
                          </div>
                        </div>
                      </div>
                      <div class='item-detail-it vertical-between'>
                        <div class='it-name'>
                          <div class='pay-percent'>Percentage off</div>
                        </div>
                        <div class='it-value vertical-left'>
                          <div class='discount-off'>
                            <template v-if='discount.editing'>
                              <a-input v-model='discount.discount' min='0' max='100' type='number' class='cc-form-input discount-input'/>%
                            </template>
                            <template v-else>
                              {{ discount.discount }}%
                            </template>
                          </div>
                        </div>
                      </div>

                      <div class='delete-item' @click.stop=''>
                        <a-popconfirm title="Delete?" ok-text="Yes" @confirm="deleteDiscount(discount)" cancel-text="No">
                          <delete-icon color='#F16A39' />
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class='add-discount'>
                  <custom-text-button label='Add row' @click='handleAddDiscount'>
                    <template v-slot:icon>
                      <a-icon type='plus-circle' />
                    </template>
                  </custom-text-button>
                </div> -->
              </div>
              <div class='pay-title'>
                <div class='title'>
                  Max Participants
                </div>
                <div class='pay-slider'>
                  <a-space>
                    <a-slider v-model="form.maxParticipants" :min="1" :max="zoomMeetingCapacity" style='width: 100px' />
                    <a-input-number v-model="form.maxParticipants" :min="1" :max="zoomMeetingCapacity" />
                  </a-space>
                </div>
              </div>
              <!-- TODO 变成弹出层 -->
              <!-- <div class='pay-title'>
                <div class='title'>
                  Registration deadline
                </div>
                <div class='pay-switch'>
                  <a-date-picker
                    :getCalendarContainer='trigger => trigger.parentElement'
                    :disabled-date="disabledDate"
                    :show-time="{ format: 'HH:mm' }"
                    @change="handleSelectDate">
                  </a-date-picker>
                </div>
              </div> -->
            </div>
          </template>
          <template v-else>
            <!-- <div v-if="type === typeMap.pd">
              <a-radio-group class="notify-session" v-model="form.notifyType" @change="changeNotifyType">
                <a-radio v-for="item in NOTIFY_TYPE" :value="item.value" :key="item.value">
                  {{ item.label }}

                </a-radio>
              </a-radio-group>
              <div class="filter-session" v-show="form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value">
                <a-select
                  @change="changeFilter"
                  v-model="filter.subjects"
                  class="filter-select"
                  placeholder="Select Subject"
                  :showArrow="true"
                  mode="multiple">
                  <a-select-option :value="item.value" v-for="(item, index) in filterSubjectOptions" :key="index" >
                    {{ curriculumMap[curriculumOptions[item.curriculumId]] || curriculumOptions[item.curriculumId] }} - {{ item.label }}
                  </a-select-option>
                </a-select>
                <a-popover title="Teachers" placement="right" >
                  <template slot="content">
                    <div class="member-list" v-if="memberList && memberList.length > 0">
                      <div class="member-item" v-for="member in memberList" :key="member.id">
                        <a-avatar class="item-avatar" :src="member.avatar" v-if="member.avatar"/>
                        <img v-else src="~@/assets/icons/library/default-avatar.png"/>
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
              </div>
              <div class="filter-session" v-show="form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value">
                <a-select
                  @change="changeFilter"
                  v-model="filter.ages"
                  class="filter-select"
                  placeholder="Select year(s)"
                  :showArrow="true"
                  mode="multiple">
                  <a-select-option :value="item.value" v-for="(item, index) in filterAgeOptions" :key="index" >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
                <a-popover title="Teachers" placement="right" >
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
              </div>
            </div>
            <div v-if="type === typeMap.task" style="margin-top: 20px;">
              All students at your school will receive email and notification
            </div> -->
          </template>
          <div class='choose-type'>
            <zoom-auth :enable-zoom.sync='enableZoom' :disabled="true" />
            <zoom-meeting
              v-show='enableZoom'
              ref='zoom'
              :password='true'
              :waiting-room='false' />
          </div>
        </div>
        <div class='tag-body'>
          <div class='select-date'>
            <div class='title'>Schedule</div>
            <!-- <div class='date-picker'>
              <a-range-picker
                @change="handleDateChange"
                format='YYYY-MM-DD HH:mm:ss'
                :disabled-date="disabledDateRange"
                :show-time="{ format: 'HH:mm' }"
              />
            </div> -->
            <!-- :onlyMe="true" -->
            <div style="width: 100%;">
              <session-calendar
                :editable="false"
                :addable="false"
                :forSelect="true"
                :defaultSelect="initDate"
                :searchFilters="[1,2,3,4]"
                :schoolFilters="schoolFilters"
                :searchType="CALENDAR_QUERY_TYPE.WORKSHOP.value"
                @date-select="handleSelectSchedule"
              />
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
        {{ fromRelaunch ? 'After relaunching the workshop, attendees will need to register to attend this workshop.' : '' }}
      </template>
      <template v-slot:right>
        <a-tooltip title="Please link your zoom account" v-if="(enableZoom && !$store.getters.zoomChecked)">
          <a-button type='primary' :disabled="true" :loading='confirmLoading' class='cc-round-button'>
            <template >Finish</template>
          </a-button>
        </a-tooltip>
        <a-tooltip title="Please Input title" v-else-if="!form.title">
          <a-button type='primary' :disabled="true" :loading='confirmLoading' class='cc-round-button'>
            <template >Finish</template>
          </a-button>
        </a-tooltip>
        <a-tooltip
          title="Please Select Schedule time"
          v-else-if="(!startDate || !endDate)">
          <a-button type='primary' :disabled="true" :loading='confirmLoading'>
            <template >Assign</template>
          </a-button>
        </a-tooltip>
        <a-button
          type='primary'
          @click='handleNextStep'
          :loading='confirmLoading'
          class='cc-round-button'
          v-else>
          <template >Finish</template>
        </a-button>
      </template>
    </fixed-form-footer>
    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleBack'
      @select='handleSelectUnit' />
    <verification-tip ref="verificationTip" @continue="() => this.deadlineVis = true"/>
    <a-modal
      title="Set Registration Deadline"
      :width="500"
      :visible="deadlineVis"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleSkip"
      cancelText="Cancel"
      :okText="'Save'"
      :cancelButtonProps="{
        props: {disabled: confirmLoading}
      }"
    >
      <a-space class='pay-title'>
        <div class='title'>
          Registration deadline
        </div>
        <div class='pay-switch'>
          <a-date-picker
            :getCalendarContainer='trigger => trigger.parentElement'
            :disabled-date="disabledDate"
            :showToday="false"
            :show-time="{ format: 'HH:mm' }"
            @change="handleSelectDate">
          </a-date-picker>
        </div>
      </a-space>
    </a-modal>
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
import CustomTextButton from '@/components/Common/CustomTextButton'
import DeleteIcon from '@/components/Common/DeleteIcon'
import SessionCalendar from '@/components/Calendar/SessionCalendar'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import ZoomMeeting from '@/components/Schedule/ZoomMeeting'
import VerificationTip from '@/components/MyContentV2/VerificationTip.vue'

import { formatLocalUTC, getCookie } from '@/utils/util'
import { typeMap } from '@/const/teacher'
import { TaskQueryById } from '@/api/task'
import { PDContentQueryById } from '@/api/pdContent'
import { AddSessionV2 } from '@/api/v2/classes'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { queryTeachers } from '@/api/common'
import { DetailBySessionId } from '@/api/v2/live'
import { PAID_TYPE, NOTIFY_TYPE, USER_MODE, PdField, CALENDAR_QUERY_TYPE } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { AssociateMixin } from '@/mixins/AssociateMixin'
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import { mapState } from 'vuex'
import moment from 'moment'
import ZoomAuth from '@/components/Schedule/ZoomAuth'
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'

export default {
  name: 'AddLiveWorkshop',
  mixins: [AssociateMixin, ZoomAuthMixin, UserModeMixin, CurrentSchoolMixin],
  components: {
    ZoomAuth,
    FixedFormHeader,
    FormHeader,
    FixedFormFooter,
    MyVerticalSteps,
    CustomCoverMedia,
    PriceDiscountSet,
    SelectSessionUnit,
    CustomTextButton,
    DeleteIcon,
    SessionCalendar,
    CustomImageUploader,
    ZoomMeeting,
    VerificationTip
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
      bindCurriculum: state => state.user.bindCurriculum,
      info: state => state.user.info
    }),
    lastChangeSavedTime() {
      const time = this.form && (this.form.updateTime || this.form.createTime)
      if (time) {
        return formatLocalUTC(time)
      } else {
        return ''
      }
    },
    schoolFilters() {
      // return [
      //   '0'
      // ].concat(this.info.schoolList.map((item, index) => item.id))
      return [this.currentSchool.id]
    }
  },
  data() {
    return {
      PAID_TYPE: PAID_TYPE,
      NOTIFY_TYPE: NOTIFY_TYPE,
      USER_MODE: USER_MODE,
      typeMap: typeMap,
      PdField: PdField,
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      filterSubjectOptions: [],
      filterAgeOptions: [],
      curriculumOptions: {},
      curriculumMap: {
        'Cambridge Primary & Lower Secondary': 'Cambridge P & LS'
      },
      contentLoading: false,
      confirmLoading: false,
      selectSessionUnitVisible: false,
      associateUnitList: [],
      fontSize: '16px',
      startDate: null,
      endDate: null,
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
        coverVideo: null,
        image: null,
        goals: null,
        maxParticipants: 100,
        notifyStudents: [],
        paidType: Boolean(PAID_TYPE.FREE.value),
        notifyType: NOTIFY_TYPE.ALL.value,
        needParticipants: true,
        price: 0,
        discountInfo: [],
        registerBefore: null
      },
      contentType: typeMap,
      steps: [
        {
          id: 1,
          name: 'Schedule Workshop'
        }
        // {
        //   id: 2,
        //   name: 'Schedule'
        // }
      ],
      currentActiveStepIndex: this.getSessionStep(),
      currentRightModule: null,
      memberList: [],
      price: 100,
      discountList: [
        {
          peopleThreshold: 1,
          discount: 0,
          editing: true
        }
      ],

      enableZoom: true,
      fromRelaunch: '',

      deadlineVis: false,
      initDate: null
    }
  },
  created() {
    if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.steps.length - 1) {
      this.currentActiveStepIndex = 0
    }
    this.currentStep = this.steps[this.currentActiveStepIndex]
    const query = this.$route.query
    if (query.relaunch) {
      this.fromRelaunch = query.relaunch
      this.getRelaunch()
    }
    this.handleDisplayRightModule()
    this.planId = this.$route.query.planId
    if (!this.$route.query.hasOwnProperty('planId')) {
      this.handleAssociate()
    }
    if (this.$route.query.startDate && this.$route.query.endDate) {
      this.initDate = [moment(this.$route.query.startDate), moment(this.$route.query.endDate)]
      this.handleDateChange(this.initDate)
    }
    // if (!this.zoomAccessToken) {
    //   this.goToZoomAuth()
    // }
    this.initData()
    this.initFilterOption()
    // 直播课 zomm必须选择，所以
    this.$emit('select-zoom-status', this.enableZoom)
    this.checkZoomAuth()
  },
  watch: {
    enableZoom() {
      this.handleZoomStatusChange()
    }
  },
  methods: {
    // handleSchoolChange(currentSchool) {
    //   this.initData()
    //   this.initFilterOption()
    // },
    // handleModeChange(userMode) {
    //   if (userMode === USER_MODE.SELF) {
    //     this.initData()
    //     this.initFilterOption()
    //   }
    // },
    initFilterOption() {
      getSubjectBySchoolId({ schoolId: this.currentSchool.id }).then(response => {
        console.info('getSubjectBySchoolId response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(curiculum => {
          if (curiculum.subjectList) {
            curiculum.subjectList.forEach(subject => {
              this.filterSubjectOptions.push({ label: subject.subjectName, value: subject.subjectId, curriculumId: curiculum.curriculumId })
            })
          }
        })
      })
      getCurriculumBySchoolId({ schoolId: this.currentSchool.id }).then(response => {
        console.info('getCurriculumBySchoolId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(curiculum => {
          if (curiculum.gradeSettingInfo) {
            curiculum.gradeSettingInfo.forEach(grade => {
              this.filterAgeOptions.push({ label: grade.gradeName, value: grade.gradeId })
            })
          }
          this.curriculumOptions[curiculum.curriculumId] = curiculum.curriculumName
        })
      })
    },
    initData() {
      if (!this.fromRelaunch) {
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
            this.form.cover = response.result.image // this.type === typeMap.task ? response.result.image : (response.result.coverVideo || response.result.image)
            this.form.coverVideo = response.result.coverVideo
            this.form.image = response.result.image
          }).finally(() => {
            this.contentLoading = false
          })
        }
      }
    },

    getRelaunch() {
      this.contentLoading = true
      DetailBySessionId({
        sessionId: this.fromRelaunch
      }).then(res => {
        if (res.success) {
          this.form.title = res.result.title || res.result.session.sessionName
          this.form.cover = res.result.cover || res.result.session.image
          this.form.image = res.result.cover || res.result.session.image
          const register = res.result.session.register
          if (register) {
            this.form.maxParticipants = register.maxParticipants
            this.form.price = register.price
            this.form.paidType = Boolean(register.paidType)
            this.price = register.price
            if (register.discountInfo) {
              this.form.discountInfo = register.discountInfo
              this.discountList = register.discountInfo.map(item => ({
                ...item,
                editing: true
              }))
              if (!this.discountList || this.discountList.length === 0) {
                this.discountList = [{
                  peopleThreshold: 1,
                  discount: 0,
                  editing: true
                }]
              }
            }
          }
        }
      }).finally(() => {
        this.contentLoading = false
      })
    },

    disabledDate(current) {
      // return current && current < moment()
      // 在开课时间之前
      return current &&
        current < moment().subtract(1, 'days').endOf('day') ||
        (current && this.startDate && current > moment(this.startDate).add(1, 'days').startOf('day'))
    },

    disabledDateRange(current) {
      return current && current < moment().subtract(1, 'minutes') // .endOf('day')
    },

    changeNotifyType() {
      this.changeFilter()
    },

    changeFilter() {
      if (USER_MODE.SCHOOL === this.userMode && this.form.notifyType !== NOTIFY_TYPE.ALL.value) {
        // PD 过滤老师， Task过滤学生
        queryTeachers({
          gradeIds: this.form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value ? this.filter.ages : [],
          subjectIds: this.form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value ? this.filter.subjects : [],
          schoolId: this.currentSchool.id
        }).then(res => {
          if (res.success) {
            this.memberList = res.result
          }
        })
      }
    },

    async handleZoomStatusChange () {
      this.$emit('select-zoom-status', this.enableZoom)
      if (this.enableZoom) {
        const status = await this.checkZoomAuth()
        if (!status) {
          this.enableZoom = false
          console.info('reset item enableZoom', this.enableZoom)
        } else {
          console.info('zoom auth success')
        }
      }
    },

    async handleAssociate() {
      const associateData = await this.getAssociate(this.id, this.type)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      console.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 1) {
        this.planId = this.associateUnitList[0].id
      } else if (this.associateUnitList.length > 1) {
        this.selectSessionUnitVisible = true
      }
    },

    goBack() {
      if (window.history.length <= 1) {
        location.href = '/v2/my/workshop'
        return false
      } else {
        this.$router.go(-1)
      }
    },

    handleBack () {
      if (window.history.length <= 1) {
        location.href = '/v2/my/workshop'
        return false
      } else {
        this.$router.go(-1)
      }
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
      console.info('pd handleStepChange ', data)
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
      console.info('handleDisplayRightModule', this.currentStep)
    },

    handleNextStep () {
      // this.$refs['steps-nav'].nextStep()
      if (!this.form.paidType) {
        this.form.price = null
        this.form.discountInfo = []
      } else {
        // this.$refs.priceDiscount.validate((valid, priceInfo) => {
        //   if (valid) {
        //     this.form.price = priceInfo.price
        //     this.form.discountInfo = [ ...priceInfo.discountInfo ]
        //     this.handleSubmit()
        //   }
        // })
        this.form.price = this.price
        this.form.discountInfo = [ ...this.discountList ]
      }
      const isNotShowSecurity = getCookie(TEACHER_SECURITY_NOT_SHOW)
      if (!isNotShowSecurity) {
        // TODO 查询是否已经进行老师认证
        const isExists = false
        if (!isExists) {
          this.$refs.verificationTip.doCreate()
          return
        }
      }
      this.deadlineVis = true
      // this.handleSubmit()
    },
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        if (value === 0) callback(new Error('请输入正整数!'))
        callback()
      } else {
        callback(new Error('请输入正整数!'))
      }
    },
    handleSkip(a) {
      if (a.target._prevClass && a.target._prevClass !== 'ant-btn') return console.log('click cancel:', a.target._prevClass)
      this.deadlineVis = false
      // this.form.registerBefore = null
      // this.handleSubmit()
    },
    handleSubmit() {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.form.maxParticipants = 0
      } else {
        // if (!new RegExp(/^[0-9]*[1-9][0-9]*$/).test(this.form.maxParticipants)) {
        //   this.$message.error('Please Enter Valid Number')
        //   return
        // }
      }
      if (!this.form.title) {
        this.$message.error('Please Enter Valid Title')
        return
      }
      if (!this.form.cover) {
        this.$message.error('Please Upload Valid Cover')
        return
      }
      // if (this.userMode === USER_MODE.SELF && !this.form.registerBefore) {
      //   this.$message.error('Please Input Register Before Date')
      //   return
      // }
      if (!this.startDate || !this.endDate) {
        this.$message.error('Please Input Schedule Date')
        return
      }
      let notifyType = this.userMode === USER_MODE.SELF ? null : this.form.notifyType
      // server只有1、2，所以前端 3和2 传递的都是2
      if (notifyType === NOTIFY_TYPE.FILTER_YEARS.value) {
        notifyType = NOTIFY_TYPE.FILTER_SUBJECTS.value
      }
      const params = {
        startDate: this.startDate,
        endDate: this.endDate,
        contentId: this.id,
        openSession: true,
        sessionType: this.sessionType,
        zoom: Number(this.enableZoom),
        password: this.$refs.zoom.isPassword,
        waitingRoom: this.$refs.zoom.isWaitingRoom,
        register: {
          ...this.form,
          paidType: Number(this.form.paidType),
          notifyType: this.type === typeMap.task ? NOTIFY_TYPE.ALL.value : notifyType,
          notifyStudents: this.type === typeMap.task ? [] : this.memberList.map(item => item.id)
        }
      }
      if (params.register.notifyType !== NOTIFY_TYPE.ALL.value && this.memberList.length === 0) {
        params.register.notifyType = NOTIFY_TYPE.ALL.value
      }
      if (this.type === typeMap.pd) {
        params.yearList = this.form.notifyType === NOTIFY_TYPE.FILTER_YEARS.value ? this.filter.ages : []
        params.subjectList = this.form.notifyType === NOTIFY_TYPE.FILTER_SUBJECTS.value ? this.filter.subjects : []
      }
      console.log(params)
      this.confirmLoading = true
      AddSessionV2(params).then(res => {
         if (res.result && res.success && res.code === 0) {
          this.$message.success('Schedule session successfully')
          location.href = '/v2/my/workshop'
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
      console.info('ScheduleSession handleSelectUnit ', data)
      this.planId = data.id
      this.selectSessionUnitVisible = false
    },

    handleUpdateCover (coverData) {
      console.info('handleUpdateCover', coverData)
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
      this.endDate = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
    },

    handleSelectSchedule(date) {
      if (!date) {
        this.startDate = null
        this.endDate = null
        return
      }
      this.startDate = moment(date.startDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date.endDate).utc().format('YYYY-MM-DD HH:mm:ss')
      console.log(date)
      if (this.enableZoom && !this.$store.getters.zoomChecked) {
        this.checkZoomAuth()
      }
    },

    handleAddDiscount () {
      this.discountList.push({
        peopleThreshold: 1,
        discount: 0,
        editing: true
      })
    },

    handleDiscountEdit (discount) {
      discount.editing = true
    },

    handleBlurClick() {
      this.discountList.forEach(discount => {
        discount.peopleThreshold = Math.max(discount.peopleThreshold, 1)
        discount.editing = true
      })
    },

    deleteDiscount (discount) {
      const index = this.discountList.indexOf(discount)
      if (index > -1) {
        this.discountList.splice(index, 1)
      }
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
    width: 40%;
    padding: 20px 30px;
    height: 100%;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    background-color: #fff;
  }

  .tag-body {
    width: 60%;
    padding: 20px;
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
  // justify-content: space-between;
  // align-items: flex-start;
  flex-direction: column;
  margin-top: 20px;
  .choose-session-title {
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 14px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    flex: 1;
    label {
      width: 110px;
      margin-right: 10px;
    }
    input {
      flex: 1;
    }
  }
  .choose-session-cover {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    margin-top: 20px;
    /deep/ .custom-image-uploader {
      width: 100%;
      height: 250px;
      .image-placeholder {
        min-height: unset;
        width: 100%;
        height: 100%;
        img {
          min-width: unset;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
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
  width: 100%;
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
  align-items: center;
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
.pay-info {
  padding: 0 20px;
  // min-height: 400px;
  margin-top: 20px;
  // overflow-y: auto;
  .pay-title {
    margin: 10px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    .title {
      font-weight: 500;
      color: #333;
      line-height: 30px;
      padding-left: 5px;
    }

    .pay-slider {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      width: 250px;
    }
  }

   .pay-detail {
      margin: 10px 0;
      padding: 10px 20px;
      background-color: #F7F8F9;
      border-radius: 5px;
      border: 1px solid #eee;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;

      .fee {
        line-height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .add-discount {
        margin-top: 15px;
        height: 35px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #15c39a;
        font-size: 13px;
      }

      .pay-discount {
        margin-top: 15px;
        padding: 5px 20px 10px;
        background-color: #15c39a11;

        .pay-sub-title {
          font-size: 14px;
          color: #15c39a;
          line-height: 28px;
        }

        .pay-discount-title {
          font-size: 14px;
          color: #15c39a;
          line-height: 30px;
          font-weight: bold;
        }
      }

      .pay-discount-item {
        margin: 5px 0;
        line-height: 28px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .item-detail {
          width: 100%;
          position: relative;
          .item-detail-it {
            margin: 5px 0;
            .it-value {
              width: 140px;
            }
          }
        }
        .person-num {
          font-size: 14px;
          color: #666;
        }

        .discount-off {
          color: #e4393c;
          font-size: 14px;
          text-align: center;
          font-family: Verdana;
        }

        .delete-item {
          display: none;
          position: absolute;
          right: -10px;
          top: 65%;
        }

        &:hover {
          .delete-item {
            display: flex;
          }
        }
      }
    }
}

.discount-input {
  width: 70px;
}

.pay-discount-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.choose-type {
  padding: 20px 0 0;
  .title {
    font-weight: 500;
    color: #333;
    line-height: 30px;
    padding-left: 5px;
    font-size: 16px;
  }
}

.type-list {
  padding: 10px 10px 10px 0;
  .zoom-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    img {
      height: 30px;
    }
  }
}
</style>

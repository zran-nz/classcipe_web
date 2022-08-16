<template>
  <div class='my-content' :style="{'font-size': fontSize}">
    <div class="account-back">
      <a-button @click="goBack">Back to home</a-button>
    </div>
    <div class="account-info">
      <div class="account-info-header">
        <div class="info-header-avatar persona" v-if="userMode === USER_MODE.SELF">
          <img :src="info.avatar" v-if="info.avatar"/>
          <img v-else src="~@/assets/icons/library/default-avatar.png"/>
        </div>
        <div class="info-header-avatar" v-else>
          <!-- <img v-if="currentSchool.logo" :src="currentSchool.logo"/>
          <img v-else src="~@/assets/icons/library/default-avatar.png"/> -->
          <img v-if="isNotAdmin" :src="currentSchool.logo"/>
          <custom-image-uploader v-else :need-del="false" :img-url='currentSchool.logo' @update='handleUploadLogo' />
        </div>
        <div class="info-header-detail">
          <div class="header-detail-title">
            {{ currentSchool.schoolName || (info.firstname + ' ' + info.lastname) }}
          </div>
          <div class="header-detail-email" v-if="userMode === USER_MODE.SELF">
            <label>
              {{ info.email }}
              <!-- <a-icon style="color: #52DB9C" type="check-circle" /> -->
              <a-tooltip v-if="info.emailVerify === 0">
                <div slot="title">
                  <label for=""> The inactive account will be automatically removed after 30 days upon registration. Click to resend an email with activating link</label>
                  <div style="text-align:right;">
                    <a-button type="primary" :loading="sendLoading" @click="sendVerifyLink" size="small">Resend</a-button>
                  </div>
                </div>
                <a-icon style="color: #FF7916" type="exclamation-circle" />
              </a-tooltip>
            </label>
            <a-button size="small" type="primary" @click="goToProfile">Go to profile</a-button>
          </div>
          <div class="header-detail-plan">
            <div class='plan-name' v-if="info.planInfo && !info.planInfo.freeUsePlan">{{ info.planInfo.planName }} {{ planStatus }}</div>
            <div class='plan-name' v-else>Free plan</div>
            <div class="plan-deadline" v-if="info.planInfo && !info.planInfo.freeUsePlan">
              {{ expiredDay }}
            </div>
            <div class="plan-pay" v-if="info.planInfo && info.planInfo.unPaidPrice && info.planInfo.unPaidPrice > 0">
              <a-button type='primary'>Pay</a-button>
            </div>
          </div>
          <div class="header-detail-storage">
            <a-progress :percent="storageProgress" class='cc-storage-progress' :show-info='false'/>
            <!-- <div class='storage-info-text'>
              {{ consumedSize | sizeFormat }} of {{ totalSize | sizeFormat }}
            </div> -->
            <!-- <div class="storage-info-pay" v-if="info.planInfo && info.planInfo.planUser && info.planInfo.planUser.buyStatus === 2">
              <a-button type='primary'>Pay</a-button>
            </div> -->
          </div>
          <div class="header-detail-opt">
            <div class='header-detail-text'>
              {{ consumedSize | sizeFormat }} of {{ totalSize | sizeFormat }}
            </div>
            <a class="" @click="handleGoSpace" v-if="!isNotAdmin">Upgrade</a>
          </div>
        </div>
      </div>
      <a-divider v-if="userMode === USER_MODE.SCHOOL && currentSchool.schoolUser"></a-divider>
      <div class="account-info-self" v-if="userMode === USER_MODE.SCHOOL && currentSchool.schoolUser">
        <div class="info-self-avatar">
          <img :src="currentSchool.schoolUser.avatar" v-if="currentSchool.schoolUser.avatar"/>
          <img v-else src="~@/assets/icons/library/default-avatar.png"/>
          <a-button type="primary" size="small" @click="$refs.modal.edit(1)">Upload</a-button>
        </div>
        <div class="info-self-detail">
          <div class="self-detail-name">
            <template v-if="!showSelfEdit">
              <label>{{ currentSchool.schoolUser.firstname }} {{ currentSchool.schoolUser.lastname }}</label>
              <a-icon @click="handleSelfEdit" type="edit" />
            </template>
            <template v-else>
              <a-input style="width: 200px" v-model="selfEditModel.firstname" placeholder="First name"></a-input>
              <a-input style="width: 200px;margin-left:20px" v-model="selfEditModel.lastname" placeholder="Last name"></a-input>
              <a-icon @click="handleSelfEditCheck" type="check" />
              <a-icon @click="handleSelfEdit" type="close" />
            </template>
          </div>
          <div class="self-detail-email">{{ currentSchool.schoolUser.email }}</div>
          <div class="self-detail-role">
            School roles: {{ roles }}
          </div>
        </div>
      </div>
      <!-- Basic info -->
      <div class="account-info-wrap" v-for="(item, index) in linkDatas.filter(_ => !_.hidden)" :key="'linkwrap_' + index">
        <div class="account-info-title" v-if="item.links.filter(_ => !_.hidden).length > 0">{{ item.title }}</div>
        <div class="account-info-link">
          <div
            class="info-link-item-wrap"
            v-for="(link, linkIndex) in item.links.filter(_ => !_.hidden)"
            :key="'link_'+linkIndex"
            :style="{'visibility': (link.title) ? 'visible' : 'hidden'}"
            @click="handleGoPage(link.url)"
          >
            <div class="info-link-item" :class="{'unable': !link.url}">
              <div class="link-item-basic">
                <div class="item-basic-avatar">
                  <img :src="link.avatar"/>
                </div>
                <div class="item-basic-name">
                  <label for="">{{ link.title }}</label>
                  <!-- <label for="" class="basic-name-extra" v-if="link.extraKey"> {{ getExtra(link.extraKey) }} </label> -->
                  <label for="" class="basic-name-extra" v-if="link.extraKey"> {{ getExtra(link.extraKey) }} </label>
                </div>
                <div class="item-basic-badge" v-if="link.badgeKey">
                  <a-tooltip :title="`There are ${getBadge(link.badgeKey)} teacher(s) to be reviewed`">
                    <a-badge :count="getBadge(link.badgeKey)" />
                  </a-tooltip>
                </div>
              </div>
              <div class="link-item-desc">
                {{ link.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <avatar-modal ref="modal" @ok="setAvatar"/>
  </div>
</template>

<script>
import { USER_MODE, EXPIRE_UNIT, ROLE_PERMISSION } from '@/const/common'

import { updateProfile } from '@/api/schoolUser'
import { updateSchool } from '@/api/school'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { ReSetFontMixin } from '@/mixins/ReSetFontMixin'
import { AutoSwitchSchoolMixin } from '@/mixins/AutoSwitchSchoolMixin'

import CustomImageUploader from '@/components/Common/CustomImageUploader'
import AvatarModal from '@/views/account/settings/AvatarModal'

import { listClass } from '@/api/v2/schoolClass'
import { getSchoolUsers, getTeacherCount } from '@/api/v2/schoolUser'

import SchoolInfoPng from '@/assets/icons/account/schoolInfo.png?inline'
import AcademicPng from '@/assets/icons/account/academic.png?inline'
import AttendancePng from '@/assets/icons/account/attendance.png?inline'
import ClassesPng from '@/assets/icons/account/classes.png?inline'
import CurriculumPng from '@/assets/icons/account/curriculum.png?inline'
import OrdersPng from '@/assets/icons/account/orders.png?inline'
import PaymentsPng from '@/assets/icons/account/payments.png?inline'
import PlanningPng from '@/assets/icons/account/planning.png?inline'
import RoleManagePng from '@/assets/icons/account/roleManage.png?inline'
import SpaceManagePng from '@/assets/icons/account/spaceManage.png?inline'
import StudentsPng from '@/assets/icons/account/students.png?inline'
import TagsPng from '@/assets/icons/account/tags.png?inline'
import TeachersPng from '@/assets/icons/account/teachers.png?inline'
import SecurityPng from '@/assets/icons/account/security.png?inline'
import PayoutsPng from '@/assets/icons/account/payouts.png?inline'
import CertifiedPng from '@/assets/icons/account/certified.png?inline'
import PersonaPng from '@/assets/icons/account/persona.png?inline'

import { HIDDEN_SIDEBAR, TOOGLE_USER_MODE } from '@/store/mutation-types'

import { mapState, mapMutations, mapActions } from 'vuex'
import { SendVerifyLink } from '@/api/login'
import moment from 'moment'

export default {
  name: 'AccountInfo',
  components: {
    CustomImageUploader,
    AvatarModal
  },
  mixins: [UserModeMixin, CurrentSchoolMixin, ReSetFontMixin, AutoSwitchSchoolMixin],
  data() {
    return {
      fontSize: '16px',
      fixHtmlWidth: 1200,
      USER_MODE: USER_MODE,
      unit: 1024 * 1024 * 1024,
      loading: false,
      showSelfEdit: false,
      lineCounts: 3,
      selfEditModel: {
        nickname: '',
        firstname: '',
        lastname: '',
        avatar: ''
      },
      confirmLoading: false,
      classCount: 0,
      teacherCount: 0,
      studentCount: 0,
      pendingTeacherCount: 0,
      sendLoading: false
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    linkDatas() {
      return [{
        title: '',
        links: [
          {
            avatar: SchoolInfoPng,
            title: 'School info',
            desc: 'School Name, Address, Contact',
            hidden: this.userMode === USER_MODE.SELF || this.isNotAdmin,
            url: '/manage/school-info'
          },
          {
            avatar: PaymentsPng,
            title: 'Payments',
            desc: 'Review payments, payouts, coupons,gift cards and taxes',
            hidden: this.userMode === USER_MODE.SELF || this.isNotAdmin,
            url: ''
          },
          {
            avatar: PersonaPng,
            title: 'Personal info',
            desc: 'Edit your name, address, schools and personal intro',
            hidden: this.userMode === USER_MODE.SCHOOL,
            url: '/manage/persona-info'
          },
          {
            avatar: SecurityPng,
            title: 'Login & security',
            desc: 'Link accounts, reset password',
            hidden: this.userMode === USER_MODE.SCHOOL,
            url: '/manage/persona/security'
          },
          {
            avatar: PayoutsPng,
            title: 'Payments & payouts',
            hidden: this.userMode === USER_MODE.SCHOOL,
            desc: 'Review payments, payouts, coupons,gift cards and taxes',
            url: ''
          },
          {
            avatar: OrdersPng,
            title: 'Orders',
            desc: 'Buying and Selling data and statistics',
            url: '/manage/order',
            hidden: this.userMode === USER_MODE.SCHOOL
          }
        ]
      }, {
        title: 'Manage',
        links: [
          {
            avatar: ClassesPng,
            title: 'Classes',
            extraKey: 'classCount',
            desc: 'Add, edit and delete classes',
            url: '/manage/class',
            hidden: !this.hasRolePermission('MyCalssV2')
          },
          {
            avatar: TeachersPng,
            title: 'Teachers',
            extraKey: 'teacherCount',
            badgeKey: 'pendingTeacherCount',
            desc: 'Add/Invite, edit and delete teachers',
            url: '/manage/teacher',
            hidden: this.isNotAdmin
          },
          {
            avatar: StudentsPng,
            title: 'Students',
            extraKey: 'studentCount',
            desc: 'Add, edit and delete students',
            url: '/manage/student',
            hidden: this.isNotAdmin
          },
          {
            avatar: SpaceManagePng,
            title: 'Space Manage',
            desc: 'Manage space',
            hidden: this.userMode === USER_MODE.SCHOOL,
            url: '/manage/persona/space'
          },
          {
            avatar: SpaceManagePng,
            title: 'Space Manage',
            desc: 'Manage space',
            hidden: this.userMode === USER_MODE.SELF || !this.hasRolePermission('SchoolSpace'),
            url: '/manage/school/space'
          },
          {
            avatar: RoleManagePng,
            title: 'Role Manage',
            desc: 'Assign teachers to be admin, homeroom teachers and subject coordinators',
            url: '/manage/role',
            hidden: this.isNotAdmin
          }
        ]
      },
        {
          title: 'Setting',
          links: [
            {
              avatar: AcademicPng,
              title: 'Academic Term',
              hidden: this.userMode === USER_MODE.SELF || this.isNotAdmin,
              desc: 'Set school year, term and blocks',
              url: '/manage/academic'
            },
            {
              avatar: CurriculumPng,
              title: 'Curriculum',
              desc: 'Set curriculum(s), subjects, years',
              // hidden: this.userMode === USER_MODE.SELF,
              url: '/manage/curriculum',
              hidden: this.userMode === USER_MODE.SCHOOL && this.isNotAdmin
            },
            {
              avatar: PlanningPng,
              title: 'Planning Format',
              desc: 'Customize Unit plan/Task format',
              url: '/manage/planning-format',
              hidden: this.userMode === USER_MODE.SCHOOL && this.isNotAdmin
            },
            {
              avatar: TagsPng,
              title: 'Tags setting',
              // hidden: this.userMode === USER_MODE.SELF,
              desc: 'Customize tag categories and tags',
              url: '/manage/tags',
              hidden: this.userMode === USER_MODE.SCHOOL && this.isNotAdmin
            },
            {
              avatar: AttendancePng,
              title: 'Attendance',
              hidden: this.userMode === USER_MODE.SELF || this.isNotAdmin,
              desc: '',
              url: ''
            },
            {
              avatar: CertifiedPng,
              title: 'Teacher & Service verification',
              desc: 'To become verified teacher and apply to provide service to students',
              hidden: this.userMode === USER_MODE.SCHOOL,
              url: '/manage/verification'
            }
          ]
        }
      ]
    },
    consumedSize() {
     return this.userMode === USER_MODE.SELF ? this.info.usedSpace * 1024 : this.currentSchool.usedSpace * 1024
    },
    totalSize() {
      return this.info.planInfo ? this.info.planInfo.storageSpace * this.unit : this.unit
    },
    storageProgress () {
      return Math.round((this.consumedSize || 0) / this.totalSize * 100)
    },
    roles() {
      if (this.userMode === USER_MODE.SCHOOL && this.currentSchool.roleNames) {
        if (this.currentSchool.roleNames.length > 1) {
          return this.currentSchool.roleNames.filter(item => item.toLowerCase() !== 'teacher').join(',')
        }
        return this.currentSchool.roleNames.join(', ')
      } else {
        return ''
      }
    },
    isNotAdmin() {
      if (this.userMode === USER_MODE.SCHOOL && this.currentSchool.roleNames) {
        return !this.currentSchool.roleNames.map(role => role.toLowerCase()).includes('admin')
      } else {
        return true
      }
    },
    expiredDay() {
      const remain = this.info.planInfo.unPaidPrice || 0
      const msg = []
      if (this.info.planInfo) {
        const exipire = this.info.planInfo.freeUsePlan ? this.info.planInfo.freeDays : (this.info.planInfo.planExpire + this.info.planInfo.freeDays)
        const exipireUnit = this.info.planInfo.freeUsePlan ? 1 : this.info.planInfo.planExpireUnit
        const days = exipire || 0
        const unit = EXPIRE_UNIT.find(unit => unit.value === exipireUnit).label
        const date = moment.utc(this.info.planInfo.createTime).local().add(days, unit).format('YYYY-MM-DD')
        msg.push(`Plan ends in ${date} `) // ${days} ${unit}${days > 1 ? 's' : ''}`
      }
      if (remain > 0) {
        msg.push(`Balance of $${remain} unpaid`)
      }
      return msg.join('')
    },
    planStatus() {
      if (this.info.planInfo && this.info.planInfo) {
        const isExpired = this.info.planInfo.flag !== 1 ? '( Plan expired )' : ''
        const isUnpay = '' // this.info.planInfo.planUser.buyStatus !== 1 ? '( Unpaid )' : ''
        const isTrial = false // this.info.planInfo.freeUsePlan ? '( trial )' : ''
        return isTrial || (isExpired ? `${isExpired}` : isUnpay ? `${isUnpay}` : '')
      } else {
        return ''
      }
    }
  },
  created() {
    this.loadData()
    this[HIDDEN_SIDEBAR](true)
  },
  methods: {
    ...mapMutations([HIDDEN_SIDEBAR, TOOGLE_USER_MODE]),
    ...mapActions(['GetClassList']),
    handleSchoolChange(currentSchool) {
      this.pageNo = 1
      this.loadData()
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      if (userMode === USER_MODE.SELF) {
        this.pageNo = 1
        this.loadData()
      }
    },
    goBack() {
      this.$router.push('/')
    },
    loadData() {
      Promise.all([
        listClass({
          schoolId: this.currentSchool.id,
          pageNo: 1,
          pageSize: 1
        }),
        ...this.userMode === USER_MODE.SCHOOL ? [
          getTeacherCount({
            schoolId: this.currentSchool.id
          }),
          getSchoolUsers({
            schoolId: this.currentSchool.id,
            roles: 'student',
            pageNo: 1,
            pageSize: 1
          })
        ] : []
      ]).then(([clsRes, teacherRes, studentRes]) => {
        if (clsRes.code === 0 && clsRes.result) {
          this.classCount = clsRes.result.total
        }
        if (teacherRes && teacherRes.code === 0 && teacherRes.result) {
          this.teacherCount = teacherRes.result.sumCount
          this.pendingTeacherCount = teacherRes.result.pendingCount
        }
        if (studentRes && studentRes.code === 0 && studentRes.result) {
          this.studentCount = studentRes.result.total
        }
      })
    },
    hasRolePermission(permissionCode) {
      let hasPerm = false
      if (this.userMode === USER_MODE.SCHOOL && this.currentSchool.roleNames) {
        if (this.currentSchool.roleNames.includes('admin') || this.currentSchool.roleNames.includes('Admin')) return true
        let permissions = []
        this.currentSchool.roleNames.forEach(role => {
          // 所有权限
          if (ROLE_PERMISSION[role]) {
            permissions = permissions.concat(ROLE_PERMISSION[role].permissions)
          }
        })
        hasPerm = permissions.includes(permissionCode)
      } else {
        hasPerm = true
      }
      return hasPerm
    },
    handleSelfEdit() {
      this.selfEditModel.firstname = this.currentSchool.schoolUser.firstname
      this.selfEditModel.lastname = this.currentSchool.schoolUser.lastname
      this.selfEditModel.avatar = this.currentSchool.schoolUser.avatar
      this.showSelfEdit = !this.showSelfEdit
    },
    handleSelfEditCheck() {
      this.confirmLoading = true
      updateProfile({
        ...this.selfEditModel,
        id: this.currentSchool.schoolUser.id,
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.$message.success('Save successfully')
          this.$store.dispatch('GetInfo')
          this.showSelfEdit = false
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    getExtra(key) {
      if (this.info && this.info.planInfo) {
        return `( ${this[key]} / ${this.info.planInfo[key]} )`
      } else {
        return ''
      }
    },
    getBadge(key) {
      return this[key]
    },
    handleGoPage(url) {
      if (url) {
        this.$router.push({ path: url })
      }
    },
    goToProfile() {
      this.$router.push({ path: '/manage/persona-info' })
    },
    setAvatar (url) {
      this.selfEditModel.avatar = url
      this.handleSelfEditCheck()
    },
    handleUploadLogo (coverData) {
      this.$logger.info('handleUpdateCover', coverData)
      updateSchool({
        id: this.currentSchool.id,
        logo: coverData.url
      }).then(res => {
        if (res.success) {
          this.$message.success('Edit Successfully')
          this.$store.dispatch('GetInfo')
        }
      })
    },
    sendVerifyLink() {
      this.$logger.info('sendVerifyLink')
      this.sendLoading = true
      SendVerifyLink(this.info.email).then(res => {
        if (res.success) {
          this.$message.success('Send Successfully')
          this.sendLoading = false
        }
      })
    },
    handleGoSpace() {
      if (this.userMode === USER_MODE.SELF) {
        this.$router.push({ path: '/manage/persona/space' })
      } else {
        this.$router.push({ path: '/manage/school/space' })
      }
    }
  }

}
</script>

<style scoped lang="less">
.my-content {
  padding: 0.6em /* 60/100 */;
  background: #fff;
  height: 100%;
  .account-info {
    margin-top: 0.1em /* 10/100 */;
    width: 100%;
    height: 100%;
    .account-info-header {
      display: flex;
      width: 100%;
      .info-header-avatar {
        width: 3.83em /* 383/100 */;
        height: 2.12em /* 212/100 */;
        background: #FFFFFF;
        border: 1px solid #E0E3EA;
        border-radius: 0.08em /* 8/100 */;
        display: flex;
        /deep/ .custom-image-uploader {
          font-size: 16px;
          width: 100%;
          .image-placeholder {
            height: 100%;
            width: 100%;
            min-height: 100%;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        &.persona {
          width: 1.32em /* 132/100 */;
          height: 1.32em /* 132/100 */;
          border-radius: 100%;
          img {
            border-radius: 100%;
          }
        }
      }
      .info-header-detail {
        margin-left: 0.38em /* 38/100 */;
        display: flex;
        flex-direction: column;
        flex: 1;
        .header-detail-title {
          font-size: 0.25em /* 25/100 */;
          font-family: Arial;
          font-weight: bold;
          color: #17181A;
        }
        .header-detail-email {
          display: flex;
          align-items: center;
          label {
            font-size: 0.19em /* 19/100 */;
            font-family: Arial;
            font-weight: 400;
            margin-right: 1/0.19*0.33em /* 33/100 */;
            color: #384977;
          }
        }
        .header-detail-plan {
          margin-top: 0.27em /* 27/100 */;
          margin-bottom: 0.15em /* 15/100 */;
          display: flex;
          align-items: center;
          .plan-name {
            font-size: 0.18em /* 18/100 */;
            font-family: Arial;
            font-weight: bold;
            color: #5762FB;
            margin-right: 1/0.18*1.2em /* 120/100 */;
          }
          .plan-deadline {
            font-size: 0.18em /* 18/100 */;
            font-family: Arial;
            font-weight: 400;
            color: #2F86FD;
          }
          .plan-pay {
            margin-left: 20px;
            font-size: 12px;
          }
        }
        .header-detail-storage {
          display: flex;
          align-items: center;
          width: 100%;
          .cc-storage-progress {
            width: 420px;
          }
          .storage-info-text {
            font-size: 0.18em /* 18/100 */;
            margin-left: 1/0.18*0.44em /* 44/100 */;
            font-family: Arial;
            font-weight: 400;
            color: #414954;
          }
          .storage-info-pay {
            font-size: 12px;
            margin-left: 20px;
          }
        }
        .header-detail-opt {
          margin-top: 0.33em /* 33/100 */;
          font-size: 0.22em /* 22/100 */;
          display: flex;
          align-items: center;
          .header-detail-text {
            font-size: 1/0.22*0.18em /* 18/100 */;
            margin-right: 1/0.22*0.44em /* 44/100 */;
            font-family: Arial;
            font-weight: 400;
            color: #414954;
          }
          a {
            font-size: 1em;
            font-family: Arial;
            font-weight: bold;
            color: #2CC056;
          }
        }
      }
    }

    .account-info-self {
      display: flex;
      width: 100%;
      .info-self-avatar {
        width: 0.88em /* 88/100 */;
        border-radius: 100%;
        display: flex;
        flex-direction: column;
        margin-right: 0.3em /* 30/100 */;
        img {
          width: 0.88em /* 88/100 */;
          height: 0.88em /* 88/100 */;
          border-radius: 100%;
          object-fit: contain;
          margin-bottom: 0.1em /* 10/100 */;
        }
      }
      .info-self-detail {
        display: flex;
        flex-direction: column;
        flex: 1;
        .self-detail-name {
          display: flex;
          align-items: center;
          margin-bottom: .1em;
          label {
            font-size: 0.22em /* 22/100 */;
            font-family: Arial;
            font-weight: bold;
            color: #14192B;
          }
          i {
            font-size: 0.18em /* 14/100 */;
            cursor: pointer;
            margin-left: 1/0.18*.1em;
          }
        }
        .self-detail-email {
          font-size: 0.2em /* 20/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #565656;
          height: 1em;
          margin-bottom: 1/0.2*0.1em /* 10/100 */;
        }
        .self-detail-role {
          font-size: 0.19em /* 19/100 */;
          font-family: Arial;
          font-weight: bold;
          color: #3FB95C;
        }
      }
    }

    .account-info-wrap {
      .account-info-title {
        font-size: 0.24em /* 24/100 */;
        font-family: Arial;
        font-weight: bold;
        color: #202020;
        margin-top: 1/0.24*.3em;
      }
      .account-info-link {
        margin-top: 0.2em /* 20/100 */;
        display: flex;
        flex-wrap: wrap;
        // width: 100%;
        margin-left: -0.1em;
        margin-right: -0.1em;
        &::after {
          content: '';
          flex-grow: 999;
        }
        .info-link-item-wrap {
          width: 33.333333%;
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          cursor: pointer;
          background: #FFFFFF;
          padding: 0.1em /* 30/100 */;
          .info-link-item {
            padding: 0.1em /* 10/100 */ 0.2em /* 20/100 */;
            border: 1px solid #CED7E5;
            border-radius: 0.05em /* 5/100 */;
            height: 100%;
            &:hover {
              background: #dfd;
            }
            &.unable {
              background: #fff!important;
              cursor: default;
            }
            .link-item-basic {
              display: flex;
              align-items: center;
              position: relative;
              width: 100%;
              .item-basic-avatar {
                width: 0.66em /* 66/100 */;
                height: 0.66em /* 66/100 */;
                border-radius: 100%;
                display: flex;
                margin-right: 0.04em /* 4/100 */;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }
              .item-basic-name {
                display: flex;
                align-items: center;
                color: #202020;
                label {
                  font-size: 0.2em /* 20/100 */;
                  font-family: Arial;
                  font-weight: bold;
                }
                .basic-name-extra {
                  margin-left: 1/0.2*.4em;
                }
              }

              .item-basic-badge {
                font-size: 0.12em /* 12/100 */;
                position: absolute;
                right: 0;
              }
            }
            .link-item-desc {
              margin-top: 1/0.19*0.18em /* 18/100 */;
              font-size: 0.19em /* 19/100 */;
              font-family: Arial;
              font-weight: 400;
              color: #202020;
            }
          }
        }
      }
    }
  }
}
.account-back {
  font-size: 12px;
  margin-bottom: 20px;
}
</style>

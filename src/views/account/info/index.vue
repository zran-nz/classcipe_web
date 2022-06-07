<template>
  <div class='my-content' :style="{'font-size': fontSize}">
    <div class="account-info">
      <div class="account-info-header">
        <div class="info-header-avatar">
          <img src="~@/assets/icons/library/default-avatar.png"/>
        </div>
        <div class="info-header-detail">
          <div class="header-detail-title">
            Stanford University
          </div>
          <div class="header-detail-plan">
            <div class="plan-name">
              {{ info.planInfo.planName }}
            </div>
            <div class="plan-deadline">
              Plan ends in {{ expiredDay }}
            </div>
          </div>
          <div class="header-detail-storage">
            <a-progress :percent="storageProgress" class='cc-storage-progress' :show-info='false'/>
            <div class='storage-info-text'>
              {{ consumedSize | sizeFormat }} of {{ totalSize | sizeFormat }}
            </div>
          </div>
          <div class="header-detail-opt">
            <a class="">Upgrade</a>
          </div>
        </div>
      </div>
      <a-divider></a-divider>
      <div class="account-info-self">
        <div class="info-self-avatar">
          <img src="~@/assets/icons/library/default-avatar.png"/>
          <a-button type="primary" size="small">Upload</a-button>
        </div>
        <div class="info-self-detail">
          <div class="self-detail-name">
            <template v-if="!showSelfEdit">
              <label>{{ info.nickname }}</label>
              <a-icon @click="handleSelfEdit" type="edit" />
            </template>
            <template v-else>
              <a-input style="width: 300px" v-model="selfEditModel.name"></a-input>
              <a-icon @click="handleSelfEditCheck" type="check" />
              <a-icon @click="handleSelfEdit" type="close" />
            </template>
          </div>
          <div class="self-detail-email">1278312478@gmail.com</div>
          <div class="self-detail-role">Teacher</div>
        </div>
      </div>
      <!-- Basic info -->
      <div class="account-info-wrap" v-for="(item, index) in linkDatas" :key="'linkwrap_' + index">
        <div class="account-info-title">{{ item.title }}</div>
        <div class="account-info-link">
          <div
            class="info-link-item"
            v-for="(link, linkIndex) in item.links"
            :key="'link_'+linkIndex"
            :style="{'visibility': link.title ? 'visible' : 'hidden'}"
          >
            <div class="link-item-basic">
              <div class="item-basic-avatar">
                <img :src="link.avatar"/>
              </div>
              <div class="item-basic-name">{{ link.title }}</div>
            </div>
            <div class="link-item-desc">
              {{ link.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_MODE, EXPIRE_UNIT } from '@/const/common'

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

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

import { mapState } from 'vuex'

export default {
  name: 'AccountInfo',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  data() {
    return {
      fontSize: '16px',
      USER_MODE: USER_MODE,
      unit: 1024 * 1024 * 1024,
      loading: false,
      showSelfEdit: false,
      selfEditModel: {
        name: ''
      },
      linkDatas: [{
        title: '',
        links: [
          {
            avatar: SchoolInfoPng,
            title: 'School info',
            desc: ''
          },
          {
            avatar: PaymentsPng,
            title: 'Payments',
            desc: 'Review payments, payouts, coupons,gift cards and taxes'
          },
          {
            avatar: OrdersPng,
            title: 'Orders',
            desc: ''
          }
        ]
      }, {
        title: 'Manage',
        links: [
          {
            avatar: ClassesPng,
            title: 'Classes',
            desc: ''
          },
          {
            avatar: TeachersPng,
            title: 'Teachers',
            desc: 'Review payments, payouts, coupons,gift cards and taxes'
          },
          {
            avatar: StudentsPng,
            title: 'Students',
            desc: ''
          }
        ]
      }, {
        title: '',
        links: [
          {
            avatar: SpaceManagePng,
            title: 'Space Manage',
            desc: ''
          },
          {
            avatar: RoleManagePng,
            title: 'Role Manage',
            desc: 'Review payments, payouts, coupons,gift cards and taxes'
          },
          {
            avatar: '',
            title: '',
            desc: ''
          }
        ]
      }, {
        title: 'Setting',
        links: [
          {
            avatar: AcademicPng,
            title: 'Academic Term',
            desc: ''
          },
          {
            avatar: TagsPng,
            title: 'Tags setting',
            desc: 'Review payments, payouts, coupons,gift cards and taxes'
          },
          {
            avatar: PlanningPng,
            title: 'Planning Format',
            desc: ''
          }
        ]
      }, {
        title: '',
        links: [
          {
            avatar: AttendancePng,
            title: 'Attendance',
            desc: ''
          },
          {
            avatar: CurriculumPng,
            title: 'Curriculum',
            desc: 'Review payments, payouts, coupons,gift cards and taxes'
          },
          {
            avatar: '',
            title: '',
            desc: ''
          }
        ]
      }]
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      school: state => state.user.school,
      userMode: state => state.app.userMode
    }),
    consumedSize() {
     return this.userMode === USER_MODE.SELF ? this.info.usedSpace * 1024 : this.currentSchool.usedSpace * 1024
    },
    totalSize() {
      return this.info.planInfo ? this.info.planInfo.storageSpace * this.unit : this.unit
    },
    storageProgress () {
      return Math.round(this.consumedSize / this.totalSize * 100)
    },
    expiredDay() {
      if (this.info.planInfo && this.info.planInfo.planExpire) {
        const days = this.info.planInfo ? this.info.planInfo.planExpire : 0
        const unit = EXPIRE_UNIT.find(unit => unit.value === this.info.planInfo.planExpireUnit).label
        return `${days} ${unit}${days > 1 ? 's' : ''}`
      } else {
        return 'future'
      }
    }
  },
  created() {
    this.loadData()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFn, false)
    this.resizeFn()
  },
  beforeDestroy() {
    window.emoveEventListener('resize', this.resizeFn)
  },
  methods: {
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
    loadData() {

    },
    resizeFn () {
      this.radioSwitchShow = false
      // var docElem = document.documentElement
      // var htmlWidth = docElem.getBoundingClientRect().width
      var htmlWidth = 1200
      // if (htmlWidth > 1024) htmlWidth = 480
      const em = htmlWidth / 16
      this.fontSize = em + 'px'
      this.radioSwitchShow = true
    },
    handleSelfEdit() {
      this.selfEditModel.name = this.info.nickname
      this.showSelfEdit = !this.showSelfEdit
    },
    handleSelfEditCheck() {
      this.showSelfEdit = false
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
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
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
        .header-detail-plan {
          margin-top: 0.27em /* 27/100 */;
          margin-bottom: 0.15em /* 15/100 */;
          display: flex;
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
        }
        .header-detail-opt {
          margin-top: 0.33em /* 33/100 */;
          font-size: 0.22em /* 22/100 */;
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
        width: 1em /* 100/100 */;
        border-radius: 100%;
        display: flex;
        flex-direction: column;
        margin-right: 0.3em /* 30/100 */;
        img {
          width: 1em /* 100/100 */;
          height: 1em /* 100/100 */;
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
        margin-top: 0.3em /* 30/100 */;
        display: flex;
        width: 100%;
        .info-link-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: #FFFFFF;
          border: 1px solid #CED7E5;
          border-radius: 0.05em /* 5/100 */;
          padding: 0.1em /* 10/100 */ 0.2em /* 20/100 */;
          & ~ .info-link-item {
            margin-left: 0.3em /* 30/100 */;
          }
          &:hover {
            background: #dfd;
          }
          .link-item-basic {
            display: flex;
            align-items: center;
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
              font-size: 0.2em /* 20/100 */;
              font-family: Arial;
              font-weight: bold;
              color: #202020;
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
</style>

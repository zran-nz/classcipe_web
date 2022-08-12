<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Space'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:back>
            <img @click.stop="$router.push('/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="$router.push('/account/info')">Account Info</label>
              <label for="">></label>
              <label style="font-weight: normal">School Space</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content" id="formContent">
      <div class="account-info">
        <div class="info-title">{{ currentSchool.schoolName }}</div>
        <div class="info-storage">
          <a-progress :percent="storageProgress" class='cc-storage-progress' :show-info='false'/>
          <a type="link" @click="handleUpgrade">Upgrade</a>
        </div>
        <div class="info-storage-desc">
          {{ consumedSize | sizeFormat }} of {{ totalSize | sizeFormat }}
        </div>
      </div>

      <div class="content-detail">
        <div class="status-tab">
          <div class="tab-list">
            <div
              v-for="(item,index) in tabsList"
              :key="'types'+index"
              :class="{'tab-item': true, 'active' : currentTab === item.value}"
              @click="toggleTab(item.value)">
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="filter-tab">
          <a-space class="filter-search">
            <a-input-search v-model="queryParam.searchKey" placeholder="Teacher Name" @search="searchQuery"></a-input-search>
            <a-select
              style="width: 200px"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='queryParam.subject'
              @change="searchQuery"
              placeholder='Please select subject'>
              <a-select-option v-for='item in subjectOptions' :key='item.subjectId'>
                {{ item.subjectName }}
              </a-select-option >
            </a-select>
            <a-cascader
              :options="termsOptions"
              v-model="queryParam.termArr"
              :allow-clear="false"
              placeholder="Please select term"
              @change="onChangeTerm" />
          </a-space>
          <a-space class="filter-opt">
            <a-button type="primary" @click="handleSelectAll">Select All</a-button>
            <a-button type="" @click="handleDelete">Delete selected items</a-button>
          </a-space>
        </div>
        <div class="filter-tab" style="margin-top: -20px;">
          <a-checkbox v-model="queryParam.showUnlinked">Show sessions unlinked to tasks</a-checkbox>
        </div>
        <div class="item-tab">
          <div class="item-con">
            <div class="content-item-wrap">
              <space-content-item :content="{}" />
            </div>
            <div class="content-item-wrap">
              <space-content-item :content="{}" />
            </div>
          </div>
        </div>
      </div>

    </div>
    <a-modal
      v-model='spaceModal'
      class="upgrade-modal"
      destroyOnClose
      title='Upgrade Space'
      width='800px'
      okText="Upgrade"
      @ok="doUpgrade"
    >
      <div class="upgrade-con">
        <space-plan :school="currentSchool" ref="spacePlan" @select="handleSelect" />
        <div class="upgrade-duration">
          <div class="duration-title">Duration</div>
          <div class="duration-desc">
            <p>The space plan will be valid for the duration of your current plan.</p>
            <p>当前套餐名称 2022.5.13-2023.5.13</p>
          </div>
        </div>
        <div class="upgrade-price"><span>Price: </span>$1000</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import SpaceContentItem from '@/components/MyContentV2/SpaceContentItem'
import SpacePlan from './space/SpacePlan'

import { termList } from '@/api/academicTermInfo'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolSpace',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FormHeader,
    SpacePlan,
    SpaceContentItem
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      unit: 1024 * 1024 * 1024,
      currentTab: 'Session',
      tabsList: [{
          value: 'Session',
          title: 'Session'
      },
      {
          value: 'Content',
          title: 'Content'
      }],
      subjectOptions: [],
      termsOptions: [],
      blockOptions: [],
      queryParam: {
        teacherName: '',
        term: '',
        termArr: [],
        subject: undefined,
        searchKey: '',
        showUnlinked: false
      },
      loading: false,
      spaceModal: false
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
    this.initDict()
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    consumedSize() {
     return this.userMode === USER_MODE.SELF ? this.info.usedSpace * 1024 : this.currentSchool.usedSpace * 1024
    },
    totalSize() {
      return this.info.planInfo ? this.info.planInfo.storageSpace * this.unit : this.unit
    },
    storageProgress () {
      return Math.round(this.consumedSize / this.totalSize * 100)
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.queryParam.schoolId = currentSchool.id
        this.initDict()
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    toggleTab(status) {
      this.currentTab = status
    },
    initDict() {
      this.loading = true
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }),
        termList({
          schoolId: this.currentSchool.id
        })
      ]).then(([subjectRes, termRes]) => {
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          this.subjectOptions = subjects
        }
        if (termRes.success) {
          this.termsOptions = termRes.result.map(year => {
            return {
              value: year.id,
              label: year.name,
              children: year.terms.map(term => {
                this.blockOptions[term.id] = term.block.blockSettings || []
                return {
                  value: term.id,
                  label: term.name
                }
              })
            }
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadData() {

    },
    searchQuery() {

    },
    onChangeTerm(value) {
      if (value && value.length > 0) {
        this.queryParam.term = value.slice(value.length - 1)[0]
      } else {
        this.queryParam.term = ''
      }
    },
    handleUpgrade() {
      this.spaceModal = true
    },
    handleSelectAll() {

    },
    doUpgrade() {

    },
    handleSelect(id) {

    },
    handleDelete() {

    },
    handleSave(data) {
      this.goBack()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 30px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.status-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0;
  .tab-list {
    width: 100%;
    margin-left: -20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
   .tab-item {
      margin: 0 20px;
      font-size: 16px;;
      font-family: Arial;
      font-weight: 400;
      color: #3E4459;
      cursor: pointer;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 3px;
        background: #208557;
        margin-top: 10px;
        position: absolute;
        transition: width 0.2s, left 0.2s;
        transition-timing-function: ease-out;
        left: 50%;
      }
      &.active {
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #1F222D;
        &::after {
          width: 100%;
          left: 0;
        }
      }
    }
  }
}
.filter-tab {
  height: 40px;
  padding: 0;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

}
.account-info {
  width: 600px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  .info-title {
    font-size: 16px;
    font-family: Arial;
    font-weight: bold;
    color: #232836;
    margin-bottom: 5px;
  }
  .info-storage {
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    .cc-storage-progress {
      margin-right: 10px;
      /deep/ .ant-progress-inner {
        background-color: #DFE0E4;
      }
    }
  }
  .info-storage-desc {
    font-size: 14px;
    color: #222A3D;
  }
}
.upgrade-modal {
  /deep/ .space-content {
    .space-title {
      label {
        font-size: 16px;
      }
    }
  }
  .upgrade-con {
    display: flex;
    flex-direction: column;
    .upgrade-duration {
      width: 100%;
      margin-bottom: 10px;
      .duration-title {
        font-weight: bold;
        font-size: 16px;
      }
      .duration-desc {
        margin-top: 5px;
        font-size: 14px;
        p {
          margin-bottom: 5px;
        }
      }
    }
    .upgrade-price {
      span {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
.item-tab {
  .item-con {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    &::after {
      content: '';
      flex-grow: 999;
    }
    .content-item-wrap {
      width: 33.33333%;
      flex-grow: 1;
      padding: 10px;
      // cursor: pointer;
    }
  }
}
</style>

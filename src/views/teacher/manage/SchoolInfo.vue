<template>
  <a-card :bordered="false">
    <div class="status-tab">
      <div class="toggle-mode-type-wrapper">
        <div class="toggle-mode-type">
          <div class="toggle-mode">
            <div
              v-for="(item,index) in tabsList"
              :key="'types'+index"
              :class="{'mode-item': true, 'active-mode' : currentTab === item.value}"
              @click="toggleTab(item.value)">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-card :bodyStyle="{background: '#fff'}">
      <div class="email-to">
        <a href="mailto:support@classcipe.com">Contact us to edit school basic info</a>
      </div>
      <a-form layout="vertical" :model="model">
        <a-form-item label="School Name">
          <a-input disabled v-model="model.schoolName" placeholder="input school name" />
        </a-form-item>
      </a-form>
    </a-card>
  </a-card>
</template>

<script>
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { mapState } from 'vuex'

export default {
  name: 'SchoolInfo',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  data() {
    return {
      currentTab: 'Basic',
      tabsList: [{
          value: 'Basic',
          title: 'Basic Info'
      }],
      model: {
        schoolName: ''
      }
    }
  },
  created() {
    this.model = { ...this.currentSchool }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    })
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.model = { ...currentSchool }
    },
    toggleTab(status) {
      this.currentTab = status
    }
  }
}
</script>
<style lang="less" scoped>
.status-tab {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
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

        .mode-item {
          padding: 0 20px;
          font-size: 12px;
          height: 40px;
          color: rgba(17, 20, 45, 1);
          border-radius: 40px;
          font-family: Inter-Bold;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .active-mode {
          color: #fff;
          background: rgba(21, 195, 154, 1);
        }
      }
    }
  }
}
.email-to {
  position: absolute;
  z-index: 999;
  color: #666;
  top: 20px;
  right: 20px;
}
</style>

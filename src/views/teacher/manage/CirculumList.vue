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
    <circulum-sel v-show="currentTab === 'Circulum'"/>
    <subject-sel v-show="currentTab === 'Subject'"/>
  </a-card>
</template>

<script>
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import CirculumSel from './circulum/CirculumSel'
import SubjectSel from './circulum/SubjectSel'

export default {
  name: 'CirculumList',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    CirculumSel,
    SubjectSel
  },
  data() {
    return {
      currentTab: 'Circulum',
      tabsList: [{
          value: 'Circulum',
          title: 'Circulum'
      },
      {
          value: 'Subject',
          title: 'Subject'
      }, {
          value: 'Teaching',
          title: 'Teaching contents'
      }]
    }
  },
  created() {
  },
  computed: {},
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.$refs[this.currentTab + 'Ref']) {
        this.$refs[this.currentTab + 'Ref'].initData()
      }
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
</style>

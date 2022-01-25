<template>
  <a-card :bordered="false">
    <div class="status-tab">
      <div class="toggle-mode-type-wrapper">
        <div class="toggle-mode-type">
          <div class="toggle-mode">
            <div :class="{ 'mode-item': true, active: currentStatus === 'teacher' }" @click="toggleStatus('teacher')">
              Teachers
            </div>
            <div :class="{ 'mode-item': true, active: currentStatus === 'student' }" @click="toggleStatus('student')">
              Students
            </div>
            <div :class="{ 'mode-item': true, active: currentStatus === 'admin' }" @click="toggleStatus('admin')">
              Admin
            </div>
            <div :class="{ 'mode-item': true, active: currentStatus === 'group' }" @click="toggleStatus('group')">
              Groups
            </div>
          </div>
        </div>
      </div>
    </div>
    <SchoolUserTeacher v-if="currentStatus === 'teacher'" />
    <SchoolUserStudent v-if="currentStatus === 'student'" />
    <SchoolUserAdmin v-if="currentStatus === 'admin'" />
    <SchoolUserGroup v-if="currentStatus === 'group'" />
  </a-card>
</template>

<script>
import SchoolUserTeacher from './SchoolUser/SchoolUserTeacher.vue'
import SchoolUserStudent from './SchoolUser/SchoolUserStudent.vue'
import SchoolUserAdmin from './SchoolUser/SchoolUserAdmin.vue'
import SchoolUserGroup from './SchoolUser/SchoolUserGroup.vue'

export default {
  name: 'SchoolUser',
  mixins: [],
  components: {
    SchoolUserTeacher,
    SchoolUserStudent,
    SchoolUserAdmin,
    SchoolUserGroup
  },
  data() {
    return {
      currentStatus: 'teacher'
    }
  },
  created() {
  },
  computed: {},
  methods: {
    toggleStatus(status) {
      this.currentStatus = status
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

        //.mode-item:first-child {
        //  border-bottom-left-radius: 35px;
        //  border-top-left-radius: 35px;
        //}
        //
        //.mode-item:last-child {
        //  border-bottom-right-radius: 35px;
        //  border-top-right-radius: 35px;
        //}

        .mode-item {
          padding: 0 8px;
          font-size: 12px;
          height: 40px;
          color: rgba(17, 20, 45, 1);
          border-radius: 40px;
          font-family: Inter-Bold;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
        }

        .active {
          color: #fff;
          background: rgba(21, 195, 154, 1);
        }
      }
    }
  }
}
</style>

<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    :title='isRestore ? "Restore Student" : "Move Student"'
    width='500px'
    okText='Confirm'
    :confirmLoading="loading"
    @ok='handleSave'
    :okButtonProps="{
      props: {disabled: !classId}
    }"
    @cancel='selVis = false'>
    <div class="move-opt">
      <a-row type="flex" align="middle" justify="space-between" v-if="result && result.length > 0">
        <a-col>
          <label for="">Please select class to {{ isRestore ? 'restore' : 'move' }} students</label>
        </a-col>
        <a-col>
          <a-select
            class="move-opt-item"
            :getPopupContainer="trigger => trigger.parentElement"
            v-model='gradeId'
            @change="changeGrade"
            placeholder='Please select grade'>
            <a-select-option v-for='(item) in gradeOptions' :key='item._id'>
              {{ item.name }}
            </a-select-option >
          </a-select>
        </a-col>
      </a-row>
      <div class="student-import-detail">
        <div class="import-detail-title" v-if="result && result.length > 0">Class</div>
        <div class="import-detail-con" v-if="result && result.length > 0">
          <a-radio-group v-model="classId" >
            <a-radio class="detail-con-item" v-for="item in result" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-radio>
          </a-radio-group>
        </div>
        <a-empty v-else>
          <span slot="description"> There is no existed class, please set a class first </span>
          <a-button @click="goClass" type="primary">
            Set class
          </a-button>
        </a-empty>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { moveClassStudent, bulkActStudent } from '@/api/v2/schoolUser'
import { groupBy } from 'lodash-es'

export default {
  name: 'SchoolStudentMove',
  props: {
    classes: {
      type: Array,
      default: () => []
    },
    school: {
      type: Object,
      default: () => {}
    },
    needRestore: {
      type: Boolean,
      default: false
    },
    currentSel: {
      type: Object,
      default: () => {}
    },
    chooseCls: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    },
    classes: {
      handler(val) {
        this.classList = [...val]
        this.initGrade()
      },
      deep: true,
      immediate: true
    },
    currentSel: {
      handler(val) {
        console.log(val)
        this.currentStudent = { ...val }
        this.initGrade()
      },
      deep: true,
      immediate: true
    },
    needRestore(val) {
      this.isRestore = val
    },
    chooseCls(val) {
      this.selCls = val
      this.initGrade()
    }
  },
  data() {
    return {
      selVis: false,
      loading: false,
      isRestore: this.needRestore,
      grades: [],
      gradeId: '',
      classId: '',
      userIds: [],
      result: [],
      gradeOptions: [],
      currentStudent: this.currentSel,
      selCls: this.chooseCls
    }
  },
  methods: {
    async initData() {
      let rs
      if (this.school.id === '0') {
        rs = await App.service('conf-user').get('Grades')
      } else {
        rs = await App.service('conf-school').get('get', { query: { key: 'Grades', rid: this.school.id } })
      }
      this.grades = rs?.val ?? []
      console.log(this.school.id, this.grades, 123)
    },
    initGrade() {
      const standard = this.classList.filter(item => item.classType === 0)
      const groupData = groupBy(standard, 'gradeId')
      console.log(standard)
      this.gradeOptions = this.grades.filter(item => {
        return groupData[item._id]
      })
      if (this.gradeOptions.length > 0) {
        if (this.selCls) {
          this.classId = this.selCls
          const find = this.classList.find(item => item.id === this.classId)
          if (find) {
            this.gradeId = find.gradeId
            this.result = this.classList.filter(item => item.gradeId === find.gradeId)
            return
          }
        }
        this.gradeId = this.gradeOptions[0]._id
        this.result = this.classList.filter(item => item.gradeId === this.gradeId)
      }
    },
    doCreate(item) {
      this.initGrade()
      this.userIds = item.userIds
      this.selVis = true
    },
    changeGrade(gradeId) {
      this.result = this.classList.filter(item => item.gradeId === gradeId)
      if (this.result.length > 0) {
        this.classId = this.result[0].id
      }
    },
    handleSave() {
      const cls = this.classList.find(item => item.id === this.classId)
      if (!cls) {
        this.$message.error('Please select a class')
        return
      }
      if (this.isRestore) {
        this.$confirm({
          title: 'Confirm to restore selected students to class ' + cls.name,
          centered: true,
          okText: 'Confirm',
          onOk: () => {
            // move
            this.loading = true
            moveClassStudent({
              classId: this.classId,
              userIds: this.userIds
            }).then(res => {
              if (res.code === 0) {
                bulkActStudent({
                  act: 8,
                  schoolId: this.currentSchool.id,
                  userIdList: this.userIds,
                  userIds: this.userIds // reset
                }).then(res => {
                  this.$message.success('Student Restored successfully.')
                  this.$emit('update')
                }).finally(() => {
                  this.selVis = false
                  this.loading = false
                })
              } else {
                this.loading = false
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      } else {
        this.$confirm({
          title: 'Confirm to move selected students to class ' + cls.name,
          centered: true,
          okText: 'Confirm',
          onOk: () => {
            // move
            this.loading = true
            moveClassStudent({
              classId: this.classId,
              userIds: this.userIds
            }).then(res => {
              if (res.code === 0) {
                this.$emit('update')
              }
            }).finally(() => {
              this.selVis = false
              this.loading = false
            })
          }
        })
      }
    },
    goClass() {
      this.$router.push('/manage/class/list')
    }
  }
}
</script>

<style scoped lang="less">
.move-opt-item {
  width: 120px;
}
.student-import-detail {
  position: relative;
  margin-top: 20px;
  .import-detail-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .import-detail-con {
    height: 200px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .detail-con-item {
      height: 30px;
      line-height: 30px;
      margin: 5px 0;
      display: block;
    }
  }
  .import-detail-tip {
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
    background: #C8A883;
    border-radius: 3px;
    color: #fff;
    padding: 0 10px;
  }
}
</style>

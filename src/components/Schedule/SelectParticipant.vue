<template>
  <div class='select-participant'>
    <div class='class-info-wrapper'>
      <div class='class-info'>
        <div class='list-title list-title-between'>
          <div class='title-item'>
            Class list
          </div>
          <div class='class-type'>
            <a-radio-group v-model="queryType" button-style="solid">
              <a-radio-button :value="0">
                Standard
              </a-radio-button>
              <a-radio-button :value="1">
                Subject
              </a-radio-button>
            </a-radio-group>
          </div>
        </div>
        <div class='class-list'>
          <a-skeleton :loading='loading'>
            <div
              class='class-item'
              :class="{'selected-item': selectedClassIdList.indexOf(classItem.id) !== -1, 'current-active-item': currentSelectedClass && classItem.id === currentSelectedClass.id }"
              v-for='classItem in classList'
              :key='classItem.id'
              @click='handleSelectClass(classItem)'>
              <div class='item-checked-icon'>
                <template v-if="selectedClassIdList.indexOf(classItem.id) !== -1">
                  <img src="~@/assets/icons/lesson/selected.png" />
                </template>
                <template v-if="selectedClassIdList.indexOf(classItem.id) === -1">
                  <div class="empty-circle"></div>
                </template>
              </div>
              <div class='class-name'>{{ classItem.name }}</div>
            </div>
            <div class='no-class-tips' v-if='!classList.length && !loading'>
              <common-no-data text='No class' />
            </div>
          </a-skeleton>
        </div>
      </div>
    </div>
    <div class='student-info-wrapper'>
      <div class='student-info'>
        <div class='list-title'>
          <div class='title-action'>
            <a-checkbox @change="onSelectAllChange" :checked='selectAllFlag'>
              Select all
            </a-checkbox>
          </div>
        </div>
        <div class='student-list'>
          <template v-if='studentListLoading'>
            <a-skeleton />
          </template>
          <template v-else>
            <template v-if='studentList.length'>
              <div
                class='student-item'
                :class="{'selected-item': selectedStudentIdList.indexOf(student.id) !== -1, 'odd-item': sIdx % 2 === 1, 'even-item': sIdx % 2 === 0}"
                v-for='(student, sIdx) in studentList'
                :key='student.id'
                @click='handleSelectStudent(student)'>
                <div class='student-item-info'>
                  <div class='avatar'>
                    <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
                      {{ student.firstname ? student.firstname[0].toUpperCase() : 'S' }}
                    </a-avatar>
                  </div>
                  <div class='nickname'>
                    {{ student.firstname }} {{ student.lastname }}
                  </div>
                  <div class='email'>
                    {{ student.email }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class='no-student-tips'>
                <no-more-resources tips='No student' v-if='currentSelectedClass' />
                <div class='select-class-tips' v-else>
                  Select a class first.
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import InputWithCreate from '@/components/Common/InputWithCreate'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { listClass } from '@/api/v2/schoolClass'
import { mapState } from 'vuex'
import { getSchoolUsers } from '@/api/v2/schoolUser'
import store from '@/store'
import CommonNoData from '@/components/Common/CommonNoData'

export default {
  name: 'SelectParticipant',
  components: { CommonNoData, CustomTextButton, InputWithCreate, NoMoreResources },
  data() {
    return {
      currentSelectedClass: null,
      studentList: [],
      checkedClass: [],
      studentListLoading: false,
      checkedStudent: [],
      classList: [],
      queryType: 0,
      loading: false,
      selectAllFlag: false
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    selectedClassIdList({ checkedClass }) {
      return Array.from(new Set(checkedClass.map(item => item.id) || []))
    },
    selectedStudentIdList({ checkedStudent }) {
      return Array.from(new Set(checkedStudent.map(item => item.id) || []))
    }
  },
  watch: {
    queryType(newValue) {
      this.listClass(newValue)
    },
    checkedStudent: {
      deep: true,
      immediate: true,
      handler(v) {
        console.log('checkedStudent changed', v, this.studentList)
        if (v.length !== this.studentList.length) {
          this.selectAllFlag = false
        } else {
          this.selectAllFlag = true
        }
      }
    }
  },
  created() {
    this.listClass(this.queryType)
  },
  methods: {
    listClass (queryType) {
      this.loading = true
      listClass({
        queryType: queryType,
        schoolId: this.currentSchool.id,
        pageNo: 1,
        pageSize: 10000
      }).then(res => {
        this.$logger.info('listClass res records', res)
        this.classList = res?.result?.records || []
        this.studentList = []
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectClass (item) {
      this.$logger.info('handleSelectClass', item, 'this.checkedClass', this.checkedClass)
      this.checkedClass = [item]
      this.currentSelectedClass = item
      this.loadCurrentClassStudent()
      this.$emit('select-class-student')
    },

    removeClassStudent(classItem) {
      this.$logger.info('before removeClassStudent', this.checkedStudent)
      this.checkedStudent = this.checkedStudent.filter(student => student.classes.length === 0 || student.classes[0].id !== classItem.id)
      this.$logger.info('after removeClassStudent', this.checkedStudent)
    },
    loadCurrentClassStudent() {
      this.$logger.info('loadCurrentClassStudent', this.currentSelectedClass)
      if (this.currentSelectedClass) {
        this.studentListLoading = true
        getSchoolUsers({
          schoolId: store.getters.school,
          roles: 'student',
          classes: this.currentSelectedClass.id,
          pageSize: 10000,
          pageNo: 1
        }).then(res => {
          this.$logger.info('loadClassStudent', res)
          if (res.result) {
            this.studentList = res.result.records
            this.checkedStudent = this.studentList.slice()
          }
        }).finally(() => {
          this.studentListLoading = false
        })
      }
    },

    selectPrivateWorkshop () {
      this.$logger.info('selectPrivateWorkshop', this.checkedStudent)
      this.$emit('select-workshop-type', {
        workshopType: 1
      })
    },

    selectPublicWorkshop () {
      this.$logger.info('selectPrivateWorkshop', this.checkedStudent)
      this.$emit('select-workshop-type', {
        workshopType: 2
      })
    },

    getSelectedData () {
      this.$logger.info('getSelectedData', this.checkedClass, this.checkedStudent)
      return {
        classIds: this.checkedClass.map(item => item.id),
        selectStudents: this.checkedStudent.map(item => item.id)
      }
    },

    handleSelectStudent (student) {
      this.$logger.info('handleSelectStudent', student)
      if (this.selectedStudentIdList.indexOf(student.id) !== -1) {
        this.$logger.info('remove student', student)
        this.checkedStudent.splice(this.checkedStudent.findIndex(it => it.id === student.id), 1)
      } else {
        this.checkedStudent.push(student)
      }
      this.$emit('select-class-student')
    },

    onSelectAllChange() {
      this.$logger.info('onSelectAllChange', this.selectAllFlag)
      this.selectAllFlag = !this.selectAllFlag
      if (this.selectAllFlag) {
        this.checkedStudent = this.studentList.slice()
      } else {
        this.checkedStudent = []
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.select-participant {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  height: 100%;

  .list-title {
    margin: 10px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 35px;
    padding-left: 15px;
    cursor: pointer;
    user-select: none;
    .title-item {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #202020;
    }

    .title-action {
      color: #15c39a;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .list-title-between {
    justify-content: space-between;
  }
}

.class-info-wrapper {
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  padding: 0 40px;
}

.student-info-wrapper {
  background-color: #F7F8F9;
  height: 100%;
  width: 100%;
  padding: 0 40px;
}

.class-info, .student-info {
  height: 100%;
  width: 100%;
  position: relative;
  .class-list, .student-list {
    text-align: center;
    padding: 0 0 10px 10px;
    min-width: 400px;
    max-width: 100%;
    min-height: 200px;
    height: calc(100% - 50px);
    overflow-y: auto;
    .class-item {
      margin-bottom: 13px;
      line-height: 30px;
      padding: 13px 10px 13px 13px;
      user-select: none;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid #E1E6ED;
      border-radius: 3px;

      .class-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #202020;
      }
    }

    .selected-item {
      background-color: #15c39a11;
      color: #15c39a;
      border: 1px solid #15c39a;
    }

    .current-active-item {
      background-color: #15c39a11;
      color: #15c39a;
      border: 1px solid #15c39a;
    }
  }

  .open-session {
    width: calc(100% - 20px);
    margin-top: 15px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #fff;
    position: absolute;
    bottom: -5px;
  }

  .student-list {
    .no-student-tips {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      .select-class-tips {
        color: #aaa;
        user-select: none;
        cursor: pointer;
      }
    }

    .student-item {
      margin-bottom: 5px;
      line-height: 30px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #F7F8F9;
      .student-item-info {
        padding: 7px 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        user-select: none;

        .avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;

          img {
            width: 35px;
            border-radius: 50%;
          }
        }

        .nickname {
          font-size: 16px;
          font-weight: 500;
        }

        .email {
          font-size: 14px;
          color: #bbb;
          padding-left: 5px;
        }
      }
    }

    .odd-item {
      background-color: #fff;
      border: 1px solid #fff;
    }

    .selected-item {
      background-color: #15c39a11;
      border: 1px solid #15c39a;
    }
  }
}

.item-checked-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 25px;
  margin-right: 5px;
  .empty-circle {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  img {
    width: 18px;
    height: 18px;
  }
}

.no-class-tips {
  height: 250px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

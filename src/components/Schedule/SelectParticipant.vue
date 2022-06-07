<template>
  <div class='select-participant'>
    <div class='class-info-wrapper'>
      <div class='class-info'>
        <div class='list-title'>
          <div class='title-item'>
            Class list
          </div>
        </div>
        <div class='class-list'>
          <div
            class='class-item'
            :class="{'selected-item': checkedClass.indexOf(classItem) !== -1, 'current-active-item': classItem === currentSelectedClass }"
            v-for='classItem in classList'
            :key='classItem.id'
            @click='handleSelectClass(classItem)'>
            <div class='item-checked-icon'>
              <template v-if="checkedClass.indexOf(classItem) !== -1">
                <img src="~@/assets/icons/lesson/selected.png" />
              </template>
              <template v-if="checkedClass.indexOf(classItem) === -1">
                <div class="empty-circle"></div>
              </template>
            </div>
            <div class='class-name'>{{ classItem.name }}</div>
          </div>
          <div class='open-session'>
            <a-space>
              <custom-text-button @click='selectPrivateWorkshop' label='Private Workshop'>
                <template v-slot:badge>
                  <a-tooltip
                    title="Private workshop allows you to set up a session for your students
without having a class. Zoom is not available for free-plan users,
you can ask your student to attend via direct link generated on the workshop page. ">
                    <a-icon type="question-circle" theme="filled" :style="{ fontSize: '16px', color: '#EB5062' }"/>
                  </a-tooltip>
                </template>
              </custom-text-button>
              <custom-text-button @click='selectPublicWorkshop' label='Public Workshop'>
                <template v-slot:badge>
                  <a-tooltip
                    title="Public workshop can only be promoted by our platform
via library and featured list(you can not invite people
to participate via direct link, they can only attend upon
registration(optional) and you can set price for attendants.
After scheduling, you can edit it in live workshop
page, thus zoom will be auto-scheduled.">
                    <a-icon type="question-circle" theme="filled" :style="{ fontSize: '16px', color: '#EB5062' }"/>
                  </a-tooltip>
                </template>
              </custom-text-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <div class='student-info-wrapper'>
      <div class='student-info'>
        <div class='list-title'>
          <div class='title-item'>
            Student list
          </div>
          <div class='title-action' @click='handleSelectAllStudent'>
            Select all
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
                :class="{'selected-item': checkedStudent.indexOf(student) !== -1, 'odd-item': sIdx % 2 === 1, 'even-item': sIdx % 2 === 0}"
                v-for='(student, sIdx) in studentList'
                :key='student.id'
                @click='handleSelectStudent(student)'>
                <div class='student-item-info'>
                  <div class='avatar'>
                    <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
                      {{ student.nickname ? student.nickname[0].toUpperCase() : 'S' }}
                    </a-avatar>
                  </div>
                  <div class='nickname'>
                    {{ student.nickname }}
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
import { getClassesStudent } from '@/api/v2/classes'
import NoMoreResources from '@/components/Common/NoMoreResources'
import InputWithCreate from '@/components/Common/InputWithCreate'
import CustomTextButton from '@/components/Common/CustomTextButton'

export default {
  name: 'SelectParticipant',
  components: { CustomTextButton, InputWithCreate, NoMoreResources },
  props: {
    classList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentSelectedClass: null,
      studentList: [],
      checkedClass: [],
      studentListLoading: false,
      checkedStudent: []
    }
  },
  methods: {
    handleSelectClass (item) {
      this.$logger.info('handleSelectClass', item)
      if (this.checkedClass.indexOf(item) !== -1) {
        this.checkedClass.splice(this.checkedClass.indexOf(item), 1)
        this.currentSelectedClass = this.checkedClass.length > 0 ? this.checkedClass[0] : null
      } else {
        this.checkedClass.push(item)
        this.currentSelectedClass = item
      }
      this.loadCurrentClassStudent()
      this.$emit('select-class-student')
    },
    loadCurrentClassStudent() {
      this.$logger.info('loadCurrentClassStudent', this.currentSelectedClass)
      if (this.currentSelectedClass) {
        this.studentListLoading = true
        getClassesStudent({
          classId: this.currentSelectedClass.id
        }).then(res => {
          this.$logger.info('loadClassStudent', res)
          if (res.result) {
            this.studentList = res.result
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
      if (this.checkedStudent.indexOf(student) !== -1) {
        this.checkedStudent.splice(this.checkedStudent.indexOf(student), 1)
      } else {
        this.checkedStudent.push(student)
      }
      this.$emit('select-class-student')
    },

    handleSelectAllStudent () {
      this.$logger.info('handleSelectAllStudent', this.checkedStudent)
      this.studentList.forEach(student => {
        if (this.checkedStudent.indexOf(student) === -1) {
          this.checkedStudent.push(student)
        }
      })
      this.$emit('select-class-student')
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
    margin: 10px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 35px;
    padding: 0 15px;
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
    padding: 0 10px 10px 10px;
    min-width: 400px;
    max-width: 100%;
    height: calc(100% - 80px);
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

</style>

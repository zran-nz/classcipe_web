<template>
  <div class='select-participant'>
    <div class='class-info'>
      <div class='list-title'>
        <div class='title-item'>
          Class list
        </div>
        <div class='title-action' @click='creatingNewClass = !creatingNewClass'>
          Add new
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
        <div
          class='input-class-item'
          v-if='creatingNewClass'>
          <div class='item-checked-icon'>
            <div class="empty-circle"></div>
          </div>
          <div class='class-name'>
            <a-select
              show-search
              :value="newClassName"
              placeholder="Input class name"
              style="width: 200px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleFilterClass"
              @change="handleChangeFilterClass"
              @keyup.native.enter='handleEnsureCreate'
            >
              <a-select-option v-for="classItem in displayClassList" :key="classItem.id">
                {{ classItem.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class='open-session'>
          <a-button type='primary' @click='handleSelectOpenSession'>Open Session</a-button>
        </div>
      </div>
    </div>
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
              :class="{'selected-item': checkedStudent.indexOf(student) !== -1 }"
              v-for='student in studentList'
              :key='student.id'
              @click='handleSelectStudent(student)'>
              <div class='student-info'>
                <div class='avatar'>
                  <img :src='student.avatar' v-if='student.avatar'/>
                  <img src="~@/assets/icons/evaluation/default_avatar.png" v-else/>
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
</template>

<script>
import { getClassesStudent } from '@/api/v2/classes'
import NoMoreResources from '@/components/Common/NoMoreResources'
import InputWithCreate from '@/components/Common/InputWithCreate'
import { PersonalAddOrUpdateClass } from '@/api/schoolClass'

export default {
  name: 'SelectParticipant',
  components: { InputWithCreate, NoMoreResources },
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
      checkedStudent: [],

      creatingNewClass: false,
      displayClassList: this.classList,
      newClassName: null
    }
  },
  created() {
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
          }
        }).finally(() => {
          this.studentListLoading = false
        })
      }
    },

    handleSelectOpenSession () {
      this.$logger.info('handleSelectOpenSession', this.checkedStudent)
      this.$emit('select-open-session')
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
    },

    handleChangeFilterClass (value) {
      this.$logger.info('handleCreateClass', value)
      this.creatingNewClass = false
      this.newClassName = null
    },
    handleFilterClass (value) {
      this.$logger.info('handleFilterClass', value)
      this.newClassName = value
      this.displayClassList = this.classList.filter(item => item.name.indexOf(value) !== -1)
      this.$logger.info('handleFilterClass handleCreateClass', this.displayClassList)
    },

    handleEnsureCreate () {
      this.$logger.info('handleEnsureCreate', this.newClassName)
      if (this.classList.some(item => item.name === this.newClassName)) {
        this.$message.error('Class name already exists.')
      } else {
        this.creatingNewClass = false
        PersonalAddOrUpdateClass({ name: this.newClassName }).then(response => {
          this.$emit('update-class-list')
          this.newClassName = null
        })
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
    margin: 10px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 35px;
    padding: 0 15px;
    cursor: pointer;
    user-select: none;
    .title-item {
      font-weight: 500;
      color: #333;
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

.class-info, .student-info {
  height: 100%;
  position: relative;
  .class-list, .student-list {
    border: 1px solid #f1f1f1;
    padding: 10px;
    min-width: 300px;
    max-width: 500px;
    height: calc(100% - 50px);
    overflow-y: scroll;
    .class-item {
      line-height: 35px;
      padding: 0 5px;
      margin: 3px 0;
      user-select: none;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border: 2px solid #fff;

      .class-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
      }

      &:hover {
        border: 2px solid #15c39a;
      }
    }

    .input-class-item {
      line-height: 35px;
      padding: 0 5px;
      margin: 3px 0;
      user-select: none;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border: 2px solid #fff;
    }

    .selected-item {
      background-color: #15c39a2e;
      color: #15c39a;
    }

    .current-active-item {
      background-color: #15c39a;
      border: 2px solid #15c39a;
      color: #fff;
    }
  }

  .class-list {
    padding-bottom: 50px;
    height: calc(100% - 50px);
  }

  .open-session {
    width: calc(100% - 20px);
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #fff;
    border-top: 1px solid #f1f1f1;
    position: absolute;
    bottom: 5px;
  }

  .student-list {
    width: 350px;
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
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .student-info {
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
          font-size: 14px;
          font-weight: 500;
        }

        .email {
          font-size: 12px;
          color: #bbb;
          padding-left: 5px;
        }
      }
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

<template>
  <div class='schedule-pay-info'>
    <div class='pay-info'>
      <div class='filter-teacher'>
        <a-radio-group v-model="teacherFilterType">
          <a-radio :style="radioStyle" :value="1">
            All teachers
          </a-radio>
          <a-radio :style="radioStyle" :value="2">
            Filter teachers by Years or Subjects
          </a-radio>
        </a-radio-group>
        <div class='teacher-list'>
          <div class='teacher-list-icon' @click='viewFilterTeacherList'>
            <a-icon type="team" :style="{ color: '#fff', fontSize: '16px' }" />
          </div>
        </div>
      </div>
      <div class='filter-config' v-show='teacherFilterType === 2'>
        <a-row class='config-item'>
          <a-col span='11'>
            <a-select
              mode="multiple"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='filterConfig.yearList'
              class='cc-select'
              placeholder='Select year'>
              <a-select-option v-for='(year,index) in yearOptions' :key='index' :value='year'>
                {{ year }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col span='11' offset='2'>
            <a-select
              mode="multiple"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='filterConfig.subjectList'
              class='cc-select'
              placeholder='Select subject'>
              <a-select-option v-for='(subject,index) in subjectOptions' :key='index' :value='subject'>
                {{ subject }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <div class='tips'>
          <a-alert message="All selected teachers will see this workshop appear on their workshops to attend list." type="success" />
        </div>
      </div>
    </div>
    <div class='select-date'>
      <div class='title'>Schedule </div>
      <div class='date-picker'>
        <a-range-picker
          :getCalendarContainer='trigger => trigger.parentElement'
          :disabled-date="disabledDate"
          @change="handleDateChange"
          format='YYYY-MM-DD HH:mm:ss'
          :show-time="{ format: 'HH:mm' }"/>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import CustomLinkText from '@/components/Common/CustomLinkText'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomTextButton from '@/components/Common/CustomTextButton'

export default {
  name: 'SchoolSchedule',
  components: { CustomTextButton, DeleteIcon, CustomLinkText },
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },

      subjectOptions: [
        'Science',
        'The Arts',
        'Humanities and Social Sciences',
        'Health and Physical Education',
        'Mathematics'
      ],
      yearOptions: [
        'Year 1',
        'Year 2',
        'Year 3',
        'Year 4',
        'Year 5',
        'Year 6',
        'Year 7',
        'Year 8',
        'Year 9',
        'Year 10'
      ],
      teacherFilterType: 1, // 1: all, 2: teacher-filter
      filterConfig: {
        yearList: [],
        subjectList: [],
        languageList: []
      },
      endData: null,
      startDate: null,
      scheduleDataArray: []
    }
  },
  methods: {
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endData)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endData
      })
    },

    getScheduleInfo() {
      return {
        selectTeachers: this.getSelectTeachersByFilter(),
        yearList: this.filterConfig.yearList,
        languageList: this.filterConfig.languageList,
        subjectList: this.filterConfig.subjectList,
        startDate: this.startDate,
        endDate: this.endData
      }
    },

    getSelectTeachersByFilter () {
      // TODO 实现老师过滤逻辑
      return []
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },

    viewFilterTeacherList () {
      this.$logger.info('viewFilterTeacherList')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.schedule-pay-info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  padding: 15px 0;

  .pay-info {
    padding: 0 20px;
    min-height: 300px;
    overflow-y: auto;

    .filter-teacher {
      width: 300px;
      margin: 5px 0 10px 0;
      position: relative;

      .teacher-list {
        cursor: pointer;
        position: absolute;
        right: 5px;
        bottom: 0;

        .teacher-list-icon {
          width: 30px;
          height: 30px;
          background-color: #849B4D;
          border-radius: 50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
        }
      }
    }

    .filter-config {
      min-height: 150px;

      .config-item {
        margin-bottom: 10px;
      }

      .tips {
      }
    }
  }

  .select-date {
    padding: 0 20px;
    .date-picker {
      width: 380px;
    }
    .title {
      font-weight: 500;
      color: #333;
      line-height: 30px;
      padding-left: 5px;
    }
  }
}

.go-calender {
  margin-top: 10px;
}

</style>

<template>
  <div class='schedule-pay-info'>
    <div class='pay-info'>
      <div class='pay-title'>
        <div class='title'>
          Paid session
        </div>
        <div class='pay-switch'>
          <a-switch size='small' v-model='paidSession' />
        </div>
      </div>
      <div class='pay-detail' v-show='paidSession'>
        <div class='fee'>
          <span class='fee-title'>Pricing</span>
          <div class='fee-input'>
            <a-input v-model='price' type='number' class='dollar-price-input' prefix="$" />
          </div>
        </div>
        <div class='pay-discount'>
          <div class='pay-sub-title'>
            Bulk discount pricing
          </div>
          <div class='pay-discount-item' v-for='discount in discountList' :key='discount.id' @click.stop='handleDiscountEdit(discount)'>
            <div class='item-detail'>
              <div class='item-detail-it vertical-between'>
                <div class='it-name'>
                  <div class='pay-participant'>No. of participants</div>
                </div>
                <div class='it-value vertical-left'>
                  <div class='person-num'>
                    <template v-if='discount.editing'>
                      <a-input v-model='discount.peopleThreshold' min='0' type='number' class='cc-form-input discount-input'/>
                    </template>
                    <template v-else>
                      {{ discount.peopleThreshold }}
                    </template>
                    and more
                  </div>
                </div>
              </div>
              <div class='item-detail-it vertical-between'>
                <div class='it-name'>
                  <div class='pay-percent'>Percentage off</div>
                </div>
                <div class='it-value vertical-left'>
                  <div class='discount-off'>
                    <template v-if='discount.editing'>
                      <a-input v-model='discount.discount' min='0' max='100' type='number' class='cc-form-input discount-input'/>%
                    </template>
                    <template v-else>
                      {{ discount.discount }}%
                    </template>
                  </div>
                </div>
              </div>

              <div class='delete-item' @click.stop=''>
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="deleteDiscount(discount)" cancel-text="No">
                  <delete-icon color='#F16A39' />
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
        <div class='add-discount'>
          <custom-text-button label='Add row' @click='handleAddDiscount'>
            <template v-slot:icon>
              <a-icon type='plus-circle' />
            </template>
          </custom-text-button>
        </div>
      </div>
      <div class='pay-title'>
        <div class='title'>
          Max Participants
        </div>
        <div class='pay-slider'>
          <a-space>
            <a-slider v-model="maxParticipants" :min="1" :max="zoomMeetingCapacity" style='width: 100px' />
            <a-input-number v-model="maxParticipants" :min="1" :max="zoomMeetingCapacity" />
          </a-space>
        </div>
      </div>
      <div class='pay-title'>
        <div class='title'>
          Registration deadline
        </div>
        <div class='pay-switch'>
          <a-date-picker
            :getCalendarContainer='trigger => trigger.parentElement'
            ref="registerBefore"
            :disabled-date="disabledRegister"
            :show-time="{ format: 'HH:mm' }"
            @change="handleSelectDate" />
        </div>
      </div>
      <div class='choose-type'>
        <zoom-auth :enable-zoom.sync='enableZoom' />
        <zoom-meeting
          v-show='enableZoom'
          ref='zoom'
          :password='password'
          :waiting-room='waitingRoom' />
      </div>
    </div>
    <div class="date-info">
      <div class='select-date'>
        <div class='title'>Schedule</div>
        <div class='date-picker' v-if="!showCalendar">
          <a-range-picker
            :getCalendarContainer='trigger => trigger.parentElement'
            :default-value="initDate"
            :disabled-date="disabledDate"
            @change="handleDateChange"
            format='YYYY-MM-DD HH:mm:ss'
            :show-time="{ format: 'HH:mm' }"/>
        </div>
        <div style="width: 100%;">
          <session-calendar
            v-if="showCalendar"
            ref="sessionCalendar"
            :editable="false"
            :addable="false"
            :forSelect="true"
            :searchFilters="searchFilters"
            :searchType="searchType"
            @date-select="handleSelectSchedule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import moment from 'moment'
import CustomLinkText from '@/components/Common/CustomLinkText'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { CALENDAR_QUERY_TYPE } from '@/const/common'
import ZoomMeeting from '@/components/Schedule/ZoomMeeting'
import ZoomAuth from '@/components/Schedule/ZoomAuth'

export default {
  name: 'SchedulePayInfo',
  components: {
    ZoomAuth,
    ZoomMeeting,
    CustomTextButton,
    DeleteIcon,
    CustomLinkText,
    SessionCalendar: () => import('@/components/Calendar/SessionCalendar')
  },
  props: {
    defaultDate: {
      type: Array,
      default: null
    },
    showCalendar: {
      type: Boolean,
      default: true
    },
    calendarSearchType: {
      type: [String, Number],
      default: CALENDAR_QUERY_TYPE.WORKSHOP.value
    },
    calendarSearchFilters: {
      type: Array,
      default: () => [1, 2, 3, 4]
    },
    password: {
      type: Boolean,
      default: false
    },
    waitingRoom: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    defaultDate: {
      handler(val) {
        if (val) {
          this.initDate = [...val]
          this.handleDateChange(this.initDate)
        }
      },
      immediate: true
    },
    calendarSearchType: {
      handler(val) {
        if (val) {
          this.searchType = val
        }
      },
      immediate: true
    },
    calendarSearchFilters: {
      handler(val) {
        if (val) {
          this.searchFilters = val
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      CALENDAR_QUERY_TYPE: CALENDAR_QUERY_TYPE,
      searchType: this.calendarSearchType,
      searchFilters: this.calendarSearchFilters,
      paidSession: false,
      price: 100,
      endDate: null,
      startDate: null,
      maxParticipants: 0,
      registerBefore: null,
      discountList: [
        {
          peopleThreshold: 1,
          discount: 0,
          editing: true
        }
      ],
      initDate: this.defaultDate,
      enableZoom: false
    }
  },
  mixins: [ ZoomAuthMixin ],
  mounted() {
    this.globalClick(this.handleBlurClick)
  },
  beforeDestroy() {
    this.globalClick(this.handleBlurClick)
  },
  methods: {
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endDate)
      if (this.registerBefore && moment(this.startDate).isBefore(moment(this.registerBefore))) {
        this.$refs.registerBefore.$el.querySelector('input').click()
      }
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endDate
      })
    },

    handleSelectDate (date, dateString) {
      this.$logger.info('handleSelectDate', moment(date.toDate()).utc().format('YYYY-MM-DD HH:mm:ss'))
      this.registerBefore = moment(date.toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
    },

    async handleZoomStatusChange () {
      this.$logger.info('handleZoomStatusChange', this.enableZoom)
      this.$emit('select-zoom-status', this.enableZoom)
      if (this.enableZoom) {
        const status = await this.checkZoomAuth()
        if (!status) {
          this.enableZoom = false
          this.$logger.info('reset item enableZoom', this.enableZoom)
        } else {
          this.$logger.info('zoom auth success')
        }
      }
    },
    handleSelectSchedule(date) {
      this.startDate = moment(date.startDate).utc().format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(date.endDate).utc().format('YYYY-MM-DD HH:mm:ss')
      if (this.registerBefore && moment(this.startDate).isBefore(moment(this.registerBefore))) {
        this.$refs.registerBefore.$el.querySelector('input').click()
      }
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endDate
      })
    },

    getPaidInfo() {
      return {
        discountInfo: this.discountList,
        maxParticipants: this.maxParticipants,
        price: this.price,
        registerBefore: this.registerBefore,
        startDate: this.startDate,
        endDate: this.endDate,
        password: this.$refs.zoom.isPassword,
        waitingRoom: this.$refs.zoom.isWaitingRoom
      }
    },
    handleAddDiscount () {
      this.discountList.push({
        peopleThreshold: 1,
        discount: 0,
        editing: true
      })
    },

    handleDiscountEdit (discount) {
      discount.editing = true
    },

    handleBlurClick() {
      this.discountList.forEach(discount => {
        discount.editing = false
      })
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },

    disabledRegister(current) {
      // 在开课时间之前
      return current &&
        current < moment().subtract(1, 'days').endOf('day') ||
        (current && this.startDate && current > moment(this.startDate).add(1, 'days').startOf('day'))
    },

    deleteDiscount (discount) {
      const index = this.discountList.indexOf(discount)
      if (index > -1) {
        this.discountList.splice(index, 1)
      }
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
    min-height: 400px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    width: 30%;
    .pay-title {
      margin: 10px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      .title {
        color: #333;
        line-height: 30px;
        padding-left: 5px;
      }

      .pay-slider {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        width: 250px;
      }
    }

    .pay-detail {
      margin: 10px 0;
      padding: 10px 20px;
      background-color: #F7F8F9;
      border-radius: 5px;
      border: 1px solid #eee;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;

      .fee {
        line-height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .add-discount {
        margin-top: 15px;
        height: 35px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #15c39a;
        font-size: 13px;
      }

      .pay-discount {
        margin-top: 15px;
        padding: 5px 20px 10px;
        background-color: #15c39a11;

        .pay-sub-title {
          font-size: 14px;
          color: #15c39a;
          line-height: 28px;
        }

        .pay-discount-title {
          font-size: 14px;
          color: #15c39a;
          line-height: 30px;
          font-weight: bold;
        }
      }

      .pay-discount-item {
        margin: 5px 0;
        line-height: 28px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .item-detail {
          width: 100%;
          position: relative;
          .item-detail-it {
            margin: 5px 0;
            .it-value {
              width: 150px;
            }
          }
        }
        .person-num {
          font-size: 14px;
          color: #666;
        }

        .discount-off {
          color: #e4393c;
          font-size: 14px;
          text-align: center;
          font-family: Verdana;
        }

        .delete-item {
          display: none;
          position: absolute;
          right: -18px;
          top: 50%;
          margin-top: -7px;
        }

        &:hover {
          .delete-item {
            display: flex;
          }
        }
      }
    }
  }

  .date-info {
    width: 70%;
    padding: 0 20px;
    margin: 0 auto;
    min-height: 400px;
    max-height: calc(100vh - 160px);
    overflow-y: scroll;
    .select-date {
        width: 100%;
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
  }

.discount-input {
  width: 70px;
}

.pay-discount-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.go-calender {
  margin-top: 10px;
}

.pay-switch {
  position: relative;
}
.title {
  font-weight: 500;
  color: #333;
  line-height: 30px;
  padding-left: 5px;
  font-size: 16px;
}

.type-list {
  padding: 10px 10px 10px 0;
  .zoom-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    img {
      height: 30px;
    }
  }
}
</style>

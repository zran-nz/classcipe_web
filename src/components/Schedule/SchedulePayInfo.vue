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
          <div class='pay-discount-title'>
            <div class='pay-participant'>No of participants</div>
            <div class='pay-percent'>Percentage off</div>
          </div>
          <div class='pay-discount-item' v-for='discount in discountList' :key='discount.id' @click.stop='handleDiscountEdit(discount)'>
            <div class='person-num'>
              <template v-if='discount.editing'>
                <a-input v-model='discount.peopleThreshold' min='0' type='number' class='cc-form-input discount-input'/>
              </template>
              <template v-else>
                {{ discount.peopleThreshold }}
              </template>
              and more
            </div>
            <div class='discount-off'>
              <template v-if='discount.editing'>
                <a-input v-model='discount.discount' min='0' max='100' type='number' class='cc-form-input discount-input'/>% off
              </template>
              <template v-else>
                {{ discount.discount }}%
              </template>
            </div>
            <div class='delete-item' @click.stop=''>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="deleteDiscount(discount)" cancel-text="No">
                <delete-icon color='#F16A39' />
              </a-popconfirm>
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
            :disabled-date="disabledDate"
            :show-time="{ format: 'HH:mm' }"
            @change="handleSelectDate" />
        </div>
      </div>
    </div>
    <div class='select-date'>
      <div class='title'>Schedule</div>
      <div class='date-picker'>
        <a-range-picker :default-value="initDate" :disabled-date="disabledDate" @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
      </div>
      <div class='go-calender'>
        <a>Go to calender</a>
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
export default {
  name: 'SchedulePayInfo',
  components: { CustomTextButton, DeleteIcon, CustomLinkText },
  props: {
    defaultDate: {
      type: Array,
      default: null
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
    }
  },
  data() {
    return {
      paidSession: false,
      price: 100,
      endData: null,
      startDate: null,
      maxParticipants: 0,
      registerBefore: null,
      discountList: [
        {
          peopleThreshold: 10,
          discount: 20,
          editing: false
        },
        {
          peopleThreshold: 20,
          discount: 30,
          editing: false
        },
        {
          peopleThreshold: 30,
          discount: 40,
          editing: false
        }
      ],
      initDate: this.defaultDate
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
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.$logger.info('handleDateChange', this.startDate, this.endData)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endData
      })
    },

    handleSelectDate (date, dateString) {
      this.$logger.info('handleSelectDate', moment(date.toDate()).utc().format('YYYY-MM-DD HH:mm:ss'))
      this.registerBefore = moment(date.toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
    },

    getPaidInfo() {
      return {
        discountInfo: this.discountList,
        maxParticipants: this.maxParticipants,
        price: this.price,
        registerBefore: this.registerBefore
      }
    },
    handleAddDiscount () {
      this.discountList.push({
        peopleThreshold: 0,
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
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    .pay-title {
      margin: 10px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      .title {
        font-weight: 500;
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
        .person-num {
          font-size: 14px;
          color: #666;
        }

        .discount-off {
          color: #e4393c;
          font-size: 14px;
          width: 120px;
          text-align: center;
          font-family: Verdana;
        }

        .delete-item {
          display: none;
          position: absolute;
          right: -13px;
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

</style>

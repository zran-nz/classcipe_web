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
          <span class='fee-title'>Fee</span>
          <div class='fee-input'>
            <a-input v-model='price' type='number' class='dollar-price-input' suffix="$"/>
          </div>
        </div>
        <div class='add-discount'>
          <custom-link-text text='Add discount' @click='handleAddDiscount'></custom-link-text>
        </div>
        <div class='pay-discount'>
          <div class='pay-discount-item' v-for='discount in discountList' :key='discount.id' @click.stop='handleDiscountEdit(discount)'>
            <div class='person-num'>
              People
              <template v-if='discount.editing'>
                <a-input v-model='discount.peopleThreshold' type='number' class='cc-form-input discount-input'/>
              </template>
              <template v-else>
                {{ discount.peopleThreshold }}
              </template>
            </div>
            <div class='discount-off'>
              <template v-if='discount.editing'>
                <a-input v-model='discount.discount' type='number' class='cc-form-input discount-input'/>% off
              </template>
              <template v-else>
                {{ discount.discount }}% off
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class='pay-title'>
        <div class='title'>
          Max Participants
        </div>
        <div class='pay-slider'>
          <a-space>
            <a-slider v-model="maxParticipants" :min="1" :max="500" style='width: 100px' />
            <a-input-number v-model="maxParticipants" :min="1" :max="zoomMeetingCapacity" />
          </a-space>
        </div>
      </div>
      <div class='pay-title'>
        <div class='title'>
          Register before
        </div>
        <div class='pay-switch'>
          <a-date-picker :show-time="{ format: 'HH:mm' }" @change="handleSelectDate" />
        </div>
      </div>
    </div>
    <div class='select-date'>
      <div class='title'>Schedule</div>
      <div class='date-picker'>
        <a-range-picker @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'
import moment from 'moment'
import CustomLinkText from '@/components/Common/CustomLinkText'
export default {
  name: 'SchedulePayInfo',
  components: { CustomLinkText },
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
      ]
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
      this.$logger.info('handleBlurClick')
      this.discountList.forEach(discount => {
        discount.editing = false
      })
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
    width: 400px;
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
      margin: 5px 0;
      padding: 10px;
      background-color: #f1f1f1;
      border-radius: 5px;
      border: 1px solid #ddd;
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
        height: 35px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #15c39a;
        font-size: 13px;

        &:hover {
          text-decoration: underline;
        }
      }

      .pay-discount {
        padding: 10px 5px;
        background-color: #15c39a11;
      }

      .pay-discount-item {
        line-height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        .person-num {
          font-size: 14px;
          color: #15c39a;
        }

        .discount-off {
          color: #e4393c;
          font-size: 14px;
          font-weight: 400;
          font-family: Verdana;
        }
      }
    }
  }

  .select-date {
    width: 380px;
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
</style>

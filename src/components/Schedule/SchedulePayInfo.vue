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
          Add discount
        </div>
        <div class='pay-discount'>
          <div class='pay-discount-item' v-for='discount in discountList' :key='discount.id'>
            <div class='person-num'>
              {{ discount.name }}
            </div>
            <div class='discount-off'>
              {{ discount.discount }}
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
            <a-input-number v-model="maxParticipants" :min="1" :max="500" />
          </a-space>
        </div>
      </div>
      <div class='pay-title'>
        <div class='title'>
          Register before
        </div>
        <div class='pay-switch'>
          <a-date-picker format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }" @change="handleSelectDate" />
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
export default {
  name: 'SchedulePayInfo',
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
          id: 1,
          name: 'Persons 10',
          discount: 'Off 20%'
        },
        {
          id: 2,
          name: 'Persons 20',
          discount: 'Off 30%'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = dateString[0]
      this.endData = dateString[1]
      this.$logger.info('handleDateChange', this.startDate, this.endData)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endData
      })
    },

    handleSelectDate (ddate, dateStringate) {
      this.$logger.info('handleSelectDate')
      this.registerBefore = dateStringate
    },

    getPaidInfo() {
      return {
        discountInfo: [],
        maxParticipants: this.maxParticipants,
        price: this.price,
        registerBefore: this.registerBefore
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
        line-height: 35px;
        text-align: right;
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
        line-height: 25px;
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
</style>

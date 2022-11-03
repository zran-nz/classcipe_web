<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='600px'>
    <modal-header @close='handleClose' title='Set sale-off'/>
    <div class='discount-setting'>
      <div class='setting-item'>
        <div class='setting-label'>
          Mode
        </div>
        <div class='setting-content'>
          Sale off
        </div>
      </div>

      <div class='setting-item'>
        <div class='setting-content'>
          Single purchases over <a-input v-model="discountSetting.overs" class='dollar-price-input' prefix="$"/>
          sale off <a-input v-model="discountSetting.salesOff" class='dollar-price-input red-input' prefix="$"/>
        </div>
      </div>

      <div class='setting-item'>
        <div class='setting-label'>
          Duration Setting
        </div>
        <div class='setting-content'>
          <a-switch size='small' v-model='discountSetting.durationOn' />
        </div>
      </div>

      <div class='setting-item'>
        <div class='setting-label'>
        </div>
        <div class='setting-content'>
          <a-range-picker :default-value="initDate" :mode="['date']" :disabled-date="disabledDate" @change="handleDurationChange" v-if='discountSetting.durationOn'/>
        </div>
      </div>

    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleClose'>Cancel</a-button>
        <a-button type='primary' @click='handleConfirmDiscountSetting'>Done</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'
import moment from 'moment'
import { discountSettingQuery, discountSettingSave } from '@/api/v2/discountSetting'

export default {
  name: 'DiscountSetting',
  components: { ModalHeader },
  data() {
    return {
      visible: true,
      discountSetting: {
        overs: 0,
        salesOff: 20,
        durationOn: false,
        duration: null,
        startDate: null,
        endData: null
      },
      initDate: [moment(new Date()), null]
    }
  },
  created() {
    discountSettingQuery({
      contentId: -1,
      contentType: -1
    }).then(res => {
      const data = res.result
      if (data) {
        console.info('discountSettingQuery', data)
        this.discountSetting.salesOff = data.saleOff
        this.discountSetting.overs = data.overs
        this.discountSetting.startDate = data.discountStartTime
        this.discountSetting.endData = data.discountEndTime
        this.discountSetting.durationOn = !!data.discountStartTime || !!data.discountEndTime
        if (this.discountSetting.durationOn) {
          this.initDate = [data.discountStartTime ? moment(data.discountStartTime) : moment(new Date()), data.discountEndTime ? moment(data.discountEndTime) : null]
        }
      }
    })
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    async handleConfirmDiscountSetting () {
      console.info('handleConfirmDiscountSetting', this.discountSetting)
      this.discountSetting.salesOff = parseFloat(this.discountSetting.salesOff).toFixed(2)
      this.discountSetting.overs = parseFloat(this.discountSetting.overs).toFixed(2)
      if (this.discountSetting.salesOff > this.discountSetting.overs) {
        this.$message.warn('The sale off amount can not exceed the single purchase amount!')
      } else {
        await discountSettingSave({
          contentId: -1,
          contentType: -1,
          saleOff: this.discountSetting.salesOff,
          discountModel: 1,
          overs: this.discountSetting.overs,
          discountStartTime: this.discountSetting.startDate,
          discountEndTime: this.discountSetting.endData
        })
        this.$emit('confirm')
      }
    },

    handleDurationChange (date) {
      console.info('handleDurationChange', date)
      this.discountSetting.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD 00:00:00')
      this.discountSetting.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD 00:00:00')
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.discount-setting {
  .setting-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 5px 0;
    width: 100%;

    .setting-half {
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }

    .setting-label {
      display: flex;
      width: 120px;
      font-size: 14px;
      font-weight: 400;
      color: #333;
    }

    .setting-content {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

.dollar-price-input {
  width: 100px;
  text-align: left;

  /deep/ input {
    border-top: none;
    border-left: none;
    border-right: none;
    box-shadow: none;
  }
}

.setting-content {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: #333;
}

</style>

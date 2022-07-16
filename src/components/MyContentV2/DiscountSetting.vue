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

      <div class='setting-item' v-if='discountSetting.mode === mode.SalesOff'>
        <div class='setting-content'>
          Single purchases over <a-input v-model="discountSetting.threshold" type='number' class='dollar-price-input' prefix="$"/>
          sale off <a-input v-model="discountSetting.thresholdDiscountMoney" type='number' class='dollar-price-input' prefix="$"/>
        </div>
      </div>

      <div class='setting-item' v-if='discountSetting.mode === mode.Discount'>
        <div class='setting-content'>
          <a-input v-model="discountSetting.salesOffPercent" type='number' class='dollar-price-input' suffix="%"/>
          discount applied to all content
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
          <a-range-picker :disabled-date="disabledDate" @change="handleDurationChange" v-show='discountSetting.durationOn'/>
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

const mode = {
  SalesOff: 'SalesOff',
  Discount: 'Discount'
}

export default {
  name: 'DiscountSetting',
  components: { ModalHeader },
  data() {
    return {
      visible: true,
      mode: mode,
      discountSetting: {
        mode: mode.SalesOff,
        threshold: 0,
        thresholdDiscountMoney: 20,
        durationOn: false,
        duration: null,
        salesOffPercent: 0
      }
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    handleConfirmDiscountSetting () {
      this.$logger.info('handleConfirmDiscountSetting', this.discountSetting)
      this.$emit('confirm', {
        content: this.content,
        publishList: this.publishList
      })
    },

    handleDurationChange (data) {
      this.$logger.info('handleDurationChange', data)
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
  width: 80px;

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

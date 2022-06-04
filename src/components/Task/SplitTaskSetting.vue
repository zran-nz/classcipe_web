<template>
  <div class='split-task-setting'>
    <div class='setting-tips'>
      This task is only 2 steps from showing to global educators. <br/>
      Is this task suitable for student self-learning?
    </div>
    <div class='is-self-learn config-item'>
      <a-space :size='20'>
        <a-tooltip
          title="After you set it as student self-learning
friendly, this task will appear on students'
page for purchase. After 5 students have
successfully completed the task and given
positive review, Classcipe will make it as
premium task then you may set a price for
it which will be charged from students and
paid to your account upon each purchase.">
          <a-button class='cc-round-button' :class="{'cc-dark-button': mySelfLearning }" @click='mySelfLearning = true' style='width: 80px'>
            <a-badge count='?' :offset='[25, -8]'>
              Yes
            </a-badge>
          </a-button>
        </a-tooltip>
        <a-button class='cc-round-button' :class="{'cc-dark-button': !mySelfLearning }" @click='mySelfLearning = false' style='width: 80px'>No</a-button>
      </a-space>
    </div>
    <div class='price-set config-item'>
      <a-space>
        <a-switch size='small' v-model='enablePrice'></a-switch>
        <div class='price-input'>
          <div class='price-label'>Price</div>
          <a-input v-model='myPrice' type='number' class='cc-form-input dollar-price-input' :disabled='!enablePrice' suffix='$' />
        </div>
      </a-space>
    </div>
    <div class='action-bar'>
      <a-space>
        <a-button class='cc-round-button' type='primary' @click='handleConfirmAndSplitTask'>Confirm & Split task</a-button>
        <a-button class='cc-round-button' type='primary' @click='handleConfirm'>Confirm</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import CustomRadioButtonGroup from '@/components/Common/CustomRadioButtonGroup'
export default {
  name: 'SplitTaskSetting',
  components: { CustomRadioButtonGroup },
  props: {
    price: {
      type: Number,
      default: 0
    },
    isSelfLearning: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mySelfLearning: this.isSelfLearning,
      enablePrice: this.price !== 0,
      myPrice: this.price
    }
  },
  methods: {
    handleConfirmAndSplitTask (data) {
      this.$logger.info('handleConfirmAndSplitTask')
      this.$emit('confirm-and-split', {
        isSelfLearning: this.mySelfLearning,
        price: this.enablePrice ? +this.myPrice : 0
      })
    },
    handleConfirm (data) {
      this.$logger.info('handleConfirm')
      this.$emit('confirm', {
        isSelfLearning: this.mySelfLearning,
        price: this.enablePrice ? +this.myPrice : 0
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.setting-tips {
  text-align: center;
  line-height: 35px;
  font-size: 14px;
  font-family: Arial;
  font-weight: 400;
  color: #121417;
}

.config-item {
  margin: 20px auto 25px;
  text-align: center;
}

.price-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: Arial;
  font-weight: 400;
  color: #242424;
  .price-label {
    padding: 0 10px 0 10px;
  }
}

.action-bar {
  margin: 25px auto 10px auto;
  text-align: center;
}

.dollar-price-input {
  width: 100px;
}

</style>

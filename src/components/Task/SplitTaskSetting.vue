<template>
  <div class='split-task-setting'>
    <div class='publish-container'>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='10' class='label-name'>
          Would you like to publish it?
        </a-col>
        <a-col span='12'>
          <a-space>
            <a-button class='cc-round-button' :class="{'cc-dark-button': isPublish }" @click='isPublish = true' style='width: 80px'>Yes</a-button>
            <a-button class='cc-round-button' :class="{'cc-dark-button': !isPublish }" @click='isPublish = false' style='width: 80px'>No</a-button>
          </a-space>
        </a-col>
      </a-row>
      <template v-if='isPublish'>
        <a-row :gutter='20' type="flex" align='middle'>
          <a-col span='10' class='label-name'>
            <a-space>
              Price
              <a-switch size='small' v-model='enablePrice'></a-switch>
            </a-space>
          </a-col>
          <a-col span='12'>
            <a-space>
              <a-input-number
                :default-value="0"
                :min="0"
                :max="10000000"
                :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                :disabled='!enablePrice'
                v-show='enablePrice'
                v-model='myPrice'
              />
              <span v-show='enableDiscount && myPrice > 0'>Discounted price <span :style="{'color': 'red'}">${{ (myPrice * (1 - (myDiscount * 1.0) / 100)).toFixed(2) }}</span>
              </span>
            </a-space>
          </a-col>
        </a-row>
        <a-row :gutter='20' v-show='enablePrice && myPrice > 0'>
          <a-col span='10' class='label-name'>
            Discount
          </a-col>
          <a-col span='12'>
            <a-space>
              <a-input-number
                :default-value="1"
                :min="0.01"
                :max="100"
                :formatter="value => `${value || 1}%`"
                :parser="value => value.replace('%', '') || 1"
                v-show='enableDiscount'
                v-model='myDiscount'
                :disabled='!enablePrice'
              />
              <a-switch :checked='enableDiscount' @change="onChange" size='small' v-if='myPrice > 0'></a-switch>
            </a-space>
          </a-col>
        </a-row>
        <a-row :gutter='20' v-show='enablePrice && enableDiscount && myPrice > 0'>
          <a-col span='10' class='label-name'>
            Duration setting
          </a-col>
          <a-col span='12'>
            <a-range-picker :default-value="initDate" :mode="['date']" :disabled-date="disabledDate" @change="handleDateChange"/>
          </a-col>
        </a-row>
      </template>
    </div>
    <div class='sub-task-container' v-if='showCreateSubTask'>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='10' class='label-name'>
          Would like to create sub-tasks?
        </a-col>
        <a-col span='12'>
          <a-space>
            <a-button class='cc-round-button' :class="{'cc-dark-button': isCreateSubTask }" @click='isCreateSubTask = true' style='width: 80px'>Yes</a-button>
            <a-button class='cc-round-button' :class="{'cc-dark-button': !isCreateSubTask }" @click='isCreateSubTask = false' style='width: 80px'>No</a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class='dont-remind'>
      <a-checkbox :checked='dontRemind' @change='changeRemind'>Do not remind me again when I edit this task</a-checkbox>
    </div>
    <div class='action-bar'>
      <a-space>
        <a-button class='cc-round-button' :loading="saveLoading" type='primary' @click='handleConfirm'>Confirm</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import CustomRadioButtonGroup from '@/components/Common/CustomRadioButtonGroup'
import moment from 'moment'
import { discountSettingQuery, discountSettingSave } from '@/api/v2/discountSetting'
import storage from 'store'
export default {
  name: 'SplitTaskSetting',
  components: { CustomRadioButtonGroup },
  props: {
    contentId: {
      type: String,
      default: ''
    },
    isSelfLearning: {
      type: Boolean,
      default: false
    },
    isSubTask: {
      type: String,
      default: null
    },
    showCreateSubTask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      saveLoading: false,
      isPublish: false,
      isCreateSubTask: false,
      enablePrice: false,
      enableDiscount: false,
      myPrice: 0,
      myDiscount: 0,
      dontRemind: false,
      initDate: [moment(new Date()), null],
      startDate: null,
      endData: null
    }
  },
  created() {
    discountSettingQuery({
      contentId: this.contentId,
      contentType: this.$classcipe.typeMap.task
    }).then(res => {
      const data = res.result
      if (data) {
        this.myDiscount = parseFloat(data.discount).toFixed(2)
        this.startDate = data.discountStartTime
        this.endData = data.discountEndTime
        this.myPrice = parseFloat(data.price).toFixed(2)
        if (data.discountStartTime && data.discountEndTime) {
          this.initDate = [moment.utc(data.discountStartTime).local(), moment.utc(data.discountEndTime).local()]
        }
      }
    })
  },
  methods: {
    handleConfirmAndSplitTask (data) {
      console.info('handleConfirmAndSplitTask')
      this.$emit('confirm-and-split', {
        price: this.enablePrice ? +this.myPrice : 0
      })
    },
    async handleConfirm (data) {
      console.info('handleConfirm')
      this.saveLoading = true
      await discountSettingSave({
        contentId: this.contentId,
        contentType: this.$classcipe.typeMap.task,
        discount: parseFloat(this.myDiscount).toFixed(2),
        discountModel: 2,
        discountStartTime: this.startDate,
        discountEndTime: this.endData,
        enableDiscount: this.enableDiscount,
        price: this.enablePrice ? +this.myPrice : 0
      })
      this.$emit('confirm', {
        isCreateSubTask: this.isCreateSubTask,
        dontRemind: this.dontRemind,
        discount: parseFloat(this.myDiscount).toFixed(2),
        isPublish: this.isPublish,
        startDate: this.startDate,
        enableDiscount: this.enableDiscount,
        endData: this.endData,
        price: this.enablePrice ? +this.myPrice : 0
      })
      this.saveLoading = false
    },
    handleDateChange (date, dateString) {
      console.info('handleDateChange', date, dateString)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD 00:00:00')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD 00:00:00')
      console.info('handleDateChange', this.startDate, this.endData)
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },
    onChange(v) {
      this.enableDiscount = v
      if (!v) {
        this.myDiscount = 0
        this.startDate = null
        this.endData = null
      } else {
        if (!this.myDiscount) {
          this.myDiscount = 1
        }
      }
    },
    changeRemind() {
      this.dontRemind = !this.dontRemind
      if (this.dontRemind) {
        storage.set(`${this.contentId}-${this.$store.getters.userInfo.id}-not-remind`, true)
      } else {
        storage.remove(`${this.contentId}-${this.$store.getters.userInfo.id}-not-remind`)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

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
  margin: 10px auto;
  text-align: right;
}

.dont-remind {
  margin-top: 10px;
}

.dollar-price-input {
  width: 100px;
}

.publish-container {
  padding: 10px 15px;
  background: #fab00511;
  margin-bottom: 20px;
  > div {
    margin: 10px 0;
  }
}

.sub-task-container {
  background: #12b88611;
  padding: 10px 15px;
}

.label-name {
  color: #333;
}
</style>

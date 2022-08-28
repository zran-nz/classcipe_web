<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :maskClosable='false'
    destroyOnClose
    @ok='updatePrice'
    @cancel='visible = false'>
    <modal-header title="Edit price" @close='visible = false'/>
    <div class='edit-price'>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='6' class='label-name'>
          Price:
        </a-col>
        <a-col span='6'>
          <a-input-number
            :default-value="0"
            :min="0"
            :max="10000000"
            :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
            v-model='price'
          />
        </a-col>
        <a-col span='12' v-show='enableDiscount && price > 0'>Discounted price <span :style="{'color': 'red'}">${{ (price * (1 - (discount * 1.0) / 100)).toFixed(2) }}</span></a-col>
      </a-row>
      <a-row :gutter='20' type="flex" align='middle' v-if='price > 0'>
        <a-col span='6' class='label-name'>
          Discount:
        </a-col>
        <a-col span='6'>
          <a-input-number
            :default-value="1"
            :min="0.01"
            :max="100"
            :formatter="value => `${value || 1}%`"
            :parser="value => value.replace('%', '') || 1"
            v-show='enableDiscount'
            v-model='discount'
          />
        </a-col>
        <a-col span='12'>
          <a-switch :checked='enableDiscount' @change="onChange" size='small' v-if='price > 0'></a-switch>
        </a-col>
      </a-row>

      <a-row :gutter='20' type="flex" align='middle' v-show='enableDiscount && price > 0'>
        <a-col span='6' class='label-name'>
          Duration setting
        </a-col>
        <a-col span='16'>
          <a-range-picker :default-value="initDate" :mode="['date']" :disabled-date="disabledDate" @change="handleDurationChange"/>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { typeMap } from '@/const/teacher'
import moment from 'moment'
import { discountSettingQuery, discountSettingSave } from '@/api/v2/discountSetting'
import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'EditPriceDialog',
  components: { ModalHeader },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      visible: false,
      enableDiscount: false,
      discount: 0,
      typeMap: typeMap,
      isSelfLearning: false,
      price: 0,
      editPrice: false,
      startDate: null,
      endData: null,
      initDate: [moment(new Date()), null]
    }
  },
  methods: {
    async showEditPrice() {
      const res = await discountSettingQuery({
        contentId: this.content.id,
        contentType: this.content.type
      })
      const data = res.result
      if (data) {
        this.$logger.info('discountSettingQuery', data)
        this.discount = data.discount
        this.price = data.price
        this.enableDiscount = data.enableDiscount
        // this.startDate = data.discountStartTime || new Date()
        // this.endData = data.discountEndTime || new Date(Date.now() + 3600 * 24 * 7 * 1000)
        // this.initDate = [moment(this.startDate), moment(this.endData)]
        this.startDate = data.discountStartTime
        this.endData = data.discountEndTime
        if (data.discountStartTime && data.discountEndTime) {
          this.initDate = [moment.utc(data.discountStartTime).local(), moment.utc(data.discountEndTime).local()]
        }
      }
      this.visible = true
    },
    async updatePrice () {
      this.$logger.info('update price')
      const type = parseInt(this.content.type)
      await discountSettingSave({
        contentId: this.content.id,
        contentType: type,
        discount: this.discount,
        discountModel: 2,
        price: this.price,
        enableDiscount: this.enableDiscount,
        discountStartTime: this.startDate,
        discountEndTime: this.endData
      })
      this.content.price = this.price
      this.content.discountPrice = this.discount > 0 ? parseFloat((this.price - this.price * this.discount / 100).toFixed(2)) : this.price
      this.editPrice = false
      this.visible = false
      this.$emit('finish')
    },
    handleDurationChange (date) {
      this.$logger.info('handleDurationChange', date)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD 00:00:00')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD 00:00:00')
    },
    onChange(v) {
      this.enableDiscount = v
      if (!v) {
        this.discount = 0
        this.startDate = null
        this.endData = null
      } else {
        if (!this.discount) {
          this.discount = 1
        }
      }
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.edit-price {
  width: 100%;
  > div {
    margin: 10px 0;
  }

  .label-name {
    text-align: right;
    color: #222;
  }
}
</style>

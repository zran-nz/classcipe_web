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
        <a-col span='8' class='label-name'>
          Price:
        </a-col>
        <a-col span='16'>
          <a-input
            v-model='price'
            type='number'
            prefix='$'
            class='cc-form-input cc-small-input' />
        </a-col>
      </a-row>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='8' class='label-name'>
          Discount:
        </a-col>
        <a-col span='16'>
          <a-input v-model='discount' class='cc-form-input cc-small-input' suffix='%' />
        </a-col>
      </a-row>

      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='8' class='label-name'>
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
        this.startDate = data.discountStartTime || new Date()
        this.endData = data.discountEndTime || new Date(Date.now() + 3600 * 24 * 7 * 1000)
        this.initDate = [moment(this.startDate), moment(this.endData)]
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

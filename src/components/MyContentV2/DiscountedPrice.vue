<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :maskClosable='false'
    destroyOnClose
    @ok='updatePrice'
    :ok-text='okText'
    :confirmLoading="confirmLoading"
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
import { discountSettingQuery, discountSettingSave } from '@/api/v2/discountSetting'

import ModalHeader from '@/components/Common/ModalHeader'
import moment from 'moment'

export default {
  name: 'DiscountedPrice',
  props: {
    okText: {
      type: String,
      default: 'OK'
    }
  },
  components: {
    ModalHeader
  },
  data() {
    return {
      typeMap: typeMap,
      contentId: '',
      contentType: '',
      enableDiscount: false,
      visible: false,
      discount: 0,
      price: 0,
      editPrice: false,
      startDate: null,
      endData: null,
      initDate: [moment(new Date()), null],
      confirmLoading: false
    }
  },
  methods: {
    async showEditPrice(id, type) {
      this.contentId = id
      this.contentType = type
      const res = await discountSettingQuery({
        contentId: id,
        contentType: type
      })
      const data = res.result
      if (data) {
        console.info('discountSettingQuery', data)
        this.discount = data.discount
        this.price = data.price
        this.enableDiscount = Boolean(data.enableDiscount)
        this.startDate = data.discountStartTime
        this.endData = data.discountEndTime
        if (data.discountStartTime && data.discountEndTime) {
          this.initDate = [moment.utc(data.discountStartTime).local(), moment.utc(data.discountEndTime).local()]
        }
      }
      this.visible = true
    },

    async updatePrice () {
      console.info('update price')
      const type = parseInt(this.contentType)
      this.confirmLoading = true
      await discountSettingSave({
        contentId: this.contentId,
        contentType: type,
        discount: this.discount,
        discountModel: 2,
        price: this.price,
        discountStartTime: this.startDate,
        enableDiscount: this.enableDiscount,
        discountEndTime: this.endData
      })
      // this.content.price = this.price
      // this.content.discountPrice = this.discount > 0 ? parseFloat((this.price - this.price * this.discount / 100).toFixed(2)) : this.price
      let isInDate = false
      if (this.discount > 0) {
        isInDate = moment().isAfter(moment.utc(this.startDate).local()) && moment().isBefore(moment.utc(this.endData).local())
      }
      let discountPrice = this.price
      if (isInDate && this.discount > 0) {
        discountPrice = parseFloat((this.price - this.price * this.discount / 100).toFixed(2))
      }
      this.$emit('update', {
        price: this.price,
        discountPrice: discountPrice
      })
      this.editPrice = false
      this.confirmLoading = false
      this.visible = false
    },

    handleDurationChange (date) {
      console.info('handleDurationChange', date)
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

<style scoped lang="less">
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

<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :maskClosable='false'
    destroyOnClose
    ok-text='Publish'
    :confirmLoading="confirmLoading"
    @ok='updatePrice'
    @cancel='visible = false'>
    <modal-header title="Edit price" @close='visible = false'/>
    <div class='edit-price'>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='8' class='label-name'>
          Price:
        </a-col>
        <a-col span='14'>
          <a-input
            v-model='price'
            prefix='$'
            class='cc-form-input cc-small-input' />
        </a-col>
      </a-row>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='8' class='label-name'>
          Discount:
        </a-col>
        <a-col span='14'>
          <a-input v-model='discount' class='cc-form-input cc-small-input' suffix='%' />
          <!--          <a-input-->
          <!--            v-model='discount'-->
          <!--            prefix='$'-->
          <!--            class='cc-form-input cc-small-input' />-->
        </a-col>
      </a-row>
      <a-row :gutter='20' type="flex" align='middle'>
        <a-col span='8' class='label-name'>
          Duration:
        </a-col>
        <a-col span='14'>
          <a-range-picker :default-value="initDate" :mode="['date']" :disabled-date="disabledDate" @change="handleDurationChange"/>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { typeMap } from '@/const/teacher'
import { discountSettingQuery, discountSettingSave } from '@/api/v2/discountSetting'
import moment from 'moment'
import ModalHeader from '@/components/Common/ModalHeader'
export default {
  name: 'ContentPublish',
  components: { ModalHeader },
  props: {
    content: {
      type: Object,
      default: null
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
      initDate: [moment(new Date()), null],
      confirmLoading: false
    }
  },
  created() {
    this.$logger.info('ContentPublish', this.content)
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    handlePublish () {
      this.$logger.info('handlePublish')
      this.$emit('publish')
    },

    async showEditPrice() {
      const res = await discountSettingQuery({
        contentId: -1,
        contentType: -1
      })
      const data = res.result
      if (data) {
        this.$logger.info('discountSettingQuery', data)
        this.discount = data.discount
        this.price = data.price
        this.startDate = data.discountStartTime
        this.endData = data.discountEndTime
        this.initDate = [moment(data.discountStartTime), moment(data.discountEndTime)]
      }
      this.visible = true
      this.visible = true
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },
    handleDurationChange (date) {
      this.$logger.info('handleDurationChange', date)
      this.startDate = moment(date[0].toDate()).utc().format('YYYY-MM-DD 00:00:00')
      this.endData = moment(date[1].toDate()).utc().format('YYYY-MM-DD 00:00:00')
    },
    async updatePrice () {
      this.$logger.info('update price')
      this.confirmLoading = true
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
      this.editPrice = false
      this.handlePublish()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.publish-title {
  font-size: 15px;
  font-weight: 400;
  color: #333;
}

.publish-selection {
  padding: 10px 0;

  .publish-item {
    .item-type-label {
      font-size: 15px;
      line-height: 30px;
      color: #333;
      font-weight: 400;
    }
  }
}

.content-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border-bottom: 1px solid #15c39a;
  padding-bottom: 15px;
  overflow: hidden;

  .cover {
    border: 1px solid #e1e1e1;
    .cover-block {
      height: 120px;
      width: 180px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 10px;

    .detail-content {
      display: flex;
      flex-direction: column;

      .base-info {
        .name {
          line-height: 26px;
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .update-time, .owner {
          font-size: 13px;
          color: @text-color-secondary;
        }
      }
    }

    .detail-price {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .price-setting {
        width: 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        min-height: 32px;
        padding-right: 10px;
      }

      .price-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .dollar-price-input {
          margin-left: 10px;
          width: 40%;

          /deep/ input {
            border-top: none;
            border-left: none;
            border-right: none;
            box-shadow: none;
          }
        }
      }
    }
  }
}

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

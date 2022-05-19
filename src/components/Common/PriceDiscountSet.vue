<template>
  <div class="price-discount">
    <div class="price-amount">
      <a-form-model
        ref="form"
        :model="form"
        :rules="validatorRules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item prop="price" label="Price">
          <a-input placeholder="Please input invite price" v-model="form.price" addon-after="$"/>
        </a-form-model-item>
        <template v-if="form.discountInfo && form.discountInfo.length > 0">
          <a-form-model-item
            :wrapperCol="wrapperColNoLabel"
            v-for="(discount, index) in form.discountInfo"
            :key="'discount' + index"
            class="no-bottom"
            label="">
            <div class="discount-con">
              <label class="color-blue" for="">Persona > </label>
              <a-form-model-item
                label=""
                class="flex1"
                :prop="'discountInfo.' + index + '.peopleThreshold'"
                :rules="validatorRules.peopleThreshold"
              >
                <a-input placeholder="Person" v-model="discount.peopleThreshold"/>
              </a-form-model-item>
              <label for="">&nbsp;Off&nbsp;</label>
              <a-form-model-item
                class="min-model"
                label=""
                :prop="'discountInfo.' + index + '.discount'"
                :rules="validatorRules.discount"
              >
                <a-input placeholder="Discount" v-model="discount.discount" addon-after="%"/>
              </a-form-model-item>
              <a-icon class="color-blue" type="minus-circle" @click="delDiscount(index)"/>
            </div>
          </a-form-model-item>
        </template>
        <a-form-model-item class="no-bottom" :wrapperCol="wrapperColNoLabel" label="">
          <a-icon class="color-blue" type="plus-circle" @click="addDiscount"/>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceDiscountSet',
  data() {
    return {
      form: {
        price: null,
        discountInfo: []
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      wrapperColNoLabel: {
        xs: { span: 24 },
        sm: { span: 18, offset: 5 }
      },
      validatorRules: {
        price: [{ required: true, message: 'Please Enter Price!' }, { validator: this.validatePrice }],
        peopleThreshold: [{ required: true, message: 'Please Enter Person!' }, { validator: this.validateNumber }],
        discount: [{ required: true, message: 'Please Enter Discount!' }, { validator: this.validatePrice }]
      }
    }
  },
  methods: {
    validatePrice(rule, value, callback) {
      if (!value || new RegExp(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/).test(value)) {
        if (value === 0) callback(new Error('请输入整数或者保留两位小数!'))
        callback()
      } else {
        callback(new Error('请输入整数或者保留两位小数!'))
      }
    },
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        if (value === 0) callback(new Error('请输入正整数!'))
        callback()
      } else {
        callback(new Error('请输入正整数!'))
      }
    },
    addDiscount() {
      this.form.discountInfo.push({
        price: null,
        discount: null,
        peopleThreshold: null
      })
    },
    delDiscount(index) {
      this.form.discountInfo.splice(index, 1)
    },
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid, this.form)
      })
    }
  }
}
</script>

<style scoped lang="less">
.price-discount {
  position: relative;
  width: 100%;
  border-radius: 2px;
  background: #F7F8F9;
  padding: 20px;
  .discount-con {
    display: flex;
    justify-content: space-between;
    .min-model {
      width: 100px;
    }
    /deep/ .ant-form-item {
      margin-bottom: 10px;
    }
    & > i {
      margin-top: 13px;
      margin-left: 5px;
    }
  }
}
.no-bottom {
  margin-bottom: 0;
}
.color-blue {
  color: #8E2CA7;
}
.flex1 {
  flex: 1;
}
</style>

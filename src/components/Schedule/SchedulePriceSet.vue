<template>
  <div class='pay-detail'>
    <div class='fee'>
      <span class='fee-title'>Pricing</span>
      <div class='fee-input'>
        <a-input v-model='price' type='number' class='dollar-price-input' prefix="$" />
      </div>
    </div>
    <div class='pay-discount'>
      <div class='pay-sub-title'>
        Bulk discount pricing
      </div>
      <div class='pay-discount-title'>
        <div class='pay-participant'>No of participants</div>
        <div class='pay-percent'>Percentage off</div>
      </div>
      <div class='pay-discount-item' v-for='(discount, index) in discountInfo' :key='"discount" + index' @click.stop='handleDiscountEdit(discount)'>
        <div class='person-num'>
          <template v-if='discount.editing'>
            <a-input v-model='discount.peopleThreshold' min='0' type='number' class='cc-form-input discount-input'/>
          </template>
          <template v-else>
            {{ discount.peopleThreshold }}
          </template>
          and more
        </div>
        <div class='discount-off'>
          <template v-if='discount.editing'>
            <a-input v-model='discount.discount' min='0' max='100' type='number' class='cc-form-input discount-input'/>%
          </template>
          <template v-else>
            {{ discount.discount }}%
          </template>
        </div>
        <div v-show="discountInfo.length > 1" class='delete-item' @click.stop='deleteDiscount(discount)'>
          <!-- <a-popconfirm title="Delete?" ok-text="Yes" @confirm="deleteDiscount(discount)" cancel-text="No"> -->
          <delete-icon color='#F16A39' />
          <!-- </a-popconfirm> -->
        </div>
      </div>
    </div>
    <div class='add-discount'>
      <custom-text-button label='Add row' @click='handleAddDiscount'>
        <template v-slot:icon>
          <a-icon type='plus-circle' />
        </template>
      </custom-text-button>
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import DeleteIcon from '@/components/Common/DeleteIcon'
export default {
  props: {
    initPriceList: {
      type: Array,
      default: () => []
    },
    initPrice: {
      type: Number,
      default: 100
    }
  },
  components: {
    CustomTextButton,
    DeleteIcon
  },
  watch: {
    initPrice: {
      handler(val) {
        this.price = val
      },
      immediate: true
    },
    initPriceList: {
      handler(val) {
        this.discountInfo = val.map(item => {
          const res = {
            peopleThreshold: item.registeredNum,
            discount: 0,
            editing: false
          }
          const discount = this.price === 0 ? 0 : Math.round(((this.price * 100 - item.price * 100) / this.price))
          res.discount = discount
          return res
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      price: 100,
      discountInfo: [
        {
          peopleThreshold: 1,
          discount: 0,
          editing: true
        }
      ]
    }
  },
  methods: {
    handleAddDiscount () {
      this.discountInfo.push({
        peopleThreshold: 1,
        discount: 0,
        editing: true
      })
    },

    handleDiscountEdit (discount) {
      discount.editing = true
    },

    handleBlurClick() {
      this.discountInfo.forEach(discount => {
        discount.editing = false
      })
    },

    deleteDiscount (discount) {
      const index = this.discountInfo.indexOf(discount)
      if (index > -1) {
        this.discountInfo.splice(index, 1)
      }
    },

    getPriceSet() {
      return {
        price: this.price,
        discountInfo: this.discountInfo
      }
    }
  }
}
</script>

<style scoped lang="less">
.pay-detail {
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #F7F8F9;
  border-radius: 5px;
  border: 1px solid #eee;
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
    margin-top: 15px;
    height: 35px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #15c39a;
    font-size: 13px;
  }

  .pay-discount {
    margin-top: 15px;
    padding: 5px 20px 10px;
    background-color: #15c39a11;

    .pay-sub-title {
      font-size: 14px;
      color: #15c39a;
      line-height: 28px;
    }

    .pay-discount-title {
      font-size: 14px;
      color: #15c39a;
      line-height: 30px;
      font-weight: bold;
    }
  }

  .pay-discount-item {
    margin: 5px 0;
    line-height: 28px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .person-num {
      font-size: 14px;
      color: #666;
    }

    .discount-off {
      color: #e4393c;
      font-size: 14px;
      width: 120px;
      text-align: center;
      font-family: Verdana;
    }

    .delete-item {
      display: none;
      position: absolute;
      right: -13px;
      top: 50%;
      margin-top: -7px;
    }

    &:hover {
      .delete-item {
        display: flex;
      }
    }
  }
}
.discount-input {
  width: 70px;
}
.pay-discount-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>

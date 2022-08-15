<template>
  <div class='custom-radio-button-group'>
    <a-space :size="20">
      <a-button
        class='radio-button-item'
        :class="{'checked-item': checkedItem && checkedItem.value === item.value, 'disabled-item': disabled }"
        v-for='(item, idx) in list'
        :key='idx'
        @click='!disabled ? handleClick(item) : null'>
        {{ item[displayProperty] }}
      </a-button>
    </a-space>
  </div>
</template>

<script>
export default {
  name: 'CustomRadioButtonGroup',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    displayProperty: {
      type: String,
      default: 'name'
    },
    value: {
      type: [Number, String],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedItem: null
    }
  },
  created() {
    if (this.value !== null) {
      this.checkedItem = this.list.find(item => item.value === this.value)
    }
  },
  methods: {
    handleClick (item) {
      this.$logger.info('handleClick', item)
      this.checkedItem = item
      this.$emit('change', item)
      this.$emit('update:value', item.value)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-radio-button-group {
  display: flex;
  flex-direction: row;
  align-items: center;

  .radio-button-item {
    min-width: 150px;
    padding: 5px 0;
    height: auto;
    border-radius: 5px;
    font-family: Arial;
    font-weight: 400;
    color: #131824;
    background: #FFFFFF;
    border: 1px solid #E1E6ED;
  }

  .checked-item {
    background: #F8FDFC;
    border: 1px solid #20B890;
    border-radius: 8px;
  }
}

.disabled-item {
  cursor: not-allowed;
}
</style>

<template>
  <div class='cc-radio-switch' ref='radioSwitch'>
    <div
      class='radio-item'
      v-for='(item, idx) in menuList'
      :key='idx'
      @click='handleSelectItem(item, $event)'
      :class="{ 'selected-radio': selectedItem === item}">
      {{ item[displayProperty] }}
    </div>
    <div class='bg-block' v-if='isTransform3dSupported' :style="{ transform: 'translate3d(' + left + 'px' + ',0,0)', width: width + 'px' }"></div>
  </div>
</template>

<script>

export default {
  name: 'RadioSwitch',
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    displayProperty: {
      type: String,
      default: 'name'
    },
    defaultSelectedItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedItem: null,
      left: 0,
      width: 0,
      isTransform3dSupported: ('transform' in document.body.style || 'webkitTransform' in document.body.style || 'MozTransform' in document.body.style)
    }
  },
  created() {
    if (this.defaultSelectedItem) {
      this.selectedItem = this.defaultSelectedItem
    } else if (this.menuList.length > 0) {
      this.selectedItem = this.menuList[0]
    }
  },
  mounted() {
    const targetIndex = this.menuList.indexOf(this.selectedItem)
    if (targetIndex > -1) {
      this.$logger.info('radioSwitch', this.$refs.radioSwitch.childNodes)
      const target = this.$refs.radioSwitch.childNodes[targetIndex]
      const rect = target.getBoundingClientRect()
      this.width = rect.width
      this.left = target.offsetLeft - 5
    }
  },
  methods: {
    handleSelectItem (item, event) {
      this.$logger.info('handleSelectItem', item)
      this.selectedItem = item
      const target = event.target
      const rect = target.getBoundingClientRect()
      this.width = rect.width
      this.left = target.offsetLeft - 10
      this.$emit('select', item)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.cc-radio-switch {
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 3px 10px;
  background: #FFFFFF;
  border: 2px solid #EEF1F6;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;

  .radio-item {
    z-index: 100;
    font-family: Arial;
    font-weight: 500;
    color: #4A4A4A;
    line-height: 38px;
    padding: 0 10px;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
  }

  .selected-radio {
    color: #fff;
  }

  .bg-block {
    position: absolute;
    z-index: 50;
    height: 38px;
    background-color: #363B4C;
    border-radius: 7px;
    transition: all 0.2s ease-in-out;
  }
}
</style>

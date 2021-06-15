<template>
  <div class="browser-block">
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">CurriculumBrowser 1</div>
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">CurriculumBrowser 2</div>
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">CurriculumBrowser 3</div>
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">CurriculumBrowser 4</div>
  </div>
</template>

<script>
import Navigation from './Navigation'
export default {
  name: 'CurriculumBrowser',
  components: {
    Navigation
  },
  props: {
    blockWidth: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
    }
  },
  created () {
    this.$logger.info('CurriculumBrowser blockWidth:' + this.blockWidth)
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.browser-block {
  display: flex;
  flex-direction: row;
  height: 100%;
  border-left: 1px solid #ddd;
  min-height: 600px;

  .browser-block-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    min-height: 600px;
    border-right: 1px solid #ddd;
  }
}
</style>

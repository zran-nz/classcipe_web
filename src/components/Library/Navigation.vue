<template>
  <div class="library-nav-content">
    <div class="nav-path">
      <div class="nav-label">
        <div class="nav-icon">
          <block-svg style="width: 20px" />
        </div>
        <div class="nav-title">Library</div>
      </div>
      <div
        class="nav-path-item"
        v-for="(item,index) in sortNavPath"
        :key="index"
        @click="changePath(item)"
        :data-item="item"
        :style="{'max-width': maxWidth + 'px'}">
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
        <a-tooltip :mouseEnterDelay="0.5" placement="top">
          <template slot="title">
            {{ item.path }}
          </template>
          {{ item.path }}
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>

import BackBtnSvg from '@/assets/svgIcon/library/back_btn.svg?inline'
import BlockSvg from '@/assets/svgIcon/library/block.svg?inline'
import BlueDirSvg from '@/assets/svgIcon/library/blue_dir.svg?inline'
import OpenDirSvg from '@/assets/svgIcon/library/open_dir.svg?inline'
import YellowDirSvg from '@/assets/svgIcon/library/yellow_dir.svg?inline'

export default {
  name: 'Navigation',
  components: {
    BackBtnSvg,
    BlockSvg,
    BlueDirSvg,
    OpenDirSvg,
    YellowDirSvg
  },
  props: {
    path: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data () {
    return {
      maxWidth: 400
    }
  },
  computed: {
    sortNavPath () {
      const rawPath = this.path
      return rawPath.sort((item1, item2) => item1.blockIndex - item2.blockIndex)
    }
  },
  mounted () {
    this.maxWidth = document.documentElement.clientWidth / 5
    this.$logger.info('Navigation item maxWidth ' + this.maxWidth)
  },
  created () {
    this.$logger.info('navigation path', this.path)
  },
  methods: {
    changePath (item) {
      this.$logger.info('changePath', item)
      this.$emit('pathChange', item)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.library-nav-content {
  padding: 10px 5px;
  cursor: pointer;
  .nav-path {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    line-height: 30px;
    font-size: 15px;
    word-break: break-all;

    .nav-label {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;

      .nav-title {
        padding: 0 5px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #182552;
        opacity: 1;
      }
      .nav-icon {
        width: 27px;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          width: 18px;
        }
      }
    }

    .nav-path-item {
      display:inline-block;
      margin-right: 5px;
      color: @primary-color;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .arrow-item {
        width: 8px;
        height: 14px;
        color: #182552;
      }
    }
  }
}
</style>

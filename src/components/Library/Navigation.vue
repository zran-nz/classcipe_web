<template>
  <div class="library-nav-content">
    <div class="nav-path">
      <div class="nav-label">
        <div class="nav-title">Library</div>
        <div class="nav-icon">
          <img src="~@/assets/icons/library/fangkuai.png" />
        </div>
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

export default {
  name: 'Navigation',
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
        width: 60px;
        height: 27px;
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
      font-weight: 600;
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

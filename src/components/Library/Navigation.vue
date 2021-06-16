<template>
  <div class="library-nav-content">
    <div class="nav-path">
      <span class="nav-path-item" v-for="(item,index) in sortNavPath" :key="index" @click="changePath(item)">
        /
        <a-tooltip :mouseEnterDelay="0.5" placement="top">
          <template slot="title">
            {{ item.path }}
          </template>
          {{ item.path }}
        </a-tooltip>
      </span>
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
    }
  },
  computed: {
    sortNavPath () {
      const rawPath = this.path
      return rawPath.sort((item1, item2) => item1.blockIndex - item2.blockIndex)
    }
  },
  created () {
    this.$logger.info('path', this.path)
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
    .nav-path-item {
      display:inline-block;
      margin-right: 5px;
      max-width: 700px;
      color: @primary-color;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

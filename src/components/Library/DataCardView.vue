<template>
  <div class="data-card-view">
    <div class="card-cover" :style="{backgroundImage: 'url(' + cover + ')' }"></div>
    <div :class="{'card-info': true, 'active-item': activeFlag}">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="card-time">
        {{ createdTime | dayjs }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCardView',
  props: {
    cover: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    createdTime: {
      type: String,
      default: null
    },
    activeFlag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.data-card-view {
  background: #FFFFFF;
  opacity: 1;
  height: 220px;
  width: 100%;
  box-sizing: border-box;

  .card-cover {
    height: 150px;
    background-size: cover;
    background-position: center center;
  }

  .card-info {
    padding: 10px;

    .card-title {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
    }

    .card-time {
      height: 16px;
      font-size: 12px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      opacity: 0.5;
    }
  }

  .active-item {
  }
}
</style>

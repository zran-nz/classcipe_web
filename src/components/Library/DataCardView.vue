<template>
  <div class="data-card-view">
    <div class="card-cover" :style="{backgroundImage: 'url(' + cover + ')' }"></div>
    <div :class="{'card-info': true, 'active-item': activeFlag}">
      <div class="card-title">
        <div class="type-icon">
          <content-type-icon :type="contentType" />
        </div>
        <div class="title-text">{{ title }}</div>
      </div>
      <div class="card-time">
        {{ createdTime | dayjs }}
      </div>
    </div>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
export default {
  name: 'DataCardView',
  components: { ContentTypeIcon },
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
    },
    contentType: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.data-card-view {
  background: #FFFFFF;
  opacity: 1;
  height: 200px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;

  &:hover {
    .card-title {
      text-decoration: underline;
    }
  }

  .card-cover {
    height: 130px;
    background-size: cover;
    background-position: center center;
  }

  .card-info {
    padding: 10px;

    .card-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      .title-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .type-icon {
        width: 30px;
        margin-right: 5px;
      }
    }

    .card-time {
      height: 16px;
      font-size: 12px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      opacity: 0.5;
      padding-left: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .active-item {
  }
}
</style>

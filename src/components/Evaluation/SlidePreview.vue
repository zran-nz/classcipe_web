<template>
  <div class="slide-preview">
    <div class="slide-cover">
      <img :src="slideItem.contentUrl" class="cover">
      <div
        class="dot-item"
        @click="handleActiveItem(item)"
        @mouseover="handleActiveItem(item)"
        v-for="(item, index) in slideItem.commentList"
        :key="index"
        :style="{
          position: 'absolute',
          border: '3px solid #aaa',
          backgroundColor: item.background,
          left: ((item.left / item.content_width) * 700) + 'px',
          top: ((item.top / item.content_height) * 400) + 'px',
        }">
      </div>
    </div>
    <div class="slide-dot-list">
      <div class="dot-item" v-for="(item, index) in slideItem.commentList" :key="index" @click="handleActiveItem(item)">
        <div class="author-profile">
          <div class="avatar"></div>
          <div class="profile">
            <div class="author-name">{{ item.user_id }}</div>
            <div class="author-time">{{ item.time | formatDate }}</div>
          </div>
        </div>
        <div class="dot-detail">
          <div v-if="item.type === 'audio'" :class="{'audio-item': true, 'active-dot-item': currentActiveId === item.id, 'in-active-dot-item': currentActiveId !== item.id}">
            <audio :src="item.link" />
          </div>
          <div v-if="item.type === 'video'" :class="{'video-item': true, 'active-dot-item': currentActiveId === item.id, 'in-active-dot-item': currentActiveId !== item.id}">
            <video :src="item.link" />
          </div>
          <div v-if="item.type === 'text'" :class="{'text-item': true, 'active-dot-item': currentActiveId === item.id, 'in-active-dot-item': currentActiveId !== item.id}">
            {{ item.link }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlidePreview',
  props: {
    slideItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      currentActiveId: null
    }
  },
  created () {
    console.log('SlidePreview slideItem', this.slideItem)
  },
  methods: {
    handleActiveItem (item) {
      if (this.currentActiveId === item.id) {
        this.currentActiveId = null
      } else {
        this.currentActiveId = item.id
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.slide-preview {
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  .slide-cover {
    position: relative;
    img.cover {
      width: 700px;
    }

    .dot-item {
      opacity: 0;
      width: 30px;
      height: 30px;
      border-radius: 30px;

      &:hover {
        opacity: 1;
      }
    }
  }
  .slide-dot-list {
    width: 280px;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 5px 10px;

    .dot-item {
      video {
        width: 280px;
      }
    }

    &::-webkit-scrollbar {
      width: 4px;
      height: 2px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.01);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(0,0,0,0.1);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
    }
  }
}
</style>

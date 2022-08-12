<template>
  <div class="slide-preview">
    <div class="slide-cover">
      <img :src="slideItem.contentUrl" class="cover">
      <template v-for="(item, index) in slideItem.commentList">
        <div
          :class="{'dot-item': true,
                   'heartbeat': currentActiveId === item.link + '_' + item.time}"
          v-if="item.user_id === userId"
          @click="handleActiveItem(item)"
          @mouseover="handleActiveItem(item)"
          :key="index"
          :style="{
            position: 'absolute',
            border: '3px solid #aaa',
            backgroundColor: item.background,
            left: ((item.left / item.content_width) * 700) + 'px',
            top: ((item.top / item.content_height) * 400) + 'px',
          }">
        </div>
      </template>
    </div>
    <div class="slide-dot-list">
      <template v-for="(item, index) in slideItem.commentList">
        <div
          :id="'dot-item-' + item.link + '_' + item.time"
          :class="{'dot-item': true,
                   'active-dot-item': currentActiveId === item.link + '_' + item.time,
                   'in-active-dot-item': currentActiveId !== item.link + '_' + item.time}"
          :key="index"
          v-if="item.user_id === userId"
          @mouseover="handleActiveItem(item)"
          @click="handleActiveItem(item)">
          <div class="author-profile">
            <div class="avatar">
              <span class="avatar-user">{{ item.user_id ? item.user_id.slice(0, 1).toUpperCase() : 'C' }}</span>
            </div>
            <div class="profile">
              <div class="author-name">{{ item.user_id }}</div>
              <div class="author-time">{{ item.time * 1000 | formatDate }}</div>
            </div>
          </div>
          <div class="dot-detail" :data-item="JSON.stringify(item)">
            <div v-if="item.type === 'audio'" :class="{'audio-item': true}">
              <audio controls :src="item.link" />
            </div>
            <div v-if="item.type === 'video'" :class="{'video-item': true}">
              <video controls :src="item.link" />
            </div>
            <div v-if="item.type === 'text'" :class="{'text-item': true}">
              {{ item.link }}
            </div>
          </div>
        </div>
      </template>
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
    },
    userId: {
      type: String,
      default: null
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
      this.$logger.info('SlidePreview handleActiveItem', item)
      this.currentActiveId = item.link + '_' + item.time
      const domId = 'dot-item-' + item.link + '_' + item.time
      const dom = document.getElementById(domId)
      if (dom) {
        dom.scrollIntoView({
          behavior: 'smooth'
        })
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
      width: 30px;
      height: 30px;
      border-radius: 30px;
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

.in-active-dot-item {
  opacity: 0.3;
}

.active-dot-item {
  opacity: 1;
}

.dot-item {
  cursor: pointer;
  margin: 10px 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

  .author-profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background: #2DC9A4;
    padding: 5px 0;
    .avatar {
      margin-left: 10px;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      padding: 3px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      .avatar-user {
        font-weight: bold;
        font-size: 18px;
        color: #2DC9A4;
      }
    }
    .profile {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      color: #fff;
      .author-name {
        font-weight: bold;
        font-size: 14px;
      }
      .author-time {
        font-size: 12px;
      }
    }
  }

  .dot-detail {

    .text-item {
      padding: 5px 10px;
    }

    .video-item {
      video {
        width: 226px;
      }
    }

    .audio-item {
      padding: 10px 5px;
      audio {
        height: 30px;
        width: 216px;
      }
    }
  }
}

.heartbeat {
  animation: breathing 0.8s ease-out infinite normal;
}

@keyframes breathing {
  0% {
    opacity: 1;
  }

  25% {

    opacity: 0.7;
  }

  50% {

    opacity: 0.2;
  }

  75% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

</style>

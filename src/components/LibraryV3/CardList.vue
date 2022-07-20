<template>
  <div class='card-list-wrapper'>
    <template v-if='titlePosition === "center"'>
      <div class='card-list-title-center'>
        <div class='title-item'>
          <div class='main-title'>
            {{ title }}
          </div>
          <div class='sub-title'>
            {{ subTitle }}
          </div>
        </div>
        <div class='more-action'>
          <router-link :to="'/teacher/library-all/' + category" v-if='!isSchoolMode'>More</router-link>
          <router-link :to="'/teacher/resource-all/' + category" v-if='isSchoolMode'>More</router-link>
        </div>
      </div>
    </template>
    <template v-if='titlePosition === "left"'>
      <div class='card-list-title'>
        <div class='title-item'>
          <div class='main-title'>
            {{ title }}
          </div>
          <div class='sub-title'>
            {{ subTitle }}
          </div>
        </div>
        <div class='more-action'>
          <router-link :to="'/teacher/library-all/' + category" v-if='!isSchoolMode'>More</router-link>
          <router-link :to="'/teacher/resource-all/' + category" v-if='isSchoolMode'>More</router-link>
        </div>
      </div>
    </template>
    <div class='scroll-left' :class="{'inner-scroll-left': innerDesc, 'outer-scroll-left': outerDesc, 'no-more-left': !hasMoreLeft}" @click="scrollLeft">
      <a-icon type="arrow-left" :style="{fontSize: '16px', color: '#6967C3'}" />
    </div>
    <div class='scroll-right' :class="{'inner-scroll-right': innerDesc, 'outer-scroll-right': outerDesc, 'no-more-right': !hasMoreRight}" @click="scrollRight">
      <a-icon type="arrow-right" :style="{fontSize: '16px', color: '#6967C3'}" />
    </div>
    <div class='card-list' :id='category'>
      <div class="card-item" v-for="(item, idx) in list" :key="idx" @click="handlePreviewDetail(item)">
        <card-list-item :inner-desc='innerDesc' :outer-desc='outerDesc' :content="item" :width="cardSize" v-bind="$attrs" />
      </div>
    </div>

    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      :show-buy-button="cardMode === 'library'"
      :show-edit-button='true'
      v-if='previewVisible'
      @close='handlePreviewClose' />
  </div>
</template>

<script>

import CardListItem from '@/components/Preview/CardListItem'
import ContentPreview from '@/components/Preview/ContentPreview'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
export default {
  components: { CardListItem, ContentPreview },
  props: {
    title: { type: String, required: true },
    subTitle: { type: String, default: '' },
    titlePosition: { type: String, default: 'left' },
    category: { type: String, required: true },
    cardSize: { type: Number, default: 20 },
    list: { type: Array, required: true },
    isSchoolMode: { type: Boolean, default: false },
    cardMode: { type: String, default: 'library' },
    innerDesc: {
      type: Boolean,
      default: false
    },
    outerDesc: {
      type: Boolean,
      default: true
    }
  },
  mixins: [ContentItemMixin],
  data() {
    return {
      scrollX: 0,
      slide: 1,
      stars: 1,
      showPreview: false,
      contentId: null,
      contentType: 0,
      hasMoreLeft: true,
      hasMoreRight: true
    }
  },
  mounted() {
    this.hiddenArrow(document.getElementById(this.category))
  },
  methods: {
    scrollFn(e) {
      this.scrollX = e.target.scrollLeft === 0 ? 0 : 1
      console.log(this.scrollX)
    },
    moveTo(x) {
      const dom = this.$refs.list
      let left = dom.scrollLeft + x * dom.offsetWidth * 0.7
      if (left < 0) left = 0
      this.scrollX = dom.scrollLeft === 0 ? 0 : 1
      this.$refs.list.scrollTo({ left, behavior: 'smooth' })
    },
    viewAll () {
      console.log('viewAll', this.category)
    },
    scrollLeft () {
      const dom = document.getElementById(this.category)
      dom.scrollBy({
        left: -800,
        behavior: 'smooth'
      })
      this.hiddenArrow(dom)
    },

    scrollRight () {
      const dom = document.getElementById(this.category)
      dom.scrollBy({
        left: 800,
        behavior: 'smooth'
      })
      this.hiddenArrow(dom)
    },

    hiddenArrow(dom) {
      this.$logger.info('hidden arrow', dom, dom.scrollLeft, dom.offsetWidth, dom.scrollWidth)
      if (dom && (dom.scrollLeft + dom.offsetWidth >= dom.scrollWidth)) {
        this.hasMoreRight = false
      } else {
        this.hasMoreRight = true
      }

      if (dom && dom.scrollLeft <= 0) {
        this.hasMoreLeft = false
      } else {
        this.hasMoreLeft = true
      }
    }
  }
}
</script>

<style lang="less" scoped>

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cc-scroll-btn {
  display: none;
}

.card-list-wrapper {
  width: 100%;
  margin-bottom: 50px;
  position: relative;
  .card-list-title {
    user-select: none;
    font-size: 18px;
    font-family: Arial;
    color: #202020;
    line-height: 40px;
    padding-left: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    .title-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .more-action {
      padding-right: 25px;
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      color: #6967C3;

      a {
        font-size: 14px;
        color: #6967C3;
      }
    }
  }

  .card-list-title-center {
    user-select: none;
    font-size: 22px;
    font-family: Arial;
    color: #202020;
    line-height: 25px;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    position: relative;

    .title-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .main-title {
        line-height: 35px;
        font-size: 24px;
        font-family: Arial;
      }

      .sub-title {
        line-height: 25px;
        font-size: 14px;
        color: #aaa;
      }
    }

    .more-action {
      position: absolute;
      right: 25px;
      top: 45px;
      font-size: 14px;
      user-select: none;
      cursor: pointer;
      color: #6967C3;

      a {
        font-size: 14px;
        color: #6967C3;
      }
    }
  }

  .scroll-left {
    cursor: pointer;
    position: absolute;
    left: 10px;
    background: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 0 5px 0 #ccc;
  }

  .inner-scroll-left, .inner-scroll-right {
    top: 55%;
  }

  .outer-scroll-left, .outer-scroll-right {
    top: 40%;
  }

  .scroll-right {
    right: 8px;
    cursor: pointer;
    position: absolute;
    background: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    z-index: 100;
    box-shadow: 0 0 5px 0 #ccc;
  }

  .card-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: auto;
    justify-content: flex-start;
    width: calc(100% - 50px);
    padding-bottom: 15px;
    margin: 0 25px;
    position: relative;

    .card-item {
      margin-right: 15px;
    }
  }
}

::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.no-more-left, .no-more-right {
  display: none !important;
}
</style>

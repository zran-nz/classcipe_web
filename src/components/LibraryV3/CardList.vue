<template>
  <div class='card-list-wrapper'>
    <div class='card-list-title'>
      <div class='title-item'>
        {{ title }}
      </div>
      <div class='more-action'>
        <router-link :to="'/teacher/library-all/' + category" v-if='!isSchoolMode'>All</router-link>
        <router-link :to="'/teacher/resource-all/' + category" v-if='isSchoolMode'>All</router-link>
      </div>
    </div>
    <div class='scroll-left' @click="scrollLeft">
      <a-icon type="left-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
    </div>
    <div class='scroll-right' @click="scrollRight">
      <a-icon type="right-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
    </div>
    <div class='card-list' :id='category'>
      <div class="card-item" v-for="(item, idx) in list" :key="idx" @click="handlePreviewDetail(item)">
        <card-list-item :content="item" :width="cardSize" v-bind="$attrs" />
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
    category: { type: String, required: true },
    cardSize: { type: Number, default: 20 },
    list: { type: Array, required: true },
    isSchoolMode: { type: Boolean, default: false },
    cardMode: { type: String, default: 'library' }
  },
  mixins: [ContentItemMixin],
  data() {
    return {
      scrollX: 0,
      slide: 1,
      stars: 1,
      showPreview: false,
      contentId: null,
      contentType: 0
    }
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
    },

    scrollRight () {
      const dom = document.getElementById(this.category)
      dom.scrollBy({
        left: 800,
        behavior: 'smooth'
      })
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
  margin-bottom: 30px;
  position: relative;
  .card-list-title {
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 25px;
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    .more-action {
      font-size: 16px;
      user-select: none;
      cursor: pointer;
      color: #153C76;

      a {
        font-size: 16px;
        color: #153C76;
      }
    }
  }

  .scroll-left {
    cursor: pointer;
    position: absolute;
    left: -5px;
    top: 45%;
  }

  .scroll-right {
    cursor: pointer;
    position: absolute;
    right: -5px;
    top: 45%;
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

</style>

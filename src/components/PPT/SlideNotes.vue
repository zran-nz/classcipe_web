<template>
  <div class='slide-notes'>
    <div class='plugin-tags' v-if='currentPageItem'>
      <a-row class='tag-row'>
        <a-space>
          <span class='tag-item' v-if='currentPageItem.data.bloomLevel'>
            <a-space>
              <span class='tag-title'>Bloom's Taxonomy:</span>
              <span class='tag-value' style='color:#F16A39'>{{ currentPageItem.data.bloomLevel }}</span>
            </a-space>
          </span>
          <span class='tag-item' v-if='currentPageItem.data.knowledgeLevel'>
            <a-space>
              <span class='tag-title'>Knowledge dimension(s):</span>
              <span class='tag-value' style='color:#F16A39'>{{ currentPageItem.data.knowledgeLevel }}</span>
            </a-space>
          </span>
        </a-space>
      </a-row>
      <a-row class='tag-row'>
        <a-space>
          <span
            class='tag-item'
            v-if='currentPageItem.data.verbs && currentPageItem.data.verbs.length > 0'>
            <a-space>
              <span class='tag-title'>Command terms:</span>
              <span
                class='tag-value'
                v-for='(v,index) in currentPageItem.data.verbs'
                :key='index'
                style='color:#15C39A'>{{ v }}</span>
            </a-space>
          </span>
          <span class='tag-item' v-if='currentPageTips'>
            <a-space>
              <span class='tag-title'>Tip added:</span>
              <span class='tag-value' style='color:#0054FF'>{{ currentPageTips.tip }}</span>
            </a-space>
          </span>
        </a-space>
      </a-row>
      <a-row class='tag-row' v-if='currentPageItem.data.learnOuts && currentPageItem.data.learnOuts.length > 0'>
        <span class='tag-item'>
          <span class='tag-title'>Assessment objective(s): </span>
          <span
            class='tag-value'
            v-for='(learn,index) in currentPageItem.data.learnOuts'
            :key='index'
            style='color:#00BCF2'>
            <a-tooltip
              :title='learn.path'
              :overlayStyle="{ 'z-index': '3000'}">{{ learn.name }} </a-tooltip>
          </span>
        </span>
      </a-row>
      <a-row class='tag-row'>
        <span class='tag-item'>
          <span class='tag-title'>This is a <span>{{ currentPageItem.type }}</span> slide</span>
        </span>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideNotes',
  props: {
    currentPageItem: {
      type: [Object, String],
      default: null
    },
    currentPageTips: {
      type: [Object, String],
      default: null
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.slide-notes {
  height: 100px;
  width: 100%;
  overflow-y: auto;
  background-color: #F7F7F7;
  font-size: 12px;
  padding: 5px;
  font-family: Segoe UI;
}

.tag-value {
  cursor: pointer;
}
</style>

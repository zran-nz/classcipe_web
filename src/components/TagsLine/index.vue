<template>
  <!-- 每个标签固定宽度 -->
  <div v-if="type === 'fixed'" :class="{'tag-info': true, 'auto-size': type==='auto'}" ref="tagInfo" v-show="tags && tags.length > 0">
    <div class="tag-item" :key="tag.id" v-for="tag in tags.slice(0, showTagLen)">
      <a-tooltip :title="tag.name">
        {{ tag.name }}
      </a-tooltip>
    </div>
    <div class="tag-item" v-if="tags.length > showTagLen">
      <a-popover :overlayStyle="{ width: '310px' }" overlayClassName="tag-info-tip">
        <template slot="content">
          <a-space class="tag-tip">
            <a-tag color="#FFDF9B" class="tag-item" :key="tag.id" v-for="tag in tags.slice(showTagLen)">
              <a-tooltip :title="tag.name">
                {{ tag.name }}
              </a-tooltip>
            </a-tag>
          </a-space>
        </template>
        more
      </a-popover>
    </div>
  </div>
  <!-- 每个标签自动宽度 -->
  <a-popover v-else :trigger="trigger" :overlayStyle="{ width: '310px' }" overlayClassName="tag-info-tip">
    <template slot="content">
      <a-space class="tag-tip">
        <a-tag color="#FFDF9B" class="tag-item" :key="tag.id" v-for="tag in tags">
          <a-tooltip :title="tag.name">
            {{ tag.name }}
          </a-tooltip>
        </a-tag>
      </a-space>
    </template>
    <div :class="{'tag-info': true, 'auto-size': type==='auto'}" ref="tagInfo" v-show="tags && tags.length > 0">
      <div class="tag-item" :key="tag.id" v-for="tag in tags.slice(0, showTagLen)">
        {{ tag.name }}
      </div>
      <div class="tag-item" v-if="tags.length > showTagLen">
        ...
      </div>
    </div>
  </a-popover>
</template>

<script>
export default {
  name: 'TagsLine',
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      showTagLen: this.tags.length,
      trigger: 'hover'
    }
  },
  mounted() {
    this['init' + this.type]()
  },
  created() {
    window.addEventListener('resize', this['init' + this.type], false)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this['init' + this.type])
  },
  methods: {
    initfixed() {
      const tagInfoEl = this.$refs.tagInfo
      const parentEl = tagInfoEl.parentElement
      const items = this.$refs.tagInfo.getElementsByClassName('tag-item')
      const total = this.tags ? this.tags.length : 0
      if (parentEl.childElementCount === 1) {
        tagInfoEl.style.width = parentEl.getBoundingClientRect().width + 'px'
      }
      if (items.length > 0) {
        const itemWidth = items[0].getBoundingClientRect().width + 5
        const showTagLen = parseInt(tagInfoEl.getBoundingClientRect().width / itemWidth) - 1
        // console.log(itemWidth)
        // console.log(total)
        // console.log(showTagLen)
        if (total - showTagLen > 1) {
          this.showTagLen = showTagLen
        } else {
          this.showTagLen = total
        }
      }
    },
    initauto() {
      const tagInfoEl = this.$refs.tagInfo
      const parentEl = tagInfoEl.parentElement
      const items = this.$refs.tagInfo.getElementsByClassName('tag-item')
      const total = this.tags ? this.tags.length : 0
      if (parentEl.childElementCount === 1) {
        tagInfoEl.style.width = parentEl.getBoundingClientRect().width + 'px'
      }
      let showTagLen = 0
      if (items.length > 0) {
        const lastItem = items[0]
        if (lastItem) {
          const moreWidth = lastItem.getBoundingClientRect().width
          const totalWidth = tagInfoEl.getBoundingClientRect().width
          let showTagsWidth = 0
          items.forEach((item, index) => {
            if (totalWidth - showTagsWidth > moreWidth) {
              const addWidth = item.getBoundingClientRect().width + 5
              if (totalWidth - addWidth - showTagsWidth > moreWidth) {
                showTagsWidth += addWidth
                showTagLen += 1
              }
            }
          })
          // console.log(moreWidth)
          // console.log(totalWidth)
          // console.log(showTagsWidth)
          // console.log(showTagLen)
        }
      }
      if (total - showTagLen > 1) {
        this.showTagLen = showTagLen
      } else {
        this.showTagLen = total
        this.trigger = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.tag-info-tip {
  .tag-tip {
    display: flex;
    flex-wrap: wrap;
    .tag-item {
      color: #D97909;
      margin: 5px 0;
      border-radius: 10px;
    }
  }
}
.tag-info {
  // width: 3em /* 300/100 */;
  flex: 1;
  display: flex;
  align-items: center;
  height: 30px;
  margin-top: -20px;
  flex-wrap: wrap;
  .tag-item {
    height: 30px /* 30/100 */;
    line-height: 30px /* 30/100 */;
    padding: 0 10px /* 10/100 */;
    font-size: 15px /* 15/100 */;
    background: #FFDF9B;
    color: #D97909;
    margin-right: 5px /* 5/100 */;
    border-radius: 10px /* 10/100 */;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 60px;
    text-align: center;
  }
  &.auto-size {
    .tag-item {
      width: auto!important;
    }
  }
}
</style>

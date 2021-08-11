<template>
  <div :class="{'tag-input-wrapper': true, 'active': active, 'tag-dom': true}" @click="handleFocusInput">
    <div class="tag-input-list tag-dom">
      <div class="tag-list tag-dom">
        <div class="tag-item tag-dom" v-for="(tag,index) in selectedKeywords" :key="index">
          <a-tag :color="tagColorList[index % tagColorList.length]" closable @close="handleCloseTag(tag)" class="tag-dom">
            {{ tag.name }}
          </a-tag>
        </div>
        <div class="tag-input tag-dom">
          <input
            type="text"
            @keyup.enter="handleAddTag"
            @blur="active = false"
            v-model="inputValue"
            :style="{width: inputWidth}"
            ref="input"
            class="tag-dom"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

export default {
  name: 'SdgTagInput',
  props: {
    selectedKeywords: {
      type: Array,
      default: () => []
    },
    sdgKey: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      inputValue: '',
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      active: false
    }
  },
  computed: {
    inputWidth () {
      const value = this.inputValue || ''
      const length = value.trim().length * 20 + 22
      return (length > 60 ? length : 60) + 'px'
    }
  },
  created () {
  },
  methods: {
    handleAddTag () {
      logger.info('handleAddTag ' + this.sdgKey + ' ' + this.inputValue)
      if (this.inputValue && this.inputValue.trim().length) {
        const tagName = this.inputValue.trim()
        if (this.selectedKeywords.indexOf(tagName) === -1) {
          this.$emit('add-tag', {
            sdgKey: this.sdgKey,
            tagName
          })
        } else {
          logger.info('skip! input value ' + tagName + ' exist in', this.selectedKeywords)
        }
      } else {
        logger.info('skip! input value empty')
      }
      this.inputValue = ''
    },
    handleCloseTag (tagName) {
      logger.info('handleCloseTag ' + this.sdgKey + ' ' + tagName)
      this.$emit('remove-tag', {
        sdgKey: this.sdgKey,
        tagName
      })
    },

    handleFocusInput () {
      this.$refs['input'].focus()
      this.active = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~ant-design-vue/lib/style/index";

.tag-input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  line-height: @input-height-base;
  text-align: start;
  vertical-align: top;
  color: @text-color;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0 @input-padding-horizontal-base;
  border: @border-width-base solid #d9d9d9;
  outline: 0;

  &:hover {
  border-color: @input-hover-border-color;
  border-right-width: @border-width-base !important;
}

  .tag-input-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .tag-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;

      .tag-input {
        display: inline-block;
        input {
          border: none;
          outline: none;
          height: @input-height-base;
          border-radius: @border-radius-base;
          position: relative;
          display: inline-block;
          width: 100%;
          padding: @input-padding-vertical-base 0;
          color: @input-color;
          font-size: @font-size-base;
          line-height: @line-height-base;
          background-color: @input-bg;
          background-image: none;
          border: none;
          &:focus,
          &:active {
            border: none;
            outline: none;
          }
        }
      }
    }
  }
}

.active {
  border-right-width: @border-width-base !important;
  outline: 0;
  box-shadow: @input-outline-offset @outline-blur-size @outline-width fade(@outline-color, 20%);
}

</style>

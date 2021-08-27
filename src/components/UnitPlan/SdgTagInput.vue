<template>
  <div>
    <div :class="{'tag-input-wrapper': true, 'active': active, 'tag-dom': true}" @click="handleFocusInput">
      <div class="tag-input-list tag-dom">
        <div class="tag-list tag-dom">
          <div class="tag-item tag-dom" v-for="(tag,index) in selectedKeywords" :key="index">
            <a-tag closable @close="handleCloseTag(tag)" class="tag-dom input-tag-item">
              {{ tag.name }}
            </a-tag>
          </div>
          <div class="tag-input tag-dom ">
            <input
              type="text"
              placeholder="Enter key words"
              @keyup.enter="handleAddTag"
              @blur="active = false"
              @search="searchTag"
              @keyup="searchTag"
              v-model="inputValue"
              :style="{width: inputWidth}"
              ref="input"
              class="tag-dom"/>
          </div>
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        </div>
      </div>
    </div>
    <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
      <!--      skt-tag-list-->
      <a-row>
        <a-col offset="0" span="24">
          <div class="skt-tag-list">
            <div class="skt-tag-item" v-for="(tag,index) in tagSearchList" :key="index" >
              <a-tag
                draggable="true"
                @click="selectChooseTag(tag)"
                class="tag-item">
                {{ tag.name }}
              </a-tag>
            </div>
            <div class="skt-tag-create-line" @click="handleCreateTagByInput" v-show="tagSearchList.length == 0 && createTagName && createTagName.length >= 1">
              <div class="create-tag-label">
                Create
              </div>
              <div class="create-tag">
                <a-tag class="tag-item">
                  {{ createTagName }}
                </a-tag>
                <!--                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>-->
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>

</template>

<script>
import * as logger from '@/utils/logger'
import { getAction } from '../../api/manage'
import { scenarioAPIUrl } from '../../api/scenario'

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
      fetching: false,
      lastFetchId: 0,
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
      active: false,
      createTagName: '',
      tagSearchList: []
    }
  },
  computed: {
    inputWidth () {
      const value = this.inputValue || ''
      const length = value.trim().length * 20 + 22
      return (length > 100 ? length : 100) + 'px'
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
            tagName: tagName
          })
        } else {
          logger.info('skip! input value ' + tagName + ' exist in', this.selectedKeywords)
        }
      } else {
        logger.info('skip! input value empty')
      }
      this.inputValue = ''
    },
    searchTag () {
      logger.info('tag searchTag', this.inputValue)
      this.createTagName = this.inputValue
      const searchKey = this.inputValue
      this.tagSearchList = []
      if (searchKey.length < 3) {
        return
      }
      this.fetching = true
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      getAction(scenarioAPIUrl.ScenarioSearchKey, ({ keywords: searchKey })).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        if (res.success) {
          res.result.forEach((record) => {
            this.tagSearchList.push({
              id: record.id,
              name: record.name
            })
          })
        }
        this.fetching = false
      })
    },
    reset () {
      this.createTagName = ''
      this.tagSearchList = []
      this.inputValue = ''
    },
    selectChooseTag (tag) {
      if (this.selectedKeywords.filter(item => item.name === tag.name).length === 0) {
        this.$emit('add-tag', {
          sdgKey: this.sdgKey,
          tagName: tag.name
        })
        this.reset()
      } else {
        logger.info('skip! input value ' + tag.name + ' exist in', this.selectedKeywords)
      }
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
    },
    handleCreateTagByInput () {
      this.handleAddTag()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~ant-design-vue/lib/style/index";

.skt-tag-wrapper {
  .skt-tag-list {
    padding: 5px 10px;
    background: #FAFAFA;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .skt-tag-item {
      margin: 8px 10px 8px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;

      .tag-item {
        cursor: pointer;
        border-radius: 10px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding-bottom: 3px;
        font-size: 15px;
        /*border: 1px solid #D8D8D8;*/
        box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
        opacity: 1;
        border-radius: 6px;
        background-color: rgba(21, 195, 154, 0.1);
        color: #15c39a;
        border: 1px solid #15c39a;
      }
    }

    .skt-tag-create-line {
      cursor: pointer;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      /*padding: 5px 0;*/

      .create-tag-label {
        font-size: 14px;
        padding-right: 10px;
        font-family: Inter-Bold;
        color: #11142D;
      }

      .create-tag {
        display: flex;
        flex-direction: row;
        align-items: center;

        .tag-item {
          cursor: pointer;
          border-radius: 25px;
          word-break: normal;
          width: auto;
          display: inline;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding-bottom: 3px;
          font-size: 15px;
          background-color: rgba(21, 195, 154, 0.1);
          color: #15c39a;
          border: 1px solid #15c39a;
        }

        i {
          font-size: 18px;
          color: @text-color-secondary;
        }
      }
    }
  }
}

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
    min-height: 40px;

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

.input-tag-item {
  border-radius: 26px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #D8D8D8;
  font-size: 12px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
}

</style>

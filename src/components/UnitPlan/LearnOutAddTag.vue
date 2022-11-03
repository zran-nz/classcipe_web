<template>
  <div class="add-tag">
    <div style="font-family: Inter-Bold">
      {{ knowledge.name }}
    </div>
    <div class="tag-select-wrapper" v-show="tags.length">
      <!--      skt-tag-list-->
      <a-row>
        <a-col offset="0" span="24">
          <div class="skt-tag-list">
            <div class="skt-tag-item " v-for="name in tags" :key="name">
              <!--              <a-tooltip :title="tag.parentName">-->
              <a-tag
                :closable="true"
                @close="closeTag(name)"
                class="tag-item">
                {{ name }}
              </a-tag>
              <!--              </a-tooltip>-->
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-spin v-show="tagLoading" class="spin-loading"/>

    <a-row>
      <a-col>
        <div class="tag-search-input">
          <a-input-search
            v-model="inputTag"
            size="large"
            placeholder="Search tag"
            class="search-input"
            @keyup.enter.native="handleKeyup"
            @search="searchTag"
            @keyup="searchTag"/>
        </div>
      </a-col>
    </a-row>

    <div class="skt-tag-wrapper" v-show="tagSearchList.length || inputTag">
      <!--      skt-tag-list-->
      <a-row>
        <a-col offset="0">
          <div class="skt-tag-list">
            <div class="triangle"></div>
            <div class="search-tag-wrapper tag-wrapper">
              <div class="skt-tag-item" v-for="name in tagSearchList" :key="name">
                <a-tag
                  draggable="true"
                  @click="selectChooseTag(name)"
                  :class="{'tag-item':true,'tag-disable':tags.indexOf(name) > -1}">
                  {{ name }}
                </a-tag>
              </div>
            </div>
            <div class="create-tag-wrapper tag-wrapper">
              <div
                class="skt-tag-create-line"
                @click="handleCreateTagByInput"
                v-show="!tagIsExist(inputTag,tagSearchList) && inputTag && inputTag.length >= 1">
                <div class="create-tag-label">
                  Create
                </div>
                <div class="create-tag">
                  <a-tag class="created-tag-item">
                    {{ inputTag }}
                  </a-tag>
                  <!--                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>-->
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="hot-select-wrapper" v-if="!contentLoading" v-show="!inputTag">
      <a-row>
        <a-col offset="0" span="24">
          <div class="title">Hot</div>
          <div class="skt-tag-list">
            <div class="skt-tag-item" v-for="(name,index) in hotList" :key="index">
              <a-tag
                @click="addTag(name)"
                :class="{'tag-item':true,'tag-disable':tags.indexOf(name) > -1}">
                {{ name }}
              </a-tag>
            </div>
          </div>
        </a-col>
        <a-col offset="0" span="24">
          <div class="title">Knowledge</div>
          <div :class="{'skt-tag-list':true, 'hide-some':isHideSome}" ref="knowledgeTagRef">
            <div class="skt-tag-item " v-for="(name,index) in recommendList" :key="index">
              <a-tag
                @click="addTag(name)"
                :class="{'tag-item':true,'tag-disable':tags.indexOf(name) > -1}">
                {{ name }}
              </a-tag>
            </div>
          </div>

          <div class="downUp">
            <a-icon type="double-right" v-if="isHideSome" @click="showAll"/>
            <a-icon type="double-left" v-if="!isHideSome" @click="showAll"/>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-skeleton :loading="contentLoading" active>
    </a-skeleton>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { FindRecommendByKnowledgeId } from '@/api/knowledge'
import { UtilMixin } from '@/mixins/UtilMixin'

const { debounce } = require('lodash-es')

export default {
  name: 'LearnOutAddTag',
  components: {},
  mixins: [UtilMixin],
  computed: {
  },
  props: {
    knowledge: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      tags: this.knowledge.tags ? this.knowledge.tags : [],
      hotList: [],
      recommendList: [],
      tagLoading: false,
      contentLoading: false,
      visible: true,
      inputTag: '',
      tagName: '',
      tagSearchList: [],
      userTags: [],
      isHideSome: true
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    // this.knowledge.tags.forEach(tag => {
    //   this.tags.push(tag)
    // })
    console.info('knowledge ', this.knowledge)
    this.loadRecommendTags()
  },
  watch: {
  },
  methods: {
    handleOk () {
    },
    closeTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.$emit('handle-select-tags', this.tags)
      console.info('handle-select-tags ', this.tags)
    },
    selectChooseTag (tag) {
      this.addTag(tag)
    },
    loadRecommendTags () {
      this.contentLoading = true
      FindRecommendByKnowledgeId({ knowledgeId: this.knowledge.knowledgeId }).then((response) => {
        console.info('loadRecommendTags response', response.result)
        if (response.success) {
          this.hotList = response.result.hots
          this.recommendList = response.result.tags
          this.contentLoading = false
          setTimeout(() => {
            if (this.$refs.knowledgeTagRef.offsetHeight < 200) {
              this.isHideSome = false
            }
          }, 100)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    addTag (tag) {
      if (this.tags.indexOf(tag) === -1) {
        this.tags.push(tag)
      }
      this.$emit('handle-select-tags', this.tags)
      console.info('handle-select-tags ', this.tags)
    },

    handleKeyup () {
      console.info('tag handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.handleCreateTagByInput()
    },

    handleCreateTagByInput () {
      console.info('skill handleCreateTagByInput ' + this.inputTag)
      this.addTag(this.inputTag)
      this.inputTag = ''
    },

    searchTag () {
      console.info('searchTag', this.inputTag)
      const keyword = this.inputTag
      if (!keyword) {
        this.tagSearchList = []
        return
      }
      if (typeof keyword === 'string' && keyword.trim().length >= 3) {
        FindRecommendByKnowledgeId({
          knowledgeId: this.knowledge.knowledgeId,
          key: keyword
        }).then((response) => {
          console.info('searchByDescription', response)
          this.tagSearchList = response.result.tags
        })
      } else {
        this.tagSearchList = []
      }
    },

    handleEnsureSelectData () {
      this.addTagVisible = false
      this.knowledge.tags = this.tags
      this.$emit('remove-learn-outs', this.tags)
    },
    showAll () {
      this.isHideSome = !this.isHideSome
    }
  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

/deep/ .ant-modal-title {
  text-align: center;
}

.add-tag {
  margin: 10px;
  min-height: 400px;

  .tag-select-wrapper {
    margin: 15px 0px 10px 0px;

    .skt-tag-list {
      padding: 5px 10px;
      background-color: #e7f9f5;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
      position: relative;

      .skt-tag-item {
        margin: 8px 10px 8px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;

        .tag-item {
          font-family: Inter-Bold;
          color: #15C39A;
          cursor: pointer;
          border-radius: 10px;
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding: 4px;
          font-size: 14px;
          border: 1px solid #D8D8D8;
          -webkit-box-shadow: 0px 6px 10px rgb(91 91 91 / 16%);
          box-shadow: 0px 6px 10px rgb(91 91 91 / 16%);
          opacity: 1;
          border-radius: 10px;
          background-color: rgba(21, 195, 154, 0.1);
          border: 1px solid #15c39a;
        }
      }
    }
  }

  .hot-select-wrapper {
    margin: 15px 0px 10px 0px;

    .title {
      width: 100%;
      height: 18px;
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      line-height: 20px;
      color: #11142D;
      opacity: 1;
    }

    .downUp{
      height: 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      font-size: 20px;
      transform: rotate(
        90deg);
      -ms-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -webkit-transform: rotate(
        90deg);
    }

    .skt-tag-list {
      padding: 5px 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;

      &.hide-some{
        overflow: hidden;
        max-height: 200px;
        margin-bottom: 30px;
      }

      .skt-tag-item {
        margin: 8px 10px 8px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;

        .tag-item {
          font-family: Inter-Bold;
          color: #15C39A;
          cursor: pointer;
          border-radius: 10px;
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding: 4px;
          font-size: 14px;
          border: 1px solid #D8D8D8;
          -webkit-box-shadow: 0px 6px 10px rgb(91 91 91 / 16%);
          box-shadow: 0px 6px 10px rgb(91 91 91 / 16%);
          opacity: 1;
          border-radius: 10px;
          background-color: rgba(21, 195, 154, 0.1);
          border: 1px solid #15c39a;
        }

        .tag-disable {
          color: rgba(0, 0, 0, .25);
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          text-shadow: none;
          box-shadow: none;
          cursor: not-allowed;
        }
      }
    }
  }

  .skt-tag-wrapper {
    margin-top: 10px;

    .skt-tag-list {
      border: 1px solid #D8D8D8;
      padding: 20px 10px 5px 10px;
      background: rgba(21, 195, 154, 0.1);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
      position: relative;

      .triangle {
        position: absolute;
        top: -20px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid #eee;
      }

      .tag-wrapper {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px;
        background: rgba(21, 195, 154, 0.1);

        .create-tag {
          margin-right: 5px;

          .created-tag-item {
            cursor: pointer;
            margin: 0 3px;
            padding: 3px 6px;
            border-radius: 18px;
            font-family: Inter-Bold;
            background-color: rgba(21, 195, 154, 0.1);
            color: rgba(21, 195, 154, 1);
            border: 1px solid rgba(21, 195, 154, 1);
          }
        }

        .tag-item {
          background-color: rgba(21, 195, 154, 1);
          color: #fff;
          padding: 3px 6px;
          cursor: pointer;

          .tag-icon {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              padding-right: 3px;
              height: 12px;
            }

            img.search-icon {
              height: 10px;
            }
          }
        }
      }

      .create-tag-wrapper {
        //background-color: rgba(250, 250, 250, 1);
        padding: 0 10px;
        width: 100%;
      }

      .skt-tag-item {
        margin: 5px 10px 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;

        .tag-item {
          cursor: pointer;
          border-radius: 28px;
          padding-left: 10px;
          padding-right: 10px;
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding-bottom: 3px;
        }

        .tag-disable {
          color: rgba(0, 0, 0, .25);
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          text-shadow: none;
          box-shadow: none;
          cursor: not-allowed;
        }

      }

      .skt-tag-create-line {
        cursor: pointer;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 0;

        &:hover {
          background: rgba(0, 0, 0, 5%)
        }

        .create-tag-label {
          cursor: pointer;
          font-size: 14px;
          padding-right: 5px;
          padding-left: 5px;
          color: #000;
        }

        .create-tag {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }

  .tag-search-input {
    margin-top: 20px;

    .browse {
      padding: 10px 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border-radius: 6px;
    }

    .btn-icon {
      height: 18px;
      width: 18px;
    }

    .btn-text {
      padding: 0 5px;
    }
  }

  .spin-loading {
    margin-top: 50px;
    margin-left: 40%;
  }

  /deep/ .anticon-close {
    color: rgba(239, 78, 78, 1);
  }

  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

}

</style>

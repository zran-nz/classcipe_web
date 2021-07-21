<template>
  <div class="custom-tag">
    <div>
      <a-card title="Customized tags" style="width: 800px">
        <a slot="extra" href="#" @click="handleSetting">Tags setting <a-icon type="edit" /></a>

        <div class="skt-tag-wrapper" v-show="tagList.length || createTagName">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" span="24">
              <div class="skt-tag-list">
                <div class="skt-tag-item" v-for="(tag,index) in tagList" :key="index" >
                  <a-tag
                    :closable="tagIndex == index"
                    @click="selectTag(index)"
                    @close="closeTag(tag)"
                    :color="tagIndex == index ? 'orange': 'green'"
                    class="tag-item">
                    {{ tag.name }}
                  </a-tag>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-row>
          <a-col offset="0" span="20">
            <div class="knowledge-tag-search-input">
              <a-input-search v-model="inputTag" placeholder="input search text" class="search-input" @search="handleKeyup" @keyup="handleKeyup" />
            </div>
          </a-col>
        </a-row>

        <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" span="24">
              <div class="skt-tag-list">
                <div class="skt-tag-item" v-for="(tag,index) in tagSearchList" :key="index" >
                  <a-tag
                    :closable="tagIndex == index"
                    @click="selectTag(index)"
                    @close="closeTag(tag)"
                    :color="tagIndex == index ? 'orange': 'green'"
                    class="tag-item">
                    {{ tag.name }}
                  </a-tag>
                </div>
                <div class="skt-tag-create-line" v-show="createTagName && createTagName.length >= 1">
                  <div class="create-tag-label">
                    Create
                  </div>
                  <div class="create-tag">
                    <a-tag class="tag-item">
                      {{ createTagName }}
                    </a-tag>
                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
      <br />
    </div>

    <a-modal v-model="settingVisible" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <skill-browser />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import SkillBrowser from '@/components/SkillLibrary/SkillBrowser'
const { SkillSearch } = require('@/api/skill')
const { debounce, sortBy } = require('lodash-es')

export default {
  name: 'CustomTag',
  components: {
    SkillBrowser
  },
  props: {
    selectedSkillTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      visible: true,
      settingVisible: false,
      inputTag: '',
      tagIndex: -1,
      createTagName: '',
      tagSearchList: [],
      tagList: [{ name: 'test1', id: '1' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }, { name: 'test2', id: '2' }]
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
  },
  watch: {

  },
  methods: {
    handleOk () {
    },
    handleCancel () {
      this.visible = false
    },
    handleSetting () {
      this.settingVisible = true
    },
    closeTag (e) {
      this.$message.success('Remove label successfully')
    },
    selectTag (index) {
      if (this.tagIndex === index) {
        this.tagIndex = -1
        return
      }
      this.tagIndex = index
    },
    handleCreateTagByInput () {

    },
    tagColor (index) {
      if (index === this.tagIndex) {
        return 'green'
      } else {
        return '108ee9'
      }
    },

    handleKeyup () {
      this.$logger.info('skill handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
    },

    searchKnowledge (keyword) {
      logger.info('skill searchKnowledge', keyword)
      this.searchList = []
      if (typeof keyword === 'string' && keyword.trim().length >= 1) {
        SkillSearch({
          key: keyword
        }).then((response) => {
          logger.info('skill searchKnowledge response', response)
          this.searchList = response.result
        })
      }
    }

  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.custom-tag {
  .skt-tag-wrapper {
    .skt-tag-list {
      padding: 5px 10px;
      border: 1px dashed #ccc;
      background-color: #fafafa;
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
          border-radius: 10px;
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding-bottom: 3px;
          font-size: 15px
        }
      }

      .skt-tag-create-line {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 0;

        .create-tag-label {
          font-size: 14px;
          padding-right: 10px;
          color: @text-color-secondary;
        }

        .create-tag {
          display: flex;
          flex-direction: row;
          align-items: center;

          .tag-item {
            border-radius: 10px;
            word-break: normal;
            width: auto;
            display: inline;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: hidden;
            padding-bottom: 3px;
            font-size: 15px
          }

          i {
            font-size: 18px;
            color: @text-color-secondary;
          }
        }
      }
    }
  }

  .knowledge-tag-search-input {
    margin-top: 20px;
  }
}

</style>

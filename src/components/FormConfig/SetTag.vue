<template>
  <a-card :loading='loading' :body-style="{'padding': '10px 0', 'border': 'none' }" :bordered="false">
    <div class='set-tag'>
      <div class='tag-list-table'>
        <div class='tag-header'>
          <a-row>
            <a-col span='11' offset='1'>
              <div class='tag-header-item'>Tag Category</div>
            </a-col>
            <a-col span='6'>
              <div class='tag-header-item'>Optional</div>
            </a-col>
            <a-col span='6'>
              <div class='tag-header-item'>Create their own</div>
            </a-col>
          </a-row>
        </div>
        <div class='tag-body'>
          <a-row class='tag-category-item' v-for='tag in tagList' :key='tag.id'>
            <a-col span='1'>
              <a-checkbox :checked='tag.isSelected' @change='handleCheckedChange(tag)'></a-checkbox>
            </a-col>
            <a-col span='11'>
              <div class='tag-body-item tag-name' @click='tag.expand = !tag.expand'>
                <div class='tag-name-item'>
                  <div class='expand-icon'>
                    <a-icon type="plus-square" :style="{'color': '#999'}" v-show='tag.keywords.length || tag.children.length'/>
                  </div>
                  <div class='tag-name-text'>
                    {{ tag.name }}
                  </div>
                </div>
                <div class='tag-detail' v-show='tag.expand'>
                  <template v-if='tag.children && tag.children.length'>
                    <div class='sub-tag' v-for='(tagChild, tcId) in tag.children' :key='tcId'>
                      <div class='sub-tag-title'>{{ tagChild.name }}</div>
                      <a-tag class='tag-keyword' color="#15C39A" v-for='(tkeyword, tkIdx) in tagChild.keywords' :key='tkIdx'>
                        {{ tkeyword }}
                      </a-tag>
                    </div>
                  </template>
                  <template v-if='tag.keywords'>
                    <a-tag class='tag-keyword' color="#15C39A" v-for='(keyword, kIdx) in tag.keywords' :key='kIdx'>
                      {{ keyword }}
                    </a-tag>
                  </template>
                </div>
              </div>
            </a-col>
            <a-col span='6'>
              <a-radio-group :disabled="!tag.isOptional" v-model="tag.isOptional" @change="handleOptionalChange(tag)" class='tag-body-item' v-if='!tag.schoolId'>
                <a-radio :value="true">
                  Yes
                </a-radio>
                <a-radio :value="false">
                  No
                </a-radio>
              </a-radio-group>
              <div class='school-setting' v-if='tag.schoolId'>{{ tag.isOptional ? 'Yes' : 'No' }}</div>
            </a-col>
            <a-col span='6'>
              <a-radio-group class='tag-body-item' :disabled="!tag.createOwn" v-model="tag.createOwn" @change="handleCreateOwnChange(tag)" v-if='!tag.schoolId'>
                <a-radio :value="true">
                  Yes
                </a-radio>
                <a-radio :value="false">
                  No
                </a-radio>
              </a-radio-group>
              <div class='school-setting' v-if='tag.schoolId'>{{ tag.createOwn ? 'Yes' : 'No' }}</div>
            </a-col>
          </a-row>
        </div>
        <div class='tag-action'>
          <a-space>
            <div class='tag-tips'>
              To change settings of tag categories, go to <a href='#' @click='handleGoToTagPage'>Tags page</a>
            </div>
            <a-button type='primary' @click='handleEnsureSelected'>Confirm</a-button>
          </a-space>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>

import { FindCustomTags } from '@/api/tag'

export default {
  name: 'SetTag',
  props: {
    selectedTags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: true,
      tagList: [],
      mustTagNameList: []
    }
  },
  created() {
    this.$logger.info('SetTag created', this.selectedTags)
    this.loadCustomTags()
  },
  methods: {
    loadCustomTags () {
      this.loading = true
      FindCustomTags({}).then((response) => {
        if (response.success) {
          this.mustTagNameList = []
          response.result.recommends.forEach((tag) => {
            if (tag.schoolId) {
              this.mustTagNameList.push(tag.name)
            }
            const selectedTagItem = this.selectedTags.find((selectedTag) => {
              return selectedTag.tagId === tag.id
            })
            tag.expand = false
            tag.tagId = tag.id
            tag.tagName = tag.name
            tag.isSelected = !!selectedTagItem
          })

          this.tagList = response.result.recommends
          this.$logger.info('FindCustomTags tagList', this.tagList)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleCheckedChange (tag) {
      this.$logger.info('handleCheckedChange tag', tag)
      tag.isSelected = !tag.isSelected
    },

    handleOptionalChange (tag) {
      this.$logger.info('handleOptionalChange tag', tag)
    },

    handleCreateOwnChange (tag) {
      this.$logger.info('handleCreateOwnChange tag', tag)
    },

    handleCancel () {
      this.$emit('close')
    },

    handleEnsureSelected () {
      this.$logger.info('handleEnsureSelected tagList', this.tagList)
      this.$emit('update', this.tagList.filter((tag) => {
        return tag.isSelected
      }))
    },

    handleGoToTagPage () {
      this.$emit('go-to-tag-page')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.set-tag {
  margin-top: 10px;
}

.tag-header {
  padding: 8px 0;
  background-color: #f1f1f1;
  font-size: 14px;
  color: #000;
  user-select: none;
  cursor: pointer;
}

.tag-body {
  max-height: 350px;
  overflow-y: scroll;
  box-shadow: inset 0 0 3px 3px #fff;
  user-select: none;

  .tag-category-item {
    padding: 8px 5px;
    cursor: pointer;

    &:hover {
      background-color: rgba(21, 195, 154, 0.2);
    }
    .tag-body-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .tag-name {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .tag-name-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .expand-icon {
          width: 15px;
        }

        .tag-name-text {
          padding-left: 3px;
          font-size: 13px;
          color: #111;
        }

        &:hover {
          .tag-name-text {
            color: #15C39A;
          }
        }
      }

      .tag-detail {
        padding-left: 18px;
        .tag-keyword {
          margin-top: 4px;
          margin-bottom: 4px;
          font-size: 13px;
        }
      }
    }
  }
}

.tag-action {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .tag-tips {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    font-size: 13px;
    color: #999;

    a {
      padding: 0 5px;
    }
  }
}

.my-tag-selected {
  border-radius: 22px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .my-tag-selected-name {
    padding-left: 3px;
  }
}

.sub-tag {
  margin-top: 10px;
  .sub-tag-title {
    font-weight: bold;
  }
}

</style>

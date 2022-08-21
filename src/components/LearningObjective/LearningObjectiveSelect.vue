<template>
  <div class='learning-objective'>
    <div class='half-body-content'>
      <div class='cc-lo-content'>
        <div class='cc-lo-title'>
          Subject Learning Objectives
        </div>
      </div>
    </div>
    <div class='full-body-content'>
      <div class='cc-lo-list'>
        <div v-for='(item, idx) in allLearningObjectiveList' :key='idx' class='cc-lo-item'>
          <div class='cc-left-lo'>
            <div class="item-desc-wrapper">
              <template v-if='selectedList.indexOf(item) !== -1'>
                <div class='item-desc' v-selectPopover="['modal', domFn, item, true]">
                  {{ item.desc }}
                </div>
              </template>
              <template v-else>
                <div class='item-desc not-popover'>
                  {{ item.desc }}
                </div>
              </template>
              <div class='item-subject-year'>
                <div class='item-sub-title' :title='item.path && item.path[0]'>{{ item.path && item.path[0] }}</div>
                <div class='item-sub-title' :title='item.path && item.path[yearIndex]'>{{ item.path && item.path[yearIndex] }}</div>
              </div>
              <div class='select-wrapper'>
                <a-checkbox :checked='selectedList.indexOf(item) !== -1' @click.native.stop='handleSelectItem(item)'>
                </a-checkbox>
              </div>
            </div>
            <div class="item-bloom-wrapper" :style="{'cursor': selectedList.indexOf(item) === -1 ? 'not-allowed !important': 'default'}">
              <div class="bloom-wrapper">
                <label for="">Bloom's Taxonomy:</label>
                <rate-level @change="val => handleChangeLevel(val, item)" :bloom="item.bloomTag || ''"/>
              </div>
              <div class="bloom-wrapper">
                <label for="">Knowledge Dimensions:</label>
                <rate-level @change="val => handleChangeLevel(val, item)" :knowledge="item.knowledgeDimension || ''" />
              </div>
            </div>
            <div class="item-command-wrapper" v-if="item.commandTerms && item.commandTerms.length > 0" :style="{'cursor': selectedList.indexOf(item) === -1 ? 'not-allowed': 'default'}">
              <label for="">Command Term:</label>
              <div class="wrapper-list">
                <div
                  class='wrapper-list-item'
                  v-for='(terms, termIndex) in item.commandTerms'
                  :key='terms.name'>
                  <a-tag closable class='command-tag' @close="e => handleCloseObjectiveTag(item, 'commandTerms', termIndex)">
                    <div class='tag-content'>{{ terms.name }}</div>
                  </a-tag>
                </div>
              </div>
            </div>
            <div class="item-command-wrapper" v-if="item.knowledgeTags && item.knowledgeTags.length > 0" :style="{'cursor': selectedList.indexOf(item) === -1 ? 'not-allowed': 'default'}">
              <label for="">Knowledge tag:</label>
              <div class="wrapper-list">
                <div
                  class='wrapper-list-item'
                  v-for='(terms, termIndex) in item.knowledgeTags'
                  :key='terms.name'>
                  <a-tag closable class='command-tag knowledge' @close="e => handleCloseObjectiveTag(item, 'knowledgeTags', termIndex)" >
                    <div class='tag-content'>{{ terms.name }}</div>
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
          <div class='cc-right-general-capabilities'>
            <div class='cc-right-general-capabilities-title'>
            </div>
            <div class='cc-right-general-capabilities-content'>
              <div class='capability-item' v-for='(capability, sIdx) in item.generalCapabilities' :key='sIdx'>
                <div class='capability-item-tag'>
                  <div class='tag-icon'>
                    <a-icon type="tag" />
                  </div>
                  <div class='item-tag-name' v-for='(path, pIdx) in capability.path' :key='path' :title='path'>
                    <template v-if='pIdx < capability.path.length && pIdx > 0'> / </template>
                    {{ path }}
                  </div>
                </div>
                <div class='capability-item-content'>
                  {{ capability.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-clickOutside id="modal" ref="quickModal" v-show="false">
      <div class="quick-keyword-con" >
        <a-space>
          <label>Set </label>
          <quick-word-button
            type="black"
            text="Command term"
            @sub="res => handleQuickWordSet(res, 'commandTerms')"
            :quickWord="quickWord"
            :loadApi="termsSearch"
            :cacheApi="termsPubList"
            cacheKey="TERMS_PUBLIST"
            @changeWord="res => this.commandTermForm.name = res"
          >
            <template v-slot:create>
              <div class="quick-word-sub">
                <a-divider style="margin: 10px 0;"/>
                <a-space v-show="!showQuickWordCreate" >
                  <label>Create:</label>
                  <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="createCommandTerm"> {{ commandTermForm.name || 'Command term' }} </a-button>
                </a-space>
              </div>
            </template>
          </quick-word-button>
          <label> or </label>
          <quick-word-button
            type="black"
            text="Knowledge tag"
            @sub="res => handleQuickWordSet(res, 'knowledgeTags')"
            :quickWord="quickWord"
            :loadApi="dimensionsSearch"
            :cacheApi="dimensionsPubList"
            cacheKey="DIMENSIONS_PUBLIST"
            @changeWord="res => this.commandTermForm.name = res"
          >
            <template v-slot:create>
              <div class="quick-word-sub">
                <a-divider style="margin: 10px 0;"/>
                <a-space v-show="!showQuickWordCreate" >
                  <label>Create:</label>
                  <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="createDimension"> {{ commandTermForm.name || 'Knowledge Tags' }} </a-button>
                </a-space>
              </div>
            </template>
          </quick-word-button>
        </a-space>
        <div class="recommend-con" v-if="termRecommend.length > 0 || knowledgeRecommend.length > 0">
          <label for="">Recommended</label>
          <div class="recommend-tag">
            <div
              class='wrapper-list-item'
              v-for='(terms, termIndex) in termRecommend'
              :key='termIndex'>
              <a-tag class='command-tag' @click="handleAddRecommend(terms, 'commandTerms')">
                <div class='tag-content'>{{ terms }}</div>
              </a-tag>
            </div>
            <div
              class='wrapper-list-item'
              v-for='(terms, termIndex) in knowledgeRecommend'
              :key='termIndex'>
              <a-tag class='command-tag knowledge' @click="handleAddRecommend(terms, 'knowledgeTags')">
                <div class='tag-content'>{{ terms }}</div>
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import { KnowledgeTermTagQueryByKeywords } from '@/api/knowledgeTermTag'
import { termsSearch, dimensionsSearch, dimensionsPubList, termsPubList, termsCreate, dimensionsCreate } from '@/api/v2/tagsTerm'
import { getRecommend, addToSetTerms, incBloom } from '@/api/v2/statsTarget'
import { GetDictItems } from '@/api/common'
import DeleteIcon from '@/components/Common/DeleteIcon'
import RecommendData from '@/components/LearningObjective/RecommendData'
import RateLevel from '@/components/RateLevel'
import CommandTermAdd from '@/components/CommandTerm/CommandTermAdd.vue'
import QuickWordButton from '@/components/Button/QuickWordButton'
import { DICT_BLOOM_TAXONOMY, DICT_KNOWLEDGE_DIMENSION } from '@/const/common'

export default {
  name: 'LearningObjectiveSelect',
  components: {
    RecommendData,
    DeleteIcon,
    CustomTextButton,
    RateLevel,
    CommandTermAdd,
    QuickWordButton
  },
  props: {
    learningObjectives: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: null,
      yearIndex: null,

      languageOptions: [
        'Arabic', 'Auslan', 'Chinese', 'French', 'German', 'Hindi', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Modern Greek', 'Spanish', 'Turkish', 'Vietnamese', 'English as second language', 'Urdu', 'Malay', 'Maori'
      ],

      selectedSubject: null,
      selectedYear: null,
      selectedLanguage: null,
      showFilterList: false,

      selectedList: [],
      allLearningObjectiveList: [],
      asyncUpdateFilterListFn: null,
      recommendDataVisible: false,

      KnowledgeTermTagQueryByKeywords: KnowledgeTermTagQueryByKeywords,
      termsSearch: termsSearch,
      dimensionsSearch: dimensionsSearch,
      dimensionsPubList: dimensionsPubList,
      termsPubList: termsPubList,
      quickWord: '',
      commandTerms: [],
      knowledgeTags: [],
      showQuickWordCreate: false,
      currentObjective: null,
      commandTermForm: {
        name: ''
      },
      termRecommend: [],
      knowledgeRecommend: [],
      bloomTagLevel: [],
      knowledgeDimensionLevel: [],

      cachedCurriculum: {}
    }
  },
  watch: {
    selectedList: {
      deep: true,
      immediate: false,
      handler() {
        this.updateSelectLearningObjective()
      }
    },
    learningObjectives: {
      deep: true,
      immediate: false,
      handler(newValue) {
        this.allLearningObjectiveList = newValue
      }
    }
  },
  created() {
    this.$logger.info('LearningObjectiveSelect', this.learningObjectives)
    if (this.learningObjectives.length > 0) {
      this.allLearningObjectiveList = this.learningObjectives
      this.selectedList = this.allLearningObjectiveList.slice()
    }
    this.initDict()
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  methods: {
    handleClick () {
      this.showFilterList = false
    },

    updateSelectLearningObjective () {
      this.$logger.info('change', this.selectedList)
      this.$emit('change', this.selectedList)
    },

    handleSelectGeneralCapability (item) {
      this.$logger.info('handleSelectGeneralCapability', arguments[1])
      const generalCapabilityList = JSON.parse(JSON.stringify(arguments[1][0]))
      const lastIndex = generalCapabilityList.length - 1
      const generalCapability = {
        desc: generalCapabilityList[lastIndex],
        path: generalCapabilityList.slice(-3, -1),
        id: arguments[1][1][lastIndex].id
      }
      item.generalCapabilities.push(generalCapability)
      this.$logger.info('current lo item', item)
    },

    initDict() {
      Promise.all([
        GetDictItems(DICT_BLOOM_TAXONOMY),
        GetDictItems(DICT_KNOWLEDGE_DIMENSION)
      ]).then(([bloomRes, knowledgeRes]) => {
        if (bloomRes.success) {
          this.bloomTagLevel = bloomRes.result
        }
        if (knowledgeRes.success) {
          this.knowledgeDimensionLevel = knowledgeRes.result
        }
      })
    },

    handleChangeLevel(val, tag) {
      console.log(val, tag)
      if (this.selectedList.indexOf(tag) !== -1) {
        if (val) {
          const origin = tag[val.type]
          const originLevel = this.getLevel(val.type, origin)
          tag[val.type] = val.title
          this.$set(tag, val.type, val.title)
          this.$forceUpdate()
          // 上报
          if (tag.id) {
            const currentLevel = this.getLevel(val.type, val.title)
            const params = {
              [`bloom.${currentLevel - 1}`]: 1
            }
            if (originLevel > 0) {
              params[`bloom.${originLevel - 1}`] = -1
            }
            console.log(params)
            incBloom(tag.id, params)
          }
        }
      }
    },

    getLevel(type, title) {
      const levelObj = this[type + 'Level'].find(bloom => bloom.text === title)
      return levelObj ? parseInt(levelObj.value) : 0
    },

    handleSelectItem (item) {
      this.$logger.info('handleSelectItem', item)
      const index = this.selectedList.indexOf(item)
      if (index === -1) {
        this.selectedList.push(item)
      } else {
        this.selectedList.splice(index, 1)
      }
    },

    domFn(key, currentChoose) {
      this.currentObjective = { ...currentChoose }
      console.log(this.currentObjective)
      this.quickWord = key ? key.split(' ')[0] : ''
      this.commandTermForm.name = this.quickWord
      this.showQuickWordCreate = false
      // 获取联想
      if (currentChoose.id) {
        getRecommend(currentChoose.id).then(res => {
          this.termRecommend = res.terms
          this.knowledgeRecommend = res.tags
        })
      }
    },

    handleCloseObjectiveTag(item, key, tagIndex) {
      if (this.selectedList.indexOf(item) !== -1) {
        item[key].splice(tagIndex, 1)
        console.log(item)
        this.$forceUpdate()
      }
    },

    handleQuickWordSet(res, key) {
      console.log(res)
      console.log(this.currentObjective)
      setTimeout(() => {
        this.$refs.quickModal.style.display = 'none'
      }, 200)
      const find = this.allLearningObjectiveList.find(item => {
        if (this.currentObjective.id) {
          return item.id === this.currentObjective.id
        } else {
          return item.desc === this.currentObjective.desc
        }
      })
      if (find) {
        if (find[key]) {
          if (!find[key].find(item => item.name === res.word)) {
            find[key].push({
              id: res.id,
              name: res.word
            })
          }
        } else {
          this.$set(find, key, [{
            id: res.id,
            name: res.word
          }])
          // 上报
          if (this.currentObjective.id) {
            const params = {}
            if (key === 'commandTerms') {
              params.terms = res.word
            }
            if (key === 'knowledgeTags') {
              params.tags = res.word
            }
            addToSetTerms(this.currentObjective.id, params)
          }
        }
      }
    },
    handleSaveCommanTerm(res, key = 'commandTerms') {
      console.log(res)
      this.handleQuickWordSet(res, key)
      this.showQuickWordCreate = false
    },
    handleAddRecommend(res, key = 'commandTerms') {
      this.handleSaveCommanTerm({
        word: res,
        id: res
      }, key)
    },
    createCommandTerm() {
      termsCreate({
        tag: this.commandTermForm.name || 'Command term'
      }).then(res => {
        this.handleSaveCommanTerm({
          word: res.tag,
          id: res._id
        })
      })
    },
    createDimension() {
      dimensionsCreate({
        tag: this.commandTermForm.name || 'Knowledge Tags'
      }).then(res => {
        this.handleSaveCommanTerm({
          word: res.tag,
          id: res._id
        }, 'knowledgeTags')
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective {

  .half-body-content {
    width: 50%;
    .cc-lo-header {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;

      .filter-line {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        .select-item {
          margin-right: 15px;

          .selected-label {
            margin-top: 15px;
            .selected-label-item {

              .tag-content {
                display: inline-block;
                max-width: 120px;
                text-overflow: ellipsis;
                word-break: break-word;
                user-select: none;
                overflow: hidden;
              }

              .ant-tag {
                margin-bottom: 15px;
              }

              .label-curriculum, .label-subject, .label-year, .label-language{
                max-width: 150px;
                border: none;
                cursor: pointer;
                padding: 0 10px;
                border-radius: 26px;
                line-height: 30px;
                font-family: Arial;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .label-curriculum {
                background: #C8F3FF;
                color: #255E77;
              }

              .label-subject {
                background: #E6E4FF;
                color: #4F58BD;
              }

              .label-year {
                background: #FFEDAF;
                color: #734110;
              }

              .label-language {
                background: #15C3A4;
                color: #ffffff;
              }
            }
          }
        }
      }

      .cc-lo-select {
        width: 100px;
      }

      .cc-lo-select-mid {
        width: 80px;
      }

      .cc-lo-select-small {
        width: 60px;
      }
    }

    .cc-lo-content {

      .cc-lo-title {
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #FF786D;
        line-height: 25px;
      }

      .cc-lo-input {
        margin-top: 5px;
        position: relative;

        .filter-list {
          background-color: #fff;
          position: absolute;
          z-index: 4000;
          left: 0;
          right: 0;
          top: 40px;
          max-height: 300px;
          overflow-y: auto;
          border-radius: 4px;
          box-shadow: 0 0 3px 3px #f1f1f1;

          .filter-item {
            color: rgb(4, 28, 68);
            padding: 10px 10px 10px 20px;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &:hover {
              background-color: #14C39A12;
              color: #15C39A;
            }

            .item-desc {
              padding-right: 10px;
              cursor: pointer;
              user-select: none;
            }

            .item-subject-year {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;

              .item-sub-title {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                margin-right: 10px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
              }
            }
          }
        }

        .create-item {
          position: absolute;
          right: 5px;
          top: 4px;
        }
      }
    }
  }

  .full-body-content {
    .cc-lo-list {
      margin-top: 15px;
      z-index: 1;

      .cc-lo-item {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 15px;
        .cc-left-lo {
          width: 50%;
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          .item-desc-wrapper {
            background: #FAFAFA;
            border: 1px solid #E1E6ED;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            color: #313234;
            font-family: Arial;
            cursor: pointer;
            border-radius: 4px;
            padding: 10px 10px 10px 20px;
            font-weight: 400;
            .item-desc {
              padding-right: 10px;
            }

            .item-subject-year {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;

              .item-sub-title {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                margin-right: 10px;
                font-weight: bold;
                color: #111;
                cursor: pointer;
                user-select: none;
              }
            }
          }

          .item-bloom-wrapper {
            margin-top: 20px;
            display: flex;
            padding-left: 8px;
            .bloom-wrapper {
              font-size: 10px;
              font-family: Arial;
              font-weight: bold;
              color: #191A1C;
              margin-right: 50px;
              display: flex;
              align-items: center;
              label {
                margin-right: 5px;
              }
            }
          }

          .item-command-wrapper {
            display: flex;
            align-items: center;
            padding-left: 8px;
            margin-top: 24px;
            label {
              font-size: 10px;
              font-family: Arial;
              font-weight: bold;
              color: #191A1C;
              width: 100px;
            }
            .wrapper-list {
              margin-left: 10px;
              display: flex;
              flex-wrap: wrap;
              flex: 1;
              .wrapper-list-item {
                margin-bottom: 5px;

              }
            }
          }

          .select-wrapper {
            position: absolute;
            left: -23px;
            width: 30px;
            top: 50%;
            margin-top: -10px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }
        }

        .cc-right-general-capabilities {
          width: 50%;
          padding-left: 30px;

          .cc-right-general-capabilities-title {
            width: 200px;
            position: relative;

            .cc-gc-cascader {
              position: absolute;
              left: 15px;
              top: 0;
              width: 170px;
              opacity: 0;
            }
          }

          .cc-right-general-capabilities-content {
            .capability-item {
              margin-bottom: 15px;

              .capability-item-tag {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-start;
                line-height: 25px;
                padding-bottom: 5px;
                cursor: pointer;
                font-weight: bold;
                color: #999;

                .item-tag-name {
                  padding: 0 5px;
                  overflow-x: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                }
              }

              .capability-item-content {
                background: #fff;
                position: relative;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                padding: 10px 30px 10px 10px;
                position: relative;
                color: #000000;
                border: 1px solid #f1f1f1;
                box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);
              }
            }
          }
        }
      }
    }
  }
}

.quick-keyword-con {
  border: 1px solid #dfdfdf;
  background: #fff;
  padding: 5px 10px;
  // width: 330px;
}
.recommend-con {
  position: relative;
  margin-top: 10px;
  & > label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .recommend-tag {
    display: flex;
    width: 300px;
    flex-wrap: wrap;
    .wrapper-list-item {
      margin-bottom: 5px;
      .command-tag {
        line-height: 25px;
      }
    }
  }

}

.command-tag {
  max-width: 150px;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 26px;
  line-height: 30px;
  font-family: Arial;
  font-weight: 400;
  background: #06ACD7;
  display: flex;
  align-items: center;
  justify-content: center;
  .tag-content {
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    word-break: break-word;
    user-select: none;
    overflow: hidden;
    color: #fff;
  }
  /deep/ i {
    color: #fff
  }
  &.knowledge {
    background: #EABA7F;
  }
}
</style>

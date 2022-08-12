<template>
  <div class='content-filter'>
    <div class='filter-line'>
      <a-space>
        <div class="my-search">
          <custom-search-input
            @search='triggerSearch'
            :value.sync='searchKey'
            placeholder="Search" />
        </div>
        <div class="filter-icon" @click.stop="showFilter = !showFilter">
          <div class="filter-item">
            <filter-icon class="filter-icon" />
            <filter-active-icon class="filter-active-icon"/>
          </div>
        </div>
      </a-space>
    </div>
    <div v-if="showFilter" @click.stop='' class='filter-wrapper'>
      <div class='template-select-header'>
        <div class='group-filter'>
          <a-radio-group v-model='filterType' button-style='solid' @change='changeFilterType'>
            <a-radio-button :value='1'>
              Learning Experience
            </a-radio-button>
            <a-radio-button :value='2'>
              Assessment
            </a-radio-button>
            <a-radio-button :value='3'>
              21st Century Skills
            </a-radio-button>
            <a-radio-button :value='4'>
              5E model
            </a-radio-button>
          </a-radio-group>
          <!--          <a-button-->
          <!--            type='link'-->
          <!--            class='clear-all'-->
          <!--            @click='clearFilter()'-->
          <!--            style='float:right;'>-->
          <!--            Clear all-->
          <!--          </a-button>-->
        </div>
        <a-row v-if='filterType == 1'>
          <div class='filter-row'>
            <div class='row-select'>
              <div
                class='sub-select'
                v-for="(item ,index) in templateFilterCondition(templateType.Learning,'')"
                :key='index'>
                <a-row>
                  <h4>{{ item.name }}</h4>
                </a-row>
                <div class='sub-items'>
                  <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                    <a-checkbox
                      :value='child.id'
                      @change='onChangeCheckBox($event,templateType.Learning,item)'
                      :checked='filterLearn.indexOf(child.id) > -1 ? true: false'>
                      {{ child.name }}
                    </a-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-row>
        <a-row v-if='filterType == 2'>
          <a-tabs
            class='assessments-tabs'
            v-model='filterAssessmentsType'
            :defaultActiveKey='filterAssessmentsType'
            @change='changeFilterType'
            :animated="false"
            :tabBarGutter='3'
            :tabBarStyle="{margin:'10px 20px'}">
            <a-tab-pane key='1' tab='Knowledge focus'>
              <div class='filter-row'>
                <a-row>
                  <div class='row-select row-select-assessments'>
                    <a-col :span='24'>
                      <!--                          <span class="sub-category">Knowledge focus </span>-->
                      <div
                        class='sub-select'
                        v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Knowledge focus')"
                        :key='index'>
                        <a-row>
                          <h4>{{ item.name }}</h4>
                        </a-row>
                        <div class='sub-items'>
                          <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                            <a-radio
                              :name='item.name'
                              :value='child.id'
                              :checked="filterAssessments.indexOf(child.id) !== -1"
                              @click='onClickRadio($event,templateType.Assessments,item)'>
                              {{ child.name }}
                            </a-radio>
                          </div>
                        </div>
                      </div>
                    </a-col>
                  </div>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key='2' tab='Skill focus' force-render>
              <div class='filter-row'>
                <a-row>
                  <div class='row-select row-select-assessments'>
                    <a-col :span='24'>
                      <!--                          <span class="sub-category">Skill focus</span>-->
                      <div
                        class='sub-select'
                        v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Skill focus')"
                        :key='index'>
                        <a-row>
                          <h4>{{ item.name }}</h4>
                        </a-row>
                        <div class='sub-items'>
                          <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                            <a-radio
                              :name='item.name'
                              :value='child.id'
                              :checked="filterAssessments.indexOf(child.id) !== -1"
                              @click='onClickRadio($event,templateType.Assessments,item)'>
                              {{ child.name }}
                            </a-radio>
                          </div>
                        </div>
                      </div>
                    </a-col>
                  </div>
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>

        </a-row>
        <a-row v-if='filterType == 3'>
          <div class='filter-row'>
            <a-row class='row-select'>
              <a-row>
                <a-tabs
                  :activeKey='selectYearTab'
                  @change='handleTabYearChange'
                  tab-position='top'
                  size='small'
                  :tabBarGutter='1'>
                  <a-tab-pane v-for='(tag) in centuryTagMap' :key='tag[0]' :tab='tag[0]' />
                </a-tabs>
              </a-row>
              <a-col :span='12'>
                <a-col
                  class='sub-select'
                  v-if='index < 2'
                  :span='24'
                  v-for="(item ,index) in templateFilterCondition(templateType.Century,'')"
                  :key='index'>
                  <a-row>
                    <h4>{{ item.name }}</h4>
                  </a-row>
                  <a-row v-for='(child,cIndex) in item.children' :key='cIndex'>
                    <a-col :span='24' class='first-child'>
                      <a-checkbox
                        :value='child.id'
                        @change='onChangeCheckBox($event,templateType.Century,child)'
                        :checked='filterCentury.indexOf(child.id) > -1 ? true: false'>
                        {{ child.name }}
                      </a-checkbox>
                      <div class='sub-child'>
                        <a-row
                          v-if='child.children.length > 0'
                          v-for='(subChild,subIndex) in child.children'
                          :key='subIndex'>
                          <a-col :span='24' class='sub-child-child'>
                            <a-checkbox
                              :value='subChild.id'
                              @change='onChangeCheckBox($event,templateType.Century,child)'
                              :checked='filterCentury.indexOf(subChild.id) > -1 ? true: false'>
                              <a-tooltip
                                placement='right'
                                :overlayStyle="{ 'z-index': '3000'}"
                                :title='filterGradeTips(subChild)'> {{ subChild.name }}
                              </a-tooltip>
                            </a-checkbox>
                          </a-col>
                        </a-row>
                      </div>
                    </a-col>
                  </a-row>
                </a-col>
              </a-col>
              <a-col :span='12'>
                <a-col
                  class='sub-select'
                  v-if='index >= 2'
                  :span='24'
                  v-for="(item ,index) in templateFilterCondition(templateType.Century,'')"
                  :key='index'>
                  <a-row>
                    <h4>{{ item.name }}</h4>
                  </a-row>
                  <a-row v-for='(child,cIndex) in item.children' :key='cIndex'>
                    <a-col :span='24' class='first-child'>
                      <a-checkbox
                        :value='child.id'
                        @change='onChangeCheckBox($event,templateType.Century,child)'
                        :checked='filterCentury.indexOf(child.id) > -1 ? true: false'>
                        {{ child.name }}
                      </a-checkbox>
                      <div class='sub-child'>
                        <a-row
                          v-if='child.children.length > 0'
                          v-for='(subChild,subIndex) in child.children'
                          :key='subIndex'>
                          <a-col class='sub-child-child' :span='24'>
                            <a-checkbox
                              :value='subChild.id'
                              @change='onChangeCheckBox($event,templateType.Century,child)'
                              :checked='filterCentury.indexOf(subChild.id) > -1 ? true: false'>
                              <a-tooltip placement='top' :title='filterGradeTips(subChild)'> {{ subChild.name
                              }}
                              </a-tooltip>
                            </a-checkbox>
                          </a-col>
                        </a-row>
                      </div>
                    </a-col>
                  </a-row>
                </a-col>
              </a-col>
            </a-row>
          </div>
        </a-row>
        <a-row v-if='filterType == 4'>
          <div class='filter-row'>
            <div class='row-select'>
              <div class='sub-select'>
                <a-row>
                  <h4></h4>
                </a-row>
                <div class='sub-items'>
                  <div class='sub-item' v-for='(item,cIndex) in initPrompts' :key='cIndex' v-if="item.text !== 'General purpose'">
                    <a-checkbox
                      :value='item.value'
                      @change='onChangeCheckBox($event,templateType.Prompt,item)'
                      :checked='filterPruposeList.indexOf(item.value) > -1 ? true: false'>
                      {{ item.text }}
                    </a-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>

import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import { TemplateTypeMap } from '@/const/template'
import { DICT_PROMPT_PURPOSE, TemplateType } from '@/const/common'
import * as logger from '@/utils/logger'
import { GetTagYearTips, GetTreeByKey } from '@/api/tag'
import { GetDictItems } from '@/api/common'

export default {
  name: 'TemplateFilter',
  components: {
    CustomSearchInput,
    FilterIcon,
    FilterActiveIcon
  },
  data () {
    return {
      searchKey: null,
      showFilter: false,
      filterParams: {},
      filterType: 1,
      templateTypeMap: TemplateTypeMap,
      templateType: TemplateType,
      filterLearn: [],
      assessmentsList: [],
      filterAssessments: [],
      centuryList: [],
      filterCentury: [],
      filterPruposeList: [],
      filterParentMap: new Map(),
      centuryTagMap: new Map(),
      selectYearTab: '',
      filterAssessmentsType: '1'
    }
  },
  created() {
    this.initTemplateFilter()
    this.GetTagYearTips()
  },
  computed: {
    filterGradeTips() {
      return function(item) {
        if (!this.selectYearTab) {
          return item.name
        }
        const filerList = this.centuryTagMap.get(this.selectYearTab).filter(tag => tag.tagId === item.id)
        return filerList.length > 0 ? filerList[0].tooltip : ''
      }
    }
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  methods: {
    handleUpdateFilterConfig (filter) {
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.filterParams = filter
      this.triggerSearch()
    },
    triggerSearch() {
      this.$logger.info('triggerSearch', this.searchKey)
      const filterConfig = {
        searchKey: this.searchKey,
        filterCategoryType: this.searchKey ? '' : this.filterType,
        filterLearn: this.filterLearn,
        filterAssessments: this.getFilterAssessmentsParams(this.filterAssessments),
        filterCentury: this.getFilterParams(this.filterCentury),
        filterPruposeList: this.filterPruposeList
      }
      this.$emit('search', filterConfig)
    },
    initTemplateFilter() {
      GetTreeByKey({ key: 'template' }).then((response) => {
        this.$logger.info('initTemplateFilter response', response.result)
        if (response.success) {
          this.treeItemData = response.result.children
          this.treeItemData.forEach(item => {
            if (item.name === TemplateType.Learning) {
              this.learnExperienceList = item.children
            }
            if (item.name === TemplateType.Assessments) {
              this.assessmentsList = item.children
            }
            if (item.name === TemplateType.Century) {
              this.centuryList = item.children
            }
          })
        } else {
          this.$message.error(response.message)
        }
      })

      GetDictItems(DICT_PROMPT_PURPOSE).then((response) => {
        if (response.success) {
          logger.info('DICT_PROMPT_PURPOSE', response.result)
          this.initPrompts = response.result
        }
      })
    },
    handleClick () {
      this.showFilter = false
    },
    templateFilterCondition(category1, category2) {
      let list = []
      if (category1 === TemplateType.Learning) {
        list = this.learnExperienceList
      } else if (category1 === TemplateType.Assessments) {
        list = this.assessmentsList
      } else if (category1 === TemplateType.Century) {
        list = this.centuryList
      }
      console.log('list size:' + list.length)
      if (!category2) {
        return list
      }
      const resultList = list.filter(item => item.name === category2)
      logger.info('templateFilterCondition ', resultList)
      return resultList.length > 0 ? resultList[0].children : []
    },
    onClickRadio(e, category, parent) {
      logger.info('onChangeCheckBox ', e, category, parent)
      logger.info('filterLearn ', this.filterLearn)
      const id = e.target.value
      const isAdd = this.filterAssessments.indexOf(id) === -1
      // 单选，去除同parent其他值
      parent.children.forEach(item => {
        if (this.filterAssessments.indexOf(item.id) !== -1) {
          this.filterAssessments.splice(this.filterAssessments.indexOf(item.id), 1)
        }
      })
      if (isAdd) {
        this.filterAssessments.push(id)
      }
      this.triggerSearch()
    },
    onChangeCheckBox(e, category, parent) {
      logger.info('onChangeCheckBox ', e, category, parent)
      logger.info('filterLearn ', this.filterLearn)
      const id = e.target.value
      if (category === TemplateType.Learning) {
        if (this.filterLearn.indexOf(id) === -1) {
          this.filterLearn.push(id)
        } else {
          this.filterLearn.splice(this.filterLearn.indexOf(id), 1)
        }
      } else if (category === TemplateType.Assessments) {
        // 单选，去除同parent其他值
        parent.children.forEach(item => {
          if (this.filterAssessments.indexOf(item.id) !== -1) {
            this.filterAssessments.splice(this.filterAssessments.indexOf(item.id), 1)
          }
        })
        this.filterAssessments.push(id)
      } else if (category === TemplateType.Century) {
        if (this.filterCentury.indexOf(id) === -1) {
          this.filterCentury.push(id)
        } else {
          this.filterCentury.splice(this.filterCentury.indexOf(id), 1)
          // 去重父标签
          if (!e.target.checked && parent && parent.id !== id && this.filterCentury.indexOf(parent.id) !== -1) {
            this.filterCentury.splice(this.filterCentury.indexOf(parent.id), 1)
          }
        }
        // child设置
        if (parent.id === id) {
          parent.children.forEach(child => {
            if (e.target.checked) {
              if (this.filterCentury.indexOf(child.id) === -1) {
                this.filterCentury.push(child.id)
              }
            } else {
              this.filterCentury.splice(this.filterCentury.indexOf(child.id), 1)
            }
          })
        }
      } else if (category === TemplateType.Prompt) {
        if (this.filterPruposeList.indexOf(id) === -1) {
          this.filterPruposeList.push(id)
        } else {
          this.filterPruposeList.splice(this.filterPruposeList.indexOf(id), 1)
        }
      }
      // 如果选中的是子类 父id要从筛选条件中去除，记录关系
      if (parent && parent.children && parent.children.length > 0) {
        this.filterParentMap.set(id, parent.id)
      }
      this.triggerSearch()
    },
    getFilterAssessmentsParams(list) {
      if (list.length === 0) {
        return []
      }
      var resList = []
      if (!this.filterAssessmentsType) {
        return list
      }
      if (this.assessmentsList.length !== 2) {
        return list
      }
      if (this.filterAssessmentsType === '1') {
        this.assessmentsList[0].children.forEach(parent => {
          parent.children.forEach(child => {
            if (list.indexOf(child.id) !== -1) {
              resList.push(child.id)
            }
          })
        })
      } else {
        this.assessmentsList[1].children.forEach(parent => {
          parent.children.forEach(child => {
            if (list.indexOf(child.id) !== -1) {
              resList.push(child.id)
            }
          })
        })
      }
      console.log(resList)
      return resList
    },
    GetTagYearTips() {
      GetTagYearTips().then((response) => {
        this.$logger.info('GetTagYearTips response', response.result)
        if (response.success) {
          const tagYears = response.result
          tagYears.forEach(tag => {
            if (!this.centuryTagMap.has(tag.yearName)) {
              this.centuryTagMap.set(tag.yearName, [])
            }
            this.centuryTagMap.get(tag.yearName).push(tag)
          })
          if (tagYears.length > 0) {
            this.selectYearTab = tagYears[0].yearName
          }
        } else {
          this.$message.error(response.message)
        }
        this.$logger.info('centuryTagMap ', this.centuryTagMap)
      })
    },
    handleTabYearChange(activeKey) {
      this.selectYearTab = activeKey
    },
    clearFilter() {
      if (this.filterType === 1) {
        this.filterLearn = []
      } else if (this.filterType === 2) {
        this.filterAssessments = []
        this.assessmentsList.forEach(parent => {
          parent.children.forEach(child => {
            child.tooltip = ''
          })
        })
      } else if (this.filterType === 3) {
        this.filterCentury = []
      } else if (this.filterType === 4) {
        this.filterPruposeList = []
      }
      this.triggerSearch()
    },
    changeFilterType(e) {
      this.showTemplateFilter = true
      this.triggerSearch()
    },
    getFilterParams(list) {
      logger.info('getFilterParams ', list)
      if (list.length === 0) {
        return []
      }
      var resList = [...list]
      console.log(this.filterParentMap)
      list.forEach(id => {
        if (this.filterParentMap.has(id)) {
          const pId = this.filterParentMap.get(id)
          if (resList.indexOf(pId) > -1) {
            resList.splice(resList.indexOf(pId), 1)
          }
        }
      })
      return resList
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-filter {
  //position: relative;
  z-index: 500;
  .filter-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .filter-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      .filter-item {
        color: #333;
        cursor: pointer;
        background: #FFFFFF;
        opacity: 1;
        padding: 5px 10px 0 10px;
        white-space:nowrap;

        svg {
          height: 15px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }
      }
    }
  }

  .filter-wrapper {
    position: absolute;
    right: 20px;
    width: 45%;
    float: right;
    overflow-y: scroll;
    background-color: #fdfdfd;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #E4E4E4;
    padding: 5px 5px;
    border-radius: 5px;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
    }
  }
  .expand-icon {
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding: 0 5px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 23px;
      }
    }
  }

  .template-select-header {
    background: rgba(255, 255, 255, 0.2);
    //border: 1px solid #ddd;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    position: relative;
    max-width:100%;
    float: right;

    .expand-icon {
      line-height: 30px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        svg {
          font-size: 23px;
        }
      }
    }

    .group-filter {
      text-align: center;
      margin-bottom: 3px;
    }

    .filter-row {
      position: relative;
      margin-left: 10px;

      .ant-form-item-label {
        font-weight: bold;
        line-height: 24px;
        color: #11142D;
      }

      .clear-all {
        position: absolute;
        right: 3px;
        top: -3px;
      }

      .row-select {
        .sub-category {
          line-height: 24px;
          color: #D3D3D3;
        }

        .sub-select {
          margin-bottom: 10px;

          .sub-items {
            display: flex;
            flex-wrap: wrap;

            .sub-item {
              margin: 3px 10px;
              width: 200px;
              word-break: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }
        }

        .first-child {
          margin: 5px;
        }

        .sub-child {
          padding-left: 20px;

          .sub-child-child {
            margin: 3px;
          }
        }

        margin: 5px 5px 10px 10px;
        border: 1px solid #E4E4E4;
        padding: 5px 15px;
        max-height: 250px;
        overflow: auto;
      }

      .row-select-assessments .sub-select {
        width: 100%;

        .sub-items .sub-item {
          width: 180px;
        }
      }
    }

  }
}

</style>

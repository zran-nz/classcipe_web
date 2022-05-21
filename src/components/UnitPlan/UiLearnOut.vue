<template>
  <div class="tag-ui">
    <div class="objectives-wrapper">
      <custom-form-item label-color="#FF786D">
        <template slot='label'>
          Achievement objectives
        </template>
        <template slot='action'>
          <plus-icon @click='handleAddNew(TagType.skill, skillInputList)'/>
        </template>
        <template v-if="getKnowledgeListType(TagType.skill).length > 0" >
          <div class="objectives-list" v-for="(k,index) in getKnowledgeListType(TagType.skill)" :key="index">
            <div class="objectives-list-item objectives-list-item-skill objectives-list-item-top-fixed">
              <div v-selectPopover="['modal', domFn, k, true]" class="skt-description" @dblclick="handleAddTag(k)">
                <a-tooltip placement="topLeft" :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
              <a-space class="objectives-tag" direction="vertical">
                <a-space class="objectives-tag-type" v-if="k.commandTerms && k.commandTerms.length > 0">
                  <div class="objectives-tag-title">Command term:</div>
                  <div class="objectives-tag-content">
                    <div class="objectives-tag-item" v-for="(tag, tagIndex) in k.commandTerms" :key="'skill_command_'+tagIndex">
                      <a-tag color="#ec7d31" :closable="true" @close="e => handleCloseObjectiveTag(k, 'commandTerms', tagIndex)">{{ tag.name }}</a-tag>
                      <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                    </div>
                  </div>
                </a-space>
                <a-space class="objectives-tag-type" v-if="k.knowledgeTags && k.knowledgeTags.length > 0">
                  <div class="objectives-tag-title">Knowledge tag:</div>
                  <div class="objectives-tag-content">
                    <div
                      class="objectives-tag-item"
                      v-for="(tag, tagIndex) in k.knowledgeTags"
                      :key="'skill_knowledge_'+tagIndex"
                    >
                      <a-tag color="#a5a5a5" :closable="true" @close="e => handleCloseObjectiveTag(k, 'knowledgeTags', tagIndex)">{{ tag.name }}</a-tag>
                    </div>
                  </div>
                </a-space>
              </a-space>
            </div>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No" v-if="canEdit">
              <div class='delete-action'>
                <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
              </div>
            </a-popconfirm>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item"
            v-for='(skillInput, sIdx) in skillInputList'
            :key='sIdx'>
            <self-outs-input
              class='skill-input'
              v-selectPopover="['modal', domFn, skillInput, true]"
              :filter-types='[TagType.skill, TagType.ibSkill, TagType.idu]'
              :grade-ids='gradeIds'
              :subject-ids='subjectIds'
              :default-display-name='skillInput.name'
              :default-self-out-subject='skillInput.subjectId ? skillInput.subjectId : null'
              :disabled="!canEdit"
              @update-value='(newName) => skillInput.name = newName'
              @update-subject='(newSubject) => skillInput.subjectId = newSubject'
            />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm='handleDeleteSkill(skillInput)' cancel-text="No" v-if="canEdit">
              <div class='self-out-delete-icon'>
                <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
              </div>
            </a-popconfirm>
            <a-space class="objectives-tag" direction="vertical">
              <a-space class="objectives-tag-type" v-if="skillInput.commandTerms && skillInput.commandTerms.length > 0">
                <div class="objectives-tag-title">Command term:</div>
                <div class="objectives-tag-content">
                  <div class="objectives-tag-item" v-for="(tag, tagIndex) in skillInput.commandTerms" :key="'skill_input_command_'+tagIndex">
                    <a-tag color="#ec7d31" :closable="true" @close="e => handleCloseObjectiveTag(skillInput, 'commandTerms', tagIndex)">{{ tag.name }}</a-tag>
                    <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                  </div>
                </div>
              </a-space>
              <a-space class="objectives-tag-type" v-if="skillInput.knowledgeTags && skillInput.knowledgeTags.length > 0">
                <div class="objectives-tag-title">Knowledge tag:</div>
                <div class="objectives-tag-content">
                  <div
                    class="objectives-tag-item"
                    v-for="(tag, tagIndex) in skillInput.knowledgeTags"
                    :key="'skill_input_knowledge_'+tagIndex"
                  >
                    <a-tag color="#a5a5a5" :closable="true" @close="e => handleCloseObjectiveTag(skillInput, 'knowledgeTags', tagIndex)">{{ tag.name }}</a-tag>
                  </div>
                </div>
              </a-space>
            </a-space>
          </div>
        </div>
      </custom-form-item>
      <custom-form-item label-color='#47A3E4'>
        <template slot='label'>
          Learning outcomes
        </template>
        <template slot='action'>
          <plus-icon @click='handleAddNew(TagType.knowledge, knowledgeInputList)'/>
        </template>
        <template v-if="getKnowledgeListType(TagType.knowledge).length > 0" >
          <div class="objectives-list" v-for="(k,index) in getKnowledgeListType(TagType.knowledge)" :key="index">
            <div class="objectives-list-item objectives-list-item-learn objectives-list-item-top-fixed">
              <div v-selectPopover="['modal', domFn, k, true]" class="skt-description" @dblclick="handleAddTag(k)">
                <a-tooltip placement="topLeft" :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
              <a-space class="objectives-tag" direction="vertical">
                <a-space class="objectives-tag-type" v-if="k.commandTerms && k.commandTerms.length > 0">
                  <div class="objectives-tag-title">Command term:</div>
                  <div class="objectives-tag-content">
                    <div class="objectives-tag-item" v-for="(tag, tagIndex) in k.commandTerms" :key="'knowledge_command_'+tagIndex">
                      <a-tag color="#ec7d31" :closable="true" @close="e => handleCloseObjectiveTag(k, 'commandTerms', tagIndex)">{{ tag.name }}</a-tag>
                      <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                    </div>
                  </div>
                </a-space>
                <a-space class="objectives-tag-type" v-if="k.knowledgeTags && k.knowledgeTags.length > 0">
                  <div class="objectives-tag-title">Knowledge tag:</div>
                  <div class="objectives-tag-content">
                    <div
                      class="objectives-tag-item"
                      v-for="(tag, tagIndex) in k.knowledgeTags"
                      :key="'knowledge_knowledge_'+tagIndex"
                    >
                      <a-tag color="#a5a5a5" :closable="true" @close="e => handleCloseObjectiveTag(k, 'knowledgeTags', tagIndex)" >{{ tag.name }}</a-tag>
                    </div>
                  </div>
                </a-space>
              </a-space>
            </div>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No" v-if="canEdit">
              <div class='delete-action'>
                <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
              </div>
            </a-popconfirm>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item"
            v-for='(knowledgeInput, sIdx) in knowledgeInputList'
            :key='sIdx'>
            <self-outs-input
              class='knowledge-input'
              v-selectPopover="['modal', domFn, knowledgeInput, true]"
              :filter-types='[TagType.knowledge]'
              :grade-ids='gradeIds'
              :subject-ids='subjectIds'
              :default-display-name='knowledgeInput.name'
              :default-self-out-subject='knowledgeInput.subjectId ? knowledgeInput.subjectId : null'
              :disabled="!canEdit"
              @update-value='(newName) => knowledgeInput.name = newName'
              @update-subject='(newSubject) => knowledgeInput.subjectId = newSubject'
            />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm='handleDeleteKnowledge(knowledgeInput)' cancel-text="No" v-if="canEdit">
              <div class='self-out-delete-icon'>
                <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
              </div>
            </a-popconfirm>
            <a-space class="objectives-tag" direction="vertical">
              <a-space class="objectives-tag-type" v-if="knowledgeInput.commandTerms && knowledgeInput.commandTerms.length > 0">
                <div class="objectives-tag-title">Command term:</div>
                <div class="objectives-tag-content">
                  <div
                    class="objectives-tag-item"
                    v-for="(tag, tagIndex) in knowledgeInput.commandTerms"
                    :key="'knowledgeInput_command_'+tagIndex">
                    <a-tag
                      color="#ec7d31"
                      :closable="true"
                      @close="e => handleCloseObjectiveTag(knowledgeInput, 'commandTerms', tagIndex)"
                    >{{ tag.name }}</a-tag>
                    <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                  </div>
                </div>
              </a-space>
              <a-space class="objectives-tag-type" v-if="knowledgeInput.knowledgeTags && knowledgeInput.knowledgeTags.length > 0">
                <div class="objectives-tag-title">Knowledge tag:</div>
                <div class="objectives-tag-content">
                  <div
                    class="objectives-tag-item"
                    v-for="(tag, tagIndex) in knowledgeInput.knowledgeTags"
                    :key="'knowledgeInput_knowledge_'+tagIndex"
                  >
                    <a-tag color="#a5a5a5" :closable="true" @close="e => handleCloseObjectiveTag(knowledgeInput, 'knowledgeTags', tagIndex)">{{ tag.name }}</a-tag>
                  </div>
                </div>
              </a-space>
            </a-space>
          </div>
        </div>
      </custom-form-item>
      <custom-form-item label-color='#FF933C'>
        <template slot='label'>
          {{ $classcipe.get21stCenturyDisplayNameByCurriculum($store.getters.bindCurriculum) }}
        </template>
        <template slot='action'>
          <plus-icon @click='handleAddNew(TagType.century, centuryInputList)'/>
        </template>
        <template v-if="getKnowledgeListType(TagType.century).length > 0" >
          <div class='category-item' v-for='categoryItem in getCenturyCategoryList(TagType.century)' :key='categoryItem.categoryName'>
            <div class='category-name'><a-icon type="tag" /> {{ categoryItem.categoryName }}</div>
            <div class="objectives-list" v-for="(k,index) in categoryItem.list" :key="index">
              <div class="objectives-list-item objectives-list-item-21 objectives-list-item-top-fixed" @click="handleActiveDescription(TagType.century,k)">
                <div v-selectPopover="['modal', domFn, k, true]" class="skt-description skt-description-21" @dblclick="handleAddTag(k)">
                  <a-tooltip placement="topLeft" :title="k.path"> {{ k.name }}</a-tooltip>
                </div>
                <a-space class="objectives-tag" direction="vertical">
                  <a-space class="objectives-tag-type" v-if="k.commandTerms && k.commandTerms.length > 0">
                    <div class="objectives-tag-title">Command term:</div>
                    <div class="objectives-tag-content">
                      <div
                        class="objectives-tag-item"
                        v-for="(tag, tagIndex) in k.commandTerms"
                        :key="'century_command_'+tagIndex"
                      >
                        <a-tag
                          color="#ec7d31"
                          :closable="true"
                          @close="e => handleCloseObjectiveTag(k, 'commandTerms', tagIndex)"
                        >{{ tag.name }}</a-tag>
                        <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                      </div>
                    </div>
                  </a-space>
                  <a-space class="objectives-tag-type" v-if="k.knowledgeTags && k.knowledgeTags.length > 0">
                    <div class="objectives-tag-title">Knowledge tag:</div>
                    <div class="objectives-tag-content">
                      <a-tag
                        color="#a5a5a5"
                        class="objectives-tag-item"
                        :closable="true"
                        @close="e => handleCloseObjectiveTag(k, 'knowledgeTags', tagIndex)"
                        v-for="(tag, tagIndex) in k.knowledgeTags"
                        :key="'century_knowledge_'+tagIndex">{{ tag.name }}</a-tag>
                    </div>
                  </a-space>
                </a-space>
                <div
                  v-if="k.tagType === TagType.century"
                  class="actions">
                  <span class="add-action" @click.stop.prevent="handleAddTag(k)">
                    <img src="~@/assets/icons/tag/add.png"/>
                  </span>
                  <span class="up-down">
                    <a-icon type="up" v-if="k.tagListVisible"/>
                    <a-icon type="down" v-else />
                  </span>
                </div>
                <a-divider style="margin: 10px 0px" v-if="k.tagListVisible" />
                <div class="skt-description-tag-list" v-if="k.tagListVisible">
                  <div :class="{'tag-list-item': true,'skill-mode': true}" v-for="name in k.tags" :key="name">
                    <a-tag class="tag-item" :closable="true" @close="handleDeleteTag(k,name)">{{ name }}</a-tag>
                  </div>
                </div>
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No" v-if="canEdit">
                <div class='delete-action'>
                  <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
                </div>
              </a-popconfirm>
            </div>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item"
            v-for='(centuryInput, sIdx) in centuryInputList'
            :key='sIdx'>
            <self-outs-input
              class='century-input'
              v-selectPopover="['modal', domFn, centuryInput, true]"
              :filter-types='[TagType.century, TagType.common]'
              :grade-ids='gradeIds'
              :subject-ids='subjectIds'
              :default-display-name='centuryInput.name'
              :default-self-out-subject='centuryInput.subjectId ? centuryInput.subjectId : null'
              :disabled="!canEdit"
              @update-value='(newName) => centuryInput.name = newName'
              @update-subject='(newSubject) => centuryInput.subjectId = newSubject'
            />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteCentury(centuryInput)" cancel-text="No" v-if="canEdit">
              <div class='self-out-delete-icon'>
                <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
              </div>
            </a-popconfirm>
            <a-space class="objectives-tag" direction="vertical">
              <a-space class="objectives-tag-type" v-if="centuryInput.commandTerms && centuryInput.commandTerms.length > 0">
                <div class="objectives-tag-title">Command term:</div>
                <div class="objectives-tag-content">
                  <div
                    class="objectives-tag-item"
                    v-for="(tag, tagIndex) in centuryInput.commandTerms"
                    :key="'century_input_command_'+tagIndex"
                  >
                    <a-tag
                      color="#ec7d31"
                      :closable="true"
                      @close="e => handleCloseObjectiveTag(centuryInput, 'commandTerms', tagIndex)"
                    >{{ tag.name }}</a-tag>
                    <rate-level @change="val => handleChangeLevel(val, tag)" :bloom="tag.bloomTag" :knowledge="tag.knowledgeDimension" />
                  </div>
                </div>
              </a-space>
              <a-space class="objectives-tag-type" v-if="centuryInput.knowledgeTags && centuryInput.knowledgeTags.length > 0">
                <div class="objectives-tag-title">Knowledge tag:</div>
                <div class="objectives-tag-content">
                  <div
                    class="objectives-tag-item"
                    v-for="(tag, tagIndex) in centuryInput.knowledgeTags"
                    :key="'century_input_knowledge_'+tagIndex"
                  >
                    <a-tag color="#a5a5a5" :closable="true" @close="e => handleCloseObjectiveTag(centuryInput, 'knowledgeTags', tagIndex)" >{{ tag.name }}</a-tag>
                  </div>
                </div>
              </a-space>
            </a-space>
          </div>
        </div>
      </custom-form-item>
    </div>

    <a-modal
      v-model="addTagVisible"
      :footer="null"
      destroyOnClose
      width="800px">
      <div class="my-modal-title" slot="title">
        Add tag
      </div>
      <learn-out-add-tag @handle-select-tags="handleEnsureTags" :knowledge="knowledge" />
    </a-modal>

    <a-modal
      v-model="centuryTagVisible"
      :footer="null"
      destroyOnClose
      width="1000px"
      title="Add tag">
      <div class="ensure-setting-modal">
        <div class="tips">
          <p>
            {{ knowledge.name }}
          </p>
        </div>
        <div>
          <div class="row-cascader" v-for="(tag,index) in centuryTagList" :key="index">
            <a-cascader
              style="width: 900px"
              :fieldNames="{ label: 'name', value: 'name', children: 'children'}"
              v-model="centuryTagList[index]"
              :options="centuryList"
              change-on-select />
            <a-button type="link" v-if="centuryTagList.length > 1" icon="minus" size="large" @click="handleRemoveCenturyTag(index)"></a-button>
          </div>
          <a-button type="link" icon="plus-circle" size="large" @click="handleAddCenturyTag()"></a-button>
        </div>
        <div class="modal-ensure-action-line-center">
          <a-button class="action-item action-cancel" shape="round" @click="centuryTagVisible=false">Cancel</a-button>
          <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureCenturyTags">Confirm</a-button>
        </div>
      </div>
    </a-modal>

    <div v-clickOutside id="modal" ref="quickModal" v-show="false">
      <a-space class="quick-keyword-con">
        <label>Set </label>
        <quick-word-button
          type="black"
          text="Command term"
          @sub="res => handleQuickWordSet(res, 'commandTerms')"
          :quickWord="quickWord"
          :dataCondition="{type: 1}"
          :loadApi="KnowledgeTermTagQueryByKeywords"
          @changeWord="res => this.commandTermForm.name = res"
        >
          <template v-slot:create>
            <div class="quick-word-sub">
              <a-divider style="margin: 10px 0;"/>
              <a-space v-show="!showQuickWordCreate" >
                <label>Create:</label>
                <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="showQuickWordCreate = true"> {{ commandTermForm.name || 'Command term' }} </a-button>
              </a-space>
              <!-- <a-divider style="margin: 5px 0;font-size: 14px;">Create</a-divider>
              <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="showQuickWordCreate = true"> Do Create </a-button> -->
              <command-term-add
                v-show="showQuickWordCreate"
                :bloomOptions="bloomOptions"
                :knowLedgeOptions="knowLedgeOptions"
                :initName="commandTermForm.name"
                @cancel="showQuickWordCreate = false"
                @save="handleSaveCommanTerm"
              />
            </div>
          </template>
        </quick-word-button>
        <label> or </label>
        <quick-word-button
          type="black"
          text="Knowledge tag"
          @sub="res => handleQuickWordSet(res, 'knowledgeTags')"
          :quickWord="quickWord"
          :dataCondition="{type: 2}"
          :loadApi="KnowledgeTermTagQueryByKeywords"
        >
          <template v-slot:create><div></div></template>
        </quick-word-button>
      </a-space>
    </div>
  </div>

</template>

<script>
  import * as logger from '@/utils/logger'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import LearnOutAddTag from '@/components/UnitPlan/LearnOutAddTag'
  import RateLevel from '@/components/RateLevel'
  import { TagType, AllCurriculums } from '@/const/common'
  import { getAll21Century } from '@/api/knowledge'
  import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
  import QuickWordButton from '@/components/Button/QuickWordButton'
  import SelfOutsInput from '@/components/UnitPlan/SelfOutsInput'
  import { KnowledgeTermTagQueryByKeywords } from '@/api/knowledgeTermTag'
  import CustomFormItem from '@/components/Common/CustomFormItem'
  import PlusIcon from '@/components/Common/PlusIcon'
  import DeleteIcon from '@/components/Common/DeleteIcon'
  import CommandTermAdd from '@/components/CommandTerm/CommandTermAdd.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'UiLearnOut',
    components: {
      DeleteIcon,
      PlusIcon,
      CustomFormItem,
      SelfOutsInput,
      LearnOutAddTag,
      NoMoreResources,
      AddGreenIcon,
      QuickWordButton,
      RateLevel,
      CommandTermAdd
    },
    props: {
      learnOuts: {
        type: Array,
        default: () => []
      },
      selfOuts: {
        type: Array,
        default: () => []
      },
      canEdit: {
        type: Boolean,
        default: true
      },
      customTags: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      ...mapState({
        info: state => state.user.info,
        gradeIds: state => state.user.info.preference ? state.user.info.preference.gradeIds : [],
        subjectIds: state => state.user.info.preference ? state.user.info.preference.subjectIds : []
      }),
      dealPath () {
        return (path) => {
          if (!path) {
            return path
          }
          return path.split('>')
        }
      }
    },
    data () {
      return {
        knowledgeList: [],
        addTagVisible: false,
        centuryTagVisible: false,
        centuryTagList: [],
        knowledge: {},
        tags: [],
        TagType: TagType,
        centuryList: [],

        skillInputList: [],
        knowledgeInputList: [],
        centuryInputList: [],
        AllCurriculums: AllCurriculums,
        quickWord: '',
        commandTerms: [],
        knowledgeTags: [],
        showQuickWordCreate: false,
        currentObjective: null,
        bloomParentId: '',
        bloomOptions: [],
        knowLedgeParentId: '',
        knowLedgeOptions: [],
        KnowledgeTermTagQueryByKeywords: KnowledgeTermTagQueryByKeywords,
        commandTermForm: {
          name: ''
        }
      }
    },
    created () {
      this.knowledgeList = this.learnOuts
      logger.info('knowledgeList ', this.knowledgeList)
      this.initBloomOptions()
      this.get21century()
      this.initSelfOuts()
    },
    watch: {
      learnOuts (val) {
        this.$logger.info('learnOuts change!', val)
        this.knowledgeList = val
      },

      selfOuts (val) {
        this.$logger.info('selfOuts change!', val)
        this.initSelfOuts()
      },
      // 更新centuryList中的数据，禁用已经被选择的选项
      centuryTagList (val) {
        this.$logger.info('centuryTagList change!', val, this.centuryList)

        // 重置所有的centuryList为可选
        this.centuryList.forEach(child => this.removeDisabled(child))
        // 只禁用已选择的
        this.centuryTagList.forEach(tagNameList => {
          let childList = this.centuryList
          for (let i = 0; i < tagNameList.length; i++) {
            const tagName = tagNameList[i]
            const child = childList.find(item => item.name === tagName)
            if (child) {
              if (i === tagNameList.length - 1) {
                child.disabled = true
              }
              childList = child.children
            } else {
              break
            }
          }
        })
      }
    },
    methods: {
      initBloomOptions () {
        if (this.customTags && this.customTags.recommends) {
          const bloom = this.customTags.recommends.find(item => item.name === "Bloom's Taxonomy")
          if (bloom) {
            this.bloomOptions = bloom.keywords
            this.bloomParentId = bloom.id
          } else {
            this.bloomOptions = []
            this.bloomParentId = ''
          }
          const knowLedge = this.customTags.recommends.find(item => item.name === 'Knowledge Dimensions')
          if (knowLedge) {
            this.knowLedgeOptions = knowLedge.keywords
            this.knowLedgeParentId = knowLedge.id
          } else {
            this.knowLedgeOptions = []
            this.knowLedgeParentId = ''
          }
        }
      },
      initSelfOuts () {
        this.$logger.info('initSelfOuts', this.selfOuts)
        const skillInputList = this.selfOuts.filter(item => item.tagType === TagType.skill)
        const knowledgeInputList = this.selfOuts.filter(item => item.tagType === TagType.knowledge)
        const centuryInputList = this.selfOuts.filter(item => item.tagType === TagType.century)

        if (skillInputList.length) {
          this.skillInputList = skillInputList
        } else {
          this.skillInputList = []
        }
        this.$logger.info('skillInputList', this.skillInputList)

        if (knowledgeInputList.length) {
          this.knowledgeInputList = knowledgeInputList
        } else {
          this.knowledgeInputList = []
        }
        this.$logger.info('knowledgeInputList', this.skillInputList)

        if (centuryInputList.length) {
          this.centuryInputList = centuryInputList
        } else {
          this.centuryInputList = []
        }
        this.$logger.info('centuryInputList', this.skillInputList)
      },

      handleActiveDescription (type, k) {
        var index = this.knowledgeList.findIndex(item => item.knowledgeId === k.knowledgeId)
        if (this.knowledgeList[index].tagType !== TagType.knowledge &&
          this.knowledgeList[index].tagType !== TagType.century) {
          return
        }
        if (!this.knowledgeList[index].tagListVisible) {
          this.knowledgeList[index].tagListVisible = true
        } else {
          this.knowledgeList[index].tagListVisible = false
        }
        this.$set(this.knowledgeList, index, this.knowledgeList[index])
        logger.info('tagListVisible ', this.knowledgeList[index].tagListVisible)
      },
      handleDeleteTag (k, tagName) {
        var kIndex = this.knowledgeList.findIndex(item => item.knowledgeId === k.knowledgeId)
        this.knowledgeList[kIndex].tags.splice(this.knowledgeList[kIndex].tags.indexOf(tagName), 1)
        // this.$emit('set-learn-outs', this.knowledgeList)
      },

      handleDeleteKnowledgeItem (k) {
        var index = this.knowledgeList.findIndex(item => item.knowledgeId === k.knowledgeId)
        const data = this.knowledgeList[index]
        this.knowledgeList.splice(index, 1)
        this.$emit('remove-learn-outs', data)
      },
      handleAddTag (knowLedge) {
        logger.info('handleAddTag ', knowLedge)
        if (knowLedge.tagType === TagType.knowledge) {
          this.knowledge = knowLedge
          this.addTagVisible = true
        } else if (knowLedge.tagType === TagType.century) {
          this.knowledge = knowLedge
          this.centuryTagList = []
          this.centuryTagList.push([])
          this.centuryTagVisible = true
        }
      },
      handleEnsureSelectData () {
        this.addTagVisible = false
        // this.knowledge.tags = this.tags
      },
      handleEnsureTags (tags) {
        this.knowledge.tags = tags
        const index = this.knowledgeList.findIndex(item => item.knowledgeId === this.knowledge.knowledgeId)
        this.knowledgeList[index].tagListVisible = true
      },
      handleEnsureCenturyTags () {
        logger.info('handleEnsureCenturyTags ', this.centuryTagList)
        if (this.centuryTagList[0].length === 0) {
          this.$message.error('Please select tags')
          return
        }

        this.centuryTagList.forEach(item => {
          if (!this.knowledge.tags) {
            this.knowledge.tags = []
          }
          if (this.knowledge.tags.indexOf(item[item.length - 1]) === -1) {
            this.knowledge.tags.push(item[item.length - 1])
          }
          logger.info('this.knowledge.tags ', this.knowledge.tags)
        })
        this.centuryTagVisible = false
        this.knowledge.tagListVisible = true
      },
      handleRemoveCenturyTag (index) {
        logger.info('handleRemoveCenturyTag ', index)
        this.centuryTagList.splice(index, 1)
        this.handleUpdateCenturyTag()
      },
      handleAddCenturyTag () {
        this.$logger.info('handleAddCenturyTag ', this.centuryTagList)
        this.centuryTagList.push([])
      },
      handleUpdateCenturyTag () {
        this.$logger.info('handleUpdateCenturyTag ', 'selected', this.centuryTagList, 'option', this.centuryList)
      },
      treeForeach (tree, func) {
        tree.forEach(data => {
          data.children && this.treeForeach(data.children, func) // 遍历子树
          func(data)
        })
      },
      get21century () {
        getAll21Century({
        }).then((response) => {
          this.$logger.info('getAll21Century response', response)
          if (response.success) {
             this.centuryList = response.result
             this.treeForeach(this.centuryList, node => {
               node.disabled = false
               if (node.children.length === 0) {
                 node.title = this.$options.filters['gradeFormat'](node.gradeNames)
               }
             })
          }
        }).finally(() => {
          this.subTreeLoading = false
        })
      },
      getKnowledgeListType (type) {
        if (type === TagType.skill) {
          return this.knowledgeList.filter(item => item.tagType === TagType.skill || item.tagType === TagType.ibSkill || item.tagType === TagType.idu)
        } else if (type === TagType.century) {
          return this.knowledgeList.filter(item => item.tagType === TagType.century ||
            item.tagType === TagType.common)
        } else {
          return this.knowledgeList.filter(item => item.tagType === type)
        }
      },

      // 21世纪的数据需要根据学科分类显示
      getCenturyCategoryList (type) {
        const list = this.getKnowledgeListType(type)
        this.$logger.info('getCenturyCategoryList list ', list)
        const categoryDataMap = new Map()
        categoryDataMap.set('Others', [])
        list.forEach(item => {
          if (item.path) {
            if (item.path.indexOf('>') !== -1) {
              const pathArray = item.path.split('>')
              const categoryName = pathArray[1]
              // item.displayPath = pathArray.slice(2).join('>')
              if (categoryDataMap.has(categoryName)) {
                categoryDataMap.get(categoryName).push(item)
              } else {
                categoryDataMap.set(categoryName, [item])
              }
            } else {
              const categoryName = item.path
              // item.displayPath = item.path
              if (categoryDataMap.has(categoryName)) {
                categoryDataMap.get(categoryName).push(item)
              } else {
                categoryDataMap.set(categoryName, [item])
              }
            }
          } else {
            categoryDataMap.get('Others').push(item)
          }
        })

        const categoryDataList = []
        for (const [key, value] of categoryDataMap) {
          if (value && value.length > 0 && key !== 'Others') {
            categoryDataList.push({
              categoryName: key,
              list: value
            })
          }
        }

        // others放到最后
        if (categoryDataMap.get('Others').length > 0) {
          categoryDataList.push({
            categoryName: 'Others',
            list: categoryDataMap.get('Others')
          })
        }
        this.$logger.info('getCenturyCategoryList ', categoryDataList)
        return categoryDataList
      },

      removeDisabled(item) {
        if (item.disabled) {
          item.disabled = false
        }
        item.children && item.children.forEach(child => {
          this.removeDisabled(child)
        })
      },

      handleDeleteSkill (skill) {
        this.$logger.info('handleDelete ', skill)
        this.skillInputList = this.skillInputList.filter(item => item.key !== skill.key)
      },

      handleDeleteKnowledge (knowledge) {
        this.$logger.info('handleDelete ', knowledge)
        this.knowledgeInputList = this.knowledgeInputList.filter(item => item.key !== knowledge.key)
      },

      handleDeleteCentury (century) {
        this.$logger.info('handleDelete ', century)
        this.centuryInputList = this.centuryInputList.filter(item => item.key !== century.key)
      },

      handleAddNew(tagType, inputList) {
        this.$logger.info('handleAddNew ', inputList)
        inputList.push({
          name: '',
          subjectId: null,
          key: Math.random() + '',
          tagType: tagType,
          commandTerms: [],
          knowledgeTags: []
        })
      },

      getSelfOuts () {
        const selfOuts = []
        if (this.skillInputList.length) {
          this.skillInputList.forEach(item => {
            if (item.name && item.name.trim()) {
              selfOuts.push(item)
            }
          })
        }

        if (this.knowledgeInputList.length) {
          this.knowledgeInputList.forEach(item => {
            if (item.name && item.name.trim()) {
              selfOuts.push(item)
            }
          })
        }

        if (this.centuryInputList.length) {
          this.centuryInputList.forEach(item => {
            if (item.name && item.name.trim()) {
              selfOuts.push(item)
            }
          })
        }

        this.$logger.info('getSelfOuts ', selfOuts)
        return selfOuts
      },
      domFn(key, currentChoose) {
        this.currentObjective = { ...currentChoose }
        this.quickWord = key.split(' ')[0]
        this.commandTermForm.name = this.quickWord
        this.showQuickWordCreate = false
        // KnowledgeTermTagQueryByKeywords({
        //   keywords: this.quickWord
        // }).then(res => {
        //   if (res.success) {
        //     this.commandTerms = res.result.filter(item => item.type === 1)
        //     this.knowledgeTags = res.result.filter(item => item.type === 2)
        //   }
        // })
      },
      handleCloseObjectiveTag(item, key, tagIndex) {
        item[key].splice(tagIndex, 1)
        console.log(item)
        this.$forceUpdate()
      },
      handleQuickWordSet(res, key) {
        console.log(res)
        setTimeout(() => {
          this.$refs.quickModal.style.display = 'none'
        }, 200)
        this.$emit('addCustomTag', res)
        const find = this.knowledgeList.find(item => item.knowledgeId === this.currentObjective.knowledgeId)
        if (find) {
          if (find[key]) {
            if (!find[key].find(item => item.id === res.id)) {
              find[key].push({
                id: res.id,
                name: res.word,
                bloomTag: res.bloomTag,
                knowledgeDimension: res.knowledgeDimension
              })
            }
          } else {
            this.$set(find, key, [{
              id: res.id,
              name: res.word,
              bloomTag: res.bloomTag,
              knowledgeDimension: res.knowledgeDimension
            }])
          }
        } else {
          let findInput = this.skillInputList.find(item => item.key === this.currentObjective.key)
          if (!findInput) {
            findInput = this.knowledgeInputList.find(item => item.key === this.currentObjective.key)
            if (!findInput) {
              findInput = this.centuryInputList.find(item => item.key === this.currentObjective.key)
            }
          }
          if (findInput && findInput[key]) {
            if (!findInput[key].find(item => item.id === res.id)) {
              findInput[key].push({
                id: res.id,
                name: res.word,
                bloomTag: res.bloomTag,
                knowledgeDimension: res.knowledgeDimension
              })
            }
          } else {
            this.$set(findInput, key, [{
              id: res.id,
              name: res.word,
              bloomTag: res.bloomTag,
              knowledgeDimension: res.knowledgeDimension
            }])
          }
        }
      },
      handleSaveCommanTerm(res) {
        this.handleQuickWordSet(res, 'commandTerms')
      },
      handleChangeLevel(val, tag) {
        if (val) {
          tag[val.type] = val.title
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .objectives-wrapper {
    .objectives-list {
      position: relative;

      .delete-action {
        cursor: pointer;
        position: absolute;
        right: -30px;
        width: 30px;
        top: 10px;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: row;
      }
      &:hover {
        .delete-action {
          display: flex;
        }
      }

      .skt-description-sub-list {
        max-height: 300px;
        overflow-y: scroll;
        border: 1px solid #f9f9f9;
      }
      .objectives-list-item {
        background: #fff;
        width: 100%;
        opacity: 1;
        //border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 10px;
        position: relative;
        color: #000000;
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.16);

        &:hover {
          color: @primary-color;
        }
        .skt-description {
          cursor: pointer;
          width: 98%;
          padding-right: 10px;
          line-height: 22px;
          position: relative;
          color: #444444;
          .description-txt {
            padding: 10px;
            border: 1px dashed #666;
            line-height: 24px;
            color: #11142D;
            display: inline-block;
            width: 100%;
          }
        }
        .skt-description-21{
          width: 90%;
        }

        .skt-description-tag-list {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 5px 10px;
          .tag-list-item {
            margin: 3px 10px 3px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
            cursor: pointer;
            .tag-item {
              cursor: pointer;
              border-radius: 10px;
              word-break:normal;
              width:auto;
              display:block;
              white-space:pre-wrap;
              word-wrap : break-word ;
              overflow: hidden ;
              padding-bottom: 3px;
              /deep/ .anticon-close{
                color: rgba(239, 78, 78, 1);
              }
            }
          }

          .skill-mode {
            .tag-item {
              //background-color: rgba(21, 195, 154, 0.1);
              color: #000000;
              //border: 1px solid rgba(21, 195, 154, 1);
              background: #FF933C;
              border: 1px solid #92B2D1;
            }
          }

        }
        .actions{
          display: flex;
          align-items: center;
          .add-action {
            display: flex;
            cursor:pointer;
            height: 20px;
            img {
              width: 20px;
            }
          }
          .up-down{
            cursor: pointer;
            display: flex;
            width: 20px;
            margin-left: 8px;
          }
        }
      }
      .objectives-list-item-skill{
        //background: #FEF3E4;
        //border: 1px solid #EED1AA;
        color: #FF786D;
        border-left: 10px solid #FF786D;
        //border-radius: 10px;
      }
      .objectives-list-item-learn{
        //background: #47A3E4;
        //border: 1px solid #B1D1CC;
        color: #47A3E4;
        border-left: 10px solid #47A3E4;
        //opacity: 1;
        //border-radius: 10px;
      }
      .objectives-list-item-21{
        //background: #FF933C;
        //border: 1px solid #92B2D1;
        //opacity: 1;
        //border-radius: 10px;
        color: #FF933C;
        border-left: 10px solid #FF933C;
      }
    }
  }

  .search-tag-list {
    height: 300px;
    overflow-y: scroll;
    .search-description-item {
      margin-bottom: 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border: 1px solid rgba(216, 216, 216, 1);
      opacity: 1;
      border-radius: 4px;
      .description-info {
        padding: 10px;
        .info-detail {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .info-checked {
            color: #15C39A;
          }
        }
      }
    }

    .selected-item {
      background: rgba(21, 195, 154, 0.1);
      border: 1px solid #15C39A;
      opacity: 1;
      border-radius: 4px;
    }
  }

  .ensure-setting-modal {
    margin-bottom: 30px;
    .tips {
      text-align: center;
      margin-bottom: 20px;
      font-family: Inter-Bold;
      font-size: 15px;
      color: #474747;
    }

    .modal-ensure-action-line-center {
      width: 40%;
      display: flex;
      justify-content: space-between;
      margin: 0px auto;
      margin-top: 40px;
    }
  }

  .customize-objectives-list {
    .objectives-input-item {
      position: relative;
      margin-bottom: 10px;

      .skill-input, .knowledge-input, .century-input {
        width: 100%;
      }
      .self-out-delete-icon {
        cursor: pointer;
        position: absolute;
        right: -30px;
        width: 30px;
        top: 10px;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: row;
      }

      &:hover {
        .self-out-delete-icon {
          display: flex;
        }
      }
    }
  }

  .category-name {
    line-height: 25px;
    padding-bottom: 5px;
    cursor: pointer;
    font-weight: bold;
    color: #999;
  }

  .quick-keyword-con {
    border: 1px solid #dfdfdf;
    background: #fff;
    padding: 5px 10px;
    // width: 330px;
  }

  .objectives-tag {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    .objectives-tag-type {
      .objectives-tag-title {
        width: 110px;
        color: #333;
      }
      .objectives-tag-content {
        display: flex;
        flex-wrap: wrap;
        .objectives-tag-item {
          margin: 3px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>

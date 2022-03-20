<template>
  <div class="tag-ui">
    <div class="objectives-wrapper">
      <a-row class="objectives-wrapper-block">
        <div class="title-item title-skill">Achievement objectives</div>
        <template v-if="getknowledgeListType(TagType.skill).length > 0" >
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.skill)" :key="index">
            <div class="objectives-list-item objectives-list-item-skill objectives-list-item-top-fixed">
              <!--              <a-breadcrumb separator=">">-->
              <!--                <a-breadcrumb-item v-for="item in dealPath(k.path)" :key="item">{{ item }}</a-breadcrumb-item>-->
              <!--              </a-breadcrumb>-->
              <div class="skt-description" @dblclick="handleAddTag(k)">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
            </div>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No">
              <span class="delete-action" >
                <img src="~@/assets/icons/tag/delete.png"/>
              </span>
            </a-popconfirm>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item objectives-input-item-skill"
            v-for='(skillInput, sIdx) in skillInputList'
            :key='sIdx'>
            <a-input v-model='skillInput.name' class='skill-input' />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm='handleDeleteSkill(skillInput)' cancel-text="No">
              <img class='self-out-delete-icon' src="~@/assets/icons/tag/delete.png" alt=''/>
            </a-popconfirm>
          </div>
          <div class='customize-objectives-list-add-btn'>
            <a-tooltip placement="top" title="Add custom content">
              <add-green-icon class='add-input input-icon' @click='handleAddNew(TagType.skill, skillInputList)'/>
            </a-tooltip>
          </div>
        </div>
      </a-row>

      <a-row class="objectives-wrapper-block">
        <div class="title-item title-learnout">Learning outcomes</div>
        <template v-if="getknowledgeListType(TagType.knowledge).length > 0" >
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.knowledge)" :key="index">
            <div class="objectives-list-item objectives-list-item-learn objectives-list-item-top-fixed">
              <div class="skt-description" @dblclick="handleAddTag(k)">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
            </div>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No">
              <span class="delete-action" >
                <img src="~@/assets/icons/tag/delete.png"/>
              </span>
            </a-popconfirm>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item objectives-input-item-skill"
            v-for='(knowledgeInput, sIdx) in knowledgeInputList'
            :key='sIdx'>
            <a-input v-model='knowledgeInput.name' class='knowledge-input' />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm='handleDeleteKnowledge(knowledgeInput)' cancel-text="No">
              <img class='self-out-delete-icon' src="~@/assets/icons/tag/delete.png" />
            </a-popconfirm>
          </div>
          <div class='customize-objectives-list-add-btn'>
            <a-tooltip placement="top" title="Add custom content">
              <add-green-icon class='add-input input-icon' @click='handleAddNew(TagType.knowledge, knowledgeInputList)'/>
            </a-tooltip>
          </div>
        </div>
      </a-row>

      <a-row class="objectives-wrapper-block">
        <div class="title-item title-21">
          <template v-if="$store.getters.bindCurriculum === AllCurriculums.NZ">
            Key competencies
          </template>
          <template v-else-if="$store.getters.bindCurriculum === AllCurriculums.AU">
            General capabilities
          </template>
          <template v-else>
            21st Century Skills
          </template>
        </div>
        <template v-if="getknowledgeListType(TagType.century).length > 0" >
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.century)" :key="index">
            <div class="objectives-list-item objectives-list-item-21 objectives-list-item-top-fixed" @click="handleActiveDescription(TagType.century,k)">
              <!--              <a-breadcrumb separator=">">-->
              <!--                <a-breadcrumb-item v-for="item in dealPath(k.path)" :key="item">{{ item }}</a-breadcrumb-item>-->
              <!--              </a-breadcrumb>-->
              <div class="skt-description skt-description-21" @dblclick="handleAddTag(k)">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
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
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(k)" cancel-text="No">
              <span class="delete-action" >
                <img src="~@/assets/icons/tag/delete.png"/>
              </span>
            </a-popconfirm>
          </div>
        </template>
        <div class='customize-objectives-list'>
          <div
            class="objectives-input-item objectives-input-item-skill"
            v-for='(centuryInput, sIdx) in centuryInputList'
            :key='sIdx'>
            <a-input v-model='centuryInput.name' class='century-input' />
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteCentury(centuryInput)" cancel-text="No">
              <img class='self-out-delete-icon' src="~@/assets/icons/tag/delete.png" />
            </a-popconfirm>
          </div>
          <div class='customize-objectives-list-add-btn'>
            <a-tooltip placement="top" title="Add custom content">
              <add-green-icon class='add-input input-icon' @click='handleAddNew(TagType.century, centuryInputList)'/>
            </a-tooltip>
          </div>
        </div>
      </a-row>
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

  </div>

</template>

<script>
  import * as logger from '@/utils/logger'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import LearnOutAddTag from '@/components/UnitPlan/LearnOutAddTag'
  import { TagType, AllCurriculums } from '@/const/common'
  import { getAll21Century } from '@/api/knowledge'
  import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'

  export default {
    name: 'UiLearnOut',
    components: {
      LearnOutAddTag,
      NoMoreResources,
      AddGreenIcon
    },
    props: {
      learnOuts: {
        type: Array,
        default: () => []
      },
      selfOuts: {
        type: Array,
        default: () => []
      }
    },
    mounted () {

    },
    destroyed () {

    },
    computed: {
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
        AllCurriculums: AllCurriculums
      }
    },
    created () {
      this.knowledgeList = this.learnOuts
      logger.info('knowledgeList ', this.knowledgeList)
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

      initSelfOuts () {
        this.$logger.info('initSelfOuts', this.selfOuts)
        const skillInputList = this.selfOuts.filter(item => item.tagType === TagType.skill)
        const knowledgeInputList = this.selfOuts.filter(item => item.tagType === TagType.knowledge)
        const centuryInputList = this.selfOuts.filter(item => item.tagType === TagType.century)

        if (skillInputList.length) {
          this.skillInputList = skillInputList
        } else {
          this.skillInputList.push({
            name: '',
            tagType: TagType.skill,
            key: Math.random() + ''
          })
        }
        this.$logger.info('skillInputList', this.skillInputList)

        if (knowledgeInputList.length) {
          this.knowledgeInputList = knowledgeInputList
        } else {
          this.knowledgeInputList.push({
            name: '',
            tagType: TagType.knowledge,
            key: Math.random() + ''
          })
        }
        this.$logger.info('knowledgeInputList', this.skillInputList)

        if (centuryInputList.length) {
          this.centuryInputList = centuryInputList
        } else {
          this.centuryInputList.push({
            name: '',
            tagType: TagType.century,
            key: Math.random() + ''
          })
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
      getknowledgeListType (type) {
        if (type === TagType.skill) {
          return this.knowledgeList.filter(item => item.tagType === TagType.skill || item.tagType === TagType.ibSkill || item.tagType === TagType.idu)
        } else if (type === TagType.century) {
          return this.knowledgeList.filter(item => item.tagType === TagType.century ||
            item.tagType === TagType.common)
        } else {
          return this.knowledgeList.filter(item => item.tagType === type)
        }
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
          key: Math.random() + '',
          tagType: tagType
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
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .ant-cascader-menu{
    max-width: 300px;
  }

  .objectives-wrapper {
    .objectives-wrapper-block{
      margin-bottom: 15px;
      .title-item{
        font-size: 20px;
        //font-family: Leelawadee UI;
        font-weight: 500;
        line-height: 24px;
        opacity: 1;
        margin-bottom: 10px;
      }
      .title-skill{
        color: #FF978E;
      }
      .title-learnout{
        color: #B1D1CC;
      }
      .title-21{
        color: #92B2D1
      }
    }
    .objectives-list {
      //display: flex;
      //flex-direction: row;
      //align-items: center;
      //justify-content: flex-start;
      position: relative;
       &:hover{
        .delete-action {
          display: block;
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
          //border: 1px solid @primary-color !important;
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
              background: #D7E0E9;
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
        color: #FF978E;
        border-left: 10px solid #FF978E;
        //border-radius: 10px;
      }
      .objectives-list-item-learn{
        //background: #D4EBE7;
        //border: 1px solid #B1D1CC;
        color: #D4EBE7;
        border-left: 10px solid #D4EBE7;
        //opacity: 1;
        //border-radius: 10px;
      }
      .objectives-list-item-21{
        //background: #D7E0E9;
        //border: 1px solid #92B2D1;
        //opacity: 1;
        //border-radius: 10px;
        color: #D7E0E9;
        border-left: 10px solid #D7E0E9;
      }
      .delete-action {
        position: absolute;
        top:5px;
        right: -35px;
        display: none;
        cursor: pointer;
        height: 35px;
        img {
          width: 35px;
        }
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
      padding-left: 2px;
      position: relative;
      margin-top: 10px;
      margin-bottom: 10px;

      img.input-icon {
        position: absolute;
        top: 3px;
        right: -30px;
        cursor: pointer;
        width: 17px;
      }

      img.self-out-delete-icon {
        position: absolute;
        top: 0;
        right: -35px;
        cursor: pointer;
        width: 35px;
        display: none;
      }

      &:hover {
        img.self-out-delete-icon {
          display: block;
        }
      }

      svg.input-icon {
        position: absolute;
        top: 3px;
        right: -30px;
        cursor: pointer;
        width: 20px;
      }
    }

    .customize-objectives-list-add-btn {
      svg {
        width: 20px;
        height: 20px;
        user-select: none;
        border: none;
        cursor: pointer;
        &:focus {
          border: none;
          outline: none;
        }
      }
    }
    .skill-input {
      border: 1px solid #FF978E;
      box-shadow: 0 0 0 2px rgba(255, 151, 142, 0.2);
    }

    .knowledge-input {
      border: 1px solid #D4EBE7;
      box-shadow: 0 0 0 2px rgba(212, 235, 231, 0.2);
    }

    .century-input {
      border: 1px solid #D7E0E9;
      box-shadow: 0 0 0 2px rgba(215, 224, 225, 0.2);
    }
  }
</style>

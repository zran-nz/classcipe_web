<template>
  <div class="tag-ui">
    <a-col>

      <div class="objectives-wrapper">
        <a-row class="objectives-wrapper-block" v-if="getknowledgeListType(TagType.skill).length > 0" >
          <div class="title-item title-skill">Assessment objectives</div>
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.skill)" :key="index">
            <div class="objectives-list-item objectives-list-item-skill objectives-list-item-top-fixed">
              <!--              <a-breadcrumb separator=">">-->
              <!--                <a-breadcrumb-item v-for="item in dealPath(k.path)" :key="item">{{ item }}</a-breadcrumb-item>-->
              <!--              </a-breadcrumb>-->
              <div class="skt-description">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
            </div>
          </div>
        </a-row>

        <a-row class="objectives-wrapper-block" v-if="getknowledgeListType(TagType.knowledge).length > 0" >
          <div class="title-item title-learnout">Learning outcomes</div>
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.knowledge)" :key="index">
            <div class="objectives-list-item objectives-list-item-learn objectives-list-item-top-fixed">
              <!--              <a-breadcrumb separator=">">-->
              <!--                <a-breadcrumb-item v-for="item in dealPath(k.path)" :key="item">{{ item }}</a-breadcrumb-item>-->
              <!--              </a-breadcrumb>-->
              <div class="skt-description">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
            </div>
          </div>
        </a-row>

        <a-row class="objectives-wrapper-block" v-if="getknowledgeListType(TagType.century).length > 0" >
          <div class="title-item title-21">21centruy skill</div>
          <div class="objectives-list" v-for="(k,index) in getknowledgeListType(TagType.century)" :key="index">
            <div class="objectives-list-item objectives-list-item-21 objectives-list-item-top-fixed" @click="handleActiveDescription(TagType.century,k)">
              <!--              <a-breadcrumb separator=">">-->
              <!--                <a-breadcrumb-item v-for="item in dealPath(k.path)" :key="item">{{ item }}</a-breadcrumb-item>-->
              <!--              </a-breadcrumb>-->
              <div class="skt-description skt-description-21">
                <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
              </div>
              <a-divider style="margin: 10px 0px" v-if="k.tagListVisible" />
              <div class="skt-description-tag-list" v-if="k.tagListVisible">
                <div :class="{'tag-list-item': true,'skill-mode': true}" v-for="name in k.tags" :key="name">
                  <a-tag class="tag-item" :closable="true" @close="handleDeleteTag(k,name)">{{ name }}</a-tag>
                </div>
              </div>
            </div>
          </div>
        </a-row>

      </div>

    </a-col>

    <a-modal
      v-model="addTagVisible"
      :footer="null"
      destroyOnClose
      width="800px">
      <div class="my-modal-title" slot="title">
        Add tag
      </div>
      <learn-out-add-tag @handle-select-tags="handleEnsureTags" :knowledge="knowledge" />
    <!--      <div class="modal-ensure-action-line-right" style="justify-content: center">
        <a-button class="action-item action-cancel" shape="round" @click="addTagVisible = false">Cancel</a-button>
        <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Confirm</a-button>
      </div>-->
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
              change-on-select/>
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
  import { TagType } from '@/const/common'
  import { getAll21Century } from '@/api/knowledge'

  export default {
    name: 'UiLearnOutSub',
    components: {
      LearnOutAddTag,
      NoMoreResources
    },
    props: {
      learnOuts: {
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
        centuryList: []
      }
    },
    created () {
      this.knowledgeList = this.learnOuts
      logger.info('knowledgeList ', this.knowledgeList)
      this.get21century()
    },
    watch: {
    },
    methods: {
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
      },
      handleAddCenturyTag () {
        this.centuryTagList.push([])
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
      margin-bottom: 10px;
      .title-item{
        font-size: 16px;
        //font-family: Leelawadee UI;
        font-weight: 500;
        line-height: 20px;
        opacity: 1;
        margin-bottom: 10px;
      }
      .title-skill{
        color: #474747;
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
        width: 100%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 10px;
        position: relative;
        color: #000000;
        &:hover {
          color: @primary-color;
          border: 1px solid @primary-color !important;
        }
        .skt-description {
          cursor: pointer;
          width: 98%;
          padding-right: 10px;
          line-height: 22px;
          position: relative;
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
        background: #FEF3E4;
        border: 1px solid #EED1AA;
        opacity: 1;
        border-radius: 10px;
      }
      .objectives-list-item-learn{
        background: #D4EBE7;
        border: 1px solid #B1D1CC;
        opacity: 1;
        border-radius: 10px;
      }
      .objectives-list-item-21{
        background: #D7E0E9;
        border: 1px solid #92B2D1;
        opacity: 1;
        border-radius: 10px;
      }
      .delete-action {
        position: absolute;
        top:0px;
        right: 0px;
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
      margin-bottom: 16px;
      font-family: Inter-Bold;
      font-size: 13px;
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
</style>

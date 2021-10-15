<template>
  <div class="tag-ui">
    <a-col span="24">

      <div class="skt-description-list-wrapper">
        <a-row >
          <a-col span="24">
            <div class="skt-description-list" v-for="(k,index) in KnowledgeList" :key="index">
              <div class="skt-description-tag-item skt-description-tag-item-top-fixed" @click="handleActiveDescription(index)">
                <div class="skt-description" @dblclick="handleAddTag(k)">
                  {{ k.name }}
                </div>
                <div
                  v-if="k.tagType == TagType.knowledge || k.tagType == TagType.century"
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
                    <a-tag class="tag-item" :closable="true" @close="handleDeleteTag(index,name)">{{ name }}</a-tag>
                  </div>
                </div>
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(index)" cancel-text="No">
                <span class="delete-action" >
                  <img src="~@/assets/icons/tag/delete.png"/>
                </span>
              </a-popconfirm>
            </div>
          </a-col>
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
              :fieldNames="{ label: 'name', value: 'name', children: 'children' }"
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
    name: 'UiLearnOut',
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
    },
    data () {
      return {
        KnowledgeList: [],
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
      this.KnowledgeList = this.learnOuts
      logger.info('KnowledgeList ', this.KnowledgeList)
      this.get21century()
    },
    watch: {
    },
    methods: {
      handleActiveDescription (index) {
        if (this.KnowledgeList[index].tagType !== TagType.knowledge &&
          this.KnowledgeList[index].tagType !== TagType.century) {
          return
        }
        if (!this.KnowledgeList[index].tagListVisible) {
          this.KnowledgeList[index].tagListVisible = true
        } else {
          this.KnowledgeList[index].tagListVisible = false
        }
        this.$set(this.KnowledgeList, index, this.KnowledgeList[index])
        logger.info('tagListVisible ', this.KnowledgeList[index].tagListVisible)
      },
      handleDeleteTag (kIndex, tagName) {
        this.KnowledgeList[kIndex].tags.splice(this.KnowledgeList[kIndex].tags.indexOf(tagName), 1)
        // this.$emit('set-learn-outs', this.KnowledgeList)
      },

      handleDeleteKnowledgeItem (index) {
        const data = this.KnowledgeList[index]
        this.KnowledgeList.splice(index, 1)
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
        const index = this.KnowledgeList.findIndex(item => item.knowledgeId === this.knowledge.knowledgeId)
        this.KnowledgeList[index].tagListVisible = true
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
      get21century () {
        getAll21Century({
        }).then((response) => {
          this.$logger.info('getAll21Century response', response)
          if (response.success) {
             this.centuryList = response.result
          }
        }).finally(() => {
          this.subTreeLoading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .ant-cascader-menu{
    max-width: 300px;
  }

  .skt-description-list-wrapper {
    .skt-description-list {
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
      .skt-description-tag-item {
        width: 610px;
        background: #FFFFFF;
        border: 1px solid #15C39A;
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
        &:hover {
          color: @primary-color;
          border: 1px solid @primary-color !important;
        }
        .skt-description {
          cursor: pointer;
          width: 90%;
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
              background-color: rgba(21, 195, 154, 0.1);
              color: rgba(21, 195, 154, 1);
              border: 1px solid rgba(21, 195, 154, 1);
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
      .delete-action {
        position: absolute;
        right: -50px;
        top:5px;
        display: none;
        cursor: pointer;
        height: 40px;
        img {
          width: 40px;
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
</style>

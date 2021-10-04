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
                  v-if="k.tagType != TagType.century"
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
      width="1000px">
      <div class="my-modal-title" slot="title">
        Add tag
      </div>
      <learn-out-add-tag @handle-select-tags="handleEnsureTags" :knowledge="knowledge" />
      <!--      <div class="modal-ensure-action-line-right" style="justify-content: center">
        <a-button class="action-item action-cancel" shape="round" @click="addTagVisible = false">Cancel</a-button>
        <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Confirm</a-button>
      </div>-->
    </a-modal>

  </div>

</template>

<script>
  import * as logger from '@/utils/logger'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import LearnOutAddTag from '@/components/UnitPlan/LearnOutAddTag'
  import { TagType } from '@/const/common'

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
        knowledge: {},
        tags: [],
        TagType: TagType
      }
    },
    created () {
      this.KnowledgeList = this.learnOuts
      logger.info('KnowledgeList ', this.KnowledgeList)
    },
    watch: {
    },
    methods: {
      handleActiveDescription (index) {
        if (this.KnowledgeList[index].tagType === TagType.century) {
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
        if (knowLedge.tagType === TagType.century) {
          return
        }
        this.knowledge = knowLedge
        this.addTagVisible = true
      },
      handleEnsureSelectData () {
        this.addTagVisible = false
        // this.knowledge.tags = this.tags
      },
      handleEnsureTags (tags) {
        this.knowledge.tags = tags
      }
    }
  }
</script>

<style lang="less" scoped>

  @import "~@/components/index.less";

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

</style>

<template>
  <div class="common-link">
    <div class="link-group-wrapper">
      <template v-if="!linkGroupList.length && !linkGroupLoading">
        <!-- 初次加载显示一个默认的空link面板-->
        <div class="link-group">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text" v-if="defaultGroupNameEditMode === 'view'">{{ defaultGroupName ? defaultGroupName : 'Untitled Term' }}</div>
                  <div class="group-name-input" v-if="defaultGroupNameEditMode === 'edit'">
                    <input v-model="defaultGroupName" class="group-name-input"/>
                  </div>
                </div>
                <div class="group-edit-icon" @click="handleToggleEditDefaultGroupName">
                  <a-icon type="edit" v-if="defaultGroupNameEditMode === 'view'"/>
                  <a-icon type="check" v-if="defaultGroupNameEditMode === 'edit'"/>
                </div>
              </div>
              <div class="group-right-info">
                <div class="group-action">
                  <a-button type="primary" @click="handleDefaultGroupLink">
                    <div class="btn-text" style="line-height: 20px">
                      + Link
                    </div>
                  </a-button>
                </div>
              </div>
            </div>
            <div class="group-body">
              <div class="group-link-item"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="linkGroupList.length && !linkGroupLoading">
        <div class="link-group" v-for="(linkGroup, lIndex) in linkGroupList">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name"></div>
                <div class="group-edit-icon"></div>
              </div>
              <div class="group-right-info">
                <div class="group-action"></div>
              </div>
            </div>
            <div class="group-body">
              <div class="group-link-item"></div>
            </div>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>

import { GetAssociate } from '@/api/teacher'

export default {
  name: 'CommonLink',
  props: {
    fromType: {
      type: Number,
      required: true
    },
    fromId: {
      type: String,
      required: true
    },
    filterType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 初次加载显示一个默认的空link面板
      defaultGroupName: 'Untitled Term',
      defaultGroupNameEditMode: 'view',
      defaultGroupOtherContents: [],

      linkGroupLoading: true,
      linkGroupList: [],

      groupLinkModalVisible: false
    }
  },
  created () {
    this.$logger.info('load CommonLink with id[' + this.fromId + '] fromType[' + this.fromType + ']')
    this.getAssociate()
  },
  methods: {
    getAssociate () {
      this.$logger.info('GetAssociate id[' + this.fromId + '] fromType[' + this.fromType + ']')
      GetAssociate({
        id: this.fromId,
        type: this.fromType
      }).then(response => {
        this.$logger.info('CommonLink GetAssociate response', response)
        const owner = response.result.owner
        const others = response.result.others
      }).finally(() => {
        this.linkGroupLoading = false
      })
    },

    handleToggleEditDefaultGroupName () {
      this.$logger.info('handleToggleEditDefaultGroupName ' + this.defaultGroupNameEditMode)
      this.defaultGroupNameEditMode = this.defaultGroupNameEditMode === 'view' ? 'edit' : 'view'
    },

    handleDefaultGroupLink () {
      this.$logger.info('handleDefaultGroupLink')
      this.groupLinkModalVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.common-link {
  .link-group-wrapper {
    .link-group {
      .group-item {
        .group-header {
          background-color: rgba(21, 195, 154, 0.1);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          .group-left-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            .group-name {
              padding-right: 5px;
              cursor: pointer;
              .group-name-text {
                font-family: Inter-Bold;
                font-size: 14px;
                font-family: Inter-Bold;
                line-height: 26px;
                color: #000000;
              }

              .group-name-input {
                padding: 0 5px;
                outline: none;
                font-size: 14px;
                font-family: Inter-Bold;
                line-height: 26px;
                box-sizing: border-box;
                color: #000000;
                width: 200px;
                border: none;
                background: #fff;
              }
            }

            .group-edit-icon {
              padding-left: 5px;
              cursor: pointer;
            }
          }

          .group-right-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            .group-action {

            }
          }
        }
      }
    }
  }
}
</style>

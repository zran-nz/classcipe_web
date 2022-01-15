<template>
  <div class="common-link">
    <div class="link-group-wrapper">
      <template v-if="ownerLinkGroupList.length">
        <div class="link-group" v-for="(linkGroup, lIndex) in ownerLinkGroupList" :key="lIndex" :data-group="JSON.stringify(ownerLinkGroupList)">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <!-- unit plan下才有term概念,task不显示对应的操作和term名称-->
                <template v-if="shareContent.plan">
                  <div class="group-name">
                    <div class="group-name-text" v-if="!linkGroup.editing">
                      {{ linkGroup.group ? linkGroup.group : 'Untitled category ' }}
                    </div>
                  </div>
                  <div class="group-edit-icon">
                  </div>
                </template>
                <template v-else>
                  <div class="group-name">
                    <div class="group-name-text">
                      {{ linkGroup.group }}
                    </div>
                  </div>
                </template>
              </div>
              <div class="group-right-info">
              </div>
            </div>
            <div class="group-body">
              <div class="group-link-item" v-for="item in linkGroup.contents" :key="item.id">
                <div class="left-info">
                  <div class="icon">
                    <content-type-icon :type="item.type"/>
                  </div>
                  <div class="name">
                    <a-tooltip placement="top">
                      {{ item.name ? item.name : 'untitled' }}
                    </a-tooltip>
                  </div>
                </div>
                <div class="right-info">
                  <div class="date">{{ item.createTime | dayjs }}</div>
                  <div class="status">
                    <template v-if="item.status === 0">Draft</template>
                    <template v-if="item.status === 1">Published</template>
                  </div>
                  <div class="more-action-wrapper action-item-wrapper">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
      <template v-if="othersLinkGroupList.length">
        <div class="link-group" data-group="othersLinkGroupList">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text">Linked by others</div>
                </div>
              </div>
            </div>
            <div class="group-body">
              <div class="group-link-item" v-for="(item,index) in othersLinkGroupList" :key="index">
                <div class="left-info">
                  <div class="icon">
                    <content-type-icon :type="item.type"/>
                  </div>
                  <div class="name" >
                    <a-tooltip placement="top">
                      <template slot="title">
                        {{ item.name ? item.name : 'untitled' }}
                      </template>
                      {{ item.name ? item.name : 'untitled' }}
                    </a-tooltip>
                  </div>
                </div>
                <div class="right-info">
                  <div class="date">{{ item.createTime | dayjs }}</div>
                  <div class="status">
                    <template v-if="item.status === 0">Draft</template>
                    <template v-if="item.status === 1">Published</template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

export default {
  name: 'ShareContentLink',
  components: { ContentTypeIcon },
  props: {
    shareContent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      typeMap: typeMap,
      ownerLinkGroupList: [],
      othersLinkGroupList: [],
      selectedList: [],
      groupNameList: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const groupNameList = []
      this.shareContent.associateVo.owner.forEach(item => {
        if (groupNameList.indexOf(item.group) === -1) {
          groupNameList.push(item.group)
        }
        item.editing = false
      })
      this.ownerLinkGroupList = this.shareContent.associateVo.owner.sort((a, b) => a.group.indexOf('Unit Plan') !== -1 ? -1 : 1)
      this.othersLinkGroupList = []
      this.selectedList = []
      this.ownerLinkGroupList.forEach(group => {
        group.contents.forEach(content => {
          this.selectedList.push(content.type + '-' + content.id)
        })
      })
      this.$logger.info('ownerLinkGroupList', this.ownerLinkGroupList)
      this.shareContent.associateVo.others.forEach(item => {
        this.othersLinkGroupList.unshift(...item.contents)
      })
      this.$logger.info('othersLinkGroupList', this.othersLinkGroupList)
      if (groupNameList.length) {
        this.groupNameList = groupNameList
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.common-link {
  .link-group-wrapper {
    .link-group {
      margin-bottom: 25px;
      .group-item {
        .group-header {
          background-color: #C3EAFC;
          display: flex;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
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
              color: #fff;
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

        .group-body {
          .group-link-item {
            border-bottom: 1px solid #eee;
            padding: 10px;
            cursor: pointer;
            flex: 1;
            position: relative;

            .left-info {
              z-index: 50;
              display: flex;
              flex-direction: row;
              align-items: center;
              .icon {
                width: 40px;
              }
              &:hover{
                background-color: #fdfdfd;
                cursor: move;
              }

              .name {
                color: #000;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
              }

            }

            .right-info {
              z-index: 100;
              background-color: #fff;
              padding-top: 5px;
              padding-left: 40px;
              display: flex;
              font-size: 12px;
              flex-direction: row;
              align-items: center;
              .status {
                text-align: right;
                width: 70px;
              }
              .more-action-wrapper{
                width: 30px;
                display: flex;
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
}

.my-modal-title {
  text-align: center;
}

</style>

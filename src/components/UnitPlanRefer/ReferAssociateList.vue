<template>
  <div class="associate-preview">
    <a-row class="bottom-relative">
      <a-col span="24" class="content-type-filter">
        <a-radio-group v-model="activeUserType" button-style="solid" @change="handleUserTypeChange">
          <a-radio-button value="owner" class="left-button">
            {{ $t('teacher.unit-plan-preview.by-owner') }}
          </a-radio-button>
          <a-radio-button value="others" class="right-button">
            {{ $t('teacher.unit-plan-preview.by-others') }}
          </a-radio-button>
        </a-radio-group>
        <div class="content-type-list">
          <div class="toggle-mode-type-wrapper">
            <div class="toggle-mode-type">
              <div class="toggle-mode">
                <div :class="{'mode-item': true, 'skill-active-mode' : activeContentType === typeMap.task}" @click="handleSelectContentType(typeMap.task)">
                  {{ $t('teacher.unit-plan-preview.task') }}
                </div>
                <div :class="{'mode-item': true, 'knowledge-active-mode' : activeContentType === typeMap.lesson}" @click="handleSelectContentType(typeMap.lesson)">
                  {{ $t('teacher.unit-plan-preview.lesson') }}
                </div>
                <div :class="{'mode-item': true, 'general-active-mode' : activeContentType === typeMap.evaluation}" @click="handleSelectContentType(typeMap.evaluation)">
                  {{ $t('teacher.unit-plan-preview.evaluation') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col span="24" class="created-toggle">
        <div class="toggle-view-type">
          <div class="switch-icon">
            <div :class="{'icon-item': true, 'active-icon': dataListMode === 'list'}" @click="handleToggleDataListMode('list')">
              <list-mode-icon />
            </div>
            <div :class="{'icon-item': true, 'active-icon': dataListMode === 'card'}" @click="handleToggleDataListMode('card')">
              <pu-bu-icon />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col span="24">
        <div class="associate-info">
          <div class="associate-block-list" v-for="(item,index) in currentAssociateList" :key="index">
            <template v-if="item.type === activeContentType">
              <template v-if="dataListMode === 'list'">
                <div
                  class="question-item list-question-item"
                  v-for="(dataItem, dIndex) in item.datas"
                  v-if="item.datas.length"
                  :key="dIndex">
                  <div
                    :class="{
                      'list-item': true,
                      'browser-item': true,
                      'odd-line': index % 2 === 0,
                    }"
                    v-for="(listItem,lIndex) in dataItem.lists"
                    :key="lIndex">
                    <div class="item-name">
                      <dir-icon :content-type="dataItem.type" />
                      <span class="data-name" >
                        {{ listItem.name }}
                      </span>
                    </div>
                    <div class="arrow-item">
                      <span class="data-time">
                        {{ (listItem.updateTime || listItem.createTime) | dayjs }}
                      </span>
                      <div class="link-it" @click="handleLinkIt(listItem)">
                        <div class="link-item">
                          <img src="~@/assets/icons/myContent/Link_color.png" class="link-icon"/>
                          {{ 'Link this content to my Unit' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="dataListMode === 'card'">
                <div
                  class="question-item card-question-item"
                  v-for="(dataItem, dIndex) in item.datas"
                  v-if="item.datas.length"
                  :key="dIndex">
                  <div
                    :class="{
                      'my-card-list-item': true,
                      'card-item': true,
                      'browser-item': true,
                      'odd-line': index % 2 === 0,
                    }"
                    v-for="(listItem,lIndex) in dataItem.lists"
                    :key="lIndex">
                    <div class="cover-img-wrapper">
                      <div
                        class="cover-image"
                        :style="{backgroundImage: `url('${listItem.image}')` }"
                      >
                      </div>
                    </div>
                    <div class="item-intro">
                      <div class="page-info">
                        <span class="page-num-tag">
                          1/1
                        </span>
                      </div>
                      <div class="main-title">
                        {{ listItem.name ? listItem.name : 'Untitled' }}
                      </div>
                      <div class="sub-title">
                        {{ listItem.createTime | dayjs }}
                      </div>
                    </div>
                    <div class="item-action-wrapper">
                      <!-- refer mode -->
                      <div>
                        <div class="action-wrapper">
                          <div class="action-item">
                            <a-popconfirm :title="'Link ?'" ok-text="Yes" @confirm="handleLinkIt(item)" cancel-text="No">
                              <div class="link-item">
                                <img src="~@/assets/icons/myContent/Link_color.png" class="link-icon"/>
                                Link this content to my Unit
                              </div>
                            </a-popconfirm>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-list-tips" v-if="!item.datas.length">
                  <no-more-resources />
                </div>
              </template>
            </template>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row>

    </a-row>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import PuBuIcon from '@/assets/icons/library/pubu.svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import DataCardView from '@/components/Library/DataCardView'
import DirIcon from '@/components/Library/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
const { GetAssociate } = require('@/api/teacher')
export default {
  name: 'ReferAssociateList',
  props: {
    id: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    }
  },
  components: {
    NoMoreResources,
    DirIcon,
    DataCardView,
    ContentTypeIcon,
    PuBuIcon,
    ListModeIcon
  },
  data () {
    return {
      loading: true,
      associateData: null,
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: typeMap.task,
      activeUserType: 'owner',
      currentAssociateList: [],
      typeMap: typeMap,

      previewType: '',
      dataListMode: 'list'
    }
  },
  created () {
    console.info('Associate Preview id ' + this.id)
    this.loadAssociateData()
  },
  methods: {
    loadAssociateData () {
      console.info('loadAssociateData ' + this.id + ' ' + this.contentType)
      this.loading = true
      GetAssociate({
        id: this.id,
        type: this.contentType
      }).then((response) => {
        console.info('GetAssociate ', response)
        this.associateData = response.result
        this.currentAssociateList = this.associateData[this.activeUserType]
      }).then(() => {
        console.info('get favorite ' + this.id)
      }).finally(() => {
        this.loading = false
      })
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    handleSelectContentType (contentType) {
      console.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      console.info('handleSubPreviewClose')
      this.previewType = null
    },

    handleUserTypeChange (e) {
      console.info('handleUserTypeChange ' + this.activeUserType)
      this.currentAssociateList = this.associateData[this.activeUserType]
      console.info('currentAssociateList', this.currentAssociateList)
    },

    handleClickTitle (item) {
      console.info('handleClickTitle', item)
      this.previewType = typeMap['unit-plan']
    },

    handleLinkIt (item) {
      this.$logger.info('handleLinkIt', item)
      this.$emit('refer-associate', { item })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.associate-preview {
  padding: 15px 0 0 0;

  .bottom-relative {

    .content-type-filter {
      padding: 10px 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
      border: 1px solid #F7F8FF;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 6px;
      width: 100%;

      .content-type-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        .toggle-mode-type-wrapper {
          box-sizing: border-box;
          text-align: right;
          .toggle-mode-type {
            height: 35px;
            display: inline-block;
            border-radius: 35px;
            background: rgba(228, 228, 228, 0.3);

            .toggle-mode {
              border-radius: 35px;
              height: 35px;
              display: flex;
              flex-direction: row;
              font-size: 14px;

              //.mode-item:first-child {
              //  border-bottom-left-radius: 35px;
              //  border-top-left-radius: 35px;
              //}
              //
              //.mode-item:last-child {
              //  border-bottom-right-radius: 35px;
              //  border-top-right-radius: 35px;
              //}

              .mode-item {
                padding: 0 15px;
                font-size: 14px;
                height: 35px;
                color: rgba(17, 20, 45, 1);
                border-radius: 40px;
                font-family: Inter-Bold;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .skill-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }

              .knowledge-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }

              .general-active-mode {
                color: #fff;
                background: rgba(21, 195, 154, 1);
              }
            }
          }
        }
      }
    }

    .toggle-view-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .switch-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .icon-item {
          margin-left: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          svg {
            width: 22px;
            color: rgba(24, 37, 82, 1);
          }
        }

        .active-icon {
          svg {
            color: rgba(21, 195, 154, 1);
          }
        }
      }
    }
    .created-toggle {
      margin-top: 20px;
      margin-bottom: 15px;
    }

    .type-button {
      min-width: 70px;
      margin-right: 10px;
    }

    /deep/ .left-button {
      border-radius: 16px 0 0 16px;
    }

    /deep/ .right-button {
      border-radius: 0 16px 16px 0 ;
    }
  }

  .associate-info {
    box-sizing: border-box;
    background: rgba(228, 228, 228, 0.2);
    .associate-block-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 10px 0;

        .list-question-item {
          width: 100%;
        }
        .list-item {
          padding: 10px;
          cursor: pointer;
          width: 100%;
          flex-direction: row;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .data-name {
            font-family: Inter-Bold;
            font-weight: 500;
            color: #000;
          }

          .item-name {
            flex-direction: row;
            display: flex;
            align-items: center;
          }
          .arrow-item {
            flex-direction: row;
            display: flex;
            align-items: center;

            .data-time {
              padding-right: 20px;
              font-size: 10px;
            }

            .link-it {
              .link-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 5px 15px;
                border-radius: 35px;
                border: 1px solid rgba(21, 195, 154);
                font-family: Inter-Bold;
                color: rgba(21, 195, 154);
                font-size: 12px;
                background: rgba(21, 195, 154, 0.1);
                transition: all 0.3s ease;
                .link-icon {
                  margin-right: 5px;
                  width: 15px;
                }
              }

              .link-item:hover {
                background: rgba(228, 228, 228, 0.5);
              }
            }

            .edit-item-icon {
              padding: 0 7px;
              img {
                width: 15px;
                cursor: pointer;
              }
            }

            .edit-it {
              font-size: 14px;
              cursor: pointer;
            }
          }
        }

        .list-item:hover {
          color: rgba(255, 187, 0, 1);
          background: rgba(255, 187, 0, 0.1);
        }
    }
  }
}

.data-card-view {
  background: #FFFFFF;
  opacity: 1;
  height: 220px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;

  .card-cover {
    height: 150px;
    background-size: cover;
    background-position: center center;
  }

  .card-info {
    padding: 10px;

    .card-title {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
    }

    .card-time {
      height: 16px;
      font-size: 12px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      opacity: 0.5;
    }
  }

  .active-item {
  }
}

.card-action-item {
  padding: 0 10px 10px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .link-it {
    .link-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 5px 15px;
      border-radius: 35px;
      border: 1px solid #BCBCBC;
      font-family: Inter-Bold;
      color: #182552;
      font-size: 13px;
      background: rgba(228, 228, 228, 0.2);
      transition: all 0.3s ease;
      .link-icon {
        margin-right: 5px;
        width: 15px;
      }
    }

    .link-item:hover {
      background: rgba(228, 228, 228, 0.5);
    }
  }
}

.my-card-list-item {
  overflow: hidden;
  box-sizing: border-box;
  margin: 10px;
  width: 250px;
  position: relative;
  user-select: none;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;

  &:hover {
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 2px 1px @primary-color;
  }

  .cover-img-wrapper {
    border-radius: 6px;
    border: none;
    outline: none;
    .cover-image {
      border: none;
      outline: none;
      height: 150px;
      width: 250px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border-bottom: 1px solid #eee;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
    }
  }

  .item-intro {
    padding: 10px;
    display: flex;
    flex-direction: column;

    .page-info {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      align-items: center;
      .page-num-tag {
        display: inline;
        background: rgba(228, 228, 228, 0.5);
        padding: 1px 10px;
        border-radius: 16px;
        font-size: 8px;
        font-family: Segoe UI;
        font-weight: 400;
        color: #808191;
      }
    }

    .main-title {
      padding: 5px 0;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-title {
      font-size: 8px;
      font-family: Segoe UI;
      font-weight: 400;
      color: #808191;
    }
  }

  .item-action-wrapper {
    padding: 5px 10px 15px 10px;

    .action-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .action-item {
        display: inline;
        margin-right: 10px;
        user-select: none;
        .link-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 3px 15px;
          border-radius: 35px;
          background: rgba(21, 195, 154, 0.1);
          border: 1px solid #15C39A;
          color: #15C39A;
          display: flex;
          flex-direction: row;
          align-items: center;
          transition: all 0.3s ease;
          .link-icon {
            margin-right: 5px;
            width: 15px;
          }
        }

        .link-item:hover {
          background: rgba(21, 195, 154, 0.1);
        }
      }

      .refer-item {
        .refer-btn{
          background: rgba(21, 195, 154, 0.1);
          border: 1px solid #15C39A;
          border-radius: 20px;
          color: #15C39A;
          padding: 10px 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }
        .btn-icon {
          height: 10px;
          width: 10px;
        }
        .btn-icon-white {
          display: none;
        }
        .btn-icon-color {
          display: inline-block;
        }
        .btn-text {
          padding-left: 8px;
        }
      }

      .refer-btn:hover {
        background: #07AB84;
        color: #fff;
        .btn-icon-white {
          display: inline-block;
        }
        .btn-icon-color {
          display: none;
        }
      }
    }
  }
  .card-action-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    img {
      height: 18px;
    }
  }
}
</style>

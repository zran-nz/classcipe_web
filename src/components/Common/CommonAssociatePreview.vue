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
                <!--                <div :class="{'mode-item': true, 'knowledge-active-mode' : activeContentType === typeMap.lesson}" @click="handleSelectContentType(typeMap.lesson)">-->
                <!--                  {{ $t('teacher.unit-plan-preview.lesson') }}-->
                <!--                </div>-->
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
          <template v-if="dataListMode === 'list'">
            <div class="associate-block-list" v-for="(item,index) in currentAssociateList" :key="index" v-if="item.type === activeContentType">
              <div
                class="question-item list-question-item">
                <div
                  :class="{
                    'list-item': true,
                    'browser-item': true,
                    'odd-line': index % 2 === 0,
                  }">
                  <div class="item-name">
                    <dir-icon :content-type="item.type" />
                    <span class="data-name" @click="handleClickTitle(item)">
                      {{ item.name ? item.name : 'Untitled' }}
                    </span>
                  </div>
                  <div class="arrow-item">
                    <span class="data-time">
                      {{ (item.updateTime || item.createTime) | dayjs }}
                    </span>
                    <div class="edit-item-icon" @click="handleEditItem(item.type, item)">
                      <img src="~@/assets/icons/myContent/bianji@2x.png" />
                    </div>
                    <div class="star-it" @click="handleFavorite(item)">
                      <template v-if="item.createBy !== $store.getters.userInfo.email">
                        <img src="~@/assets/icons/common/preview/star_gray.png" v-if="!item.isFavorite" />
                        <img src="~@/assets/icons/common/preview/star_yellow.png" v-if="item.isFavorite" />
                      </template>
                    </div>
                    <div class="edit-it" @click="handleEditItem(item.type, item)">
                      <a-icon type="more" />
                    </div>
                  </div>
                </div>
              </div>
              <!--                <div class="no-list-tips" v-if="!item.datas.length">-->
              <!--                  <no-more-resources />-->
              <!--                </div>-->
            </div>
          </template>
          <template v-if="dataListMode === 'card'">
            <div class="associate-block-list associate-block-list-card">
              <div class="question-item card-question-item" v-for="(item,index) in currentAssociateList" :key="index" v-if="item.type === activeContentType">
                <div
                  :class="{
                    'card-item': true,
                    'browser-item': true,
                    'odd-line': index % 2 === 0,
                  }">
                  <data-card-view :title="item.name" :update-time="item.updateTime" :cover="item.image" :content-type="item.type"/>
                  <div class="card-action-item">
                    <div class="action-left">
                      <div class="edit-item-icon" @click="handleEditItem(item.type, item)">
                        <img src="~@/assets/icons/myContent/bianji@2x.png" />
                      </div>
                      <template v-if="item.createBy !== $store.getters.userInfo.email">
                        <div class="star-it" @click="handleFavorite(item)">
                          <img src="~@/assets/icons/common/preview/star_gray.png" v-if="!item.isFavorite" />
                          <img src="~@/assets/icons/common/preview/star_yellow.png" v-if="item.isFavorite" />
                        </div>
                      </template>
                    </div>
                    <div class="action-right">
                      <div class="edit-it" @click="handleEditItem(item.type, item)">
                        <a-icon type="more" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--              <div class="no-list-tips" v-if="!item.datas.length">
                <no-more-resources />
              </div>-->
          </template>
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
const { FavoritesAdd } = require('@/api/favorites')
const { GetAssociate } = require('@/api/teacher')
export default {
  name: 'CommonAssociatePreview',
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
    logger.info('Associate Preview id ' + this.id)
    this.loadAssociateData()
  },
  methods: {
    loadAssociateData () {
      logger.info('loadAssociateData ' + this.id + ' ' + this.contentType)
      this.loading = true
      GetAssociate({
        id: this.id,
        type: this.contentType
      }).then((response) => {
        logger.info('GetAssociate ', response)
        this.associateData = response.result
        this.handleUserTypeChange()
      }).then(() => {
        logger.info('get favorite ' + this.id)
      }).finally(() => {
        this.loading = false
      })
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    handleSelectContentType (contentType) {
      logger.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      logger.info('handleSubPreviewClose')
      this.previewType = null
    },

    handleUserTypeChange () {
      logger.info('handleUserTypeChange ' + this.activeUserType)
      const rawList = this.associateData[this.activeUserType]
      this.currentAssociateList = []
      rawList.forEach(item => {
        if (item.contents && item.contents.length) {
          item.contents.forEach(contentItem => {
            this.currentAssociateList.push(contentItem)
          })
        }
      })
      logger.info('currentAssociateList', this.currentAssociateList)
    },

    handleClickTitle (item) {
      logger.info('handleClickTitle', item)
      this.previewType = typeMap['unit-plan']
    },

    handleSubPreview (type, item) {
      logger.info('handleSubPreview', type, item)
      this.previewType = typeMap['unit-plan']
    },

    handleFavorite (item) {
      logger.info('handleFavorite', item)
      FavoritesAdd({
        sourceId: item.id,
        sourceType: item.type
      }).then(response => {
        logger.info('FavoritesAdd ', response)
        item.isFavorite = !item.isFavorite
      })
    },

    handleEditItem (type, item) {
      logger.info('handleEditItem', type, item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id
          , '_blank')
      }
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
              cursor: pointer;

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
      &.associate-block-list-card{
        display: flex;
        flex-wrap: wrap;
      }

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
            }

            .star-it {
              padding: 0 7px;
              img {
                cursor: pointer;
                width: 15px;
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

        .card-question-item {
          background: #FFFFFF;
          border: 1px solid #F7F8FF;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          width: 30%;
          margin: 10px;
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
  .action-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .star-it {
      padding: 0 7px;
      img {
        cursor: pointer;
        width: 15px;
      }
    }

    .edit-item-icon {
      padding: 0 7px;
      img {
        width: 15px;
        cursor: pointer;
      }
    }

  }

  .action-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .edit-it {
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>

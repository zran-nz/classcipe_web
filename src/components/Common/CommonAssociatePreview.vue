<template>
  <div class="associate-preview">
    <a-row class="bottom-relative">
      <a-col span="24" class="content-type-filter">
        <div class="content-type-list">
          <a-button :type="activeContentType === typeMap.task ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.task)" class="type-button">
            {{ $t('teacher.unit-plan-preview.task') }}
          </a-button>
          <a-button :type="activeContentType === typeMap.lesson ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.lesson)" class="type-button">
            {{ $t('teacher.unit-plan-preview.lesson') }}
          </a-button>
          <a-button :type="activeContentType === typeMap.evaluation ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.evaluation)" class="type-button">
            {{ $t('teacher.unit-plan-preview.evaluation') }}
          </a-button>
        </div>
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
      <a-col span="24" class="created-toggle">
        <a-radio-group v-model="activeUserType" button-style="solid" @change="handleUserTypeChange">
          <a-radio-button value="owner" class="left-button">
            {{ $t('teacher.unit-plan-preview.by-owner') }}
          </a-radio-button>
          <a-radio-button value="others" class="right-button">
            {{ $t('teacher.unit-plan-preview.by-others') }}
          </a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row>
      <a-col span="24">
        <div class="associate-info">
          <div class="associate-block-list" v-for="(item,index) in currentAssociateList" :key="index">
            <template v-if="item.type === activeContentType && item.datas">
              <template v-if="dataListMode === 'list'">
                <div
                  class="question-item"
                  v-for="(dataItem, dIndex) in item.datas"
                  :key="dIndex">
                  <div
                    :class="{
                      'browser-item': true,
                      'odd-line': index % 2 === 0,
                    }"
                    v-for="(listItem,lIndex) in dataItem.lists"
                    :key="lIndex">
                    <a-tooltip :mouseEnterDelay="1">
                      <template slot="title">
                        {{ listItem.name }}
                      </template>
                      <dir-icon :content-type="dataItem.type" />
                      <span class="data-name" @click="handleClickTitle(listItem)">
                        {{ listItem.name }}
                      </span>
                      <span class="data-time">
                        {{ (listItem.updateTime || listItem.createTime) | dayjs }}
                      </span>
                    </a-tooltip>
                    <div class="arrow-item">
                      <div class="star-it" @click="handleFavorite(listItem)">
                        <img src="~@/assets/icons/common/preview/star_gray.png" v-if="!listItem.isFavorite" />
                        <img src="~@/assets/icons/common/preview/star_yellow.png" v-if="listItem.isFavorite" />
                      </div>
                      <div class="edit-it" @click="handleEditItem(item.type, listItem)">
                        <a-icon type="more" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="dataListMode === 'card'">

                <div
                  class="question-item"
                  v-for="(dataItem, dIndex) in item.datas"
                  :key="dIndex">
                  <div
                    :class="{
                      'browser-item': true,
                      'odd-line': index % 2 === 0,
                    }"
                    v-for="(listItem,lIndex) in dataItem.lists"
                    :key="lIndex">
                    <data-card-view :title="listItem.name" :created-time="listItem.createdTime" :cover="listItem.image" />
                  </div>
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
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import DataCardView from '@/components/Library/DataCardView'
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
      activeContentType: typeMap.material,
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
        this.currentAssociateList = this.associateData[this.activeUserType]
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

    handleUserTypeChange (e) {
      logger.info('handleUserTypeChange ' + this.activeUserType)
      this.currentAssociateList = this.associateData[this.activeUserType]
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
      this.$message.success('Edit Item')
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
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      background: #FFFFFF;
      border: 1px solid #F7F8FF;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 6px;
      width: 100%;

      .content-type-list {
        display: flex;
        justify-content: flex-start;
        width: 70%;
      }

      .toggle-view-type {
        width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

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
    min-height: 150px;
    .associate-block-list {

    }
  }
}
</style>

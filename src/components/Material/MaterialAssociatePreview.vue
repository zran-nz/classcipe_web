<template>
  <div class="unit-plan-sub-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="bottom-relative" :gutter="[16,32]">
        <a-col span="16">
          <a-space>
            <a-button :type="activeContentType === typeMap.material ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.material)" class="type-button">
              {{ $t('teacher.unit-plan-preview.material') }}
            </a-button>
            <a-button :type="activeContentType === typeMap.task ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.task)" class="type-button">
              {{ $t('teacher.unit-plan-preview.task') }}
            </a-button>
            <a-button :type="activeContentType === typeMap.lesson ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.lesson)" class="type-button">
              {{ $t('teacher.unit-plan-preview.lesson') }}
            </a-button>
            <a-button :type="activeContentType === typeMap.evaluation ? 'primary' : 'default'" shape="round" @click="handleSelectContentType(typeMap.evaluation)" class="type-button">
              {{ $t('teacher.unit-plan-preview.evaluation') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col span="8">
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
        <a-col>
          <div class="associate-info">
            <div class="associate-block-list" v-for="(item,index) in currentAssociateList" :key="index">
              <template v-if="item.type === activeContentType && item.datas">
                <div class="associate-block-item" v-for="(dataItem,dIndex) in item.datas" :key="dIndex">
                  <div class="block-title" v-if="dataItem.question" @click="handleClickTitle(item)">
                    {{ dataItem.question.name }}
                  </div>
                  <div class="block-content-list" v-if="dataItem.lists">
                    <div class="block-content-item" v-for="(listItem,lIndex) in dataItem.lists" :key="lIndex">
                      <a-row>
                        <a-col class="block-content" span="14" @click="handleSubPreview(listItem)">
                          <content-type-icon :type="item.type" />
                          <span class="content-txt">
                            {{ listItem.name }}
                          </span>
                        </a-col>
                        <a-col class="block-last-change-time" span="6">
                          {{ listItem.updateTime | moment }}
                        </a-col>
                        <a-col class="favorite" span="2" @click="handleFavorite(listItem)">
                          <span :class="{'favorite-active': listItem.isFavorite}">
                            <a-icon type="star" :theme="listItem.isFavorite ? 'filled' : 'outlined'"/>
                            <template v-if="listItem.isFavorite">
                              {{ $t('teacher.unit-plan-preview.favorite') }}
                            </template>
                          </span>
                        </a-col>
                        <a-col class="action-item" span="2">
                          <a @click="handleEditItem(item.type, listItem)">{{ $t('teacher.unit-plan-preview.edit') }}</a>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row>

      </a-row>
      <a-drawer
        destroyOnClose
        placement="right"
        closable
        width="900px"
        :visible="subPreviewVisible"
        @close="handleSubPreviewClose"
      >
        <div class="preview-wrapper">
          <div class="preview-detail">
            <unit-plan-preview :unit-plan-id="materialId" :show-associate="false" v-if="previewType === typeMap['unit-plan']" />
          </div>
        </div>
      </a-drawer>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

const { FavoritesAdd } = require('@/api/favorites')
const { GetAssociate } = require('@/api/teacher')

export default {
  name: 'MaterialAssociatePreview',
  props: {
    materialId: {
      type: String,
      default: null
    }
  },
  components: {
    ContentTypeIcon,
    MaterialPreview: () => import('@/components/Material/MaterialPreview')
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
      subPreviewVisible: false
    }
  },
  created () {
    logger.info('Material Associate Preview materialId ' + this.materialId)
    this.loadMaterialAssociateData()
  },
  methods: {
    loadMaterialAssociateData () {
      logger.info('loadMaterialAssociateData ' + this.materialId)
      this.loading = true
      GetAssociate({
        id: this.materialId,
        type: typeMap.material
      }).then((response) => {
        logger.info('GetAssociate ', response)
        this.associateData = response.result
        this.currentAssociateList = this.associateData[this.activeUserType]
      }).then(() => {
        logger.info('get favorite ' + this.materialId)
      }).finally(() => {
        this.loading = false
      })
    },

    handleSelectContentType (contentType) {
      logger.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      logger.info('handleSubPreviewClose')
      this.subPreviewVisible = false
      this.previewType = null
    },

    handleUserTypeChange (e) {
      logger.info('handleUserTypeChange ' + this.activeUserType)
      this.currentAssociateList = this.associateData[this.activeUserType]
      logger.info('currentAssociateList', this.currentAssociateList)
    },

    handleClickTitle (item) {
      logger.info('handleClickTitle', item)
      this.previewType = typeMap.material
      this.subPreviewVisible = true
    },

    handleSubPreview (type, item) {
      logger.info('handleSubPreview', type, item)
      this.previewType = typeMap.material
      this.subPreviewVisible = true
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

.unit-plan-sub-preview {

  .bottom-relative {

    .type-button {
      width: 100px;
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
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .associate-block-item {
        margin-bottom: 10px;
        .block-title {
          font-weight: 600;
          padding: 10px;
          background-color: #fafafa;
        }
        .block-content-list {
          .block-content-item {
            padding: 10px;
            box-sizing: border-box;
            .content-txt {
              padding-left: 5px;
              color: @primary-color;
              cursor: pointer;
            }
            .block-last-change-time {
              cursor: pointer;
            }
            .favorite {
              cursor: pointer;

              .favorite-active {
                color: @primary-color;
              }
            }

            .action-item {
              text-align: right;
            }
          }
        }
      }
    }
  }
}
</style>

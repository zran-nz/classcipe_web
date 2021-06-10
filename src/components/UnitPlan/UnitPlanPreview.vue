<template>
  <div class="unit-plan-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header" :gutter="[16,32]">
        <a-col span="24">
          <span class="title">
            {{ unitPlanData.name }}
          </span>
          <template v-if="lastChangeSavedTime">
            <a-divider type="vertical" />
            <span class="last-change-time">
              {{ $t('teacher.add-unit-plan.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
            </span>
          </template>
        </a-col>
      </a-row>
      <a-row class="top-info" :gutter="[16,32]">
        <a-col class="left-preview" span="10">
          <a-carousel arrows>
            <div
              slot="prevArrow"
              class="custom-slick-arrow"
              style="left: 10px;z-index: 1"
            >
              <a-icon type="left-circle" />
            </div>
            <div
              slot="nextArrow"
              class="custom-slick-arrow"
              style="right: 10px">
              <a-icon type="right-circle" />
            </div>
            <div v-if="!loading && !imgList.length" class="no-preview-img">
              <a-icon type="file-jpg" />
            </div>
            <div class="preview-img-item" v-for="(img,index) in imgList" :key="index">
              <img :src="img" />
            </div>
          </a-carousel>
        </a-col>
        <a-col class="right-detail" span="14">
          right-detail
        </a-col>
      </a-row>
      <a-divider />
      <a-row class="bottom-relative" :gutter="[16,32]">
        <a-col span="24">
          bottom-relative
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

const { formatLocalUTC } = require('@/utils/util')

const { UnitPlanQueryById } = require('@/api/unitPlan')

export default {
  name: 'UnitPlanPreview',
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
  computed: {
    lastChangeSavedTime () {
      if (this.unitPlanData) {
        logger.info('lastChangeSavedTime unitPlanData', this.unitPlanData)
        const time = this.unitPlanData.createTime || this.unitPlanData.updateTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    }
  },
  mounted () {
  },
  data () {
    return {
      loading: true,
      unitPlanData: null,
      imgList: []
    }
  },
  created () {
    logger.info('UnitPlanPreview unitPlanId ' + this.unitPlanId)
    this.loadUnitPlanData()
  },
  methods: {
    loadUnitPlanData () {
      logger.info('loadUnitPlanData ' + this.unitPlanId)
      this.loading = true
      UnitPlanQueryById({
        id: this.unitPlanId
      }).then(response => {
        logger.info('UnitPlanQueryById ' + this.unitPlanId, response.result)
        this.unitPlanData = response.result
        if (this.unitPlanData && this.unitPlanData.image) {
          this.imgList = [this.unitPlanData.image]
          this.imgList.push(this.unitPlanData.image)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-preview {

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;

    .title {
      font-weight: bold;
    }

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }

  .top-info {
    padding: 20px 0;
  }

  .left-preview {
    height: 100%;

    .ant-carousel {

      /deep/ .slick-list {
        border: 1px solid #eee;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
      }

      /deep/ .slick-slide {
        text-align: center;
        height: 160px;
        line-height: 160px;
        overflow: hidden;
      }

      /deep/ .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.81);
        opacity: 0.0;
        border-radius: 50%;
        transition: all 0.3s ease-in;
      }

      &:hover {
        /deep/ .custom-slick-arrow {
          opacity: 0.3;
        }
      }

      /deep/ .custom-slick-arrow:before {
        display: none;
      }

      /deep/ .custom-slick-arrow:hover {
        opacity: 0.5;
      }

      /deep/ .slick-slide h3 {
        color: #fff;
      }

      /deep/ .no-preview-img {
        font-size: 40px;
        color: @text-color-secondary;
      }
    }
  }
}
</style>

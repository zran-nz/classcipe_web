<template>
  <div class="unit-plan-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-info">
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
              <a-icon type="file-image" />
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
      <a-row class="bottom-relative">
        <a-col span="24">
          bottom-relative
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

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
  .ant-carousel {
    /deep/ .slick-list {
      border: 1px solid #eee;
    }

    /deep/ .slick-slide {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
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
  }
}
</style>

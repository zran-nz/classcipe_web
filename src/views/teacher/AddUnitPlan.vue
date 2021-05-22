<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="unit-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            {{ $t('teacher.add-unit-plan.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button @click="handleSaveUnitPlan"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
          <a-button type="primary" @click="handlePublishUnitPlan"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-unit-plan.publish') }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content">
      <a-col span="3">
        <div class="unit-menu-list">
          <div class="unit-menu-title">
            {{ $t('teacher.add-unit-plan.unit-plan') }}
          </div>
          <div class="unit-add-to">
            <a-dropdown>
              <a-button type="primary" block> <a-icon type="plus" /> {{ $t('teacher.add-unit-plan.add-to-this-topic') }} </a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.material') }}
                </a-menu-item>
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.assessment') }}
                </a-menu-item>
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.lesson') }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class="already-add-to-list">
            <a-menu mode="inline">
              <a-menu-item key="material">
                <content-type-icon :type="contentType.material"/>
                {{ $t('teacher.add-unit-plan.material') }}
              </a-menu-item>
              <a-menu-item key="assessment">
                <content-type-icon :type="contentType.assessment"/>
                {{ $t('teacher.add-unit-plan.assessment') }}
              </a-menu-item>
              <a-menu-item key="lesson">
                <content-type-icon :type="contentType.lesson"/>
                {{ $t('teacher.add-unit-plan.lesson') }}
              </a-menu-item>
            </a-menu>
          </div>
        </div>
      </a-col>
      <a-col span="15" class="main-content">
        <a-card :bordered="false" :loading="contentLoading" :style="{ borderLeft: '1px solid rgb(235, 238, 240)', borderRight: '1px solid rgb(235, 238, 240)' }">

        </a-card>
      </a-col>
      <a-col span="6" class="right-reference-view">
        <a-card :bordered="false" :loading="referenceLoading">
          ss
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'

export default {
  name: 'AddUnitPlan',
  components: {
    ContentTypeIcon
  },
  data () {
    return {
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap
    }
  },
  computed: {
    lastChangeSavedTime () {
      return '12:32 Today'
    }
  },
  created () {
    this.contentLoading = false
    this.referenceLoading = false
  },
  mounted () {
  },
  methods: {
    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan')
    },
    handlePublishUnitPlan () {
      logger.info('handlePublishUnitPlan')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid  rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }

  .unit-last-change-time {
    line-height: 32px;
  }

  .unit-right-action {
    display: flex;
    justify-content: flex-end;
  }
}

.unit-content {
  .unit-menu-list {
    padding: 0 24px 16px 0;
    .unit-menu-title {
      font-size: @font-size-lg;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      color: @primary-color;
    }
    .unit-add-to {

    }

    .already-add-to-list {
      .ant-menu-inline {
        border-right: none;
        color: @text-color;
      }

      .ant-menu-inline .ant-menu-item::after {
        border-right: none;
      }
    }
  }
}
</style>

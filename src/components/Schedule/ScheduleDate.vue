<template>
  <div class='schedule-date'>
    <div class='choose-type'>
      <div class='title'>Choose the type of session</div>
      <div class='type-list'>
        <div
          class='type-item'
          v-for='item in sessionTypeList'
          :key='item.id'
          :style="{'border-color': item.color, 'color': item.color}">
          <div class='item-base' @click="chooseSessionType(item)">
            <div class='item-checked-icon'>
              <template v-if="selectedSessionType === item">
                <img src="~@/assets/icons/lesson/selected.png" />
              </template>
              <template v-if="selectedSessionType !== item">
                <div class="empty-circle"></div>
              </template>
            </div>
            <div class='item-name'>{{ item.name }}</div>
          </div>
          <div class='item-more' @click.stop=''>
            <template v-if='item.allowZoom'>
              <div class='zoom-icon'>
                <img src='~@/assets/icons/zoom/img.png' />
              </div>
              <div class='zoom-switch'>
                <a-switch size='small' :disabled='item !== selectedSessionType' v-model='item.enableZoom' @change='handleZoomStatusChange'></a-switch>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class='select-date'>
      <div class='title'>Schedule</div>
      <div class='date-picker'>
        <a-range-picker @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
      </div>
    </div>
  </div>
</template>

<script>

import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'

export default {
  name: 'ScheduleDate',
  mixins: [ ZoomAuthMixin ],
  data() {
    return {
      // 1-assignment 2-lession(PD session只能是公开课，类型是lesson) 3-Test
      sessionTypeList: [
        {
          id: 1,
          name: 'Assignment',
          allowZoom: false,
          enableZoom: false,
          color: '#333333',
          type: this.$classcipe.ScheduleSessionType.assignment
        },
        {
          id: 2,
          name: 'Lesson',
          allowZoom: true,
          enableZoom: false,
          color: '#15c39a',
          type: this.$classcipe.ScheduleSessionType.lesson
        },
        {
          id: 3,
          name: 'Test',
          allowZoom: true,
          enableZoom: false,
          color: '#c92a2a',
          type: this.$classcipe.ScheduleSessionType.test
        }
      ],

      selectedSessionType: null,
      startDate: null,
      endData: null
    }
  },
  created() {
  },
  methods: {
    chooseSessionType (item) {
      this.$logger.info('chooseSessionType', item)
      if (this.selectedSessionType === item) {
        this.selectedSessionType = null
      } else {
        this.selectedSessionType = item
        this.sessionTypeList.forEach(sItem => {
          if (sItem.id !== item.id) {
            sItem.enableZoom = false
          }
        })
        this.$logger.info('sessionTypeList', this.sessionTypeList)
      }
      this.$emit('select-zoom-status', false) // 切换类型后重置zoom状态
      this.$emit('select-session-type', this.selectedSessionType ? this.selectedSessionType.type : null)
    },
    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.startDate = dateString[0]
      this.endData = dateString[1]
      this.$logger.info('handleDateChange', this.startDate, this.endData)
      this.$emit('select-date', {
        startDate: this.startDate,
        endDate: this.endData
      })
    },

    handleZoomStatusChange (status) {
      this.$logger.info('handleZoomStatusChange', status)
      this.$emit('select-zoom-status', status)
      if (status) {
        if (!this.zoomAccessToken) {
          this.goToZoomAuth()
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>

@import "~@/components/index.less";

.schedule-date {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  padding: 15px 0;

  .choose-type, .select-date{
    .title {
      font-weight: 500;
      color: #333;
      line-height: 30px;
      padding-left: 5px;
    }

    .type-list {
      border: 1px solid #f1f1f1;
      padding: 0 10px;
      .type-item {
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        height: 46px;
        background-color: #fff;
        margin: 15px 0;
        width: 350px;
        border-width: 2px;
        border-style: solid;
        border-radius: 5px;
        padding: 8px 10px;

        .item-base, .item-more {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;

          .zoom-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            img {
              height: 25px;
            }
          }
        }
      }
    }
  }

  .select-date {
    width: 380px;
  }
}

.item-checked-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 25px;
  margin-right: 5px;
  .empty-circle {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
  }

  img {
    width: 18px;
    height: 18px;
  }
}

</style>

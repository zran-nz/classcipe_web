<template>
  <div class="collaborate-history">
    <div class="history-list">
      <div class="history-item" v-for="(historyItem, hIndex) in collaborateHistoryList" :key="hIndex">
        <div class="history-title">
          <div class="created-time">
            <a-icon type="plus-circle" />
            <div class="time-text">
              {{ historyItem.createdTime | dayjs }}
            </div>
          </div>
          <div class="restore">
            <div class="restore-action" @click="handleRestoreHistory(historyItem)">Restore</div>
          </div>
        </div>
        <div class="history-detail-list">
          <div class="history-detail-item" v-for="(hDetail, hdIndex) in historyItem.historyData" :key="hdIndex">
            <div class="user-name">
              {{ hDetail.createdBy }}
            </div>
            <div class="action">
              Modified
            </div>
            <div class="form-field">
              {{ hDetail.fieldDisplayName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CollaborateHistory',
  props: {
    historyList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      collaborateHistoryList: []
    }
  },
  created () {
    this.$logger.info('CollaborateHistory created', this.historyList)
    this.collaborateHistoryList = this.historyList
  },
  methods: {
    handleRestoreHistory (historyItem) {
      this.$logger.info('handleRestoreHistory', historyItem)
      this.$emit('restore', historyItem)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-history {
  padding: 0 20px 20px 20px;
  max-height: 1000px;
  overflow-y: auto;
  z-index: 100;
  .history-list {
    .history-item {
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 10px;
      .history-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        line-height: 24px;
        color: #000;
        .created-time {
          display: flex;
          flex-direction: row;
          align-items: center;
          .time-text {
            padding-left: 5px;
            color: #333;
          }
        }

        .restore {
          color: #15c39a;
          cursor: pointer;
        }
      }

      .history-detail-list {
        padding-left: 20px;
        .history-detail-item {
          line-height: 25px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          color: #333;

          .user-name {
            padding-right: 5px;
            color: #000;
          }

          .action {
            padding-right: 5px;
            font-style: italic;
          }

          .form-field {
            color: #15c39a;
          }
        }
      }
    }
  }
}

</style>

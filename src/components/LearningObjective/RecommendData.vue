<template>
  <a-modal
    title="Recommend"
    v-model="showRecommend"
    :append-to-body="true"
    :destroy-on-close="false"
    @ok='handleEnsureSelect'
    @cancel='handleCancelSelect'
    width="700px">
    <div class='recommend-data'>
      <div class='recommend-item' v-for='recommendItem in myRecommendDataList' :key='recommendItem.id'>
        <div class='content-header'>
          <div class='header-title'>From</div>
          <div class='header-title-bold'>
            {{ recommendItem.fromTypeName }}
          </div>
          <div class='header-title'>
            {{ recommendItem.fromName }}
          </div>
        </div>
        <div class='content-learn-outs'>
          <div class='learn-out' v-for='(learnOutItem, idx) in recommendItem.list' :key='idx' @click='handleSelectItem(learnOutItem)'>
            <div class='path-title' v-if='learnOutItem.path.length' :title='learnOutItem.path.join(">")'>
              <a-icon type='tag' /> {{ learnOutItem.path.slice(-2).join(' > ') }}
            </div>
            <div class='learn-out-detail'>
              <div class='learn-out-desc'>
                {{ learnOutItem.desc }}
              </div>
              <div class='general-capability' v-if='learnOutItem.generalCapabilities && learnOutItem.generalCapabilities.length'>
                <div class='capability-item' v-for='(capability, cIdx) in learnOutItem.generalCapabilities' :key='cIdx'>
                  {{ capability.desc }}
                </div>
              </div>
            </div>
            <div class='learn-out-selected'>
              <div class='item-type-icon'>
                <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearnOutList.indexOf(learnOutItem) !== -1' />
                <div class="empty-circle" v-if='selectedLearnOutList.indexOf(learnOutItem) === -1'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'RecommendData',
  props: {
    recommendDataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myRecommendDataList: [],
      showRecommend: true,
      selectedLearnOutList: []
    }
  },
  created() {
    this.$logger.info('RecommendData created', this.recommendDataList)
    this.myRecommendDataList = this.recommendDataList
  },
  methods: {
    handleSelectItem(item) {
      if (this.selectedLearnOutList.indexOf(item) === -1) {
        this.selectedLearnOutList.push(item)
      } else {
        this.selectedLearnOutList.splice(this.selectedLearnOutList.indexOf(item), 1)
      }
    },

    handleEnsureSelect() {
      this.$logger.info('RecommendData handleEnsureSelect', this.selectedLearnOutList)
      this.$emit('confirm', this.selectedLearnOutList)
    },

    handleCancelSelect () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.recommend-data {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
  .recommend-item {
    margin-bottom: 10px;

    .content-header {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;
      color: #333;
      font-weight: bold;
      cursor: pointer;

      .header-title-bold {
        padding: 0 5px;
        font-weight: bold;
        color: #15C39A;
      }
    }

    .content-learn-outs {
      padding-left: 30px;
      position: relative;
      .learn-out {
        cursor: pointer;
        position: relative;
        margin-bottom: 10px;
        width: 100%;
        .path-title {
          padding-bottom: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .learn-out-detail {
          padding: 10px;
          background-color: #f0f2f5;
          border-radius: 5px;

          .learn-out-desc {
            padding-bottom: 5px;
          }

          .general-capability-title {
            color: #333;
            font-weight: bold;
          }

          .general-capability {
            .capability-item {
              margin: 5px 0;
              background-color: #e3e9ed;
              padding: 5px;
              border-radius: 4px;
            }
          }
        }
      }

      .learn-out-selected {
        position: absolute;
        left: -30px;
        top: 5px;
        width: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: row;
        .item-type-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          width: 25px;
          .empty-circle {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            border: 2px solid #ccc;
          }

          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}
</style>

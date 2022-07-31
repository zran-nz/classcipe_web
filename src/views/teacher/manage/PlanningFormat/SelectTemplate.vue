<template>
  <div class="my-content">
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list
            size="large"
            :data-source="filterTemplateList"
            :loading="loading">
            <div
              slot="renderItem"
              key="item.key"
              class="my-card-list-item"
              slot-scope="item"
              @click="handleChoice(item)">
              <!--              <div class="cover-img-wrapper">-->
              <!--                <div-->
              <!--                  class="cover-image"-->
              <!--                  :style="{backgroundImage: 'url(' + item.image + ')' }"-->
              <!--                >-->
              <!--                </div>-->
              <!--              </div>-->
              <div class="item-intro">
                <!--                <div class="page-info">-->
                <!--                  <span class="page-num-tag">-->
                <!--                    1/1-->
                <!--                  </span>-->
                <!--                </div>-->
                <div class="main-title" >
                  {{ item.name }}
                </div>
                <div class="sub-title">
                  {{ item.description }}
                </div>
              </div>
              <div class="item-action-wrapper">
                <div class="action-wrapper">
                  <div class="action-item">
                    <a-button type="primary" shape="round" @click.stop.prevent="handlePreview(item)">Preview</a-button>
                  </div>
                  <!--                  <div class="action-item">-->
                  <!--                    <a-button type="primary" shape="round" @click="handleChoice(item)">Choice</a-button>-->
                  <!--                  </div>-->
                </div>
              </div>
              <div class="card-action-icon">
                <img
                  v-if="id === item.id"
                  src="~@/assets/icons/lesson/selected.png"/>
              </div>
            </div>
          </a-list>
          <div class="modal-ensure-action-line">
            <a-button class="action-item action-cancel" shape="round" @click="handleCancel">Cancel</a-button>
            <a-button
              class="action-ensure action-item"
              type="primary"
              shape="round"
              :loading="ensureLoading"
              @click="handleEnsure">Ok</a-button>
          </div>
        </div>

      </a-skeleton>

    </div>

  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import { FORM_CONFIG_PREVIEW_DATA } from '@/store/mutation-types'

export default {
  name: 'SelectTemplate',
  components: {
  },
  props: {
    templateList: {
      type: Array,
      default: () => []
    },
    activeKey: {
      type: String,
      default: ''
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  computed: {
    filterTemplateList() {
      const type = this.activeKey === 'plan' ? typeMap['unit-plan'] : typeMap.task
      return this.templateList.filter(item => item.type === type)
    }
  },
  data () {
    return {
      skeletonLoading: false,
      loading: false,
      id: '',
      ensureLoading: false
    }
  },
  created () {
    this.id = this.currentId
  },
  methods: {

    handleCancel () {
      this.$emit('cancel')
    },
    handleEnsure () {
      if (!this.id) {
        this.$message.warning('Please choice a format template.')
        return
      }
      this.$emit('ensure', this.id)
    },

    handleChoice(item) {
      this.id = item.id
    },
    handlePreview(item) {
      this.$logger.info('handlePreviewPlanningForm', item)
      if (this.activeKey === 'plan') {
        this.$store.commit(FORM_CONFIG_PREVIEW_DATA, {
          commonList: item.config.commonList,
          customList: item.config.customList,
          steps: item.config.steps,
          type: typeMap['unit-plan']
        })
        window.open('/teacher/managing/planning-format/unit-plan-preview', '_blank')
      } else if (this.activeKey === 'task') {
        this.$store.commit(FORM_CONFIG_PREVIEW_DATA, {
          commonList: item.config.commonList,
          customList: item.config.customList,
          steps: item.config.steps,
          type: typeMap.task
        })
        window.open('/teacher/managing/planning-format/task-preview', '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ant-list-item {
  padding: 0;
  margin: 10px;
  position: relative;
  width: 200px;
}

.my-list-item {
  opacity: 1;
  margin: 0 0 15px 0;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  width: 100%;
  border: 2px solid #fff;
}

.my-list-item:hover {
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.16);
}

.active-item {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.active-new-item {
  border: 2px solid #15C39A;
  background: #15C39A11;
}

.my-content {

  .content-wrapper {
    .content-list {
      .select-block {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .select-block-icon {
          color: #ccc;
          font-size: 20px;
          cursor: pointer;
        }

        .selected-icon {
          img {
            width: 20px;
          }
        }
      }

      .content-info-left {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .status-icon-item {
          font-size: 18px;
          width: 40px;
        }

        &:hover {
          color: @primary-color;
        }
      }

      .content-info-right {
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .update-time {
          width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: Inter-Bold;
          font-size: 13px;
          color: #000000;
          opacity: 0.5;
        }

        .status {
          width: 80px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          opacity: 1;
          text-align: center;
        }
      }

      .action-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        width: 80px;
        box-sizing: border-box;

        img {
          height: 18px;
        }
      }

      .action {
        color: @primary-color;
        font-weight: 500;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        .action-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 10px;
          user-select: none;

          .btn-text {
            padding: 0 5px;
          }

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

        .refer-item {
          .refer-btn {
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

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 360px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
        .name-text{
          padding-left: 7px;
          border: 1px solid #ffffff;
          &:hover {
            background-color: #fff;
            background-image: none;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            transition: all 0.3s;
          }
        }
      }
    }
  }
}

a.delete-action {
  color: @red-4;
}

.switch-icon {
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .icon-item {
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 20px;
      color: rgba(24, 37, 82, 1);
    }
  }

  .active-icon {
    svg {
      color: rgba(21, 195, 154, 1);
    }
  }
}

.preview-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;

  .preview-wrapper-row {
    width: 100%;

    .view-back {
      .back-icon {
        text-align: center;

        img {
          width: 70px;
          cursor: pointer;
        }
      }
    }

    .detail-wrapper {
      background: #FFFFFF;
      border: 1px solid #ddd;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      border-radius: 10px;
    }
  }
}

.my-card-list-item {
  cursor:pointer;
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

      .refer-item {
        .refer-btn {
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
    top: 10px;
    right: 10px;

    img {
      height: 18px;
    }
  }
}

.choose-group {
  margin: 10px 0;

  .choose-label {
    padding-bottom: 10px;
    color: #000000;
    font-family: Inter-Bold;
  }
}

.group-label {
  margin-bottom: 15px;

  .choose-label {
    padding-bottom: 3px;
  }
}

/deep/ .ant-spin-nested-loading{
  max-height:400px;
  overflow-y: auto;
}
</style>

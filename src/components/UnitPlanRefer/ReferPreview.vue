<template>
  <div class="unit-plan-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header">
        <a-col span="24">
          <div class="title-line">
            <div class="name">
              {{ data.name }}
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="data-info">
        <a-col class="right-detail" span="24">
          <div class="detail-wrapper" v-if="data">

            <div class="block-main-label">
              Overview
            </div>
            <div
              class="ref-block"
              @click="handleReferItem('overview', data.overview)"
              @mouseenter="handleHoverBlock('overview')">
              <div class="overview-block">
                <div class="view-text">
                  {{ data.overview }}
                </div>
              </div>
            </div>

            <div class="block-main-label">
              Sustainable development goal
            </div>
            <div class="detail-block">
              <template v-if="data.scenarios && data.scenarios.length">
                <div
                  class="scenario-item ref-block"
                  v-for="(scenario,sIndex) in data.scenarios"
                  :key="sIndex"
                  @click="handleReferItem('sdg', scenario)"
                  @mouseenter="handleHoverBlock('sdg')">
                  <div class="block-title">
                    {{ scenario.description }}
                  </div>
                  <div class="scenario-block-content">
                    <div class="content-list">
                      <div class="content-item">
                        <div class="question">
                          {{ scenario.sdgName }}
                        </div>
                        <div class="tags">
                          <div class="tag-item" v-for="(keyword,tagIndex) in scenario.sdgKeyWords" :key="tagIndex">
                            <a-tag class="tag">
                              {{ keyword.name }}
                            </a-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <a-empty />
              </template>
            </div>

            <div class="detail-block " >
              <div class="block-main-label">
                Scenario description
              </div>
              <div
                class="inquiry-block-content ref-block"
                @click="handleReferItem('inquiry', data.inquiry)"
                @mouseenter="handleHoverBlock('inquiry')">
                <template v-if="data.inquiry">
                  <div class="inquiry">
                    {{ data.inquiry }}
                  </div>
                </template>
              </div>
            </div>

            <div class="block-main-label">
              Question / Line of inquiry
            </div>
            <div class="detail-block">
              <template v-if="data.questions && data.questions.length">
                <div class="keyword-block-content">
                  <div class="content-list" v-if="data.questions && data.questions.length">
                    <div class="content-item" v-for="(question,qIndex) in data.questions" :key="qIndex">
                      <div
                        class="ref-block"
                        @click="handleReferItem('question', question)"
                        @mouseenter="handleHoverBlock('question')">
                        <div class="question" v-if="question && question.name">
                          {{ question.name }}
                        </div>
                        <div class="content-sub-list" v-if="question && question.knowledgeTags && question.knowledgeTags.length">
                          <div class="content-sub-item" v-for="(knowledgeTag, kIndex) in question.knowledgeTags" :key="kIndex">
                            <div class="sub-title">
                              <div class="sub-title-name">
                                {{ knowledgeTag.description }}
                                <div class="subject-name" v-if="knowledgeTag.subSubjectName">
                                  {{ knowledgeTag.subSubjectName }}
                                </div>
                              </div>
                              <div class="sub-detail">
                                <a-tag class="tag">
                                  {{ knowledgeTag.name }}
                                </a-tag>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="content-sub-list" v-if="question && question.skillTags&& question.skillTags.length">
                          <div class="content-sub-item" v-for="(skillTag, sIndex) in question.skillTags" :key="sIndex">
                            <div class="sub-title">
                              <div class="sub-title-name">
                                {{ skillTag.description }}
                              </div>
                              <div class="sub-detail">
                                <a-tag class="tag">
                                  {{ skillTag.name }}
                                </a-tag>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

          </div>
        </a-col>
      </a-row>
      <div class="associate-info" v-if="id && type">
        <refer-associate-list :id="id" :content-type="type" @refer-associate="handleReferAssociate"/>
      </div>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonAssociatePreview from '@/components/Common/CommonAssociatePreview'
import ReferAssociateList from '@/components/UnitPlanRefer/ReferAssociateList'
const { formatLocalUTC } = require('@/utils/util')
const { UnitPlanQueryById } = require('@/api/unitPlan')
const { TopicQueryById } = require('@/api/topic')

export default {
  name: 'ReferPreview',
  components: { ReferAssociateList, CommonAssociatePreview, NoMoreResources },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  computed: {
    lastChangeSavedTime () {
      if (this.data) {
        logger.info('lastChangeSavedTime data', this.data)
        const time = this.data.createTime || this.data.updateTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    }
  },
  data () {
    return {
      loading: true,
      data: null,

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      typeMap: typeMap,
      subPreviewVisible: false
    }
  },
  created () {
    logger.info('ReferPreview id ' + this.id + ' type ' + this.type)
    this.loadData()
  },
  methods: {
    loadData () {
      logger.info('reference preview loadData ' + this.id + ' type ' + this.type)
      this.loading = true
      if (this.type === this.typeMap['unit-plan']) {
        UnitPlanQueryById({
          id: this.id
        }).then(response => {
          logger.info('reference preview UnitPlanQueryById ' + this.id, response.result)
          this.data = response.result
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === this.typeMap.topic) {
        TopicQueryById({
          id: this.id
        }).then(response => {
          logger.info('reference preview TopicQueryById ' + this.id, response.result)
          this.data = response.result
        }).finally(() => {
          this.loading = false
        })
      }
    },

    // 点击对应的区块时触发
    handleReferItem (blockType, data) {
      this.$logger.info('handleReferItem ' + blockType, data)
      this.$emit('refer', {
        blockType,
        data
      })
    },

    // 鼠标悬浮到对应的区块时触发
    handleHoverBlock (blockType) {
      this.$logger.info('handleHoverBlock ' + blockType)
      this.$emit('hover-refer-block', {
        blockType
      })
    },

    // 关联refer
    handleReferAssociate (data) {
      this.$logger.info('handleReferAssociate', data)
      this.$emit('refer-associate', data)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-preview {
  padding: 20px 16px;

  .top-header {
    padding: 0 5px;
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;

    .title-line {
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .name {
        width: 70%;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        font-family: Inter-Bold;
        font-size: 15px;
        color: #182552;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .action-item {
        display: flex;
        width: 30%;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .star {
          img {
            width: 22px;
          }
        }

        .edit {
          margin-left: 15px;
          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            .edit-icon {
              padding-left: 5px;
              width: 18px;
            }
          }
        }
      }
    }

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }

  .author-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    .avatar-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 80%;
      }
    }
    .sub-info {
      padding-left: 5px;
    }
    .sub-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .created-by {
        padding-right: 10px;
        font-size: 13px;
        font-weight: 500;
        font-family: Inter-Bold;
        color: #182552;
      }

      .created-time {
        font-family: Inter-Bold;
        font-size: 10px;
        color: #000000;
        opacity: 0.5;
      }
    }
    .star-info {
      ul {
        margin-bottom: 0;
      }
    }
  }

  .data-info {
    margin-top: 10px;
    min-height: 100px;
    background: #fff;
    opacity: 1;
    border-radius: 5px;
  }

  .preview-data-info {
    margin-top: 10px;
    min-height: 100px;
    padding: 5px;
    opacity: 1;
  }

  .left-preview {
    height: 100%;

    .ant-carousel {
    }
    .edit-action {
      margin-top: 20px;
    }
  }

  .right-detail {
    .detail-wrapper {
      .detail-block {

        .block-title {
          font-weight: 500;
          font-size: 16px;
          font-family: Inter-Bold;
          color: #000000;
        }

        .scenario-block-content {
          padding: 5px 0;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              background: #fff;
              padding: 5px 0;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              .question {
                font-size: 14px;
                font-weight: 500;
                padding-right: 15px;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                background-color: #f9f9f9;
                margin-bottom: 10px;
                .subject-name {
                  cursor: pointer;
                  color: @primary-color;
                  padding: 0 10px;
                  line-height: 30px;
                  border-radius: 30px;
                  margin: 0 10px;
                  background-color: fade(@outline-color, 20%);
                }
              }
            }
          }
        }

        .keyword-block-content {
          padding: 5px 0;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-around;
              .question {
                width: 100%;
                font-size: 14px;
                font-weight: 500;
                padding: 5px 0;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                margin-bottom: 10px;
                width: 100%;
                .content-sub-item {
                  background: rgba(255, 187, 0, 0.1);
                  color: rgba(255, 187, 0, 1);
                  margin-bottom: 10px;
                  .sub-title {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px;
                    .sub-title-name {
                      padding-right: 15px;
                      font-weight: 500;
                      display: inline-block;
                      .subject-name {
                        display: inline-block;
                        cursor: pointer;
                        color: @primary-color;
                        padding: 0 8px;
                        line-height: 20px;
                        border-radius: 20px;
                        margin: 0 5px;
                        background-color: fade(@outline-color, 20%);
                      }
                    }
                  }
                }

                .tag {
                  background: rgba(255, 187, 0, 0.1);
                  border: 1px solid #FFBB00;
                  border-radius: 20px;
                  font-family: Inter-Bold;
                  color: #FFBB00;
                }
              }
            }
          }
        }

        .inquiry-block-content {
          width: 100%;
          background: rgba(21, 195, 154, 0.1);
          border: 1px dashed rgba(216, 216, 216, 1);
          .inquiry {
            padding: 5px 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }
        .overview-block {
          padding: 10px;
          margin-bottom: 10px;
          .view-text {
            padding: 10px;
            background: #fff;
            color: #000;
            font-family: Inter-Bold;
            font-weight: 500;
          }
        }
      }
    }
  }
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
}

/deep/ .left-button {
  border-radius: 16px 0 0 16px;
  font-family: Inter-Bold;
  color: #11142D;
}

/deep/ .right-button {
  border-radius: 0 16px 16px 0 ;
  background: rgba(247, 248, 255, 1);
  border: none;
  font-size: 14px;
  font-family: Inter-Bold;
  color: #11142D;
  opacity: 1;
}

.action-header {
  padding: 10px 0;
  .action-header-toggle {
    position: relative;
    .edit-item {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.edit-action {
  text-align: right;
}

.my-carousel {
  width: 100%;
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
  div {
    img {
      height: 350px;
      width: 100%;
    }
  }
}

.carousel-page {
  display: flex;
  height: 110px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
  .img-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    .img-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      .img-item {
        height: 80px;
        border: 1px solid #999;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin: 0 10px;
        img {
          height: 100%;
        }
      }
    }
  }
}

.block-main-label {
  color: rgba(0, 0, 0, 1);
  font-size: 18px;
  font-weight: bold;
  font-family: Inter-Bold;
}

.ref-block {
  padding: 10px;
  margin: 10px 0;
  cursor: pointer;
  border: 2px dashed rgba(216, 216, 216, 1);
  width: 100%;
  box-sizing: border-box;
  &:hover {
    border: 2px solid rgba(21, 195, 154, 0.4);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    border-radius: 5px;
  }
}

</style>

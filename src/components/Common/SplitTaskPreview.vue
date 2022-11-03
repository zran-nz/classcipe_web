<template>
  <div class="my-unit-plan-preview">
    <a-row class="action-header">
      <a-col span="24" class="action-header-toggle">
        <a-radio-group v-model="viewMode" button-style="solid">
          <a-radio-button value="Detail" class="left-button">
            Info
          </a-radio-button>
          <a-radio-button value="Preview" class="right-button">
            Detail
          </a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="top-header">
      <a-col span="24">
        <div class="title-line">
          <div class="name">
            {{ data.name }}
          </div>
          <div class="action-item">
            <div class="star">
              <template v-if="data.createBy !== $store.getters.userInfo.email">
                <img src="~@/assets/icons/common/preview/star_gray.png" v-if="!data.isFavorite"/>
                <img src="~@/assets/icons/common/preview/star_yellow.png" v-if="data.isFavorite"/>
              </template>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="author-info">
      <a-col span="3" class="avatar-icon">
        <img src="~@/assets/icons/library/default-avatar.png" />
      </a-col>
      <a-col span="21">
        <div class="sub-info">
          <div class="created-by">
            {{ data.createBy }}
          </div>
          <div class="created-time">
            {{ new Date() | localFormatDate }}
          </div>
        </div>
        <div class="star-info">
          <a-tooltip placement="right">
            <template slot="title">
              10 people gave a score of 5 stars
            </template>
            <a-rate :default-value="5" allow-half disabled/>
          </a-tooltip>
        </div>
      </a-col>
    </a-row>
    <a-row class="data-info" v-if="viewMode === 'Detail'">
      <a-col class="right-detail" span="24" >
        <div class="sub-detail">
          <div class="detail-block">
            <div class="block-main-label">
              <template v-if="data.type === typeMap.task">Task details</template>
              <template v-else>Overview</template>
            </div>
            <div class="overview-block">
              <div class="view-text">
                {{ data.overview }}
              </div>
            </div>
            <template v-if="data.type === typeMap.task && data.questionNames.length > 0">
              <div class="block-main-label">
                Key question(s)/Line(s) of Inquiry
              </div>
              <div class="detail-block" style="margin:10px;">
                <div class="keyword-block-content">
                  <div class="content-list">
                    <div class="content-item" v-for="(question,qIndex) in data.questionNames" :key="qIndex">
                      <div class="question" v-if="question">
                        {{ question }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-show='data.customTags.length'>
              <div class="block-main-label">
                Customized tags
              </div>
              <div class="overview-block">
                <div class="custom-tags">
                  <div class="tag-item" v-for="(tag,tagIndex) in data.customTags" :key="'tagIndex' + tagIndex">
                    <a-tooltip :title="tag.parentName">
                      <a-tag class="tag">
                        {{ tag.name }}
                      </a-tag>
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </template>
            <template v-show='data.learnOuts.length'>
              <div class="block-main-label">
                Learning Objectives
              </div>
              <div class="overview-block">
                <div class="learn-question-tag">
                  <div class="learn-out" style="margin: 10px;">
                    <ui-learn-out-sub :learn-outs="data.learnOuts" />
                  </div>
                </div>
              </div>
            </template>
            <template v-if="data.inquiry">
              <div class="block-main-label">
                Big idea
              </div>
              <div class="inquiry-block-content">
                <div class="inquiry">
                  {{ data.inquiry }}
                </div>
              </div>
            </template>
            <template v-if="data.materialList && data.materialList.length">
              <div class="block-main-label">
                Material list
              </div>
              <div class="overview-block">
                <div class="material-list">
                  <div class="material-item" v-for="(material, mIndex) in data.materialList" :key="mIndex">
                    <div class="material-name">
                      {{ material.name }}
                    </div>
                    <div class="material-link" @click="handleOpenLink(material.link)">
                      {{ material.link }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="preview-data-info" v-if="viewMode === 'Preview'">
      <a-col class="slide-preview" span="24">
        <div class="data-detail-wrapper" v-if="data.scenarios || data.inquiry || (data.questions && data.questions.length)">

          <template v-if="data.scenarios">
            <div class="block-main-label">
              Sustainable development goal
            </div>
            <div class="detail-block">
              <div
                class="scenario-item ref-block"
                v-for="(scenario,sIndex) in data.scenarios"
                :key="sIndex">
                <div class="scenario-block-content">
                  <div class="content-list">
                    <div class="content-item">
                      <div class="question">
                        {{ scenario.sdgName }}
                      </div>
                      <div class="tags">
                        <div class="tag-item" v-for="(keyword,tagIndex) in scenario.sdgKeyWords" :key="'tagIndex' + tagIndex">
                          <a-tag class="tag">
                            {{ keyword.name }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-if="data && data.inquiry">
            <div class="detail-block">
              <div class="block-main-label">
                Big idea
                <!--                  / Staement of inquiry / Centeral idea / Enduring understanding-->
              </div>
              <div class="inquiry-block-content">
                <div class="inquiry">
                  {{ data.inquiry }}
                </div>
              </div>
            </div>
          </template>

          <template v-if="data && data.questions && data.questions.length">
            <div class="block-main-label">
              Key question(s)/Line(s) of Inquiry
            </div>
            <div class="detail-block">
              <div class="keyword-block-content">
                <div class="content-list" v-if="data.questions && data.questions.length">
                  <div class="content-item" v-for="(question,qIndex) in data.questions" :key="'qIndex' + qIndex">
                    <div class="question" v-if="question && question.name">
                      {{ question.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- lesson task img list-->
        <template v-if="imgList.length > 0">
          <a-skeleton :loading="slideLoading" active >
            <div class="slide-select-wrapper" ref="slide" >
              <div class="slide-select">
                <div class="slide-select-and-preview">
                  <div class="slide-preview" :style="{'width':'600px'}">
                    <a-carousel ref="carousel" arrows>
                      <div v-for="(item,index) in imgList" :key="index">
                        <img :src="item" />
                      </div>
                    </a-carousel>
                    <div class="page-info" v-if="imgList && imgList.length">
                      {{ currentImgIndex + 1 }} / {{ imgList.length }}
                    </div>
                    <div class="carousel-page">
                      <div class="img-list-wrapper">
                        <div class="img-list">
                          <div :class="{'img-item': true, 'active-img-item': index === currentImgIndex}" v-for="(item,index) in imgList" :key="'index' + index" @click="handleGotoImgIndex(index)">
                            <img :src="item" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-skeleton>

          <!-- evaluation preview-->
        </template>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonAssociatePreview from '@/components/Common/CommonAssociatePreview'
import EvaluationTablePreview from '@/components/Evaluation/EvaluationTablePreview'
import MediaPreview from '@/components/Task/MediaPreview'
import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'
import UiLearnOutSub from '@/components/UnitPlan/UiLearnOutSub'

export default {
  name: 'SplitTaskPreview',
  components: {
    UiLearnOutSub,
    EvaluationTablePreview,
    CommonAssociatePreview,
    NoMoreResources,
    MediaPreview,
    TaskMaterialPreview
  },
  props: {
    taskData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      slideLoading: true,
      data: null,
      imgList: [],
      viewMode: 'Detail',

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

      currentImgIndex: 0
    }
  },
  created () {
    console.info('SplitTaskPreview', this.taskData)
    this.data = this.taskData.subTask
    this.initData()
  },
  methods: {
    initData () {
      this.imgList = this.taskData.selectPageImages
      this.slideLoading = false
    },
    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    },

    handleOpenLink (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-unit-plan-preview {
  padding: 20px 16px;

  .top-header {
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
        font-weight: bold;
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
          .copy-button{
            display: flex;
            flex-direction: row;
            align-items: center;
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
    min-height: 100px;
    padding: 0 5px;
    opacity: 1;
    border-radius: 5px;

    .right-detail {

      .tag-detail-block {

        .info-tag {
          padding-left: 75px;
          margin-bottom: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .info-tag-item {
            cursor: pointer;
            padding: 5px 15px;
            background: #fafafa;
            margin-bottom: 8px;
            border: 1px solid rgba(188, 188, 188, 0.5);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            opacity: 1;
            border-radius: 33px;
            font-family: Inter-Bold;
            color: #182552;
          }
        }
      }

      .sub-detail {
        min-height: 100px;
        padding: 10px 0;
        background: rgba(253, 238, 218, 0.5);
        border: 1px solid #DCDCDC;
        border-radius: 5px;

        .block-title {
          font-weight: 500;
          font-size: 16px;
          padding: 5px 15px;
          font-family: Inter-Bold;
          color: #000000;
        }

        .scenario-block-content {
          padding: 5px 10px;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              background: #fff;
              padding: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
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
                padding: 10px 10px;
                background: rgba(255, 187, 0, 0.1);
                color: rgba(255, 187, 0, 1);
                margin-bottom: 10px;
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
                width: 100%;
                .content-sub-item {
                  background: #fff;
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
          padding: 5px 10px;
          .inquiry {
            margin-bottom: 10px;
            background: #fff;
            padding: 10px;
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

  .preview-data-info {
    margin-top: 10px;
    min-height: 100px;
    padding: 5px;
    opacity: 1;
  }

  .left-preview {
    margin-top: 10px;
    height: 100%;

    .edit-action {
      margin-top: 20px;
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
  top:-1px;
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
    width: 100%;
    .img-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      .img-item {
        height: 80px;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin: 0 10px;
        img {
          height: 100%;
        }
      }
    }
  }
}

.data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 15px;
  }
}

.custom-tags {
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

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
      padding: 3px 10px;
    }
  }
}

.learn-question-tag {
  width: 100%;
}

.data-detail-wrapper {
  background: rgba(253, 238, 218, 0.5);
  border: 1px solid rgba(220, 220, 220, 1);
  padding: 10px;
  .detail-block {
    .block-title {
      font-weight: 500;
      font-size: 16px;
      font-family: Inter-Bold;
      color: #000000;
      width: 100%;
    }

    .scenario-block-content {
      padding: 5px 0;
      .content-list {
        display: flex;
        flex-direction: column;

        .content-item {
          background: #fff;
          padding: 5px 10px;
          display: flex;
          flex-direction: row;
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
            width: 250px;
            justify-content: flex-end;

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
        color: rgba(21, 195, 154, 1);
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

.preview-data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 0;
  }

  .content-item {
  }
}

.page-info {
  position: absolute;
  right: 10px;
  bottom: 120px;
  background: #E4E4E4;
  padding: 1px 10px;
  border-radius: 20px;
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

.slide-select-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  /deep/ .ant-carousel .slick-slide img{
    width:100%;
  }
  /deep/ .ant-carousel{
    .custom-slick-arrow:before {
      display: none;
    }
    .custom-slick-arrow:hover {
      opacity: 0.5;
    }
    .slick-slide h3 {
      color: #fff;
    }
    .anticon{
      color: fade(@black, 45%);
      font-size: 30px;
    }
  }
  .slide-select {
    background: #fff;
    position: relative;
    .slide-select-and-preview {
      width:100%;
      //min-height: 400px;

      .reset-edit-basic-info {
        z-index: 100;
        position: absolute;
        top: 10px;
        left: 3px;
        background: rgba(0,0,0, 0.8);
        opacity: 0.7;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 20px;
        cursor: pointer;
        color: #fff;
      }

      .slide-select-action {
        height: 400px;
        width: 600px;
        img {
          width:100%
        }
      }

    }
  }
  .slide-recommend {
    width: 600px;
    padding: 0 20px;
    box-sizing: border-box;
  }
}

.plugin-tags{
  height: 100px;
  width: 650px;
  overflow-y:auto;
  background-color:#F7F7F7;
  font-size: 12px;
  padding-left: 15px;
  font-family: Segoe UI;
  .tag-row{
    margin: 5px;
  }
  .tag-item{
    margin-right: 15px;
  }
  .tag-title{
    font-weight: 400;
    line-height: 0px;
    color: #333334;
    opacity: 1;
  }
  .tag-value{
    margin-left: 10px;
    //max-width: 200px;
  }
}

.associate-info{
  padding: 10px 5px 10px 5px;
}
.top-icon-groups {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height:70px;
  .icon-group{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: auto;
    justify-content: flex-start;
    align-items: center;
    /deep/ .ant-badge-count{
      top:10px;
      right:12px;
    }
    .icon {
      width: 50px;
      height: 50px;
      margin:10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      padding:2px;
      cursor: pointer;
      align-items: center;
      .icon-text {
        display: flex;
        font-size: 12px;
      }
      svg {
        display: flex;
        width: 32px;
        height: 32px;
      }
    }
  }

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
      font-weight: bold;
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
}

.material-row {
  height: 70px;
  display: flex;
  align-items: center;
}

.material-list {
  background: #fff;
  padding: 5px 15px;
}
.material-item {
  margin: 10px 0;
  .material-name {
    font-family: Inter-Bold;
    font-size: 14px;
    font-weight: bold;
    color: #182552;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .material-link {
    cursor: pointer;
    font-family: Inter-Regular;
    font-size: 13px;
    color: #2DC9A4;
    text-decoration: underline;
  }
}
</style>

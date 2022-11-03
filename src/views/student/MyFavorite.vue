<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
      </div>
      <div class="type-owner">
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item disabled>
                <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('all-type', $t('teacher.my-content.all-type'))">
                <span>{{ $t('teacher.my-content.all-type') }}</span>
              </a-menu-item>
              <template v-if="$store.getters.roles.indexOf('teacher') !== -1">
                <a-menu-item @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))">
                  <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))">
                  <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                </a-menu-item>
              </template>
              <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                <span>{{ $t('teacher.my-content.tasks-type') }}</span>
              </a-menu-item>
            </a-menu>
            <a-button
              class="type-filter-button"
              style="padding: 0 20px;display:flex; align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
              <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
              <a-icon type="caret-down" /> </a-button>
          </a-dropdown>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <pubu-svg />
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <liebiao-svg />
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'list'"
          >
            <a-list-item class="my-list-item" slot="renderItem" key="item.key" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name ? item.name : 'Unnamed' }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <span class="status">
                  <template v-if="item.status === 0">Draft</template>
                  <template v-if="item.status === 1">Published</template>
                </span>
                <div class="action">
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div class="start-session-wrapper action-item-wrapper">
                        <div class="session-btn content-list-action-btn" @click="handleStartItem(item)">
                          <div class="session-btn-icon">
                            <a-icon type="play-circle" />
                          </div>
                          <div class="session-btn-text"> Start</div>
                        </div>
                      </div>
                      <div class="more-action-wrapper action-item-wrapper" >
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                                <a>
                                  <a-icon type="delete" theme="filled" /> {{ $t('teacher.my-content.action-delete') }}
                                </a>
                              </a-popconfirm>
                            </a-menu-item>

                          </a-menu>
                        </a-dropdown>
                      </div>
                    </div>
                  </div></div></span>
            </a-list-item>
          </a-list>
          <a-list
            :grid="{ gutter: 16, column: 4 }"
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="viewMode === 'img'">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">
              <a-card class="cover-card" @click="handleViewDetail(item)">
                <div class="mask"></div>
                <div class="mask-actions">
                  <div class="action-item action-item-top">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" class="more-icon" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteItem(item)" cancel-text="No">
                            <a>
                              <a-icon type="delete" theme="filled" /> {{ $t('teacher.my-content.action-delete') }}
                            </a>
                          </a-popconfirm>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                  <div class="action-item action-item-center">
                  </div>
                  <div class="action-item action-item-bottom" >
                    <div class="session-btn" @click.stop="handleStartItem(item)">
                      <div class="session-btn-icon content-list-action-btn">
                        <a-icon type="play-circle" theme="filled" />
                      </div>
                      <div class="session-btn-text">Start</div>
                    </div>
                    <div class="session-btn" @click.stop="handleViewDetail(item)">
                      <div class="session-btn-icon content-list-action-btn">
                        <a-icon type="eye" theme="filled" />
                      </div>
                      <div class="session-btn-text">Preview</div>
                    </div>
                  </div>
                </div>
                <div class="cover-img" :style="{backgroundImage: 'url(' + item.image + ')'}"></div>
                <a-card-meta class="my-card-meta-info" :title="item.name ? item.name : 'Untitled'" :description="item.createTime | dayjs" @click="handleViewDetail(item)">
                  <content-type-icon :type="item.type" slot="avatar"></content-type-icon>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        width="1000px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper-row">
          <div class="view-back">
            <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
          </div>
          <div class="detail-wrapper" v-if="previewCurrentId && previewType">
            <common-preview-v2 @favoritiesAdd="handleFavoriteChange" :id="previewCurrentId" :type="previewType" :isLibrary="true" />
          </div>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { FavoritesGetMyFavorites, FavoritesDelete } from '@/api/favorites'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import storage from 'store'
import ModalHeader from '@/components/Common/ModalHeader'
import {
  CustomTagType
} from '@/const/common'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import { FindCustomTags } from '@/api/tag'
import { SelfStudyTaskBye } from '@/api/selfStudy'
import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import { VIEW_MODE } from '@/store/mutation-types'
import EvaluationSvg from '@/assets/icons/common/evaluation.svg?inline'
import PreviousSessionsSvg from '@/assets/icons/common/PreviousSessions.svg?inline'
import EditSvg from '@/assets/icons/common/Edit.svg?inline'
import CopySvg from '@/assets/icons/common/copy.svg?inline'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import StartEvaluation from '@/assets/icons/common/StartEvaluation.svg?inline'
import StartSessionSvg from '@/assets/icons/common/StartSession.svg?inline'
import TeacherPresenting from '@/assets/icons/common/TeacherPresenting.svg?inline'
import StudentPace from '@/assets/icons/common/StudentPace.svg?inline'
import ClassList from '@/components/Teacher/ClassList'
import CustomTag from '@/components/UnitPlan/CustomTag'

import { UserModeMixin } from '@/mixins/UserModeMixin'

export default {
  name: 'MyFavorite',
  mixins: [UserModeMixin],
  components: {
    CommonPreviewV2,
    ContentStatusIcon,
    ContentTypeIcon,
    ModalHeader,
    TvSvg,
    Bianji,
    TeacherPresenting,
    EvaluationSvg,
    StartSessionSvg,
    PreviousSessionsSvg,
    StartEvaluation,
    ClassList,
    StudentPace,
    CustomTag,
    EditSvg,
    CopySvg,
    LiebiaoSvg,
    PubuSvg
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      myContentList: [],
      currentStatus: 'all-status',
      currentStatusLabel: this.$t('teacher.my-content.all-status'),
      currentType: 'all-type',
      currentTypeLabel: this.$t('teacher.my-content.all-type'),
      currentOwner: 'all-owner',
      currentOwnerLabel: this.$t('teacher.my-content.all-owner'),

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      currentPreviewLesson: null,

      pagination: {
        onChange: page => {
          console.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 15
      },
      pageNo: 1,

      viewMode: storage.get(VIEW_MODE) ? storage.get(VIEW_MODE) : 'list',
      typeMap: typeMap,

      viewPreviewSessionVisible: false,
      PPTCommentPreviewVisible: false,
      classList: [],
      lessonSelectTagVisible: false,
      sessionTags: [],
      sessionItem: {},
      startLoading: false,
      userTags: {},

      customTagList: []
    }
  },
  computed: {
  },
  created () {
    console.info('teacher my content')
    this.loadMyContent()
    this.loadUserTags()
  },
  methods: {
    toggleViewMode (viewMode) {
      this.$logger.info('viewMode', viewMode)
      storage.set(VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    loadMyContent () {
      this.loading = true
      FavoritesGetMyFavorites({
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then(res => {
        console.info('FavoritesGetMyFavorites', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        console.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },
    toggleStatus (status, label) {
      console.info('toggleStatus ' + status + ' label ' + label)
      this.currentStatus = status
      this.currentStatusLabel = label
      this.loadMyContent()
    },
    toggleType (type, label) {
      console.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.loadMyContent()
    },

    handleStartItem (item) {
      this.$logger.info('handleStartItem', item)
      this.$confirm({
        title: 'Confirm Start',
        content: 'Are you sure to Start ' + item.name + ' ?',
        centered: true,
        onOk: () => {
          this.loading = true
          SelfStudyTaskBye({ taskId: item.id }).then((response) => {
            if (response.success) {
              this.$logger.info('SelfStudyTaskBye response', response)
              this.$message.success('Start successfully')
              this.$router.push({ path: '/student/main/my-task' })
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleDeleteItem (item) {
      console.info('handleDeleteItem', item)
      FavoritesDelete(item).then(res => {
        console.info('DeleteMyContentByType', res)
      }).then(() => {
        this.loadMyContent()
      })
    },
    handleViewDetail (item) {
      console.info('handleViewDetail', item)
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handlePreviewClose () {
      console.info('handlePreviewClose')
      this.previewVisible = false
      this.$nextTick(() => {
        this.previewCurrentId = null
        this.previewType = -1
      })
    },

    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.userTags = response.result
          // 默认展示的tag分类
          CustomTagType.task.default.forEach(name => {
            this.customTagList.push(name)
          })
          // 再拼接自己添加的
          this.userTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name) === -1) {
              this.customTagList.push(tag.name)
            }
          })
        } else {
          this.$message.error(response.message)
        }
        // this.$refs.customTag.tagLoading = false
      })
    },
    handleFavoriteChange(item) {
      this.loadMyContent()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 15px;
  cursor: pointer;
}

.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      .toggle-mode-type-wrapper {
        width: 280px;
        box-sizing: border-box;
        .toggle-mode-type {
          height: 40px;
          display: inline-block;
          border-radius: 40px;
          background: rgba(228, 228, 228, 0.3);

          .toggle-mode {
            border-radius: 40px;
            height: 40px;
            display: flex;
            flex-direction: row;
            font-size: 14px;

            //.mode-item:first-child {
            //  border-bottom-left-radius: 35px;
            //  border-top-left-radius: 35px;
            //}
            //
            //.mode-item:last-child {
            //  border-bottom-right-radius: 35px;
            //  border-top-right-radius: 35px;
            //}

            .mode-item {
              padding: 0 8px;
              font-size: 12px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;

              &:hover {
                background: #EDF1F5;
              }
            }

            .skill-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }

            .knowledge-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }

            .general-active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }

    .type-owner {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .content-wrapper {
    min-width: 900px;
    .content-list {
      min-width: 900px;
      .my-list-item {
        overflow: hidden;
        .content-info-left {
          cursor: pointer;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: calc(100% - 600px);

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
            width: 150px;
            color: #11142D;
            font-size: 13px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .status {
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            width: 70px;
          }
        }
        .action {
          width: 400px;
        }

        .action-wrapper {
          height: 33px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .action-item-wrapper {
            display: none;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-left: 5px;

            .session-btn {
              display: flex;
              border-radius: 32px;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              padding: 6px 13px;
              background: rgba(245, 245, 245, 0.5);
              opacity: 1;
              border: 1px solid rgba(188, 188, 188, 1);

              .session-btn-icon {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                i {
                  svg {
                    height: 14px;
                    fill: #182552;
                    stroke: #182552;
                    stroke-width: 0.5px;
                  }
                }
              }
              .session-btn-text {
                font-size: 13px;
                padding-left: 7px;
                font-family: Inter-Bold;
                color: #182552;
                display: flex;
                align-items: center;
              }
            }

            .session-btn:hover {
              border-color: #15c39a;
              background: rgba(21, 195, 154, 0.1);
              .session-btn-icon {
                i {
                  svg {
                    fill: #15c39a;
                    stroke: #15c39a;
                    stroke-width: 0.5px;
                  }
                }

                svg {
                  fill: #15c39a;
                  stroke: #15c39a;
                  stroke-width: 0.5px;
                }
              }

              .session-btn-text {
                display: inline-block;
                color: #15C39A;
              }
            }
          }
        }

        .name-content {
          padding-left: 5px;
          text-align: left;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #11142D;
          display: inline-block;
          max-width: 400px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &:hover {
          box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.10);
          .action-wrapper {
            .action-item-wrapper {
              display: flex;
            }
          }
        }
      }
    }
  }
}
a.delete-action {
  color: @red-4;
}

.view-mode-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;

  &:hover {
    border: 1px solid #15c39a;
  }
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 20px;
      padding-left: 5px;
      margin: 0 3px;
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        height: 22px;
      }
    }

    .active-view {
      svg {
        fill: @primary-color;
      }
    }
  }
}

.cover-card{
  background: #FFFFFF;
  opacity: 1;
  border-radius: 6px;
  border: none;

  .cover-img {
    width: 100%;
    min-height: 160px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 10px;
  }
  &:hover {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    .mask-actions{
      display: block;
    }
    .mask{
      opacity: 0.3;
    }
  }
  .mask-actions{
    margin:-10px;
    height: 100%;
    width: 100%;
    position: absolute;
    flex-direction: column;
    display: none;
    .action-item{
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
    .action-item-top{
      height: 20px;
      flex-direction: row;
      justify-content: flex-end;
      padding-top: 15px;
      i{
        width: 25px;
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }
    .action-item-center{
      min-height: 150px;
      .session-btn{
        margin:15px
      }
      .session-btn-left {
        width: 160px;
        height: 40px;
        background: #15C39A;
        opacity: 1;
        border-radius: 20px;
        justify-content: center;
        display: flex;
        padding: 6px 13px;
        .session-btn-text {
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
          display: flex;
          align-items: center;
          display: flex;
          align-items: center;
          svg {
            margin-right: 5px;
          }
        }
      }

      .session-btn-right {
        width: 160px;
        height: 40px;
        background: #182552;
        opacity: 1;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        padding: 6px 13px;
        .session-btn-text {
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
          display: flex;
          align-items: center;

          svg {
            margin-right: 5px;
          }
        }
      }
    }
    .action-item-bottom{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .session-btn {
        height: 33px;
        width: auto;
        display: flex;
        border-radius: 32px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 6px 10px;
        transition: all 0.3s ease-in-out;
        background: rgba(245, 245, 245, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
        .session-btn-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          svg {
            height: 14px;
            fill: #182552;
            stroke: #182552;
            stroke-width: 0.5px;
          }
        }

        .session-btn-text {
          transition: all 0.3s ease-in-out;
          display: none;
          font-size: 13px;
          padding-left: 7px;
          font-family: Inter-Bold;
          color: #182552;
        }
      }

      .session-btn:hover {
        .session-btn-text {
          display: inline-block;
        }
      }
    }
  }

  img {
    width: 100%;
    height: 160px;
    padding: 5px 10px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    //border-bottom: 1px solid #eee;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;

  }
}

.my-card-meta-info {
  margin-top: 10px;

  .ant-card-meta-avatar {
    padding-right: 0;
  }
}

.mask {
  height: 100%;
  width: 100%;
  opacity: 0;
  margin:-10px;
  position: absolute;
  cursor: pointer;
  transition: opacity 0.8s;
  background: #0A1C32;
  border-radius: 6px;
}

</style>

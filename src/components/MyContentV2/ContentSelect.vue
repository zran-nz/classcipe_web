<template>
  <div class="content-select">
    <div class="content-select-title" v-show="title">
      {{ title }}
    </div>
    <div class="content-select-wrap">
      <div class="content-select-left">
        <div class="content-select-filter" v-show="showFilter">
          <a-radio-group @change="handleSearch" v-model="sourceApi" button-style="solid">
            <a-radio-button value="FindMyContent">
              My content
            </a-radio-button>
            <!-- <a-radio-button value="QueryContentsFilter">
              Library
            </a-radio-button> -->
          </a-radio-group>
          <div class="filter-search">
            <a-input-search
              placeholder="Search"
              v-model="queryParams.searchKey"
              @search="handleSearch"
              @pressEnter="handleSearch"
              :allowClear="true"
            >
            </a-input-search>
          </div>
        </div>
        <div class="content-select-con">
          <a-spin :spinning="loading">
            <div class='content-list'>
              <template v-if='myContentList.length !== 0 && !loading'>
                <template v-for="content in myContentList">
                  <div :class="{'content-item': true, 'selected': selectedId === content.id, 'unselect': calculateCantSelect(content)}" :key="content.id" @click='handlePreviewDetail(content)'>
                    <div class='cover'>
                      <div class='cover-block' :style="{'background-image': `url('${content.image || 'http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png'}')`}">
                      </div>
                    </div>
                    <div class='detail'>
                      <div class='detail-content'>
                        <div class='base-info'>
                          <div class='header-line vertical-between'>
                            <div class='left vertical-left'>
                              <div class='type-icon vertical-left'>
                                <a-space>
                                  <content-type-icon :type="content.type" />
                                  <collaborate-icon v-if='content.collaborates > 0'/>
                                  <a-icon type="shopping" v-if='content.sourceFrom' />
                                </a-space>
                              </div>
                              <div class='name'>
                                {{ content.name || 'Untitled ' + contentTypeName(content) }}
                              </div>
                            </div>
                            <div class='right vertical-right' style="width: 90px;">
                              <div class='time-at'>
                                {{ (content.updateTime || content.createTime) | datejs }}
                              </div>
                            </div>
                          </div>
                          <div class='extra-info'>
                            <a-space>
                              <div class='info-item curriculum-info' v-show='curriculumName(content) && content.type !== typeMap.pd'>
                                {{ curriculumName(content) }}
                              </div>
                              <div class='info-item subject-info'>
                                <a-space>
                                  <div class='subject-item' v-for='(subject, idx) in content.subjectList.slice(0, 2)' :key='subject + idx'>{{ subject }}</div>
                                </a-space>
                                <div class='more-item' v-if='content.subjectList.slice(2).length'>
                                  <a-tooltip placement='top' :title='content.subjectList.slice(2).join("、 ")' >more({{ content.subjectList.slice(2).length }})</a-tooltip>
                                </div>
                              </div>
                              <div class='info-item year-info'>
                                <a-space>
                                  <div class='subject-item' v-for='(year, idx) in content.yearList.slice(0, 4)' :key='year + idx'>{{ year }}</div>
                                </a-space>
                                <div class='more-item' v-if='content.yearList.slice(4).length'>
                                  <a-tooltip placement='top' :title='content.yearList.slice(4).join("、 ")' >more({{ content.yearList.slice(4).length }})</a-tooltip>
                                </div>
                              </div>
                              <div class='info-item task-type-info' v-if='content.taskType'>
                                <div class='self-type-wrapper'>
                                  <div class='self-field-label'>
                                    <div
                                      class='task-type-item green-active-task-type'
                                      v-if="content.taskType === 'FA'">
                                      <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                                    </div>
                                    <div
                                      class='task-type-item red-active-task-type'
                                      v-if="content.taskType === 'SA'">
                                      <a-tooltip placement='top' title='Summative Assessment'>SA</a-tooltip>
                                    </div>
                                    <div
                                      class='task-type-item blue-active-task-type task-type-activity'
                                      v-if="content.taskType === 'Activity'">
                                      <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                                    </div>
                                    <div
                                      class='task-type-item blue-active-task-type task-type-examine'
                                      v-if="content.taskType === 'IA'">
                                      <a-tooltip title='Internal Assessment' placement='top'>IA</a-tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a-space>
                          </div>
                          <div class='tag-info' v-if='knowledgeTagsList(content).length'>
                            <div class='tag-info-item' v-for='(knowledgeTag, cIdx) in knowledgeTagsList(content)' :key='knowledgeTag + cIdx'>
                              <a-tag color='#EABA7F' class='tag-item knowledge-tag' :title='knowledgeTag'>{{ knowledgeTag }}</a-tag>
                            </div>
                          </div>
                          <div class='tag-info'>
                            <template v-if='commandTermsList(content).length'>
                              <div class='tag-info-item' v-for='(command, cIdx) in commandTermsList(content)' :key='command + cIdx'>
                                <a-tag color='#06ACD7' class='tag-item command-tag' :title='command'>{{ command }}</a-tag>
                              </div>
                            </template>
                            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='customTag.name + idx'>
                              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
                            </div>
                          </div>
                        </div>
                        <!-- <div class='right-info'>
                          <div class='update-time'>
                            {{ content.updateTime | dayjs }}
                          </div>
                        </div> -->
                      </div>
                      <div class='footer-line'>
                        <div class='avatar-info'>
                          <div class='owner'>
                            <template v-if='content.owner'>
                              <a-avatar v-if='content.owner.avatar' :src='content.owner.avatar' size="small" />
                              <img v-else src="~@/assets/icons/library/default-avatar.png"/>
                            </template>
                            <template v-else>
                              <a-avatar size="small">{{ content.createBy.toUpperCase()[0] }}</a-avatar>
                            </template>
                            <!-- <div class='user-name' v-if="content.owner.email === $store.getters.email">
                              Me
                            </div> -->
                            <div class='user-name'>
                              {{ (content.owner ? (content.owner.firstname + ' ' + content.owner.lastname) : content.createBy) | upCaseFirst }}
                            </div>
                          </div>
                        </div>

                        <div class='action vertical-right'>
                          <a-tooltip title="Incompleted content" v-if="calculateCantSelect(content)">
                            <a-icon type="exclamation" style="font-size:16px;font-weight:bold;color:#ef4136;" />
                          </a-tooltip>
                        </div>
                      </div>
                    </div>
                    <div class="opt" v-show="selectedId === content.id">
                      <!-- <img src="~@/assets/icons/lesson/selected.png" /> -->
                      <a-tooltip title="Incompleted content" v-if="calculateCantSelect(content)">
                        <a-icon type="check-circle" theme="filled" />
                      </a-tooltip>
                      <a-icon v-else type="check-circle" theme="filled" />
                    </div>
                  </div>
                </template>
              </template>
              <template v-if='myContentList.length === 0 && !loading'>
                <div class='empty-tips'>
                  <no-more-resources/>
                </div>
              </template>
            </div>
          </a-spin>
        </div>
      </div>
      <div class="content-select-right">
        <div class='empty-tips' v-if="!selectedId">
          <no-more-resources tips="No content selected" />
        </div>
        <div v-show='selectedId' class="preview-wrap">
          <iframe src="/v2/v2Box?header=0" class='preview-iframe' ref='previewFrame'></iframe>
        </div>
      </div>
    </div>
    <div class="content-select-action">
      <a-button type="" @click="handleCancel">{{ backText }}</a-button>
      <a-tooltip v-if="!selectedId || calculateCantSelect(selectedObj)" title="No completed content selected">
        <a-button :disabled="true" type="primary">Next</a-button>
      </a-tooltip>
      <a-button v-else type="primary" @click="handleNext">Next</a-button>
    </div>
  </div>
</template>

<script>
import { FindMyContent } from '@/api/teacher'
import { QueryContentsFilter } from '@/api/library'
import NoMoreResources from '@/components/Common/NoMoreResources'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import CollaborateIcon from '@/assets/v2/icons/collaborate.svg?inline'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { USER_MODE } from '@/const/common'
import { getLabelNameType, typeMap } from '@/const/teacher'
import { mapState } from 'vuex'
import { uniqBy } from 'lodash-es'
export default {
  name: 'ContentSelect',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    NoMoreResources,
    ContentTypeIcon,
    CollaborateIcon
  },
  props: {
    type: {
      type: Number,
      default: undefined
    },
    title: {
      type: String,
      default: ''
    },
    backTxt: {
      type: String,
      default: 'Discard'
    },
    datas: {
      type: Array,
      default: () => []
    },
    needFilter: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    datas(val) {
      if (val && !this.showFilter) {
        this.myContentList = val.filter(item => item.owner.email === this.$store.getters.email).concat()
        if (this.myContentList.length === 0) {
          this.selectedId = ''
        }
      }
    },
    needFilter(val) {
      this.showFilter = val
      if (!val && this.datas) {
        this.myContentList = this.datas.filter(item => item.owner.email === this.$store.getters.email).concat()
        if (this.myContentList.length === 0) {
          this.selectedId = ''
        }
      }
    },
    backTxt(val, newVal) {
      this.backText = val
    }
  },
  data() {
    return {
      typeMap: typeMap,
      FindMyContent: FindMyContent,
      QueryContentsFilter: QueryContentsFilter,
      loading: false,
      sourceApi: 'FindMyContent',
      queryParams: {
        type: [this.type],
        searchKey: '',
        delFlag: 0,
        pageNo: 1,
        pageSize: 1000,
        types: [this.type]
      },
      myContentList: [],
      selectedId: '',
      selectedObj: '',
      previewLoading: true,
      backText: this.backTxt,
      showFilter: this.needFilter,
      baseUrl: null
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
  },
  created() {
    this.init()
    const host = window.location.host
    if (host.indexOf('localhost') !== -1) {
      this.baseUrl = 'http://localhost:9004'
    } else if (host.indexOf('dev.classcipe.com') !== -1) {
      this.baseUrl = 'https://dev.classcipe.com'
    } else if (host.indexOf('my.classcipe.com') !== -1) {
      this.baseUrl = 'https://my.classcipe.com'
    } else {
      this.$logger.warn('ContentPreview: unknown host', host)
    }
  },
  methods: {
    init() {
      if (!this.showFilter) {
        return
      }
      this.loading = true
      if (this.type === typeMap['unit-plan']) {
        this.queryParams.linkedTask = true
      } else {
        delete this.queryParams.linkedTask
      }
      this[this.sourceApi]({
        ...this.queryParams,
        // linkedTask: true, // 过滤关联task的unit
        schoolId: this.currentSchool.id // this.userMode === USER_MODE.SELF ? null : this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.myContentList = ((res.result && res.result.records) || []).filter(item => item.owner.email === this.$store.getters.email)
        }
      }).finally(res => {
        this.loading = false
      })
    },
    handleSchoolChange(currentSchool) {
      this.init()
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      if (userMode === USER_MODE.SELF) {
        this.init()
      }
    },
    async handlePreviewDetail(item) {
      const type = { 4: 'task', 2: 'unit', 9: 'pd', 8: 'video', slide: 'session' }[item.type]
      console.log(item, type, this.$refs.previewFrame)
      window._test = this.$refs.previewFrame
      this.$refs.previewFrame.contentWindow.postMessage({ id: 'iframeBox', data: {
        path: `/v2Box`, query: { header: 0 }
      }})
      await sleep(300)
      this.$refs.previewFrame.contentWindow.postMessage({ id: 'iframeBox', data: {
        path: `/${type}/view/${item.id}`, query: { header: 0 }
      }})
      if (this.selectedId === item.id) {
        this.selectedId = ''
        this.selectedObj = null
      } else {
        this.selectedId = item.id
        this.selectedObj = { ...item }
      }
      this.previewLoading = true
      setTimeout(() => {
        this.previewLoading = false
      }, 300)
    },
    calculateCantSelect(content) {
      // (content.type === typeMap.task || content.type === typeMap.pd) &&
      return !content || ((!content.canPublish || content.slideEditing))
    },
    handleSearch() {
      this.init()
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleNext() {
      const item = this.myContentList.find(res => res.id === this.selectedId)
      this.$emit('choose', item)
    },
    contentTypeName (content) {
      return content ? getLabelNameType(content.type) : null
    },
    curriculumName (content) {
      return this.$store.getters.curriculumId2NameMap.hasOwnProperty(content.curriculumId) ? this.$store.getters.curriculumId2NameMap[content.curriculumId] : null
    },
    isOwner (content) {
      return this.$store.getters.userInfo.email === content.createBy
    },
    commandTermsList (content) {
      return uniqBy((content.learnOuts.map(item => item.commandTerms)).flat(2), 'name').map(item => item.name)
    },
    knowledgeTagsList (content) {
      return uniqBy((content.learnOuts.map(item => item.knowledgeTags)).flat(2), 'name').map(item => item.name)
    }

  }
}
</script>

<style scoped lang="less">
.content-select {
  position: relative;
  .content-select-title {
    font-size: 15px;
    font-family: Arial;
    font-weight: bold;
    color: #171717;
  }
  .content-select-wrap {
    margin-top: 30px;
    display: flex;
    .content-select-left {
      flex: 1;
      background: #fff;
      padding-right: 5px;
      .content-select-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .filter-search {
          width: 150px;
        }
      }
      .content-select-con {
        overflow: auto;
        height: 500px;
        .content-list {
          min-height: 200px;
          .content-item {
            padding: 7px 10px;
            margin: 8px 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            overflow: hidden;
            border: 1px solid #E1E6ED;
            cursor: pointer;
            position: relative;
            &.selected {
              border: 1px solid @primary-color;
            }
            .cover {
              border: 1px solid #e1e1e1;
              .cover-block {
                height: 100px;
                width: 137px;
                background-position: center center;
                background-size: cover;
                background-repeat: no-repeat;
              }
            }

            .detail {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding-left: 10px;

              .detail-content {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-grow: 1;

                .base-info {
                  width: 100%;
                  .name {
                    line-height: 20px;
                    font-size: 14px;
                    color: #1D2041;
                    font-weight: 500;
                    max-width: 200px;
                    // white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .tag-info {
                    display: flex;
                    flex-direction: row;
                    max-height: 30px;
                    overflow: hidden;
                    align-items: center;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    margin-top: 7px;
                    margin-bottom: 7px;
                    .tag-info-item {
                      margin-right: 5px;
                      margin-bottom: 5px;
                    }
                  }
                  .type-icon {
                    .ant-space-item {
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      justify-content: center;
                    }
                    svg {
                      width: 25px;
                      height: 25px;
                    }
                  }
                }
              }
            }
            .footer-line {
              height: 40px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              .avatar-info {
                // width: 200px;
                img {
                  width: 24px;
                  height: 24px;
                  border-radius: 24px;
                }
              }
              .action {
                width: calc(100% - 300px);
                > div {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  margin-left: 10px;
                }
              }
            }
            .opt {
              position: absolute;
              top: 0;
              right: 5px;
              img {
                width: 18px;
                height: 18px;
              }
              i {
                font-size: 18px;
                color: @primary-color;
              }
            }
            &.unselect {
              .opt {
                i {
                  font-size: 18px;
                  color: #ddd!important;
                }
              }
            }
          }
        }
      }
    }
    .content-select-right {
      background: #F7F8F9;
      flex: 1;
      height: 375px;
      overflow: auto;
      .preview-wrap {
        .preview-iframe {
          height: 100vh;
          width: 100%;
          border: none;
          outline: none;
        }
        /deep/ .preview-carousel-wrapper {
          height: 330px;
          .slider-img-cover {
            height: 300px;
          }
        }
        /deep/ .my-common-preview {
          .top-header {
            display: none;
          }
          .extra-content-preview {
            display: none;
          }
        }
        /deep/ .empty-tips {
          margin-top: 170px;
        }
        /deep/ .content-preview-detail {
          .top-fixed-header {
            display: none!important;
          }
          .card-list {
            width: auto;
          }
          .reviews-edit {
            .reviews-edit__check {
              div {
                label {
                  width: 110px;
                }
                .ant-rate{
                  font-size: 16px!important;
                }
              }
            }
          }
        }
      }
    }
  }
  .empty-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }
  .content-select-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
}
.content-select-right {
  .empty-tips {
    margin-top: 170px;
  }
}
.self-type-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .self-field-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;

    .task-type-item {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 25px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .task-type-activity {
      width: 70px;
      border-radius: 50px;
    }

    .green-active-task-type {
      background: rgba(21, 195, 154, 0.1);
      border: 2px solid #15C39A;
      border-radius: 50%;
      font-weight: bold;
      color: #15C39A;
    }

    .red-active-task-type {
      background: rgba(255, 51, 85, 0.1);
      border: 2px solid #FF3355;
      border-radius: 50%;
      opacity: 1;
      font-weight: bold;
      color: #FF3355;
      opacity: 1;
    }

    .blue-active-task-type {
      background: rgb(230, 247, 255);
      border: 2px solid rgb(145, 213, 255);
      border-radius: 50px;
      opacity: 1;
      font-weight: bold;
      color: rgb(24, 144, 255);
    }
  }

  .self-type-filter {
    width: 500px;
  }
}
.extra-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
  justify-content: flex-start;

  .info-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    align-items: center;

    .more-item {
      padding-left: 8px;
      color: #aaa;
      cursor: pointer;
    }
  }

  .curriculum-info {
    font-size: 0.6rem;
    background: #E6E4FF;
    padding: 5px 10px;
    border-radius: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #464ABB;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .subject-info {
    font-size: 0.6rem;
    font-family: Arial;
    font-weight: 400;
    color: #3D94FF;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .year-info {
    font-size: 0.6rem;
    font-family: Arial;
    font-weight: 400;
    color: #FFA63D;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
}

.owner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .user-name {
    padding-left: 5px;
  }
}

.tag-item {
  opacity: 0.8;
  cursor: pointer;
  color: #734110;
  font-size: 12px;
  border-radius: 30px;
  line-height: 25px;
  word-break: normal;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  transition: all 0.3s ease;

  /deep/ .anticon-close {
    opacity: 0;
    color: #f26c59;
  }

  &:hover {
    /deep/ .anticon-close {
      opacity: 1;
    }
  }
}
</style>

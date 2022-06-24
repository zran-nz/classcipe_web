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
            <a-radio-button value="QueryContentsFilter">
              Library
            </a-radio-button>
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
                  <div :class="{'content-item': true, 'selected': selectedId === content.id}" :key="content.id" @click='handlePreviewDetail(content)'>
                    <div class='cover'>
                      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
                      </div>
                    </div>
                    <div class='detail'>
                      <div class='detail-content'>
                        <div class='base-info'>
                          <div class='name'>
                            {{ content.name }}
                          </div>
                          <div class='tag-info'></div>
                          <div class='owner'>
                            {{ content.createBy }}
                          </div>
                        </div>
                        <!-- <div class='right-info'>
                          <div class='update-time'>
                            {{ content.updateTime | dayjs }}
                          </div>
                        </div> -->
                      </div>
                    </div>
                    <div class="opt" v-show="selectedId === content.id">
                      <img src="~@/assets/icons/lesson/selected.png" />
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
        <div v-else class="preview-wrap">
          <!-- <iframe :src="iframeSrc" class='preview-iframe' id='library-iframe' v-if='iframeSrc'></iframe> -->
          <!-- <common-preview-v2 v-if="!previewLoading" :id="selectedId" :type="type" /> -->
          <content-preview-detail
            :contentId="selectedObj.id"
            :contentType="selectedObj.type"
            v-if="!previewLoading"
          />
        </div>
      </div>
    </div>
    <div class="content-select-action">
      <a-button type="" @click="handleCancel">{{ backText }}</a-button>
      <a-button :disabled="!selectedId" type="primary" @click="handleNext">Next</a-button>
    </div>
  </div>
</template>

<script>
import { FindMyContent } from '@/api/teacher'
import { QueryContentsFilter } from '@/api/library'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import ContentPreviewDetail from '@/components/Preview/ContentPreviewDetail'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { USER_MODE } from '@/const/common'
import { mapState } from 'vuex'
export default {
  name: 'ContentSelect',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    NoMoreResources,
    CommonPreviewV2,
    ContentPreviewDetail
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
        this.myContentList = val.concat()
      }
    },
    needFilter(val) {
      this.showFilter = val
    },
    backTxt(val, newVal) {
      this.backText = val
    }
  },
  data() {
    return {
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
    iframeSrc() {
      if (this.baseUrl) {
        return this.baseUrl + '/v2/iframe/detail/' + this.type + '/' + this.selectedId
      }
      return null
    }
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
      this[this.sourceApi]({
        ...this.queryParams,
        schoolId: this.currentSchool.id // this.userMode === USER_MODE.SELF ? null : this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.myContentList = (res.result.records || res.result).filter(item => !!item.presentationId)
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
    handlePreviewDetail(item) {
      this.previewLoading = true
      this.selectedId = item.id
      this.selectedObj = { ...item }
      setTimeout(() => {
        this.previewLoading = false
      }, 300)
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
      flex: 0.8;
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
        height: 330px;
        .content-list {
          min-height: 200px;
          .content-item {
            padding: 7px 10px;
            margin: 8px 0;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
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
                height: 76px;
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
              height: 76px;

              .detail-content {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                flex-grow: 1;

                .base-info {
                  .name {
                    line-height: 20px;
                    font-size: 14px;
                    color: #1D2041;
                    font-weight: 500;
                    width: 200px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
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
        /deep/ .my-common-preview {
          .top-header {
            display: none;
          }
          .extra-content-preview {
            display: none;
          }
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
</style>

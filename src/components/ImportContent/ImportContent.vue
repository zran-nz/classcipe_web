<template>
  <a-modal
    width="1300px"
    :dialog-style="{ top: '80px'}"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible"
    destroyOnClose>
    <modal-header title='Import' @close='handleCloseModal'/>
    <a-row>
      <a-col span='13'>
        <div class='school-switch'>
          <a-radio-group :default-value="currentSchoolId" button-style="solid" class='cc-radio-group' v-model='currentSchoolId' @change='handleSearchContent'>
            <a-radio-button :value="0" v-if='userMode === USER_MODE.SCHOOL'>
              Personal
            </a-radio-button>
            <a-radio-button :value="school.id" v-for='school in info.schoolList' :key='school.id' v-show='userMode === USER_MODE.SELF || (currentSchool && school.id !== currentSchool.id)'>
              {{ school.schoolName }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class='content-wrapper'>
          <a-spin tip='Loading...' :spinning="loading">
            <div class='content-list'>
              <template v-if='pagination.total !== 0 && !loading'>
                <div class='data-content-item' v-for='content in myContentList' :key='content.id' @click='handleSelect(content)'>
                  <div class='item-checked-icon'>
                    <img src='~@/assets/icons/lesson/selected.png' class='selected-item' v-if='selectedList.indexOf(content) !== -1' />
                    <div class="empty-circle" v-if='selectedList.indexOf(content) === -1'></div>
                  </div>
                  <content-item
                    :show-button='false'
                    :click-preview='false'
                    :active-item='selectedList.indexOf(content) !== -1'
                    :content='content' />
                </div>
              </template>
              <template v-if='pagination.total === 0 && !loading'>
                <div class='empty-tips'>
                  <no-more-resources />
                </div>
              </template>
            </div>
          </a-spin>
        </div>
      </a-col>
      <a-col span='10' offset='1'>
        <div class='active-item-preview'>
          <content-preview :content-id='currentActiveItem.id' :content-type='currentActiveItem.type' v-if='currentActiveItem' />
        </div>
      </a-col>
    </a-row>
    <div class='action-bar'>
      <a-pagination
        v-model="pageNo"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :showTotal='pagination.showTotal'
        @change='pagination.onChange'
        show-less-items />
      <div class='action-right'>
        <a-space>
          <a-button type='primary' @click='handleImport' :loading='importing' :disabled='selectedList.length === 0'>Import</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'
import { FindMyContent } from '@/api/teacher'
import * as logger from '@/utils/logger'
import ContentItem from '@/components/MyContentV2/ContentItem'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { mapState } from 'vuex'
import ContentPreview from '@/components/Preview/ContentPreview'
import { ImportOtherIdentityContent } from '@/api/v2/mycontent'
import { USER_MODE } from '@/const/common'
import EventBus from '@/utils/eventBus'
import { MyContentEvent } from '@/components/MyContent/MyContentEventBus'

export default {
  name: 'ImportContent',
  components: {
    ContentPreview,
    NoMoreResources,
    ContentItem,
    ModalHeader
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      currentSchoolId: 0, // 0表示个人模式
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.handleSearchContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10
      },
      pageNo: 1,

      loading: false,
      myContentList: [],
      selectedList: [],
      currentActiveItem: null,
      importing: false,
      USER_MODE: USER_MODE
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    })
  },
  created() {
    if (this.userMode === this.USER_MODE.SELF) {
      const target = this.info.schoolList.find(item => item.id !== this.currentSchool.id)
      if (target) {
        this.currentSchoolId = target.id
        this.handleSearchContent()
      }
    } else if (this.userMode === this.USER_MODE.SCHOOL) {
      this.handleSearchContent()
    }
    this.$logger.info('ImportContent created ' + this.currentSchoolId)
  },
  methods: {
    handleCloseModal () {
      this.$emit('close')
    },
    handleSearchContent () {
      this.loading = true
      const params = {
        collabrated: false,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : '',
        types: [],
        schoolId: this.currentSchoolId,
        // status: 1,
        // createBy: this.$store.getters.email,
        delFlag: 0,
        isImport: true
      }
      FindMyContent(params).then(res => {
        logger.info('handleSearchContent', res)
        if (res.success && res.code === 0) {
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          if (res.result.records.length === 0 && this.pagination.total > 0) {
            this.pageNo = res.result.pages
            this.handleSearchContent()
          }
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },

    handleSelect (content) {
      this.$logger.info('handleSelect', content)
      if (this.selectedList.indexOf(content) === -1) {
        this.selectedList.push(content)
        this.currentActiveItem = content
      } else {
        this.selectedList.splice(this.selectedList.indexOf(content), 1)
        if (this.selectedList.length) {
          this.currentActiveItem = this.selectedList[this.selectedList.length - 1]
        } else {
          this.currentActiveItem = null
        }
      }
    },

    handleImport () {
      this.$logger.info('handleImport', this.selectedList)
      const data = {
        otherContents: []
      }

      this.selectedList.forEach(item => {
        data.otherContents.push({
          id: item.id,
          type: item.type
        })
      })

      this.$logger.info('handleImport data', data)
      this.importing = true
      ImportOtherIdentityContent(data).then((res) => {
        if (res.success && res.code === 0) {
          this.$message.success('Import successfully')
          this.$emit('close')
          EventBus.$emit(MyContentEvent.ReloadMyContent, {})
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.importing = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-wrapper {
  .content-list {
    margin-top: 10px;
    padding: 0 15px 0 0;
    height: 600px;
    overflow-y: auto;
    .empty-tips {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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

.data-content-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
}

.action-bar {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.school-switch {
  padding-left: 30px;
  overflow-x: auto;
}

.active-item-preview {
  margin-top: 50px;
  height: 600px;
  overflow-y: auto;
}

</style>

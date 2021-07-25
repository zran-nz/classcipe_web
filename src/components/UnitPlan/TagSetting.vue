<template>
  <div>
    <a-card>
      <div class="skt-tag-wrapper" >
        <!--      skt-tag-list-->
        <a-row>
          <a-col offset="0" :span="24">
            <div class="tag-search-input">
              <a-input-search
                v-model="inputTag"
                size="large"
                placeholder="Search for the category you need"
                class="search-input"
                @search="handleKeyup"
                @keyup="handleKeyup" />
            </div>
          </a-col>
        </a-row>

        <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" :span="24">
              <div class="skt-tag-list new-color">
                <div class="skt-tag-item" v-for="(tag,index) in tagSearchList" :key="index" >
                  <a-tag
                    draggable="true"
                    @click="selectChooseTag(index,tag)"
                    color="green"
                    class="tag-item">
                    {{ tag.name }}
                  </a-tag>
                </div>
                <div class="skt-tag-create-line" v-show="createTagName && createTagName.length >= 1">
                  <div class="create-tag-label">
                    Create
                  </div>
                  <div class="create-tag">
                    <a-tag class="tag-item" color="orange">
                      {{ createTagName }}
                    </a-tag>
                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-row>
          <div class="content-list-wrapper">
            <div class="content-header">
              <div class="title" >
                System recommendation
              </div>
            </div>
            <div class="content-list">
              <template v-if="globalTagLables.length > 0">
                <div class="skt-tag-list">
                  <div class="skt-tag-item" v-for="tag in globalTagLables" :key="tag.id" >
                    <a-badge>
                      <a-icon v-if="selectedGlobalLabels.indexOf(tag.name) > -1" slot="count" type="check" style="color: #f5222d" />
                      <a-tag
                        @click="selectGlobalTag(tag)"
                        :class="{'tag-item': true, 'active': selectedGlobalLabels.indexOf(tag.name) > -1}" >
                        {{ tag.name }}
                      </a-tag>
                    </a-badge>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="content-empty" >
                  <a-empty />
                </div>
              </template>
            </div>

          </div>
        </a-row>

        <a-row>
          <div class="content-list-wrapper">
            <div class="content-header">
              <div class="title" >
                All Tag Labels
              </div>
            </div>
            <div class="content-list">
              <template v-if="userTags.length > 0" >
                <a-row v-for="root in userTags" :key="root.id" v-if="!root.isGlobal">
                  <div class="skt-tag-list">
                    <div class="skt-tag-item">
                      <a-badge>
                        <a-icon @click="removeTag(root)" slot="count" type="close" />
                        <a-tag
                          color="orange"
                          class="tag-item-yellow" >
                          {{ root.name }}
                        </a-tag>
                      </a-badge>
                    </div>
                    <div class="skt-tag-item" v-for="tag in root.keywords" :key="tag.id" >
                      <a-badge>
                        <a-icon @click="removeTag(tag)" slot="count" type="close" style="color: #f5222d" />
                        <a-tag
                          color="green">
                          {{ tag.name }}
                        </a-tag>
                      </a-badge>
                    </div>
                  </div>
                </a-row>
              </template>
              <template v-else>
                <div class="content-empty" >
                  <a-empty />
                </div>
              </template>
            </div>

          </div>
        </a-row>

      </div>

      <a-spin v-show="tagLoading" class="spin-loading"/>

    </a-card></div>
</template>

<script>
  import * as logger from '@/utils/logger'
  import { GetRootGlobalTag, GetUserTags, UserTagAddOrUpdate, UserTagDelete } from '../../api/tag'

  const { debounce } = require('lodash-es')

export default {
  name: 'TagSetting',
  components: {
  },
  props: {
  },
  data () {
    return {
      createTagName: '',
      tagSearchList: [],
      tagLoading: false,
      inputTag: '',
      selectedGlobalLabels: [],
      globalTagLables: [],
      userTags: []
    }
  },
  computed: {
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    this.tagLoading = true
    GetRootGlobalTag().then((response) => {
      this.$logger.info('GetRootGlobalTag response', response.result)
      if (response.success) {
        this.globalTagLables = response.result
      } else {
        this.$message.error(response.message)
      }
    })

    GetUserTags().then((response) => {
      this.$logger.info('GetUserTags response', response.result)
      if (response.success) {
        this.userTags = response.result
        this.userTags.forEach(item => {
          if (item.isGlobal) {
            this.selectedGlobalLabels.push(item.name)
          }
        })
      } else {
        this.$message.error(response.message)
      }
      this.tagLoading = false
    })
  },
  mounted () {
  },
  methods: {
    handleKeyup () {
      this.$logger.info('skill handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
    },
    searchTag (keyword) {
      logger.info('tag searchTag', keyword)
      // this.filterKeyword()
    },
    handleCreateTagByInput () {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
      const userTypeTags = this.userTags.filter(item => item.name === this.createTagName)
      if (userTypeTags.length > 0) {
        this.$message.warn('already exist same name label')
      } else {
        var item = {
          name: this.createTagName,
          isGlobal: false
        }
        this.tagLoading = true
        UserTagAddOrUpdate(item).then((response) => {
          this.$logger.info('add UserTagAddOrUpdate ', response.result)
          if (response.success) {
            item.id = response.result.id
            this.createTagName = ''
            this.inputTag = ''
            this.userTags.push(item)
            this.$message.success('Add tag success')
            this.$emit('add-user-tag', item, true)
          } else {
            this.$message.error(response.message)
          }
          this.tagLoading = false
        })
      }
    },
    selectChooseTag (index, tag) {
      this.tagList.push(tag)
    },
    selectGlobalTag (tag) {
      var index = this.selectedGlobalLabels.indexOf(tag.name)
      if (index > -1) {
        this.selectedGlobalLabels.splice(index, 1)
        UserTagDelete({ name: tag.name, isGlobal: true }).then((response) => {
          this.$message.success('Remove tag success')
          this.$emit('add-user-tag', tag, false)
        })
      } else {
        this.selectedGlobalLabels.push(tag.name)
        this.tagLoading = true
        UserTagAddOrUpdate({ name: tag.name, isGlobal: true }).then((response) => {
          if (response.success) {
            this.$message.success('Add tag success')
            this.$emit('add-user-tag', tag, true)
          } else {
            this.$message.error(response.message)
          }
          this.tagLoading = false
        })
      }
    },
    removeTag (tag) {
      this.$confirm({
        content: `Whether to delete the current label ?`,
        onOk: () => {
          this.tagLoading = true
          UserTagDelete({ id: tag.id }).then((response) => {
            this.$logger.info('UserTagDelete response', response.result)
            if (response.success) {
              GetUserTags().then((response) => {
                if (response.success) {
                  this.userTags = response.result
                }
                this.tagLoading = false
                this.$message.success(response.message)
                this.$emit('add-user-tag', tag, true)
              })
            } else {
              this.$message.error(response.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.spin-loading {
  margin-top: -100px;
  margin-left: 40%;
  width: 100px;
}
.skt-tag-wrapper {

  .title{
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    padding: 20px 20px 10px 0px;
  }
  .skt-tag-list {
    background-color: #e7f9f5;
    padding: 5px 10px;
    /*border: 1px dashed #ccc;*/
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .skt-tag-item {
      margin: 8px 10px 8px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;

      .tag-item {
        background-color:#d2f4eb ;
        border-radius: 15px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding: 6px;
        font-size: 18px;

        &:hover {
          border: 1px solid @primary-color;
        }

      }
      .tag-item-yellow{
        background-color: #fff9d3;
        border-radius: 15px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding: 6px;
        font-size: 18px;

        &:hover {
          border: 1px solid @primary-color;
          background-color: fade(@outline-color, 10%);
        }
      }

      .ant-tag{
        border-radius: 15px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding: 5px;
        font-size: 14px;
        &:hover {
          border: 1px solid @primary-color;
          font-color: @primary-color;
        }
      }
    }

    .skt-tag-create-line {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 5px 0;

      .create-tag-label {
        font-size: 14px;
        padding-right: 10px;
        color: @text-color-secondary;
      }

      .create-tag {
        display: flex;
        flex-direction: row;
        align-items: center;

        .tag-item {
          background-color: #fff9d3;
          border-radius: 15px;
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          padding: 5px;
          font-size: 16px;
        }

        i {
          font-size: 18px;
          color: @text-color-secondary;
        }
      }
    }
  }

  .content-list-wrapper{
    .skt-tag-item{
      .active{
        background-color: #14c49b;
      }

    }

  }
}

</style>

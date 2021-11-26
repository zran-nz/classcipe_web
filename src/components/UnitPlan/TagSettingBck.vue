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
                Choose from system recommendation
              </div>
            </div>
            <div class="content-list">
              <template v-if="globalTagLables.length > 0">
                <div class="skt-tag-list">
                  <div class="skt-tag-item" v-if="selectedGlobalLabels.indexOf(tag.name) > -1" v-for="tag in globalTagLables" :key="tag.id" >
                    <a-tag
                      @click="selectGlobalTag(tag)"
                      :class="{'tag-item': true, 'active': selectedGlobalLabels.indexOf(tag.name) > -1}" >
                      {{ tag.name }}
                    </a-tag>
                    <div class="icon-wrapper" v-if="selectedGlobalLabels.indexOf(tag.name) > -1">
                      <a-icon :style="{ fontSize: '18px', color: '#ffffff' }" type="check-circle" class="checked-icon" />
                    </div>
                  </div>
                  <div class="skt-tag-item" v-if="selectedGlobalLabels.indexOf(tag.name) === -1" v-for="tag in globalTagLables" :key="tag.id" >
                    <a-tag
                      @click="selectGlobalTag(tag)"
                      class="tag-item">
                      {{ tag.name }}
                    </a-tag>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="content-empty" >
                  <no-more-resources />
                </div>
              </template>
            </div>

          </div>
        </a-row>

        <a-row>
          <div class="content-list-wrapper">
            <div class="content-header">
              <div class="title" >
                Categories created by me
              </div>
            </div>
            <div class="content-list">
              <template v-if="userTags.length > 0" >
                <a-row v-for="root in userTags" :key="root.id" v-if="!root.isGlobal">
                  <div class="skt-tag-list">
                    <div class="skt-tag-item">
                      <a-tag
                        color="orange"
                        class="tag-item-yellow" >
                        {{ root.name }}
                      </a-tag>
                      <div class="delete-icon-wrapper">
                        <a-icon type="close-circle" @click="removeTag(root)" style="color: #fff" />
                      </div>

                    </div>
                    <div class="skt-tag-item" v-for="tag in root.keywords" :key="tag.id" >
                      <a-tag
                        color="green">
                        {{ tag.name }}
                      </a-tag>
                      <a-icon class="delete-icon-sub" type="close-circle" @click="removeTag(tag)" style="color: #f5222d" />
                    </div>
                  </div>
                </a-row>
              </template>
              <template v-else>
                <div class="content-empty" >
                  <no-more-resources />
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
  // import * as logger from '@/utils/logger'
  import { GetRootGlobalTag, GetUserTags, UserTagAddOrUpdate, UserTagDelete } from '../../api/tag'
import NoMoreResources from '@/components/Common/NoMoreResources'
  // const { debounce } = require('lodash-es')

export default {
  name: 'TagSetting',
  components: {
    NoMoreResources
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
    // this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
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
      this.$logger.info('tag handleKeyup ', this.inputTag)
      // this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
    },
    searchTag (keyword) {
      // logger.info('tag searchTag', keyword)
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
            this.userTags.unshift(item)
            this.$message.success('Add tag successfully')
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
          this.$message.success('Remove tag successfully')
          this.$emit('add-user-tag', tag, false)
        })
      } else {
        this.selectedGlobalLabels.push(tag.name)
        this.tagLoading = true
        UserTagAddOrUpdate({ name: tag.name, isGlobal: true }).then((response) => {
          if (response.success) {
            this.$message.success('Add tag successfully')
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
      position: relative;

      .delete-icon-wrapper {
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        right: 0;
        justify-content: center;
        top: -5px;
        width: 18px;
        height: 18px;
        color: #fff;
        background-color: #f5222d;
        border-radius: 50%;
      }
      .delete-icon-sub{
        position: absolute;
        right: 0;
        top: 0;
      }
      .tag-item {
        cursor: pointer;
        border-radius: 10px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding-bottom: 3px;
        font-size: 15px;
        border: 1px solid #D8D8D8;
        box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
        opacity: 1;
        border-radius: 6px;
        background-color: rgba(21, 195, 154, 0.1);
        color: rgba(21, 195, 154, 1);
        border: 1px solid rgba(21, 195, 154, 1);
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
        cursor: pointer;
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
      position: relative;
      .active{
        background-color: rgba(255, 187, 0, 1) !important;
        border:1px solid rgba(255, 187, 0, 1) !important;
        color: #fff;
      }
      .icon-wrapper {
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        right: 0;
        justify-content: center;
        top: -5px;
        width: 18px;
        height: 18px;
        background-color: rgba(255, 187, 0, 1);
        border-radius: 50%;
      }
    }

  }
}

.content-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  background-color: #e7f9f5;
  .ant-row{
    width: 100%;
  }
}

.content-empty {
  width: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: auto
}

</style>

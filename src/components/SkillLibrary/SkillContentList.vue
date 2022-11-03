<template>
  <div class="content-list-wrapper">
    <div class="content-header">
      <div class="name" :style="{width: nameWidth + 'px'}">
        Name
      </div>
    </div>
    <div class="content-list">
      <template v-if="contentDataList.length">
        <div :class="{'content-item': true, 'odd-line': index % 2 === 0,'even-line': index % 2 === 1, 'active-line': currentId === item.id, 'selected-line': selectedIdList.indexOf(item.id) !== -1}" v-for="(item,index) in contentDataList" :key="index">
          <div class="name" :style="{width: nameWidth + 'px'}" @click="handleSkillContentListItemClick(item)">
            <div class="icon">
              <template v-if="item.type">
                <content-type-icon :type="item.type" />
              </template>
              <template v-else>
                <a-icon type="folder" theme="filled" class="file-dir-icon"/>
              </template>
            </div>
            <div class="name-text">
              {{ item.name || item.description }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="content-empty" v-if="!firstLoad">
          <a-empty />
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import { SkillLibraryEvent, SkillLibraryEventBus } from '@/components/SkillLibrary/SkillLibraryEventBus'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'

export default {
  name: 'SkillContentList',
  components: {
    ContentTypeIcon
  },
  data () {
    return {
      currentId: null,
      nameWidth: 500,
      contentDataList: [],
      parent: null,

      blockIndex: 0,
      typeMap: typeMap,
      firstLoad: true,

      selectedIdList: []
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListUpdate, this.handleSkillContentListUpdate)
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListSelectedListUpdate, this.handleSkillContentSelectedListUpdate)
    this.nameWidth = document.getElementById('new-library').getBoundingClientRect().width - 400
    console.info('nameWidth ' + this.nameWidth)
  },
  methods: {
    handleSkillContentListUpdate (data) {
      console.info('handleSkillContentListUpdate ', data)
      this.contentDataList = data.contentList
      this.parent = data.currentTreeData
      this.firstLoad = false
    },

    handleSkillContentSelectedListUpdate (data) {
      console.info('handleSkillContentSelectedListUpdate ', data)
      if (this.selectedIdList.indexOf(data.id) === -1) {
        this.selectedIdList.push(data.id)
      } else {
        this.selectedIdList.splice(this.selectedIdList.indexOf(data.id), 1)
      }
      console.info('after handleSkillContentSelectedListUpdate ', this.selectedIdList)
    },
    handleSkillContentListItemClick (item) {
      console.info('handleSkillContentListItemClick ', item)
      SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListItemClick, {
        item,
        parent: this.parent
      })
    }
  },
  destroyed () {
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListUpdate, this.handleSkillContentListUpdate)
    console.info('off NewContentList ContentListUpdate handler')
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListSelectedListUpdate, this.handleSkillContentSelectedListUpdate)
    console.info('off NewContentList ContentListSelectedListUpdate handler')
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.content-list-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-header {
    font-weight: 600;
    background-color: #eee;
    line-height: 30px;
    cursor: pointer;
    user-select: none;
    display: flex;
    overflow: hidden;
    padding: 5px 10px;
    .name {
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
    }
    .owner {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }

    .date-modified {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }
  }
  .content-list {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    height: calc(100%- 40);

    .content-empty {
      margin-top: 150px;
    }

    .even-line {
      background-color: #ffffff;
    }

    .odd-line {
      background-color: #F8F8F8;
    }

    .selected-line {
      background-color: fade(@outline-color, 10%);
      color: @text-color;
    }

    .active-line {
      background-color: #EBEEFD;
      color: @primary-color;
    }

    .content-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px;

      .name {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        user-select: none;
        padding: 0 10px;
        .icon {
          padding: 0 10px 0 5px;
          .file-dir-icon {
            color: #82c0d8;
            font-size: 18px;
          }
        }

        .name-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-word;
        }
      }

      .owner {
        width: 170px;
        padding: 0 10px;
        text-align: left;
      }

      .date-modified {
        width: 170px;
        padding: 0 10px;
        text-align: left;
      }
    }
  }

  *::-webkit-scrollbar {
    width: 3px;
    height: 0;
  }
  *::-webkit-scrollbar-track {
    border-radius: 1px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  *::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
}
</style>

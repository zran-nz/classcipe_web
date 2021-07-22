<template>
  <div class="new-library" id="new-library">
    <div class="navigation">
      Browse More
    </div>
    <div class="main">
      <div class="tree-navigation">
        <a-directory-tree
          multiple
          default-expand-all
          @select="onSelect"
          @expand="onExpand"
          :icon="getIcon"
          class="tree">
          <a-tree-node :key="tag.id" :title="tag.name" class="root-icon-wrapper" :selectable="false" v-for="tag in treeItemData" >
            <a-tree-node class="subtree-icon-wrapper" :key="child.id" :title="child.name" is-leaf v-for="child in tag.children"/>
          </a-tree-node>
        </a-directory-tree>
        <a-spin v-show="loadingTree" class="spin-loading"/>
      </div>
      <div class="content-list">
        <div class="content-list-wrapper">
          <div class="content-header">
            <div class="name" >
              <a-page-header title="Label classification"/>
            </div>
          </div>
          <div class="content-list">
            <a-divider />
            <template v-if="tagValues.length > 0">
              <div class="skt-tag-list">
                <div class="skt-tag-item" v-for="(tag,index) in tagValues" :key="index" >
                  <a-tag
                    :closable="tagIndex == index"
                    @click="selectTag(index)"
                    @close="closeTag(tag)"
                    :color="tagIndex == index ? 'orange': 'green'"
                    class="tag-item">
                    {{ tag.name }}
                  </a-tag>
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
      </div>
    </div>
  </div>
</template>

<script>

import SkillContentList from '@/components/SkillLibrary/SkillContentList'
import SkillTreeNavigation from '@/components/SkillLibrary/SkillTreeNavigation'
import { TagTree } from '@/api/tag'

export default {
  name: 'TagBrowser',
  components: {
    SkillContentList,
    SkillTreeNavigation
  },
  props: {
    selectMode: {
      type: String,
      default: null
    },
    treeItemData: {
      type: Object,
      default: null
    },
    treeCurrentParent: {
      type: Object,
      default: null
    },
    odd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loadingTree: false,
      firstLoad: false,
      tagValues: [{ name: 'how are you', id: '1' }, { name: 'test2', id: '2' }],
      tagIndex: -1
    }
  },
  computed: {
  },
  created () {
    this.loadingTree = true
    TagTree().then((response) => {
      this.$logger.info('TagTree response', response.result)
      if (response.success) {
        this.treeItemData = response.result
      } else {
        this.$message.error(response.message)
      }
      this.loadingTree = false
    })
  },
  mounted () {
  },
  methods: {
    onSelect (keys, event) {
      console.log('Trigger Select', keys, event)
    },
    onExpand () {
      console.log('Trigger Expand')
    },
    getIcon (props) {
      const { expanded } = props
      // if (isLeaf) {
      //   return <a-icon type="home" />
      // }
      return <a-icon type={expanded ? 'folder-open' : 'folder'} />
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-library {
  .navigation {
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    padding-bottom: 10px;
  }
  .main {
    border: 1px solid #e9e9e9;
    overflow-y: hidden;
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .tree-navigation {
      width: 400px;
      flex-shrink: 0;
      height: 100%;
      overflow-y: scroll;
    }
    .content-list {
      height: 100%;
      overflow: hidden;
      flex: 1;
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
.tree{
  color: #82c0d8;
  font-size: 16px;
  .subtree-icon-wrapper {
    display: block;
    text-align: left;
    cursor: pointer;
    user-select: none;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    &:hover {
      background-color: fade(@primary-color, 10%);
    }
  }
}
  .spin-loading {
    margin-top: 100px;
    margin-left: 50px;
    width: 100px;
  }
  .ant-divider-horizontal{
    margin: 4px 0px 0px 0px;
  }

  .skt-tag-list {
    padding: 5px 10px;
    background-color: #e7f9f5;
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
        border-radius: 10px;
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding: 6px;
        font-size: 18px
      }
    }

  }
}

</style>

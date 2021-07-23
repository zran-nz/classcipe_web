<template>
  <div class="new-library" id="new-library">
    <div class="navigation">
      Browse More
    </div>
    <div class="main">
      <div class="tree-navigation">
        <a-directory-tree
          default-expand-all
          @select="onSelect"
          @expand="onExpand"
          :icon="getIcon"
          :tree-data="treeItemData"
          :replace-fields="{children:'children', title:'name', key:'id'}"
          class="tree">
          <!--          <a-tree-node :key="tag.id" :title="tag.name" class="root-icon-wrapper" :selectable="false" v-for="tag in treeItemData" >
            <a-tree-node class="subtree-icon-wrapper" :key="child.id" :title="child.name" is-leaf v-for="child in tag.children"/>
          </a-tree-node>-->

          <template slot="title" slot-scope="item" style="color: #08c">
            <p>
              <span>{{ item.title }}</span>
              <span style="margin-left: 40px; color: orange;">{{ item.title }}</span>
            </p>
          </template>

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
                <div class="skt-tag-item" v-for="tag in tagValues" :key="tag.id" >
                  <a-tag
                    @click="selectTag(tag)"
                    :color="tagName == tag.name ? 'orange': 'green'"
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
          <a-spin v-show="loadingContent" class="spin-content-loading"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { GetGlobalTagKeywords, GetTreeByKey } from '@/api/tag'

export default {
  name: 'TagBrowser',
  components: {

  },
  data () {
    return {
      treeItemData: [],
      loadingContent: false,
      loadingTree: false,
      firstLoad: false,
      tagValues: [],
      tagName: ''
    }
  },
  props: {
    rootKey: {
      type: String,
      default: ''
    }
  },
  created () {
    this.loadingTree = true
    GetTreeByKey({ key: this.rootKey }).then((response) => {
      this.$logger.info('TagTree response', response.result)
      if (response.success) {
        this.treeItemData = response.result.children
        this.treeItemData.forEach(item => {
          item.scopedSlots = { title: 'title' }
          this.loop(item)
        })
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
      this.loadingContent = true
      GetGlobalTagKeywords({ tagId: keys[0] }).then((response) => {
        this.$logger.info('GetGlobalTagKeywords response', response.result)
        if (response.success) {
          this.tagValues = response.result
        } else {
          this.$message.error(response.message)
        }
        this.loadingContent = false
      })
    },
    onExpand () {
      console.log('Trigger Expand')
    },
    selectTag (tag) {
      this.tagName = tag.name
    },
    getIcon (props) {
      const { expanded } = props
      // if (isLeaf) {
      //   return <a-icon type="home" />
      // }
      return <a-icon type={expanded ? 'folder-open' : 'folder'} />
    },
    loop (data) {
      data.selectable = false
      console.log(data)
      if (data.children && data.children.length > 0) {
        for (const i in data.children) {
          this.loop(data.children[i])
        }
      } else if (data.children && data.children.length === 0) {
        console.log('没有子节点')
        data.selectable = true
      }
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
  .spin-content-loading{
    margin-top: 100px;
    margin-left: 45%;
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

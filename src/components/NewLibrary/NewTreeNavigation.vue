<template>
  <div class="new-tree-navigation">
    <new-tree-item
      :tree-item-data="treeItem"
      :default-deep="treeItem.deep"
      :default-expand-status="treeItem.expandStatus"
      :odd="index % 2 === 1"
      v-for="(treeItem, index) in treeDataList"
      :key="index"/>
  </div>
</template>

<script>
import NewTreeItem from '@/components/NewLibrary/NewTreeItem'
export default {
  name: 'NewTreeNavigation',
  components: {
    NewTreeItem
  },
  data () {
    return {
      treeDataList: [
        {
          deep: 0,
          expandStatus: true,
          name: 'Language',
          subTreeDataList: [
            {
              name: 'English',
              expandStatus: false,
              subTreeDataList: [
                {
                  name: 'AAA',
                  expandStatus: false
                },
                {
                  name: 'BBB',
                  expandStatus: false
                }
              ]
            },
            {
              name: 'Italian',
              expandStatus: false,
              subTreeDataList: [
                {
                  name: 'CCC',
                  expandStatus: false
                },
                {
                  name: 'DDD',
                  expandStatus: false
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>

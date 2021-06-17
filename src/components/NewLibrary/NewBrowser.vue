<template>
  <div class="new-library">
    <div class="navigation">
    </div>
    <div class="main">
      <div class="tree-navigation">
        <new-tree-navigation />
      </div>
      <div class="content-list"></div>
    </div>
  </div>
</template>

<script>

import NewNavigation from '@/components/NewLibrary/NewNavigation'
import NewContentList from '@/components/NewLibrary/NewContentList'
import NewTreeNavigation from '@/components/NewLibrary/NewTreeNavigation'
import { LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'

export default {
  name: 'NewBrowser',
  components: {
    NewNavigation,
    NewContentList,
    NewTreeNavigation
  },
  data () {
    return {
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

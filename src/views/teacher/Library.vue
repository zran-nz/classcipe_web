<template>
  <a-card :bordered="false" >
    <finder :tree="tree"></finder>
  </a-card>
</template>

<script>
import Finder from '@/components/Finder/Finder'

export default {
  name: 'Library',
  components: {
    Finder
  },
  data () {
    return {
      tree: {
        id: 'test',
        label: 'Test',
        children: [
          {
            id: 'curriculum1',
            label: 'curriculum1',
            children: [
              {
                id: 'subject1',
                label: 'subject1',
                selected: true
              },
              {
                id: 'subject2',
                label: 'subject2',
                selectable: false
              },
              {
                id: 'subject3',
                label: 'subject3',
                selected: true
              },
              {
                id: 'subject4',
                label: 'subject4'
              },
              {
                id: 'subject5',
                label: 'subject5',
                selectable: false
              }
            ]
          },
          {
            id: 'curriculum2',
            label: 'curriculum2',
            children: [
              {
                id: 'subject11',
                label: 'subject11',
                selected: true,
                children: [
                  {
                    id: 'subject22',
                    label: 'subject22',
                    selected: true
                  },
                  {
                    id: 'subject33',
                    label: 'subject33',
                    selectable: false
                  }
                ]
              },
              {
                id: 'subject21',
                label: 'subject21',
                selectable: false
              },
              {
                id: 'subject22',
                label: 'subject22'
              },
              {
                id: 'subject33',
                label: 'subject33',
                selectable: false
              },
              {
                id: 'subject44',
                label: 'subject44'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
  },
  created () {

  },
  mounted () {
  },
  methods: {
    add () {
      this.tree.children.push(
        {
          id: 'vegetables22' + Math.random(),
          label: 'Vegetables22' + Math.random()
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

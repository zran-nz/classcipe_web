<template>
  <a-card :bordered="false" >
    <button @click="add">add</button>
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
            id: 'fruits',
            label: 'Fruits',
            children: [
              {
                id: 'orange',
                label: 'Orange',
                selected: true
              },
              {
                id: 'apple',
                label: 'Apple',
                selectable: false
              },
              {
                id: 'grape',
                label: 'Grape',
                selected: true
              },
              {
                id: 'banana',
                label: 'Banana'
              },
              {
                id: 'lemon',
                label: 'Lemon',
                selectable: false
              }
            ]
          },
          {
            id: 'vegetables',
            label: 'Vegetables',
            children: [
              {
                id: 'carrot',
                label: 'Carrot',
                selected: true,
                children: [
                  {
                    id: 'carrot1',
                    label: 'Carrot1',
                    selected: true
                  },
                  {
                    id: 'eggplant1',
                    label: 'Eggplant1',
                    selectable: false
                  }
                ]
              },
              {
                id: 'eggplant',
                label: 'Eggplant',
                selectable: false
              },
              {
                id: 'parsnip',
                label: 'Parsnip'
              },
              {
                id: 'tomato',
                label: 'Tomato',
                selectable: false
              },
              {
                id: 'bean',
                label: 'Beans'
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

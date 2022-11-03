<template>
  <a-popover
    placement="bottomLeft">
    <template slot="content">
      <div class="search-filter">
        <a-button type="link" class="clear-all" @click="clearFilter()" style="position: absolute; right:15px">
          Clear all
        </a-button>
        <div class="filter-item" v-for='pdTagCategory in pdTagCategoryList' :key='pdTagCategory.category'>
          <div class="filter-label" @click="handleCollapse(pdTagCategory.category)">
            {{ pdTagCategory.category }}
            <span class='collapse-icon'>
              <a-icon type="down" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf(pdTagCategory.category) === -1"/>
              <a-icon type="up" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf(pdTagCategory.category) !== -1"/>
            </span>
          </div>
          <div class="filter-option-list" v-show="collapseList.indexOf(pdTagCategory.category) === -1">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="filter[pdTagCategory.category]"
              :options="pdTagCategory.list"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="filter-icon-item">
      <filter-icon class="filter-icon" />
      <filter-active-icon class="filter-active-icon"/>
      <div class="filter-label">
        Filter
      </div>
    </div>
  </a-popover>
</template>

<script>

import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import { mapGetters } from 'vuex'

export default {
  name: 'PdContentFilter',
  components: {
    FilterIcon,
    FilterActiveIcon
  },
  data () {
    return {
      filter: {},
      collapseList: []
    }
  },
  computed: {
    ...mapGetters(['pdTagList']),
    pdTagCategoryList() {
      const list = []
      this.pdTagList.forEach(pdTag => {
        const obj = {
          category: pdTag.category,
          list: []
        }
        pdTag.children.forEach(tag => {
          tag.children.forEach(tagItem => {
            obj.list.push({
              label: `${tagItem.name}`,
              value: tagItem.name
            })
          })
        })
        list.push(obj)
      })
      return list
    }
  },
  created() {
    console.info('pdTagList', this.pdTagList)
    this.pdTagList.forEach(pdTag => {
      this.$set(this.filter, pdTag.category, [])
    })
  },
  methods: {
    updateFilterConfig () {
      this.$emit('update-filter', {
        pdTag: this.filter
      })
    },
    clearFilter () {
      this.filter = {
        pdTags: []
      }
      this.updateFilterConfig()
    },

    handleCollapse (field) {
      const index = this.collapseList.indexOf(field)
      if (index === -1) {
        this.collapseList.push(field)
      } else {
        this.collapseList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.search-filter {
  width: 350px;
  display: flex;
  max-height: 500px;
  overflow-y: scroll;
  flex-direction: column;

  .filter-item {
    padding-bottom: 10px;
    .filter-label {
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      line-height: 35px;
      color: #000000;
    }

    .filter-option-list {
      .age-select {
        width: 100px;
      }
    }
  }
}

.filter-icon-item {
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-color: #eff3f6;
  box-shadow: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 0 8px;
  height: 46px;
  line-height: 46px;
  white-space:nowrap;

  svg {
    height: 15px;
  }
  .filter-active-icon {
    display: none;
  }
  .filter-icon {
    display: inline;
  }

  &:hover {
    color: #38cfa6;
    .filter-active-icon {
      display: inline;
    }

    .filter-icon {
      display: none;
    }
  }

  .filter-label {
    font-family: Inter-Bold;
    line-height: 20px;
  }
}
</style>

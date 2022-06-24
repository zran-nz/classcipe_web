<template>
  <a-popover
    placement="bottomLeft">
    <template slot="content">
      <div class="search-filter">
        <a-button type="link" class="clear-all" @click="clearFilter()" style="position: absolute;right:0px">
          Clear all
        </a-button>

        <div class="filter-item">
          <div class="filter-label" @click="handleCollapse('age')">
            Age
            <span class='collapse-icon'>
              <a-icon type="down" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf('age') === -1"/>
              <a-icon type="up" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf('age') !== -1"/>
            </span>
          </div>
          <div class="filter-option-list" v-show="collapseList.indexOf('age') === -1">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="filter.age"
              :options="allYearsOptions"
            />
          </div>
        </div>

        <div class="filter-item">
          <div class="filter-label" @click="handleCollapse('subject')">
            Subject
            <span class='collapse-icon'>
              <a-icon type="down" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf('subject') === -1"/>
              <a-icon type="up" :style="{ fontSize: '10px', color: '#666' }" v-show="collapseList.indexOf('subject') !== -1"/>
            </span>
          </div>
          <div class="filter-option-list" v-show="collapseList.indexOf('subject') === -1">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="filter.subject"
              :options="allSubjectsOptions"
            />
          </div>
        </div>

        <div class="filter-item" v-if='showFaSaActivityType'>
          <div class="filter-label">
            Task Type
          </div>
          <div class="filter-toggle-list">
            <a-radio-group name="radioGroup" default-value="fa" v-model="filter.faSaActivityType" @change="updateFilterConfig">
              <a-radio value="fa">
                FA
              </a-radio>
              <a-radio value="sa">
                SA
              </a-radio>
              <a-radio value="activity">
                Activity
              </a-radio>
            </a-radio-group>
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

// copy from src/components/LibraryV2/SearchFilter.vue
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'CommonContentFilter',
  components: {
    FilterIcon,
    FilterActiveIcon
  },
  props: {
    showFaSaActivityType: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      ageOptions: state => state.user.currentSchool
    }),
    ...mapGetters({
      allSubjects: 'allSubjects',
      allYears: 'allYears'
    }),

    allSubjectsOptions() {
      return this.allSubjects.map(item => {
        return {
          label: item,
          value: item
        }
      })
    },

    allYearsOptions() {
      return this.allYears.map(item => {
        return {
          label: item,
          value: item
        }
      })
    }
  },
  data () {
    return {
      filter: {
        age: [],
        subject: [],
        types: [],
        faSaActivityType: ''
      },
      collapseList: [],
      showFilter: false
    }
  },
  methods: {
    updateFilterConfig () {
      this.$emit('update-filter', this.filter)
    },
    clearFilter () {
      this.filter = {
        age: [],
        subject: [],
        faSaActivityType: ''
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
  width: 250px;
  display: flex;
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

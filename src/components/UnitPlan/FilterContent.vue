<template>
  <div class="search-filter">
    <a-button type="link" size='small' class="clear-all" @click="clearFilter()">
      Clear all
    </a-button>

    <div class='option-content'>
      <div class="filter-item">
        <div class="filter-label">Subject</div>
        <div class="filter-option-list" >
          <a-checkbox-group
            v-if='subjectOptions.length'
            @change="updateFilterConfig"
            v-model="filter.subject"
            :options="subjectOptions"
          />
        </div>
      </div>
      <div class="filter-item">
        <div class="filter-label">Period</div>
        <div class="filter-option-list" >
          <a-radio class='filter-option-list-item' v-for="(item,index) in periodOptions" :checked="filter.period === item.value" @click="clickRadioGroup('period',item.value)" :key="index">
            {{ item.label }}
          </a-radio>
        </div>
      </div>
      <div class="filter-item">
        <div class="filter-label">Grade</div>
        <div class="filter-option-list" >
          <a-checkbox-group
            v-if='ageOptions.length'
            @change="updateFilterConfig"
            v-model="filter.age"
            :options="ageOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterContent',
  props: {
    filterConfig: {
      type: Object,
      required: true
    },
    subjectOptions: {
      type: Array,
      default: () => []
    },
    ageOptions: {
      type: Array,
      default: () => []
    },
    periodOptions: {
      type: Array,
      default: () => []
    },
    teachingStrategyOptions: {
      type: Array,
      default: () => []
    },
    filterSaOptions: {
      type: Array,
      default: () => []
    },
    filterFaOptions: {
      type: Array,
      default: () => []
    },
    filterActivityOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      unitTypeLabel: [
        { label: 'Single-subject Unit', value: '0' },
        { label: 'Integrated Unit', value: '1' }
      ],
      projectBasedLabel: [
        { label: 'Yes', value: '1' },
        { label: 'No', value: '0' }
      ],
      faTags: [],
      saTags: [],
      activityTags: [],
      filter: {
        age: [],
        subject: [],
        period: '',
        faSaActivityType: '',
        unitType: '',
        projectBased: '',
        faTags: [],
        saTags: [],
        activityTags: []
      }
    }
  },
  created () {
    this.$logger.info('SearchFilter created', this.filterConfig)
    if (this.filterConfig) {
      this.filter = this.filterConfig
    }
    this.filterSaOptions.forEach((option, index) => {
      this.saTags.push([])
    })
    this.filterFaOptions.forEach((option, index) => {
      this.faTags.push([])
    })
    this.filterActivityOptions.forEach((option, index) => {
      this.activityTags.push([])
    })
  },
  methods: {
    updateFilterConfig () {
      this.filter.faTags = []
      this.faTags.forEach((option, index) => {
         option.forEach(o => {
           if (o) {
             this.filter.faTags.push(o)
           }
         })
      })
      this.filter.saTags = []
      this.saTags.forEach((option, index) => {
        option.forEach(o => {
          if (o) {
            this.filter.saTags.push(o)
          }
        })
      })
      this.filter.activityTags = []
      this.activityTags.forEach((option, index) => {
        option.forEach(o => {
          if (o) {
            this.filter.activityTags.push(o)
          }
        })
      })
      this.$logger.info('updateFilterConfig', this.filter)
      this.$emit('filter-config-update', this.filter)
    },
    getGroupOptions (parent) {
      var res = []
      if (parent.customDeep > 1) {
        parent.children.forEach(child => {
          child.keywords.forEach(keyword => {
            res.push({ label: child.name + '-' + keyword, value: keyword })
          })
        })
      } else {
        parent.keywords.forEach(keyword => {
          res.push({ label: keyword, value: keyword })
        })
      }
      return res
    },
    clearFilter () {
      this.filter = {
        age: [],
        subject: [],
        period: '',
        type: [],
        faSaActivityType: ''
      }
      this.faTags = []
      this.saTags = []
      this.activityTags = []
      this.updateFilterConfig()
    },
    clickRadioGroup(property, value) {
      this.$logger.info('clickRadioGroup property value', property, value)
      if (this.filter[property] === value) {
        this.filter[property] = ''
      } else {
        this.filter[property] = value
      }
      this.$emit('filter-config-update', this.filter)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.search-filter {
  position:relative;

  .clear-all {
    position: absolute;
    right: -5px;
    top: -25px;
    cursor: pointer;
    z-index: 100;
    background: #fafafa;
    &:hover {
      background: #f1f1f1;
    }
  }
  .filter-item {
    margin-bottom: 15px;
    margin-right: 10px;
    .filter-label {
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      line-height: 25px;
      color: #000000;
    }

    .filter-option-list {
      display: flex;
      font-size: 13px;
      flex-direction: column;
      padding: 0 5px;

      .filter-option-list-item {
        line-height: 30px;
        width: 100%;
      }
      .age-select {
        width: 100px;
      }
    }
  }

  .filter-toggle {
    margin: 20px 0;
  }

  .task-type {
    padding-bottom: 10px;
  }
}

.option-content {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
}

</style>

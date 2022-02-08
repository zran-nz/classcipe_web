<template>
  <div class="search-filter">
    <a-button type="link" class="clear-all" @click="clearFilter()">
      Clear all
    </a-button>

    <a-row class='option-content'>
      <a-col span='6'>
        <div class="filter-item">
          <div class="filter-label">Subject</div>
          <div class="filter-option-list" >
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="filter.subject"
              :options="subjectOptions"
            />
          </div>
        </div>
      </a-col>
      <a-col span='4'>
        <div class="filter-item">
          <div class="filter-label">Period</div>
          <div class="filter-option-list" >
            <a-radio class='filter-option-list-item' v-for="(item,index) in periodOptions" :checked="filter.period === item.value" @click="clickRadioGroup('period',item.value)" :key="index">
              {{ item.label }}
            </a-radio>
          </div>
        </div>
      </a-col>
      <a-col span='4'>
        <div class="filter-item">
          <div class="filter-label">Grade</div>
          <div class="filter-option-list" >
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="filter.age"
              :options="ageOptions"
            />
          </div>
        </div>
      </a-col>
      <a-col span='5'>
        <div class="filter-item">
          <div class="filter-label">Unit Type</div>
          <div class="filter-option-list" >
            <a-radio class='filter-option-list-item' v-for="(item,index) in unitTypeLabel" :checked="filter.unitType === item.value" @click="clickRadioGroup('unitType',item.value)" :key="index">
              {{ item.label }}
            </a-radio>
          </div>
        </div>
      </a-col>

      <a-col span='5'>
        <div class="filter-item">
          <div class="filter-label">Project-based Unit</div>
          <div class="filter-option-list" >
            <a-radio v-for="(item,index) in projectBasedLabel" :checked="filter.projectBased === item.value" @click="clickRadioGroup('projectBased',item.value)" :key="index">
              {{ item.label }}
            </a-radio>
          </div>
        </div>
      </a-col>
    </a-row>

    <div class="filter-item task-type">
      <div class="filter-label">Task Type</div>
      <div class="filter-toggle-list">
        <a-radio :checked="filter.faSaActivityType === 1" @click="clickRadioGroup('faSaActivityType',1)" name="activityType" >
          FA
        </a-radio>
        <a-radio :checked="filter.faSaActivityType === 2" @click="clickRadioGroup('faSaActivityType',2)" name="activityType" >
          SA
        </a-radio>
        <a-radio :checked="filter.faSaActivityType === 3" @click="clickRadioGroup('faSaActivityType',3)" name="activityType" >
          Activity
        </a-radio>
      </div>

      <div class="sub-item">
        <div class="filter-item" v-if="filter.faSaActivityType === 1" v-for="(parent,index) in filterFaOptions" :key="index">
          <div class="filter-label">{{ parent.name }}</div>
          <div :class="{'filter-option-list-width-20': index !== filterFaOptions.length - 1, 'filter-option-list-width-30': index === filterFaOptions.length - 1}">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="faTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
        </div>
        <div class="filter-item" v-if="filter.faSaActivityType === 2" v-for="(parent,index) in filterSaOptions" :key="index">
          <div class="filter-label">{{ parent.name }}</div>
          <div :class="{'filter-option-list-width-20': index !== filterSaOptions.length - 1, 'filter-option-list-width-30': index === filterSaOptions.length - 1}">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="saTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
        </div>
        <div class="filter-item" v-if="filter.faSaActivityType === 3" v-for="(parent,index) in filterActivityOptions" :key="index">
          <div class="filter-label">{{ parent.name }}</div>
          <div class="filter-option-list-width-20">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="activityTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
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
    cursor: pointer;
    z-index: 100;
    &:hover {
      background: rgba(228, 228, 228, 0.5);
    }
  }
  .filter-item {
    .filter-label {
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      line-height: 35px;
      color: #000000;
    }

    .filter-option-list {
      display: flex;
      flex-direction: column;

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

</style>

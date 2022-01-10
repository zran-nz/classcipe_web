<template>
  <div class="search-filter">

    <a-button type="link" class="clear-all" @click="clearFilter()" style="position: absolute;right:0px">
      Clear all
    </a-button>

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

    <div class="filter-item">
      <div class="filter-label">Period</div>
      <div class="filter-option-list" >
        <a-radio v-for="(item,index) in periodOptions" :checked="filter.period === item.value" @click="clickRadioGroup('period',item.value)" :key="index">
          {{ item.label }}
        </a-radio>
      </div>
    </div>

    <div class="filter-item">
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
          <div class="filter-option-list">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="faTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
        </div>
        <div class="filter-item" v-if="filter.faSaActivityType === 2" v-for="(parent,index) in filterSaOptions" :key="index">
          <div
            class="filter-labe
          l">{{ parent.name }}</div>
          <div class="filter-option-list">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="saTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
        </div>
        <div class="filter-item" v-if="filter.faSaActivityType === 3" v-for="(parent,index) in filterActivityOptions" :key="index">
          <div class="filter-label">{{ parent.name }}</div>
          <div class="filter-option-list">
            <a-checkbox-group
              @change="updateFilterConfig"
              v-model="activityTags[index]"
              :options="getGroupOptions(parent)"
            />
          </div>
        </div>
      </div>

    </div>

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

    <div class="filter-item">
      <div class="filter-label">Unit Type</div>
      <div class="filter-option-list" >
        <a-radio v-for="(item,index) in unitTypeLabel" :checked="filter.unitType === item.value" @click="clickRadioGroup('unitType',item.value)" :key="index">
          {{ item.label }}
        </a-radio>
      </div>
    </div>

    <div class="filter-item">
      <div class="filter-label">Project-based Unit</div>
      <div class="filter-option-list" >
        <a-radio v-for="(item,index) in projectBasedLabel" :checked="filter.projectBased === item.value" @click="clickRadioGroup('projectBased',item.value)" :key="index">
          {{ item.label }}
        </a-radio>
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
        projectBased: ''
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
      this.filter.faTags = this.faTags
      this.filter.saTags = this.saTags
      this.filter.activityTags = this.activityTags
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
  display: flex;
  flex-direction: row;
  position:relative;
  flex-wrap: wrap;

  .filter-item {
    //margin-bottom: 10px;
    width: 25%;
    min-width: 250px;
    .filter-label {
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

  .filter-toggle {
    margin: 20px 0;
  }
}

</style>

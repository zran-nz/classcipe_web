<template>
  <div class="search-filter">

    <div class="filter-item">
      <div class="filter-label">Age</div>
      <div class="filter-option-list">
        <a-select default-value="All" class="age-select" @change="updateFilterConfig" v-model="filter.age">
          <a-select-option :value="age.label" v-for="(age, aIndex) in ageOptions" :key="aIndex">
            {{ age.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>

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
      <div class="filter-label">Type</div>
      <div class="filter-option-list">
        <a-checkbox-group
          @change="updateFilterConfig"
          v-model="filter.type"
          :options="typeOptions"
        />
      </div>
    </div>

    <div class="filter-item filter-toggle">
      <div class="filter-label"></div>
      <div class="filter-toggle-list">
        <a-radio-group name="radioGroup" :default-value="1" v-model="filter.faSaActivityType" @change="updateFilterConfig">
          <a-radio :value="1">
            FA
          </a-radio>
          <a-radio :value="2">
            SA
          </a-radio>
          <a-radio :value="3">
            Activity
          </a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="filter-item" v-if="filter.faSaActivityType === 1" v-for="(parent,index) in filterFaOptions" :key="index">
      <div class="filter-label">{{ parent.name }}</div>
      <div class="filter-option-list">
        <a-checkbox-group
          @change="updateFilterConfig"
          v-model="filter.faTags[index]"
          :options="getGroupOptions(parent)"
        />
      </div>
    </div>

    <div class="filter-item" v-if="filter.faSaActivityType === 2" v-for="(parent,index) in filterSaOptions" :key="index">
      <div class="filter-label">{{ parent.name }}</div>
      <div class="filter-option-list">
        <a-checkbox-group
          @change="updateFilterConfig"
          v-model="filter.saTags[index]"
          :options="getGroupOptions(parent)"
        />
      </div>
    </div>
    <div class="filter-item" v-if="filter.faSaActivityType === 3" v-for="(parent,index) in filterActivityOptions" :key="index">
      <div class="filter-label">{{ parent.name }}</div>
      <div class="filter-option-list">
        <a-checkbox-group
          @change="updateFilterConfig"
          v-model="filter.activityTags[index]"
          :options="getGroupOptions(parent)"
        />
      </div>
    </div>

    <!--    <div class="filter-item" v-if="filter.faSaActivityType === 2">-->
    <!--      <div class="filter-label">Difference Instructions</div>-->
    <!--      <div class="filter-option-list">-->
    <!--        <a-checkbox-group-->
    <!--          @change="updateFilterConfig"-->
    <!--          v-model="filter.differenceInstructions"-->
    <!--          :options="differenceInstructionsOptions"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="filter-item" v-if="filter.faSaActivityType === 3">-->
    <!--      <div class="filter-label">Assessment Category</div>-->
    <!--      <div class="filter-option-list">-->
    <!--        <a-checkbox-group-->
    <!--          @change="updateFilterConfig"-->
    <!--          v-model="filter.assessmentCategory"-->
    <!--          :options="assessmentTypeOptions"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="filter-item" v-if="filter.faSaActivityType === 'Activity'">-->
    <!--      <div class="filter-label">Assessment Type</div>-->
    <!--      <div class="filter-option-list">-->
    <!--        <a-checkbox-group-->
    <!--          @change="updateFilterConfig"-->
    <!--          v-model="filter.assessmentType"-->
    <!--          :options="assessmentTypeOptions"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
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
    typeOptions: {
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
      filter: {
        age: null,
        subject: [],
        type: [],
        faSaActivityType: 1,
        faTags: {},
        saTags: {},
        activityTags: {}
      }
    }
  },
  created () {
    this.$logger.info('SearchFilter created', this.filterConfig)
    this.filter = this.filterConfig
    this.filterSaOptions.forEach((option, index) => {
      this.filter.faTags.append([])
    })
    this.filterFaOptions.forEach((option, index) => {
      this.filter.saTags.append([])
    })
    this.filterActivityOptions.forEach((option, index) => {
      this.filter.activityTags.append([])
    })
  },
  methods: {
    updateFilterConfig () {
      this.$logger.info('updateFilterConfig', this.filter)
      this.$emit('filter-config-update', this.filter)
    },
    getGroupOptions (parent) {
      var res = []
      parent.keywords.forEach(keyword => {
        res.push({ label: keyword, value: keyword })
      })
      return res
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
    margin-bottom: 10px;
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

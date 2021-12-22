<template>
  <div class="search-filter" @click="updateFilterConfig">

    <div class="filter-item">
      <div class="filter-label">Age</div>
      <div class="filter-option-list">
        <a-select default-value="All" class="age-select">
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
          v-model="filter.subject"
          :options="subjectOptions"
        />
      </div>
    </div>

    <div class="filter-item">
      <div class="filter-label">Type</div>
      <div class="filter-option-list">
        <a-checkbox-group
          v-model="filter.type"
          :options="typeOptions"
        />
      </div>
    </div>

    <div class="filter-item filter-toggle">
      <div class="filter-label"></div>
      <div class="filter-toggle-list">
        <a-radio-group name="radioGroup" :default-value="1" v-model="filter.faSaActivityType">
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

    <div class="filter-item" v-if="filter.faSaActivityType === 1">
      <div class="filter-label">Teaching Strategy</div>
      <div class="filter-option-list">
        <a-checkbox-group
          v-model="filter.teachingStrategy"
          :options="teachingStrategyOptions"
        />
      </div>
    </div>

    <div class="filter-item" v-if="filter.faSaActivityType === 2">
      <div class="filter-label">Teaching Strategy</div>
      <div class="filter-option-list">
        <a-checkbox-group
          v-model="filter.differenceInstructions"
          :options="differenceInstructionsOptions"
        />
      </div>
    </div>

    <div class="filter-item" v-if="filter.faSaActivityType === 3">
      <div class="filter-label">Assessment Category</div>
      <div class="filter-option-list">
        <a-checkbox-group
          v-model="filter.assessmentCategory"
          :options="assessmentTypeOptions"
        />
      </div>
    </div>

    <div class="filter-item" v-if="filter.faSaActivityType === 'Activity'">
      <div class="filter-label">Assessment Type</div>
      <div class="filter-option-list">
        <a-checkbox-group
          v-model="filter.assessmentType"
          :options="assessmentTypeOptions"
        />
      </div>
    </div>

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
    differenceInstructionsOptions: {
      type: Array,
      default: () => []
    },
    assessmentCategoryOptions: {
      type: Array,
      default: () => []
    },
    assessmentTypeOptions: {
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

        teachingStrategy: [],
        differenceInstructions: [],
        assessmentCategory: [],
        assessmentType: []
      }
    }
  },
  created () {
    this.$logger.info('SearchFilter created', this.filterConfig)
    this.filter = this.filterConfig
  },
  methods: {
    updateFilterConfig () {
      this.$logger.info('updateFilterConfig', this.filter)
      this.$emit('filter-config-update', this.filter)
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

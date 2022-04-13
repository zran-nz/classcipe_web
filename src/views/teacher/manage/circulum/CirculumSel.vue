<template>
  <a-card>
    <div class="opt-area">
      <a-form layout="inline">
        <a-row type="flex" justify="space-between">
          <a-col :span="8">
            <a-input-search placeholder="Search for Name" v-model="queryParam.searchKey" enter-button @search="triggerSearch"/>
          </a-col>
          <!-- <a-col>
            <a-button type="primary">Save</a-button>
          </a-col> -->
        </a-row>
      </a-form>
    </div>
    <div class="circulum-con" v-for="(circulumKey, key) in curriculumTree" :key="'circulum_key_' + key">
      <div class="circulum-title">{{ key }}</div>
      <div class="circulum-content">
        <div class="circulum-detail">
          <div class="detail-item" v-for="circulum in circulumKey" :key="'circulum+' + circulum.id">
            <div class="item-check">
              <a-checkbox v-model="circulum.checked" @change="val => onChange(val, circulum)">

              </a-checkbox>
            </div>
            <div class="item-content">
              <div class="item-content-avatar">
                <a-avatar
                  shape="square"
                  :size="50"
                  :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
                >
                  {{ circulum.name }}
                </a-avatar>
              </div>
              <div class="item-content-detail">
                <div class="content-detail-title">{{ circulum.name }}</div>
                <div class="content-detail-sub">{{ formatGrade(circulum.id) }}</div>
                <a-space class="content-detail-opt" v-show="circulum.checked">
                  <!-- <a-button size="small" type='danger'>L3</a-button> -->
                  <a-button size="small" type='primary'>Enable</a-button>
                </a-space>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getAllCurriculums } from '@/api/preference'
const { groupBy } = require('lodash-es')
export default {
  name: 'CirculumSel',
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    gradeOptions: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      curriculumOptions: [],
      allOptions: [],
      queryParam: {
        searchKey: ''
      },
      curriculumTree: {}
    }
  },
  created() {
  },
  methods: {
    initData() {
      getAllCurriculums().then((response) => {
        if (response.success) {
          this.allOptions = response.result.map(item => {
            let checked = false
            if (this.currentSchool.curriculumId && this.currentSchool.curriculumId === item.id) {
              checked = true
              this.$emit('change', item)
            }
            return {
              ...item,
              checked: checked
            }
          })
          this.curriculumOptions = this.allOptions.concat()
          this.curriculumTree = groupBy(this.curriculumOptions, 'country')
        }
      })
    },
    reset() {
      this.initData()
    },
    formatGrade(id) {
      const current = this.gradeOptions.filter(item => item.curriculumId === id)
      const ages = current.map(item => item.age ? Number(item.age) : 0)
      return Math.min(...ages) + '-' + Math.max(...ages) + ' Years'
    },
    triggerSearch() {
      if (!this.queryParam.searchKey) this.curriculumOptions = this.allOptions.concat()
      this.curriculumOptions = this.allOptions.filter(item => {
        return item.name.toLowerCase().indexOf(this.queryParam.searchKey.toLowerCase()) > -1
      })
      this.curriculumTree = groupBy(this.curriculumOptions, 'country')
    },
    onChange(val, curriculum) {
      this.curriculumOptions.forEach(item => {
        // val.target.checked
        if (item.id === curriculum.id) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.curriculumTree = groupBy(this.curriculumOptions, 'country')
      this.$emit('change', curriculum)
    }
  }
}
</script>

<style scoped lang="less">
.ant-card-bordered {
  border-radius: 10px;
}
.circulum-con {
  position: relative;
  margin-top: 20px;
  .circulum-title {
    height: 21px;
    font-size: 16px;
    font-family: Leelawadee UI;
    font-weight: bold;
    color: #070707;
    opacity: 1;
    margin-bottom: 20px;
  }
  .circulum-content {
    min-height: 140px;
    background: #FAFAFA;
    opacity: 1;
    border-radius: 10px;
    padding: 20px;
    .circulum-detail {
      min-height: 100px;
      width: 100%;
      background: #FFFFFF;
      opacity: 1;
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 20px;
      .detail-item {
        display: flex;
        min-width: 220px;
        margin: 10px 0;
        .item-check {
          width:20px;
          height: 20px;
          margin-right: 20px;
          margin-top: 12px;
        }
        .item-content {
          display: flex;
          .item-content-avatar {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            margin-right: 10px;
          }
          .item-content-detail {
            display: flex;
            flex-direction: column;
            .content-detail-title {
              line-height: 19px;
              font-size: 14px;
              font-family: Leelawadee UI;
              font-weight: 400;
              color: #070707;
              opacity: 1;
              margin-bottom: 5px;
            }
            .content-detail-sub {
              line-height: 19px;
              font-size: 14px;
              font-family: Leelawadee UI;
              font-weight: 400;
              color: #070707;
              opacity: 1;
              margin-bottom: 5px;
            }
            .content-detail-opt {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>

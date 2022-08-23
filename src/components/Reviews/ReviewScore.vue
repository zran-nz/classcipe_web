<template>
  <div>
    <label style="margin-right: 10px;" for="">Overall</label>
    <a-rate v-if="currentRole === 'student'" v-model="data.reviewsScore" allow-half disabled/>
    <a-popover @visibleChange="debouncedGetData" v-if="currentRole === 'teacher'" :placement="placement">
      <template slot="content">
        <a-spin :spinning="loading">
          <a-space direction="vertical">
            <a-space align="center">
              <label>Students engagement</label>
              <a-rate :tooltips="RATE_TOOLTIPS.ENGAGEMENT" style="margin:0" v-model="data.studentsEngagement" allow-half disabled/>
            </a-space>
            <a-space align="center">
              <label>Effectiveness of teaching & learning</label>
              <a-rate :tooltips="RATE_TOOLTIPS.EFFETIVENESS" style="margin:0" v-model="data.effectiveness" allow-half disabled/>
            </a-space>
            <a-space align="center">
              <label>Quality of the content</label>
              <a-rate :tooltips="RATE_TOOLTIPS.QUALITY" style="margin:0" v-model="data.quality" allow-half disabled/>
            </a-space>
          </a-space>
        </a-spin>
      </template>
      <a-rate :tooltips="RATE_TOOLTIPS.OVERALL" v-model="data.overall" allow-half disabled/>
      <a-icon style="margin-left: 5px;" type="down" />
    </a-popover>
  </div>
</template>

<script>
import { RATE_TOOLTIPS } from '@/const/common'
import { ReviewsTeacherStats } from '@/api/reviewsTeacher'
import { ReviewsTaskStats } from '@/api/reviewsTask'
import { mapState } from 'vuex'
const { debounce } = require('lodash-es')
export default {
  name: 'ReviewScore',
  props: {
    review: {
      type: Object,
      default: () => {}
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    id: {
      type: String,
      default: null
    }
  },
  watch: {
    review: {
      handler(val) {
        this.data = val ? { ...val } : {}
      },
      immediate: true
    },
    id: {
      handler(val) {
        if (val) {
          this.reviewId = val
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      currentRole: state => state.user.currentRole
    })
  },
  created() {
    this.debouncedGetData = debounce(this.getReview, 300)
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },
  data() {
    return {
      RATE_TOOLTIPS: RATE_TOOLTIPS,
      data: {},
      reviewId: this.id,
      hasRender: false,
      timer: null,
      loading: false
    }
  },
  methods: {
    getReview(visible) {
      if (this.reviewId && visible && !this.hasRender) {
        let promise = null
        if (this.currentRole === 'student') {
          promise = ReviewsTaskStats
        } else {
          promise = ReviewsTeacherStats
        }
        this.loading = true
        promise && promise({
          taskId: this.reviewId, // 学生需要
          purchasesId: this.reviewId // 老师需要
        }).then(res => {
          if (res.success) {
            this.data = res.result
            this.hasRender = true
            this.timer = setTimeout(() => {
              this.hasRender = false
            }, 60000)
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

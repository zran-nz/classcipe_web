<template>
  <div>
    <a-rate v-if="currentRole === 'student'" v-model="data.reviewsScore" allow-half disabled/>
    <a-popover v-if="currentRole === 'teacher'" :placement="placement">
      <template slot="content">
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
      </template>
      <a-rate :tooltips="RATE_TOOLTIPS.OVERALL" v-model="data.overall" allow-half disabled/>
      <a-icon style="margin-left: 5px;" type="down" />
    </a-popover>
  </div>
</template>

<script>
import { RATE_TOOLTIPS } from '@/const/common'
import { mapState } from 'vuex'
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
    }
  },
  watch: {
    review: {
      handler(val) {
        this.data = val ? { ...val } : {}
        console.log(this.data)
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      currentRole: state => state.user.currentRole
    })
  },
  data() {
    return {
      RATE_TOOLTIPS: RATE_TOOLTIPS,
      data: {}
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
    <a-modal
      v-model='visible'
      destroyOnClose
      :title='null'
      @cancel='$router.go(-1)'
      @ok='select(curriculumId)'
      :closable='false'>
      <modal-header title='Choose a curriculum' :allow-close='false'></modal-header>
      <a-radio-group v-model="curriculumId">
        <a-radio :style="radioStyle" v-for='curriculum in list' :value='curriculum.curriculumId' :key='curriculum.curriculumId'>
          {{ curriculum.curriculumName }}
        </a-radio>
      </a-radio-group>
    </a-modal>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { UnitPlanAddOrUpdate } from '@/api/unitPlan'
import * as logger from '@/utils/logger'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { mapState } from 'vuex'
import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'UnitPlanRedirect',
  components: {
    ModalHeader,
    PageHeaderWrapper
  },
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    })
  },
  data () {
    return {
      visible: false,
      curriculumId: null,
      list: [],
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },
  created () {
    if (this.unitPlanId !== 'create') {
      this.$router.replace('/teacher/unit-plan-v2/' + this.unitPlanId)
    } else {
      getCurriculumBySchoolId({
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.code === 0) {
          if (res.result && res.result.length > 0) {
            console.log('getCurriculumBySchoolId', res.result)
            this.list = res.result
            this.curriculumId = this.list[0].curriculumId
            if (this.list.length > 1) {
              this.visible = true
            } else {
              this.select(this.curriculumId)
            }
          } else {
            this.$confirm({
              title: 'Alert',
              okText: 'Confirm',
              cancelText: 'Cancel',
              content: 'You have not bound the curriculum.',
              onOk: () => {
                this.$router.go(-1)
              },
              onCancel() {
                this.$router.go(-1)
              }
            })
          }
        }
      })
    }
  },
  methods: {
    select(curriculumId) {
      const unitPlanData = {
        name: 'Unnamed Unit Plan',
        curriculumId: curriculumId
      }
      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('creatingUnitPlan response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/unit-plan-v2/' + response.result.id
          })
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.redirect-spin {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
}
</style>

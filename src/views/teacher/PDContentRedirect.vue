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
import { PDContentAddOrUpdate } from '@/api/pdContent'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'
import { mapState } from 'vuex'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'

export default {
  name: 'PDContentRedirect',
  props: {
    pdId: {
      type: String,
      default: null
    }
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
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    })
  },
  created () {
    this.$logger.info('pd redirecting ' + this.pdId)
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handlePdRedirect)
    this.handlePdRedirect()
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handlePdRedirect)
  },
  methods: {
    handlePdRedirect() {
      this.$logger.info('task redirecting ' + this.pdId)
      if (this.pdId) {
        this.$router.replace('/teacher/pd-content/' + this.pdId)
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
    select(curriculumId) {
      const data = {
        name: 'Unnamed PD Content',
        status: 0,
        curriculumId: curriculumId
      }

      PDContentAddOrUpdate(data).then((response) => {
        this.$logger.info('PDContentAddOrUpdate response', response.result)
        if (response.success) {
          if (response.code !== 520 && response.code !== 403) {
            this.$router.replace('/teacher/pd-content/' + response.result.id)
          } else {
            this.$logger.info('等待授权回调')
          }
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

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
import { VideoAddOrUpdate } from '@/api/video'
import * as logger from '@/utils/logger'
import ModalHeader from '@/components/Common/ModalHeader'
import { mapState } from 'vuex'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'

export default {
  name: 'VideoRedirect',
  components: { ModalHeader },
  props: {
    videoId: {
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
    if (this.videoId !== 'create') {
      this.$router.replace('/teacher/video/' + this.videoId)
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
      const videoData = {
        name: 'Unnamed Video',
        curriculumId: curriculumId
      }

      VideoAddOrUpdate(videoData).then((response) => {
        logger.info('VideoAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/video/' + response.result.id
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

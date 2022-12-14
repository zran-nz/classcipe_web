<template>
<div class="my-full-form-wrapper" id='formRoot' style="height:100%;width:100%;" :style="{'font-size': fontSize}">
  <fixed-form-header>
    <template v-slot:header>
      <form-header
        title='School Curriculum'
        :show-share='false'
        :show-collaborate='false'
        :is-preview-mode='true'
        @back='goBack'>
        <template v-slot:back>
          <img @click.stop="openV2('/v2/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
        </template>
        <template v-slot:left>
          <a-space :size="5" align="center" @click.stop>
            <label style="cursor: pointer" @click="openV2('/v2/account/info')">Account Info</label>
            <label for="">></label>
            <label style="font-weight: normal">{{ userMode === USER_MODE.SELF ? '' : 'School ' }}Curriculum</label>
          </a-space>
        </template>
        <template v-slot:right>
        </template>
      </form-header>
    </template>
  </fixed-form-header>
  <iframe class="form-content" :src="`/v2/com/curriculum/${userMode === USER_MODE.SELF ? 'my' : currentSchool.id }`" frameborder="0" style="flex:1;width:100%;"></iframe>
</div>
</template>

<script>
import { USER_MODE } from '@/const/common'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'

import { mapState } from 'vuex'
export default {
  name: 'CuriculumListV2',
  components: {
    FixedFormHeader,
    FormHeader
  },
  data() {
    return {
      fontSize: '16px',
      fixHtmlWidth: 1000,
      USER_MODE: USER_MODE,
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
  },
  created() {
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

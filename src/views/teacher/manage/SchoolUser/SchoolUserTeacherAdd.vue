<template>
  <a-card :bordered="false">
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="Cancel"
      okText="Add"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-item label="First Name">
                <a-input
                  v-decorator="['firstname', { rules: [{ required: true, message: 'Please input first name!' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Last Name">
                <a-input
                  v-decorator="['lastname', { rules: [{ required: true, message: 'Please input last name!' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Email">
                <a-input
                  v-decorator="[
                    'email',
                    { rules: [{ required: true, type: 'email', message: 'Please input email!' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Role">
                <a-select v-decorator="['roles', { rules: [{ required: true, message: 'Please select role!' }] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in roleList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Group">
                <a-select v-decorator="['groups', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in groupList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Class">
                <a-select v-decorator="['classes', { rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in classList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Grade">
                <a-input v-decorator="['grades', { rules: [] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Archived">
                <a-select
                  v-decorator="[
                    'archived',
                    {
                      initialValue: 0,
                      rules: [],
                    },
                  ]"
                >
                  <a-select-option :value="1"> True </a-select-option>
                  <a-select-option :value="0"> False </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Date of joining">
                <a-date-picker v-decorator="['dateOfJoining', { rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Picture">
                <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
                  <a-upload
                    name="avatar"
                    class="avatar-img"
                    list-type="picture-card"
                    :show-upload-list="false"
                    :openFileDialogOnClick="false"
                  >
                    <img v-if="this.avatar" :src="this.avatar" alt="avatar" />
                    <div v-else>
                      <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </j-modal>
    <avatar-modal ref="modal" @ok="setAvatar" />
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addStaff } from '@/api/schoolUser'
import store from '@/store'
import * as logger from '@/utils/logger'
import AvatarModal from '@/views/account/settings/AvatarModal'
import Moment from 'moment'

export default {
  name: 'SchoolUserTeacherAdd',
  mixins: [],
  components: {
    JModal,
    AvatarModal
  },
  props: {
    roleList: {
      type: Array,
      default: () => []
    },
    groupList: {
      type: Array,
      default: () => []
    },
    classList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Add Teacher',
      width: 800,
      visible: false,
      confirmLoading: false,
      uploadLoading: false,
      form: this.$form.createForm(this, { name: 'teacherAdd' }),
      avatar: undefined
    }
  },
  created() {},
  computed: {},
  methods: {
    show() {
      this.visible = true
    },
    handleOk() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.confirmLoading = true
          console.log('Received values of form: ', values)
          const params = {
            schoolId: store.getters.userInfo.school,
            avatar: this.avatar,
            ...values
          }
          if (values.dateOfJoining) {
            params.dateOfJoining = String(Moment(values.dateOfJoining).valueOf())
          }
          const res = await addStaff(params)
          if (res.success) {
            this.confirmLoading = false
            this.visible = false
            this.$emit('ok')
          } else {
            this.confirmLoading = false
            this.$message.error(res.message)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    // handleUploadImage(data) {
    //   logger.info('handleUploadImage', data)
    //   const formData = new FormData()
    //   formData.append('file', data.file, data.file.name)
    //   this.uploadLoading = true
    //   this.$http
    //     .post(commonAPIUrl.UploadFile, formData, {
    //       contentType: false,
    //       processData: false,
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //       timeout: 60000
    //     })
    //     .then(response => {
    //       logger.info('handleUploadImage upload response:', response)
    //       this.avatar = this.$store.getters.downloadUrl + response.result
    //     })
    //     .catch(err => {
    //       logger.error('handleUploadImage error', err)
    //       this.$message.error(this.$t('teacher.add-unit-plan.upload-image-file-failed'))
    //     })
    //     .finally(() => {
    //       this.uploadLoading = false
    //     })
    // },
    setAvatar(url) {
      logger.info('setAvatar ' + url)
      this.avatar = url
    }
  }
}
</script>
<style lang="less">
.ant-select-dropdown {
  z-index: 9999;
}
</style>
<style lang="less" scoped>
.avatar-img img {
  max-width: 200px;
}
</style>

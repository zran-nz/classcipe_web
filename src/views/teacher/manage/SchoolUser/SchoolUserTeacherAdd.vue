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
      :okText="mode === 'add' ? 'Add' : 'Save'"
      v-show="currentView === 'add'"
    >
      <a-spin :spinning="confirmLoading">
        <div class="invite-enter-btn" v-show="mode === 'add'">
          <a-button @click="handleInviteEnterBtn" type="primary">Invite by link<a-icon type="share-alt" /></a-button>
        </div>

        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-item label="First Name">
                <a-input
                  v-decorator="[
                    'firstname',
                    {
                      initialValue: getDefaultFormData.firstname,
                      rules: [{ required: true, message: 'Please input first name!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Last Name">
                <a-input
                  v-decorator="[
                    'lastname',
                    {
                      initialValue: getDefaultFormData.lastname,
                      rules: [{ required: true, message: 'Please input last name!' }],
                    },
                  ]"
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
                    {
                      initialValue: getDefaultFormData.email,
                      rules: [{ required: true, type: 'email', message: 'Please input email!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Role">
                <a-select
                  v-decorator="[
                    'roles',
                    {
                      initialValue: getDefaultFormData.roles,
                      rules: [{ required: true, message: 'Please select role!' }],
                    },
                  ]"
                >
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
                <a-select v-decorator="['groups', { initialValue: getDefaultFormData.groups, rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in groupList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Class">
                <a-select v-decorator="['classes', { initialValue: getDefaultFormData.classes, rules: [] }]">
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
                <a-select v-decorator="['grades', { initialValue: getDefaultFormData.grades, rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Archived">
                <a-select
                  v-decorator="[
                    'archived',
                    {
                      initialValue: getDefaultFormData.archived,
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
                <a-date-picker
                  v-decorator="['schoolJoinDate', { initialValue: getDefaultFormData.schoolJoinDate, rules: [] }]"
                />
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

    <a-modal title="Invite by link" @cancel="handleInviteBackBtn" :footer="null" :visible="currentView === 'invite'">
      <div class="invite">
        <div class="invite-back-btn">
          <a-button @click="handleInviteBackBtn" type="primary" icon="left">Back</a-button>
        </div>
        <a-spin :spinning="inviteLoading">
          <div class="invite-link">
            <a-row>
              <a-col :span="18">
                <a-input :value="inviteUrl" disabled> </a-input>
              </a-col>
              <a-col :span="4">
                <a-button icon="copy" @click="onCopy"> Copy </a-button>
              </a-col>
            </a-row>
          </div>
          <div class="invite-checkbox">
            <a-checkbox :checked="inviteCheckBoxChecked" @change="onInviteCheckBoxChange">
              Applicants with this link will need your approval to join your school community
            </a-checkbox>
          </div>
          <div class="invite-reset-btn">
            <a-button @click="handleInviteResetBtn" type="primary" icon="sync" :loading="resetLoading">Reset</a-button>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <avatar-modal ref="modal" @ok="setAvatar" />
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addStaff, getOrCreateInvite } from '@/api/schoolUser'
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
    },
    gradeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Add Teacher',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      uploadLoading: false,
      form: this.$form.createForm(this, { name: 'teacherAdd' }),
      defaultData: {},
      avatar: undefined,
      currentView: 'add',
      inviteCheckBoxChecked: true,
      inviteUrl: '',
      resetLoading: false,
      inviteLoading: false
    }
  },
  created() {},
  watch: {
    defaultData(value) {
      this.avatar = value?.userInfo?.avatar
    }
  },
  computed: {
    getDefaultFormData() {
      return {
        firstname: this.defaultData?.userInfo?.firstname,
        lastname: this.defaultData?.userInfo?.lastname,
        email: this.defaultData?.userInfo?.email,
        roles: this.defaultData?.roles?.[0]?.id,
        groups: this.defaultData?.groups?.[0]?.id,
        classes: this.defaultData?.classes?.[0]?.id,
        grades: this.defaultData?.grades?.[0]?.id,
        archived: this.defaultData?.userInfo?.schoolUserStatus === 4 ? 1 : 0,
        schoolJoinDate: this.defaultData?.userInfo?.schoolJoinDate
          ? Moment(this.defaultData?.userInfo?.schoolJoinDate)
          : undefined
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      this.currentView = 'add'
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
          if (values.schoolJoinDate) {
            params.schoolJoinDate = Moment(values.schoolJoinDate).valueOf()
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
    },
    async getInviteUrl(needRefresh) {
      const res = await getOrCreateInvite({
        schoolId: store.getters.userInfo.school,
        role: 2,
        need_approve: this.inviteCheckBoxChecked ? 1 : 0,
        need_refresh: needRefresh
      })
      if (res?.success) {
        this.inviteUrl = 'https://my.classcipe.com/user/login?role=teacher&inviteCode=' + res?.result?.inviteCode
      }
    },
    async handleInviteEnterBtn() {
      this.currentView = 'invite'
      this.inviteLoading = true
      await this.getInviteUrl(0)
      this.inviteLoading = false
    },
    async handleInviteResetBtn() {
      this.resetLoading = true
      await this.getInviteUrl(1)
      this.resetLoading = false
    },
    handleInviteBackBtn() {
      this.currentView = 'add'
    },
    onInviteCheckBoxChange(e) {
      this.inviteCheckBoxChecked = e.target.checked
    },
    onCopy() {
      navigator.clipboard.writeText(this.inviteUrl).then(() => {
        this.$message.success('copy success!')
      })
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
.invite-enter-btn {
  text-align: right;
  margin-bottom: 16px;
}
.invite-back-btn,
.invite-link,
.invite-checkbox,
.invite-reset-btn {
  margin-bottom: 16px;
}
.avatar-img img {
  max-width: 200px;
}
</style>

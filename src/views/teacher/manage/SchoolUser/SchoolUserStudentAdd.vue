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
              <a-form-item label="Student ID">
                <a-input v-decorator="['workNo', { initialValue: getDefaultFormData.workNo, rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Class">
                <a-select v-decorator="['classes', { initialValue: getDefaultFormData.classes, rules: [] }]">
                  <a-select-option :value="item.id" :key="item.id" v-for="item in classList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Age">
                <a-input v-decorator="['age', { initialValue: getDefaultFormData.age, rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Parent Name">
                <a-input v-decorator="['parentName', { initialValue: getDefaultFormData.parentName, rules: [] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Parent Email">
                <a-input
                  v-decorator="[
                    'parentEmail',
                    {
                      initialValue: getDefaultFormData.parentEmail,
                      rules: [{ required: false, type: 'email', message: 'Please input email!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Parent No">
                <a-input v-decorator="['parentNo', { initialValue: getDefaultFormData.parentNo, rules: [] }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </j-modal>

    <a-modal title="Invite by link" @cancel="handleInviteBackBtn" :footer="null" :visible="currentView === 'invite'">
      <a-spin :spinning="inviteLoading">
        <div class="invite">
          <!-- <div class="invite-back-btn">
          <a-button @click="handleInviteBackBtn" type="primary" icon="left">Back</a-button>
        </div> -->

          <div class="invite-link">
            <div class="link-text">
              {{ inviteUrl }}
            </div>
            <div class="action-copy" @click="onCopy">
              <a-tooltip placement="top" title="Copy link">
                <a-icon type="link" />
              </a-tooltip>
            </div>
          </div>

          <div class="invite-checkbox">
            <a-checkbox :checked="inviteCheckBoxChecked" @change="onInviteCheckBoxChange">
              Applicants with this link will need your approval to join your school community
            </a-checkbox>
          </div>

          <div class="invite-reset-btn">
            <a-button @click="handleInviteResetBtn" shape="round" type="primary" icon="sync" :loading="resetLoading">
              Reset
            </a-button>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addStudent, getOrCreateInvite } from '@/api/schoolUser'
import store from '@/store'

export default {
  name: 'SchoolUserStudentAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
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
      title: 'Add Student',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'studentAdd' }),
      defaultData: {},
      currentView: 'add',
      inviteCheckBoxChecked: true,
      inviteUrl: '',
      resetLoading: false,
      inviteLoading: false
    }
  },
  created() {},
  computed: {
    getDefaultFormData() {
      return {
        firstname: this.defaultData?.userInfo?.firstname,
        lastname: this.defaultData?.userInfo?.lastname,
        email: this.defaultData?.userInfo?.email,
        workNo: this.defaultData?.userInfo?.workNo,
        classes: this.defaultData?.classes?.[0]?.id,
        age: this.defaultData?.userInfo?.age,
        // grades: this.defaultData?.grades?.[0]?.id,
        parentName: this.defaultData?.userInfo?.parentName,
        parentEmail: this.defaultData?.userInfo?.parentEmail,
        parentNo: this.defaultData?.userInfo?.parentNo
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
          const res = await addStudent({
            schoolId: store.getters.userInfo.school,
            ...values
          })
          if (res.success) {
            this.confirmLoading = false
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(res.message)
            this.confirmLoading = false
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    async getInviteUrl(needRefresh) {
      const res = await getOrCreateInvite({
        schoolId: store.getters.userInfo.school,
        role: 4,
        need_approve: this.inviteCheckBoxChecked ? 1 : 0,
        need_refresh: needRefresh
      })
      if (res?.success) {
        this.inviteUrl = 'https://my.classcipe.com/user/login?role=student&inviteCode=' + res?.result?.inviteCode
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
.invite {
  & > div {
    margin-bottom: 16px;
  }
  .invite-reset-btn {
    text-align: center;
  }
  .invite-link {
    height: 50px;
    background: #f7f9fd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    .link-text {
      padding: 8px 10px;
      text-align: left;

      line-height: 20px;
      word-break: break-all;
    }
    .action-copy {
      font-size: 20px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
</style>

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
                <a-input v-decorator="['classes', { rules: [{ required: true, message: 'Please input class!' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Grade">
                <a-input v-decorator="['grades', { rules: [{ required: true, message: 'Please input grade!' }] }]" />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-item label="Archived">
                <a-select
                  v-decorator="['archived', { rules: [{ required: true, message: 'Please select archived!' }] }]"
                >
                  <a-select-option value="male"> male </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
          </a-row>
          <!-- <a-row>
            <a-col :span="12">
              <a-form-item label="Date of joining">
                <a-input v-decorator="['grade', { rules: [{ required: true, message: 'Please input grade!' }] }]" />
              </a-form-item>
            </a-col>
          </a-row> -->
          <!-- <a-row>
            <a-col :span="12">
              <a-form-item label="Picture">
                <a-upload
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row> -->
        </a-form>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addStaff } from '@/api/schoolUser'
import store from '@/store'

export default {
  name: 'SchoolUserTeacherAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
    roleList: {
      type: Array,
      default: () => []
    },
    groupList: {
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
      form: this.$form.createForm(this, { name: 'teacherAdd' })
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
          const res = await addStaff({
            schoolId: store.getters.userInfo.school,
            ...values
          })
          if (res.success) {
            this.confirmLoading = false
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
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
</style>

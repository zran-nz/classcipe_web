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
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
          <a-row>
            <a-col :span="24">
              <a-form-item label="Class Name">
                <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input class name!' }] }]" />
              </a-form-item>

              <a-col :span="24">
                <a-form-model-item label="classType" prop="classType">
                  <a-select :allowClear="true" v-model="model.classType" placeholder="Select" >
                    <a-select-option :value="0">Standard-Class</a-select-option>
                    <a-select-option :value="1">Subject-Forcused Class</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="24">
                <a-form-model-item label="Grade" prop="grade">
                  <a-select :allowClear="true" v-model="model.gradeId" placeholder="Select" >
                    <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'

export default {
  name: 'TermAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
    gradeList: {
      type: Array
    }
  },
  data() {
    return {
      title: 'Add Class',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'classAdd' }),
      defaultData: {}
    }
  },
  created() {},
  computed: {},
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
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
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

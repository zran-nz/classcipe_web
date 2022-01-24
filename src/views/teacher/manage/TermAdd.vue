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
            <a-col :span="8">
              <a-form-item label="Name">
                <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input name!' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="Start On">
                <a-date-picker v-decorator="['startOn', { rules: [] }]" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="End On">
                <a-date-picker v-decorator="['endOn', { rules: [] }]" />
              </a-form-item>
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
  props: {},
  data() {
    return {
      title: 'Add Term',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'termAdd' })
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

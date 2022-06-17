<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Rechoose Class Setting'
    width='350px'
    okText='Restore'
    :confirmLoading="loading"
    @ok='handleSave'
    @cancel='selVis = false'>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">
      <a-form-model-item :label="formLabel" prop="id">
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='formModel.id'
          placeholder='Please select an option'>
          <a-select-option v-for='item in options' :key='item.id'>
            {{ item.name }}
          </a-select-option >
        </a-select>
      </a-form-model-item >
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'ClassRestoreChoose',
  props: {
    chooseOptions: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    chooseOptions: {
      handler(val) {
        this.options = val
      },
      immediate: true
    }
  },
  data() {
    return {
      options: this.chooseOptions,
      model: {
        id: '',
        name: '',
        classType: 0
      },
      formModel: {
        id: ''
      },
      loading: false,
      selVis: false,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
    }
  },
  computed: {
    validatorRules: function () {
      return {
        id: [{ required: true, message: 'Please Select an option!' }]
      }
    },
    formLabel() {
      return this.model.classType === 0 ? 'Grade' : 'Subject'
    }
  },
  methods: {
    doCreate(cls) {
      this.loading = false
      this.model = { ...cls }
      this.selVis = true
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$emit('save', {
            ...this.model,
            [this.model.classType === 0 ? 'gradeId' : 'subjectId']: this.formModel.id
          })
          this.selVis = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>

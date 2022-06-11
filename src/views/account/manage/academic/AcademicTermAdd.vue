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
        <a-form-model ref="form" :model="model" :rules="validatorRules">
          <a-form-model-item label="Title">
            <a-input
              v-model="model.name"
              placeholder="Title"
            />
          </a-form-model-item>

          <a-form-model-item label="Start on">
            <a-date-picker
              v-model="model.startTime"
              :disabled-date="val => disabledStartDate(val, model)"
              :allowClear="false"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :show-time="{ format: 'HH:mm:ss' }"
              placeholder="Pick a date"
              @change="val => changeStartTime(val, model)"
              style="width: 100%;"
            />
          </a-form-model-item>
          <a-form-model-item label="End on">
            <a-date-picker
              v-model="model.endTime"
              :disabled-date="val => disabledEndDate(val, model)"
              :allowClear="false"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :show-time="{ format: 'HH:mm:ss' }"
              placeholder="Pick a date"
              style="width: 100%;"
            />
          </a-form-model-item>

        </a-form-model>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { addTerm, editTerm } from '@/api/academicTermInfo'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { mapState } from 'vuex'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'AcademicTermAdd',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    JModal
  },
  data() {
    return {
      title: 'Add academic term',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'modalAdd' }),
      model: {
        id: '',
        parentId: '',
        name: '',
        schoolId: this.currentSchool ? this.currentSchool.id : '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    // 备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    validatorRules() {
      var res = {
        name: [
          { required: true, message: 'Please input term name!' }
        ]
      }
      return res
    }
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.model.schoolId = currentSchool.id
    },
    disabledStartDate(startValue, item) {
      const endValue = item.endTime
      if (!startValue || !endValue) {
        return false
      }
      return moment(startValue).valueOf() > moment(endValue).valueOf()
    },
    disabledEndDate(endValue, item) {
      const startValue = item.startTime
      if (!endValue || !startValue) {
        return false
      }
      return moment(startValue).valueOf() >= moment(endValue).valueOf()
    },
    changeStartTime(date, item) {
      if (date && !item.endTime) {
        item.endTime = moment(date).add(1, 'months').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    add (record) {
      this.mode = 'add'
      // 初始化默认值
      this.edit({
        ...this.modelDefault,
        ...record
      })
    },
    edit (record) {
      this.model = cloneDeep(Object.assign({}, record, {
        schoolId: this.currentSchool.id
      }))
      console.log(this.model)
      this.mode = 'update'
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let promise = addTerm
          if (this.model.id) promise = editTerm
          const params = { ...this.model }
          params.startTime = moment(params.startTime).utc().format('YYYY-MM-DD HH:mm:ss')
          params.endTime = moment(params.endTime).utc().format('YYYY-MM-DD HH:mm:ss')
          promise(params).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.close()
            } else {
              that.$message.warning(res.message)
            }
          }).finally(res => {
            that.confirmLoading = false
          })
        } else {
          return false
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
/deep/ .ant-form-item-label {
  line-height: 30px;
}
.dynamic-delete-button {
  margin-top: 43px;
}
</style>

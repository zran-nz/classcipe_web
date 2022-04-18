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
          <a-row :gutter=16 v-for="(item, index) in model.terms" :key="'modelItem'+index">
            <a-col :span="7">
              <a-form-model-item label="Name" :prop="'terms.'+index+'.name'" :rules="validatorRules.name">
                <a-input v-model="item.name" placeholder="First term" ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Start on">
                <a-date-picker
                  v-model="item.startTime"
                  :disabled-date="val => disabledStartDate(val, item)"
                  :allowClear="false"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  placeholder="Pick a date"
                  @change="val => changeStartTime(val, item)"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="End on">
                <a-date-picker
                  v-model="item.endTime"
                  :disabled-date="val => disabledEndDate(val, item)"
                  :allowClear="false"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  placeholder="Pick a date"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="1">
              <a-icon
                v-if="model.terms.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="model.terms.length === 1"
                @click="removeItem(item)"
              />
            </a-col>
          </a-row>
          <a-form-model-item>
            <a-button type="primary" @click="addItem">
              <a-icon type="plus" /> Add more term
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { AddAcademic, EditAcademic } from '@/api/schoolAcademic'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { mapState } from 'vuex'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'AcademicAdd',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    JModal
  },
  data() {
    return {
      title: 'Add academic year',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'modalAdd' }),
      model: {
        academicId: '',
        name: '',
        schoolId: this.currentSchool ? this.currentSchool.id : '',
        terms: [{
          id: '',
          name: '',
          startTime: '',
          endTime: ''
        }]
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
        item.endTime = moment(date).add(1, 'months').format('YYYY-MM-DD')
      }
    },
    add () {
      this.mode = 'add'
      // 初始化默认值
      this.edit(this.modelDefault)
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
    addItem() {
      let startTime = ''
      let endTime = ''
      if (this.model.terms.length > 0) {
        const last = this.model.terms[this.model.terms.length - 1]
        startTime = last.endTime
        endTime = startTime ? moment(startTime).add(1, 'months').format('YYYY-MM-DD') : ''
      }
      this.model.terms.push({
        name: '',
        startTime: startTime,
        endTime: endTime
      })
    },
    removeItem(item) {
      const index = this.model.terms.indexOf(item)
      if (index !== -1) {
        this.model.terms.splice(index, 1)
      }
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let promise = AddAcademic
          if (this.model.academicId) promise = EditAcademic
          promise({
            ...this.model
          }).then((res) => {
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

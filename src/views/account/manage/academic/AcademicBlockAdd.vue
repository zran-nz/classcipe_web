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
        <a-form-model layout="horizontal" v-bind="formItemLayout" ref="form" :model="model" :rules="validatorRules">
          <a-form-model-item label="Block duration">
            <a-input-number
              v-model="model.blockDuration"
              @change="changeDuration"
              style="width: 150px"
              placeholder="Block duration"
              suffix="Min"
            />
            Min
          </a-form-model-item>

          <a-form-model-item
            v-for="(item, index) in model.blockSettings"
            class="mb0"
            :key="'modelItem'+index"
            :label="'Block '+ (index + 1)"
            :prop="'blockSettings.'+index+'.start'"
            :rules="validatorRules.start">
            <a-row :gutter=16 >
              <a-col :span="12">
                <a-time-picker
                  v-model="item.start"
                  :allowClear="false"
                  placeholder="Pick a time"
                  format="HH:mm"
                  @change="(time, timeStr) => changestart(time, timeStr, item)"
                  style="width: 100%;"
                />
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="">
                  - {{ item.end }}
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <!-- <a-icon
                  v-if="model.blockSettings.length > 1"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="model.blockSettings.length === 1"
                  @click="removeItem(item)"
                /> -->
                <label
                  for=""
                  v-if="model.blockSettings.length > 1"
                  :disabled="model.blockSettings.length === 1"
                  @click="removeItem(item)"
                  class="dynamic-delete-button">Delete</label>
              </a-col>
            </a-row>
          </a-form-model-item>

          <a-form-model-item :wrapperCol="{offset: 6}">
            <!-- <a-button type="primary" @click="addItem">
              <a-icon type="plus" /> Add
            </a-button> -->
            <label class="add-button" for="" @click="addItem">+ Add</label>
          </a-form-model-item>

        </a-form-model>
      </a-spin>
    </j-modal>
  </a-card>
</template>

<script>
import JModal from '@/components/jeecg/JModal'
import { saveBlockSetting } from '@/api/academicTermInfo'
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
      title: 'Block setting',
      mode: 'add',
      width: 600,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'modalAdd' }),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      model: {
        termId: '',
        name: '',
        schoolId: this.currentSchool ? this.currentSchool.id : '',
        blockDuration: 0,
        blockSettings: [{
          id: '',
          name: '',
          start: '',
          end: ''
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
        start: [
          { required: true, message: 'Please input block start!' }
        ]
      }
      return res
    }
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.model.schoolId = currentSchool.id
    },
    changestart(time, timeStr, item) {
      console.log(time, timeStr)
      if (this.model.blockDuration) {
        item.end = moment('2000-01-01 ' + timeStr).add(parseInt(this.model.blockDuration || 0), 'minutes').format('HH:mm')
        console.log(item.end)
      } else {
        item.end = timeStr
      }
      console.log(item)
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
      if (!this.model.blockSettings) {
        this.model.blockSettings = []
      } else {
        this.model.blockSettings.forEach(item => {
          item.start = moment.utc('2000-01-01 ' + item.start).local()
          item.end = moment.utc('2000-01-01 ' + item.end).local().format('HH:mm')
        })
      }
      console.log(this.model)
      this.mode = 'update'
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    changeDuration(val) {
      this.model.blockSettings.forEach(item => {
        const start = moment(item.start).format('YYYY-MM-DD HH:mm:ss')
        const end = moment(start).add(parseInt(val || 0), 'minutes').format('HH:mm')
        item.end = end
      })
    },
    addItem() {
      let start
      let end = ''
      const interval = parseInt(this.model.blockDuration || 0)
      if (this.model.blockSettings.length > 0) {
        const last = this.model.blockSettings[this.model.blockSettings.length - 1]
        start = moment('2000-01-01 ' + last.end)
        end = start ? start.add(interval, 'minutes').format('HH:mm') : ''
      }
      this.model.blockSettings.push({
        name: '',
        start: start,
        end: end
      })
    },
    removeItem(item) {
      const index = this.model.blockSettings.indexOf(item)
      if (index !== -1) {
        this.model.blockSettings.splice(index, 1)
      }
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = cloneDeep(this.model)
          params.blockSettings = params.blockSettings.map((item, index) => {
            item.start = moment.utc(item.start).format('HH:mm')
            item.end = moment.utc(moment('2000-01-01 ' + item.end)).format('HH:mm')
            item.name = item.name ? item.name : ('block_' + new Date().getTime() + '_' + index)
            return item
          })
          that.confirmLoading = true
          saveBlockSetting(params).then((res) => {
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
.dynamic-delete-button {
  font-size: 16px;
  font-family: Arial;
  font-weight: bold;
  color: #9A5FD7;
  cursor: pointer;
}
.add-button {
  font-size: 16px;
  font-family: Arial;
  font-weight: bold;
  color: #00689E;
  cursor: pointer;
}
.mb0 {
  margin-bottom: 0;
}
</style>

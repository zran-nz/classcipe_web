<template>
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
        <a-form-model-item label="Block duration" prop="blockDuration">
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
          :label="'Block '+ (index + 1)">
          <a-row :gutter=16 >
            <a-col :span="12">
              <a-form-model-item
                :prop="'blockSettings.'+index+'.start'"
                :rules="validatorRules.start">
                <a-time-picker
                  v-model="item.start"
                  :allowClear="false"
                  placeholder="Pick a time"
                  :disabledHours="() => disabledHours(index)"
                  :disabledMinutes="(hour) => disabledMinutes(hour, index)"
                  format="HH:mm"
                  @change="(time, timeStr) => changestart(time, timeStr, item)"
                  style="width: 100%;"
                />
              </a-form-model-item>
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
          <a-button type="link" class="add-button" :disabled="disabledAdd" for="" @click="addItem">+ Add</a-button>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </j-modal>
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
      title: 'Block Scheduling',
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
        blockDuration: [
          { required: true, message: 'Please input block duration!' }
        ],
        start: [
          { required: true, message: 'Please input block start!' },
          { validator: this.validateDate, trigger: 'change' }
        ]
      }
      return res
    },
    disabledAdd() {
      const lastBlock = this.model.blockSettings.slice(-1)
      if (lastBlock && lastBlock.length > 0) {
        if (!lastBlock[0].start) {
          return true
        }
      }
      return false
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
        if (item.start) {
          const start = moment(item.start).format('YYYY-MM-DD HH:mm:ss')
          const end = moment(start).add(parseInt(val || 0), 'minutes').format('HH:mm')
          item.end = end
        }
      })
      // this.$refs.form.validate()
      this.model.blockSettings = this.model.blockSettings.filter((item, index) => {
        if (index === 0 || !item.start) {
          return true
        }
        const hoursRes = this.disabledHours(index)
        const miniutesRes = this.disabledMinutes(item.start.hours(), index)
        if ((hoursRes.includes(item.start.hours()) || miniutesRes.includes(item.start.minutes()))) {
          return false
        }
        return true
      })
    },
    validateDate(rule, value, callback) {
      if (!value) {
        return callback()
      } else {
        const current = value.format('HH:mm')
        const index = this.model.blockSettings.findIndex(item => item.start.format('HH:mm') === current)
        const hoursRes = this.disabledHours(index)
        const miniutesRes = this.disabledMinutes(value.hours(), index)
        console.log(index)
        console.log(hoursRes)
        console.log(miniutesRes)
        if (hoursRes.includes(value.hours()) || miniutesRes.includes(value.minutes())) {
          return callback(new Error('block time collapses'))
        }
        return callback()
      }
    },
    disabledHours(index) {
      let start = 0
      let end = 23
      // 取上一个
      if (index > 0) {
        start = moment(this.model.blockSettings[index - 1].end, 'HH:mm').hours()
      }
      // 取下一个
      if (index < this.model.blockSettings.length - 1) {
        // 当前的结束时间需小于下一个的开始时间
        end = moment(this.model.blockSettings[index + 1].start, 'HH:mm').subtract(parseInt(this.model.blockDuration || 0), 'minutes').hours()
      }

      return Array.from({
        length: start
      }, (v, i) => i).concat(Array.from({
        length: 23 - end
      }, (v, i) => 23 - i))
    },
    disabledMinutes(hour, index) {
      let start = 0
      let end = 59
      let startHour = 0
      let endHour = 0
      // 取上一个
      if (index > 0) {
        startHour = moment(this.model.blockSettings[index - 1].end, 'HH:mm').hours()
        start = moment(this.model.blockSettings[index - 1].end, 'HH:mm').minutes()
      }
      // 取下一个
      if (index < this.model.blockSettings.length - 1) {
        // 当前的结束时间需小于下一个的开始时间
        const nextAfter = moment(this.model.blockSettings[index + 1].start, 'HH:mm').subtract(parseInt(this.model.blockDuration || 0), 'minutes')
        endHour = nextAfter.hours()
        end = nextAfter.minutes()
      }
      let res = []
      if (startHour === hour) {
        res = Array.from({
          length: start
        }, (v, i) => i).concat(res)
      }
      if (endHour === hour) {
        res = res.concat(Array.from({
          length: 59 - end
        }, (v, i) => 59 - i))
      }
      return res
    },
    addItem() {
      let start
      let end = ''
      const interval = parseInt(this.model.blockDuration || 0)
      if (this.model.blockSettings.length > 0) {
        const last = this.model.blockSettings[this.model.blockSettings.length - 1]
        start = moment(last.start).add(1, 'hours')
        console.log(start.format('YYYY-MM-DD HH:mm:ss'))
        end = start ? moment(start).add(interval, 'minutes').format('HH:mm') : ''
      }
      start = undefined
      end = ''
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
  &:disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: transparent;
    border-color: transparent;
    text-shadow: none;
    box-shadow: none;
  }
}
.mb0 {
  margin-bottom: 0;
}
</style>

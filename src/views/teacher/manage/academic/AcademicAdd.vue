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
          <a-row :gutter=16 v-for="(item, index) in model.terms" :key="'modelItem'+index">
            <a-col :span="7">
              <a-form-model-item label="Name" :prop="'terms.'+index+'.name'" :rules="validatorRules.name">
                <a-input v-model="item.name" placeholder="First term" ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Start on">
                <a-date-picker
                  v-model="item.startOn"
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="End on">
                <a-date-picker
                  v-model="item.endOn"
                  type="date"
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
// import { httpAction, uploadAction } from '@/api/manage'
import { USER_MODE } from '@/const/common'
import { mapState } from 'vuex'

export default {
  name: 'AcademicAdd',
  mixins: [],
  components: {
    JModal
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      title: 'Add acadeic year',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'modalAdd' }),
      model: {
        terms: [{
          name: '',
          startOn: '',
          endOn: ''
        }]
      },
      fileList: [],
      uploading: false
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
    add () {
      this.mode = 'add'
      // 初始化默认值
      this.edit(this.modelDefault)
    },
    edit (record) {
      this.model = Object.assign({}, record)
      this.mode = 'update'
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    addItem() {
      this.model.terms.push({
        name: '',
        startOn: '',
        endOn: ''
      })
    },
    removeItem(item) {
      const index = this.model.terms.indexOf(item)
      if (index !== -1) {
        this.model.terms.splice(index, 1)
      }
    },
    handleOk() {
      // const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          // that.confirmLoading = true
          // const addOrUpdate = this.userMode === USER_MODE.SELF ? personalClassApiUrl.AddOrUpdate : schoolClassAPIUrl.SchoolClassAddOrUpdate
          // httpAction(addOrUpdate, this.model, 'post').then((res) => {
          //   if (res.success) {
          //     this.model.id = res.result.id
          //     if (this.fileList.length > 0) {
          //         this.handleUpload()
          //     } else {
          //       that.$message.success(res.message)
          //       this.$emit('ok')
          //       that.confirmLoading = false
          //       that.close()
          //     }
          //   } else {
          //     that.$message.warning(res.message)
          //   }
          // })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    handleRemove(file) {
      this.fileList = []
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

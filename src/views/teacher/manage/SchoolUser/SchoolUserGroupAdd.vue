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
        <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-item label="Group Name">
                <a-input
                  v-decorator="[
                    'name',
                    {
                      initialValue: getDefaultFormData.name,
                      rules: [{ required: true, message: 'Please input group name!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Group Type">
                <a-select
                  @change="this.handelChangeGroupType"
                  v-decorator="[
                    'groupType',
                    {
                      initialValue: getDefaultFormData.groupType,
                      rules: [{ required: true, message: 'Please select group type!' }],
                    },
                  ]"
                >
                  <a-select-option :value="item.id" :key="item.id" v-for="item in schoolGroupTypeList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" v-if="this.groupType === 1">
              <a-form-item label="Year">
                <a-select
                  v-decorator="[
                    'relationId',
                    {
                      initialValue: getDefaultFormData.relationId,
                      rules: [],
                    },
                  ]"
                >
                  <a-select-option :value="item.id" :key="item.id" v-for="item in gradeList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="this.groupType === 2">
              <a-form-item label="Subject">
                <a-select
                  v-decorator="[
                    'relationId',
                    {
                      initialValue: getDefaultFormData.relationId,
                      rules: [],
                    },
                  ]"
                >
                  <a-select-option :value="item.id" :key="item.id" v-for="item in subjectList">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item label="Advisor" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-select
                  mode="multiple"
                  :label-in-value="false"
                  style="width: 100%"
                  :filter-option="false"
                  option-label-prop="label"
                  @search="handleSearch"
                  @focus="handleSearch"
                  v-decorator="[
                    'advisor',
                    {
                      initialValue: getDefaultFormData.advisor,
                      rules: [],
                    },
                  ]"
                >
                  <a-select-option
                    :value="item.id"
                    :key="item.id"
                    :label="item.userInfo.email"
                    v-for="item in dataSource"
                  >
                    <div style="display: flex">
                      <div class="user-avatar">
                        <div class="avatar">
                          <img :src="item.userInfo.avatar" />
                        </div>
                      </div>
                      <div class="user-name-email">
                        <div class="user-name">
                          {{ item.userInfo.nickname }}
                        </div>
                        <div class="email">
                          {{ item.userInfo.email }}
                        </div>
                      </div>
                    </div>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item label="Intro" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                <a-textarea v-decorator="['intro', { initialValue: getDefaultFormData.intro, rules: [] }]" />
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
import { schoolGroupType } from '@/const/schoolGroup'
import { getGradeListBySchoolId } from '@/api/grade'
import { addOrUpdateGroup } from '@/api/schoolGroup'
import { SubjectTree } from '@/api/subject'
import store from '@/store'

export default {
  name: 'SchoolUserGroupAdd',
  mixins: [],
  components: {
    JModal
  },
  props: {
    teacherList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: 'Add Group',
      mode: 'add',
      width: 800,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'groupAdd' }),
      defaultData: {},
      schoolGroupTypeList: schoolGroupType,
      groupType: 0,
      gradeList: [],
      subjectList: [],
      dataSource: this.teacherList
    }
  },
  created() {
    this.loadGradeList()
    this.loadSubjectList()
  },
  watch: {
    defaultData(value) {
      this.groupType = value?.groupType
    }
  },
  computed: {
    getDefaultFormData() {
      const { advisor = [] } = this.defaultData
      const defaultAdvisor = advisor.map(item => item.id)
      return {
        name: this.defaultData?.name,
        groupType: this.defaultData?.groupType,
        relationId: this.defaultData?.relationId,
        advisor: defaultAdvisor,
        intro: this.defaultData?.intro
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    async loadGradeList() {
      const res = await getGradeListBySchoolId({
        schoolId: store.getters.userInfo.school
      })
      this.gradeList = res?.result || []
    },
    async loadSubjectList() {
      const res = await SubjectTree({
        schoolId: store.getters.userInfo.school
      })
      const flatSubject = arr => {
        let ret = []
        arr.forEach(item => {
          if (item.children && item.children.length > 0) {
            ret = [...ret, ...flatSubject(item.children)]
          } else {
            ret.push(item)
          }
        })
        return ret
      }
      this.subjectList = flatSubject(res?.result || [])
      // console.log(this.subjectList)
    },
    handleOk() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.confirmLoading = true
          console.log('Received values of form: ', values)
          const vo = {
            schoolId: store.getters.userInfo.school,
            ...values
          }
          if (this.mode === 'edit') {
            vo.id = this.defaultData.id
          }
          const res = await addOrUpdateGroup(vo)
          if (res.success) {
            this.confirmLoading = false
            this.visible = false
            this.$emit('ok')
          } else {
            this.confirmLoading = false
            this.$message.error(res.message)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    },
    handelChangeGroupType(value) {
      this.groupType = value
    },
    handleSearch(value) {
      if (!value) {
        this.dataSource = this.teacherList
      } else {
        this.dataSource = this.teacherList.filter(item => item.userInfo.email.indexOf(value) > -1)
      }
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
.user-avatar {
  width: 50px;
  .avatar {
    img {
      height: 40px;
      border-radius: 40px;
    }
  }
}
.user-name-email {
  display: flex;
  flex-direction: column;
  width: 250px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    padding-left: 15px;
    color: #000000;
  }
}
</style>

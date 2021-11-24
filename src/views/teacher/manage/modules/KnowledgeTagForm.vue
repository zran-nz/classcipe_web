<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="name" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入name"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="Tag type" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tagType">
              <a-radio-group :defaultValue="1" v-model="model.tagType" placeholder="KnowLedge or Skill">
                <a-radio :value="1">
                  KnowLedge
                </a-radio>
                <a-radio :value="2">
                  Skill
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="description" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="description">-->
<!--              <a-textarea  :readOnly="true" rows="3" v-model="model.description" placeholder="请输入description"  ></a-textarea>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
       <!--   <a-col :span="24">
            <a-form-model-item label="subKnowledgeId" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subKnowledgeId">
              <a-input v-model="model.subKnowledgeId" placeholder="请输入subKnowledgeId"  ></a-input>
            </a-form-model-item>
          </a-col>-->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'KnowledgeTagForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          name: [
            { required: true, message: '请输入name!'},
          ]
        },
        url: {
          add: "/api/knowledge/addOrUpdateTag",
          edit: "/api/knowledge/addOrUpdateTag",
          queryById: "/api/knowledgeTag/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add (subKnowledgeId) {
        this.modelDefault.subKnowledgeId = subKnowledgeId
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'post';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>
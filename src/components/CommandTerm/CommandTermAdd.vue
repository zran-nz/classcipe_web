<template>
  <div>
    <a-form-model
      layout="horizontal"
      :rules="commandTermRules"
      :model="commandTermForm"
      ref="commandTermFormRef"
      v-bind="{
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
      }">
      <a-form-model-item label="" prop="name" style="margin-bottom:0">
        <a-input v-model="commandTermForm.name" placeholder="input command term" />
      </a-form-model-item>
      <a-form-model-item label="" prop="bloom" style="margin-bottom:0">
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          v-model="commandTermForm.bloom"
          placeholder="Bloom's Taxonomy"
        >
          <a-select-option v-for="bloom in bloomOptions" :value="bloom" :key="'bloom_' + bloom">
            {{ bloom }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="" prop="knowledge" style="margin-bottom:10px">
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          v-model="commandTermForm.knowledge"
          placeholder="Knowledge Dimensions"
        >
          <a-select-option v-for="item in knowLedgeOptions" :value="item" :key="'knowledge_' + item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <a-space>
      <a-button :loading="saveCommanTermLoading" @click="handleSaveCommanTerm" size="small" type="primary">Create</a-button>
      <a-button @click="handleCancel" size="small" type="">Cancel</a-button>
    </a-space>
  </div>
</template>

<script>
import { KnowledgeTermTagQueryByKeywords, KnowledgeTermTagCustomCreate } from '@/api/knowledgeTermTag'
export default {
  name: 'CommandTermAdd',
  props: {
    bloomOptions: {
      type: Array,
      default: () => []
    },
    knowLedgeOptions: {
      type: Array,
      default: () => []
    },
    initName: {
      type: String,
      default: ''
    }
  },
  watch: {
    initName(val) {
      this.commandTermForm.name = val
    }
  },
  data() {
    return {
      saveCommanTermLoading: false,
      KnowledgeTermTagQueryByKeywords: KnowledgeTermTagQueryByKeywords,
      commandTermForm: {
        name: '',
        parentId: '',
        bloom: '',
        knowledge: ''
      },
      commandTermRules: {
        name: [{ required: true, message: 'Please input term name', trigger: 'blur' }],
        bloom: [{ required: true, message: 'Please select bloom', trigger: 'change' }],
        knowledge: [{ required: true, message: 'Please select knowledgeDimension', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleSaveCommanTerm() {
      this.$refs.commandTermFormRef.validate(valid => {
        if (valid) {
          this.saveCommanTermLoading = true
          KnowledgeTermTagCustomCreate({
            name: this.commandTermForm.name,
            bloomTagId: this.bloomParentId,
            bloomTag: this.commandTermForm.bloom,
            knowledgeDimensionId: this.knowLedgeParentId,
            knowledgeDimension: this.commandTermForm.knowledge,
            type: 1,
            isGlobal: 2
          }).then(res => {
            if (res.success) {
              this.$$emit('save', {
                word: this.commandTermForm.name,
                parentId: this.bloomParentId,
                tag: this.commandTermForm.bloom,
                bloomTag: this.commandTermForm.bloom,
                knowledgeDimensionId: this.knowLedgeParentId,
                knowledgeDimension: this.commandTermForm.knowledge,
                id: res.result.id
              })
            }
          }).finally(() => {
            this.saveCommanTermLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>

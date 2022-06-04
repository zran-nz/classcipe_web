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
      <!-- <a-form-model-item label="" prop="bloom" style="margin-bottom:0">
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
      </a-form-model-item> -->
    </a-form-model>
    <a-space>
      <a-button :loading="saveCommanTermLoading" @click="handleSaveCommanTerm" size="small" type="primary">Create</a-button>
      <a-button @click="handleCancel" size="small" type="">Cancel</a-button>
    </a-space>
  </div>
</template>

<script>
import { KnowledgeTermTagCustomCreate } from '@/api/knowledgeTermTag'
import { termsCreate, dimensionsCreate } from '@/api/v2/tagsTerm'
export default {
  name: 'CommandTermAdd',
  props: {
    customTags: {
      type: Object,
      default: () => {}
    },
    initName: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'terms'
    }
  },
  watch: {
    initName(val) {
      this.commandTermForm.name = val
    }
  },
  data() {
    return {
      bloomParentId: '',
      bloomOptions: [],
      knowLedgeParentId: '',
      knowLedgeOptions: [],
      saveCommanTermLoading: false,
      termsCreate: termsCreate,
      dimensionsCreate: dimensionsCreate,
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
  created() {
    this.initBloomOptions()
  },
  methods: {
    initBloomOptions () {
      if (this.customTags && this.customTags.recommends) {
        const bloom = this.customTags.recommends.find(item => item.name === "Bloom's Taxonomy")
        if (bloom) {
          this.bloomOptions = bloom.keywords
          this.bloomParentId = bloom.id
        } else {
          this.bloomOptions = []
          this.bloomParentId = ''
        }
        const knowLedge = this.customTags.recommends.find(item => item.name === 'Knowledge Dimensions')
        if (knowLedge) {
          this.knowLedgeOptions = knowLedge.keywords
          this.knowLedgeParentId = knowLedge.id
        } else {
          this.knowLedgeOptions = []
          this.knowLedgeParentId = ''
        }
      }
    },
    handleSaveCommanTerm() {
      this.$refs.commandTermFormRef.validate(valid => {
        if (valid) {
          this.saveCommanTermLoading = true
          this[this.type + 'Create']({
            // name: this.commandTermForm.name,
            // bloomTagId: this.bloomParentId,
            // bloomTag: this.commandTermForm.bloom,
            // knowledgeDimensionId: this.knowLedgeParentId,
            // knowledgeDimension: this.commandTermForm.knowledge,
            // type: 1,
            // isGlobal: 2
            tag: this.commandTermForm.name
          }).then(res => {
            if (res.code === 0) {
              this.$emit('save', {
                word: this.commandTermForm.name,
                parentId: this.bloomParentId,
                tag: this.commandTermForm.bloom,
                bloomTag: this.commandTermForm.bloom,
                knowledgeDimensionId: this.knowLedgeParentId,
                knowledgeDimension: this.commandTermForm.knowledge,
                id: res.result.id
              })
            } else {
              this.$message.error(res.message)
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

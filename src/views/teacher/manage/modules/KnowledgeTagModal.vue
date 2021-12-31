<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <knowledge-tag-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></knowledge-tag-form>
  </j-modal>
</template>

<script>

  import KnowledgeTagForm from './KnowledgeTagForm'
  export default {
    name: 'KnowledgeTagModal',
    components: {
      KnowledgeTagForm
    },
    data () {
      return {
        title: '',
        subKnowledgeId: '',
        width: 800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add (subKnowledgeId) {
        this.visible = true
        this.subKnowledgeId = subKnowledgeId
        this.$nextTick(() => {
          this.$refs.realForm.add(this.subKnowledgeId)
        })
      },
      edit (record) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.realForm.edit(record)
        })
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleOk () {
        this.$refs.realForm.submitForm()
      },
      submitCallback () {
        this.$emit('ok')
        this.visible = false
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

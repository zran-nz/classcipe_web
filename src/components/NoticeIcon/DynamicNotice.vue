<template>
  <component
    :is="comp"
    :formData="formData"
    ref="compModel"
    v-if="comp">
  </component>
</template>
<script>
  export default {
    name: 'DynamicNotice',
    data () {
      return {
        compName: this.path
      }
    },
    computed: {
      comp: function () {
        if (!this.path) {
          return null
        }
        return () => import(`@/views/${this.path}.vue`)
      }
    },
    props: {
      path: {
        type: String,
        default: '',
        required: false
      },
      formData: {
        type: Object,
        default: () => {},
        required: false
      }
    },
    methods: {
      detail () {
        setTimeout(() => {
          if (this.path) {
            this.$refs.compModel.view(this.formData)
          }
        }, 200)
      }
    }
  }
</script>

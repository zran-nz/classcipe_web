<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="Close"
    wrapClassName="ant-modal-cust-warp"
  >
    <a-spin :spinning="loading">
      <div v-if="result.length > 0"></div>
      <a-empty v-else></a-empty>
    </a-spin>
  </a-modal>
</template>

<script>
import { getRolePermission } from '@/api/v2/schoolRole'
export default {
  name: 'SchoolRolePermission',
  data() {
    return {
      title: 'School Role Permission',
      result: [],
      loading: false,
      visible: false
    }
  },
  methods: {
    edit(record) {
      this.loading = true
      getRolePermission({
        roleId: record.id
      }).then(res => {
        if (res.code === 0) {
          this.result = res.result.permissionList
          this.visible = true
        }
      }).finally(() => {
        this.loading = false
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {

    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>

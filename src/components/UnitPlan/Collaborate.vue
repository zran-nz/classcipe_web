<template>
  <a-modal
    :visible="visible"
    title="Select users to collaborate"
    @ok="handleSelect"
    @cancel="handleClose"
    width="600px"
    :dialog-style="{ top: '100px' }">
    <div>
      <a-select
        mode="multiple"
        :value="value"
        placeholder="Select users"
        style="width: 500px"
        :filter-option="false"
        :not-found-content="fetching ? undefined : 'Can not find a user'"
        @search="fetchUser"
        @change="handleChange"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in data" :key="d.value">
          {{ d.text }}
        </a-select-option>
      </a-select>
    </div>

    <template slot="footer">
      <a-button @click="handleClose">Cancel</a-button>
      <a-button
        type="primary"
        @click="handleSelect"
        :loading="uploading">
        Save
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { getAction } from '../../api/manage'
import { AddUserCollaborate, GetCollaborateUsers, userAPIUrl } from '../../api/user'

export default {
  name: 'Collaborate',
  data () {
    return {
      visible: false,
      uploading: false,
      value: [],
      data: [],
      fetching: false,
      lastFetchId: 0
    }
  },
  components: {},
  props: {
    id: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: Number,
      default: 1,
      required: true
    },
    defaultValue: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose () {
      this.visible = false
    },
    handleSelect () {
      console.log(this.value)
      const data = {
        users: this.value,
        type: this.type,
        id: this.id
      }
      this.uploading = true
      AddUserCollaborate(data).then((response) => {
        this.$logger.info('AddUserCollaborate response', response.result)
        if (response.success) {
           this.$message.success('Add Collaborate successfully')
           this.handleClose()
        } else {
          this.$message.error(response.message)
        }
        this.uploading = false
      })
    },
    fetchUser (value) {
      if (value.length < 3) {
        return
      }
      console.log('fetching user', value)
      this.data = []
      this.fetching = true
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      getAction(userAPIUrl.SearchUser, ({ name: value })).then(res => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        if (res.success) {
          res.result.forEach((record) => {
            this.data.push({
              text: record.email,
              value: record.email
            })
          })
        } else {
          this.data = []
        }
        this.fetching = false
      })
    },
    handleChange (value) {
     this.value = value
    }
  },
  created () {
    GetCollaborateUsers({ id: this.id, type: this.type }).then((response) => {
      this.$logger.info('GetCollaborateUsers response', response.result)
      if (response.success) {
        this.value = response.result
      } else {
        this.$message.error(response.message)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.redirect-spin {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
}
</style>

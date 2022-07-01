<template>
  <a-modal title="Invite by link" @cancel="handleInviteBackBtn" :footer="null" v-model="modalVis">
    <a-spin :spinning="loading">
      <div class="invite">

        <div class="invite-link">
          <div class="link-text">
            {{ inviteUrl }}
          </div>
          <div class="action-copy" @click="onCopy">
            <a-tooltip placement="top" title="Copy link">
              <a-icon type="link" />
            </a-tooltip>
          </div>
        </div>

        <div class="invite-checkbox">
          <a-checkbox :checked="inviteCheckBoxChecked" @change="onInviteCheckBoxChange">
            Applicants with this link will need your approval to join your school community
          </a-checkbox>
        </div>

        <div class="invite-reset-btn">
          <a-button @click="handleInviteResetBtn" shape="round" type="primary" icon="sync" :loading="loading">
            Reset
          </a-button>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getInvite, updateInvite } from '@/api/v2/schoolUser'
export default {
  name: 'SchoolUserInvite',
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      loading: false,
      modalVis: false,
      role: 'student',
      inviteUrl: '',
      inviteCheckBoxChecked: true,
      inviteCodeId: undefined
    }
  },
  methods: {
    doCreate(role) {
      this.role = role
      this.modalVis = true
      this.handleInviteEnterBtn()
    },
    async getInviteUrl(needRefresh) {
      const res = await getInvite({
        schoolId: this.currentSchool.id,
        role: this.role,
        needApprove: this.inviteCheckBoxChecked ? 1 : 0,
        needRefresh: needRefresh,
        need_approve: this.inviteCheckBoxChecked ? 1 : 0,
        need_refresh: needRefresh
      })
      if (res?.success) {
        this.inviteUrl = `${process.env.VUE_APP_BASE_URL}/user/invite?inviteCode=${res?.result?.inviteCode}`
        this.inviteCheckBoxChecked = res?.result?.approveFlag
        this.inviteCodeId = res?.result?.id
      }
    },
    async handleInviteEnterBtn() {
      this.loading = true
      await this.getInviteUrl(0)
      this.loading = false
    },
    async handleInviteResetBtn() {
      this.loading = true
      await this.getInviteUrl(1)
      this.loading = false
    },
    handleInviteBackBtn() {
      this.$emit('cancel')
    },
    onInviteCheckBoxChange(e) {
      this.inviteCheckBoxChecked = e.target.checked
      this.updateInviteCode(e.target.checked)
    },
    async updateInviteCode(bool) {
      const res = await updateInvite({
        needApprove: bool ? 1 : 0,
        need_approve: bool ? 1 : 0,
        id: this.inviteCodeId
      })
      if (res.success) {
        this.inviteUrl = `${process.env.VUE_APP_BASE_URL}/user/invite?inviteCode=${res?.result?.inviteCode}`
      } else {
        this.$message.error(res.message)
      }
    },
    onCopy() {
      this.$copyText(this.inviteUrl).then(message => {
        this.$message.success('Copy success!')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('Copy Failed')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.invite-enter-btn {
  text-align: right;
  margin-bottom: 16px;
}
.invite {
  & > div {
    margin-bottom: 16px;
  }
  .invite-reset-btn {
    text-align: center;
  }
  .invite-link {
    height: 50px;
    background: #f7f9fd;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    .link-text {
      padding: 8px 10px;
      text-align: left;

      line-height: 20px;
      word-break: break-all;
    }
    .action-copy {
      font-size: 20px;
      padding: 10px;
      cursor: pointer;
    }
  }
}
</style>

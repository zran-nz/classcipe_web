<template>
  <a-skeleton :loading="loading" active>
    <div class="cb-wrapper">
      <div class="img">
        <img v-if="collaborate.content" :src="collaborate.content.image" alt="">
      </div>
      <div class="title" v-if="collaborate.link.approveFlag">
        Apply to collaborate on {{ collaborate.content.name }}
      </div>
      <div class="title" v-if="!collaborate.link.approveFlag">
        {{ collaborate.owner.nickname }} invited you to collaborate on {{ collaborate.content.name }}
      </div>
      <!--      <div class="sub-title">-->
      <!--        From: {{ collaborate.owner.nickname }}-->
      <!--      </div>-->

      <!--        需要审批-->
      <div v-if="collaborate.link.approveFlag">
        <template v-if="!getUser">
          <div class="btn" @click="handleApply('Apply')">
            <div class="btn-text" >
              <span v-if="!applyLoading">Apply</span>
              <a-icon type="loading" v-if="applyLoading" />
            </div>
          </div>
        </template>
        <template v-else>
          <!--        需要审批-->
          <div class="btn btn-disable">
            <div class="btn-text">
              Wait for approval
            </div>
          </div>
        </template>
      </div>
      <div class="btn" @click="handleApply('Join')" v-else>
        <div class="btn-text" >
          <span v-if="!applyLoading">Start collaborating</span>
          <a-icon v-if="applyLoading" type="loading" />
        </div>
      </div>
    </div>
  </a-skeleton>
</template>

<script>

import * as logger from '@/utils/logger'
import { CollaboratesApply, CollaboratesQueryByLinkCode } from '@/api/collaborate'
import { UtilMixin } from '@/mixins/UtilMixin'
import { CollaborateStatus } from '@/const/teacher'

export default {
  name: 'CollaborateJoin',
  components: {

  },
  data () {
    return {
      loading: false,
      applyLoading: false,
      collaborate: {
        owner: {},
        users: [],
        content: {},
        link: {}
      }
    }
  },
  mixins: [UtilMixin],
  created () {
    if (!this.code) {
      this.$router.push({ path: '/linkValid' })
    }
    this.getCollaborateContent()
  },
  computed: {
    getUser () {
      var index = this.collaborate.users.findIndex(item => item.email === this.$store.getters.userInfo.email)
      if (index > -1) {
        return this.collaborate.users[index]
      } else {
        return ''
      }
    }
  },
  props: {
    code: {
      type: String,
      default: null
    }
  },
  methods: {
    getCollaborateContent () {
      logger.info('getCollaborateContent ', this.code)
      this.loading = true
      CollaboratesQueryByLinkCode({ code: this.code }).then(response => {
        logger.info('CollaboratesQueryByLinkCode ', response)
        if (response.success) {
          this.collaborate = response.result
          if (!this.collaborate.link) {
            this.$router.push({ path: '/linkValid' })
          }
        } else {
          this.$router.push({ path: '/linkValid' })
        }
      }).finally(() => {
        this.loading = false
        this.applyLoading = false
        if (this.getUser && this.getUser.agreeFlag === CollaborateStatus.agree) {
          this.handleLocationItem(this.collaborate.content)
        }
      })
    },
    handleApply (type) {
      logger.info('handleApply ', this.collaborate)
      this.applyLoading = true
      CollaboratesApply({ id: this.collaborate.content.id, type: this.collaborate.content.type }).then(response => {
        logger.info('handleApply ', response)
        if (response.success) {
          this.$message.success(type + ' successfully ！')
          if (type === 'Join') {
              this.handleLocationItem(this.collaborate.content)
          } else {
            this.$router.push({ path: '/teacher/main/created-by-me?shareType=2' })
          }
        } else {
          this.applyLoading = false
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.getCollaborateContent()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.cb-wrapper{
    margin:50px auto;
    width:520px;
    height:500px;
    font-family: Inter-Bold;
    font-size: 14px;
    cursor: pointer;
    background-image: url("~@/assets/icons/collaborate/joinbg.png");
    align-items: center;
    display: flex;
    flex-direction: column;
    background-size: 100% 100%;
    .img img{
      margin-top: 20px;
      height:250px;
      max-width: 450px;
    }
    .title{
      margin-top: 20px;
      color: rgba(44, 42, 80, 1);
      font-size: 20px;
      text-align: center;
      font-family: FZCuYuan-M03S;
    }
    .sub-title{
      margin-top:10px;
    }
  }

.btn {
  margin-top:40px;
  width: 160px;
  height: 40px;
  background: #15C39A;
  opacity: 1;
  border-radius: 20px;
  justify-content: center;
  display: flex;
  padding: 6px 13px;
  .btn-text {
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #FFFFFF;
    opacity: 1;
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
  }
  &:hover{
      .btn-text {
        color:#303735
      }
  }
}

.btn-disable {
  color: rgba(0, 0, 0, .25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  text-shadow: none;
  box-shadow: none;
  cursor: not-allowed;
  .btn-text{
    color:black;
  }
}
</style>

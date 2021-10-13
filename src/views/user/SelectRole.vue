<template>
  <div class="main-content">
    <div class="card-wrapper">
      <div class="card-steps">
        <a-steps :current="currentStep" direction="horizontal">
          <a-step :title="$t('role.step.what-can-you-do')">
            <span style="font-size: 14px" slot="title">{{ $t('result.success.step1-title') }}</span>
          </a-step>
          <a-step :title="$t('role.step.personal-information')">
            <span style="font-size: 14px" slot="title">{{ $t('role.step.personal-information') }}</span>
          </a-step>
        </a-steps>
      </div>
      <div class="card-items">
        <div class="card-item card-item-first" @click="handleSelectRole('expert')">
          <a-card hoverable style="width: 300px" :class="{&quot;selected-card&quot;: selectedRole === &quot;expert&quot;}">
            <div slot="cover" class="card-cover">
              <contributor-svg />
            </div>
            <a-card-meta title="Contributor" description="I can contribute teaching resource">
            </a-card-meta>
          </a-card>
        </div>
        <div class="card-item card-item-second" @click="handleSelectRole('teacher')">
          <a-card hoverable style="width: 300px" :class="{&quot;selected-card&quot;: selectedRole === &quot;teacher&quot;}">
            <div slot="cover" class="card-cover">
              <teacher-svg />
            </div>
            <a-card-meta title="Teacher" description="I can teach">
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="warn">
        <p>  <a-checkbox v-model="isCheck" ></a-checkbox> By registering, you agree to the Terms of Service and Privacy Policy.</p>
        <a-alert message="Please select a role!" type="warning" v-show="showWarn"/>
        <a-alert message="Please agree to the Terms of Service and Privacy Policy!" type="warning" v-if="!isCheck"/>
      </div>
      <div class="actions">
        <a-button type="primary" block @click="goNext">
          next step >
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import ContributorSvg from '@/assets/icons/role/contributor.svg?inline'
import TeacherSvg from '@/assets/icons/role/teacher.svg?inline'
import { addPreferenceRouter } from '@/config/router.config'
import * as logger from '@/utils/logger'

export default {
  name: 'SelectRole',
  components: {
    ContributorSvg,
    TeacherSvg
  },
  data () {
    return {
      showWarn: false,
      checkWarn: false,
      selectedRole: '',
      currentStep: 0,
      isCheck: true
    }
  },
  created () {
  },
  methods: {
    handleSelectRole (role) {
      this.selectedRole = role
      this.showWarn = false
    },
    goNext () {
      if (!this.isCheck) {
        this.checkWarn = true
      }
      if (!!this.selectedRole && !!this.selectedRole.trim()) {
        this.$store.dispatch('ChangeRole', { role: this.selectedRole }).then(() => {
          if (this.$store.getters.isAddPreference) {
            logger.info('go to defaultRouter' + this.$store.getters.defaultRouter)
            this.$router.push(this.$store.getters.defaultRouter)
          } else {
            logger.info('go to addPreferenceRouter')
            this.$router.push(addPreferenceRouter)
          }
        })
      } else {
        this.showWarn = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.main-content {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;

  .card-wrapper {
    width: 850px;
    min-height: 650px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 30px 25px;
    box-sizing: border-box;

    .card-steps {
      width: 70%;
      padding-bottom: 50px;
    }

    .warn {
      width: 640px;
      padding: 15px 0;
      height: 110px;
      box-sizing: border-box;
    }

    .card-items {
      display: flex;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      background: #fff;

      .card-item-first {
        padding-right: 20px;
      }

      .card-item-second {
        padding-left: 20px;
      }
      .card-item {
        .selected-card {
          border: 1px solid @primary-color;
        }
        .card-cover {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #eee;
          padding: 20px 0;

          svg {
            width: 150px;
            height: 150px;
          }
        }
      }
    }

    .ant-btn-primary {
      color: #fff;
      width: 200px;
    }
  }
}
</style>

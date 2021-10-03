<template>
  <a-row class="common-form-header">
    <a-col span="12">
      <a-space>
        <span class="back-icon">
          <a-icon type="left" />
        </span>
        <a-button class="nav-back-btn" type="link" @click="handleBack">{{ $t('teacher.add-lesson.back') }}</a-button>
        <span class="unit-last-change-time" v-if="lastChangeSavedTime">
          <span class="unit-nav-title">
            {{ form.name }}
          </span>
          <a-divider type="vertical" v-if="!!form.name" />
          {{ $t('teacher.add-lesson.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
        </span>
      </a-space>
    </a-col>
    <a-col span="12" class="unit-right-action">
      <a-space>
        <div class="collaborate-comment" @click="handleViewComment">
          <comment-icon class="active-icon"/>
        </div>
        <a-button
          @click="handleSave"
          :loading="saving"
          class="my-form-header-btn"
          style="{
            width: 120px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background: rgba(21, 195, 154, 0.08);
            border: 1px solid #15C39A;
            border-radius: 20px;
            padding: 15px 20px;
          }">
          <div class="btn-icon">
            <img src="~@/assets/icons/common/form/baocun@2x.png" />
          </div>
          <div class="btn-text">
            Save
          </div>
        </a-button>
        <a-button
          v-if="isOwner"
          :loading="publishing"
          class="my-form-header-btn"
          style="{
            width: 120px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
             background: rgba(21, 195, 154, 0.08);
            border: 1px solid #15C39A;
            border-radius: 20px;
            padding: 15px 20px;
          }"
          @click="handlePublish" >
          <div class="btn-icon">
            <img src="~@/assets/icons/common/form/fabu@2x.png" />
          </div>
          <div class="btn-text">
            Publish
          </div>
        </a-button>
        <a-button
          v-if="showCollaborate && isOwner"
          class="my-form-header-btn"
          style="{
            width: 120px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
              background: rgba(21, 195, 154, 0.08);
            border: 1px solid #15C39A;
            border-radius: 20px;
            padding: 15px 20px;
          }"
          @click="handleStartCollaborate">
          <div class="btn-icon">
            <img src="~@/assets/icons/common/form/fengxiang@2x.png" />
          </div>
          <div class="btn-text">
            Collaborate
          </div>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script>

import CommentIcon from '@/assets/icons/collaborate/comment.svg?inline'
export default {
  name: 'CommonFormHeader',
  components: {
    CommentIcon
  },
  props: {
    form: {
      type: Object,
      default: () => null
    },
    lastChangeSavedTime: {
      type: String,
      default: ''
    },
    showCollaborate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      publishing: false,
      saving: false
    }
  },
  computed: {
    isOwner () {
      return this.$store.getters.userInfo.email === this.form.createBy
    }
  },
  created () {
    this.$logger.info('form header name:' + this.form.name + ' lastChangeSavedTime:' + this.lastChangeSavedTime)
  },
  methods: {
    handleBack () {
      this.$logger.info('handleBack')
      this.$emit('back')
    },
    handleSave () {
      this.saving = true
      this.$logger.info('handleSave')
      this.$emit('save')
    },
    handlePublish () {
      this.publishing = true
      this.$logger.info('handlePublish')
      this.$emit('publish')
    },
    handleStartCollaborate () {
      this.$logger.info('handleStartCollaborate')
      this.$emit('collaborate')
    },

    handleViewComment () {
      this.$emit('view-collaborate')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.common-form-header {
  padding: 15px;
  background: #fff;
  z-index: 1000;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;

  .back-icon {
    color: rgba(24, 37, 82, 1);
  }
  .nav-back-btn {
    padding-left: 0;
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #15C39A;
  }

  .unit-nav-title {
    font-size: 15px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #182552;
  }

  .unit-last-change-time {
    line-height: 32px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #aaa;
    font-size: 13px;
  }

  .unit-right-action {
    display: flex;
    right: 10px;
    justify-content: flex-end;
    .my-form-header-btn{
    }

    .collaborate-comment {
      display: flex;
      cursor: pointer;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      svg {
        width: 30px;
      }
    }
  }
}

.btn-icon {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  img {
    height: 15px;
    width: 15px;
  }
}

.btn-text {
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
  padding-left: 5px;
}
</style>

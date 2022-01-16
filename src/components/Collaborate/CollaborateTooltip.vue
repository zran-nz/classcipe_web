<template>
  <div class="collaborate-tooltip" v-if="isShow">
    <div class="ant-tooltip ant-tooltip-placement-top">
      <div class="ant-tooltip-content">
        <div class="ant-tooltip-arrow"></div>
        <div role="tooltip" class="ant-tooltip-inner">
          {{ userNames }} are editing.
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { COLLABORATE } from '@/websocket/cmd'

export default {
  name: 'CollaborateTooltip',
  components: {

  },
  props: {
    formId: {
      type: String,
      default: null
    },
    fieldName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isShow: false,
      collaborateUserName: [],
      userNameList: [],
      durationTime: 20 * 1000
    }
  },
  watch: {
    // editUserList (value) {
    //   this.userNameList = value.map(value => {
    //     return value.nickname
    //   })
    // }
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.setShowFlag, 2000)
    })
  },
  computed: {
     userNames() {
       return this.collaborateUserName.join('、')
     }
  },
  methods: {
    setShowFlag() {
      // const cacheKey = COLLABORATE + '_' + this.formId + '_' + this.fieldName
      const collaborateMsg = this.$store.state.websocket.collaborateMsg
      if (collaborateMsg && collaborateMsg.content.id === this.formId &&
        collaborateMsg.content.fieldName === this.fieldName) {
        if (new Date().getTime() - collaborateMsg.timestamp > this.durationTime) {
          this.isShow = false
        } else {
          this.isShow = true
          // let historyUser = storage.get(cacheKey)
          // if (!historyUser) {
          //   historyUser = []
          // }
          // if (historyUser.indexOf(collaborateMsg.from.nickname) === -1) {
          //  historyUser.push(collaborateMsg.from.nickname)
          // }
          this.collaborateUserName = [collaborateMsg.from.nickname]
          // 缓存当前的编辑用户
          // storage.set(cacheKey, this.collaborateUserName, 2)
        }
      } else {
        this.isShow = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-tooltip{
  width: 100%;
  position: absolute;
  left:200px;
  /deep/ .ant-tooltip{
    z-index: 10;
  }
  /deep/ .ant-tooltip-inner{
    background-color: #15c39a;
    border-radius: 6px;
  }
  /deep/ .ant-tooltip-arrow::before{
    width: 8px;
    height: 8px;
    background-color: #15C39A;
  }
}

</style>

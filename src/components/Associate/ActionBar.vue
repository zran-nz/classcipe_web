<template>
  <div class="action-bar-wrapper">
    <div class="action-create" @click="handleCreateEvent" v-show="showCreate">
      <div class="action-icon">
        <img src="~@/assets/icons/common/sidebar/jianli_icon@2x.png" />
      </div>
      <div class="action-label">Create new under current current</div>
    </div>
    <div class="action-link" @click="handleLinkEvent">
      <div class="action-icon">
        <img src="~@/assets/icons/common/sidebar/jianli_icon@2x.png" />
      </div>
      <div class="action-label">Link in my content</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionBar',
  props: {
    showCreate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleLinkEvent () {
      this.$logger.info('handelLinkEvent')
      this.$emit('link')
    },

    handleCreateEvent () {
      this.$logger.info('handleCreateEvent')
      this.$emit('create')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.action-bar-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 0 10px;
  color: #fff;
.action-create {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
  background: rgba(255, 51, 85, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;

.action-icon {
img {
  height: 15px;
}
}

.action-label {
  font-size: 12px;
  padding-left: 8px;
}
}

.action-link {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
  background: rgba(21, 195, 154, 1);
  box-shadow:  0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;

.action-icon {
img {
  height: 15px;
}
}

.action-label {
  font-size: 12px;
  padding-left: 8px;
}
}

}
</style>

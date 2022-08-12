<template>
  <div class='create-new'>
    <a-dropdown>
      <a-menu slot="overlay" class='create-new-menu'>
        <a-menu-item>
          <a @click="handleImport('quick')">
            Quick session
          </a>
        </a-menu-item>
        <a-menu-item>
          <a @click="handleImport('unit')">
            {{ $t('menu.unit-plan') }}
          </a>
        </a-menu-item>
        <a-menu-item>
          <a @click="handleImport('task')">
            {{ $t('menu.task') }}
          </a>
        </a-menu-item>
      </a-menu>
      <a-button class='create-new-btn'>Add new <a-icon type="caret-down" :style="{color: '#4F4F4F'}"/>
      </a-button>
    </a-dropdown>

  </div>
</template>

<script>
export default {
  name: 'ClassCreateNew',
  data () {
    return {
      showImportContent: false
    }
  },
  methods: {
    handleImport (type) {
      this.$logger.info('handleImport', type)
      this.$emit('create', type)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.create-new-btn {
  border: 1px solid #D0D0D0;
  width: 130px;
  font-size: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  line-height: 38px;
  color: #4F4F4F;
  span {
    padding-right: 5px;
  }
}

.create-new-menu {
  a {
    font-family: Arial;
    font-weight: 400;
    color: #525252;
  }
}
</style>

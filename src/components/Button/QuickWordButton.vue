<template>
  <a-popover
    v-model="visible"
    trigger="click"
    :title="quickWord"
    placement="bottom"
    ref="popoverRef"
    :getPopupContainer="trigger => trigger.parentElement"
    @visibleChange="visibleChange">
    <div slot="content" class="quick-word">
      <div class="quick-word-title">
        Select an option or create one
      </div>
      <div class="quick-word-content" v-if="result && result.length > 0">
        <div class="quick-word-item" v-for="(item) in result" :key="'quickWord_'+item.id">
          <a @click="choose(item)">{{ item.name }}</a>
        </div>
      </div>
      <div v-else style="font-size: 12px;color:#999;">No data</div>
      <slot name='create'>
        <div class="quick-word-sub">
          <label>Create: </label>
          <a-input :size="size" v-model="selfWord"/>
          <a-icon @click="doCreate()" type="check" />
        </div>
      </slot>
    </div>
    <a-button :loading="loading" :type="type" :size="size">
      {{ text }}
    </a-button>
  </a-popover>
</template>

<script>
export default {
  name: 'QuickWordButton',
  props: {
    type: {
      type: String,
      default: 'danger'
    },
    text: {
      type: String,
      default: 'Command term'
    },
    size: {
      type: String,
      default: 'small'
    },
    quickWord: {
      type: String,
      default: ''
    },
    datas: {
      type: Array,
      default: () => []
    },
    loadApi: {
      type: Function,
      default: () => Promise.resolve()
    }
  },
  watch: {
    quickWord: {
      handler(val) {
        this.word = val
        this.selfWord = val
      },
      immediate: true
    },
    datas: {
      handler(val) {
        this.result = val
      },
      immediate: true
    }
  },
  data() {
    return {
      word: this.quickWord,
      result: [],
      loading: false,
      visible: false,
      selfWord: this.quickWord
    }
  },
  methods: {
    visibleChange(visible) {
      if (visible && this.datas.length === 0) {
        this.loading = true
        this.visible = false
        this.loadApi().then(res => {
          if (res.success) {
            this.result = res.data
          }
        }).finally(() => {
          this.loading = false
          this.visible = true
        })
      }
    },
    // 1440218576252366850
    choose(item) {
      this.visible = false
      this.$emit('sub', {
        word: item.name,
        parentId: item.bloomTagId,
        tag: item.bloomTag,
        id: item.id
      })
    },
    doCreate() {
      this.visible = false
      // 添加
      this.$emit('sub', {
        word: this.quickWord,
        parentId: '1440218576252366850',
        tag: 'Apply',
        id: -1
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-popover-inner-content {
  padding: 10px;
}
.quick-word {
  position: relative;
  width: 200px;
  .quick-word-title {
    line-height: 30px;
    color: #666;
  }
  .quick-word-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 150px;
    overflow: auto;
    .quick-word-item {
      line-height: 30px;
      height: 30px;
      background: #fff;
      display: flex;
      cursor: pointer;
      width: 100%;
      &:hover {
        background: #efefef;
      }
      a {
        flex: 1;
        text-indent: 10px;
      }
    }
  }
  .quick-word-sub {
    display: flex;
    align-items: center;
    margin-top: 10px;
    /deep/ .ant-input {
      border: none;
      &:focus {
        border: none!important;
        box-shadow: none !important;
      }
    }
    i {
      cursor: pointer;
    }
  }
}
</style>

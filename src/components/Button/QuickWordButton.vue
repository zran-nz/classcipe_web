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
      <div class="quick-word-content">
        <div class="quick-word-item" v-for="(item) in result" :key="'quickWord_'+item.id">
          <a @click="choose(item)">{{ item.name }}</a>
        </div>
      </div>
      <div class="quick-word-sub">
        <label>Create: </label>
        <a-input :size="size" v-model="selfWord"/>
        <a-icon @click="doCreate()" type="check" />
      </div>
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
    }
  },
  watch: {
    quickWord: {
      handler(val) {
        this.word = val
        this.selfWord = val
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
      if (visible) {
        this.loading = true
        this.visible = false
        Promise.resolve().then(res => {
          this.result = [{
            name: 'predict',
            id: 1
          }, {
            name: 'prefer',
            id: 2
          }, {
            name: 'perfect',
            id: 3
          }]
        }).finally(() => {
          this.loading = false
          this.visible = true
        })
      }
    },
    choose(item) {
      this.visible = false
      this.$emit('sub', {
        word: this.quickWord,
        parentId: '1440218576252366850',
        tag: 'Apply'
      })
    },
    doCreate() {
      this.$emit('sub', {
        word: this.quickWord,
        parentId: '1440218576252366850',
        tag: 'Apply'
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

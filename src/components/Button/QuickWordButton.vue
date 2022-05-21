<template>
  <div>
    <a-popover
      v-model="visible"
      trigger="click"
      placement="bottom"
      ref="popoverRef"
      :getPopupContainer="trigger => trigger.parentElement"
      @visibleChange="visibleChange">
      <div slot="title" class="quick-title">
        <a-input size="small" placeholder="Input keyword" @change="handleChange" v-model="word"></a-input>
      </div>
      <div slot="content" class="quick-word">
        <div class="quick-word-title" v-show="result && result.length > 0">
          Select an option
        </div>
        <a-spin :spinning="loading">
          <div
            class="quick-word-content"
            v-infinite-scroll="handleInfiniteOnLoad"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
            v-if="result && result.length > 0"
          >
            <div class="quick-word-item" v-for="(item) in result" :key="'quickWord_'+item.id">
              <a-tooltip :title="item.hint">
                <a @click="choose(item)">{{ item.name }}</a>
              </a-tooltip>
            </div>
          </div>
          <div v-else style="font-size: 12px;color:#999;">No relevant tag found</div>
        </a-spin>
        <slot name='create'>
          <div class="quick-word-sub">
            <label>Create: </label>
            <a-input :size="size" v-model="selfWord"/>
            <a-icon @click="doCreate()" type="check" />
          </div>
        </slot>
      </div>
      <a-button :type="type" :size="size">
        {{ text }}
      </a-button>
    </a-popover>
  </div>
</template>

<script>
// import infiniteScroll from 'vue-infinite-scroll'
import infiniteScroll from '@/core/directives/infiniteScroll'
const { debounce } = require('lodash-es')
export default {
  name: 'QuickWordButton',
  directives: { infiniteScroll },
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
    },
    dataCondition: {
      type: Object,
      default: null
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
        this.result = [...val]
      },
      immediate: true
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
  },
  data() {
    return {
      word: this.quickWord,
      result: [],
      loading: false,
      visible: true,
      selfWord: this.quickWord,
      busy: false
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      const res = await this.loadApi({
        keywords: this.word
      })
      if (res.success) {
        if (this.dataCondition) {
          this.result = res.result.filter(item => {
            let isTrue = true
            for (const key in this.dataCondition) {
              if (isTrue) {
                isTrue = (item[key] === this.dataCondition[key])
              }
            }
            return isTrue
          })
        } else {
          this.result = res.data
        }
      }
      this.loading = false
      return res
    },
    handleInfiniteOnLoad() {
      // console.log(111)
      // if (this.result.length > 0) {
      //   this.result.push({
      //     id: new Date().getTime(),
      //     name: 'tett'
      //   })
      // }
    },
    visibleChange(visible) {
      if (visible && this.datas.length === 0) {
        this.visible = false
        this.debounceLoad()
        this.visible = true
      }
    },
    handleChange() {
      this.selfWord = this.word
      this.$emit('changeWord', this.word)
      this.debounceLoad()
    },
    // 1440218576252366850
    choose(item) {
      this.visible = false
      this.$emit('sub', {
        word: item.name,
        parentId: item.bloomTagId,
        tag: item.bloomTag,
        bloomTag: item.bloomTag,
        knowledgeDimension: item.knowledgeDimension,
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
.quick-title {
  .ant-input {
    border: none;
    box-shadow: none;
    padding: 0;
  }
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
    height: 150px;
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
/deep/ .ant-btn-black {
  background: #484D53;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}
</style>

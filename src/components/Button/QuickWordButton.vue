<template>
  <div>
    <!-- // 改成modal -->
    <a-modal
      v-model='visible'
      destroyOnClose
      :title='null'
      :getPopupContainer="trigger => trigger.parentElement"
      width='300px'
      :footer='null'>
      <div>
        <div class="quick-title">
          <a-input size="small" placeholder="Input keyword" @change="handleChange" v-model="word"></a-input>
        </div>
        <div class="quick-word">
          <div class="quick-word-title" v-show="result && result.length > 0">
            Select an option
          </div>
          <a-spin :spinning="loading">
            <div
              class="quick-word-content"
              v-if="result && result.length > 0"
            >
              <div class="quick-word-item" v-for="(item) in result" :key="'quickWord_'+item">
                <a @click="choose(item)">{{ item }}</a>
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
      </div>
    </a-modal>

    <a-button @click="showModal" :type="type" :size="size">
      {{ text }}
    </a-button>
    <!-- <a-popover
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
            v-if="result && result.length > 0"
          >
            <div class="quick-word-item" v-for="(item) in result" :key="'quickWord_'+item">
              <a @click="choose(item)">{{ item }}</a>
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
    </a-popover> -->
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
    recommends: {
      type: Array,
      default: () => []
    },
    // 搜索接口api
    loadApi: {
      type: Function,
      default: () => Promise.resolve()
    },
    // 缓存接口
    cacheApi: {
      type: Function,
      default: () => Promise.resolve()
    },
    cacheKey: {
      type: String,
      default: ''
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
    },
    recommends: {
      handler(val) {
        this.recommendsRes = [...val]
        this.loadData()
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
      recommendsRes: [],
      loading: false,
      visible: false,
      selfWord: this.quickWord,
      busy: false
    }
  },
  methods: {
    // 1、这个是获取平台知识点标签，只要获取一次就缓存，不刷新页面不用重复获取
    // 2、关键词搜索优先过滤显示平台的标签数据，（这个时候不需要请求搜索接口）
    // 3、关键词过滤的数据少于3条的时候，才会调用搜索接口，把搜索结果追加到当前结果下
    // 4、关键词为空，有recommendsRes就显示recommendsRes否则显示pub
    async loadData() {
      this.loading = true
      const userId = this.$store.getters.userInfo.id
      if (this.cacheKey && this.cacheApi) {
        const cachedatas = sessionStorage.getItem(userId + this.cacheKey)
        if (cachedatas) {
          this.result = JSON.parse(cachedatas)
        } else {
          const cacheds = await this.cacheApi({})
          sessionStorage.setItem(userId + this.cacheKey, JSON.stringify(cacheds))
          this.result = cacheds
        }
      }
      if (!this.word) {
        this.result = this.recommendsRes.concat()
      }
      if (this.word || this.recommendsRes.length === 0) {
        this.result = this.result.filter(item => item.toLocaleLowerCase().indexOf(this.word.toLocaleLowerCase()) > -1)
        if (this.result.length < 4) {
          const res = await this.loadApi({
            key: this.word
          })
          this.result = this.result.concat(res)
        }
      } else {
        this.result = this.recommendsRes.concat()
      }
      this.loading = false
      return this.result
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
        word: item,
        // parentId: item.bloomTagId,
        // tag: item.bloomTag,
        // bloomTag: item.bloomTag,
        // knowledgeDimension: item.knowledgeDimension,
        id: item
      })
      this.word = ''
      this.selfWord = ''
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
      this.word = ''
      this.selfWord = ''
    },
    showModal() {
      this.visible = true
      // 父popover要隐藏
      this.$emit('close')
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
  width: 250px;
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

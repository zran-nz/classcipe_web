<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'

const logger = require('@/utils/logger')

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  watch: {
    value (val) {
      this.editorContent = val
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      console.info('edit init content:' + this.value)
      this.editor = new WEditor(this.$refs.editor)
      // this.editor.onchangeTimeout = 200
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }

      this.editor.customConfig.menus = [ // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'table', // 表格
        'undo', // 撤销
        'redo' // 重复
      ]
      this.editor.create()
      if (this.value) {
        this.editor.txt.html(this.value)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>

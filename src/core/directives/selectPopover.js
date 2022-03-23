import Vue from 'vue'

/**
 * selectPopover 权限指令
 * 指令用法：
 *  - 在需要选词弹出层的组件上使用 v-selectPopover:[domQuery, domFn] , 如下：
 *    <div v-selectPopover="['modal', domFn]" >我是被选中的词</div>
 *    <div v-clickOutside id="modal">我是弹出层</div>
 *    const domFn = (text) => {}
 *
 */
 const selectPopover = Vue.directive('selectPopover', {
  bind: function (el, binding, vnode) {
    const [domQuery, domFn] = binding.value
    if (domQuery) {
      let prevY = 0
      let prevX = 0
      let $timer = null
      const showModal = function(x, y, e) {
        clearTimeout($timer)
        let text = ''
        if (document.selection) {
          text = document.selection.createRange().text
        } else if (window.getSelection()) {
          text = window.getSelection()
        }
        text = text.toString().replace(/\n/g, '').trim()
        const $dom = document.getElementById(domQuery)
        if (text) {
          $dom.style.display = 'block'
          $dom.style.top = e.pageY - y + 10 + 'px'
          $dom.style.left = x + 'px'
          domFn && domFn(text)
        } else {
          $dom.style.display = 'none'
        }
      }
      el.onmousedown = e => {
        prevX = e.pageX
        prevY = e.pageY
        const $dom = document.getElementById(domQuery)
        $dom.style.display = 'none'
        el.onmouseup = (e) => {
          $dom.style.display = 'none'
          let currentY = e.pageY - prevY
          const currentX = Math.min(e.pageX, prevX)
          if (Math.abs(currentX) <= 5 && Math.abs(currentY) <= 5) {
            $timer && clearTimeout($timer)
          } else {
            currentY = currentY > 0 ? currentY : 0
            $timer && clearTimeout($timer)
            $timer = setTimeout(() => {
              showModal(currentX, currentY, e)
            }, 500)
          }
        }
      }
    } else {
      throw new Error(`请设置弹出层`)
    }
  }
})

export default selectPopover

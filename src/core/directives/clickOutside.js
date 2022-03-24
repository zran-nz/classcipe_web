import Vue from 'vue'

/**
 * clickOutside 点击组件外部指令
 * 指令用法：
 *  - 在需要点击组件外部的组件上使用 v-clickOutside:fn , 如下：
 *    <div v-clickOutside:fn >我是里面</div>
 *    const fn = (text) => {}
 *
 */
 const clickOutside = Vue.directive('clickOutside', {
  bind: function (el, binding, vnode) {
    const fn = binding.arg
    const stop = e => {
      e = e || window.event
      e.stopPropagation ? e.stopPropagation()
      : e.cancelBubble = true
    }
    document.addEventListener('click', e => {
      el.style.display = 'none'
      fn && fn()
    })
    el.addEventListener('click', e => {
      el.style.display = 'block'
      stop(e)
    })
  }
})

export default clickOutside

import Vue from 'vue'
import store from '@/store'

/**
 * hasRole 权限指令
 * 指令用法：
 *  - 在需要控制 角色 级别权限的组件上使用 v-hasRole:[role] , 如下：
 *    <i-button v-hasRole="['student']" >添加</a-button>
 *
 *  - 当前用户不属于指定角色时，组件上使用了该指令则会被隐藏
 */
const hasRole = Vue.directive('hasRole', {
  inserted: function (el, binding, vnode) {
    const { value } = binding
    const roles = store.getters && store.getters.roles
    const permissionId = value instanceof String && [value] || value

    if (permissionId.length > 0) {
      const hasRole = roles.some(role => {
        return permissionId.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
      }
    } else {
      throw new Error(`请设置角色权限标签值`)
    }
  }
})

export default hasRole

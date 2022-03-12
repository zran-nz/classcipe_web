<template>
  <div class="todo-list">
    <div class="todo-opt">
      <a-button type="primary" icon="plus" @click="addItem">Add Item</a-button>
    </div>
    <a-list :data-source="todos" class="todo-content" ref="todoList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="todo-item">
          <a-checkbox :disabled="item.isWriting" v-model="item.done" @change="e => changeItem(e, index)">
            <span :class="{'todo-done': item.status === TODO_STATUS.DONE}">{{ !item.isWriting ? item.items : '' }}</span>
          </a-checkbox>
          <a-input v-if="item.isWriting" v-model="item.items" @keyup.esc="delItem(index)" @keyup.enter="commitItem(index)"/>
          <a-button size="small" v-if="item.isWriting" icon="check" @click="commitItem(index)"/>
          <a-button size="small" icon="close" @click="delItem(index)"/>
        </div>
      </a-list-item>
    </a-list>
    <!-- <div class="todo-content">
      <draggable
        ref="todoList"
        tag="ul"
        v-model="todos"
        v-bind="customDragOptions"
        @start="customDrag = true"
        @end="customDrag = false"
      >
        <transition-group type="transition" :name="!customDrag ? 'flip-list' : null">
          <li class="todo-item" v-for="(item, index) in todos" :key="'todo_'+ index">
            <a-checkbox :disabled="item.isWriting" v-model="item.status" @change="e => changeItem(e, index)">
              <span :class="{'todo-done': item.status === TODO_STATUS.DONE}">{{ !item.isWriting ? item.items : '' }}</span>
            </a-checkbox>
            <a-input placeholder="Please enter something" v-if="item.isWriting" v-model="item.items" @keyup.esc="delItem(index)" @keyup.enter="commitItem(index)"/>
            <a-button size="small" v-if="item.isWriting" icon="check" @click="commitItem(index)"/>
            <a-button size="small" icon="close" @click="delItem(index)"/>
          </li>
        </transition-group>
      </draggable>
      <a-empty v-show="todos.length === 0"/>
    </div> -->
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { TODO_STATUS } from '@/const/common'
  export default {
    name: 'ToDoList',
    components: {
      draggable
    },
    props: {
      list: {
        type: Function,
        required: true
      },
      save: {
        type: Function,
        default: () => {}
      },
      todoDelete: {
        type: Function,
        default: () => {}
      },
      todo: {
        type: Function,
        default: () => {}
      },
      done: {
        type: Function,
        default: () => {}
      },
      classId: {
        type: [String, Number],
        default: null
      }
    },
    data() {
      return {
        TODO_STATUS: TODO_STATUS,
        todos: [],
        query: {
          keyword: '',
          classId: this.classId,
          pageNo: 1,
          pageSize: 1000
        },
        customDrag: false,
        customDragOptions: {
          animation: 200,
          group: 'custom',
          disabled: false,
          ghostClass: 'ghost'
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      justifyPromise(promise) {
        return (typeof promise === 'object' || typeof promise === 'function') && typeof promise.then === 'function'
      },
      init() {
        const promise = this.list(this.query)
        if (this.justifyPromise(promise)) {
          promise.then(res => {
            if (res.success) {
              this.todos = res.result.map(item => {
                return {
                  ...item,
                  done: item.status === TODO_STATUS.DONE
                }
              })
            }
          })
        }
      },
      addItem() {
        if (this.todos.length > 0 && this.todos[0].isWriting) return
        this.todos.unshift({
          items: '',
          status: TODO_STATUS.TODO,
          done: false,
          isWriting: true
        })
        this.$nextTick(() => {
          this.$refs.todoList.$el.getElementsByClassName('todo-item')[0].querySelector('.ant-input').focus()
        })
      },
      delItem(index) {
        const delItem = this.todos[index]
        if (delItem.id) {
          const promise = this.todoDelete({
            id: this.todos[index].id
          })
          if (this.justifyPromise(promise)) {
            promise.then(res => {
              if (res.success) {
                this.todos.splice(index, 1)
              }
            })
          } else {
            this.todos.splice(index, 1)
          }
        } else {
          this.todos.splice(index, 1)
        }
      },
      commitItem(index) {
        if (!this.todos[index].items) return
        const promise = this.save({
          items: this.todos[index].items,
          classId: this.classId
        })
        if (this.justifyPromise(promise)) {
          promise.then(res => {
            if (res.success) {
              this.todos[index].isWriting = false
              // 没有传id，重新加载
              this.init()
            }
          })
        } else {
          this.todos[index].isWriting = false
        }
      },
      changeItem(e, index) {
        let promise = null
        const id = this.todos[index].id
        if (e.target.checked) {
          promise = this.done({
            id: id
          })
        } else {
          promise = this.todo({
            id: id
          })
        }
        if (promise && this.justifyPromise(promise)) {
          promise.then(res => {
            if (res.success) {
              this.todos[index].status = e.target.checked ? TODO_STATUS.DONE : TODO_STATUS.TODO
            }
          })
        } else {
          this.todos[index].status = e.target.checked ? TODO_STATUS.DONE : TODO_STATUS.TODO
        }
      }
    }
  }
</script>

<style scoped lang="less">
/deep/ .ant-btn-sm{
  font-size: 12px;
}
.todo-list {
  position: relative;
  display: flex;
  flex-direction: column;
  .todo-opt {
    margin-bottom: 20px;
  }
  .todo-content {
    display: flex;
    flex-direction: column;
    padding: 0;
    .todo-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      height: 30px;
      line-height: 30px;
      // border-bottom: 1px solid #dfdfdf;
      // padding: 5px 0;
      .todo-done {
        text-decoration: line-through;
        color: #999;
      }
      & > button {
        margin-left: 10px;
      }
    }
  }
}
</style>

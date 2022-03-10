<template>
  <div class="todo-list">
    <div class="todo-opt">
      <a-button type="primary" icon="plus" @click="addItem">Add Item</a-button>
    </div>
    <!-- <a-list :data-source="todos" class="todo-content" ref="todoList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="todo-item">
          <a-checkbox v-model="item.done">
            <span :class="{'todo-done': item.done}">{{ !item.isWriting ? item.content : '' }}</span>
          </a-checkbox>
          <a-input v-if="item.isWriting" v-model="item.content" @keyup.enter="commitItem(index)"/>
          <a-button size="small" v-if="item.isWriting" icon="check" @click="commitItem(index)"/>
          <a-button size="small" icon="close" @click="delItem(index)"/>
        </div>
      </a-list-item>
    </a-list> -->
    <div class="todo-content">
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
            <a-checkbox v-model="item.done">
              <span :class="{'todo-done': item.done}">{{ !item.isWriting ? item.content : '' }}</span>
            </a-checkbox>
            <a-input placeholder="Please enter something" v-if="item.isWriting" v-model="item.content" @keyup.esc="delItem(index)" @keyup.enter="commitItem(index)"/>
            <a-button size="small" v-if="item.isWriting" icon="check" @click="commitItem(index)"/>
            <a-button size="small" icon="close" @click="delItem(index)"/>
          </li>
        </transition-group>
      </draggable>
      <a-empty v-show="todos.length === 0"/>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'ToDoList',
    components: {
      draggable
    },
    data() {
      return {
        todos: [],
        customDrag: false,
        customDragOptions: {
          animation: 200,
          group: 'custom',
          disabled: false,
          ghostClass: 'ghost'
        }
      }
    },
    methods: {
      addItem() {
        if (this.todos.length > 0 && this.todos[0].isWriting) return
        this.todos.unshift({
          content: '',
          done: false,
          isWriting: true
        })
        this.$nextTick(() => {
          this.$refs.todoList.$el.getElementsByClassName('todo-item')[0].querySelector('.ant-input').focus()
        })
      },
      delItem(index) {
        this.todos.splice(index, 1)
      },
      commitItem(index) {
        if (!this.todos[index].content) return
        this.todos[index].isWriting = false
      }
    }
  }
</script>

<style scoped lang="less">
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
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #dfdfdf;
      padding: 5px 0;
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

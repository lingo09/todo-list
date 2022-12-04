<template>
  <div>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <!-- 输入备忘，使用 v-model 绑定 newTodo -->
        <!-- 监听 keyup 事件，同时使用修饰器 .enter，按 Enter 键时事件才触发 -->
        <input
          class="new-todo"
          placeholder="你接下来要做什么?"
          v-model="newTodo"
          v-autofocus
          @keyup.enter="addTodo"
        />
      </header>
      <section class="main" v-show="$store.state.todos.length">
        <!-- <input class="toggle-all" type="checkbox" v-model="allDone"> -->
        <transition-group
          name="staggered-fade"
          tag="ul"
          v-bind:css="false"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:leave="leave"
          class="todo-list"
        >
          <!-- 查看所有备忘 -->
          <!-- v-for 遍历所有备忘，key 绑定备忘 id，class 绑定样式 -->
          <li
            v-for="todo in computedTodos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed }"
          >
            <!-- 使用 todo-item 组件 -->
            <!-- “双向绑定”备忘内容 title 和备忘已完成状态 completed -->
            <!-- 监听 delete 事件 -->
            <todo-item
              v-bind:title="todo.title"
              v-bind:completed="todo.completed"
              v-bind:id="todo.id"
              @confirm="confirmDialog(todo)"
            ></todo-item>
          </li>
        </transition-group>
        <footer class="footer" v-show="$store.state.todos.length">
          <span class="todo-count">
            <!-- remaining 计算剩余的未完成的数量，pluralize 用来过滤单位是否要负数 -->
            <strong>{{ remaining }}</strong> {{ pluralize }} left
          </span>
          <!-- 未完成，所有，已完成路由导航 -->
          <ul class="filters">
            <!-- exact 设置精确匹配，active-class 设置激活状态 -->
            <li>
              <router-link
                :to="{ query: { state: '' } }"
                active-class="selected"
                exact
                >All</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ query: { state: 'active' } }"
                active-class="selected"
                exact
                >Active</router-link
              >
            </li>
            <li>
              <router-link
                :to="{ query: { state: 'completed' } }"
                active-class="selected"
                exact
                >Completed</router-link
              >
            </li>
          </ul>

          <!-- 当有已完成的备忘时，一键移除已完成按钮出现 -->
          <button
            class="clear-completed"
            @click="removeCompleted"
            v-show="$store.state.todos.length > remaining"
          >
            Clear completed
          </button>
        </footer>
      </section>
    </section>
  </div>
</template>

<script>
import todoItem from "../components/todoItem";
// let id = 1;
export default {
  components: {
    todoItem,
  },
  data() {
    return {
      // 初始化的时候，获取下本地的缓存
      // todos: JSON.parse(localStorage.getItem("todos") || "[]"), // 所有的备忘
      newTodo: "", // 新增的备忘
      id: JSON.parse(localStorage.getItem("id") || 1),
    };
  },
  mounted() {},
  // 其他选项省略
  computed: {
    // 计算剩余未完成的备忘
    remaining() {
      // 过滤掉已完成的，获取数量
      // return this.todos.filter((x) => !x.completed).length;
      // vuex

      return this.$store.state.todos.filter((x) => !x.completed).length;
    },
    pluralize() {
      return this.remaining > 9 ? "items" : "item";
    },
    // 计算当前可见的备忘
    computedTodos() {
      // 组件内数据管理
      // 先过滤状态
      // this.$route 可以获取当前路由信息
      // const state = this.$route.query.state;
      // const filterTodos = this.todos.filter((x) => {
      //   if (state === "active") {
      //     return !x.completed;
      //   } else if (state === "completed") {
      //     return x.completed;
      //   } else {
      //     return true;
      //   }
      // });
      // 再过滤展示匹配的内容
      // return filterTodos.filter((item) => {
      //   return (
      //     item.title.toLowerCase().indexOf(this.newTodo.toLowerCase()) !== -1
      //   );
      // });

      // vuex管理数据
      this.$store.commit("computedTodos", {
        newTodo: this.newTodo,
        state: this.$route.query.state,
      });

      return this.$store.state.displayTodo;
    },
  },
  methods: {
    // 新增备忘
    addTodo() {
      // 内容为空则不处理
      if (!this.newTodo) {
        return;
      }
      // 往备忘列表中新增一条
      // 最后新增的备忘插在最前面，所以使用 unshift 而不是 push
      // this.todos.unshift({
      //   id: this.id++, // id 自增
      //   title: this.newTodo,
      //   completed: false,
      //   date: "",
      // });

      // 使用vuex管理todos
      this.$store.commit("addTodo", {
        id: this.id++, // id 自增
        title: this.newTodo,
        completed: false,
        date: "",
      });

      // 添加成功后，清空输入框，方便重新输入
      this.newTodo = "";
    },
    // 删除备忘
    confirmDialog(todo) {
      // 初始化弹窗
      // setDialog: {promise: new Promise(),resolve: ,reject: }
      this.$store.state.setDialog.promise = new Promise((resolve, reject) => {
        this.$store.state.setDialog.resolve = resolve;
        this.$store.state.setDialog.reject = reject;
      });

      this.$emit("addTip", "confirm-dialog");
      this.$store.state.setDialog.promise
        .then(() => {
          this.$store.commit("removeTodo", { todo });
          this.$emit("addTip", "");
          this.$store.state.setDialog = {};
        })
        .catch(() => {
          console.log("取消");
          this.$emit("addTip", "");
          this.$store.state.setDialog = {};
        });
    },
    // 删除已完成的备忘
    removeCompleted() {
      // this.todos = this.todos.filter((x) => !x.completed);

      // vuex
      this.$store.commit("removeCompleted");
    },
    // 进入中
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    // 此回调函数是可选项的设置
    // 与 CSS 结合时使用
    enter(el, done) {
      // 设置延时
      var delay = el.dataset.index * 150;
      setTimeout(function () {
        // 更新元素样式
        // eslint-disable-next-line
        Velocity(el, { opacity: 1, height: "58px" }, { complete: done });
      }, delay);
    },
    // 离开时
    // 此回调函数是可选项的设置
    // 与 CSS 结合时使用
    leave(el, done) {
      // 设置延时
      var delay = el.dataset.index * 150;
      setTimeout(function () {
        // 更新元素样式
        // eslint-disable-next-line
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    },
  },
  directives: {
    autofocus: {
      // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
      inserted: function (el) {
        // el: 指令所绑定的元素，可以用来直接操作 DOM
        el.focus();
      },
    },
  },
  watch: {
    // 侦听 todos 的变化
    // todos: {
    //   // 每次更新写入缓存
    //   handler(newVal) {
    //     this.$store.commit("loaclCacheTodos");
    //     // localStorage.setItem("todos", JSON.stringify(newVal));
    //   },
    //   deep: true,
    // },
    "$store.state.todos": {
      handler(newValue) {
        this.$store.commit("loaclCacheTodos", { newValue });
        // console.log("lala");
        // localStorage.setItem("todos", JSON.stringify(newValue));
      },
      deep: true,
    },
    id(newValue) {
      localStorage.setItem("id", JSON.stringify(newValue));
    },
  },
};
</script>
<style lang="less" scoped>
// .todoapp {
//   pointer-events: none;
// }
</style>

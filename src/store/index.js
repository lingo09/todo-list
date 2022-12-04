import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state() {
    return {
      todos: [],
      displayTodo: [],
      setDialog: {},
    };
  },
  getters: {},
  mutations: {
    addTodo(state, payload) {
      // 将新增备忘写入vuex的state中
      state.todos.unshift(payload);
    },
    loaclCacheTodos(state, payload) {
      console.log("todos修改了!");
      localStorage.setItem("todos", JSON.stringify(payload.newValue));
    },
    // 计算todos列表,分别展示不同的备忘内容,比如所有备忘,已完成备忘等
    computedTodos(state, payload) {
      const routerState = payload.state;
      const filterTodos = state.todos.filter((x) => {
        if (routerState === "active") {
          return !x.completed;
        } else if (routerState === "completed") {
          return x.completed;
        } else {
          return true;
        }
      });
      // 再过滤展示匹配的内容
      state.displayTodo = filterTodos.filter((item) => {
        return (
          item.title.toLowerCase().indexOf(payload.newTodo.toLowerCase()) !== -1
        );
      });
    },
    removeTodo(state, payload) {
      const index = state.todos.findIndex((x) => x.id === payload.todo.id);
      state.todos.splice(index, 1);
    },
    // 一键删除所有已完成备忘
    removeCompleted(state) {
      state.todos = state.todos.filter((x) => !x.completed);
    },
    // 确认备忘内容title修改
    doneEdit(state, payload) {
      state.todos.map((x) => {
        if (x.id == payload.id) {
          x.title = payload.title;
        }
        return x;
      });
    },
    // 更新勾选状态
    updateChecked(state, payload) {
      state.todos.map((x) => {
        if (x.id == payload.id) {
          x.completed = payload.completed;
        }
        return x;
      });
    },
  },
  actions: {
    // 防止刷新vuex数据更新,vuex数据初始化
    loadLocalCache({ state }) {
      const todos = localStorage.getItem("todos");
      if (todos) {
        state.todos = JSON.parse(todos);
        // state.displayTodo = state.todos;
      }
      // 初始化弹窗
      // setDialog: {promise: new Promise(),resolve: ,reject: }
      // state.setDialog.promise = new Promise((resolve, reject) => {
      //   state.setDialog.resolve = resolve;
      //   state.setDialog.reject = reject;
      // });
    },
    // 弹窗确认信息
    confirmState({ state }, payload) {
      // console.log(payload);
      if (payload.state) {
        state.setDialog.resolve("确认");
      } else {
        state.setDialog.reject("取消");
      }
    },
  },
  modules: {},
});

export default store;

export function setupStore() {
  store.dispatch("loadLocalCache");
}

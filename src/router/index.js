import Vue from "vue";
import VueRouter from "vue-router";
import write from "../views/write.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/write",
  },
  {
    path: "/write",
    name: "write",
    component: write,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

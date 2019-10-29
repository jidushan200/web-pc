import VueRouter from "vue-router";
import Vue from "vue";

import Login from "@/views/login";
import Home from "@/views/home";
import Welcome from "@/views/welcome";
import NotFound from "@/views/404";

import local from "@/utils/local";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // 登录
    { path: "/login", component: Login },
    // 首页
    {
      path: "/",
      component: Home,
      children: [
        // 欢迎
        { path: "/", component: Welcome }
      ]
    },
    // 匹配 不符合规则的路径
    { path: "*", component: NotFound }
  ]
});

// 添加路由的 导航守卫（前置导航守卫）
// 当每次跳转路由前触发
// to 跳转到目标 路由对象
// from 从哪里跳转过来  路由对象
// next 下一步方法  next()放行  next(‘/login’) 拦截
router.beforeEach((to, from, next) => {
  const user = local.getUser();
  if (user && user.token) {
    // 如果 res.data.data有值且res.data.data.token有值
    // 跳转
    next();
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;

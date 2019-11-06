import VueRouter from "vue-router";
import Vue from "vue";
// 登录页
import Login from "@/views/login";

// 主页面
import Home from "@/views/home"; //首页
import Welcome from "@/views/welcome"; //欢迎页
import Article from "@/views/article"; //内容管理
import Image from "@/views/image"; //素材管理
import Publish from "@/views/publish"; //发布文章
import Comment from "@/views/comment"; // 评论管理
import Setting from "@/views/setting"; // 个人设置
import Fans from "@/views/fans"; // 粉丝管理

// 404
import NotFound from "@/views/404"; //404页面

// 保存用户信息
import local from "@/utils/local";

// Vue配置路由组件
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
        { path: "/", component: Welcome },
        // 内容管理
        { path: "/article", component: Article },
        // 素材管理
        { path: "/image", component: Image },
        // 发布文章
        { path: "/publish", component: Publish },
        //评论管理
        { path: "/comment", component: Comment },
        //个人设置
        { path: "/setting", component: Setting },
        //粉丝管理设置
        { path: "/fans", component: Fans }
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

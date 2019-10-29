// 引入axios
import axios from "axios";
// 引入local——sessionStorage设置
import local from "@/utils/local";
// 引入vue-router
import router from "@/router";

// 编辑axios
// 基准地址
axios.defaults.baseURL = "http://ttapi.research.itcast.cn/mp/v1_0/";

// "请求" 拦截器
axios.interceptors.request.use(
  con => {
    const user = local.getUser() || {};
    con.headers.Authorization = `Bearer ${user.token}`;
    return con;
  },
  err => {
    return Promise.reject(err);
  }
);

// "响应" 拦截器
axios.interceptors.response.use(
  res => res,
  err => {
    // 当状态码为401时, 页面跳转到登录页面
    if (err.response.status === 401) {
      // 麻烦 window.location.href = 'http://localhost:8080/#/login'
      // 不推荐 window.location.hash = '#/login'
      // 用vue-router进行跳转
      return router.push("/login");
    }
    return Promise.reject(err);
  }
);

// 导出axios
export default axios;

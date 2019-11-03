// 模块导入
import axios from "axios"; // 引入axios
import local from "@/utils/local"; // 引入local——sessionStorage设置
import router from "@/router"; // 引入vue-router
import JSONBIG from "json-bigint";

// 编辑axios
// 基准地址
// 插件json-bigint转换json数据
axios.defaults.baseURL = "http://ttapi.research.itcast.cn/mp/v1_0/";
axios.defaults.transformResponse = [
  data => {
    // 对data格式转换
    // data就是json字符串
    try {
      return JSONBIG.parse(data);
    } catch (e) {
      return data;
    }
  }
];
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

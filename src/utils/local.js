// local用于存储用户信息api
const KEY = "web-pc-user-key";
const local = {
  // 存储
  setUser(user) {
    //   user转json
    const jsonstr = JSON.stringify(user);
    sessionStorage.setItem(KEY, jsonstr);
  },
  // 读取
  getUser() {
    //   通过KEY获取json字符串，再将json转为数组
    return JSON.parse(sessionStorage.getItem(KEY));
  },
  // 清除
  delUser() {
    sessionStorage.removeItem(KEY);
  }
};

export default local;

<template>
  <div class="container">
    <!-- 登录卡片 -->
    <el-card>
      <!-- logo -->
      <img src="../../assets/logo_index.png" width="200px" alt />
      <!-- 表单 -->
      <el-form
        ref="loginForm"
        status-icon
        :model="loginForm"
        :rules="Loginrules"
      >
        <el-form-item prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            style="width:235px;margin-right:10px"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary" style="width:100%"
            >立即登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import local from "@/utils/local";
export default {
  data() {
    // 自定义手机号检验函数
    const checkMobile = (rule, value, callback) => {
      // 利用正则表达式判断手机号
      // 第一位是1,第二位3-9,后接9个数字 ^代表开头 $代表结尾
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    };
    return {
      loginForm: {
        mobile: "16666666666",
        code: "246810"
      },
      Loginrules: {
        mobile: [
          // type: date|email|url  支持  不支持手机号
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "验证码6个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      // 整体检验
      // 获取表单组件实例 ---> 调用校验函数
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          // 当一段代码不能保证一定没有报错  try {} catch (e) {} 捕获异常处理异常
          // 校验手机号 验证码 登录 后台验证
          try {
            const {
              data: { data }
            } = await this.$http.post("authorizations", this.loginForm);
            local.setUser(data);
            this.$router.push("/");
          } catch (e) {
            this.$message({
              showClose: true,
              message: "实参值不对或形参名与api不匹配",
              type: "error"
            });
          }

          // this.$http.post("authorizations", this.loginForm).then(result => {
          //   local.setUser(result.data.data);
          //   this.$router.push("/");
          // });
        } else {
          this.$message({
            showClose: true,
            message: "实参值不对或形参名与api不匹配",
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
// 全屏容器
.container {
  width: 100%;
  height: 100%;
  // 背景尺寸 background-size 拆分写法
  // 组合写法 background:    / 背景尺寸(width,height) 简写 cover 铺面整个容器多余看不见  contain 等比例缩放完整的显示在容器内容
  background: url(../../assets/login_bg.jpg) no-repeat center / cover;
  position: absolute;
  left: 0;
  top: 0;
}
// 饿了么组件 el-card 组件名称  解析成HTML  后组件根元素上默认生成一个类和组件的名称一致
.el-card {
  width: 400px;
  height: 340px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  img {
    display: block;
    margin: 0 auto 30px;
  }
}
</style>

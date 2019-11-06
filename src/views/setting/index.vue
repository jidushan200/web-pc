<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form
            label-width="120px"
            ref="userInfo"
            :rules="rules"
            :model="userInfo"
          >
            <el-form-item label="编号：">1</el-form-item>
            <el-form-item label="手机：">13211121222</el-form-item>
            <el-form-item label="媒体名称：" prop="name">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：" prop="intro">
              <el-input
                v-model="userInfo.intro"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveuserinfo"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传 -->
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="uploadPhoto"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from "@/utils/local";
import eventBus from "@/eventBus";
export default {
  data() {
    return {
      userInfo: {
        id: null,
        name: null,
        intro: null,
        photo: null,
        email: null,
        mobile: null
      },
      imageUrl: null,
      // 验证
      rules: {
        name: [
          { required: true, message: "媒体名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "媒体介绍", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.getsetting();
  },
  methods: {
    async getsetting() {
      // result => {}
      // result.data.data => 包含id,name...等的对象
      const {
        data: { data }
      } = await this.$http.get("user/profile");
      this.userInfo = data;
    },
    // 上传图片
    async uploadPhoto({ file }) {
      // 向Formdata对象中加入photo属性
      const fm = new FormData();
      fm.append("photo", file);
      // 向user/photo发送patch请求，请求参数是formdata数据
      const {
        data: { data }
      } = await this.$http.patch("user/photo", fm);
      // 获取到的data赋值给userInfo
      this.userInfo.photo = data.photo;
      // 修改home组件数据
      eventBus.$emit("updatePhoto", data.photo);
      // 改动token数据
      const user = local.getUser();
      user.photo = data.photo;
      local.setUser(user);
    },
    // (除头像)基本信息上传
    async saveuserinfo() {
      // 获取用户基本数据(除头像)
      let { name, email, intro } = this.userInfo;
      const {
        data: { data }
      } = await this.$http.patch("user/profile", {
        name,
        email,
        intro
      });
      // 改home组件数据
      eventBus.$emit("updateName", name);
      // 改动token数据
      const user = local.getUser();
      user.name = data.name;
      local.setUser(user);
      // 提示
      this.$message.success("个人设置保存成功");
    }
  }
};
</script>

<style scoped lang="less"></style>

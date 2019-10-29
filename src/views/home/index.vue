<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside :width="isOpen ? '200px' : '64px'">
      <!-- logo -->
      <div class="logo" :class="{ smalllogo: !isOpen }"></div>
      <!-- 导航菜单容器 -->
      <!-- default-active="2" 默认激活哪个菜单项  default-active值 是菜单项的index属性的值 -->
      <!-- background-color="#545c64"  背景颜色-->
      <!-- text-color="#545c64"  文字默认颜色-->
      <!-- active-text-color="#545c64"  激活文字颜色-->
      <el-menu
        :collapse="!isOpen"
        :collapse-transition="false"
        default-active="/"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        router
      >
        <!-- el-submenu 拥有值二级菜单的菜单项目 el-menu-item 没有二级菜单的菜单项-->
        <!-- index作用  当前菜单唯一标识 -->
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text">江苏传智播客科技教育有限公司</span>
        <!-- 下拉菜单 -->
        <el-dropdown class="dropdown" @command="zhjclicks">
          <span class="el-dropdown-link">
            <img class="headIcon" src="./../../assets/avatar.jpg" alt />
            <span class="userName">用户名称</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting"
              >个人设置</el-dropdown-item
            >
            <el-dropdown-item icon="el-icon-unlock" command="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 主要内容 -->
      <el-main>
        <!-- 二级路由容器——根据二级路由path在容器渲染响应组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from "@/utils/local";
export default {
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    toggleMenu() {
      // 切换左菜单 展开与收起
      this.isOpen = !this.isOpen;
    },
    setting() {
      this.$router.push("/setting");
    },
    logout() {
      local.delUser();
      this.$router.push("/login");
    },
    zhjclicks(command) {
      this[command]();
    }
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url("../../assets/logo_admin.png") no-repeat center/
        140px auto;
    }
    .smalllogo {
      background-image: url("../../assets/logo_admin_01.png");
      background-size: 36px auto;
    }
  }
  .el-header {
    line-height: 60px;
    border-bottom: #ddd 1px solid;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      margin-left: 10px;
    }
    .dropdown {
      float: right;
      .headIcon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .userName {
        margin-left: 5px;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
}
</style>

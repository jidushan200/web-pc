<template>
  <div class="container-welcome">
    <img src="../../assets/welcome.jpg" alt />
  </div>
</template>

<script>
export default {
  created() {
    this.$http
      .get("http://ttapi.research.itcast.cn/mp/v1_0/articles")
      .then(res => {
        console.log(res.data);
      })
      .catch(() => {
        console.log("error");
      });
  }
};
</script>

<style scoped lang="less">
.container-welcome {
  // 改img
  img {
    margin: 0 auto;
    display: block;
    width: 458px;
    height: 457px;
  }
  //   // 加背景图
  //   background: url("../../assets/welcome.jpg") no-repeat center;
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  //   height: 100%;
}
</style>

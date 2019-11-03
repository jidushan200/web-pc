<template>
  <div class="container">
    <el-select :value="value" @change="fn" placeholder="请选择" clearable>
      <!-- 频道组件 -->
      <el-option
        v-for="item in channelOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      channelOptions: []
    };
  },
  created() {
    this.getChannelOptions();
  },
  methods: {
    // 获取频道选项数据
    async getChannelOptions() {
      // 与const data = await this.$http.get("channels").data.data;等价
      const {
        data: { data }
      } = await this.$http.get("channels");
      // 赋值频道下拉选项依赖数据
      this.channelOptions = data.channels;
    },
    // 值改变函数
    fn(channelId) {
      // 把数据提交给父组件
      if (!channelId) channelId = null;
      this.$emit("input", channelId);
    }
  }
};
</script>

<style scoped lang="less"></style>

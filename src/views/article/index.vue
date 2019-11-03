<!-- 筛选条件布局 -->
<template>
  <div class="container-article">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 频道组件 -->
          <!-- v-model的本质：绑定value属性，绑定input事件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <div class="block">
            <!-- daterange:日期范围 -->
            <el-date-picker
              v-model="dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <!-- 头部 -->
      <div slot="header">
        <span>根据筛选条件共查询到 {{ total }} 条结果</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 150px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="fill"
            >
              <div slot="error">
                <img
                  src="../../assets/error.gif"
                  alt
                  width="150"
                  height="100"
                />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success"
              >审核通过</el-tag
            >
            <el-tag v-if="scope.row.status === 3" type="warning"
              >审核失败</el-tag
            >
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" style="width:120px">
          <template slot-scope="scope">
            <el-button
              @click="toEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              plain
              circle
            ></el-button>
            <el-button
              @click="del(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              plain
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- current-change事件用于监听页面的改变 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :total="total"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
    <!-- 插槽使用 -->
    <!-- <page-one>
      <slot name="header"></slot>
      <slot name="footer"></slot>
    </page-one>-->
  </div>
</template>

<script>
// import PageOne from "@/test/page";
export default {
  // components: { PageOne },
  data() {
    return {
      reqParams: {
        status: null,
        channel_id: 2,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页码 与 每一页显示条数
        page: 1,
        per_page: 20
      },
      // 频道选项数据
      channelOptions: [],
      // 日期数组
      dateArr: [],
      // 文章列表
      articles: [],
      // 文章总条数
      total: 0
    };
  },
  created() {
    // this.getChannelOptions();
    this.getArticles();
  },
  methods: {
    // // 获取频道选项数据
    // async getChannelOptions() {
    //   // 与const data = await this.$http.get("channels").data.data;等价
    //   const {
    //     data: { data }
    //   } = await this.$http.get("channels");
    //   // 赋值频道下拉选项依赖数据
    //   this.channelOptions = data.channels;
    // },
    // 获取文章列表数据
    async getArticles() {
      // 第一种： axios.get(url?key=value&key1=vaule1&...) get传参
      // 第二种： axios.get(url, {params:参数对象})
      const {
        data: { data }
      } = await this.$http.get("articles", { params: this.reqParams });
      // 赋值文章列表依赖数据
      this.articles = data.results;
      // 赋值文章总条数依赖数据
      this.total = data.total_count;
    },
    // 分页功能
    pager(newPage) {
      // 根据新的页面和当前的筛选条件，重新查询数据即可
      this.reqParams.page = newPage;
      this.getArticles();
    },
    // 选择日期时触发的事件函数
    changeDate(dataArr) {
      // dateArr 的数据格式: [date,date]
      // 后端需要的是字符串格式：yyyy-MM-dd
      // 后端需要的数据类型为: [string,string]
      // 注意: 清除选择的日期后 dataArr的值要设为: null
      // dataArr没有值是,值并不是null，要人为设置成null
      if (dataArr) {
        this.reqParams.begin_pubdate = dataArr[0];
        this.reqParams.end_pubdate = dataArr[1];
      } else {
        this.reqParams.begin_pubdate = null;
        this.reqParams.begin_pubdate = null;
      }
    },
    // 筛选查询
    search() {
      // 准备日期数据
      // 进行数据获取
      // 如果频道的值 '' 时候 修改为 null
      if (!this.reqParams.channel_id) {
        // 空取反 => T
        this.reqParams.channel_id = null;
      }
      // 回到第一页
      this.reqParams.page = 1;
      this.getArticles();
    },
    // 编辑功能-根据scope提供的scope.row.id进行跳转操作
    toEdit(id) {
      // this.$router.push("/publish?id=" + id);
      // 为了方便传query,即 ? 后面的参数,一般采用下面的方式
      console.log(id);
      this.$router.push({ path: "/publish", query: { id } });
    },
    // 删除
    async del(id) {
      // 请求
      console.log(id);
      await this.$http.delete(`articles/${id}`);
      // await this.$http.delete({ path: `/articles/${id}` });
      // 提示
      this.$message.success("删除文章成功");
      // 更新列表
      this.getArticles();
      //   - 报错：Invalid article ，无效文章。
      //   - 原因：后台给的ID太大，js处理会有误差。
      //   - 计算时候有误差
      //       // Number.MAX_SAFE_INTEGER 最大安全数值  9007199254740991
      //       Number.MAX_SAFE_INTEGER + 2  // 9007199254740992
      //   - 转换成json有误差
      //       const jsonStr = '{"id":1189522840840306688}'
      //       JSON.parse(jsonStr) // {id: 1189522840840306700}
      // - 处理：
      //   - 转换的时候 Number 不支持 这么大数据
      //   - bigInt  数据类型，由插件提供  json-bigint 插件
      //   - 使用json-bigint转换json对象（默认是axios使用JSON.parse来转换）
      //     - 找到怎么自己转换格式
      //     - 使用插件转换
      //       // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
      //       transformResponse: [function (data) {
      //         // 对 data 进行任意转换处理
      //         return data;
      //       }],
    }
  }
};
</script>

<style scoped lang="less"></style>

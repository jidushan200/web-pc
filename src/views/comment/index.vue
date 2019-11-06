<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <div>
        <el-table
          stripe
          :data="articles"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column
            prop="title"
            label="标题"
            width="400"
            sortable
          ></el-table-column>
          <el-table-column
            prop="total_comment_count"
            label="总评论数"
          ></el-table-column>
          <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数"
          ></el-table-column>
          <el-table-column label="状态" :formatter="formatter">
            <template slot-scope="scope">{{
              scope.row.comment_status ? "正常" : "关闭"
            }}</template>
          </el-table-column>
          <el-table-column
            prop
            label="操作"
            width="120px"
            :formatter="formatter"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.comment_status"
                type="danger"
                size="small"
                @click="commentstatus(scope.row.id, false)"
                >关闭评论</el-button
              >
              <el-button
                v-else
                type="success"
                size="small"
                @click="commentstatus(scope.row.id, true)"
                >打开评论</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页功能 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getArticles();
    console.log(this.articles);
  },
  data() {
    return {
      articles: [],
      reqParams: {
        response_type: "comment",
        page: 1,
        per_page: 20
      },
      total: 0
    };
  },
  methods: {
    // 分页换页
    pager(newPage) {
      this.reqParams.page = newPage;
      this.getArticles();
    },
    // 获取文章(评论管理数据)
    async getArticles() {
      // 注意：文章列表但是需要包含  评论相关信息
      const {
        data: { data }
      } = await this.$http.get("articles", { params: this.reqParams });
      // 渲染
      this.articles = data.results;
      // 总条数
      this.total = data.total_count;
    },
    // 关闭评论/打开评论
    commentstatus(id, symbol) {
      const text = symbol
        ? `确认打开评论吗(・◇・)？`
        : `关闭评论权限吗(・◇・)？`;
      this.$confirm(text, `提示`, {
        confirmButtonText: `OK`,
        cancelButtonText: `Cancel`,
        type: `warning`
      })
        .then(async () => {
          // 修改文章评论状态
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${id}`, {
            allow_comment: symbol
          });
          // 提示
          this.$message.success(
            data.allow_comment ? `打开评论成功` : `关闭评论成功`
          );
          // 更新当前列表
          this.getArticles();
        })
        .catch(() => {});
    },
    // 排序
    formatter(row) {
      return row.address;
    }
  }
};
</script>

<style scoped lang="less"></style>

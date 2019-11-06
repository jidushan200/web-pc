<template>
  <div class="container-pubish">
    <el-card>
      <div slot="header">
        <my-bread>{{ this.articleForm.id ? "编辑" : "发布" }}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor
            v-model="articleForm.content"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group
            v-model="articleForm.cover.type"
            @change="articleForm.cover.images = []"
          >
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件 -->
          <div v-if="articleForm.cover.type === 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type === 3">
            <my-image
              v-for="i in 3"
              :key="i"
              v-model="articleForm.cover.images[i]"
            ></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>

        <el-form-item v-if="!this.articleForm.id">
          <el-button type="primary" @click="submitArticle(false)"
            >发表</el-button
          >
          <el-button @click="submitArticle(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="editArticle(false)">编辑</el-button>
          <el-button @click="editArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  created() {
    this.articleStatus();
  },
  watch: {
    "$route.query.id": function() {
      this.articleStatus();
    }
  },
  components: { quillEditor },
  data() {
    return {
      // 提交的数据
      articleForm: {
        id: null,
        title: null,
        channel_id: null,
        content: null,
        cover: {
          type: 1,
          // 数组长度 如果是单图为1  如果是三图为3
          images: []
        }
      },
      // 富文本配置对象
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], //superscript / subscript
            [({ indent: "-1" }, { indent: "+1" })], // outdent/indent
            [
              {
                direction: "rtl"
              }
            ], // text direction
            ["clean"],
            ["image"] // remove formattingbutton
          ]
        }
      }
    };
  },
  methods: {
    // 发表文章
    async submitArticle(draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm);
      this.$message({
        type: "",
        showClose: true,
        message: draft ? "存入草稿成功(∩_∩)" : "发表文章成功(∩_∩)"
      });
      this.$router.push("/article");
    },
    // 修改文章
    async editArticle(draft) {
      // 点击存入草稿
      await this.$http.put(
        `articles/${this.articleForm.id}?draft=${draft}`,
        this.articleForm
      );
      this.$message({
        type: "",
        showClose: true,
        message: draft ? "存入草稿成功(#^.^#)" : "修改文章成功(#^.^#)"
      });
      this.$router.push("/article");
    },
    // 获取指定文章("articles/:target")-target是文章id
    async getArticles(id) {
      this.articleForm = (await this.$http.get(`articles/${id}`)).data.data;
    },
    // 根据文章状态进行相关操作
    articleStatus() {
      // 判断是否是编辑状态
      const articleId = this.$route.query.id;
      if (articleId) {
        this.getArticles(articleId);
      } else {
        this.articleForm = {
          id: null,
          title: null,
          channel_id: null,
          content: null,
          cover: {
            type: 1,
            // 数组长度 如果是单图为1  如果是三图为3
            images: []
          }
        };
      }
    }
  }
};
</script>

<style scoped lang="less"></style>

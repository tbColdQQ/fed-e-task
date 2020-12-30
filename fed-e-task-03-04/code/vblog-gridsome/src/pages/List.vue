<template>
  <Layout>
    <div style="min-height: 600px" v-loading="loading">
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-input
          placeholder="请输入关键字"
          v-model="searchKey"
          clearable
          style="width: 300px"
        ></el-input>
        <el-button
          @click="search"
          icon="el-icon-search"
          style="margin-left: 10px"
          circle
          plain
        ></el-button>
        <el-button
          @click="share(0)"
          style="margin-left: 10px"
          icon="el-icon-share"
          type="warning"
          plain
          circle
        ></el-button>
        <!-- <el-button
          type="primary"
          icon="el-icon-edit"
          round
          plain
          style="float: right"
          @click="goAdd"
          >写博文</el-button
        > -->
      </el-card>

      <div v-if="blogs && blogs.length > 0">
        <el-card
          shadow="hover"
          v-for="(item, index) in blogs"
          :key="'p' + index"
          style="margin-bottom: 20px"
        >
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <a
                    style="text-decoration: none; cursor: pointer"
                    @click="goDetails(item.node.id)"
                  >
                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;
                    {{ item.node.title }}
                  </a>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">
                  <el-button
                    @click="share(item.node.id)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-share"
                  ></el-button>
                  <!-- <el-button
                  @click="editBlog(index)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-edit"
                  v-if="token"
                ></el-button>
                <el-button
                  @click="deleteBlog(index)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-delete"
                  v-if="token"
                ></el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
            最近更新 {{ item.node.updated_at }}
          </div>
          <div
            style="
              font-size: 1.1rem;
              line-height: 1.5;
              color: #303133;
              padding: 10px 0px 0px 0px;
            "
          >
            {{ item.node.description }}
          </div>
        </el-card>
        <div style="text-align: center">
          <el-pagination
            @current-change="list"
            background
            layout="prev, pager, next"
            :current-page.sync="query.page"
            :page-size="query.pageSize"
            :total="totalCount"
          >
          </el-pagination>
        </div>
      </div>

      <el-card
        shadow="never"
        style="
          margin-bottom: 20px;
          padding: 20px 0px 20px 0px;
          text-align: center;
        "
        v-if="!blogs || blogs.length == 0"
      >
        <font style="font-size: 30px; color: #dddddd">
          <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
  query {
    list: allStrapiBlog (page: 1, perPage: 5, sortBy: "id", order: DESC) {
      edges {
        node {
          id,
          title,
          content,
          updated_at,
          description,
          categories {
            id,
            name,
            code
          }
        }
      }
    },
    total: allStrapiBlog {
      totalCount
    },
    allAuthor {
      edges {
        node {
          avatar_url,
          login,
          html_url,
          public_repos,
          followers,
          following
        }
      }
    }
  }
</page-query>

<script>
import axios from 'axios'
export default {
  name: "ListPage",
  data() {
    return {
      query: {
        page: 1,
        pageSize: 5
      },
      loading: false,
      searchKey: "",
      blogs: [],
      totalCount: 0,
      token: "",
    };
  },
  mounted() {
    this.blogs = this.$page.list.edges
    this.totalCount = this.$page.total.totalCount
    // console.log('mounted--->', this)
  },
  methods: {
    async search() {
      const totalData = await this.$axios.get('/blogs?title_contains=' + this.searchKey)
      const data = await this.$axios.get('/blogs?_sort=id:DESC&title_contains=' + this.searchKey + '&_start=0&_limit=' + this.query.pageSize)
      this.totalCount = totalData.data.length
      let arr = []
      data.data.forEach(item => {
        arr.push({node: item})
      })
      // console.log('search--->', arr)
      this.blogs = arr
    },
    share(message) {
      if (!message) {
        message = window.location.href
      } else {
        message = window.location.origin + '/blog/' + message
      }
      if (this.copy(message)) {
        this.$confirm('链接已复制,去分享给好友吧!!', '分享', {
          showCancelButton: false,
          showClose: false,
          type: 'success'
        })
      } else {
        this.$confirm('链接复制失败,可能因为浏览器不兼容', '分享', {
          showCancelButton: false,
          showClose: false,
          type: 'warning'
        })
      }
    },
    goAdd() {},
    async list() {
      let start = (this.query.page - 1) * this.query.pageSize
      const data = await this.$axios.get('/blogs?_start=' + start + '&_limit=' + this.query.pageSize + '&_sort=id:DESC&title_contains=' + this.searchKey)
      let arr = []
      data.data.forEach(item => {
        arr.push({node: item})
      })
      // console.log('search--->', arr)
      this.blogs = arr
    },
    goDetails(id) {
      window.location.href = '/blog/' + id
    },
    copy(message) {
      let doc = document.createElement("input")
      doc.value = message
      document.body.appendChild(doc)
      doc.select()
      let status
      try {
        status = document.execCommand('copy')
      } catch (e) { }
      document.body.removeChild(doc)
      return status
    }
  },
};
</script>

<style>
</style>
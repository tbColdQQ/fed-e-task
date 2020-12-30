<template>
  <Layout>
    <div style="min-height: 600px" v-loading="loading">
      <el-card shadow="never" style="margin-bottom: 20px">
        <el-input
          placeholder="请输入关键字"
          v-model="searchKey"
          clearable
          style="width: 300px; display: none;"
        ></el-input>
        <el-button
          @click="search"
          icon="el-icon-search"
          style="margin-left: 10px; display: none;"
          circle
          plain
        ></el-button>
        <el-button
          @click="share(0)"
          icon="el-icon-share"
          type="warning"
          style="margin-left: 10px"
          plain
          circle
        ></el-button>
      </el-card>

      <div v-if="projects && projects.length > 0">
        <el-card
          shadow="hover"
          v-for="(item, index) in projects"
          :key="'pro' + index"
          style="margin-bottom: 20px"
        >
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <a
                    style="text-decoration:none;cursor:pointer"
                    @click="goDetails(item.node.id)"
                  >
                    <i class="el-icon-service"></i>&nbsp;&nbsp; {{ item.node.name }}
                  </a>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right;">
                  <el-button
                    @click="goGithub(item.node.html_url)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-back"
                    >前往GitHub</el-button
                  >
                  <el-button
                    @click="share(item.node.html_url)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-share"
                  ></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
            最近更新 {{ item.node.updated_at }}
          </div>
          <div
            style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px"
          >
            {{ item.node.description }}
          </div>
          <div
            style="font-size: 1.1rem;color: #303133;padding: 10px 0px 0px 0px"
          >
            <el-row>
              <el-col :span="16" style="padding-top: 5px">
                <el-tooltip
                  effect="dark"
                  :content="'star ' + item.node.stargazers_count"
                  placement="bottom"
                >
                  <i
                    class="el-icon-star-off"
                    style="margin: 0px 5px 0px 0px"
                  ></i>
                </el-tooltip>
                {{ item.node.stargazers_count }}
                <el-tooltip
                  effect="dark"
                  :content="'watch ' + item.node.watchers_count"
                  placement="bottom"
                >
                  <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{ item.node.watchers_count }}
                <el-tooltip
                  effect="dark"
                  :content="'fork ' + item.node.forks_count"
                  placement="bottom"
                >
                  <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
                </el-tooltip>
                {{ item.node.forks_count }}
              </el-col>
              <el-col :span="8" style="text-align: right;">
                <el-tag size="small" type="danger" v-if="item.node.license">{{
                  item.node.license.name
                }}</el-tag>
                <el-tag size="small" type="success">{{ item.node.language }}</el-tag>
              </el-col>
            </el-row>
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
        style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center"
        v-if="!projects || projects.length == 0"
      >
        <font style="font-size: 30px;color:#dddddd ">
          <b>还没有开源项目 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
  query {
    list: allRepo (page: 1, perPage: 5, sortBy: "id", order: DESC) {
      edges {
        node {
          id,
					name,
					full_name,
					private,
					html_url,
					forks_count,
					watchers_count,
					description,
					license {
					name
					},
					updated_at,
					stargazers_count,
					language
        }
      }
    },
    total: allRepo {
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
export default {
  name: "ProjectPage",
  data() {
    return {
      query: {
        page: 1,
        pageSize: 5,
      },
      loading: false,
      searchKey: "",
      projects: [],
      totalCount: 0,
      token: "",
    };
  },
  mounted() {
    this.projects = this.$page.list.edges;
    this.totalCount = this.$page.total.totalCount;
  },
  methods: {
    async list() {
      const data = await this.$axios.get('https://api.github.com/users/tbColdQQ/repos?per_page=5&page=' + this.query.page + '&q=' + encodeURIComponent(this.searchKey + ' in:name+user:tbColdQQ'))
      let arr = []
      data.data.forEach(item => {
        arr.push({node: item})
      })
      this.projects = arr
    },
    async search() {
			const data = await this.$axios.get('https://api.github.com/users/tbColdQQ/repos?per_page=5&page=' + this.query.page + '&q=' + encodeURIComponent(this.searchKey + ' in:name+user:tbColdQQ'))
      const totalData = await this.$axios.get('https://api.github.com/users/tbColdQQ/repos?q=' + encodeURIComponent(this.searchKey + ' in:name+user:tbColdQQ'))
      this.totalCount = totalData.data.length
      let arr = []
      data.data.forEach(item => {
        arr.push({node: item})
      })
      // console.log('search--->', arr)
      this.projects = arr
		},
    goDetails(id) {
			window.location.href = '/repo/' + id
		},
    goGithub(url) {
			window.location.href = url
		},
		share(message) {
      if (!message) {
        message = window.location.href
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

<style></style>

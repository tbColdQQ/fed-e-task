<template>
  <Layout>
    <el-card
      shadow="never"
      style="min-height: 400px; margin-bottom: 20px; padding: 0px 0px 20px 0px"
    >
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane
          :label="'粉丝 ' + followersTotal"
          name="followers"
          style="padding: 5px"
        >
          <div v-loading="followers.loading">
            <div v-if="followers.list.length">
              <el-row style="min-height: 200px">
                <el-col
                  :span="8"
                  v-for="(item, index) in followers.list"
                  :key="'followers' + index"
                  style="padding: 10px"
                >
                  <el-card
                    shadow="hover"
                    style="font-size: 13px; color: #606266; line-height: 20px"
                  >
                    <i class="el-icon-star-off"></i>&emsp;
                    <a
                      @click="geDetail(item.node.login)"
                      style="text-decoration: none; cursor: pointer"
                      >{{ item.node.login }}</a
                    >
                    <br />
                    <i class="el-icon-message"></i>&emsp;
                    <a
                      :href="item.node.html_url"
                      target="_blank"
                      style="text-decoration: none; cursor: pointer"
                      >TA的主页</a
                    >
                    <br />
                    <img
                      :src="item.node.avatar_url"
                      style="width: 100%; border-radius: 5px; margin-top: 5px"
                    />
                  </el-card>
                </el-col>
              </el-row>
              <div style="text-align: center; margin-top: 10px">
                <el-pagination
                  @current-change="onSelect"
                  background
                  layout="prev, pager, next"
                  :current-page.sync="followers.query.page"
                  :page-size="followers.query.pageSize"
                  :total="followersTotal"
                >
                </el-pagination>
              </div>
            </div>
            <div
              style="
                min-height: 300px;
                margin-bottom: 20px;
                padding: 20px 0px 20px 0px;
                text-align: center;
              "
              v-else
            >
              <font style="font-size: 30px; color: #dddddd">
                <b>(￢_￢) 没有一个粉丝</b>
              </font>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="'关注 ' + followingTotal"
          name="following"
          style="padding: 5px"
        >
          <div v-loading="following.loading">
            <div v-if="following.list.length">
              <el-row style="min-height: 200px">
                <el-col
                  :span="8"
                  v-for="(item, index) in following.list"
                  :key="'following' + index"
                  style="padding: 10px"
                >
                  <el-card
                    shadow="hover"
                    style="font-size: 13px; color: #606266; line-height: 20px"
                  >
                    <i class="el-icon-star-off"></i>&emsp;
                    <a
                      @click="goDetail(item.node.login)"
                      style="text-decoration: none; cursor: pointer"
                      >{{ item.node.login }}</a
                    >
                    <br />
                    <i class="el-icon-message"></i>&emsp;
                    <a
                      :href="item.node.html_url"
                      target="_blank"
                      style="text-decoration: none; cursor: pointer"
                      >TA的主页</a
                    >
                    <br />
                    <img
                      :src="item.node.avatar_url"
                      style="width: 100%; border-radius: 5px; margin-top: 5px"
                    />
                  </el-card>
                </el-col>
              </el-row>
              <div style="text-align: center; margin-top: 10px">
                <el-pagination
                  @current-change="onSelect"
                  background
                  layout="prev, pager, next"
                  :current-page.sync="following.query.page"
                  :page-size="following.query.pageSize"
                  :total="followingTotal"
                >
                </el-pagination>
              </div>
            </div>
            <div
              style="
                min-height: 300px;
                margin-bottom: 20px;
                padding: 20px 0px 20px 0px;
                text-align: center;
              "
              v-else
            >
              <font style="font-size: 30px; color: #dddddd">
                <b>(￢_￢) 还没有关注一个人</b>
              </font>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </Layout>
</template>
<page-query>
query {
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
  },
  allFollower (page: 1, perPage: 5, sortBy: "id", order: DESC) {
    edges {
      node {
        id,
        login,
        avatar_url,
        html_url
      }
    }
  },
  allFollowing (page: 1, perPage: 5, sortBy: "id", order: DESC) {
    edges {
      node {
        id,
        login,
        avatar_url,
        html_url
      }
    }
  }
}
</page-query>
<script>
export default {
  name: 'CyclePage',
  data() {
    return {
      activeTab: 'followers',
      followers: {
        query: {
          page: 1,
          pageSize: 9,
          pageNumber: 1
        },
        loading: false,
        list: []
      },
      following: {
        query: {
          page: 1,
          pageSize: 9,
          pageNumber: 1
        },
        loading: false,
        list: []
      },
      githubUsername: '',
      followersTotal: 0,
      followingTotal: 0
    }
  },
  mounted() {
    this.followersTotal = this.$page.allAuthor.edges[0].node.followers
    this.followingTotal = this.$page.allAuthor.edges[0].node.following
    this.gethubUsername = this.$page.allAuthor.edges[0].node.login
    if(this.$page.allAuthor.edges[0].node.followers > 0) {
      this.followers.list = this.$page.allFollower.edges
    }
    if(this.$page.allAuthor.edges[0].node.following > 0) {
      this.following.list = this.$page.allFollowing.edges
    }
  },
  methods: {
    goDetail(name) {
      window.location.href = `/author?name=${name}`
    },
    async onSelect() {
      if(this.activeTab == 'followers') {
        const data = await this.$axios.get('https://api.github.com/users/tbColdQQ/followers?per_page=9&page=' + this.followers.query.page)
        let arr = []
        data.data.forEach(item => {
          arr.push({node: item})
        })
        this.followers.list = arr
      }else {
        const data = await this.$axios.get('https://api.github.com/users/tbColdQQ/following?per_page=9&page=' + this.following.query.page)
        let arr = []
        data.data.forEach(item => {
          arr.push({node: item})
        })
        this.following.list = arr
      }
    }
  }
};
</script>

<style>
</style>
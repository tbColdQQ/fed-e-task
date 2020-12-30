<template>
  <Layout>
    <div style="min-height: 600px" v-loading="loading">
      <el-card shadow="never" style="min-height: 400px">
        <div slot="header">
          <el-row>
            <el-col :span="12">
              <span>{{ $page.repo.name }}</span>
            </el-col>
            <el-col :span="12">
              <div style="text-align: right;">
                <el-button
                  @click="share()"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-share"
                  >分享</el-button
                >
                <el-button
                  @click="goGithub($page.repo.html_url)"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-back"
                  >前往GitHub</el-button
                >
                <el-button
                  @click="more"
                  style="padding: 3px 0"
                  type="text"
                  icon="el-icon-more-outline"
                  >更多项目</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
          发布 {{ $page.repo.created_at }} <br />
          更新 {{ $page.repo.updated_at }}
        </div>
        <div
          style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 20px 0px 0px 0px"
        >
          {{ $page.repo.description }}
        </div>
        <div
          style="font-size: 1.1rem;color: #303133;padding: 15px 0px 15px 0px;border-bottom: 1px solid #E4E7ED;"
        >
          <el-row>
            <el-col :span="16" style="padding-top: 5px">
              <el-tooltip
                effect="dark"
                :content="'star ' + $page.repo.stargazers_count"
                placement="bottom"
              >
                <i class="el-icon-star-off" style="margin: 0px 5px 0px 0px"></i>
              </el-tooltip>
              {{ $page.repo.stargazers_count }}
              <el-tooltip
                effect="dark"
                :content="'watch ' + $page.repo.watchers_count"
                placement="bottom"
              >
                <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
              </el-tooltip>
              {{ $page.repo.watchers_count }}
              <el-tooltip
                effect="dark"
                :content="'fork ' + $page.repo.forks_count"
                placement="bottom"
              >
                <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
              </el-tooltip>
              {{ $page.repo.forks_count }}
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-tag size="small" type="danger" v-if="$page.repo.license">{{
                $page.repo.license.name
              }}</el-tag>
              <el-tag size="small" type="success">{{
                $page.repo.language
              }}</el-tag>
            </el-col>
          </el-row>
        </div>
        <div
          v-html="$page.repo.name"
          v-if="$page.repo.name"
          class="markdown-body"
          style="padding-top: 20px"
        ></div>
        <div
          v-if="!$page.repo.name"
          style="padding: 20px 0px 20px 0px;text-align: center"
        >
          <font style="font-size: 30px;color:#dddddd ">
            <b>还没有介绍 (╯°Д°)╯︵ ┻━┻</b>
          </font>
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($id: ID!) {
	repo (id: $id) {
		id,
    name,
    html_url,
    created_at,
    updated_at,
    description,
    stargazers_count,
    watchers_count,
    forks_count,
    license {
      name
    },
    language
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
	data() {
		return {
			loading: false,
			token: ''
		}
	},
	mounted() {},
	methods: {
		goGithub(url) {
			window.open(url)
    },
    more() {

    },
		share() {
			if (this.copy(window.location.href)) {
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
	}
};
</script>

<style></style>

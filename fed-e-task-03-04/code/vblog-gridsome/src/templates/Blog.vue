<template>
  <Layout>
    <h2 class="title">{{ $page.strapiBlog.title }}</h2>
    <div>发布时间: {{ $page.strapiBlog.published_at }}</div>
    <div>更新时间: {{ $page.strapiBlog.updated_at }}</div>
    <el-divider></el-divider>
    <div v-html="mdToHtml($page.strapiBlog.content)"></div>
  </Layout>
</template>

<page-query>
query ($id: ID) {
	strapiBlog (id: $id) {
		id,
		title,
		content,
		description,
		categories {
			id,
			name,
			code
		},
		updated_at
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
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
export default {
	mounted() {
		console.log(this.$page)
	},
	methods: {
    mdToHtml (text) {
      return md.render(text)
    }
  }
};
</script>

<style></style>

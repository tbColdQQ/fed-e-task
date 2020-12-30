<template>
  <Layout>
    <h2 class="title">{{$page.list.edges[0].node.title}}</h2>
    <div>发布时间: {{$page.list.edges[0].node.published_at}}</div>
    <div>更新时间: {{$page.list.edges[0].node.updated_at}}</div>
    <el-divider></el-divider>
    <div v-html="mdToHtml($page.list.edges[0].node.content)"></div>
  </Layout>
</template>

<page-query>
  query {
    list: allStrapiBlog {
      edges {
        node {
          id,
          title,
          content,
          published_at,
          updated_at,
          categories {
            id,
            name,
            code
          }
        }
      }
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
  },
  }
</page-query>

<script>
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
export default {
  name: 'IndexPage',
  methods: {
    mdToHtml (text) {
      return md.render(text)
    }
  }
}
</script>

<style>

</style>
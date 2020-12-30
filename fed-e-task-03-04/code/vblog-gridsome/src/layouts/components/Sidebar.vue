<template>
  <div>
    <el-card shadow="never">
      <el-menu :default-active="active" @select="onSelect">
        <el-menu-item
          v-for="item in constantRouterMap"
          v-if="
            item.meta &&
              item.meta.type == 'user' &&
              (token || !item.meta.LoginRequired) &&
              (!mini || !item.meta.mini)
          "
          :key="item.path"
          :index="item.path"
        >
          <i :class="item.meta.icon"></i>
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px;text-align: center;display: none;">
      <div
        v-if="!token"
        style="font-size: 0.9rem;line-height: 1.5;color: #606c71;"
      >
        <el-tag type="danger" size="small">&nbsp;</el-tag>&nbsp;&nbsp;
        Token未绑定&nbsp;&nbsp;
        <!-- <el-button type="text" @click="openTokenDialog">绑定</el-button> -->
      </div>
      <div
        v-if="token"
        style="font-size: 0.9rem;line-height: 1.5;color: #303133;"
      >
        <el-tag type="success" size="small">&nbsp;</el-tag>&nbsp;&nbsp;
        Token已绑定&nbsp;&nbsp;
        <el-button type="text" @click="cancellation">注销</el-button>
      </div>
      <div style="margin-top: 10px;text-align: left">
        <el-alert
          title="Token获取"
          type="info"
          description="在 github-> settings-> developerSettings-> personalAccessTokens 勾选gist权限,获取Token. 详情参考README.md"
          :closable="false"
        >
        </el-alert>
      </div>
    </el-card>
    <!-- <token-dialog ref="tokenDialog"></token-dialog> -->
  </div>
</template>

<script>
import IndexPage from '~/pages/Index.vue'
import CyclePage from '~/pages/Cycle.vue'
import ListPage from '~/pages/List.vue'
import ProjectPage from '~/pages/Project.vue'
export default {
  data() {
    return {
			active: '',
			token: '',
			mini: '',
      constantRouterMap: [
				{
					path: '/',
					redirect: '/',
					component: IndexPage,
					meta: {
						type: "user",
						icon: 'el-icon-star-off',
						title: '最新动态'
					},
					children: []
				},
				{
					path: '/cycle',
					redirect: '/cycle',
					component: CyclePage,
					meta: {
						type: "user",
						icon: 'el-icon-mobile-phone',
            title: '社交圈'
					},
					children: []
				},
				{
					path: '/list',
					redirect: '/list',
					component: ListPage,
					meta: {
						type: "user",
						icon: 'el-icon-edit-outline',
            title: '博客列表'
					},
					children: []
				},
				{
					path: '/project',
					redirect: '/project',
					component: ProjectPage,
					meta: {
						type: "user",
						icon: 'el-icon-service',
            title: '开源项目'
					},
					children: []
				}
			],
    };
	},
	methods: {
		onSelect(index) {
			console.log(this.constantRouterMap, index)
			window.location.href = index
		}
  },
  mounted() {
    let arr = this.$route.path.split("/")
    this.active = "/" + arr[1]
    // console.log('arr--->', arr)
  }
};
</script>

<style></style>

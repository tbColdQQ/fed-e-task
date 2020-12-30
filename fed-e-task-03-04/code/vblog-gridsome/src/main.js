// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import ElementUI from 'element-ui'
import axios from 'axios'
import DefaultLayout from '~/layouts/Default.vue'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.baseURL = 'http://qm.tbcold.com:1337'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.use(ElementUI)
  Vue.prototype.$axios = axios
  Vue.component('Layout', DefaultLayout)
}

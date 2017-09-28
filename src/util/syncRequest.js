import Vue from 'vue'
import VueResource from 'vue-resource'
import { TOKEN } from '../configs/request'

Vue.use(VueResource)
Vue.http.headers.common['x-access-token'] = TOKEN

export default {

  init (params) {
    if (!params.url) {
      throw new Error('the lack of url of request')
    }
  },

  post: async function (params) { // eslint-disable-line
    this.init(params) // eslint-disable-line
    return await Vue.http.post(params.url, params.data || {})
  },

  get: async function (params) { // eslint-disable-line
    this.init(params)
    return await Vue.http.get(params.url, params.data || {}) // eslint-disable-line
  }
}

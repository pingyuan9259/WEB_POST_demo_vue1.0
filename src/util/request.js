import axios from 'axios'
import moment from 'moment'
import cookie from './cookie'
import { WEB_HOST } from '../configs/page'
import { APP_KEY, APP_ENV_DEV, APP_HOST, APP_ID } from '../configs/app'
import APP_MAP from '../configs/appMap'
import { PREFIX, APP_TOKEN_KEY } from '../configs/request'
window.singleLogining = false
export default {

  init (params) {
    if (!params.url) {
      throw new Error('the lack of url of request')
      return
    }
    axios.defaults.headers.common['x-access-token'] = cookie.getCookie(APP_TOKEN_KEY)
    axios.defaults.headers.common['x-app-id'] = APP_ID
  },

  checkLogin (data) {
    if (data && +data.need_login !== 1 && +data.need_login !== 2) {
      return
    }
    if (data && +data.need_login === 2 && !window.singleLogining) {
      window.singleLogining = true
      const loginDatetime = moment(data.login_date).format('YYYY-MM-DD HH:mm:ss')
      window.alert(`你的新生大学账号于 ${loginDatetime} 在其他设备上登录。如果这不是你的操作，你的账号密码可能已经泄露。请尽快通过APP登录新生大学账号进行密码修改，或者通过APP直接重设密码。`)
    }
    const address_login = WEB_HOST + '/'
    cookie.delCookie(APP_TOKEN_KEY, '/', 'xinshengdaxue.com') // 强制清除cookie中失效的token
    // location.href = address_login + '#post_login' // 让web站强制登出跳到登陆页，登录完毕以后自动跳回公众后台，＊现在单独登录了＊
    window.location.reload() // 失去登录态后刷新＊现在单独登录了＊
  },

  logError (type, params, error) {
    if (APP_ENV_DEV) {
      return
    }

    window.bughd && console && console.error && setTimeout(() => {
      const LS_NAME = 'fengkou-post-userName'
      const LS_NAMEID = 'fengkou-post-userId'

      window.bughd('user', {
        name: localStorage.getItem(LS_NAME),
        id: localStorage.getItem(LS_NAMEID)
      })
      console.error('error', 'request error', {
        type: type,
        appName: APP_MAP[APP_KEY].name,
        params: params,
        error: error
      })
    }, 1000)
  },

  post (params, baseUrl) {
    this.init(params)
    let url = PREFIX + params.url
    let self = this
    if (baseUrl) {
      url = params.url
    }
    return axios({
      method: 'post',
      url: url,
      data: params.data,
      headers: {
        'Content-Type': params.contentType
      }
    }).then((res) => {
      let data = res.data
      if (+data.code !== 1) {
        self.checkLogin(data)
        self.logError('get', params, res)
      }
      return data
    }).catch((error) => {
      self.logError(error.data, params.url, 'post')
    })
  },

  get (params, baseUrl) {
    this.init(params)
    let url = PREFIX + params.url
    let self = this
    if (baseUrl) {
      url = params.url
    }
    return axios({
      method: 'get',
      url: url
    }).then((res) => {
      let data = res.data
      if (+data.code !== 1) {
        self.checkLogin(data)
        self.logError('get', params, res)
      }
      return data
    }).catch((error) => {
      self.logError(error.data, params.url, 'get')
    })
  }
}

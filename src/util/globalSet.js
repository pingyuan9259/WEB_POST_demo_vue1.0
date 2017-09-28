import Vue from 'vue'
import $ from 'jquery'
import outdatedBrowserRework from '../widgets/outdatedBrowserRework/'
import { TOKEN } from '../configs/request'
import { APP_ID } from '../configs/app'

export default {
  init () {
    this.checkBrowser()
    this.setToken()
  },

  checkBrowser () {
    outdatedBrowserRework({
      browserSupport: {
        'Chrome': 37, // Includes Chrome for mobile devices
        'IE': 10,
        'Safari': 7,
        'Mobile Safari': 7,
        'Firefox': 32
      },
      language: 'cn'
    })
  },

  setToken () {
    Vue.http.headers.common['x-access-token'] = TOKEN
    Vue.http.headers.common['x-app-id'] = APP_ID
    $.ajaxSetup({
      beforeSend: function (xhr) {
        xhr.setRequestHeader('x-access-token', TOKEN)
        xhr.setRequestHeader('x-app-id', APP_ID)
      }
    })
  }
}

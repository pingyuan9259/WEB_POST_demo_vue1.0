import Vue from 'vue'
import moment from 'moment'

export default function () {
  Vue.filter('dateLimit', (value) => {
    if (!value) {
      return value
    }
    return value.substr(0, 10)
  })
  Vue.filter('default', (value, newValue) => {
    return value === '' ? newValue : value
  })
  Vue.filter('dateFormat', (value, format) => {
    return moment(value).format(format)
  })
  Vue.filter('https', (value) => {
    if (!value) {
      return value
    }
    let res = value.match(/^(?:[^\/]*)\/\/(.+)/)
    res = res ? ('//' + res[1]) : ''
    return res
  })
  Vue.filter('substring', (value, num) => {
    if (!value) {
      return
    }
    if (num && value.length > num) {
      return value.substring(0, num) + '...'
    } else {
      return value
    }
  })
}

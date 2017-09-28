import APP_MAP from './appMap'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port

// 初始变量
let APP_KEY = ''
let APP_ID = ''
let APP_LOGO = ''
let APP_ICO = ''
let APP_HOST = ''
let APP_IS_LOCAL = port ? true : false

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^\.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]
const _hostInfo = host.split('.') // 得到该结构：["****-dev", "tinfinite", "com:8080"]
const APP_ENV = _hostInfo[0].split('-')[1] ? _hostInfo[0].split('-')[1] : 'pro'

// for host
APP_HOST = TOP_LEVEL_HOST

// for app key
APP_KEY = TOP_LEVEL_HOST.split('.')[0]

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  throw new Error('url is wrong!')
} else {
  APP_ID = APP_MAP[APP_KEY].appId
  APP_LOGO = APP_MAP[APP_KEY].logo
  APP_ICO = APP_MAP[APP_KEY].ico
}

export { APP_HOST, APP_IS_LOCAL, APP_ID, APP_LOGO, APP_ICO, APP_KEY, APP_ENV, TOP_LEVEL_HOST }

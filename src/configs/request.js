import cookie from '../util/cookie'
import { APP_ENV, APP_KEY } from './app'

let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV

const DOMAIN = APP_KEY === 'xinshengdaxue' ? 'tinfinite' : 'sudoboot'
const FILE_KEY = 'article'
const APP_TOKEN_KEY = (APP_ENV === 'pro') ? '_app_token' : '_app_token' + '_' + SUFFIX
const TOKEN = cookie.getCookie(APP_TOKEN_KEY)
const PREFIX = (APP_ENV === 'pro') ? `//bbs-api.${DOMAIN}.com` : `//bbs-api-${SUFFIX}.${DOMAIN}.com`

export {
  FILE_KEY,
  APP_TOKEN_KEY,
  TOKEN,
  PREFIX
}

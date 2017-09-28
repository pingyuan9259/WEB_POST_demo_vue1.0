import { APP_HOST, APP_IS_LOCAL, APP_ENV } from './app'

let m_host = '' // m详情 host
let h5_host = '' // h5详情 host
let im_host = '' // web站 host

let domain = APP_ENV === 'pro' ? '' : '-' + APP_ENV

if (APP_IS_LOCAL) { // 本地服务
  m_host = `//m${domain}.local.${APP_HOST}:8080`
  h5_host = `//h5${domain}.local.${APP_HOST}:3333`
  im_host = `//web${domain}.local.${APP_HOST}:3000`
} else {
  m_host = `//m${domain}.${APP_HOST}`
  h5_host = `//h5${domain}.${APP_HOST}`
  im_host = `//web${domain}.${APP_HOST}`
}

export const DIGEST_LEN = '54' // 摘要长度
export const DETAIL_HOST = m_host
export const WEB_HOST = im_host
export const H5_HOST = h5_host

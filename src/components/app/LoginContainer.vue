<template>
  <div class="login-container">
    <login
      :app-id="appId"
      :prefix="prefix"
      :login-success="loginSuccess"
    ></login>
  </div>
</template>

<script>
  import { APP_ID, APP_ENV } from '../../configs/app'
  import Login from 'yauoi-login1.x'
  import 'yauoi-login1.x/lib/styles/index.css'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    data () {
      return {
        appId: APP_ID,
        prefix: `https://api-saas${ENV}.tinfinite.com`,
        loginSuccess: () => {
          window.location.reload()
        }
      }
    },
    components: { Login }
  }
</script>

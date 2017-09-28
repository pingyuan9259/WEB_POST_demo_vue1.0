<style lang='sass'>
	@import '../../styles/components/layout/header';
  .box-user {
    position: relative;
  }
  .logout-btn {
    position: absolute;
    z-index: 100;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #eeeeee;
    background: #ffffff;
    color: #000000;
    font-size: 14px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
  }
</style>

<template>
	<div class='header'>
		<a href='/postList'>
      <img class='logo' :src='appLogo | https' alt=''>
			<span class='app-name'>写作平台</span>
		</a>
    <div class='right-con box-user' @click="showLogout">
      <img class='avater' id='userAvatar' src='../../public/imgs/default-user-avatar.png' alt=''>
      <a href='javascript:void(0)' class='user-name'>{{ userName }}
        <span class="caret"></span>
        <span class='not-verify' v-if='showGotoVerify'>（未认证）</span>
      </a>
      <div class="logout-btn" v-show="showOut">
        <a href="#" @click="logout">退&nbsp;出</a>
      </div>
    </div>
	</div>
</template>

<script>
  import { APP_KEY, TOP_LEVEL_HOST, APP_ENV } from '../../configs/app'
  import cookie from '../../util/cookie'
  import APP_MAP from '../../configs/appMap'
  import $ from 'jquery'

  export default {
    data () {
      return {
        userName: '',
        userAvatar: '',
        showOut: false,
        appLogo: APP_MAP[APP_KEY]['headerLogo'],
        showGotoVerify: false
      }
    },
    methods: {
      logout () {
        let env = APP_ENV === 'pro' ? '' : '_' + APP_ENV
        let token = '_app_token' + env
        cookie.delCookie(token, '/', TOP_LEVEL_HOST)
        // window.history.go(0)
        window.location.reload()
      },
      showLogout () {
        if (!this.showOut) {
          this.showOut = true
        } else {
          this.showOut = false
        }
      }
    },
    ready () {
      const LS_NAME = 'fengkou-post-userName'
      const LS_AVATAR = 'fengkou-post-userAvatar'
      const LS_VERIFY = 'fengkou-post-userVerify'

      this.userName = localStorage.getItem(LS_NAME)

      let userVerify = localStorage.getItem(LS_VERIFY)
      let avatar = localStorage.getItem(LS_AVATAR)
      if (avatar !== 'undefined') {
        this.userAvatar = avatar + '?imageMogr2/thumbnail/60x'
        $('#userAvatar').attr('src', this.userAvatar)
      }
      if (!userVerify) {
        this.showGotoVerify = true
      }
    }
  }
</script>

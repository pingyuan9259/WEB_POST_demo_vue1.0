<style lang='sass'>
  @import './styles/base/reset';
  @import './styles/libs/outdateBrowser/index';
</style>

<template>
  <app-main v-if='showManage'></app-main>
  <app-edit v-if='showEdit'></app-edit>
  <app-comment-list-post v-if='showComment'></app-comment-list-post>
  <app-no-member v-if='showMember'
  :status.sync="verifyStatus"
  :member.sync="member"></app-no-member>
  <login-container v-if="!isLogin"></login-container>
</template>

<script>
  import AppMain from './components/app/Main'
  import AppEdit from './components/app/Edit'
  import AppNoMember from './components/app/noMember'
  import LoginContainer from './components/app/LoginContainer'
  import Request from './util/request'
  import globalSet from './util/globalSet'
  import { APP_KEY, APP_ENV } from './configs/app'
  import { TOKEN } from './configs/request'
  import AppMap from './configs/appMap'
  import Cookie from './util/cookie'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV
  export default {
    data () {
      return {
        showManage: false,
        showDetail: false,
        showEdit: false,
        showComment: false,
        showMember: false,
        verifyStatus: 0,
        member: '',
        App: AppMap[APP_KEY],
        isLogin: false
      }
    },
    components: { AppMain, AppEdit, AppNoMember, LoginContainer },
    created () {
      if (TOKEN) {
        this.isLogin = true
        this.isMember(this.appLoad)
      }
      globalSet.init()
    },
    ready () {
      this.removeLoading()
    },
    methods: {
      appLoad () {
        // 根据 router 中 path 的命名来区分展示不同 content
        // 注意：不同 content 切换，必须使用location.href
        let path = this.$route.path.toLocaleLowerCase()
        this.showEdit = (path.indexOf('edit') !== -1)
        this.showComment = (path.indexOf('listpost') !== -1)
        this.showManage = !(this.showEdit || this.showComment) // 添加其他页面，直接括号中加 || xxxShow
      },
      isMember (callback) {
        let userId = Cookie.getCookie(APP_ENV === 'pro' ? '_user_id' : '_user_id_' + APP_ENV)
        if (!userId) this.isLogin = false
        let self = this
        Request.get({
          url: `//api-saas${ENV}.tinfinite.com/v3/user/detail/new?id=${userId}`
        }, true).then((res) => {
          if (res.code !== 1) {
            return
          }
          let member = res.result.is_member
          self.member = res.result.is_member
          let admin = res.result.is_admin || 0
          self.verifyStatus = res.result.verify_status || 0
          if (self.App.isXSDX && !member) {
            self.showMember = true
          } else if (!self.App.isXSDX && !admin) {
            self.showMember = true
          } else if (self.App.isXSDX && member && res.result.verify_status !== 1) {
            self.showMember = true
          }else {
            const LS_NAME = 'fengkou-post-userName'
            const LS_AVATAR = 'fengkou-post-userAvatar'
            const LS_NAMEID = 'fengkou-post-userId'
            const LS_VERIFY = 'fengkou-post-userVerify'
            localStorage.setItem(LS_NAME, res.result.fullname)
            localStorage.setItem(LS_AVATAR, res.result.avatar)
            localStorage.setItem(LS_NAMEID, res.result.id)
            localStorage.setItem(LS_VERIFY, res.result.verify_status || '')
            localStorage.setItem('is_admin', admin)
            callback()
          }
        })
      },
      removeLoading () { //  移除初始化loading
        let loading = document.getElementById('loading-container')
        loading.style.display = 'none'
      }
    }
  }
</script>

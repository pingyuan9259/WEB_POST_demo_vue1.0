<style lang='sass'>
  @import '../../styles/components/page/publish';
</style>

<template>
  <div class='publish-con'>
    <div class='publish-head'>
      <span class='head-tip'>{{ headTip || '写文章' }}</span>
      <span class='head-tip head-warn-link'>插入链接只支持https协议，请确认插入链接是否支持此协议！</span>
      <div class="btn-group toggle-editor" role="group"><button type="button" class="btn btn-default btn-group-xs normal active" @click="richEditor">普通编辑器</button><button type="button" class="btn btn-default btn-group-xs mkdn" @click="mkdnEditor">md编辑器</button></div>
    </div>
    <div class='publish-content'>
    <div class='publish-title-con'>
      <input class='publish-title' v-model='title' v-on:keyup='checkTitle(checkSave)' type='text' placeholder='请在这里输入标题' maxlength='64'>
      <div class="alert alert-info alert-dismissible error-tip" role="alert" v-show='titleTipShow'>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <span class="glyphicon glyphicon-exclamation-sign error-icon" aria-hidden="true"></span>
         标题不能为空
      </div>
    </div>
    <hr>
    <editor
    :sign.sync="sign"
    :html.sync="html"></editor>
    <div class="alert alert-info alert-dismissible error-tip content-tip" role="alert" v-show='contentTipShow'>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <span class="glyphicon glyphicon-exclamation-sign error-icon" aria-hidden="true"></span>
       正文不能为空
    </div>
    <div class='publish-others'>
      <div class='edit-con'>
        <!-- <div class='edit-style'>发布样式编辑</div> -->
        <div class='edit-desc'>封面<span>必填，大图片建议尺寸：900像素＊500像素</span></div>
        <div class='edit-upload'>
          <a class='upload-btn' href="javascript:void(0)">本地上传
            <upload-file :url='uploadUrl'></upload-file>
          </a>
          <div class="alert alert-info alert-dismissible cover-tip error-tip" role="alert" v-show='coverTipShow'>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="glyphicon glyphicon-exclamation-sign error-icon" aria-hidden="true"></span>
             必须上传封面
          </div>
          <div v-show='coverloadShow'>
            <div class='cover-loading-con'>
              <img class='cover-loading' src='../../public/imgs/loading.gif' alt=''>
            </div>
          </div>
          <div v-show='coverViewShow'>
            <div class='cover-view'>
              <img :src='(coverSrc + "?imageMogr2/thumbnail/x70") | https' alt=''> <a href='javascript:void(0)' class='cover-cancel' @click='showCover = coverViewShow = false'>取消</a>
            </div>
          </div>
        </div>
        <div class='channel-con'>
          <div class='channel-tip'>
            将文章发表在
            <auto-complete :items.sync='bbsList' :edit-data.sync='editData'></auto-complete>
          </div>
          
        </div>
        <div class='digest-con'>
          <div class='digest-tip'>摘要<span>选填，如果不填写会默认抓取正文前54个字</span></div>
          <textarea name='digest' class='digest-content' maxlength='120' @keyup='checkFontCount(checkSave(content))' v-model='content'></textarea>
          <div class='digest-length-con'>
            <span class='digest-length'><span class='word-count'>{{ wordCount }}</span>/120</span>
          </div>
        </div>
      </div>
    </div>
    <div class='btns-con'>
      <!-- <div class="radio_con" v-if="isAdmin">
        <div class="classification" :class='{"active": isOperate}' @click='tabOperate'>
          <i></i>
          <span>发布为运营文章</span>
        </div>
      </div> -->

      <div class="btns">
        <span class='edit-state' v-show='showEditState'>已保存至草稿箱</span>
        <div class='handle-height'><span @click='toggleHeight'><i class='handle-icon'></i>{{ handleHeightTxt }}</span></div>
        <button
        id="postSaveBtn"
        class='post-save'
        @click='savePost(false)'>
        保存{{editData && '并退出'}}</button>
        <button class='post-preview' @click='openPreview'>预览</button>
        <button
        id="postPublishBtn"
        class='post-publish'
        v-bind:class="{ 'disabled': isVerify}" @click='publishPost($event)'>发布{{editData && '并退出'}}</button>
      </div>

      <!-- <div class="btns" v-else>
        <div class='handle-height'><span @click='toggleHeight'><i class='handle-icon'></i>{{ handleHeightTxt }}</span></div>
        <button
        id="postSaveBtn"
        class='post-save'
        @click='cancel'>取消编辑</button>
        <button class='post-preview' @click='openPreview'>预览</button>
        <button
        id="postPublishBtn"
        class='post-publish'
        v-bind:class="{ 'disabled': isVerify}" @click='publishPost($event)'>修改并覆盖</button>
      </div> -->
      <div class="verify-tip" v-show='isVerify'>未认证用户无法发布文章，请到 APP 个人中心进行「实名认证」</div>
    </div>
  </div>

  <preview :show.sync='showModal' :data.sync='previewData'></preview>
  <div class='save-success' v-show='showSaveSuccess'>{{ saveSuccessText }}</div>

</template>


<script>
  import $ from 'jquery'
  import moment from 'moment'
  import MarkdownIt from 'zjx-markdown-it'
  import mdExpand from '../../widgets/mdExpand'
  import mdVideo from '../../widgets/mdVideo'
  import Editor from '../module/Editor'
  import Preview from '../module/Preview'
  import AutoComplete from '../module/AutoComplete'
  import UploadFile from '../module/UploadFile'
  import Request from '../../util/request'
  import ImgLoad from '../../util/imgLoad'
  import hljs from 'highlight.js'
  import { APP_ENV } from '../../configs/app'
  import qs from 'qs'
  
  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    props: {
      headTip: {
        type: String
      },
      editData: {
        type: Object,
        twoWay: true
      }
    },
    data () {
      return {
        overStatus: true,   // 封面上传是否完成
        title: '',             // 标题
        author: $('.user-name').text(), // 作者
        html: '',              // 正文
        content: '',     // 摘要
        coverSrc: '',          // 封面
        showModal: false,      // 是否展示预览图
        isAdmin: false,        // 是否为管理员
        titleTipShow: false,   // 标题错误提示
        contentTipShow: false, // 正文错误提示
        coverTipShow: false,   // 封面错误提示
        coverViewShow: false,  // 封面预览展示
        wordCount: 0,          // 摘要文字数
        checkStatus: false,    // 验证状态
        showEditState: false,  // 自动保存状态
        runEnv: false,         // 是否电脑端环境
        isOperate: false,      // 是否为运营文章
        handleHeightTxt: '收起正文',
        saveSuccessText: '',
        previewData: {         // 预览数据
          title: '',
          author: '',
          digest: '',
          date: '',
          content: ''
        },
        uploadUrl: `//api-saas${ENV}.tinfinite.com/v3/upload/picture`,
        showSaveSuccess: false,
        coverloadShow: false,
        bbsList: [],
        bbsId: '',
        isVerify: false,
        timer: null,            // 定时器
        lastSaveValue: '',      // 上次保存的输入框中的值
        sign: '',              // 编辑器模式标识
        adminUpdate: false     // 管理员修改已发布文章
      }
    },
    components: { Editor, Preview, UploadFile, AutoComplete },
    watch: {
      sign () {
        if (this.sign === 'rich') {
          $('.normal').addClass('active')
          $('.mkdn').removeClass('active')
        } else if (this.sign === 'mkdn') {
          $('.mkdn').addClass('active')
          $('.normal').removeClass('active')
        }
      },
      editData () {
        let d = this.editData
        this.bbsId = d.bbsId
        this.editPostId = d.id
        this.title = d.title
        if (d.html) {
          let hideMark = d.html.substr(d.html.indexOf('<pry'), d.html.indexOf('</pry>'))
          this.sign = d.html.substr(this.html.length - 12, 4)
          this.html = d.html.replace(hideMark, '').replace(/(<p><br><\/p>)*$/g, '')
        }
        if (d.content) {
          this.content = d.content
          this.wordCount = d.content.length
        }
        if (d.imageContents && d.imageContents.length > 0 && d.imageContents[0].mediaType === 2) {
          this.coverViewShow = true
          this.coverSrc = d.imageContents[0].mediaContent
        }
        // this.isOperate = d.classification 运营文章
        let timer = setInterval(() => {
          if ($('.simditor-body')[0] && $('.simditor-placeholder')[0]) {
            $('.simditor-placeholder').css('display', 'none')
            clearInterval(timer)
          }
        }, 30)
        if (d.cover) {
          this.coverViewShow = true
        }
      }
    },
    events: {
      uploadBefore () {
        if (this.coverViewShow) {
          this.coverViewShow = false
        }
        this.coverloadShow = true
        this.overStatus = false
      },
      uploadCoverComplete (data) {
        let self = this
        ImgLoad.load({
          url: [data.cover + '?imageMogr2/thumbnail/x70'],
          afterAll: () => {
            self.overStatus = true
            self.coverloadShow = false
            self.coverViewShow = true
            self.coverSrc = data.cover
            self.checkCover(self.checkNoParamSave)
          }
        })
      },
      uploadFail () {
        this.overStatus = false
      },
      previewSavePost () {
        this.savePost(false)
      },
      previewPublishPost () {
        this.publishPost()
      },
      contentCheck () {
        this.showEditState = false
        this.checkContent(this.checkSave)
      },
      pushBbsId (data) {
        this.bbsId = data.id
        this.checkNoParamSave()
      },
      rich () {
        this.sign = 'rich'
      },
      md () {
        this.sign = 'mkdn'
      }
    },
    created () {
      let hash = window.location.hash
      if (hash && hash === '#update') {
        this.adminUpdate = true
      }
      $('#postSaveBtn').attr({'disabled': 'disabled'})
      this.$route.params.saveStatus = true
      this.$route.params.contentStatus = true
      this.getBbsList()
      const LS_VERIFY = 'fengkou-post-userVerify'
      let userVerify = localStorage.getItem(LS_VERIFY)
      if (!userVerify) {
        this.isVerify = true
      }
      this.isAdmin = localStorage.getItem('is_admin') === '1' ? 1 : 0

      try {
        if (window.saas_electron) {
          this.runEnv = true
        }
      } catch (err) {
        console && console.log(err)
      }
    },
    destroyed () {
      window.onbeforeunload = false
    },
    methods: {
      richEditor () {
        this.$broadcast('rich')
      },
      mkdnEditor () {
        this.$broadcast('markdown')
      },
      checkTitle (fn) {
        this.showEditState = false
        if (!$.trim(this.title)) {
          this.titleTipShow = true
          this.checkStatus = false
        } else {
          this.titleTipShow = false
          this.checkStatus = true
        }
        this.$route.params.contentStatus = this.checkStatus
        fn && fn(this.title)
        return this.checkStatus
      },
      checkContent (fn) {
        let html = $('.simditor-body').html()
        let val = $('.markdown').val()
        this.showEditState = false
        if (html === '<p><br></p>' && val === '') {
          this.contentTipShow = true
          this.checkStatus = false
        } else {
          this.contentTipShow = false
          this.checkStatus = true
        }
        this.$route.params.contentStatus = this.checkStatus
        fn && fn(html)
        return this.checkStatus
      },
      checkCover (fn) {
        this.showEditState = false
        if (!this.coverViewShow) {
          this.coverTipShow = true
          this.checkStatus = false
        } else {
          this.coverTipShow = false
          this.checkStatus = true
        }
        this.$route.params.contentStatus = this.checkStatus
        fn && fn()
        return this.checkStatus
      },
      publishPost (event) {
        let status = window.sessionStorage.getItem('uploadStatus')
        if (status === 'before') {
          alert('请在图片文件上传完毕后发布!')
          return
        }
        if (!this.overStatus) {
          alert('请在封面文件上传完毕后发布!')
          return
        }
        let self = this
        let html = $('.simditor-body').html()
        let data = {}
        if ($('.audioLoading').length) {
          alert('请在音频文件上传完毕后发布!')
          return
        }
        if ($(event.target).hasClass('disabled')) {
          return
        }
        let checkStatus = this.checkTitle() && this.checkContent() && this.checkCover() // && this.checkAuthor()
        if (!checkStatus) {
          this.previewScroll(true)
          // $('body').scrollTop(0)

          let top
          if (!this.checkTitle()) {
            top = $('.error-tip').eq(0).offset().top
          } else if (!this.checkContent()) {
            top = $('.error-tip').eq(1).offset().top
          } else if (!this.checkCover()) {
            top = $('.error-tip').eq(2).offset().top
          }
          $('body').scrollTop(top)

          return
        }
        // 截取正文前54个字符
        let tabloid = html.replace(/<[^>]*>/ig, '').replace(/\&\w+\;/ig, '').substring(0, 54)
        // 删掉结尾多余的空行
        html = html.replace(/(<p><br><\/p>)*$/g, '') + '<p><br></p>'
        if (this.sign === 'mkdn') {
          html = $('.markdown').val()
          html = MarkdownIt().set({
            html: true,
            breaks: true,
            highlight: function (str, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>'
                } catch (__) {}
              }
              return '' // use external default escaping
            }
          }).use(mdExpand).use(mdVideo).render(html)
        }
        let hideMark = html.substr(html.indexOf('<pry'), html.indexOf('</pry>'))
        let sn = self.sign ? self.sign : 'rich'
        let hideSign = '<pry type="new' + sn + '"></pry>'
        if (hideMark) {
          html.replace(hideMark, hideSign)
        } else {
          html = html + hideSign
        }
        let images_url = []
        if (this.coverSrc.replace('http:', '')) {
          images_url.push(this.coverSrc.replace('http:', ''))
        }
        data = {
          post_id: this.editPostId || '',
          bbs_id: 316,
          plate_id: 1,
          title: this.title,
          html: html.replace('http:', ''),
          'images_url': images_url,
          'images_w': new Array(images_url.length).fill(0),
          'images_h': new Array(images_url.length).fill(0),
          content: this.content || tabloid
          // classification: this.isOperate ? 1 : 0     // 是否运营文章
        }
        if (this.bbsId) {
          data['bbs_id'] = this.bbsId
        }
        $('#postPublishBtn').attr({'disabled': 'disabled'})
        Request.post({
          url: '/v3/bbs/publish-article-post',
          data: qs.stringify(data, { arrayFormat: 'brackets', json: true}),
          contentType: 'application/x-www-form-urlencoded'
        }).then((res) => {
          if (+res.code !== 1) {
            alert(data.message)
            $('#postPublishBtn').removeAttr('disabled')
            return
          }
          window.sessionStorage.removeItem('uploadStatus')
          if (self.editData) {
            localStorage.setItem('post-edit-type', 'publish')
            self.showEditState = true
            self.$route.params.saveStatus = self.showEditState
            self._checkWindowStatus()
            self._showSaveTip()
            $('#postPublishBtn').removeAttr('disabled')
            window.close()
          } else {
            self.$route.router.go('/postList')
          }
        })
      },
      tabOperate () {                // 切换运营文章
        this.isOperate = !this.isOperate
      },
      checkFontCount (fn) {
        this.wordCount = (!!this.content && this.content.length) || 0
        fn && fn()
      },
      openPreview () {
        let status_title = !this.checkTitle()
        let status_content = !this.checkContent()
        let status_cover = !this.checkCover()
        if (!this.checkStatus) {
          (status_title && $('body').scrollTop($('.publish-title').offset().top)) ||
          (status_content && $('body').scrollTop($('.simditor').offset().top)) ||
          (status_cover && $('body').scrollTop($('.edit-desc').offset().top))
          return
        }
        let html = document.querySelector('.simditor-body').innerHTML
        // 删掉结尾多余的空行
        html = html.replace(/(<p><br><\/p>)*$/g, '') + '<p><br></p>'
        if (this.sign === 'mkdn') {
          html = $('.markdown').val()
          html = MarkdownIt().set({
            html: true,
            breaks: true,
            highlight: function (str, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>'
                } catch (__) {}
              }
              return '' // use external default escaping
            }
          }).use(mdExpand).use(mdVideo).render(html)
        }
        let hideMark = html.substr(html.indexOf('<pry'), html.indexOf('</pry>'))
        let sn = this.sign ? this.sign : 'rich'
        let hideSign = '<pry type="new' + sn + '"></pry>'
        if (hideMark) {
          html.replace(hideMark, hideSign)
        } else {
          html = html + hideSign
        }
        this.previewData = {
          sign: this.sign,
          title: this.title,
          digest: this.content,
          date: moment().format('YYYY.MM.DD'),
          content: html
        }
        $('.simditor-body').css({'display': 'block', 'overflow-x': 'hidden'})
        this.previewScroll(false)
      },
      savePost (isEdit) {
        let status = window.sessionStorage.getItem('uploadStatus')
        if (status === 'before') {
          alert('请在图片文件上传完毕后保存!')
          return
        }
        if (!this.overStatus) {
          alert('请在封面文件上传完毕后保存!')
          return
        }

        $('#postSaveBtn').attr('disabled', 'disabled')
        // this.$els.postSaveBtn.disabled = true
        let self = this
        let html = $('.simditor-body').html()
        let data = {}
        this.checkTitle()
        if (!this.checkTitle()) {
          return false
        }
        // $('body').scrollTop($('.publish-title').offset().top)
        if (!isEdit || !self.editData) {
          self.previewScroll(true)
        }
        // 删掉结尾多余的空行
        html = html.replace(/(<p><br><\/p>)*$/g, '') + '<p><br></p>'
        if (self.sign === 'mkdn') {
          html = $('.markdown').val()
          html = MarkdownIt().set({
            html: true,
            breaks: true,
            highlight: function (str, lang) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>'
                } catch (__) {}
              }
              return '' // use external default escaping
            }
          }).use(mdExpand).use(mdVideo).render(html)
        }
        let hideMark = html.substr(html.indexOf('<pry'), html.indexOf('</pry>'))
        let sn = self.sign ? self.sign : 'rich'
        let hideSign = '<pry type="new' + sn + '"></pry>'
        if (hideMark) {
          html.replace(hideMark, hideSign)
        } else {
          html = html + hideSign
        }
        let images_url = []
        if (this.coverSrc.replace('http:', '')) {
          images_url.push(this.coverSrc.replace('http:', ''))
        }
        data = {
          bbs_id: 1,
          plate_id: 1,  // 板块
          title: this.title,
          html: html.replace('http:', ''),
          publish_status: 0,
          images_url: images_url,
          content: this.content,
          images_w: new Array(images_url.length).fill(0),
          images_h: new Array(images_url.length).fill(0)
        }
        if (this.editPostId) {
          data['post_id'] = this.editPostId
        }
        if (this.bbsId) {
          data['bbs_id'] = this.bbsId
        }
        Request.post({
          url: '/v3/bbs/draft-article-post',
          data: qs.stringify(data, { arrayFormat: 'brackets', json: true}),
          contentType: 'application/x-www-form-urlencoded'
        }).then((res) => {
          if (+res.code !== 1) {
            console && console.log(res.message)
            return
          }
          window.sessionStorage.removeItem('uploadStatus')
          if (isEdit) {
            self.showEditState = true
            self.$route.params.saveStatus = self.showEditState
            self._checkWindowStatus()
            self._showSaveTip()
            self.editPostId = res.result.id || ''  // 此句是为了让用户在保存完后，不跳转，重新编辑再次保存时，有postID可用
            $('#postSaveBtn').removeAttr('disabled')
            return
          }
          if (self.editData) {
            localStorage.setItem('post-edit-type', 'save')
            self.showEditState = true
            self.$route.params.saveStatus = self.showEditState
            self._checkWindowStatus()
            self._showSaveTip()
            $('#postSaveBtn').removeAttr('disabled')
            window.close()
          } else {
            self.showSaveSuccess = true
            self.saveSuccessText = '保存成功'
            self.editPostId = res.result.id // 此句是为了让用户在保存完后，不跳转，重新编辑再次保存时，有postID可用
            self.showEditState = true
            self.$route.params.saveStatus = self.showEditState
            self._checkWindowStatus()
            setTimeout(() => {
              self.showSaveSuccess = false
              self.$route.router.go('/trash')
            }, 1000)
          }
        })
      },
      toggleHeight () {
        $('.simditor').toggleClass('solidHeight')
        $('.markdown').toggleClass('stuff')
        $('.handle-height i').toggleClass('zk')
        if (this.handleHeightTxt === '收起正文') {
          this.handleHeightTxt = '展开正文'
        } else {
          this.handleHeightTxt = '收起正文'
        }
      },
      previewScroll (bodyScroll) {
        if (bodyScroll) {
          this.showModal = false
          $('body').css('overflow', 'auto')
        } else {
          this.showModal = true
          $('body').css('overflowY', 'hidden')
        }
      },
      getBbsList () {
        let self = this
        Request.get({
          url: '/v3/bbs/list?is_public=1'
        }).then((res) => {
          self.bbsList = res.result
        })
      },
      _checkWindowStatus () {     // 判断window.onbeforeunload方法
        if (this.editData === 'undefined' && !this.runEnv || (!this.showEditState && this.checkStatus && !this.runEnv)) {
          window.onbeforeunload = function (event) {
            event.returnValue = '文章还未保存'
          }
        } else if (!!this.editData || this.showEditState) {
          window.onbeforeunload = false
        }
      },
      checkSave (val) {         // 有参的自动保存
        if (this.adminUpdate) {
          return
        }
        let status = window.sessionStorage.getItem('uploadStatus')
        if (status && status !== 'success') {
          return
        }
        this._checkWindowStatus()
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.lastSaveValue !== val) {
            this.lastSaveValue = val
            this.savePost(true)
            clearInterval(self.timer)
          }
        }, 600)
      },
      checkNoParamSave () {     // 无参的自动保存
        this._checkWindowStatus()
        setTimeout(() => {
          this.savePost(true)
        }, 600)
      },
      _showSaveTip () {         // 自动保存时1.5秒后显示一次提示
        let timer = null
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.showEditState = false
          clearTimeout(timer)
        }, 1500)
      },
      cancel () {
        window.close()
      }
    }
  }
</script>
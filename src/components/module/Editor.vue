<style lang='sass'>
  @import '../../styles/libs/simditor/simditor';
  #editor {
    display: none;
  }
  .glyphicon-music {
    opacity: 0.6;
  }
  .glyphicon-music:hover {
    opacity: 1;
  }
  .menu-on .glyphicon-music{
    opacity: 1;
  }
</style>
<template>
  <textarea class="markdown" placeholder="请在这里输入正文"></textarea>
  <textarea name='' id='editor' cols='30' rows='10'></textarea>

  <div class="see" @click='see'><i class="see-icon"></i>预览正文</div>

  <bootstrap-dialog
  :show-dialog.sync="showDialog"></bootstrap-dialog>

  <alert
  :sign.sync="sign"
  :show-alert.sync="showAlert"
  :alert-content="alertContent"></alert>
</template>

<script>
  import $ from 'jquery'
  import MarkdownIt from 'zjx-markdown-it'
  import Simditor from '../../widgets/simditor'
  import mdExpand from '../../widgets/mdExpand'
  import mdVideo from '../../widgets/mdVideo'
  import { FILE_KEY, TOKEN } from '../../configs/request'
  import BootstrapDialog from '../module/BootstrapDialog'
  import Alert from '../module/Alert'
  import hljs from 'highlight.js'
  import { APP_ENV } from '../../configs/app'

  const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

  export default {
    data () {
      return {
        showDialog: false,
        alertContent: '切换编辑器模式会丢失当前内容，是否继续？',
        init: true,
        showAlert: false
      }
    },
    props: {
      sign: {
        type: String,
        twoWay: true
      },
      html: {
        type: String,
        twoWay: true
      }
    },
    watch: {
      html () {
        let html = this.html
        if (this.sign === 'mkdn') {
          setTimeout(() => {
            this.$dispatch('toMarkdown')
            let toMarkdown = require('to-markdown')
            html = toMarkdown(html)
            $('.markdown').val(html)
          }, 500)
        } else {
          this.$dispatch('toRich')
          let timer = setInterval(() => {
            $('.simditor-body').html(html)
            clearInterval(timer)
          }, 30)
        }
      }
    },
    events: {
      markdown () {
        if ($('.simditor-body').html() !== '<p><br></p>') {
          this.showAlert = true
        } else {
          $('.simditor').hide()
          $('.markdown').show()
          $('.see').show()
          this.sign = 'mkdn'
        }
      },
      toMarkdown () {
        this.sign = 'mkdn'
        $('.simditor').hide()
        $('.markdown').show()
        $('.see').show()
      },
      rich () {
        if ($('.markdown').val() !== '') {
          this.showAlert = true
        } else {
          $('.markdown').hide()
          $('.simditor').show()
          $('.see').hide()
          this.sign = 'rich'
        }
      },
      toRich () {
        this.sign = 'rich'
        $('.markdown').hide()
        $('.simditor').show()
        $('.see').hide()
      }
    },
    ready: function () {
      let self = this
      setTimeout(function () {
        let editor = new Simditor({
          textarea: $('#editor'),
          placeholder: '请在这里输入正文',
          toolbar: ['title', 'bold', 'italic', 'underline', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'strikethrough', 'color', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment', '|', 'audio'],
          pasteImage: true,
          upload: {
            url: `//api-saas${ENV}.tinfinite.com/v3/upload/picture/simditor`,
            token: TOKEN,
            fileKey: FILE_KEY,
            connectionCount: 1,
            leaveConfirm: '正在上传文件，如果离开上传会自动取消?'
          },
          audioUpload: {
            url: `//api-saas${ENV}.tinfinite.com/v3/upload/picture`,
            audioToken: TOKEN,
            fileKey: FILE_KEY
          }
        })
        $('.toolbar-item-audio').addClass('glyphicon glyphicon-music')
        editor.on('valuechanged', function (e, src) {
          self.$dispatch('contentCheck')
        })
      }, 100)
      $('.markdown').bind({
        input: () => {
          let elem = $('.markdown')[0]
          elem.style.height = 'auto'
          elem.scrollTop = 0 // 防抖动
          elem.style.height = elem.scrollHeight + 'px'
          self.$dispatch('contentCheck')
        },
        propertychange: () => {
          let elem = $('.markdown')[0]
          elem.style.height = 'auto'
          elem.scrollTop = 0 // 防抖动
          elem.style.height = elem.scrollHeight + 'px'
          self.$dispatch('contentCheck')
        }
      })
    },
    components: { BootstrapDialog, Alert },
    methods: {
      see () {
        let html = $('.markdown').val()
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
            return ''  // use external default escaping
          }
        }).use(mdExpand).use(mdVideo).render(html)
        this.showDialog = true
        $('.dialog-content').html(html)
        $('body').css('overflow-y', 'hidden')
      }
    }
  }
</script>
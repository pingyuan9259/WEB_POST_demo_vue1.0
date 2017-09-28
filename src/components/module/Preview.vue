<style lang='sass'>
  @import '../../styles/components/module/preview';
  @import '../../styles/libs/simditor/simditor-weixin';
  @import '../../styles/libs/simditor/nongshuoshu-body';
</style>

<template>
  <div class='modal-mask' v-show='show' transition='modal'>
    <div class='modal-wrapper'> <!-- @click='closePreview' -->
    <!--   <div class='switch-preview'>
        <i></i>
        <span>切换到桌面</span>
      </div> -->
      <div class='modal-container modal-h5' style='min-height:{{bodyHeight}}px;'  v-on:click.stop>
        <div class='h5-container'>
          <ul class='preview-nav'>
            <li v-bind:class='{ "active": navContent }' @click='changeMobilePreview("Content")'>消息正文</li>
            <li v-bind:class='{ "active": navMoments }' @click='changeMobilePreview("Moments")'>朋友圈</li>
            <li v-bind:class='{ "active": navChats }' @click='changeMobilePreview("Chats")'>发送给朋友</li>
          </ul>
          <div class='preview-back' @click='closePreview'>返回</div>
          <div class='h5-content chats-con' v-show='showChats'>
            <div class='content-message'>
              <span class='app-team'>{{ iphoneTitle }}团队</span>
              <img class='app-head-img' src='../../public/imgs/iphone_header_1.png' alt=''>
              <img class='chats-logo' :src='logoImg' alt=''>
              <div class='chats-alert'>
                <div class='chats-title'>{{data.title}}</div>
                <img class='chats-cover' :src='logoImg' alt=''>
                <div class='chats-digest'>{{data.digest | default appAddress}}</div>
                <span class="chat_arrow_wrp">
                    <i class="chat_arrow arrow_out"></i>
                    <i class="chat_arrow arrow_in"></i>
                </span>
              </div>
            </div>
          </div>

          <div class='h5-content content-con' v-show='showContent'>
            <div class='content-message'>
              <span class='app-team'>{{data.title}}</span>
              <img class='app-head-img' src='../../public/imgs/iphone_header_3.png' alt=''>
              <div class='content-context'>
                <div class='content-wrap'>
                  <div class='content-title'>{{data.title}}</div>
                  <div class='content-datetime'>{{data.date}} <span class="content-author">{{data.author}}</span></div>
                  <div class='simditor simditor-mac'>
                    <div class='content-body simditor-body' v-html='data.content'></div>
                  </div>
                  <div class="mkdn">
                    <div class="nongshuoshu-body" v-html='data.content'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class='h5-content moments-con' v-show='showMoments'>
            <div class='content-message'>
              <span class='app-team'>朋友圈</span>
              <img class='app-head-img' src='../../public/imgs/iphone_header_2.png' alt=''>
              <img class='moments-logo' :src='logoImg' alt=''>
              <div class='moments-context'>
                <span class='moments-sender'>{{ iphoneTitle }}团队</span>
                <div class='moments-alert'>
                  <img class='moments-cover' :src='logoImg' alt=''>
                  <div class='moments-digest'>{{data.title}}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- <div class='modal-container modal-pc' style='min-height:{{bodyHeight}}px;' v-on:click.stop>
        <div class='modal-header'>
          <div class='post-title'>{{data.title}}</div>
          <span class='post-datetime'>{{data.date}}</span> <span class='post-author'>{{data.author}}</span>
          <div class='post-digest' v-show='!!data.digest'>摘要：{{data.digest}}</div>
        </div>

        <div class='modal-body simditor-body' v-html='data.content'></div>

        <div class='modal-footer'>
          <a href='javascript:void(0)' class='close-preview' @click='closePreview'>返回</a><a href='javascript:void(0)' class='post-save' @click='savePost'>保存</a><a href='javascript:void(0)' class='post-publish' @click='publishPost'>发布</a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { APP_KEY } from '../../configs/app'
  import APP_MAP from '../../configs/appMap'

  export default {
    data () {
      return {
        bodyHeight: $(window).height(),
        iphoneTitle: APP_MAP[APP_KEY].name,
        logoImg: APP_MAP[APP_KEY].headerLogo,
        appAddress: APP_MAP[APP_KEY].appAddress,

        showContent: true,
        showMoments: false,
        showChats: false,

        navContent: true,
        navMoments: false,
        navChats: false,

        typeMobilePreview: ['Content', 'Moments', 'Chats']
      }
    },
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      data: { // 预览数据
        type: Object,
        required: true,
        twoWay: true
      }
    },
    watch: {
      data () {
        let html = this.data.content
        let sign = this.data.sign
        let sig = html.substr(html.length - 15, 3)
        if (sig === 'new') {
          if (sign === 'mkdn') {
            $('.mkdn').show()
          } else {
            $('.content-body').removeClass('simditor-body')
            $('.content-body').addClass('nongshuoshu-body')
          }
        } else {
          $('.content-body').removeClass('nongshuoshu-body')
          $('.content-body').addClass('simditor-body')
        }
      }
    },
    methods: {
      closePreview: function () {
        this.show = false
        document.body.style.overflow = 'auto'
      },
      // savePost () {
      //   this.$dispatch('previewSavePost')
      // },
      // publishPost () {
      //   this.$dispatch('previewPublishPost', {})
      // },
      changeMobilePreview (name) {
        for (let v of this.typeMobilePreview) {
          let flag = v === name
          this['nav' + v] = flag
          this['show' + v] = flag
        }
      }
    }
  }
</script>